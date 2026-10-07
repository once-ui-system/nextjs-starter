import Component from '@glimmer/component';
import type TextMakerSettings from 'text2stl/models/text-maker-settings';
import { action } from '@ember/object';
import config from 'text2stl/config/environment';
const {
  APP: { textMakerDefault },
} = config;

import type { CalciteRadioButtonGroup } from '@esri/calcite-components/dist/components/calcite-radio-button-group';
import type { CalciteInputNumber } from '@esri/calcite-components/dist/components/calcite-input-number';

interface AdvancedSettingsFormTextSettingsArgs {
  model: TextMakerSettings;
}

export default class AdvancedSettingsFormTextSettings extends Component<AdvancedSettingsFormTextSettingsArgs> {
  handleTypes = ['none', 'hole', 'handle'];

  handlePosition = ['top', 'bottom', 'right', 'left'];

  get showHandleSettings() {
    return this.args.model.handleSettings.type !== 'none';
  }

  get showHandleSize2() {
    return this.args.model.handleSettings.type === 'handle';
  }

  get showHandleOffsetY() {
    return this.args.model.handleSettings.type === 'hole';
  }

  @action
  updateHandleType(e: CustomEvent) {
    const value = (e.target as CalciteRadioButtonGroup).selectedItem.value as
      | 'none'
      | 'hole'
      | 'handle';
    this.args.model.handleSettings.type = value;

    // reset some handle settings to "default"
    this.args.model.handleSettings.position = textMakerDefault.handleSettings.position;
    this.args.model.handleSettings.offsetX = textMakerDefault.handleSettings.offsetX;
    this.args.model.handleSettings.offsetY = textMakerDefault.handleSettings.offsetY;
    this.args.model.handleSettings.size = textMakerDefault.handleSettings.size;
    this.args.model.handleSettings.size2 = textMakerDefault.handleSettings.size2;
  }

  @action
  updateHandlePosition(e: CustomEvent) {
    const value = (e.target as CalciteRadioButtonGroup).selectedItem.value as
      | 'top'
      | 'bottom'
      | 'right'
      | 'left';

    this.args.model.handleSettings.position = value;
    this.args.model.handleSettings.offsetX = textMakerDefault.handleSettings.offsetX;
    this.args.model.handleSettings.offsetY = textMakerDefault.handleSettings.offsetY;
  }

  @action
  setHandleSettingsValue(props: 'size' | 'size2' | 'offsetX' | 'offsetY', e: CustomEvent) {
    const v = parseFloat((e.target as CalciteInputNumber).value);
    this.args.model.handleSettings[props] = isNaN(v) ? 0 : v;
  }
}
