'use strict';

module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'text2stl',
    environment,
    rootURL: '/',
    locationType: 'history',
    EmberENV: {
      EXTEND_PROTOTYPES: false,
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
    },

    gTag: {
      tag: 'G-47QBQ5GB3Y',
      // forceEnable: true, // For testing
    },

    'ember-toggle': {
      includedThemes: ['default'],
    },

    APP: {
      textMakerDefault: {
        fontName: 'Roboto',
        variantName: 'regular',
        text: '🤍Hello !🔥',
        size: 45,
        height: 10,
        spacing: 2,
        vSpacing: 0,
        alignment: 'center',
        vAlignment: 'default',
        type: 2,
        supportHeight: 5,
        supportBorderRadius: 5,
        supportPadding: {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        },

        handleSettings: {
          type: 'none',
          position: 'top',
          size: 10,
          size2: 2,
          offsetX: 0,
          offsetY: 0,
        },
      },

      threePreviewSettings: {
        backgroundColor: 0xe1e8f5,
        groundColor: 0x999999,
        gridSize: 2000,
        gridDivisions: 100,
        gridColor1: 0x3187f0,
        gridColor2: 0xf1f1f1,
        meshParameters: {
          color: 0xfa7f01,
        },
      },

      googleFontApiKey: process.env.GOOGLE_FONT_API_KEY,

      availableLanguages: ['en-us', 'fr-fr'],

      countApi: {
        namespace: 'text2stl',
        key:
          environment === 'development' || environment === 'test'
            ? 'test_stl'
            : process.env.COUNTAPI_API_KEY,
      },
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // Use the preview URL if it's a netlify preview deploy, production URL otherwise
    ENV.rootURL =
      process.env.CONTEXT === 'deploy-preview'
        ? process.env.DEPLOY_PRIME_URL
        : 'https://text2stl.mestres.fr/';
  }

  return ENV;
};
