import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import IntlService from 'ember-intl/services/intl';

export default class IndexRoute extends Route {
  @service declare intl: IntlService;
  @service declare router: RouterService;

  async model() {
    this.router.transitionTo('app.index', this.intl.locale[0]);
  }
}
