import EmberRouter from '@ember/routing/router';
import config from 'text2stl/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('app', { path: '/:locale' }, function () {
    this.route('generator');
  });
});
