import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import type TextMakerSettings from 'text2stl/models/text-maker-settings';
import type { CalciteInputNumber } from '@esri/calcite-components/dist/components/calcite-input-number';

interface SupportFormTextSettingsArgs {
  model: TextMakerSettings;
}

export default class SupportFormTextSettings extends Component<SupportFormTextSettingsArgs> {
  supportPosition = ['top', 'bottom', 'right', 'left'];
  supportPositionIcon = {
    top: 'upload-to',
    bottom: 'download-to',
    right: 'right-edge',
    left: 'left-edge',
  };

  @tracked _advancedSupportPadding: undefined | boolean;

  get advancedSupportPadding() {
    if (this._advancedSupportPadding !== undefined) {
      return this._advancedSupportPadding;
    }

    return this.args.model.supportPadding.isCustom;
  }

  set advancedSupportPadding(o: boolean) {
    this._advancedSupportPadding = o;
  }

  get supportPadding() {
    return this.args.model.supportPadding?.top ?? 0;
  }

  set supportPadding(v: number) {
    v = isNaN(v) ? 0 : Math.max(0, v);
    this.args.model.supportPadding.top = v;
    this.args.model.supportPadding.bottom = v;
    this.args.model.supportPadding.left = v;
    this.args.model.supportPadding.right = v;
  }

  @action
  setNumber(props: 'supportHeight' | 'supportBorderRadius', e: CustomEvent) {
    const v = parseFloat((e.target as CalciteInputNumber).value);
    this.args.model[props] = isNaN(v) ? undefined : v;
  }

  @action
  setSupportPadding(e: CustomEvent) {
    const v = parseFloat((e.target as CalciteInputNumber).value);
    this.supportPadding = v;
  }

  @action
  setSupportPaddingDir(props: 'top' | 'bottom' | 'right' | 'left', e: CustomEvent) {
    const v = parseFloat((e.target as CalciteInputNumber).value);
    this.args.model.supportPadding[props] = isNaN(v) ? 0 : v;
  }

  @action
  toggleAdvancedSupportPadding() {
    this.advancedSupportPadding = !this.advancedSupportPadding;
    if (!this.advancedSupportPadding) {
      this.supportPadding = this.args.model.supportPadding.top;
    }
  }
}
