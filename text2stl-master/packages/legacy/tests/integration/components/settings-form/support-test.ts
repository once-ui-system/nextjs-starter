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

module('Integration | Component | advanced-settings-form/support', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test('it renders', async function (assert) {
    const model = new TextMakerSettings({
      ...textMakerDefault,
      type: ModelType.NegativeText,
    });
    this.set('model', model);

    await render(hbs`<SettingsForm::Support @model={{this.model}} />`);

    assert
      .dom('[data-test-settings-supportHeight]')
      .hasValue(`${model.supportHeight}`, 'It renders correct supportHeight value');
    await fillCalciteInput('[data-test-settings-supportHeight]', '456');
    assert.strictEqual(model.supportHeight, 456, 'model.supportHeight was updated');

    assert
      .dom('[data-test-settings-supportBorderRadius]')
      .hasValue(`${model.supportBorderRadius}`, 'It renders correct supportBorderRadius value');
    await fillCalciteInput('[data-test-settings-supportBorderRadius]', '789');
    assert.strictEqual(model.supportBorderRadius, 789, 'model.supportBorderRadius was updated');

    assert
      .dom('[data-test-advanced-support-padding]')
      .exists('It display advanced support padding switch')
      .isNotChecked('advanced support padding switch is not checked by default');

    assert
      .dom('[data-test-settings-supportPadding="top"]')
      .doesNotExist('top support padding field is not displayed');
    assert
      .dom('[data-test-settings-supportPadding="bottom"]')
      .doesNotExist('bottom support padding field is not displayed');
    assert
      .dom('[data-test-settings-supportPadding="left"]')
      .doesNotExist('left support padding field is not displayed');
    assert
      .dom('[data-test-settings-supportPadding="right"]')
      .doesNotExist('right support padding field is not displayed');

    assert
      .dom('[data-test-settings-supportPadding="basic"]')
      .hasValue(`${model.supportPadding.top}`, 'It renders correct supportPadding value');
    await fillCalciteInput('[data-test-settings-supportPadding="basic"]', '789');
    assert.strictEqual(model.supportPadding.top, 789, 'model.supportPadding.top was updated');
    assert.strictEqual(model.supportPadding.bottom, 789, 'model.supportPadding.bottom was updated');
    assert.strictEqual(model.supportPadding.left, 789, 'model.supportPadding.left was updated');
    assert.strictEqual(model.supportPadding.right, 789, 'model.supportPadding.right was updated');

    await click('[data-test-advanced-support-padding]');

    assert
      .dom('[data-test-settings-supportPadding="basic"]')
      .doesNotExist('Simple support padding input is no longer displayed');

    assert
      .dom('[data-test-settings-supportPadding="top"]')
      .hasValue(`${model.supportPadding.top}`, 'It renders correct top supportPadding value');
    await fillCalciteInput('[data-test-settings-supportPadding="top"]', '57');
    assert.strictEqual(model.supportPadding.top, 57, 'top supportPadding was updated');

    assert
      .dom('[data-test-settings-supportPadding="bottom"]')
      .hasValue(`${model.supportPadding.bottom}`, 'It renders correct bottom supportPadding value');
    await fillCalciteInput('[data-test-settings-supportPadding="bottom"]', '321');
    assert.strictEqual(model.supportPadding.bottom, 321, 'bottom supportPadding was updated');

    assert
      .dom('[data-test-settings-supportPadding="left"]')
      .hasValue(`${model.supportPadding.left}`, 'It renders correct left supportPadding value');
    await fillCalciteInput('[data-test-settings-supportPadding="left"]', '456');
    assert.strictEqual(model.supportPadding.left, 456, 'left supportPadding was updated');

    assert
      .dom('[data-test-settings-supportPadding="right"]')
      .hasValue(`${model.supportPadding.right}`, 'It renders correct right supportPadding value');
    await fillCalciteInput('[data-test-settings-supportPadding="right"]', '987');
    assert.strictEqual(model.supportPadding.right, 987, 'right supportPadding was updated');
  });
});
