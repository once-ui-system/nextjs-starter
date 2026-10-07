import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent, find, waitFor } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
// import wait from 'text2stl/tests/helpers/wait';

const validFile = new Blob(['foo', 'bar'], { type: 'my/mime_type' });
const invalidFile = new Blob(['foo', 'bar'], { type: 'another/mime_type' });

async function triggerDropForFile(target: string | Element, file: Blob) {
  await triggerEvent(target, 'drop', {
    dataTransfer: {
      types: ['Files'],
      files: [file],
    },
  });
}

module('Integration | Component | ui/file-upload', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.set('acceptedMimeTypes', ['toto', 'tata']);

    await render(hbs`<Ui::FileUpload
      @mimeTypes={{this.acceptedMimeTypes}}
      @dropZoneLabel="Drop here"
      @inputZoneLabel="or click here"
      data-test-main
    />`);

    const input = find('input[type=file]') as HTMLInputElement;

    assert.dom('[data-test-drop-zone-label]').hasText('Drop here');
    assert.dom('[data-test-input-label]').hasText('or click here').hasAttribute('for', input.id);

    assert.dom(input).hasAttribute('accept', 'toto tata');

    assert.dom('[data-test-main]').doesNotHaveAttribute('selected');
    await triggerEvent('[data-test-main]', 'dragover');
    await waitFor('[data-test-main][selected]');
    await triggerEvent('[data-test-main]', 'dragleave');
    await waitFor('[data-test-main]:not([selected])');
  });

  test('it handles file change for valid or invalid file type', async function (assert) {
    this.set('acceptedMimeTypes', ['my/mime_type']);
    this.set('onFileChange', function (f: File) {
      assert.step(`onFileChange:${f.type}`);
    });

    await render(hbs`<Ui::FileUpload
      @mimeTypes={{this.acceptedMimeTypes}}
      @onFileChange={{this.onFileChange}}
    />`);

    const input = find('input[type=file]') as HTMLInputElement & { mockedFiles: [Blob] };

    input.mockedFiles = [validFile];
    await triggerEvent('input[type="file"]', 'change');
    assert.verifySteps(['onFileChange:my/mime_type']);

    input.mockedFiles = [invalidFile];
    await triggerEvent('input[type="file"]', 'change');
    assert.verifySteps([]);
  });

  test('it handles file droping for valid or invalid file type', async function (assert) {
    this.set('acceptedMimeTypes', ['my/mime_type']);
    this.set('onFileChange', function (f: File) {
      assert.step(`onFileChange:${f.type}`);
    });

    await render(hbs`<Ui::FileUpload
      @mimeTypes={{this.acceptedMimeTypes}}
      @onFileChange={{this.onFileChange}}
      data-test-main
    />`);

    await triggerDropForFile('[data-test-main]', validFile);
    assert.verifySteps(['onFileChange:my/mime_type']);

    await triggerDropForFile('[data-test-main]', invalidFile);
    assert.verifySteps([]);
  });
});
