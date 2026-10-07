'use strict';

// eslint-ignore-newt-line @typescript-eslint/no-var-requires
const path = require('path');
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { Funnel } = require('broccoli-funnel');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // Ember-CLI otherwise derives the app's module namespace from
    // package.json's "name" field, which is "legacy" here (the yarn
    // workspace name) rather than the "text2stl" modulePrefix declared in
    // config/environment.js — pin it explicitly to keep them in sync.
    name: 'text2stl',
    inlineContent: {
      loader: 'app/loader.html',
    },

    autoImport: {
      exclude: ['jsdom-global'],
    },
  });

  // Import the calcite CSS into the app CSS
  app.import('node_modules/@esri/calcite-components/dist/calcite/calcite.css');

  // Funnel the calcite static assets into the build assets directory
  // (resolved via require, not a hardcoded node_modules path, since yarn
  // workspaces may hoist this dependency up to the repo root)
  const calcitePackageDir = path.dirname(require.resolve('@esri/calcite-components/package.json'));
  let calciteAssetsTree = new Funnel(path.join(calcitePackageDir, 'dist'), {
    srcDir: '/',
    include: ['calcite/assets/**'],
    destDir: '/assets',
  });

  return app.toTree([calciteAssetsTree]);
};
