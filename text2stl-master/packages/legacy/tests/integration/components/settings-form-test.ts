import Component from '@glimmer/component';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setComponentTemplate } from '@ember/component';
import { ModelType } from 'text2stl/services/text-maker';
import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | settings-form', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test('it renders', async function (assert) {
    class SettingsFormFont extends Component {}
    setComponentTemplate(
      // @ts-expect-error Type error ?
      hbs(`<div data-mocked-font data-model={{@model.name}} />`),
      SettingsFormFont,
    );
    this.owner.register('component:settings-form/font', SettingsFormFont);

    class HandleFormFont extends Component {}
    setComponentTemplate(
      // @ts-expect-error Type error ?
      hbs(`<div data-mocked-handle data-model={{@model.name}} />`),
      HandleFormFont,
    );
    this.owner.register('component:settings-form/handle', HandleFormFont);

    class SupportFormSettings extends Component {}
    setComponentTemplate(
      // @ts-expect-error Type error ?
      hbs(`<div data-mocked-support data-model={{@model.name}} />`),
      SupportFormSettings,
    );
    this.owner.register('component:settings-form/support', SupportFormSettings);

    class TextSettings extends Component {}
    setComponentTemplate(
      // @ts-expect-error Type error ?
      hbs(`<div data-mocked-text data-model={{@model.name}} />`),
      TextSettings,
    );
    this.owner.register('component:settings-form/text', TextSettings);

    class TypeSelectSettings extends Component {}
    setComponentTemplate(
      // @ts-expect-error Type error ?
      hbs(`<div data-mocked-type-select data-model={{@model.name}} />`),
      TypeSelectSettings,
    );
    this.owner.register('component:settings-form/type-select', TypeSelectSettings);

    this.set('model', { type: ModelType.TextOnly, name: 'the_model' });
    await render(hbs`<SettingsForm @model={{this.model}} @onFontChange="on_font_change" />`);

    assert.dom('calcite-block').exists({ count: 3 }, 'It render 3 blocks');
    assert.dom('[data-mocked-type-select]').exists('type-select block exists');
    assert.dom('[data-mocked-text]').exists('text block exists');
    assert.dom('[data-mocked-font]').exists('font block exists');
    assert.dom('[data-mocked-handle]').doesNotExist('handle block does not exist');
    assert.dom('[data-mocked-support]').doesNotExist('support block does not exist');

    this.set('model', { type: ModelType.TextWithSupport, name: 'the_model' });

    assert.dom('calcite-block').exists({ count: 5 }, 'It render 5 blocks');
    assert.dom('[data-mocked-type-select]').exists('type-select block exists');
    assert.dom('[data-mocked-text]').exists('text block exists');
    assert.dom('[data-mocked-font]').exists('font block exists');
    assert.dom('[data-mocked-handle]').exists('handle block exist');
    assert.dom('[data-mocked-support]').exists('support block exist');
  });
});
