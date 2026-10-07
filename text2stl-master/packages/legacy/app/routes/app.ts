import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { Registry as Services } from '@ember/service';

import type IntlService from 'ember-intl/services/intl';
import type FontManagerService from 'text2stl/services/font-manager';
import type HarfbuzzService from 'text2stl/services/harfbuzz';
import type RouterService from '@ember/routing/router-service';

type Transition = ReturnType<RouterService['transitionTo']>;

export default class AppRoute extends Route {
  @service declare intl: IntlService;
  @service declare router: Services['router'];
  @service declare fontManager: FontManagerService;
  @service declare harfbuzz: HarfbuzzService;

  constructor(props: object | undefined) {
    super(props);
    this.router.on('routeDidChange', (transition: Transition) => this.updateMeta(transition));
  }

  async model({ locale }: { locale: string }) {
    if (this.intl.locale[0] !== locale) {
      this.intl.locale = locale === 'en-us' ? locale : [locale, 'en-us'];
    }
    // No await here, let's the loading happen & await for it in generator route
    this.harfbuzz.loadWASM();
    this.fontManager.loadFont();
    this.fontManager.loadEmojiFont();
  }

  afterModel() {
    document.querySelector('#app-loader')?.remove();
  }

  updateMeta(transition: Transition) {
    const metaDescription = document.head.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (metaDescription) {
      metaDescription.content = this.intl.t('seo.description');
    }

    const toRouteName = transition.to?.name || 'app';
    const canonicalHref = this.router.urlFor(toRouteName, { locale: this.intl.primaryLocale });

    const canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonicalHref);
    }
  }
}
