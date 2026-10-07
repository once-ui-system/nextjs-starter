# Ember → Vite + Lit Migration Plan

Working document. We iterate on this together — phases can be reordered, split, or
re-scoped as we learn things. Check off tasks as they land; leave notes inline when a
step turns out different than planned.

## Goal

Replace the current Ember 5 (Octane, classic Broccoli/webpack build, QUnit/Testem) app
with a Vite + Lit + Vitest app, following the phased plan below.

## Why this app migrates comfortably

From the codebase survey, a few things make this smaller than a typical Ember migration:

- **No ember-data, no ember-concurrency.** State is a handful of plain `@tracked`
  classes and 4 services; there's no ORM/store layer to replace.
- **No server backend.** Everything runs client-side (Google Fonts API, HarfBuzz WASM,
  three.js) and exports a Blob download. Nothing here is Ember-specific at the network
  layer.
- **UI chrome is already Web Components.** `@esri/calcite-components` is Stencil-built,
  framework-agnostic. Ember templates just proxy attributes/events into it
  (`{{on 'calciteXxx' ...}}`); Lit's `@property`/`@event` bindings map onto this almost
  mechanically. This is the single biggest reason the UI layer isn't a rewrite risk.
- **Small surface.** ~14 components, 3 routes, 4 services, 1 state model, 2 modifiers.
  Not a large CRUD app.
- **Dead weight to drop, not port:** `matter-js`, `poly-decomp` (no imports found
  anywhere in `app/`), and the `countApi` config block (README already flags the API as
  gone). Confirm during Phase 6 and delete rather than migrate.

## Target stack

- **Build:** Vite
- **UI:** Lit (custom elements, no separate template compiler)
- **State:** plain Lit `ReactiveController`s + a small signals-like primitive for shared
  state (no external state library, per your preference) — see Phase 7.
- **Routing:** no router library. The existing `/:locale` and `/:locale/generator` URL
  structure is kept exactly as-is (it's referenced externally) and is owned by a small
  hand-written app-shell element that reads/writes `location.pathname` directly — see
  the routing design in Phase 2.
- **i18n:** `intl-messageformat` directly, reusing the existing ICU-format YAML files
  as-is — see rationale in Phase 1.
- **Tests:** Vitest throughout — plain Vitest on Node for logic-only tests (services,
  core, state, routing, i18n), Vitest Browser Mode (`@vitest/browser` + Playwright)
  for component tests, since Calcite's Shadow DOM/async hydration needs real-browser
  fidelity that jsdom/happy-dom can't reliably provide. One runner, one config family,
  written alongside each phase's own work rather than backfilled at the end — see
  "Testing, as we go" below and Phase 8.

## Testing, as we go

There's no standalone "port the tests" phase — every phase below ships its own tests
as part of that phase's exit criteria, the same way the current Ember suite has
per-layer tests (unit/integration/acceptance). Concretely: Phase 1 tests the i18n
lookup, Phase 2 tests the routing/parsing logic in isolation, Phases 5-7 unit-test
services/core/state as they're ported, Phase 8 unit/component-tests each leaf element
standalone, and Phase 9 (Binding) adds the integration/end-to-end coverage that needs
the real pieces wired together (equivalent to today's `tests/acceptance/*`). Percy
visual regression is a separate decision, resolved in Phase 10 where it's wired into CI.

## Repo structure: monorepo

The repo becomes a Yarn workspaces monorepo (Yarn 1, matching the existing
`yarn.lock` — no need for Berry, Nx, or Turborepo at this size):

```
package.json            # workspace root: "workspaces": ["packages/*"], shared scripts
packages/
  legacy/                # the current Ember app, moved as-is, untouched
    app/ tests/ config/ translations/ public/ types/
    ember-cli-build.js testem.js .ember-cli tsconfig.json package.json ...
  app/                    # the new Vite + Lit + Vitest app, built from Phase 0 on
    src/ tests/ vite.config.ts vitest.config.ts package.json ...
README.md LICENSE CODEOWNERS .github/               # stay at root
```

- `packages/legacy` is a straight `git mv` of everything Ember-specific, history
  preserved, **zero behavior changes**. Its own `package.json` carries the Ember
  dependencies and the existing `build`/`start`/`test`/`lint` scripts unchanged.
- `packages/app` is the new project from Phase 0 onward — everything in the phases
  below now targets `packages/app/` instead of a bare `src/` at the root.
- Root `package.json` becomes thin: workspace declaration, plus fan-out scripts
  (`yarn workspace legacy <script>`, `yarn workspace app <script>`) and any repo-wide
  tooling (e.g. a shared Prettier config) that both packages want.
- **"Turn the switch" (Phase 11)** becomes a deploy-config change, not a file-deletion
  commit: point Netlify's base directory / build command at `packages/app` instead of
  `packages/legacy`. `packages/legacy` can be kept around for a bake/rollback period
  and deleted in a separate follow-up once the cutover is confirmed stable.

## Sequencing, as agreed

This is a shell-first ("outside-in") order: get a real, navigable, styled app running
early with placeholder content, port the business logic in isolation in parallel, then
bind the two together in a dedicated phase — rather than porting business logic first
and only assembling a working screen at the very end.

1. Move the Ember app into `packages/legacy` unchanged; set up the workspace
   (**Phase 0**).
2. Stand up i18n and the routing mechanism as tested, standalone building blocks — no
   UI wired up yet (**Phases 1-2**).
3. Build a real, navigable app shell with placeholder screens, then style it — an
   early, demoable skeleton that proves composition/routing/i18n/theming work together
   before any business logic exists (**Phases 3-4**).
4. Port the business logic in isolation and fully unit-tested, independent of UI:
   services, framework-agnostic core, state model (**Phases 5-7**).
5. Build and test every leaf UI component standalone (**Phase 8**).
6. **Binding** (**Phase 9**): replace the shell's placeholders with the real
   components, wired to the real state/services — this is where the app becomes
   feature-complete, with integration tests to match.
7. Build/CI/deploy parity (**Phase 10**), then cut over and clean up (**Phase 11**).

`packages/legacy` keeps running and shipping exactly as today throughout — nothing
about it changes until the deploy target flips in Phase 11.

## Phases

### Phase 0 — Monorepo split + scaffold

- [x] Add `"workspaces": ["packages/*"]` to root `package.json`.
- [x] `git mv app tests config translations public types packages/legacy/`, same for
      `ember-cli-build.js`, `testem.js`, `.ember-cli`, `tsconfig.json`, `.percy.js`, and
      the Ember-specific `package.json` contents (deps + `build`/`start`/`test`/`lint`
      scripts move into `packages/legacy/package.json`). Use `git mv` file-by-file (not
      a directory rewrite) so history is preserved per file.
      Also moved (not in the original list, but needed for correctness):
      `.eslintrc.js`, `.eslintignore`, `.stylelintrc.js`, `.stylelintignore`,
      `.template-lintrc.js`, `.watchmanconfig` — see notes below.
- [x] **Validate immediately:** `yarn workspace legacy start`, `yarn workspace legacy
      build`, `yarn workspace legacy test` all still work unchanged from the new
      location. Ember-CLI is layout-sensitive (addon resolution, broccoli watched
      trees, hoisted `node_modules`) — treat this as the riskiest step in the whole
      plan and land it as its own isolated, easily-revertable commit before anything
      else changes.
      Landed in commit `c71fbb6`. Three real bugs surfaced and were fixed along the way:
      1. `.eslintignore` doesn't cascade upward like `.eslintrc.js` does — ESLint only
         reads it from cwd, so once `eslint .` ran with cwd=`packages/legacy`, it
         stopped ignoring `dist/` and ground for ~11 minutes re-formatting a 1.3MB
         build artifact via `prettier/prettier`. Fixed by moving the lint/style ignore
         *and* config files into `packages/legacy` alongside the app.
      2. `ember-cli-build.js` funneled calcite-components' static assets via a literal
         `./node_modules/@esri/calcite-components/dist` path; yarn hoists that package
         to the repo-root `node_modules`, so the literal path silently stopped
         resolving. Fixed via `require.resolve('@esri/calcite-components/package.json')`.
      3. `EmberApp`'s module namespace defaults to `package.json`'s `name` field, which
         is now `"legacy"` (the workspace name) instead of `"text2stl"` — diverging
         from the `modulePrefix: 'text2stl'` in `config/environment.js` and breaking
         module resolution (e.g. `text2stl/tests/test-helper` not found). Fixed by
         pinning `name: 'text2stl'` explicitly in the `EmberApp` constructor options.
      Also: `.gitignore`'s patterns (`/dist/`, `/node_modules/`, etc.) were anchored to
      the repo root with a leading `/`, so they no longer matched the same directories
      one level down in `packages/legacy`. Un-anchored them so they apply at any depth.
      Remaining known gap: `.eslintrc.js`'s `ignorePatterns: ['tests/fixtures/meshs']`
      now resolves relative to `packages/legacy` (where the config file lives), which
      is correct, but wasn't specifically re-verified against an actual
      `tests/fixtures/meshs` directory — low risk, revisit if lint ever mis-ignores it.
      `ember serve` and `ember build` both verified serving/building correctly from the
      new location (HTTP 200 on `/` and `/hb.wasm`). Test suite: 46/48 pass; the 2
      failures are "Error creating WebGL context" from headless Chrome having no GPU in
      this sandbox — reproduced consistently across runs, unrelated to the file move.
- [x] ~~Repoint Netlify's build base directory / build command at `packages/legacy`~~
      **Superseded by a simpler approach:** rather than touching Netlify's dashboard
      config now (no `netlify.toml` in the repo, and Claude has no access to it
      anyway), the root `build` script builds `packages/legacy` as before and then
      moves its output from `packages/legacy/dist` back to `/dist` at the repo root —
      so `yarn build`'s output path is byte-identical to pre-migration and Netlify
      needs zero config changes for this branch. Revisit only if/when Netlify's build
      base actually needs to move (e.g. Phase 11 cutover).
- [x] `packages/app/`: Vite + Lit + TypeScript scaffold, `vite.config.ts`.
- [x] Vitest wired up in `packages/app/` (`vitest.config.ts`), one smoke test passing.
      (`src/scaffold.test.ts` — temporary, delete once Phase 1 lands the first real
      test.)
- [x] ESLint/Prettier/stylelint for `packages/app/` — reuse root-level shared config
      where it makes sense (e.g. Prettier), package-local config where Ember and Lit
      conventions diverge (ESLint, TS).
      `.prettierrc.js` and `.stylelintrc.js`/`.stylelintignore` are shared from the repo
      root (the latter two moved back there from `packages/legacy`, where they'd been
      swept up by mistake in the earlier move — see commit `e1a8cb3`). ESLint is
      package-local (`packages/app/eslint.config.js`) — this package pulled in
      ESLint 10, which requires flat config, so it can't share `packages/legacy`'s
      classic `.eslintrc.js` even in principle. `stylelint` isn't wired into
      `packages/app`'s own `lint` script yet since there's no CSS to lint (Lit uses
      `static styles` in `.ts` files); revisit in Phase 4 when real stylesheets land.
      **Node version note:** `packages/app`'s toolchain (vite 8, vitest 5, eslint 10,
      and transitively `yargs@18`) requires Node >=20.19 or >=22.12. This sandbox's
      default Node (20.1.0, via nvm) doesn't qualify — nor does this repo's own
      `volta` pin of 20.14.0, which isn't installed here either. Per the user's
      direction, this was resolved by using Node 22.14.0 (already available via nvm)
      for `packages/app` work, without changing the repo's root `engines`/`volta`/
      `.node-version` — those still target `packages/legacy`'s validated baseline.
      Whoever picks up later phases needs Node >=22.12 on their machine/CI runner to
      work on `packages/app`; `packages/legacy` was spot-checked to still boot under
      Node 22 too, but wasn't re-run through its full build/lint/test suite on
      anything but Node 20.1.0.
- [x] Confirm `packages/app` runs via `yarn workspace app dev` alongside
      `yarn workspace legacy start`, both serving without port conflicts.
      Verified: Vite on `:5173`, Ember on `:4200`/`:4201`, both HTTP 200 simultaneously.
- **Exit criteria:** `packages/legacy` builds/serves/tests identically to the
  pre-monorepo app and is the confirmed live deploy; `packages/app` has a green empty
  Vite/Lit/Vitest scaffold next to it.

### Phase 1 — i18n

**Decided: `intl-messageformat` directly**, not `@lit/localize`. `ember-intl` is built
on the FormatJS stack and already ships ICU-format strings as YAML — `intl-messageformat`
is the library that actually parses/formats ICU messages, so the existing translation
files need zero conversion. `@lit/localize` would require an extraction/build step
(its `lit-localize-tools` CLI, `msg()`-wrapped call sites) and a different message
format, for no real payoff at 2 statically-known locales. This also matches the "no
extra dependency unless it earns it" line taken for state and routing.

- [ ] Add `intl-messageformat` as a dependency of `packages/app`.
- [ ] Port `translations/en-us.yaml` / `fr-fr.yaml` from `packages/legacy/translations/`
      into `packages/app/` unchanged (parsed at build/runtime via a small YAML import,
      e.g. Vite's built-in YAML support or `js-yaml`).
- [ ] Build a small `t(key, params?)` helper (or directive) that looks up the pattern
      for the current locale, feeds it to `IntlMessageFormat`, and caches compiled
      formatters per `(locale, key)` — usable by any Lit component from Phase 3 onward.
- [ ] **Tests:** given a key + locale, the right ICU-formatted string comes back,
      including at least one interpolation/pluralization case (matching real usage in
      the YAML files), for both `en-us` and `fr-fr`.
- **Exit criteria:** a tested `t()` exists for both locales, ready to be wired into the
  app shell in Phase 3. (Call sites in individual components get filled in as those
  components are built — Phases 3, 8, 9 — not a single sweep here.)

### Phase 2 — "Routing" mechanism

The current URL structure is kept **exactly** as it is today — `/:locale` and
`/:locale/generator` (e.g. `/en-us`, `/fr-fr/generator`) — because it's already
referenced externally (bookmarks, shared links, the `modelSettings` query-param share
mechanism). This is not a redesign, just a reimplementation of the same URLs without
`@ember/routing`, built here as a standalone, tested module before any UI consumes it.

- [ ] **Parsing.** A function that splits `location.pathname` into
      `{ locale, view? }` (`view` is `'generator'` or absent — matches today's two leaf
      routes exactly).
- [ ] **Redirect-from-`/` logic.** If the locale segment is missing or isn't one of
      `config.availableLanguages` (`en-us`, `fr-fr`), compute a default locale the same
      way the current `index` route does (`intl.locale`/`navigator.language` matched
      against available languages, falling back to `en-us`), then resolve the target
      `/:locale[/generator]` path (preserving a trailing `/generator` if present).
      Applied via `history.replaceState` (not `pushState`, so it doesn't create a
      back-button entry — matches today's `transitionTo` behavior).
- [ ] **`navigate(path)`.** Updates internal `{ locale, view }` state, calls
      `history.pushState(null, '', path + location.search)` (preserving the
      `modelSettings` query param), and signals that a re-render + meta
      description/canonical-`<link>` update (currently done on `routeDidChange`) should
      happen.
- [ ] **Locale switch.** Rewrites just the first path segment (keeps `/generator` and
      the query string intact) and calls `navigate()`.
- [ ] **Back/forward.** A `popstate` listener re-runs the parsing step — no separate
      state to reconcile, since the URL is the only source of truth.
- [ ] Package the above as one small module/`ReactiveController` (e.g. `AppLocation`)
      with no rendering logic of its own — `<app-shell>` in Phase 3 consumes it.
- [ ] Note for Phase 3/9: check whether any current Ember template uses `<LinkTo>` for
      the start→generator transition. If so, its Lit replacement must be a click
      handler calling `navigate()` (or an `<a>` with `click` intercepted via
      `preventDefault()`), not a plain `href` — a bare anchor would force a full page
      reload since nothing intercepts navigation.
- [ ] **Tests:** pathname → `{ locale, view }` parsing, the `/` redirect resolution,
      `navigate()`'s resulting `pushState`/`replaceState` calls, and the locale-segment
      rewrite — all testable without rendering anything.
- **Exit criteria:** routing logic is fully unit-tested standalone, ready to be wired
  into `<app-shell>` in Phase 3.

### Phase 3 — Page composition & app shell with placeholder

- [ ] `application.hbs` → root `<app-shell>` custom element, wiring in the Phase 2
      routing module.
- [ ] `app/index` (start screen) and `app/generator` (main app) → two Lit view stubs
      with **placeholder** content — just enough markup (e.g. a heading and a "Start"
      button wired to `navigate()`) to prove the flow. Real leaf components aren't
      wired in until Phase 9.
- [ ] Meta description / canonical `<link>` update wired to fire on every `navigate()`
      call, using Phase 1's `t()` for the placeholder copy.
- [ ] Manual click-through check: `/en-us` ↔ `/en-us/generator`, locale switch, browser
      back/forward — all working against placeholder content.
- **Exit criteria:** `packages/app` is navigable end-to-end in a real browser — correct
  URLs, working back/forward, working locale switch — with placeholder screens, before
  any business logic or real components exist.

### Phase 4 — Styling & assets

- [ ] Port `app.scss`/`_spacing.scss` (small, global, no component-scoped styles today
      — decide whether to keep them global or start scoping into component
      `static styles` where it's low-cost).
- [ ] Calcite CSS + static asset funnel (icons/fonts) → Vite equivalent
      (`vite-plugin-static-copy` or serve from `node_modules` via a configured public
      dir).
- [ ] Dark/light theme toggle (`calcite-mode-dark` class + `localStorage`) ported as-is.
- [ ] `public/hb.wasm`, `public/NotoEmoji-Regular.ttf` copied over (assets only at this
      point — not consumed by real code until Phases 5-9).
- **Exit criteria:** the Phase 3 shell has visual parity with the Ember app's
  chrome/theme, even though its screens are still placeholders.

### Phase 5 — Services → plain classes

- [ ] `services/harfbuzz.ts` (28 lines, WASM loader) → plain module, `hb.wasm` served
      from Vite's `public/` (should work unchanged).
- [ ] `services/file-exporter.ts` (59 lines) → plain class/functions, no DI.
- [ ] `services/font-manager.ts` (317 lines) → plain class; keep the Google Fonts
      list/CSS-fetch/font-cache logic, drop Ember service injection in favor of a
      constructed singleton (or module-level instance) that Lit components import
      directly or receive via a reactive controller (see Phase 7).
- [ ] `services/text-maker.ts` (533 lines, core geometry generation) → plain class,
      same treatment. **Depends on the geometry/export helpers ported in Phase 6**
      (`misc/threejs/*`, `misc/create-shape-fixed.ts`) — in practice, port the specific
      pieces `text-maker.ts` imports as part of this phase's work even though they're
      formally listed under Phase 6, or just do Phases 5 and 6 in the same work
      session.
- [ ] Drop the `countApi` config block entirely (confirmed dead).
- [ ] **Tests:** port the corresponding unit tests (`file-exporter`, `font-manager`) to
      Vitest.
- **Exit criteria:** all 4 services run and are tested with no Ember import anywhere,
  instantiable from plain TS.

### Phase 6 — Port framework-agnostic core (no Ember involved)

Everything here already has zero Ember dependency per the survey; this is a copy +
import-path fix, not a rewrite. Source paths below are under `packages/legacy/app/...`
(post Phase 0 move); destination is `packages/app/src/...`.

- [ ] `misc/threejs/*` (vendored `OrbitControls.js`, `STLExporter.js`,
      `OBJExporter.js`, `BufferGeometryUtils.js`) → copy as-is; diff against upstream
      three.js examples first to confirm which local patches exist and must be preserved.
- [ ] `misc/create-shape-fixed.ts` (custom SVG→THREE.Shape hole detection) → copy
      as-is.
- [ ] `misc/extract-emoji.ts`, `misc/support-shape-generation.ts` → copy as-is.
- [ ] `helpers/float-to-fixed.ts`, `helpers/plus.ts` → copy as plain functions
      (drop Ember helper wrapper).
- [ ] Confirm `matter-js`/`poly-decomp` are genuinely unused (re-grep in the new context)
      and drop them from `package.json` rather than port.
- [ ] **Tests:** port the existing QUnit tests for `extract-emoji` to Vitest (use as the
      Vitest-conventions template), plus coverage for the other pieces above.
- **Exit criteria:** the geometry/export pipeline exists in the new tree with tests,
  callable from a scratch script, entirely independent of any UI framework. (If Phase 5
  already pulled some of this forward out of necessity, this phase is where it gets
  finished off and fully tested.)

### Phase 7 — State model + async-derived-state pattern

- [ ] Port `models/text-maker-settings.ts` (`TextMakerSettings`,
      `SupportPaddingSettings`, `HandleSettings`) off `@glimmer/tracking`'s `@tracked`
      onto a Lit-friendly reactive primitive. Options to evaluate: a small custom
      signal (getter/setter pair that notifies subscribers) vs. exposing the model as a
      `ReactiveController` that hosts register with. Keep `serialize()`/`deserialize()`
      (the query-param round-trip is the app's share/bookmark mechanism).
- [ ] Replace `ember-resources`' `trackedFunction` (used for the async `font` and `mesh`
      derivations in the generator controller) with a small custom
      `AsyncTaskController` (a `ReactiveController` that runs an async function on
      dependency change, exposes `.value`/`.error`/`.pending`, and calls
      `host.requestUpdate()` on settle). This is the one idiom without a Lit built-in —
      write it once, reuse for both `font` and `mesh`.
- [ ] **Tests:** state model (tracked field changes, `serialize()`/`deserialize()`
      round-trip) and the async task controller (pending/value/error transitions).
- **Exit criteria:** state model + async derivation pattern exist and are tested in
  isolation, ready for components to consume.

### Phase 8 — Leaf UI components (bottom-up)

**Decided: Vitest Browser Mode** (`@vitest/browser`, Playwright provider), not
`@web/test-runner` + `@open-wc/testing`. Calcite components are Stencil-built with real
Shadow DOM and async hydration (today's suite needs a `wait-calcite-ready` helper even
running in actual headless Chrome via Testem) — jsdom/happy-dom have known gaps with
Stencil's hydration and shadow-boundary behavior, so a simulated DOM risks flaky or
subtly-wrong component tests. Vitest Browser Mode keeps everything on one test runner
(same `vitest` command and config family as every other phase) while still executing
in a real browser for the fidelity Calcite needs. `@testing-library/dom` is used for
query ergonomics inside those tests, not as a competing runner choice.

- [ ] Set up `@vitest/browser` + Playwright for `packages/app`, scoped to component
      test files (logic-only tests from earlier phases keep running on plain Node —
      no need to move them to the browser).
- [ ] Spike 1-2 real components first (e.g. `ui/font-picker`, one `settings-form/*`
      piece using a Calcite input) to confirm the hydration-wait pattern translates
      cleanly before porting the rest.

Order the rest roughly by dependency depth, shallowest first:

- [ ] `ui/file-upload`, `ui/font-picker` (standalone UI primitives)
- [ ] `settings-form/*` subcomponents (5 of them)
- [ ] `three-preview/renderer`, `three-preview/size` (currently exposed via Ember's
      yield-with-hash compound-component pattern — reimplement in Lit as two sibling
      custom elements composed by the parent, or slots if that reads more naturally)
- [ ] `lang-switcher`, `theme-switcher`
- [ ] Remaining top-level components
- [ ] Modifiers → Lit equivalents:
  - `modifiers/three-renderer.ts` (213 lines, drives the whole Three.js scene) →
    lifecycle hooks (`firstUpdated`/`updated`) on the `three-preview/renderer` element,
    or a small custom directive if reused elsewhere.
  - `modifiers/scrollable-input-number.ts` (wheel-to-increment) → a Lit directive or
    inline event listener.
- [ ] **Tests:** each component gets its own test as it's ported, rendered/verified
      standalone (not yet inside the app shell — that's Phase 9).
- **Exit criteria:** every current Ember component has a tested Lit equivalent,
  verified standalone. None are wired into `<app-shell>` yet.

### Phase 9 — Binding

Everything up to here was built and tested in isolation: shell with placeholders
(Phase 3), services/core/state (Phases 5-7), leaf components (Phase 8). This phase
wires them all together into the actual working app.

- [ ] Replace the Phase 3 placeholders in `<app-shell>`'s two views with the real
      Phase 8 components.
- [ ] Wire components to the state model + `AsyncTaskController` (Phase 7) and to the
      services/core pipeline (Phases 5-6).
- [ ] `modelSettings` query-param sharing mechanism wired end-to-end using the model's
      `serialize()`/`deserialize()` (Phase 7).
- [ ] Loading/preload sequencing (font list + emoji font + HarfBuzz WASM await) ported
      from the current route's `beforeModel`/`model` hooks into the generator view's
      `connectedCallback`/an init routine.
- [ ] Replace all remaining placeholder copy with real `t()` calls (Phase 1) across
      every now-real component.
- [ ] **Tests:** integration/end-to-end coverage for the flows currently in
      `tests/acceptance/navigation-test.ts` and `_tests-settings.ts` — start →
      generator, settings changes → mesh regeneration, export/download.
- **Exit criteria:** the new app is click-through functional end to end in dev, full
  feature parity with `packages/legacy`, side by side with it still running.

### Phase 10 — Build, CI, deploy

- [ ] `vite build` in `packages/app` replacing `ember build`; confirm `hb.wasm`/Calcite
      assets/fonts all land in `packages/app/dist/` correctly.
- [ ] Netlify config: a second Netlify site (or a second build context pointed at
      `packages/app`) for previewing the new app pre-cutover, confirming
      `rootURL`-equivalent behavior (`DEPLOY_PRIME_URL`) and the SPA fallback
      (`public/_redirects`) work from the new package's output dir — kept separate from
      `packages/legacy`'s still-live production deploy.
- [ ] **Google Fonts API key: carry over unchanged, out of scope for this migration.**
      The key is already client-exposed today (`.env` → `config/environment.js`); this
      migration reproduces that with `GOOGLE_FONT_API_KEY` wired through Vite's
      `import.meta.env`, same exposure, no worse than today. Fixing it properly means
      either restricting the key by HTTP referrer in Google Cloud Console (a config-only
      change, doable independently of this migration, worth doing regardless) or
      proxying the Google Fonts calls through a serverless function (real new
      infrastructure, and would undo the "no server backend" property that makes this
      app simple — track as a separate follow-up if ever wanted, not part of this plan).
- [ ] **Percy: keep, but only wire into CI once Phase 9 (Binding) is done.** Percy
      screenshots against `packages/app` would show near-100% diffs through Phases 3-9
      while the UI is placeholder/partially-wired — pure noise. Add the Percy CI step
      here, at the point where `packages/app` is feature-complete, so its first real
      run is a meaningful visual-parity check against the `packages/legacy` baseline
      ahead of Phase 11's cutover.
- [ ] `.github/workflows/ci.yml` updated to run both workspaces: lint/build/test for
      `packages/legacy` stays exactly as today; add equivalent jobs (`vitest run`,
      lint, Percy per above) for `packages/app`.
- **Exit criteria:** CI green across both workspaces; `packages/app` has its own working
  preview deploy, fully independent of `packages/legacy`'s production deploy.

### Phase 11 — Cutover & cleanup

- [ ] Final parity check: `packages/app` vs. `packages/legacy`, side-by-side manual pass
      plus test-suite comparison.
- [ ] **Turn the switch:** repoint the production Netlify site's base directory/build
      command from `packages/legacy` to `packages/app`. This is the entire cutover —
      no code moves, easy to revert by pointing back if something's wrong.
- [ ] Bake period: keep `packages/legacy` in the repo (not deployed) for a rollback
      window.
- [ ] Once confident: delete `packages/legacy` entirely, collapse the workspace back to
      a single package if there's no more reason to keep the monorepo split (fold
      `packages/app` back up to the repo root, or leave the workspace structure in
      place — revisit based on whether a second package still adds value at that point).
- [ ] Update `README.md` (build/dev/test instructions, badges, repo structure).
- **Exit criteria:** production serves the Vite/Lit/Vitest app; Ember is fully gone from
  the repo.

## Risks / things to watch

- **Moving Ember into `packages/legacy` (Phase 0) is the highest-risk single step in
  the whole plan**, despite touching zero application logic — Ember-CLI's addon
  resolution and `node_modules` hoisting assumptions can break under a workspace nest.
  Land it as its own commit, validate build/serve/test immediately, and confirm the
  production deploy before starting any new-app work.
- **Calcite hydration timing.** Existing tests need `wait-calcite-ready` because Stencil
  components hydrate asynchronously; the Lit event/property wiring needs the same
  care, not just at test time but at first paint (avoid reading Calcite component
  properties before `componentOnReady()`/upgrade).
- **`three-renderer` modifier** is the most complex single piece of imperative DOM code
  (213 lines) — budget real time for Phase 8's port of it, not a quick pass.
- **Vendored three.js example patches** (Phase 6) — confirm what's actually been
  hand-modified vs. copy-pasted unmodified from upstream before assuming a
  straight copy is safe.
- **Services/core ordering (Phases 5-6).** `text-maker.ts` (Phase 5) depends on the
  geometry helpers formally listed under Phase 6 — treat these two phases as one
  combined work session rather than strictly sequential.
- Keep the Ember app deployable at every phase boundary until Phase 11 — no phase
  should leave the repo in a state where neither app builds.
