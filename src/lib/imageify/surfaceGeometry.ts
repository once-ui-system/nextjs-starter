import * as THREE from "three";
import type { ImageifySettings } from "./geometry";

export function createImageifySurface(pixels: ImageData, settings: ImageifySettings) {
  const aspect = pixels.width / pixels.height;
  const requestedSamples = Math.max(2, Math.min(2048, Math.round(settings.detail)));
  let columns = aspect >= 1 ? Math.min(pixels.width, requestedSamples) : Math.max(2, Math.round(requestedSamples * aspect));
  let rows = aspect >= 1 ? Math.min(pixels.height, Math.max(2, Math.round(columns / aspect))) : Math.min(pixels.height, requestedSamples);
  if (aspect < 1) columns = Math.min(pixels.width, Math.max(2, Math.round(rows * aspect)));
  const maxCells = 100_000;
  if (columns * rows > maxCells) {
    const scale = Math.sqrt(maxCells / (columns * rows));
    columns = Math.max(2, Math.floor(columns * scale));
    rows = Math.max(2, Math.floor(rows * scale));
  }

  const modelWidth = settings.width;
  const modelDepth = modelWidth / aspect;
  const cellWidth = modelWidth / columns;
  const cellDepth = modelDepth / rows;
  const vertexColumns = columns + 1;
  const vertexRows = rows + 1;
  const vertexCount = vertexColumns * vertexRows;
  const topPositions = new Float32Array(vertexCount * 3);
  const topColors = new Float32Array(vertexCount * 3);
  const heights = new Float32Array(vertexCount);
  const color = new THREE.Color();
  const sampledPixel = new Float32Array(4);
  const averagedPixel = new Float32Array(4);

  function samplePixel(x: number, y: number) {
    x = THREE.MathUtils.clamp(x, 0, pixels.width - 1);
    y = THREE.MathUtils.clamp(y, 0, pixels.height - 1);
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const x1 = Math.min(pixels.width - 1, x0 + 1);
    const y1 = Math.min(pixels.height - 1, y0 + 1);
    const xBlend = x - x0;
    const yBlend = y - y0;
    const topLeft = (y0 * pixels.width + x0) * 4;
    const topRight = (y0 * pixels.width + x1) * 4;
    const bottomLeft = (y1 * pixels.width + x0) * 4;
    const bottomRight = (y1 * pixels.width + x1) * 4;
    for (let channel = 0; channel < 4; channel++) {
      const top = pixels.data[topLeft + channel] * (1 - xBlend) + pixels.data[topRight + channel] * xBlend;
      const bottom = pixels.data[bottomLeft + channel] * (1 - xBlend) + pixels.data[bottomRight + channel] * xBlend;
      sampledPixel[channel] = top * (1 - yBlend) + bottom * yBlend;
    }
  }

  function sampleArea(x: number, y: number) {
    const radiusX = (pixels.width - 1) / columns;
    const radiusY = (pixels.height - 1) / rows;
    averagedPixel.fill(0);
    for (let sampleY = 0; sampleY < 5; sampleY++) {
      for (let sampleX = 0; sampleX < 5; sampleX++) {
        samplePixel(x + (sampleX / 2 - 1) * radiusX, y + (sampleY / 2 - 1) * radiusY);
        for (let channel = 0; channel < 4; channel++) averagedPixel[channel] += sampledPixel[channel] / 25;
      }
    }
  }

  for (let row = 0; row <= rows; row++) {
    const sourceY = row * (pixels.height - 1) / rows;
    const z = modelDepth / 2 - row * cellDepth;
    for (let column = 0; column <= columns; column++) {
      const sourceX = column * (pixels.width - 1) / columns;
      sampleArea(sourceX, sourceY);
      const alpha = averagedPixel[3] / 255;
      const red = averagedPixel[0] * alpha + 245 * (1 - alpha);
      const green = averagedPixel[1] * alpha + 245 * (1 - alpha);
      const blue = averagedPixel[2] * alpha + 245 * (1 - alpha);
      const brightness = (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255;
      const index = row * vertexColumns + column;
      topPositions[index * 3] = -modelWidth / 2 + column * cellWidth;
      const relief = (settings.invert ? 1 - brightness : brightness) * alpha;
      topPositions[index * 3 + 1] = settings.baseThickness + relief * settings.reliefHeight;
      topPositions[index * 3 + 2] = z;
      heights[index] = topPositions[index * 3 + 1];
      color.setRGB(red / 255, green / 255, blue / 255, THREE.SRGBColorSpace);
      topColors[index * 3] = color.r;
      topColors[index * 3 + 1] = color.g;
      topColors[index * 3 + 2] = color.b;
    }
  }

  const visible = new Uint8Array(columns * rows);
  let visibleCells = 0;
  let boundaryEdges = 0;
  for (let row = 0; row < rows; row++) {
    const sourceY = (row + 0.5) * (pixels.height - 1) / rows;
    for (let column = 0; column < columns; column++) {
      const sourceX = (column + 0.5) * (pixels.width - 1) / columns;
      sampleArea(sourceX, sourceY);
      const index = row * columns + column;
      const opaque = averagedPixel[3] > 8;
      visible[index] = opaque ? 1 : 0;
    }
  }

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const index = row * columns + column;
      if (!visible[index]) continue;
      visibleCells++;
      if (row === 0 || !visible[index - columns]) boundaryEdges++;
      if (row === rows - 1 || !visible[index + columns]) boundaryEdges++;
      if (column === 0 || !visible[index - 1]) boundaryEdges++;
      if (column === columns - 1 || (column < columns - 1 && !visible[index + 1])) boundaryEdges++;
    }
  }

  if (!visibleCells) throw new Error("Background removal removed the entire image.");

  const topIndices = new Uint32Array(visibleCells * 6);
  const backTriangleCount = visibleCells * 2;
  const wallTriangleCount = boundaryEdges * 2;
  const backAndWallPositions = new Float32Array((backTriangleCount + wallTriangleCount) * 9);
  const backAndWallColors = new Float32Array((backTriangleCount + wallTriangleCount) * 9);
  let indexOffset = 0;
  let bodyOffset = 0;
  const backColor = new THREE.Color("#d8e2d8");

  function bodyTriangle(points: Array<[number, number, number]>, vertexColors: Array<[number, number, number]>) {
    for (let vertex = 0; vertex < 3; vertex++) {
      const positionOffset = bodyOffset * 3;
      backAndWallPositions[positionOffset] = points[vertex][0];
      backAndWallPositions[positionOffset + 1] = points[vertex][1];
      backAndWallPositions[positionOffset + 2] = points[vertex][2];
      backAndWallColors[positionOffset] = vertexColors[vertex][0];
      backAndWallColors[positionOffset + 1] = vertexColors[vertex][1];
      backAndWallColors[positionOffset + 2] = vertexColors[vertex][2];
      bodyOffset++;
    }
  }

  function bodyQuad(points: Array<[number, number, number]>, vertexColors: Array<[number, number, number]>) {
    bodyTriangle([points[0], points[2], points[1]], [vertexColors[0], vertexColors[2], vertexColors[1]]);
    bodyTriangle([points[0], points[3], points[2]], [vertexColors[0], vertexColors[3], vertexColors[2]]);
  }

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const cell = row * columns + column;
      if (!visible[cell]) continue;
      const topLeft = row * vertexColumns + column;
      const topRight = topLeft + 1;
      const bottomLeft = topLeft + vertexColumns;
      const bottomRight = bottomLeft + 1;
      topIndices[indexOffset++] = topLeft;
      topIndices[indexOffset++] = topRight;
      topIndices[indexOffset++] = bottomRight;
      topIndices[indexOffset++] = topLeft;
      topIndices[indexOffset++] = bottomRight;
      topIndices[indexOffset++] = bottomLeft;

      const positions = [topLeft, topRight, bottomRight, bottomLeft].map((vertex) => [
        topPositions[vertex * 3],
        topPositions[vertex * 3 + 1],
        topPositions[vertex * 3 + 2],
      ] as [number, number, number]);
      const colors = [topLeft, topRight, bottomRight, bottomLeft].map((vertex) => [
        topColors[vertex * 3],
        topColors[vertex * 3 + 1],
        topColors[vertex * 3 + 2],
      ] as [number, number, number]);
      const bottomPositions = positions.map(([x, _y, z]) => [x, 0, z] as [number, number, number]);
      const baseVertexColor: [number, number, number] = [backColor.r, backColor.g, backColor.b];
      bodyQuad(bottomPositions, [baseVertexColor, baseVertexColor, baseVertexColor, baseVertexColor]);

      const isBoundary = (direction: "top" | "bottom" | "left" | "right") => {
        if (direction === "top") return row === 0 || !visible[cell - columns];
        if (direction === "bottom") return row === rows - 1 || !visible[cell + columns];
        if (direction === "left") return column === 0 || !visible[cell - 1];
        return column === columns - 1 || !visible[cell + 1];
      };
      const wallColor: [number, number, number] = [0, 1, 2].map((channel) =>
        colors.reduce((total, vertexColor) => total + vertexColor[channel], 0) / colors.length * 0.76,
      ) as [number, number, number];
      const edge = (first: number, second: number) => {
        const firstTop = positions[first];
        const secondTop = positions[second];
        const firstBottom: [number, number, number] = [firstTop[0], 0, firstTop[2]];
        const secondBottom: [number, number, number] = [secondTop[0], 0, secondTop[2]];
        const sidePoints = [firstBottom, secondBottom, secondTop, firstTop];
        bodyTriangle([sidePoints[0], sidePoints[1], sidePoints[2]], [wallColor, wallColor, wallColor]);
        bodyTriangle([sidePoints[0], sidePoints[2], sidePoints[3]], [wallColor, wallColor, wallColor]);
      };
      if (isBoundary("top")) edge(0, 1);
      if (isBoundary("right")) edge(1, 2);
      if (isBoundary("bottom")) edge(2, 3);
      if (isBoundary("left")) edge(3, 0);
    }
  }

  const surfaceGeometry = new THREE.BufferGeometry();
  surfaceGeometry.setAttribute("position", new THREE.BufferAttribute(topPositions, 3));
  surfaceGeometry.setAttribute("color", new THREE.BufferAttribute(topColors, 3));
  surfaceGeometry.setIndex(new THREE.BufferAttribute(topIndices, 1));
  surfaceGeometry.computeVertexNormals();

  const bodyGeometry = new THREE.BufferGeometry();
  bodyGeometry.setAttribute("position", new THREE.BufferAttribute(backAndWallPositions, 3));
  bodyGeometry.setAttribute("color", new THREE.BufferAttribute(backAndWallColors, 3));
  bodyGeometry.computeVertexNormals();

  const group = new THREE.Group();
  group.add(new THREE.Mesh(surfaceGeometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.78, metalness: 0 })));
  group.add(new THREE.Mesh(bodyGeometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.78, metalness: 0 })));
  const bounds = new THREE.Box3().setFromObject(group);
  const dimensions = bounds.getSize(new THREE.Vector3());
  const triangleCount = topIndices.length / 3 + backAndWallPositions.length / 9;
  return { group, dimensions, triangleCount, gridSize: { columns, rows } };
}