import Component from '@glimmer/component';
import { action } from '@ember/object';

import type { CalciteTextArea } from '@esri/calcite-components/dist/components/calcite-text-area';

interface SaveModalArgs {
  currentUrl: string;
  onHide?: () => void;
}

export default class SaveModal extends Component<SaveModalArgs> {
  @action
  selectAll({ target }: { target: CalciteTextArea }) {
    target.selectText();
  }
}
