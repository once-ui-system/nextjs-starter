import { createImageifyExtrusion } from "./extrudeGeometry";
import { createImageifySurface } from "./surfaceGeometry";

export type ImageifyMode = "heightmap" | "extrude";
export type ImageBackgroundMode = "none" | "auto" | "color";
export type ImageifySnapMode = "none" | "average" | "nearest";
export type ImageifyPartReduction = "auto" | "low" | "none";

export type ImageifySettings = {
  mode: ImageifyMode;
  backgroundMode: ImageBackgroundMode;
  backgroundColor: string;
  backgroundTolerance: number;
  width: number;
  baseThickness: number;
  reliefHeight: number;
  detail: number;
  invert: boolean;
  mergeSimilarColors: number;
  holePartReduction: ImageifyPartReduction;
  snapVertices: ImageifySnapMode;
  snapDistance: number;
  outlineSmoothing: number;
  outlineSimplification: number;
};

export function createImageifyModel(pixels: ImageData, settings: ImageifySettings) {
  const preparedPixels = removeBackground(pixels, settings);
  return settings.mode === "extrude"
    ? createImageifyExtrusion(preparedPixels, settings)
    : createImageifySurface(preparedPixels, settings);
}

function removeBackground(pixels: ImageData, settings: ImageifySettings) {
  if (settings.backgroundMode === "none") return pixels;

  const data = new Uint8ClampedArray(pixels.data);
  const pixelCount = pixels.width * pixels.height;
  const toleranceSquared = settings.backgroundTolerance ** 2 * 3;
  const matches = (offset: number, color: [number, number, number]) => {
    const red = data[offset] - color[0];
    const green = data[offset + 1] - color[1];
    const blue = data[offset + 2] - color[2];
    return red * red + green * green + blue * blue <= toleranceSquared;
  };

  if (settings.backgroundMode === "color") {
    const hex = settings.backgroundColor.replace("#", "");
    const background: [number, number, number] = [0, 2, 4].map((offset) =>
      Number.parseInt(hex.slice(offset, offset + 2), 16),
    ) as [number, number, number];
    for (let index = 0; index < pixelCount; index++) {
      const offset = index * 4;
      if (matches(offset, background)) data[offset + 3] = 0;
    }
    return new ImageData(data, pixels.width, pixels.height);
  }

  const colorCounts = new Map<
    number,
    { count: number; red: number; green: number; blue: number }
  >();
  const sampleSize = Math.min(16, pixels.width, pixels.height);
  for (let y = 0; y < pixels.height; y++) {
    for (let x = 0; x < pixels.width; x++) {
      if (
        x >= sampleSize &&
        x < pixels.width - sampleSize &&
        y >= sampleSize &&
        y < pixels.height - sampleSize
      )
        continue;
      const offset = (y * pixels.width + x) * 4;
      if (data[offset + 3] <= 8) continue;
      const key =
        ((data[offset] >> 4) << 8) | ((data[offset + 1] >> 4) << 4) | (data[offset + 2] >> 4);
      const item = colorCounts.get(key) ?? { count: 0, red: 0, green: 0, blue: 0 };
      item.count++;
      item.red += data[offset];
      item.green += data[offset + 1];
      item.blue += data[offset + 2];
      colorCounts.set(key, item);
    }
  }
  const mostCommon = [...colorCounts.values()].sort(
    (first, second) => second.count - first.count,
  )[0];
  if (!mostCommon) return new ImageData(data, pixels.width, pixels.height);
  const background: [number, number, number] = [
    mostCommon.red / mostCommon.count,
    mostCommon.green / mostCommon.count,
    mostCommon.blue / mostCommon.count,
  ];
  const queue = new Int32Array(pixelCount);
  let head = 0;
  let tail = 0;
  const enqueue = (index: number) => {
    if (index < 0 || index >= pixelCount) return;
    const offset = index * 4;
    if (data[offset + 3] <= 8 || !matches(offset, background)) return;
    data[offset + 3] = 0;
    queue[tail++] = index;
  };
  for (let x = 0; x < pixels.width; x++) {
    enqueue(x);
    enqueue((pixels.height - 1) * pixels.width + x);
  }
  for (let y = 1; y < pixels.height - 1; y++) {
    enqueue(y * pixels.width);
    enqueue(y * pixels.width + pixels.width - 1);
  }
  while (head < tail) {
    const index = queue[head++];
    const x = index % pixels.width;
    if (x > 0) enqueue(index - 1);
    if (x < pixels.width - 1) enqueue(index + 1);
    if (index >= pixels.width) enqueue(index - pixels.width);
    if (index < pixelCount - pixels.width) enqueue(index + pixels.width);
  }
  return new ImageData(data, pixels.width, pixels.height);
}
