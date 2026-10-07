/* eslint-disable no-await-in-loop */
import { module, test } from 'qunit';
import { visit, waitFor } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import testsSettings from './_tests-settings';
import percySnapshot from '@percy/ember';
import TextMakerSettings from 'text2stl/models/text-maker-settings';
import mockFontManager from 'text2stl/tests/helpers/mock-font-manager';
import waitCalciteReady from 'text2stl/tests/helpers/wait-calcite-ready';
import wait from 'text2stl/tests/helpers/wait';

module('Visual | percy', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    mockFontManager(this.owner);
  });

  for (let testIdx = 0; testIdx < testsSettings.length; testIdx++) {
    test(`visual test #${testIdx + 1}`, async function (assert) {
      const settings = new TextMakerSettings(testsSettings[testIdx]);
      const settingsQP = settings.serialize();
      // Load test settings through QP
      await visit(`/en-us/generator?modelSettings=${settingsQP}`);
      await waitCalciteReady();
      await waitFor('[data-test-export-stl]:not([loading])');
      await wait(250);
      await percySnapshot(`visual test #${testIdx + 1}`);
      assert.true(true);
    });
  }
});
