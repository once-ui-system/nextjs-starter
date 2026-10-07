import * as opentype from "opentype.js";
import type { Font } from "opentype.js";

type HBPathCommand = { type: "M" | "L" | "Q" | "C" | "Z"; values: number[] };
type HBGlyphInfo = { g: number; ax: number; ay: number; dx: number; dy: number };
type HBBuffer = {
  addText(text: string): void;
  guessSegmentProperties(): void;
  json(): HBGlyphInfo[];
  destroy(): void;
};
type HBRuntime = {
  createBlob(buffer: ArrayBuffer): { ptr: number; destroy(): void };
  createFace(blob: { ptr: number }, index: number): { ptr: number; destroy(): void };
  createFont(face: { ptr: number }): {
    ptr: number;
    setScale(x: number, y: number): void;
    glyphToJson(glyphId: number): HBPathCommand[];
    destroy(): void;
  };
  createBuffer(): HBBuffer;
  shape(font: { ptr: number }, buffer: HBBuffer): void;
};

export type TextifyFont = {
  runtime: HBRuntime;
  hb: ReturnType<HBRuntime["createFont"]>;
  opentype: Font;
  dispose(): void;
};

async function woffToSfnt(buffer: ArrayBuffer): Promise<ArrayBuffer> {
  const source = new DataView(buffer);
  if (source.getUint32(0, false) !== 0x774f4646) return buffer;

  const flavor = source.getUint32(4, false);
  const tableCount = source.getUint16(12, false);
  const tables = await Promise.all(Array.from({ length: tableCount }, async (_, index) => {
    const recordOffset = 44 + index * 20;
    const tag = new TextDecoder().decode(new Uint8Array(buffer, recordOffset, 4));
    const dataOffset = source.getUint32(recordOffset + 4, false);
    const compressedLength = source.getUint32(recordOffset + 8, false);
    const originalLength = source.getUint32(recordOffset + 12, false);
    const checksum = source.getUint32(recordOffset + 16, false);
    const compressed = buffer.slice(dataOffset, dataOffset + compressedLength);
    const data = compressedLength === originalLength
      ? compressed
      : await new Response(new Blob([compressed]).stream().pipeThrough(new DecompressionStream("deflate"))).arrayBuffer();
    return { tag, checksum, data };
  })).then((result) => result.sort((left, right) => left.tag < right.tag ? -1 : left.tag > right.tag ? 1 : 0));

  const directoryLength = 12 + tableCount * 16;
  const dataLength = tables.reduce((length, table) => length + Math.ceil(table.data.byteLength / 4) * 4, 0);
  const result = new ArrayBuffer(directoryLength + dataLength);
  const output = new DataView(result);
  const searchPower = 2 ** Math.floor(Math.log2(tableCount));
  output.setUint32(0, flavor, false);
  output.setUint16(4, tableCount, false);
  output.setUint16(6, searchPower * 16, false);
  output.setUint16(8, Math.log2(searchPower), false);
  output.setUint16(10, tableCount * 16 - searchPower * 16, false);

  let tableDataOffset = directoryLength;
  tables.forEach((table, index) => {
    const recordOffset = 12 + index * 16;
    for (let character = 0; character < 4; character++) {
      output.setUint8(recordOffset + character, table.tag.charCodeAt(character));
    }
    output.setUint32(recordOffset + 4, table.checksum, false);
    output.setUint32(recordOffset + 8, tableDataOffset, false);
    output.setUint32(recordOffset + 12, table.data.byteLength, false);
    new Uint8Array(result).set(new Uint8Array(table.data), tableDataOffset);
    tableDataOffset += Math.ceil(table.data.byteLength / 4) * 4;
  });

  return result;
}

let harfbuzzPromise: Promise<HBRuntime> | undefined;

export function loadHarfBuzz(): Promise<HBRuntime> {
  if (!harfbuzzPromise) {
    harfbuzzPromise = Promise.all([
      import("harfbuzzjs/hbjs.js"),
      fetch("/textify/fonts/hb.wasm").then((response) => {
        if (!response.ok) throw new Error("The text shaping engine could not be loaded.");
        return response.arrayBuffer();
      }),
    ]).then(async ([module, wasm]) => {
      const result = await WebAssembly.instantiate(wasm);
      return module.default(result.instance) as HBRuntime;
    });
  }
  return harfbuzzPromise;
}

export async function loadTextifyFont(runtime: HBRuntime, buffer: ArrayBuffer): Promise<TextifyFont> {
  const openTypeFont = opentype.parse(buffer);
  const blob = runtime.createBlob(await woffToSfnt(buffer));
  const face = runtime.createFace(blob, 0);
  const hbFont = runtime.createFont(face);
  return {
    runtime,
    hb: hbFont,
    opentype: openTypeFont,
    dispose() {
      hbFont.destroy();
      face.destroy();
      blob.destroy();
    },
  };
}

export function shapeText(font: TextifyFont, text: string, size: number) {
  font.hb.setScale(size, size);
  const buffer = loadHarfbuzzBuffer(font, text);
  try {
    return buffer.json().map((glyph) => ({ glyph, path: font.hb.glyphToJson(glyph.g) }));
  } finally {
    buffer.destroy();
  }
}

function loadHarfbuzzBuffer(font: TextifyFont, text: string) {
  const buffer = font.runtime.createBuffer();
  buffer.addText(text);
  buffer.guessSegmentProperties();
  font.runtime.shape(font.hb, buffer);
  return buffer;
}
