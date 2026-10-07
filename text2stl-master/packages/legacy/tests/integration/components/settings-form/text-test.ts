import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import config from 'text2stl/config/environment';
const {
  APP: { textMakerDefault },
} = config;
import TextMakerSettings from 'text2stl/models/text-maker-settings';
import { ModelType } from 'text2stl/services/text-maker';
import fillCalciteInput from 'text2stl/tests/helpers/fill-calcite-input';
import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | settings-form/text', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test('it renders', async function (assert) {
    const model = new TextMakerSettings({
      ...textMakerDefault,
      type: ModelType.TextOnly,
    });
    this.set('model', model);

    await render(hbs`<SettingsForm::Text @model={{this.model}} />`);

    assert.dom('[data-test-settings-text]').hasValue(model.text, 'It renders correct text value');
    await fillCalciteInput('[data-test-settings-text]', 'Updated');
    assert.strictEqual(model.text, 'Updated', 'model.text was updated');

    assert
      .dom('[data-test-settings-size]')
      .hasValue(`${model.size}`, 'It renders correct size value');
    await fillCalciteInput('[data-test-settings-size]', '123');
    assert.strictEqual(model.size, 123, 'model.size was updated');

    assert
      .dom('[data-test-settings-height]')
      .hasValue(`${model.height}`, 'It renders correct height value');
    await fillCalciteInput('[data-test-settings-height]', '456');
    assert.strictEqual(model.height, 456, 'model.height was updated');

    assert
      .dom('[data-test-settings-spacing]')
      .hasValue(`${model.spacing}`, 'It renders correct spacing value');
    await fillCalciteInput('[data-test-settings-spacing]', '789');
    assert.strictEqual(model.spacing, 789, 'model.spacing was updated');

    assert
      .dom(
        `[data-test-settings-text-valignment] calcite-radio-button[data-test-value="${model.vAlignment}"]`,
      )
      .hasAttribute('checked', '', 'current textAlignment radio is checked');
    await click(
      '[data-test-settings-text-valignment] calcite-radio-button[data-test-value="bottom"]',
    );
    assert.strictEqual(model.vAlignment, 'bottom', 'model.vAlignment was updated');
  });

  for (const { type, inputType, title } of [
    { type: ModelType.TextOnly, inputType: 'calcite-text-area', title: 'TextOnly' },
    { type: ModelType.NegativeText, inputType: 'calcite-text-area', title: 'NegativeText' },
    { type: ModelType.TextWithSupport, inputType: 'calcite-text-area', title: 'TextWithSupport' },
    {
      type: ModelType.VerticalTextWithSupport,
      inputType: 'calcite-input-text',
      title: 'VerticalTextWithSupport',
    },
  ]) {
    test(`Text input type depends on model Type [${title}]`, async function (assert) {
      const model = new TextMakerSettings({
        ...textMakerDefault,
        type,
      });
      this.set('model', model);

      await render(hbs`<SettingsForm::Text @model={{this.model}} />`);
      assert.dom(`${inputType}[data-test-settings-text]`).exists(`It renders a ${inputType}`);
    });
  }

  test('Text alignment & vertical spacing are shown when text is multiline', async function (assert) {
    const model = new TextMakerSettings({
      ...textMakerDefault,
      type: ModelType.TextOnly,
      text: 'some\nmultiline\ntext',
    });
    this.set('model', model);

    await render(hbs`<SettingsForm::Text @model={{this.model}} />`);

    assert.dom('[data-test-settings-text-alignment]').exists();
    assert
      .dom(
        `[data-test-settings-text-alignment] calcite-radio-button[data-test-value="${model.alignment}"]`,
      )
      .isChecked('current textAlignment radio is checked');

    assert
      .dom('[data-test-settings-vspacing]')
      .hasValue(`${model.vSpacing}`, 'It renders correct vspacing value');
    await fillCalciteInput('[data-test-settings-vspacing]', '237');
    assert.strictEqual(model.vSpacing, 237, 'model.vspacing was updated');
  });
});
