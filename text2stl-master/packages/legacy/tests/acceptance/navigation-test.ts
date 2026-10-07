import { module, test } from 'qunit';
import { visit, currentURL, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import mockFontManager from 'text2stl/tests/helpers/mock-font-manager';

module('Acceptance | navigation', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    mockFontManager(this.owner);
  });

  test('visiting /', async function (assert) {
    await visit('/');
    assert.strictEqual(currentURL(), '/en-us', 'it redirect to "landing page"');

    await click('[data-test-generator]');
    assert.strictEqual(
      currentURL().split('?')[0], // get rid of QP
      '/en-us/generator',
      'it redirect to generator page',
    );
  });
});
