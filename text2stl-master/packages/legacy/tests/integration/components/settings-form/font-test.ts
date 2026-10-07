import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerEvent, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setComponentTemplate } from '@ember/component';
import { tracked } from '@glimmer/tracking';
import templateOnly from '@ember/component/template-only';
import waitCalciteReady from 'text2stl/tests/helpers/wait-calcite-ready';
import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | settings-form/font', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test('it renders', async function (assert) {
    // mock the FontPicker
    const FontPicker = templateOnly();
    setComponentTemplate(
      // @ts-expect-error Type error ?
      hbs(`<div data-mocked-font-picker />`),
      FontPicker,
    );
    this.owner.register('component:ui/font-picker', FontPicker);

    class Model {
      fontName = 'initial_fontName';
      variantName = 'initial_variantName';
      @tracked customFont = undefined;
    }
    const model = new Model();
    this.set('model', model);

    await render(hbs`<SettingsForm::Font
      @model={{this.model}}
    />`);

    assert
      .dom('[data-test-custom-checkbox]')
      .isNotChecked('custom font ck is unchecked by default');
    assert.dom('[data-test-custom-font-upload]').doesNotExist('Custom font upload is not rendered');

    assert.dom('[data-mocked-font-picker]').exists('It renders font picker');

    await triggerEvent('[data-test-custom-checkbox]', 'calciteSwitchChange');
    await waitCalciteReady();

    assert.verifySteps([]);

    assert.dom('[data-test-custom-font-upload]').exists('Custom font upload is now rendered');
    assert
      .dom('[data-mocked-categories]')
      .doesNotExist('It no longer renders "categories" component');
    assert
      .dom('[data-mocked-font-name-select]')
      .doesNotExist('It no longer renders "font-name-select" component');
    assert
      .dom('[data-mocked-variant-name-select]')
      .doesNotExist('It no longer renders "variant-name-select" component');

    assert.dom('[data-test-custom-font-name]').hasValue('None', 'custom font name input is "None"');

    const fontFile = { type: 'font/otf', name: 'ainsi_font_font.otf' };

    await triggerEvent('[data-test-custom-font-upload]', 'drop', {
      dataTransfer: {
        types: ['Files'],
        files: [fontFile],
      },
    });

    // eslint-disable-next-line ember/no-settled-after-test-helper
    await settled(); // Needed to prevent an weird async release error

    assert.strictEqual(model.customFont, fontFile, 'model.customFont was update with font file');
    assert
      .dom('[data-test-custom-font-name]')
      .hasValue('ainsi_font_font.otf', 'custom font name input render custom font file name');

    // Switch back to google font
    await click('[data-test-custom-checkbox]');
    assert
      .dom('[data-test-custom-font-upload]')
      .doesNotExist('Custom font upload is no longer displayed');
    assert.dom('[data-mocked-font-picker]').exists('It renders font picker');
    assert.strictEqual(model.customFont, undefined, 'model.customFont was "reset" to undefined');

    // Switch back to custom font
    await click('[data-test-custom-checkbox]');
    await waitCalciteReady();

    assert.dom('[data-test-custom-font-upload]').exists('Custom font upload is now rendered');
    assert.dom('[data-mocked-font-picker]').doesNotExist('It no longer renders font picker');
    assert.strictEqual(model.customFont, fontFile, 'model.customFont was update with font file');
    assert
      .dom('[data-test-custom-font-name]')
      .hasValue('ainsi_font_font.otf', 'custom font name input render custom font file name');
  });
});
