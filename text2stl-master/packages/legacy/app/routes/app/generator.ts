import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import TextMakerSettings from 'text2stl/models/text-maker-settings';
import config from 'text2stl/config/environment';

import type FontManagerService from 'text2stl/services/font-manager';
import type HarfbuzzService from 'text2stl/services/harfbuzz';

const {
  APP: { textMakerDefault },
} = config;

export default class GeneratorRoute extends Route {
  @service declare fontManager: FontManagerService;
  @service declare harfbuzz: HarfbuzzService;

  queryParams = {
    modelSettings: {
      replace: true, // No history for model changes
    },
  };

  async model(params: { modelSettings: string }) {
    // Create a default settings for first rendering
    const model = new TextMakerSettings({
      ...textMakerDefault,
      supportPadding: { ...textMakerDefault.supportPadding },
      handleSettings: { ...textMakerDefault.handleSettings },
    });

    // Load model settings from QP if any
    if (params.modelSettings) {
      model.deserialize(params.modelSettings);

      // No custom font via QP
      model.customFont = undefined;
    }

    // Ensure font list is fully load
    await this.fontManager.loadFont();
    // Ensure emoji font is fully load
    await this.fontManager.loadEmojiFont();

    // Ensure harfbuzzJS is fully load (WASM loaded & lib instance created)
    await this.harfbuzz.loadWASM();

    return model;
  }

  afterModel() {
    document.querySelector('#app-loader')?.remove();
  }
}
