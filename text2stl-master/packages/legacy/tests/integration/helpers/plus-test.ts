import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | plus', function (hooks) {
  setupRenderingTest(hooks);

  test('it add 1 to value by default', async function (assert) {
    this.set('inputValue', '1234');
    await render(hbs`{{plus this.inputValue}}`);
    assert.dom().hasText('1235');
  });

  test('it add second parameter to value by default', async function (assert) {
    this.set('inputValue', '1234');
    await render(hbs`{{plus this.inputValue 100}}`);
    assert.dom().hasText('1334');
  });
});
