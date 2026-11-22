import { UNITS } from './positions.mjs';

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function ordinal(n) {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  return `${n}${{ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] ?? 'th'}`;
}

export function formatDate(iso) {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

function renderPlayer(player, rank) {
  const unavailable = player.status !== undefined;
  const classes = ['player', rank === 1 ? 'first' : 'backup', unavailable ? 'unavailable' : '']
    .filter(Boolean)
    .join(' ');
  const caps = `${player.caps} ${player.caps === 1 ? 'cap' : 'caps'}`;
  const status = unavailable
    ? `<span class="status">${escapeHtml(player.status)}</span>`
    : '';
  return `<li class="${classes}">
          <span class="rank">${ordinal(rank)}</span>
          <span class="who">
            <span class="name">${escapeHtml(player.name)}</span>${status}
            <span class="meta">${escapeHtml(player.club)} · ${caps}</span>
          </span>
        </li>`;
}

function renderPosition(pos, players) {
  const items = pos.depth.map((id, i) => renderPlayer(players[id], i + 1)).join('\n        ');
  return `<section class="position" aria-labelledby="pos-${pos.number}">
      <h3 id="pos-${pos.number}"><span class="num">${pos.number}</span> ${escapeHtml(pos.name)}</h3>
      <ol class="depth">
        ${items}
      </ol>
    </section>`;
}

/** Render the whole depth chart page as a self-contained HTML document. */
export function renderPage(data) {
  const byNumber = Object.fromEntries(data.positions.map((p) => [p.number, p]));

  const units = UNITS.map((unit) => {
    const slug = unit.name.toLowerCase().replace(/[^a-z]+/g, '-');
    const positions = unit.layout.map((n) => renderPosition(byNumber[n], data.players)).join('\n    ');
    return `<section class="unit cols-${unit.layout.length}" aria-labelledby="unit-${slug}">
    <h2 id="unit-${slug}">${escapeHtml(unit.name)}</h2>
    <div class="unit-positions">
    ${positions}
    </div>
  </section>`;
  }).join('\n  ');

  const basis = data.rankingBasis ? `<p class="basis">${escapeHtml(data.rankingBasis)}</p>` : '';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ireland Rugby Depth Chart</title>
<meta name="description" content="Depth chart for the ${escapeHtml(data.team)}: the pecking order at every position.">
<style>
${STYLES}
</style>
</head>
<body>
<header class="masthead">
  <h1>Ireland Rugby Depth Chart</h1>
  <p class="sub">${escapeHtml(data.team)}</p>
  ${basis}
  <p class="updated">Last updated: <time datetime="${escapeHtml(data.lastUpdated)}">${formatDate(data.lastUpdated)}</time></p>
  <ul class="legend" aria-label="Key">
    <li><span class="swatch first-swatch" aria-hidden="true"></span>First choice</li>
    <li><span class="swatch backup-swatch" aria-hidden="true"></span>Backup</li>
    <li><span class="swatch out-swatch" aria-hidden="true"></span>Unavailable (status shown)</li>
  </ul>
</header>
<main class="pitch">
  ${units}
</main>
<footer class="foot">
  <p>Rankings reflect public opinion and are maintained by hand. Not an official team selection.</p>
</footer>
</body>
</html>
`;
}

const STYLES = `
:root {
  --bg: #f4f6f3;
  --pitch: #1f6b3a;
  --pitch-line: rgba(255,255,255,0.18);
  --card: #ffffff;
  --text: #16201a;
  --muted: #4d5a52;
  --accent: #0b7a3e;
  --accent-ink: #ffffff;
  --border: #d5ddd7;
  --out-text: #5f6661;
  --out-bg: #eceeed;
  --status-bg: #8a1c1c;
  --status-ink: #ffffff;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0f1511;
    --pitch: #143d23;
    --pitch-line: rgba(255,255,255,0.10);
    --card: #1a231d;
    --text: #e8eee9;
    --muted: #a9b5ad;
    --accent: #2fae66;
    --accent-ink: #06140b;
    --border: #2c3a31;
    --out-text: #9aa39d;
    --out-bg: #151b17;
    --status-bg: #e07a7a;
    --status-ink: #1a0606;
  }
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font: 16px/1.4 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
.masthead { max-width: 1200px; margin: 0 auto; padding: 24px 16px 8px; }
h1 { margin: 0 0 4px; font-size: 1.9rem; }
.sub { margin: 0; color: var(--muted); }
.basis { margin: 8px 0 0; color: var(--muted); font-size: 0.9rem; }
.updated { margin: 8px 0 0; font-size: 0.9rem; }
.legend { display: flex; flex-wrap: wrap; gap: 8px 20px; list-style: none; padding: 0; margin: 14px 0 0; font-size: 0.85rem; color: var(--muted); }
.legend li { display: flex; align-items: center; gap: 6px; }
.swatch { width: 14px; height: 14px; border-radius: 3px; border: 1px solid var(--border); }
.first-swatch { background: var(--accent); border-color: var(--accent); }
.backup-swatch { background: var(--card); }
.out-swatch { background: var(--out-bg); }

.pitch {
  max-width: 1200px;
  margin: 16px auto;
  padding: 16px;
  background:
    repeating-linear-gradient(180deg, transparent 0 120px, var(--pitch-line) 120px 122px),
    var(--pitch);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.unit h2 {
  margin: 0 0 8px;
  color: #ffffff;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-align: center;
}
.unit-positions { display: grid; gap: 12px; justify-content: center; }
.cols-2 .unit-positions { grid-template-columns: repeat(2, minmax(0, 280px)); }
.cols-3 .unit-positions { grid-template-columns: repeat(3, minmax(0, 280px)); }

.position {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px 12px;
  min-width: 0;
}
.position h3 { margin: 0 0 8px; font-size: 1rem; display: flex; align-items: center; gap: 8px; }
.num {
  display: inline-grid; place-items: center;
  min-width: 28px; height: 28px; border-radius: 50%;
  background: var(--accent); color: var(--accent-ink);
  font-size: 0.85rem; font-weight: 700;
}
.depth { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.player { display: flex; gap: 10px; align-items: flex-start; padding: 6px 8px; border-radius: 6px; }
.rank { flex: 0 0 2.4em; font-size: 0.75rem; font-weight: 600; color: var(--muted); padding-top: 2px; }
.who { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 8px; min-width: 0; }
.name { font-weight: 500; overflow-wrap: anywhere; }
.meta { flex-basis: 100%; font-size: 0.8rem; color: var(--muted); }

.player.first { background: color-mix(in srgb, var(--accent) 12%, transparent); border-left: 4px solid var(--accent); }
.player.first .name { font-weight: 700; font-size: 1.08rem; }
.player.first .rank { color: var(--accent); }

.player.unavailable { background: var(--out-bg); border-left-color: var(--out-text); }
.player.unavailable .name,
.player.unavailable .meta,
.player.unavailable .rank { color: var(--out-text); }
.player.unavailable .name { text-decoration: line-through; text-decoration-thickness: 1px; }
.status {
  font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;
  padding: 1px 6px; border-radius: 4px;
  background: var(--status-bg); color: var(--status-ink);
}

.foot { max-width: 1200px; margin: 0 auto; padding: 0 16px 32px; font-size: 0.85rem; color: var(--muted); }

@media (max-width: 720px) {
  .pitch { border-radius: 0; padding: 12px; }
  .cols-2 .unit-positions, .cols-3 .unit-positions { grid-template-columns: minmax(0, 1fr); }
  h1 { font-size: 1.5rem; }
}
`;
