import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setComponentTemplate } from '@ember/component';
import Component from '@glimmer/component';
import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | three-preview', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test('it renders', async function (assert) {
    class ThreePreviewRenderer extends Component {}
    setComponentTemplate(
      // @ts-expect-error Type error ?
      hbs(`<div three-preview-renderer data-mesh={{@mesh}} />`),
      ThreePreviewRenderer,
    );
    this.owner.register('component:three-preview/renderer', ThreePreviewRenderer);

    class ThreePreviewSize extends Component {}
    setComponentTemplate(
      // @ts-expect-error Type error ?
      hbs(`<div three-preview-size data-mesh={{@mesh}} />`),
      ThreePreviewSize,
    );
    this.owner.register('component:three-preview/size', ThreePreviewSize);

    await render(hbs`<ThreePreview @mesh="my_mesh" as |preview|>
      <preview.renderer />
      <preview.size />
    </ThreePreview>`);

    assert
      .dom('[three-preview-renderer]')
      .exists('It yield the "renderer" component')
      .hasAttribute('data-mesh', 'my_mesh', 'Mesh is passed to "renderer" child component');
    assert
      .dom('[three-preview-size]')
      .exists('It yield the "size" component')
      .hasAttribute('data-mesh', 'my_mesh', 'Mesh is passed to "size" child component');
  });
});
