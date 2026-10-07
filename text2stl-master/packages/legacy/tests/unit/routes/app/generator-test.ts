import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import TextMakerSettings from 'text2stl/models/text-maker-settings';
import config from 'text2stl/config/environment';
import Service from '@ember/service';

import type GeneratorRoute from 'text2stl/routes/app/generator';
const {
  APP: { textMakerDefault },
} = config;

module('Unit | Route | app/generator', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register(
      'service:font-manager',
      class extends Service {
        async loadFont() {}
        async loadEmojiFont() {}
      },
    );
  });

  test('it creates a model with default values & fetch default font', async function (assert) {
    const route = this.owner.lookup('route:app/generator') as GeneratorRoute;

    const model = await route.model({ modelSettings: '' });

    assert.propEqual(model, new TextMakerSettings(textMakerDefault), 'settings model is conform');
  });

  test('it creates a model according to QP', async function (assert) {
    const route = this.owner.lookup('route:app/generator') as GeneratorRoute;

    const qpModel = new TextMakerSettings(textMakerDefault);
    qpModel.text = 'something';
    qpModel.size = 999;
    qpModel.supportPadding.left = 10;
    qpModel.supportPadding.right = 23;
    qpModel.handleSettings.type = 'hole';
    qpModel.handleSettings.offsetX = 55;

    const modelSettings = qpModel.serialize();

    const model = await route.model({ modelSettings });

    assert.propEqual(model, qpModel, 'settings model is conform to QP');
  });
});
