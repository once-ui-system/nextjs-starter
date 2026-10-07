# text2stl

A browser-based 3D text generator: type text, pick a font, and export an STL/OBJ ready
for 3D printing. Everything runs client-side — text shaping via HarfBuzz (WASM),
glyph-to-geometry extrusion via three.js, no server backend. Currently being migrated
from Ember to Vite + Lit + Vitest; see `MIGRATION_PLAN.md` in this directory.

## Coding rules

- One file per class/component.
- Test files are colocated with what they test: `component.ts` → `component.test.ts`.
- Strict TS typing.
- No unnecessary comments — code should be self-documenting. Only comment the
  non-obvious *why*, never the *what*.
- File names are kebab-case and match their primary export/content.
- Prefer early returns over nested conditionals.

## Workflow

- Stop before staging or committing any file — let the human review and run
  `git add`/`git commit` themselves.
- Never manipulate git history without approval — no fast-forwarding a branch,
  rebasing, resetting, or similar, without asking first.
