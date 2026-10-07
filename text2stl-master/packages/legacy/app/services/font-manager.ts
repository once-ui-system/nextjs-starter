import Service from '@ember/service';
import config from 'text2stl/config/environment';
import { inject as service } from '@ember/service';
import * as opentype from 'opentype.js';

import type HarfbuzzService from 'text2stl/services/harfbuzz';
import type { HBFont, HBFace } from 'harfbuzzjs/hbjs';

export type Category = 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace';
export type Script =
  | 'arabic'
  | 'bengali'
  | 'chinese-simplified'
  | 'chinese-traditional'
  | 'cyrillic'
  | 'cyrillic-ext'
  | 'devanagari'
  | 'greek'
  | 'greek-ext'
  | 'gujarati'
  | 'gurmukhi'
  | 'hebrew'
  | 'japanese'
  | 'kannada'
  | 'khmer'
  | 'korean'
  | 'latin'
  | 'latin-ext'
  | 'malayalam'
  | 'myanmar'
  | 'oriya'
  | 'sinhala'
  | 'tamil'
  | '​telugu'
  | 'thai'
  | 'vietnamese';
export type SortOption = 'alphabet' | 'popularity';
export type Variant =
  | '100'
  | '100italic'
  | '200'
  | '200italic'
  | '300'
  | '300italic'
  | 'regular'
  | 'italic'
  | '500'
  | '500italic'
  | '600'
  | '600italic'
  | '700'
  | '700italic'
  | '800'
  | '800italic'
  | '900'
  | '900italic';
export interface Font {
  family: string;
  category: Category;
  scripts: Script[];
  variants: Variant[];
  kind?: string;
  version?: string;
  lastModified?: string;
  files?: Record<Variant, string>;
}

const {
  APP: { googleFontApiKey },
} = config;

const FONT_BASE_URL = 'https://fonts.googleapis.com/css';
const LIST_BASE_URL = 'https://www.googleapis.com/webfonts/v1/webfonts';
const EMOJI_FONT_FILE = '/NotoEmoji-Regular.ttf';

type GoogleFontApiResponse = {
  items: {
    family: string;
    category: Category;
    subsets: Script[];
    variants: Variant[];
    kind?: string;
    version?: string;
    lastModified?: string;
    files?: Record<Variant, string>;
  }[];
};

export interface FaceAndFont {
  font: HBFont;
  face: HBFace;
  opentype: opentype.Font; // This is only used to determine outline type (TrueType / CFF). TODO: find how to do that with harfbuzz.
}

export default class FontManagerService extends Service {
  @service declare harfbuzz: HarfbuzzService;

  availableFontScript: Script[] = [
    'arabic',
    'bengali',
    'chinese-simplified',
    'chinese-traditional',
    'cyrillic',
    'cyrillic-ext',
    'devanagari',
    'greek',
    'greek-ext',
    'gujarati',
    'gurmukhi',
    'hebrew',
    'japanese',
    'kannada',
    'khmer',
    'korean',
    'latin',
    'latin-ext',
    'malayalam',
    'myanmar',
    'oriya',
    'sinhala',
    'tamil',
    '​telugu',
    'thai',
    'vietnamese',
  ];
  availableFontCategories: Category[] = [
    'sans-serif',
    'serif',
    'display',
    'handwriting',
    'monospace',
  ];

  fontList: Map<string, Font> = new Map();

  fontCache: Record<string, FaceAndFont> = {};

  opentype = opentype; // For easy mock

  _emojiFont?: FaceAndFont;

  get emojiFont() {
    if (!this._emojiFont) {
      throw 'Emoji font not loaded, please call loadEmojiFont() first.';
    }

    return this._emojiFont;
  }

  // For easy mock
  fetch(input: RequestInfo, init?: RequestInit | undefined): Promise<Response> {
    return fetch(input, init);
  }

  loadFontListPromise: undefined | Promise<void> = undefined;
  async loadFont() {
    if (!this.loadFontListPromise) {
      this.loadFontListPromise = this._loadFonts();
    }

    await this.loadFontListPromise;
  }

  private async _loadFonts() {
    // Load font list from Google font
    await this._loadFontList();

    // Load Font CSS by chunk of 500 fonts
    const fontChunks = this.chunk([...this.fontList.values()], 120);
    const styles = await Promise.all(fontChunks.map((fonts) => this._getStylesheet(fonts)));

    // Add font CSS to document
    await this._createFontStyleSheet(styles.join('\n'));
  }

  private async _loadFontList() {
    this.fontList = new Map();

    const url = new URL(LIST_BASE_URL);
    url.searchParams.append('sort', 'popularity');
    url.searchParams.append('key', googleFontApiKey);

    const response = await fetch(url);
    const json = (await response.json()) as GoogleFontApiResponse;

    const usableFonts = json.items.filter((f) => Boolean(f?.files));

    for (const font of usableFonts) {
      const { family, subsets, ...others } = font;
      this.fontList.set(font.family, {
        ...others,
        family,
        scripts: subsets,
      });
    }
  }

  private async _getStylesheet(
    fonts: Font[],
    scripts: Script[] = ['latin'],
    // variants: Variant[] = ['regular'],
    previewsOnly: boolean = true,
  ): Promise<string> {
    const url = new URL(FONT_BASE_URL);

    // Build query URL for specified font families and variants
    const familiesStr = fonts.map(
      (font): string =>
        `${font.family}:${font.variants.includes('regular') ? 'regular' : font.variants[0]}`,
    );
    url.searchParams.append('family', familiesStr.join('|'));

    // Query the fonts in the specified scripts
    url.searchParams.append('subset', scripts.join(','));

    // If previewsOnly: Only query the characters contained in the font names
    if (previewsOnly) {
      // Concatenate the family names of all fonts
      const familyNamesConcat = fonts.map((font): string => font.family).join('');
      // Create a string with all characters (listed once) contained in the font family names
      const downloadChars = familyNamesConcat
        .split('')
        .filter((char, pos, self): boolean => self.indexOf(char) === pos)
        .join('');
      // Query only the identified characters
      url.searchParams.append('text', downloadChars);
    }

    // Tell browser to render fallback font immediately and swap in the new font once it's loaded
    url.searchParams.append('font-display', 'swap');

    // Fetch and return stylesheet
    const response = await fetch(url);
    return response.text();
  }

  private async _createFontStyleSheet(style: string) {
    const stylesheet = new CSSStyleSheet();
    document.adoptedStyleSheets.push(await stylesheet.replace(style));
  }

  private openHBFont(buffer: ArrayBuffer): FaceAndFont {
    const blob = this.harfbuzz.hb.createBlob(buffer);
    const face = this.harfbuzz.hb.createFace(blob, 0);
    return {
      font: this.harfbuzz.hb.createFont(face),
      face,
      opentype: this.opentype.parse(buffer),
    };
  }

  async fetchFont(fontName: string, variantName?: Variant): Promise<FaceAndFont> {
    const font = this.fontList.get(fontName);
    if (!font) {
      throw `Unknown font name ${fontName}`;
    }

    const { variants } = font;
    const variant = variantName && variants.indexOf(variantName) >= 0 ? variantName : variants[0];

    let url = font.files?.[variant];
    if (!url) {
      url = font.files?.[Object.keys(font.files)[0] as Variant];
    }

    if (!url) {
      throw `Unable to find font url for ${fontName} / ${variantName}`;
    }

    const cacheName = `${fontName}-${variantName}`;
    if (!this.fontCache[cacheName]) {
      const res = await this.fetch(url.replace('http:', 'https:'));
      const fontData = await res.arrayBuffer();
      this.fontCache[cacheName] = this.openHBFont(fontData);
    }

    return this.fontCache[cacheName];
  }

  async loadCustomFont(fontTTFFile: Blob): Promise<FaceAndFont> {
    const fontAsBuffer = await fontTTFFile.arrayBuffer();
    return this.openHBFont(fontAsBuffer);
  }

  private async _loadEmojiFont() {
    await this.harfbuzz.loadWASM();
    const res = await this.fetch(EMOJI_FONT_FILE);
    const fontData = await res.arrayBuffer();
    this._emojiFont = this.openHBFont(fontData);
  }

  loadEmojiFontPromise: undefined | Promise<void> = undefined;
  async loadEmojiFont() {
    if (!this.loadEmojiFontPromise) {
      this.loadEmojiFontPromise = this._loadEmojiFont();
    }

    await this.loadEmojiFontPromise;
  }

  private chunk<T>(array: T[], chunkSize: number) {
    const length = Math.ceil(array.length / chunkSize);
    const chunks = new Array(length).fill(0);
    return chunks.map((_, index) => {
      const start = index * chunkSize;
      const end = (index + 1) * chunkSize;
      return array.slice(start, end);
    });
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    'font-manager': FontManagerService;
  }
}
