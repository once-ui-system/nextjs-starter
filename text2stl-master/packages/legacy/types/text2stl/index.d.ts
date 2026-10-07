import Route from '@ember/routing/route';

declare global {
  // interface Array<T> extends Ember.ArrayPrototypeExtensions<T> {}
  // interface Function extends Ember.FunctionPrototypeExtensions {}

  type Resolved<P> = P extends Promise<infer T> ? T : P;
  export type RouteModel<R extends Route> = Resolved<ReturnType<R['model']>>;
}

export {};
