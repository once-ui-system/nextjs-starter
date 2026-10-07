import { action } from '@ember/object';
import Component from '@glimmer/component';
import { ModelType } from 'text2stl/services/text-maker';

import type { CalciteSegmentedControl } from '@esri/calcite-components/dist/components/calcite-segmented-control';
import type TextMakerSettings from 'text2stl/models/text-maker-settings';

interface SettingsFormTypeSelectArgs {
  model: TextMakerSettings;
}

export default class SettingsFormTypeSelect extends Component<SettingsFormTypeSelectArgs> {
  types = Object.keys(ModelType)
    .filter((k) => !isNaN(Number(k)))
    .map((k) => Number(k));

  // handle ember-cli finger printing
  typeImages = {
    1: '/img/type_1.png',
    2: '/img/type_2.png',
    3: '/img/type_3.png',
    4: '/img/type_4.png',
  };

  get enableMultiline() {
    return this.args.model.type !== ModelType.VerticalTextWithSupport;
  }

  @action
  changeType(e: CustomEvent) {
    const type = parseInt((e.target as CalciteSegmentedControl).value, 10) as ModelType;

    this.args.model.type = type;
    if (!this.enableMultiline) {
      this.args.model.text = this.args.model.text.split('\n').join(' ');
    }

    // Force switch to bottom align when type is changed to vertical text
    if (type === ModelType.VerticalTextWithSupport) {
      this.args.model.vAlignment = 'bottom';
    }
  }
}
