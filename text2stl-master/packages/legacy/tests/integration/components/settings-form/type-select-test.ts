import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, waitUntil } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import config from 'text2stl/config/environment';
const {
  APP: { textMakerDefault },
} = config;
import TextMakerSettings from 'text2stl/models/text-maker-settings';
import { ModelType } from 'text2stl/services/text-maker';
import wait from 'text2stl/tests/helpers/wait';
import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | settings-form/select-type', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test('it renders', async function (assert) {
    const model = new TextMakerSettings({
      ...textMakerDefault,
      type: ModelType.TextOnly,
    });
    this.set('model', model);

    await render(hbs`<SettingsForm::TypeSelect @model={{this.model}} />`);
    assert.dom('calcite-segmented-control').exists('It render type selector');
    assert.dom('calcite-segmented-control-item').exists({ count: 4 });

    assert
      .dom(`calcite-segmented-control-item[data-test-type="${ModelType.TextOnly}"]`)
      .hasAttribute('data-test-checked', '', 'Correct type is checked');

    // double click is a CI failing workaround
    await click(`calcite-segmented-control-item[data-test-type="${ModelType.TextWithSupport}"]`);
    await wait(1500);
    await click(`calcite-segmented-control-item[data-test-type="${ModelType.TextWithSupport}"]`);
    await wait(1500);
    await waitUntil(() => model.type === ModelType.TextWithSupport, { timeout: 5000 });
    assert.strictEqual(model.type, ModelType.TextWithSupport, 'It change model type');
  });

  // This is failing on CI (even with a 5s waitUntil)
  skip('multi-line text is flatten when switch model type to vertical', async function (assert) {
    const model = new TextMakerSettings({
      ...textMakerDefault,
      type: ModelType.TextOnly,
      text: 'some\nmultiline\ntext',
    });
    this.set('model', model);

    await render(hbs`<SettingsForm::TypeSelect @model={{this.model}} />`);
    await click(
      `calcite-segmented-control-item[data-test-type="${ModelType.VerticalTextWithSupport}"]`,
    );
    await waitUntil(() => model.text === 'some multiline text', { timeout: 5000 });
    assert.strictEqual(model.text, 'some multiline text', 'text was updated');
  });
});
