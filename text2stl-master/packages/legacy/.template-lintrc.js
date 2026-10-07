'use strict';

module.exports = {
  extends: 'recommended',
  rules: {
    'no-bare-strings': true,
    'no-invalid-interactive': {
      additionalInteractiveTags: ['calcite-button', 'calcite-action', 'calcite-text-area'],
    },
  },
  overrides: [
    {
      files: ['tests/**'],
      rules: {
        // these aren't helpful for testing
        'no-bare-strings': false,
        'no-inline-styles': false,
        'no-html-comments': false,
      },
    },
  ],
};
