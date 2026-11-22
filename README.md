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

Open `dist/index.html` in a browser, or host the `dist/` folder on any static host.

## Updating the depth chart

Edit [`data/depth-chart.json`](data/depth-chart.json) by hand, then run `npm run build`.

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
