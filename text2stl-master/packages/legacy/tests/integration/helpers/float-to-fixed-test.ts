import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | float-to-fixed', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.set('inputValue', 1.234);
    await render(hbs`<div id="test">{{float-to-fixed this.inputValue}}</div>`);
    assert.dom('#test').hasText('1.23');
  });
});
