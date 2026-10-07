import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { Mesh, BoxGeometry } from 'three';

module('Integration | Component | three-preview/renderer', function (hooks) {
  setupRenderingTest(hooks);

  test(`it render canvas at parent size`, async function (assert) {
    this.set('mesh', new Mesh(new BoxGeometry(12.12, 34.07, 56.42)));

    await render(hbs`<div style="width: 200px; height: 100px" data-test-renderer>
      <ThreePreview::Renderer @mesh={{this.mesh}} @parentSize={{this.parentSize}} />
    </div>`);

    const canvas = find('[data-test-renderer] canvas') as HTMLCanvasElement;

    assert.strictEqual(canvas.offsetWidth, 200, 'Canvas width is adapted to parent size');
    assert.strictEqual(canvas.offsetHeight, 100, 'Canvas height is adapted to parent size');
  });
});
