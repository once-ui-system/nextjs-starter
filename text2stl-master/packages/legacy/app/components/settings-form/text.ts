import Component from '@glimmer/component';
import { action } from '@ember/object';
import { ModelType } from 'text2stl/services/text-maker';

import type TextMakerSettings from 'text2stl/models/text-maker-settings';
import type { CalciteInputNumber } from '@esri/calcite-components/dist/components/calcite-input-number';
import type { CalciteRadioButtonGroup } from '@esri/calcite-components/dist/components/calcite-radio-button-group';
import type { CalciteInputText } from '@esri/calcite-components/dist/components/calcite-input-text';

import type { TextMakerAlignment, TextMakerVerticalAlignment } from 'text2stl/services/text-maker';

interface TextFormTextSettingsArgs {
  model: TextMakerSettings;
}

export default class TextFormTextSettings extends Component<TextFormTextSettingsArgs> {
  get enableMultiline() {
    return this.args.model.type !== ModelType.VerticalTextWithSupport;
  }

  get textIsMultiLine() {
    return this.args.model.text.split('\n').length > 1;
  }

  alignmentOptions: TextMakerAlignment[] = ['left', 'center', 'right'];
  vAlignmentOptions: TextMakerVerticalAlignment[] = ['default', 'top', 'bottom'];

  @action
  setNumber(props: 'size' | 'height' | 'spacing' | 'vSpacing', e: CustomEvent) {
    const v = parseFloat((e.target as CalciteInputNumber).value);
    this.args.model[props] = isNaN(v) ? undefined : v;
  }

  @action
  setAlignment(e: CustomEvent) {
    const v = (e.target as CalciteRadioButtonGroup).selectedItem.value as TextMakerAlignment;
    this.args.model.alignment = v;
  }

  @action
  setVAlignment(e: CustomEvent) {
    const v = (e.target as CalciteRadioButtonGroup).selectedItem
      .value as TextMakerVerticalAlignment;
    this.args.model.vAlignment = v;
  }

  @action
  changeText(e: CustomEvent) {
    this.args.model.text = (e.target as CalciteInputText).value;
  }
}
