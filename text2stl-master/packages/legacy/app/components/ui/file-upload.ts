import Component from '@glimmer/component';
import { guidFor } from '@ember/object/internals';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

interface UiFileUploadArgs {
  mimeTypes?: Array<string>;
  mimeTypeError?: string;

  dropZoneLabel: string;
  inputZoneLabel: string;

  onFileChange: (file: File) => void;
}

export default class UiFileUpload extends Component<UiFileUploadArgs> {
  id = guidFor(this);
  @tracked dropActive = false;

  get accept() {
    return this.args.mimeTypes?.join(' ') ?? undefined;
  }

  processFile(file: File) {
    if (file.type && this.args.mimeTypes && !this.args.mimeTypes.includes(file.type)) {
      if (this.args.mimeTypeError) {
        alert(this.args.mimeTypeError);
      }

      return;
    }

    this.args.onFileChange(file);
  }

  @action
  onDragOver(e: DragEvent) {
    e.preventDefault();
    this.dropActive = true;
  }

  @action
  onDropFile(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer?.items) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i].kind === 'file') {
          const file = e.dataTransfer.items[i].getAsFile();
          if (file) {
            this.processFile(file);
          }
        }
      }
    } else {
      if (e.dataTransfer?.files.length) {
        this.processFile(e.dataTransfer.files[0]);
      }
    }

    this.dropActive = false;
  }

  @action
  fileChange(e: InputEvent) {
    const target = e.target as HTMLInputElement;
    const file =
      target.files?.[0] || (target as HTMLInputElement & { mockedFiles: [File] }).mockedFiles?.[0]; // for test

    if (file) {
      this.processFile(file);
    }
  }
}
