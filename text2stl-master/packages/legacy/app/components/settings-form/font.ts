import Component from '@glimmer/component';
import TextMakerSettings from 'text2stl/models/text-maker-settings';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type { Variant } from 'text2stl/services/font-manager';

interface FontFormTextSettingsArgs {
  model: TextMakerSettings;
}

const acceptedMimeTypes = [
  'font/ttf',
  'font/woff',
  'font/otf',
  'application/vnd.oasis.opendocument.formula-template', // .otf file mimetype ??
];
export default class FontFormTextSettings extends Component<FontFormTextSettingsArgs> {
  @tracked
  useCustomFont = false;

  @tracked
  showMore = false;

  customFont?: Blob;

  acceptedMimeTypes = acceptedMimeTypes;

  @action
  toggleCustomFont(useCustomFont: boolean) {
    this.useCustomFont = useCustomFont;
    if (useCustomFont && this.customFont) {
      this.args.model.customFont = this.customFont;
    } else if (!useCustomFont) {
      this.args.model.customFont = undefined;
    }
  }

  @action
  setCustomFontFile(file: File) {
    this.customFont = file;
    this.args.model.customFont = file;
  }

  @action
  onFontSettingsChange(fontName: string, variantName: Variant) {
    this.args.model.fontName = fontName;
    this.args.model.variantName = variantName;
  }
}
