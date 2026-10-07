[![Netlify Status](https://api.netlify.com/api/v1/badges/84ec36dc-4fef-4f8f-b482-b0b1d550baba/deploy-status)](https://app.netlify.com/sites/text2stl/deploys)


# text2stl

Generate STL with text easily !

Inspired from : https://github.com/mo22/textstl

## TODO : 

- [ ] get rid of "counter" service (api no longer available ?)
- [ ] finalize tests (font-picker, theme switcher...)
- [ ] UI state as QP (open/close panel)
- [ ] See some improvements asked in GH issues

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://cli.emberjs.com/release/)
* [Google Chrome](https://google.com/chrome/)

### Google font api key

To be able to run the app, you'll need to generate a [Google Fonts API key](https://developers.google.com/fonts/docs/developer_api#APIKey).

Then set the key as environment variable before running the `ember serve` command :
* `export GOOGLE_FONT_API_KEY="your-key-here"`


## Installation

* `git clone <repository-url>` this repository
* `cd text2stl`
* `npm install`

## Contribute

To write...

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

**Update Percy snaphost**

Run `yarn percy exec:start`, then run `ember test` or `ember test --server` & visit http://127.0.0.1:4200/tests?filter=Acceptance%20%7C%20visual.

Note: You'll need `PERCY_TOKEN` variable defined in your env.

### Linting

* `npm run lint`
* `npm run lint:fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)


## Usefull links

* [three.js](https://threejs.org/)
* [ember.js](https://emberjs.com/)
* [ember-cli](https://cli.emberjs.com/release/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
