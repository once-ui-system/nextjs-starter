import Component from '@glimmer/component';
import { action } from '@ember/object';

interface SaveModalArgs {
  currentUrl: string;
  onHide?: () => void;
}

export default class SaveModal extends Component<SaveModalArgs> {
  @action
  selectAll({ target }: { target: HTMLTextAreaElement }) {
    target.select();
  }
}
