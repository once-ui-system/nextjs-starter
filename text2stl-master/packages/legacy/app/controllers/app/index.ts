import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { Registry as Services } from '@ember/service';

export default class AppIndexController extends Controller {
  @service declare router: Services['router'];

  @action
  gotoGenerator() {
    this.router.transitionTo('app.generator');
  }
}
