import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, waitFor, waitUntil } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import config from 'text2stl/config/environment';
const {
  APP: { textMakerDefault },
} = config;
import TextMakerSettings from 'text2stl/models/text-maker-settings';
import { ModelType } from 'text2stl/services/text-maker';
import fillCalciteInput from 'text2stl/tests/helpers/fill-calcite-input';
import waitCalciteReady from 'text2stl/tests/helpers/wait-calcite-ready';
import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | advanced-settings-form/handle', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test('it renders', async function (assert) {
    const model = new TextMakerSettings({
      ...textMakerDefault,
      type: ModelType.TextWithSupport,
    });
    this.set('model', model);

    await render(hbs`<SettingsForm::Handle @model={{this.model}} />`);
    await waitCalciteReady();

    assert.dom('[data-test-handle-type-item]').exists('it render handle type radio group');

    assert
      .dom('[data-test-handle-settings]')
      .doesNotExist('it does not render handle settings when handle-type is "none"');

    await click('[data-test-handle-type-item] [data-test-value="hole"]');
    await waitUntil(() => model.handleSettings.type === 'hole', { timeout: 5000 });
    await waitCalciteReady();
    await waitFor('[data-test-handle-position]', { timeout: 5000 });
    assert.dom('[data-test-handle-position]').exists('it show handle-position input');
    assert.dom('[data-test-settings-handle-size]').exists('it show handle-size input');
    assert.dom('[data-test-settings-handle-offsetX]').exists('it show handle-offsetX input');
    assert.dom('[data-test-settings-handle-offsetY]').exists('it show handle-offsetY input');
    assert.strictEqual(model.handleSettings.type, 'hole', 'handle type was updated');

    assert
      .dom('[data-test-settings-handle-size2]')
      .doesNotExist('it does not render handle size 2 when handle type is "hole"');

    await click('[data-test-handle-type-item] [data-test-value="handle"]');
    assert.strictEqual(model.handleSettings.type, 'handle', 'handle type was updated');
    assert.dom('[data-test-handle-position]').exists('it show handle-position input');
    assert.dom('[data-test-settings-handle-size]').exists('it show handle-size input');
    assert.dom('[data-test-settings-handle-offsetX]').exists('it show handle-offsetX input');
    assert
      .dom('[data-test-settings-handle-offsetY]')
      .doesNotExist('it does not show handle-offsetY input');
    assert
      .dom('[data-test-settings-handle-size2]')
      .exists('it renders handle size 2 when handle type is "handle"');

    assert
      .dom(`[data-test-handle-position] [data-test-value="${model.handleSettings.position}"]`)
      .isChecked('It checks correct handle position value');

    assert
      .dom('[data-test-settings-handle-size]')
      .hasValue(`${model.handleSettings.size}`, 'It render correct handle size value');
    await fillCalciteInput('[data-test-settings-handle-size]', '123');
    assert.strictEqual(model.handleSettings.size, 123, 'handle size was updated');

    assert
      .dom('[data-test-settings-handle-size2]')
      .hasValue(`${model.handleSettings.size2}`, 'It render correct handle size2 value');
    await fillCalciteInput('[data-test-settings-handle-size2]', '321');
    assert.strictEqual(model.handleSettings.size2, 321, 'handle size2 was updated');

    assert
      .dom('[data-test-settings-handle-offsetX]')
      .hasValue(`${model.handleSettings.offsetX}`, 'It render correct handle offsetX value');
    await fillCalciteInput('[data-test-settings-handle-offsetX]', '456');
    assert.strictEqual(model.handleSettings.offsetX, 456, 'handle offsetX was updated');

    await click('[data-test-handle-position] [data-test-value="bottom"]');
    assert.strictEqual(model.handleSettings.position, 'bottom', 'handle position was updated');
    assert.strictEqual(
      model.handleSettings.offsetX,
      textMakerDefault.handleSettings.offsetX,
      'handle offsetX was reset to a default value',
    );
    assert.strictEqual(
      model.handleSettings.offsetY,
      textMakerDefault.handleSettings.offsetY,
      'handle offsetY was reset to a default value',
    );

    await click('[data-test-handle-type-item] [data-test-value="hole"]');
    assert.strictEqual(
      model.handleSettings.position,
      'top',
      'handle position was reset to a default value',
    );
    assert.strictEqual(
      model.handleSettings.offsetX,
      textMakerDefault.handleSettings.offsetX,
      'handle offsetX was reset to a default value',
    );
    assert.strictEqual(
      model.handleSettings.offsetY,
      textMakerDefault.handleSettings.offsetY,
      'handle offsetY was reset to a default value',
    );

    await click('[data-test-handle-position] [data-test-value="left"]');
    assert.strictEqual(model.handleSettings.position, 'left', 'handle position was updated');
    assert.strictEqual(
      model.handleSettings.offsetX,
      textMakerDefault.handleSettings.offsetX,
      'handle offsetX was reset to a default value',
    );
    assert.strictEqual(
      model.handleSettings.offsetY,
      textMakerDefault.handleSettings.offsetY,
      'handle offsetY was reset to a default value',
    );
  });
});
