declare module 'harfbuzzjs/hbjs' {
  type Direction = 'ltr' | 'rtl' | 'ttb' | 'btt';
  type BufferFlag =
    | 'BOT'
    | 'EOT'
    | 'PRESERVE_DEFAULT_IGNORABLES'
    | 'REMOVE_DEFAULT_IGNORABLES'
    | 'DO_NOT_INSERT_DOTTED_CIRCLE'
    | 'PRODUCE_UNSAFE_TO_CONCAT';

  type HBBlob = unknown;

  export interface HBFace {
    upem: number; //units per em
    reference_table(table: string): Uint8Array;
    getAxisInfos(): Record<string, { min: number; default: number; max: number }>;
    collectUnicodes(): Uint32Array;
    destroy(): void;
  }

  export interface SVGPathSegment {
    type: 'M' | 'L' | 'Q' | 'C' | 'Z';
    values: number[];
  }

  export type BufferContent = {
    g: number; //The glyph ID
    cl: number; //The cluster ID
    ax: number; //Advance width (width to advance after this glyph is painted)
    ay: number; //Advance height (height to advance after this glyph is painted)
    dx: number; //X displacement (adjustment in X dimension when painting this glyph)
    dy: number; //Y displacement (adjustment in Y dimension when painting this glyph)
    flags: number; // Glyph flags like `HB_GLYPH_FLAG_UNSAFE_TO_BREAK` (0x1)
  }[];

  export interface HBFont {
    glyphName(glyphId: number): string;
    glyphToPath(glyphId: number): string;
    glyphToJson(glyphId: number): SVGPathSegment[];
    setScale(xScale: number, yScale: number): void;
    setVariations(variations: Record<string, string | number | boolean>): void;
    destroy(): void;
  }

  interface HBBuffer {
    addText(text: string): void;
    guessSegmentProperties(): void;
    setDirection(dir: Direction): void;
    setFlags(flags: BufferFlag[]): void;
    setLanguage(language: string): void;
    setScript(script: string): void;
    setClusterLevel(level: number): void;
    json(): BufferContent;
    destroy(): void;
  }

  export interface HBInstance {
    createBlob(buffer: ArrayBuffer): HBBlob;
    createFace(blob: HBBlob, fontIndex: number): HBFace;
    createFont(face: HBFace): HBFont;
    createBuffer(): HBBuffer;
    shape(font: HBFont, buffer: HBBuffer): void;
  }

  const hb: (instance: WebAssembly.Instance) => HBInstance;

  export default hb;
}
