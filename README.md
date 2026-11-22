# Ireland Rugby Depth Chart

A static page showing the Ireland men's senior rugby team depth chart: the
pecking order at every position, with unavailable players greyed out.

Spec: [`specs/irish-rugby-depth-chart.md`](specs/irish-rugby-depth-chart.md)

## Usage

Requires Node.js 20 or later. There are no dependencies to install.

```bash
npm run build      # validate data/depth-chart.json and write dist/index.html
npm run validate   # validate the data file only
npm test           # run the tests
```

Open `dist/index.html` in a browser to preview locally.

## CI and hosting

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every pull request and push to `main`:

1. validates `data/depth-chart.json`
2. runs the tests
3. builds the page

On `main`, if all three pass, the built page is deployed to **GitHub Pages** at
<https://swampy-commits.github.io/AISoftwareFactory/>.
A broken data file or failing test blocks the deploy, so the live page is never broken.

One-time setup: in the repo on GitHub, **Settings → Pages → Build and deployment → Source** must be set to **GitHub Actions**.

## Building features from specs (automated)

New features start as a spec in `specs/`. Copy [`specs/_template.md`](specs/_template.md),
write the feature description, decisions and acceptance criteria, and leave
**Status** as `Draft` while you work on it.

When the spec is ready, set its Status to **`Ready for build`** and push it to `main`.
[`.github/workflows/spec-build.yml`](.github/workflows/spec-build.yml) then:

1. finds the spec files in the push whose Status is `Ready for build`
2. runs Claude Code on a new `spec-build/<spec>-<run>` branch to implement the spec,
   add tests for each acceptance criterion, and set the Status to `Implemented`
3. re-runs validation, tests and build itself
4. commits, pushes and opens a pull request with a summary of what was built
   (as a draft if any check failed)
5. starts CI on the new branch so its checks appear on the PR

You review and merge the PR as normal; merging deploys the result. Because the
merged spec now says `Implemented`, it doesn't trigger another build.

To rebuild a spec by hand: **Actions → Build from spec → Run workflow**, enter the
spec path, and tick *force* if its Status isn't `Ready for build`.

Claude follows the project conventions in [`CLAUDE.md`](CLAUDE.md).

### One-time setup
- **Claude token:** run `claude setup-token` on your own machine and save the result as a
  repository secret named `CLAUDE_CODE_OAUTH_TOKEN`
  (**Settings → Secrets and variables → Actions → New repository secret**).
- **Claude GitHub App** installed on this repository (https://github.com/apps/claude).
- **Let Actions open PRs:** **Settings → Actions → General → Workflow permissions** →
  tick **Allow GitHub Actions to create and approve pull requests**.

## Updating the depth chart

Edit [`data/depth-chart.json`](data/depth-chart.json) by hand and run `npm run build` to check it. Once merged to `main`, the live page updates automatically.

- Change the order of ids in a position's `depth` list to change the ranking (first = first choice).
- Add `"status": "Injured"` (or any short text) to a player to grey them out; remove it when they're available.
- Update `lastUpdated` to today's date.

If the file has a mistake, the build stops and lists each problem and where it is.

## Layout

| Path | What it is |
|------|------------|
| `data/depth-chart.json` | The depth chart data (hand-maintained) |
| `src/validate.mjs` | Checks the data file against the spec |
| `src/render.mjs` | Renders the page HTML and styles |
| `src/positions.mjs` | Fixed position → unit mapping and pitch layout |
| `scripts/build.mjs` | Build / validate command |
| `test/` | Tests, mapped to the spec's acceptance criteria |
| `.github/workflows/ci.yml` | CI checks and GitHub Pages deploy |
| `.github/workflows/spec-build.yml` | Builds features from specs with Claude and opens PRs |
| `scripts/find-ready-specs.mjs` | Picks which specs a push should build |
| `specs/_template.md` | Template for new specs |
| `CLAUDE.md` | Project conventions for Claude |
