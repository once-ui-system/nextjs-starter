import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import config from 'text2stl/config/environment';
const {
  APP: { availableLanguages },
} = config;

import { modifier } from 'ember-modifier';
import type { CalciteSegmentedControl } from '@esri/calcite-components/dist/components/calcite-segmented-control';
import { scheduleOnce } from '@ember/runloop';

interface LangSwitcherArgs {
  appearance?: 'outline-fill' | 'outline';
}

import IntlService from 'ember-intl/services/intl';
import { Registry as Services } from '@ember/service';

export default class LangSwitcher extends Component<LangSwitcherArgs> {
  @service declare intl: IntlService;
  @service declare router: Services['router'];

  availableLanguages = availableLanguages;

  @action
  changeLanguage(e: CustomEvent) {
    const lang = (e.target as CalciteSegmentedControl).value;
    this.router.replaceWith(this.router.currentRouteName, lang, {
      queryParams: {
        // Keep model settings
        modelSettings: this.router.currentRoute.queryParams.modelSettings,
      },
    });
  }

  // For some reason CalciteSegmentedControl "appearance" props can't be set by dom props
  // it need to be updated after the component render a first time...
  control?: CalciteSegmentedControl;
  changeAppearance = modifier((e: CalciteSegmentedControl) => {
    this.control = e;
    if (this.args.appearance) {
      scheduleOnce('afterRender', this, this.updateControlAppearance);
    }
  });
  updateControlAppearance() {
    if (!this.control || !this.args.appearance) {
      return;
    }

    this.control.appearance = this.args.appearance;
  }
}
