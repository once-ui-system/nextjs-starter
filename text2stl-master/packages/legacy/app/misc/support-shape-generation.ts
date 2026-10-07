import * as THREE from 'three';
import { Handle } from 'text2stl/services/text-maker';

export function generateSupportShape(
  width: number,
  height: number,
  radius: number,
  handleSettings: Handle | undefined,
): THREE.Shape {
  // Limit min/max radius
  const maxRadius = Math.min(width / 2, height / 2);
  if (radius > maxRadius) {
    radius = maxRadius;
  } else if (radius < 0) {
    radius = 0;
  }

  // Compute some handle settings
  const maxHandleSize =
    handleSettings?.position === 'bottom' || handleSettings?.position === 'top'
      ? width - 2 * radius
      : height - 2 * radius;
  const hasHandle = handleSettings?.type === 'handle';
  const handleSize = Math.min(handleSettings?.size ?? 0, maxHandleSize);
  const handleMaxOffset =
    handleSettings?.position === 'bottom' || handleSettings?.position === 'top'
      ? (width - 2 * radius - handleSize) / 2
      : (height - 2 * radius - handleSize) / 2;
  const handleOffset =
    handleSettings?.offsetX && handleSettings?.offsetX > 0
      ? Math.min(handleSettings?.offsetX ?? 0, handleMaxOffset)
      : Math.max(handleSettings?.offsetX ?? 0, -handleMaxOffset);

  let handleWidth = handleSettings?.size2 ?? 0;
  if (handleWidth < 1) {
    handleWidth = 1;
  } else if (handleWidth > handleSize / 2 - 1) {
    handleWidth = handleSize / 2 - 1;
  }

  let hole: THREE.Path | undefined;

  const supportShape = new THREE.Shape();
  supportShape.moveTo(radius, 0);
  if (hasHandle && handleSettings?.position === 'bottom') {
    const handleStartX =
      width - radius - handleSize - handleOffset - (maxHandleSize - handleSize) / 2;
    supportShape.lineTo(handleStartX, 0);
    supportShape.ellipse(
      handleSize / 2,
      0,
      handleSize / 2,
      handleSize / 2,
      Math.PI * 2,
      Math.PI,
      false,
      Math.PI,
    );

    const holeRadius = (handleSize - handleWidth * 2) / 2;
    hole = new THREE.Path();
    hole.moveTo(handleStartX + handleWidth, 0);
    hole.lineTo(handleStartX + handleSize - handleWidth, 0);
    hole.ellipse(-holeRadius, 0, holeRadius, holeRadius, Math.PI * 2, Math.PI, false, Math.PI);
    hole.closePath();
  }

  supportShape.lineTo(width - radius, 0);

  if (radius) {
    supportShape.ellipse(0, radius, radius, radius, Math.PI / 2, Math.PI, false, Math.PI);
  }

  if (hasHandle && handleSettings?.position === 'right') {
    const handleStartY = radius + handleOffset + (maxHandleSize - handleSize) / 2;
    supportShape.lineTo(width, handleStartY);
    supportShape.ellipse(
      0,
      handleSize / 2,
      handleSize / 2,
      handleSize / 2,
      Math.PI / 2,
      (3 * Math.PI) / 2,
      false,
      Math.PI,
    );

    const holeRadius = (handleSize - handleWidth * 2) / 2;
    hole = new THREE.Path();
    hole.moveTo(width, handleStartY + handleWidth);
    hole.lineTo(width, handleStartY + handleSize - handleWidth);
    hole.ellipse(
      0,
      -holeRadius,
      holeRadius,
      holeRadius,
      Math.PI / 2,
      (3 * Math.PI) / 2,
      false,
      Math.PI,
    );
    hole.closePath();
  }

  supportShape.lineTo(width, height - radius);

  if (radius) {
    supportShape.ellipse(-radius, 0, radius, radius, Math.PI, Math.PI * 1.5, false, Math.PI);
  }

  if (hasHandle && handleSettings?.position === 'top') {
    const handleStartX = radius + handleSize + handleOffset + (maxHandleSize - handleSize) / 2;
    supportShape.lineTo(handleStartX, height);
    supportShape.ellipse(
      -handleSize / 2,
      0,
      handleSize / 2,
      handleSize / 2,
      Math.PI,
      Math.PI * 2,
      false,
      Math.PI,
    );

    const holeRadius = (handleSize - handleWidth * 2) / 2;
    hole = new THREE.Path();
    hole.moveTo(handleStartX - handleWidth, height);
    hole.lineTo(handleStartX - handleSize + handleWidth, height);
    hole.ellipse(holeRadius, 0, holeRadius, holeRadius, Math.PI, Math.PI * 2, false, Math.PI);
    hole.closePath();
  }

  supportShape.lineTo(radius, height);

  if (radius) {
    supportShape.ellipse(0, -radius, radius, radius, Math.PI * 1.5, 0, false, Math.PI);
  }

  if (hasHandle && handleSettings?.position === 'left') {
    const handleStartY = radius + handleOffset + handleSize + (maxHandleSize - handleSize) / 2;
    supportShape.lineTo(0, handleStartY);
    supportShape.ellipse(
      0,
      -handleSize / 2,
      handleSize / 2,
      handleSize / 2,
      (3 * Math.PI) / 2,
      Math.PI / 2,
      false,
      Math.PI,
    );

    const holeRadius = (handleSize - handleWidth * 2) / 2;
    hole = new THREE.Path();
    hole.moveTo(0, handleStartY - handleWidth);
    hole.lineTo(0, handleStartY - handleSize + handleWidth);
    hole.ellipse(
      0,
      holeRadius,
      holeRadius,
      holeRadius,
      (3 * Math.PI) / 2,
      Math.PI / 2,
      false,
      Math.PI,
    );
    hole.closePath();
  }

  supportShape.lineTo(0, radius);

  if (radius) {
    supportShape.ellipse(radius, 0, radius, radius, 0, Math.PI / 2, false, Math.PI);
  }

  // Generate hole if needed
  if (handleSettings?.type && handleSettings.type === 'hole') {
    hole = generateHoleShape(width, height, handleSettings);
  }

  if (hole) {
    supportShape.holes.push(hole);
  }

  return supportShape;
}

export function generateHoleShape(
  width: number,
  height: number,
  handleSettings: Handle,
): THREE.Path {
  const hole = new THREE.Path();

  const { offsetX, offsetY, position } = handleSettings;
  let { size: holeSize } = handleSettings;
  holeSize = Math.max(1, holeSize);

  let holeX = 0;
  let holeY = 0;

  switch (position) {
    case 'top':
      holeX = width / 2;
      holeY = height - holeSize / 2 - 1;
      break;
    case 'bottom':
      holeX = width / 2;
      holeY = holeSize / 2 - 1;
      break;
    case 'left':
      holeX = holeSize / 2 + 1;
      holeY = height / 2;
      break;
    case 'right':
      holeX = width - holeSize / 2 - 1;
      holeY = height / 2;
      break;
  }

  holeX += offsetX;
  holeY += offsetY;

  const maxY = height - holeSize / 2 - 1;
  const minY = holeSize / 2 + 1;

  const maxX = width - holeSize / 2 - 1;
  const minX = holeSize / 2 + 1;

  hole.moveTo(Math.max(Math.min(holeX, maxX), minX), Math.max(Math.min(holeY, maxY), minY));
  hole.ellipse(0, 0, holeSize / 2, holeSize / 2, Math.PI, 3 * Math.PI, false, Math.PI);
  hole.closePath();

  return hole;
}
