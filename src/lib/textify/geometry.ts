import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { shapeText } from "./harfbuzz";
import type { TextifyFont } from "./harfbuzz";

export type TextShape = "text" | "support" | "negative" | "vertical";
export type TextAlign = "left" | "center" | "right";
export type VerticalAlign = "default" | "top" | "bottom";
export type HandleType = "none" | "hole" | "handle";
export type HandlePosition = "top" | "bottom" | "left" | "right";
export type ModelOutputMode = "solid" | "separate";
export type TextGeometryStyles = { underline?: boolean; syntheticBold?: boolean; syntheticItalic?: boolean };

export type TextifySettings = {
  text: string;
  size: number;
  height: number;
  spacing: number;
  vSpacing: number;
  alignment: TextAlign;
  vAlignment: VerticalAlign;
  type: TextShape;
  textColor: string;
  baseColor: string;
  supportHeight: number;
  supportPadding: { top: number; bottom: number; left: number; right: number };
  supportSize: { width: number; height: number };
  supportBorderRadius: number;
  uprightPosition: { x: number; y: number; z: number };
  handleSettings: {
    type: HandleType;
    position: HandlePosition;
    size: number;
    size2: number;
    offsetX: number;
    offsetY: number;
  };
};

type Part = { value: string; font: TextifyFont };
const emojiPattern = /\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*/gu;

function textParts(text: string, font: TextifyFont, emojiFont: TextifyFont): Part[] {
  const matches = [...text.matchAll(emojiPattern)];
  if (matches.length === 0) return [{ value: text, font }];

  const parts: Part[] = [];
  let cursor = 0;
  for (const match of matches) {
    const start = match.index ?? cursor;
    if (start > cursor) parts.push({ value: text.slice(cursor, start), font });
    parts.push({ value: match[0], font: emojiFont });
    cursor = start + match[0].length;
  }
  if (cursor < text.length) parts.push({ value: text.slice(cursor), font });
  return parts;
}

function addGlyphPath(target: THREE.ShapePath, commands: ReturnType<TextifyFont["hb"]["glyphToJson"]>, x: number, y: number) {
  for (const command of commands) {
    switch (command.type) {
      case "M":
        target.moveTo(command.values[0] + x, command.values[1] + y);
        break;
      case "L":
        target.lineTo(command.values[0] + x, command.values[1] + y);
        break;
      case "Q":
        target.quadraticCurveTo(command.values[0] + x, command.values[1] + y, command.values[2] + x, command.values[3] + y);
        break;
      case "C":
        target.bezierCurveTo(command.values[0] + x, command.values[1] + y, command.values[2] + x, command.values[3] + y, command.values[4] + x, command.values[5] + y);
        break;
      case "Z":
        target.currentPath?.closePath();
        break;
    }
  }
}

function transformPath(path: THREE.Path, scaleX: number, shear: number) {
  const transform = (point: THREE.Vector2) => {
    point.x = point.x * scaleX + point.y * shear;
  };

  for (const curve of path.curves) {
    if (curve instanceof THREE.LineCurve) {
      transform(curve.v1);
      transform(curve.v2);
    } else if (curve instanceof THREE.QuadraticBezierCurve) {
      transform(curve.v0);
      transform(curve.v1);
      transform(curve.v2);
    } else if (curve instanceof THREE.CubicBezierCurve) {
      transform(curve.v0);
      transform(curve.v1);
      transform(curve.v2);
      transform(curve.v3);
    }
  }
  transform(path.currentPoint);
}

function createTextShapes(settings: TextifySettings, font: TextifyFont, emojiFont: TextifyFont, styles: TextGeometryStyles) {
  const paths: THREE.Shape[] = [];
  const glyphShapes: THREE.Shape[][] = [];
  const lines = settings.type === "vertical" ? [settings.text.replaceAll("\n", " ")] : settings.text.split("\n");
  const lineGlyphs = lines.map((line) => textParts(line, font, emojiFont).flatMap((part) => shapeText(part.font, part.value, settings.size)));
  const lineWidths = lineGlyphs.map((glyphs) => glyphs.reduce((width, { glyph }) => width + glyph.ax + settings.spacing, 0));
  const maxWidth = Math.max(...lineWidths, 0);
  const bounds = new THREE.Box2(new THREE.Vector2(Infinity, Infinity), new THREE.Vector2(-Infinity, -Infinity));

  lineGlyphs.forEach((glyphs, lineIndex) => {
    const lineWidth = lineWidths[lineIndex];
    const offset = settings.alignment === "center" ? (maxWidth - lineWidth) / 2 : settings.alignment === "right" ? maxWidth - lineWidth : 0;
    let x = offset;
    const baseline = -lineIndex * (settings.size + settings.vSpacing);
    const glyphMetrics = glyphs.map(({ path }) => {
      const xValues = path.flatMap((command) => command.values.filter((_value, index) => index % 2 === 0));
      const yValues = path.flatMap((command) => command.values.filter((_value, index) => index % 2 === 1));
      return { minY: yValues.length ? Math.min(...yValues) : 0, maxY: yValues.length ? Math.max(...yValues) : 0, minX: xValues.length ? Math.min(...xValues) : 0, maxX: xValues.length ? Math.max(...xValues) : 0 };
    });
    const lineMinY = Math.min(...glyphMetrics.map(({ minY }) => minY), 0);
    const lineMaxY = Math.max(...glyphMetrics.map(({ maxY }) => maxY), 0);

    glyphs.forEach(({ glyph, path }, glyphIndex) => {
      const metric = glyphMetrics[glyphIndex];
      let y = baseline + glyph.dy;
      if (settings.vAlignment === "bottom") y += lineMinY - metric.minY;
      if (settings.vAlignment === "top") y += lineMaxY - metric.maxY;
      const shapePath = new THREE.ShapePath();
      addGlyphPath(shapePath, path, x + glyph.dx, y);
      const shapes = shapePath.toShapes(false);
      if (styles.syntheticItalic) {
        for (const shape of shapes) {
          transformPath(shape, 1, 0.22);
          shape.holes.forEach((hole) => transformPath(hole, 1, 0.22));
        }
      }
      for (const shape of shapes) {
        const points = shape.getPoints(12);
        for (const point of points) bounds.expandByPoint(point);
        paths.push(shape);
      }
      glyphShapes.push(shapes);
      x += glyph.ax + settings.spacing;
    });
  });

  if (paths.length === 0 || !Number.isFinite(bounds.min.x)) {
    throw new Error("This font does not contain drawable outlines for the entered text.");
  }

  return { paths, glyphShapes, bounds };
}

export function generateSupportShape(width: number, height: number, radius: number, settings: TextifySettings["handleSettings"]): THREE.Shape {
  const shape = new THREE.Shape();
  const r = THREE.MathUtils.clamp(radius, 0, Math.min(width, height) / 2);
  const handleOnHorizontalEdge = settings.position === "top" || settings.position === "bottom";
  const maxHandleSize = Math.max(0, (handleOnHorizontalEdge ? width : height) - r * 2);
  const handleSize = THREE.MathUtils.clamp(settings.size, 0, maxHandleSize);
  const handleOffset = settings.offsetX;
  const halfTab = Math.max(1, handleSize * 0.5);
  const startX = THREE.MathUtils.clamp(width / 2 + handleOffset - halfTab, r, width - r - handleSize);
  const startY = THREE.MathUtils.clamp(height / 2 + handleOffset - halfTab, r, height - r - handleSize);
  const tabRadius = halfTab;

  if (settings.type === "handle" && settings.position === "bottom") {
    shape.moveTo(r, 0);
    shape.lineTo(startX, 0);
    shape.lineTo(startX, -tabRadius);
    shape.absarc(startX + tabRadius, -tabRadius, tabRadius, Math.PI, Math.PI * 2, false);
    shape.lineTo(startX + handleSize, 0);
    shape.lineTo(width - r, 0);
  } else {
    shape.moveTo(r, 0);
    shape.lineTo(width - r, 0);
  }

  shape.quadraticCurveTo(width, 0, width, r);
  if (settings.type === "handle" && settings.position === "right") {
    shape.lineTo(width, startY);
    shape.lineTo(width + tabRadius, startY);
    shape.absarc(width + tabRadius, startY + tabRadius, tabRadius, -Math.PI / 2, Math.PI / 2, false);
    shape.lineTo(width, startY + handleSize);
  }
  shape.lineTo(width, height - r);
  shape.quadraticCurveTo(width, height, width - r, height);
  if (settings.type === "handle" && settings.position === "top") {
    shape.lineTo(startX + handleSize, height);
    shape.lineTo(startX + handleSize, height + tabRadius);
    shape.absarc(startX + tabRadius, height + tabRadius, tabRadius, 0, Math.PI, false);
    shape.lineTo(startX, height);
  }
  shape.lineTo(r, height);
  shape.quadraticCurveTo(0, height, 0, height - r);
  if (settings.type === "handle" && settings.position === "left") {
    shape.lineTo(0, startY + handleSize);
    shape.lineTo(-tabRadius, startY + handleSize);
    shape.absarc(-tabRadius, startY + tabRadius, tabRadius, Math.PI / 2, Math.PI * 1.5, false);
    shape.lineTo(0, startY);
  }
  shape.lineTo(0, r);
  shape.quadraticCurveTo(0, 0, r, 0);

  if (settings.type === "hole") {
    const diameter = Math.max(1, settings.size);
    const hole = new THREE.Path();
    let x = width / 2 + settings.offsetX;
    let y = height / 2 + settings.offsetY;
    if (settings.position === "top") y = height - diameter / 2 - 1 + settings.offsetY;
    if (settings.position === "bottom") y = diameter / 2 + 1 + settings.offsetY;
    if (settings.position === "left") x = diameter / 2 + 1 + settings.offsetX;
    if (settings.position === "right") x = width - diameter / 2 - 1 + settings.offsetX;
    hole.absellipse(THREE.MathUtils.clamp(x, diameter / 2 + 1, width - diameter / 2 - 1), THREE.MathUtils.clamp(y, diameter / 2 + 1, height - diameter / 2 - 1), diameter / 2, diameter / 2, 0, Math.PI * 2, true, 0);
    shape.holes.push(hole);
  }

  if (settings.type === "handle" && handleSize > 0) {
    const holeRadius = Math.max(0.5, (handleSize - settings.size2 * 2) / 2);
    const hole = new THREE.Path();
    const centers: Record<HandlePosition, [number, number]> = {
      bottom: [startX + handleSize / 2, -tabRadius],
      top: [startX + handleSize / 2, height + tabRadius],
      left: [-tabRadius, startY + handleSize / 2],
      right: [width + tabRadius, startY + handleSize / 2],
    };
    const [holeX, holeY] = centers[settings.position];
    hole.absellipse(holeX, holeY, holeRadius, holeRadius, 0, Math.PI * 2, true, 0);
    shape.holes.push(hole);
  }

  return shape;
}

function extrude(shapes: THREE.Shape[], depth: number, syntheticBold = false) {
  return new THREE.ExtrudeGeometry(shapes, {
    depth,
    bevelEnabled: syntheticBold,
    bevelSegments: 1,
    bevelThickness: 0.45,
    bevelSize: 0.45,
    curveSegments: 10,
  });
}

function createUnderlineShape(left: number, right: number, baseline: number, thickness: number) {
  const shape = new THREE.Shape();
  const top = baseline - thickness * 0.5;
  const bottom = baseline - thickness * 1.5;
  shape.moveTo(left, bottom);
  shape.lineTo(right, bottom);
  shape.lineTo(right, top);
  shape.lineTo(left, top);
  shape.closePath();
  return shape;
}

function placeUpright(geometry: THREE.BufferGeometry, settings: TextifySettings) {
  const position = settings.uprightPosition;
  geometry.rotateX(Math.PI / 2);
  geometry.translate(
    settings.supportPadding.left + position.x,
    settings.supportPadding.bottom + settings.height * 2 - position.z,
    settings.supportHeight + position.y,
  );
}

function offsetPath(path: THREE.Path, x: number, y: number) {
  for (const curve of path.curves) {
    if (curve instanceof THREE.LineCurve) {
      curve.v1.add(new THREE.Vector2(x, y));
      curve.v2.add(new THREE.Vector2(x, y));
    } else if (curve instanceof THREE.QuadraticBezierCurve) {
      curve.v0.add(new THREE.Vector2(x, y));
      curve.v1.add(new THREE.Vector2(x, y));
      curve.v2.add(new THREE.Vector2(x, y));
    } else if (curve instanceof THREE.CubicBezierCurve) {
      curve.v0.add(new THREE.Vector2(x, y));
      curve.v1.add(new THREE.Vector2(x, y));
      curve.v2.add(new THREE.Vector2(x, y));
      curve.v3.add(new THREE.Vector2(x, y));
    } else if (curve instanceof THREE.EllipseCurve) {
      curve.aX += x;
      curve.aY += y;
    }
  }
  path.currentPoint.add(new THREE.Vector2(x, y));
}

function moveShapes(shapes: THREE.Shape[], x: number, y: number) {
  for (const shape of shapes) {
    offsetPath(shape, x, y);
    for (const hole of shape.holes) offsetPath(hole, x, y);
  }
}

export function createTextifyModel(
  settings: TextifySettings,
  font: TextifyFont,
  emojiFont: TextifyFont,
  outputMode: ModelOutputMode = "solid",
  textStyles: TextGeometryStyles = {},
) {
  const { paths, glyphShapes, bounds } = createTextShapes(settings, font, emojiFont, textStyles);
  const width = bounds.max.x - bounds.min.x;
  const height = bounds.max.y - bounds.min.y;
  const geometry = new THREE.BufferGeometry();
  const textMaterial = new THREE.MeshStandardMaterial({ color: settings.textColor, roughness: 0.72, metalness: 0.04, side: THREE.DoubleSide });
  const baseMaterial = new THREE.MeshStandardMaterial({ color: settings.baseColor, roughness: 0.72, metalness: 0.04, side: THREE.DoubleSide });
  const parts: THREE.BufferGeometry[] = [];
  let supportDepth = settings.supportHeight;

  const padding = settings.supportPadding;
  const minimumSupportWidth = width + padding.left + padding.right;
  const minimumSupportHeight = height + padding.top + padding.bottom;
  const supportWidth = Math.max(minimumSupportWidth, settings.supportSize.width || minimumSupportWidth);
  const supportHeight = Math.max(minimumSupportHeight, settings.supportSize.height || minimumSupportHeight);
  const extraSupportX = (supportWidth - minimumSupportWidth) / 2;
  const extraSupportY = (supportHeight - minimumSupportHeight) / 2;
  const textX = settings.type === "text" ? 0 : -bounds.min.x + padding.left + extraSupportX;
  const textY = settings.type === "text" ? 0 : -bounds.min.y + padding.bottom + extraSupportY;
  const underlineThickness = Math.max(0.8, settings.size * 0.035);
  const underline = textStyles.underline
    ? createUnderlineShape(bounds.min.x, bounds.max.x, bounds.min.y, underlineThickness)
    : null;

  if (outputMode === "separate" && settings.type !== "negative") {
    const group = new THREE.Group();
    group.name = "Textify Export";
    if (settings.type !== "text") {
      const supportShape = generateSupportShape(
        supportWidth,
        supportHeight,
        settings.supportBorderRadius,
        settings.handleSettings,
      );
      const supportMesh = new THREE.Mesh(extrude([supportShape], supportDepth), baseMaterial);
      supportMesh.name = "Backing Plate";
      supportMesh.geometry.computeVertexNormals();
      group.add(supportMesh);
    }

    let letterIndex = 0;
    for (const shapes of glyphShapes) {
      if (shapes.length === 0) continue;
      const positionedShapes = shapes.map((shape) => shape.clone());
      if (settings.type !== "text") moveShapes(positionedShapes, textX, textY);
      const letterGeometry = extrude(positionedShapes, settings.height, textStyles.syntheticBold);

      if (settings.type === "support") {
        letterGeometry.translate(0, 0, supportDepth);
      } else if (settings.type === "vertical") {
        placeUpright(letterGeometry, settings);
      }

      letterGeometry.computeVertexNormals();
      letterIndex += 1;
      const letterMesh = new THREE.Mesh(letterGeometry, textMaterial);
      letterMesh.name = `Letter ${String(letterIndex).padStart(3, "0")}`;
      group.add(letterMesh);
    }

    if (underline) {
      const positionedUnderline = underline.clone();
      if (settings.type !== "text") moveShapes([positionedUnderline], textX, textY);
      const underlineGeometry = extrude([positionedUnderline], settings.height, textStyles.syntheticBold);
      if (settings.type === "support") underlineGeometry.translate(0, 0, supportDepth);
      if (settings.type === "vertical") placeUpright(underlineGeometry, settings);
      const underlineMesh = new THREE.Mesh(underlineGeometry, textMaterial);
      underlineMesh.name = "Underline";
      group.add(underlineMesh);
    }

    const groupBounds = new THREE.Box3().setFromObject(group);
    const groupSize = groupBounds.getSize(new THREE.Vector3());
    return { group, dimensions: { x: groupSize.x, y: groupSize.y, z: groupSize.z } };
  }

  const textShapes = underline ? [...paths, underline] : paths;

  if (settings.type === "text") {
    parts.push(extrude(textShapes, settings.height, textStyles.syntheticBold));
  } else {
    const supportShape = generateSupportShape(supportWidth, supportHeight, settings.supportBorderRadius, settings.handleSettings);
    if (settings.type === "negative") {
      supportDepth = Math.max(supportDepth, settings.height);
      for (const path of paths) {
        const hole = new THREE.Path();
        hole.curves = path.curves.map((curve) => curve.clone());
        hole.currentPoint.copy(path.currentPoint);
        offsetPath(hole, textX, textY);
        supportShape.holes.push(hole);
      }
      if (underline) {
        const underlineHole = underline.clone();
        moveShapes([underlineHole], textX, textY);
        supportShape.holes.push(underlineHole);
      }
      parts.push(extrude([supportShape], supportDepth));
    } else {
      parts.push(extrude([supportShape], supportDepth));
      if (settings.type === "support") {
        moveShapes(textShapes, textX, textY);
        parts.push(extrude(textShapes, settings.height, textStyles.syntheticBold).translate(0, 0, supportDepth));
      } else {
        const upright = textShapes.map((shape) => shape.clone());
        moveShapes(upright, textX, textY);
        const uprightGeometry = extrude(upright, settings.height, textStyles.syntheticBold);
        placeUpright(uprightGeometry, settings);
        parts.push(uprightGeometry);
      }
    }
  }

  const merged = mergeGeometries(parts, true);
  if (!merged) throw new Error("The generated text could not be combined into a single model.");
  geometry.copy(merged);
  merged.dispose();

  for (const part of parts) part.dispose();
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  const materials = settings.type === "support" || settings.type === "vertical"
    ? [baseMaterial, textMaterial]
    : [settings.type === "negative" ? baseMaterial : textMaterial];
  const mesh = new THREE.Mesh(geometry, materials);
  mesh.name = "Textify Model";
  const group = new THREE.Group();
  group.name = "Textify Export";
  group.add(mesh);
  const size = geometry.boundingBox?.getSize(new THREE.Vector3()) ?? new THREE.Vector3();
  return { group, dimensions: { x: size.x, y: size.y, z: size.z } };
}