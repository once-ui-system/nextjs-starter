import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import FontManagerService from 'text2stl/services/font-manager';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';

import type { Script, Variant, Category, Font } from 'text2stl/services/font-manager';
import type IntlService from 'ember-intl/services/intl';
import type { CalciteCombobox } from '@esri/calcite-components/dist/components/calcite-combobox';
import type { CalciteRadioButtonGroup } from '@esri/calcite-components/dist/components/calcite-radio-button-group';

interface UiFontPickerArgs {
  fontName: string;
  variantName: Variant;
  onFontSettingsChange: (name: string, variant: Variant) => void;
}

export default class UiFontPicker extends Component<UiFontPickerArgs> {
  @service declare fontManager: FontManagerService;
  @service declare intl: IntlService;

  @tracked fontCategory: Category;
  @tracked fontScript?: Script;
  @tracked sort: 'alphabet' | 'popularity' = 'popularity';

  get fontVariants() {
    return this.fontManager.fontList.get(this.args.fontName)?.variants ?? [];
  }

  constructor(owner: unknown, args: UiFontPickerArgs) {
    super(owner, args);
    this.fontCategory = this.fontManager.availableFontCategories[0];
  }

  // Get filtered & sorted font list
  get fontList() {
    const filteredList = [...this.fontManager.fontList.values()].filter((font: Font) => {
      if (font.category !== this.fontCategory) {
        return false;
      }
      if (this.fontScript && !font.scripts.includes(this.fontScript)) {
        return false;
      }

      return true;
    });

    if (this.sort === 'alphabet') {
      filteredList.sort((font1: Font, font2: Font): number =>
        font1.family.localeCompare(font2.family),
      );
    }

    return filteredList;
  }

  fontStyle(fontFamily: string) {
    return htmlSafe(`font-family: '${fontFamily}'`);
  }

  @action
  onFontNameChange(e: CustomEvent) {
    const fontName = (e.target as CalciteCombobox).value as string;
    // This is not supposed to happen (aka. not initiate by "calcite-combobox")
    // this happens when `fontName` change from outside of font-picker & actual filter are no longer returning a list containing `fontName`
    if (!fontName) {
      // Reset font-picker to current font
      const currentFont = this.fontManager.fontList.get(this.args.fontName);
      if (currentFont) {
        this.fontCategory = currentFont.category;
        this.fontScript = undefined;
        return;
      }
    }

    const font = this.fontManager.fontList.get(fontName);
    if (font) {
      this.args.onFontSettingsChange(fontName, font.variants[0]);
    } else {
      alert(`${this.intl.t('errors.font_load_generic')} (${this.intl.t('errors.unknown_font')})`);
    }
  }

  @action
  onVariantNameChange(e: CustomEvent) {
    const variantName = (e.target as CalciteCombobox).value as Variant;
    this.args.onFontSettingsChange(this.args.fontName, variantName);
  }

  @action
  onScriptChange(e: CustomEvent) {
    const v = (e.target as CalciteCombobox).value as Script | undefined;
    this.fontScript = v;
  }

  @action
  onFontCategoryChange(e: CustomEvent) {
    const v = (e.target as CalciteCombobox).value as Category;
    this.fontCategory = v;
  }

  @action
  onSortChange(e: CustomEvent) {
    const value = (e.target as CalciteRadioButtonGroup).selectedItem.value as
      | 'alphabet'
      | 'popularity';
    this.sort = value;
  }
}
