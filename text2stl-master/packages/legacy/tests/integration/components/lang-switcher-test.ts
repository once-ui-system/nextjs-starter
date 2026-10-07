import Component from '@glimmer/component';
import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setComponentTemplate } from '@ember/component';
import config from 'text2stl/config/environment';
const {
  APP: { availableLanguages },
} = config;
import waitCalciteReady from 'text2stl/tests/helpers/wait-calcite-ready';
import { setupIntl } from 'ember-intl/test-support';

import type IntlService from 'ember-intl/services/intl';

module('Integration | Component | lang-switcher', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  hooks.afterEach(function () {
    (this.owner.lookup('service:intl') as IntlService).locale = 'en-us';
  });

  test('it renders', async function (assert) {
    this.owner.register(
      'service:router',
      class extends Service {
        currentRouteName = 'the.current.route';
      },
    );

    class MyLinkTo extends Component {}
    setComponentTemplate(
      // @ts-expect-error Type error ?
      hbs(`<a ...attributes href="#" data-route={{@route}} data-model={{@model}}>{{yield}}</a>`),
      MyLinkTo,
    );

    this.owner.register('component:link-to', MyLinkTo);

    await render(hbs`<LangSwitcher class="my-custom-class" />`);
    await waitCalciteReady();

    assert
      .dom('calcite-segmented-control')
      .exists('it renders a calcite-segmented-control')
      .hasClass('my-custom-class', 'it applies custom attribute');

    assert
      .dom('[data-test-language-switcher] calcite-segmented-control-item')
      .exists({ count: availableLanguages.length }, 'available languages are render as link');

    assert
      .dom('calcite-segmented-control-item[data-test-lang="en-us"]')
      .hasAttribute('checked', '', 'Current locale (EN) is "selected“');

    assert
      .dom('calcite-segmented-control-item[data-test-lang="fr-fr"]')
      .doesNotHaveAttribute('checked', 'FR is not "selected“');

    (this.owner.lookup('service:intl') as IntlService).locale = ['fr-fr'];
    await settled();
    await waitCalciteReady();

    assert
      .dom('calcite-segmented-control-item[data-test-lang="fr-fr"]')
      .hasAttribute('checked', '', 'Current locale (FR) is "selected“');
    assert
      .dom('calcite-segmented-control-item[data-test-lang="en-us"]')
      .doesNotHaveAttribute('checked', 'EN is not "selected“');
  });
});
