import {
  TextMakerParameters,
  SupportPadding,
  Handle,
  ModelType,
  TextMakerAlignment,
  TextMakerVerticalAlignment,
} from 'text2stl/services/text-maker';
import { tracked } from '@glimmer/tracking';
import config from 'text2stl/config/environment';

import type { Variant } from 'text2stl/services/font-manager';

const {
  APP: { textMakerDefault },
} = config;

interface TextMakerAdditionnalSettings {
  fontName: string;
  variantName: Variant;
}

export type TextMakerSettingsParameters = TextMakerParameters & TextMakerAdditionnalSettings;

interface QPSerializable {
  serialize(): string;
  deserialize(json: string): void;
}

export class SupportPaddingSettings implements SupportPadding, QPSerializable {
  @tracked top: number;
  @tracked bottom: number;
  @tracked left: number;
  @tracked right: number;

  constructor(args: SupportPadding) {
    this.top = args.top;
    this.bottom = args.bottom;
    this.left = args.left;
    this.right = args.right;
  }

  get isCustom() {
    return !(
      this.top === this.bottom &&
      this.top === this.left &&
      this.top === this.right &&
      this.bottom === this.left &&
      this.bottom === this.right &&
      this.left === this.right
    );
  }

  serialize(): string {
    return JSON.stringify({
      top: this.top,
      bottom: this.bottom,
      left: this.left,
      right: this.right,
    });
  }

  deserialize(json: string) {
    const v = JSON.parse(json) as SupportPaddingSettings;
    this.top = v.top;
    this.bottom = v.bottom;
    this.left = v.left;
    this.right = v.right;
  }
}

export class HandleSettings implements Handle, QPSerializable {
  @tracked type: 'hole' | 'handle' | 'none';
  @tracked position: 'left' | 'top' | 'right' | 'bottom';
  @tracked size: number;
  @tracked size2: number;
  @tracked offsetX: number;
  @tracked offsetY: number;

  constructor(args: Handle) {
    this.type = args.type;
    this.position = args.position;
    this.size = args.size;
    this.size2 = args.size2;
    this.offsetX = args.offsetX;
    this.offsetY = args.offsetY;
  }

  serialize(): string {
    return JSON.stringify({
      type: this.type,
      position: this.position,
      size: this.size,
      size2: this.size2,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
    });
  }

  deserialize(json: string) {
    const v = JSON.parse(json) as HandleSettings;
    this.type = v.type;
    this.position = v.position;
    this.size = v.size;
    this.size2 = v.size2;
    this.offsetX = v.offsetX;
    this.offsetY = v.offsetY;
  }
}

export default class TextMakerSettings implements TextMakerParameters, QPSerializable {
  @tracked fontName: string;
  @tracked variantName?: Variant;
  @tracked text: string;
  @tracked size?: number;
  @tracked customFont?: Blob;
  @tracked height?: number;
  @tracked spacing?: number;
  @tracked vSpacing?: number;
  @tracked alignment: TextMakerAlignment;
  @tracked vAlignment: TextMakerVerticalAlignment;
  @tracked type: ModelType;
  @tracked supportHeight?: number;
  @tracked supportBorderRadius?: number;
  @tracked supportPadding: SupportPaddingSettings;
  @tracked handleSettings: HandleSettings;

  constructor(args: TextMakerSettingsParameters) {
    this.variantName = args.variantName;
    this.fontName = args.fontName;
    this.text = args.text ?? textMakerDefault.text;
    this.size = args.size ?? textMakerDefault.size;
    this.height = args.height ?? textMakerDefault.height;
    this.spacing = args.spacing ?? textMakerDefault.spacing;
    this.vSpacing = args.vSpacing ?? textMakerDefault.vSpacing;
    this.alignment = args.alignment ?? textMakerDefault.alignment;
    this.vAlignment = args.vAlignment ?? textMakerDefault.vAlignment;
    this.type = args.type ?? textMakerDefault.type;
    this.supportHeight = args.supportHeight ?? textMakerDefault.supportHeight;
    this.supportBorderRadius = args.supportBorderRadius ?? textMakerDefault.supportBorderRadius;
    this.supportPadding = new SupportPaddingSettings(
      args.supportPadding ?? textMakerDefault.supportPadding,
    );
    this.handleSettings = new HandleSettings(
      args.handleSettings ?? textMakerDefault.handleSettings,
    );
  }

  serialize(): string {
    return JSON.stringify({
      fontName: this.fontName,
      variantName: this.variantName,
      text: this.text,
      size: this.size,
      customFont: this.customFont,
      height: this.height,
      spacing: this.spacing,
      vSpacing: this.vSpacing,
      alignment: this.alignment,
      vAlignment: this.vAlignment,
      type: this.type,
      supportHeight: this.supportHeight,
      supportBorderRadius: this.supportBorderRadius,
      supportPadding: this.supportPadding.serialize(),
      handleSettings: this.handleSettings.serialize(),
    });
  }

  deserialize(json: string) {
    const v = JSON.parse(json) as Omit<TextMakerSettings, 'supportPadding' | 'handleSettings'> & {
      supportPadding: string;
      handleSettings: string;
    };

    this.fontName = v.fontName;
    this.variantName = v.variantName;
    this.text = v.text;
    this.size = v.size;
    this.customFont = v.customFont;
    this.height = v.height;
    this.spacing = v.spacing;
    this.vSpacing = v.vSpacing;
    this.alignment = v.alignment;
    this.vAlignment = v.vAlignment;
    this.type = v.type;
    this.supportHeight = v.supportHeight;
    this.supportBorderRadius = v.supportBorderRadius;
    this.supportPadding.deserialize(v.supportPadding);
    this.handleSettings.deserialize(v.handleSettings);
  }
}
