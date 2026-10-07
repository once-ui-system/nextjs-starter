import * as THREE from "three";
import type { ImageifySettings } from "./geometry";

type ColorSample = { red: number; green: number; blue: number; count: number };
type Point = { x: number; y: number };
type Edge = { start: number; end: number; direction: number };

const transparentLabel = 65535;
function colorBucket(red: number, green: number, blue: number) {
  return ((red >> 4) << 8) | ((green >> 4) << 4) | (blue >> 4);
}

function mergeSimilarColors(samples: Map<number, ColorSample>, threshold: number) {
  const entries = [...samples.entries()].sort((first, second) => second[1].count - first[1].count);
  const palette: ColorSample[] = [];
  const colorByBucket = new Map<number, number>();
  const thresholdSquared = (threshold * Math.sqrt(3)) ** 2;

  for (const [key, sample] of entries) {
    let nearestIndex = -1;
    let nearestDistance = thresholdSquared;
    for (let index = 0; index < palette.length; index++) {
      const representative = palette[index];
      const redDelta = sample.red - representative.red;
      const greenDelta = sample.green - representative.green;
      const blueDelta = sample.blue - representative.blue;
      const distance = redDelta ** 2 + greenDelta ** 2 + blueDelta ** 2;
      if (distance <= nearestDistance) {
        nearestIndex = index;
        nearestDistance = distance;
      }
    }

    if (nearestIndex < 0) {
      nearestIndex = palette.length;
      palette.push({ ...sample });
    } else {
      const representative = palette[nearestIndex];
      const count = representative.count + sample.count;
      representative.red =
        (representative.red * representative.count + sample.red * sample.count) / count;
      representative.green =
        (representative.green * representative.count + sample.green * sample.count) / count;
      representative.blue =
        (representative.blue * representative.count + sample.blue * sample.count) / count;
      representative.count = count;
    }
    colorByBucket.set(key, nearestIndex);
  }

  return { palette, colorByBucket };
}

function reduceSmallPartsAndHoles(
  labels: Uint16Array,
  columns: number,
  rows: number,
  reduction: ImageifySettings["holePartReduction"],
) {
  if (reduction === "none") return;
  const minArea = Math.max(
    reduction === "auto" ? 4 : 2,
    Math.ceil(labels.length / (reduction === "auto" ? 65_536 : 262_144)),
  );
  const queue = new Int32Array(labels.length);
  const visited = new Uint8Array(labels.length);
  const getNeighbors = (index: number) => {
    const x = index % columns;
    const neighbors: number[] = [];
    if (x > 0) neighbors.push(index - 1);
    if (x + 1 < columns) neighbors.push(index + 1);
    if (index >= columns) neighbors.push(index - columns);
    if (index + columns < labels.length) neighbors.push(index + columns);
    return neighbors;
  };
  const mostCommonAdjacentColor = (cells: number[], label: number) => {
    const counts = new Map<number, number>();
    for (const cell of cells) {
      for (const neighbor of getNeighbors(cell)) {
        const neighborLabel = labels[neighbor];
        if (neighborLabel === label || neighborLabel === transparentLabel) continue;
        counts.set(neighborLabel, (counts.get(neighborLabel) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort((first, second) => second[1] - first[1])[0]?.[0];
  };
  const partUpdates: Array<[number, number]> = [];

  for (let seed = 0; seed < labels.length; seed++) {
    const label = labels[seed];
    if (visited[seed] || label === transparentLabel) continue;
    let head = 0;
    let tail = 0;
    queue[tail++] = seed;
    visited[seed] = 1;
    while (head < tail) {
      const index = queue[head++];
      for (const neighbor of getNeighbors(index)) {
        if (visited[neighbor] || labels[neighbor] !== label) continue;
        visited[neighbor] = 1;
        queue[tail++] = neighbor;
      }
    }
    if (tail >= minArea) continue;
    const cells = Array.from(queue.subarray(0, tail));
    const adjacentColor = mostCommonAdjacentColor(cells, label) ?? transparentLabel;
    for (const cell of cells) partUpdates.push([cell, adjacentColor]);
  }
  for (const [index, label] of partUpdates) labels[index] = label;

  visited.fill(0);
  const holeUpdates: Array<[number, number]> = [];
  for (let seed = 0; seed < labels.length; seed++) {
    if (visited[seed] || labels[seed] !== transparentLabel) continue;
    let head = 0;
    let tail = 0;
    let touchesBorder = false;
    queue[tail++] = seed;
    visited[seed] = 1;
    while (head < tail) {
      const index = queue[head++];
      const x = index % columns;
      const y = Math.floor(index / columns);
      if (x === 0 || x === columns - 1 || y === 0 || y === rows - 1) touchesBorder = true;
      for (const neighbor of getNeighbors(index)) {
        if (visited[neighbor] || labels[neighbor] !== transparentLabel) continue;
        visited[neighbor] = 1;
        queue[tail++] = neighbor;
      }
    }
    if (touchesBorder || tail >= minArea) continue;
    const cells = Array.from(queue.subarray(0, tail));
    const adjacentColor = mostCommonAdjacentColor(cells, transparentLabel);
    if (adjacentColor === undefined) continue;
    for (const cell of cells) holeUpdates.push([cell, adjacentColor]);
  }
  for (const [index, label] of holeUpdates) labels[index] = label;
}

function snapLoop(loop: Point[], snapDistance: number, snapMode: ImageifySettings["snapVertices"]) {
  if (loop.length < 4 || snapDistance <= 0 || snapMode === "none") return loop;
  let startIndex = 0;
  let farthestDistance = 0;
  for (let index = 1; index < loop.length; index++) {
    const dx = loop[index].x - loop[0].x;
    const dy = loop[index].y - loop[0].y;
    const distance = dx * dx + dy * dy;
    if (distance > farthestDistance) {
      farthestDistance = distance;
      startIndex = index;
    }
  }
  const ordered = [...loop.slice(startIndex), ...loop.slice(0, startIndex)];
  const snapped: Point[] = [];
  const snapDistanceSquared = snapDistance * snapDistance;
  let index = 0;
  while (index < ordered.length) {
    const groupStart = index;
    const anchor = ordered[index];
    let totalX = 0;
    let totalY = 0;
    let count = 0;
    while (index < ordered.length && count < Math.ceil(snapDistance * 2)) {
      const point = ordered[index];
      const dx = point.x - anchor.x;
      const dy = point.y - anchor.y;
      if (count > 0 && dx * dx + dy * dy > snapDistanceSquared) break;
      totalX += point.x;
      totalY += point.y;
      count++;
      index++;
    }
    const average = { x: totalX / count, y: totalY / count };
    if (snapMode === "average") {
      snapped.push(average);
    } else {
      let nearest = ordered[groupStart];
      let nearestDistance = Number.POSITIVE_INFINITY;
      for (let pointIndex = groupStart; pointIndex < index; pointIndex++) {
        const point = ordered[pointIndex];
        const dx = point.x - average.x;
        const dy = point.y - average.y;
        const distance = dx * dx + dy * dy;
        if (distance < nearestDistance) {
          nearest = point;
          nearestDistance = distance;
        }
      }
      snapped.push(nearest);
    }
  }
  return snapped.length >= 3 ? snapped : loop;
}

function smoothLoop(loop: Point[], smoothing: number) {
  if (loop.length < 3 || smoothing <= 0) return loop;
  return loop.map((point, index) => {
    const previous = loop[(index + loop.length - 1) % loop.length];
    const next = loop[(index + 1) % loop.length];
    return {
      x: point.x * (1 - smoothing) + (previous.x + next.x) * 0.5 * smoothing,
      y: point.y * (1 - smoothing) + (previous.y + next.y) * 0.5 * smoothing,
    };
  });
}

function simplifyOpenPath(points: Point[], tolerance: number): Point[] {
  if (points.length <= 2) return points;
  const first = points[0];
  const last = points[points.length - 1];
  const dx = last.x - first.x;
  const dy = last.y - first.y;
  const lengthSquared = dx * dx + dy * dy;
  let furthestIndex = 0;
  let furthestDistance = 0;
  for (let index = 1; index < points.length - 1; index++) {
    const point = points[index];
    const projection =
      lengthSquared === 0
        ? 0
        : THREE.MathUtils.clamp(
            ((point.x - first.x) * dx + (point.y - first.y) * dy) / lengthSquared,
            0,
            1,
          );
    const distanceX = point.x - (first.x + projection * dx);
    const distanceY = point.y - (first.y + projection * dy);
    const distance = distanceX * distanceX + distanceY * distanceY;
    if (distance > furthestDistance) {
      furthestDistance = distance;
      furthestIndex = index;
    }
  }
  if (furthestDistance <= tolerance * tolerance) return [first, last];
  const left = simplifyOpenPath(points.slice(0, furthestIndex + 1), tolerance);
  const right = simplifyOpenPath(points.slice(furthestIndex), tolerance);
  return [...left.slice(0, -1), ...right];
}

function simplifyLoop(loop: Point[], tolerance: number) {
  if (loop.length <= 4 || tolerance <= 0) return loop;
  let farthestIndex = 1;
  let farthestDistance = 0;
  for (let index = 1; index < loop.length; index++) {
    const dx = loop[index].x - loop[0].x;
    const dy = loop[index].y - loop[0].y;
    const distance = dx * dx + dy * dy;
    if (distance > farthestDistance) {
      farthestDistance = distance;
      farthestIndex = index;
    }
  }
  const closed = [...loop, loop[0]];
  const firstPath = simplifyOpenPath(closed.slice(0, farthestIndex + 1), tolerance);
  const secondPath = simplifyOpenPath(closed.slice(farthestIndex), tolerance);
  const simplified = [...firstPath.slice(0, -1), ...secondPath.slice(0, -1)];
  return simplified.length >= 3 ? simplified : loop;
}

function signedArea(loop: Point[]) {
  let area = 0;
  for (let index = 0; index < loop.length; index++) {
    const current = loop[index];
    const next = loop[(index + 1) % loop.length];
    area += current.x * next.y - next.x * current.y;
  }
  return area / 2;
}

function pointInLoop(point: Point, loop: Point[]) {
  let inside = false;
  for (let index = 0, previous = loop.length - 1; index < loop.length; previous = index++) {
    const currentPoint = loop[index];
    const previousPoint = loop[previous];
    const intersects =
      currentPoint.y > point.y !== previousPoint.y > point.y &&
      point.x <
        ((previousPoint.x - currentPoint.x) * (point.y - currentPoint.y)) /
          (previousPoint.y - currentPoint.y) +
          currentPoint.x;
    if (intersects) inside = !inside;
  }
  return inside;
}

function getContours(
  componentMap: Int32Array,
  componentId: number,
  columns: number,
  rows: number,
  cells: number[],
  start: number,
  end: number,
) {
  const vertexColumns = columns + 1;
  const edges: Edge[] = [];
  const outgoing = new Map<number, number[]>();
  const addEdge = (start: number, end: number, direction: number) => {
    const edgeIndex = edges.length;
    edges.push({ start, end, direction });
    const candidates = outgoing.get(start) ?? [];
    candidates.push(edgeIndex);
    outgoing.set(start, candidates);
  };

  for (let cellOffset = start; cellOffset < end; cellOffset++) {
    const index = cells[cellOffset];
    const x = index % columns;
    const y = Math.floor(index / columns);
    const topLeft = y * vertexColumns + x;
    const topRight = topLeft + 1;
    const bottomLeft = topLeft + vertexColumns;
    const bottomRight = bottomLeft + 1;
    if (y === 0 || componentMap[index - columns] !== componentId) addEdge(topLeft, topRight, 0);
    if (x === columns - 1 || componentMap[index + 1] !== componentId)
      addEdge(topRight, bottomRight, 1);
    if (y === rows - 1 || componentMap[index + columns] !== componentId)
      addEdge(bottomRight, bottomLeft, 2);
    if (x === 0 || componentMap[index - 1] !== componentId) addEdge(bottomLeft, topLeft, 3);
  }

  const used = new Uint8Array(edges.length);
  const loops: Point[][] = [];
  for (let edgeIndex = 0; edgeIndex < edges.length; edgeIndex++) {
    if (used[edgeIndex]) continue;
    const loop: Point[] = [];
    let currentEdge = edgeIndex;
    const startVertex = edges[currentEdge].start;
    while (!used[currentEdge]) {
      const edge = edges[currentEdge];
      used[currentEdge] = 1;
      loop.push({ x: edge.start % vertexColumns, y: Math.floor(edge.start / vertexColumns) });
      if (edge.end === startVertex) break;
      const candidates = (outgoing.get(edge.end) ?? []).filter((candidate) => !used[candidate]);
      if (!candidates.length) break;
      const turnPriority = [1, 0, 3, 2];
      currentEdge = candidates.reduce((best, candidate) => {
        const turn = (edges[candidate].direction - edge.direction + 4) % 4;
        const bestTurn = (edges[best].direction - edge.direction + 4) % 4;
        return turnPriority.indexOf(turn) < turnPriority.indexOf(bestTurn) ? candidate : best;
      });
    }
    if (loop.length >= 3) loops.push(loop);
  }
  return loops;
}

export function createImageifyExtrusion(pixels: ImageData, settings: ImageifySettings) {
  const aspect = pixels.width / pixels.height;
  const requestedSamples = Math.max(32, Math.min(10_000, Math.round(settings.detail)));
  let columns =
    aspect >= 1
      ? Math.min(pixels.width, requestedSamples)
      : Math.max(2, Math.round(requestedSamples * aspect));
  let rows =
    aspect >= 1
      ? Math.min(pixels.height, Math.max(2, Math.round(columns / aspect)))
      : Math.min(pixels.height, requestedSamples);
  if (aspect < 1) columns = Math.min(pixels.width, Math.max(2, Math.round(rows * aspect)));
  const maxCells = 4_000_000;
  if (columns * rows > maxCells) {
    const scale = Math.sqrt(maxCells / (columns * rows));
    columns = Math.max(2, Math.floor(columns * scale));
    rows = Math.max(2, Math.floor(rows * scale));
  }

  const labels = new Uint16Array(columns * rows);
  labels.fill(transparentLabel);
  const colors = new Map<number, ColorSample>();
  for (let y = 0; y < rows; y++) {
    const sourceY = Math.min(pixels.height - 1, Math.floor(((y + 0.5) * pixels.height) / rows));
    for (let x = 0; x < columns; x++) {
      const sourceX = Math.min(pixels.width - 1, Math.floor(((x + 0.5) * pixels.width) / columns));
      const sourceOffset = (sourceY * pixels.width + sourceX) * 4;
      if (pixels.data[sourceOffset + 3] < 96) continue;
      const red = pixels.data[sourceOffset];
      const green = pixels.data[sourceOffset + 1];
      const blue = pixels.data[sourceOffset + 2];
      const key = colorBucket(red, green, blue);
      const sample = colors.get(key) ?? { red: 0, green: 0, blue: 0, count: 0 };
      const count = sample.count + 1;
      sample.red += (red - sample.red) / count;
      sample.green += (green - sample.green) / count;
      sample.blue += (blue - sample.blue) / count;
      sample.count = count;
      colors.set(key, sample);
    }
  }
  if (!colors.size) throw new Error("Background removal removed the entire image.");

  const { palette, colorByBucket } = mergeSimilarColors(colors, settings.mergeSimilarColors);
  for (let y = 0; y < rows; y++) {
    const sourceY = Math.min(pixels.height - 1, Math.floor(((y + 0.5) * pixels.height) / rows));
    for (let x = 0; x < columns; x++) {
      const sourceX = Math.min(pixels.width - 1, Math.floor(((x + 0.5) * pixels.width) / columns));
      const sourceOffset = (sourceY * pixels.width + sourceX) * 4;
      if (pixels.data[sourceOffset + 3] < 96) continue;
      const key = colorBucket(
        pixels.data[sourceOffset],
        pixels.data[sourceOffset + 1],
        pixels.data[sourceOffset + 2],
      );
      labels[y * columns + x] = colorByBucket.get(key) ?? transparentLabel;
    }
  }
  reduceSmallPartsAndHoles(labels, columns, rows, settings.holePartReduction);

  const componentMap = new Int32Array(labels.length);
  componentMap.fill(-1);
  const queue = new Int32Array(labels.length);
  const componentColors: number[] = [];
  const componentCells: number[] = [];
  const componentOffsets = [0];
  for (let seed = 0; seed < labels.length; seed++) {
    if (labels[seed] === transparentLabel || componentMap[seed] !== -1) continue;
    const componentId = componentColors.length;
    const colorIndex = labels[seed];
    let head = 0;
    let tail = 0;
    queue[tail++] = seed;
    componentMap[seed] = componentId;
    while (head < tail) {
      const index = queue[head++];
      const x = index % columns;
      const addNeighbor = (neighbor: number) => {
        if (componentMap[neighbor] !== -1 || labels[neighbor] !== colorIndex) return;
        componentMap[neighbor] = componentId;
        queue[tail++] = neighbor;
      };
      if (x > 0) addNeighbor(index - 1);
      if (x < columns - 1) addNeighbor(index + 1);
      if (index >= columns) {
        addNeighbor(index - columns);
        if (x > 0) addNeighbor(index - columns - 1);
        if (x < columns - 1) addNeighbor(index - columns + 1);
      }
      if (index < labels.length - columns) {
        addNeighbor(index + columns);
        if (x > 0) addNeighbor(index + columns - 1);
        if (x < columns - 1) addNeighbor(index + columns + 1);
      }
    }
    for (let index = 0; index < tail; index++) componentCells.push(queue[index]);
    componentColors.push(colorIndex);
    componentOffsets.push(componentCells.length);
  }

  const modelWidth = settings.width;
  const modelDepth = modelWidth / aspect;
  const cellWidth = modelWidth / columns;
  const cellDepth = modelDepth / rows;
  const topY = settings.baseThickness;
  const snapTolerance = (settings.snapDistance * columns) / 400;
  const group = new THREE.Group();
  let triangleCount = 0;

  for (let componentId = 0; componentId < componentColors.length; componentId++) {
    const contours = getContours(
      componentMap,
      componentId,
      columns,
      rows,
      componentCells,
      componentOffsets[componentId],
      componentOffsets[componentId + 1],
    )
      .map((loop) => smoothLoop(loop, settings.outlineSmoothing))
      .map((loop) => snapLoop(loop, snapTolerance, settings.snapVertices))
      .map((loop) => simplifyLoop(loop, (settings.outlineSimplification * columns) / 1000));
    const outers = contours.filter((contour) => signedArea(contour) > 0);
    const holes = contours.filter((contour) => signedArea(contour) < 0);
    const regionColor = new THREE.Color().setRGB(
      palette[componentColors[componentId]].red / 255,
      palette[componentColors[componentId]].green / 255,
      palette[componentColors[componentId]].blue / 255,
      THREE.SRGBColorSpace,
    );
    const regions = outers.map((outer) => ({ outer, holes: [] as Point[][] }));
    for (const hole of holes) {
      const owner = regions
        .filter((region) => pointInLoop(hole[0], region.outer))
        .sort(
          (first, second) => Math.abs(signedArea(first.outer)) - Math.abs(signedArea(second.outer)),
        )[0];
      owner?.holes.push(hole);
    }

    const positions: number[] = [];
    const appendVertex = (point: Point, y: number) => {
      positions.push(
        -modelWidth / 2 + point.x * cellWidth,
        y,
        modelDepth / 2 - point.y * cellDepth,
      );
    };
    const appendTriangle = (
      first: [Point, number],
      second: [Point, number],
      third: [Point, number],
    ) => {
      appendVertex(first[0], first[1]);
      appendVertex(second[0], second[1]);
      appendVertex(third[0], third[1]);
      triangleCount++;
    };

    for (const region of regions) {
      const rings = [region.outer, ...region.holes];
      const vertices = rings.flat();
      const contour = region.outer.map((point) => new THREE.Vector2(point.x, -point.y));
      const holeVectors = region.holes.map((hole) =>
        hole.map((point) => new THREE.Vector2(point.x, -point.y)),
      );
      const faces = THREE.ShapeUtils.triangulateShape(contour, holeVectors);
      for (const face of faces) {
        const first = vertices[face[0]];
        const second = vertices[face[1]];
        const third = vertices[face[2]];
        const area =
          (second.x - first.x) * (third.y - first.y) - (second.y - first.y) * (third.x - first.x);
        if (area > 0) {
          appendTriangle([first, topY], [second, topY], [third, topY]);
          appendTriangle([first, 0], [third, 0], [second, 0]);
        } else {
          appendTriangle([first, topY], [third, topY], [second, topY]);
          appendTriangle([first, 0], [second, 0], [third, 0]);
        }
      }

      for (const ring of rings) {
        for (let index = 0; index < ring.length; index++) {
          const first = ring[index];
          const second = ring[(index + 1) % ring.length];
          appendTriangle([first, 0], [second, 0], [second, topY]);
          appendTriangle([first, 0], [second, topY], [first, topY]);
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    group.add(new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: regionColor })));
  }

  if (!componentColors.length) throw new Error("Background removal removed the entire image.");
  const bounds = new THREE.Box3().setFromObject(group);
  return {
    group,
    dimensions: bounds.getSize(new THREE.Vector3()),
    triangleCount,
    gridSize: { columns, rows },
  };
}
