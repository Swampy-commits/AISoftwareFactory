# AISoftwareFactory

Features are written as specs in `specs/` and built from them, by hand or by the
spec-build workflow (`.github/workflows/spec-build.yml`), which runs Claude when
a spec with Status `Ready for build` lands on `main`.

## Conventions
- Node.js 22, ES modules (`.mjs`), **no runtime or dev dependencies** unless a spec
  requires one. Tests use the built-in `node:test` runner.
- Static output: pages are generated at build time into `dist/` by
  `scripts/build.mjs` and deployed to GitHub Pages by `.github/workflows/ci.yml`.
  The site root (`dist/index.html`) is the Ireland depth chart; new pages go
  alongside it (e.g. `dist/<feature>/index.html`) and must not break it.
- Data files live in `data/` and are validated before building; invalid data must
  fail the build with a message saying what and where.
- Every acceptance criterion in a spec gets at least one test, named
  `ACn: ...` so it can be traced back to the spec.
- Keep `npm run validate`, `npm test` and `npm run build` passing.
- Escape all text from data files before putting it in HTML.
- Accessibility: semantic headings and lists, WCAG AA contrast, works at 375px wide.

## Commands
- `npm run build` — validate data and build `dist/`
- `npm run validate` — validate data only
- `npm test` — run all tests
