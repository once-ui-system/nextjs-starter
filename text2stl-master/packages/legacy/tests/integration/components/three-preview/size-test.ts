import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { Mesh, BoxGeometry } from 'three';
import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | tree-preview/size', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test('it renders nothing when no mesh is specified', async function (assert) {
    await render(hbs`<ThreePreview::Size data-test />`);
    assert.dom().hasNoText();
  });

  test('it renders mesh size information mesh is specified', async function (assert) {
    this.set('mesh', new Mesh(new BoxGeometry(12.12, 34.07, 56.42)));

    await render(hbs`<ThreePreview::Size @mesh={{this.mesh}} />`);

    assert
      .dom()
      .hasText(
        'Print size : 12.1 x 34.1 x 56.4 mm',
        'Size informations are shown according to mesh',
      );
  });
});
