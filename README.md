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
