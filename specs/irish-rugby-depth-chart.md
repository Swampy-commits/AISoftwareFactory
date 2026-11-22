# Spec: Irish Rugby Team Depth Chart Page

| Field   | Value       |
|---------|-------------|
| Status  | Implemented |
| Created | 2026-11-22  |

---

## 1. Feature Description

### Summary
A web page that shows the depth chart for the Ireland men's senior rugby union
team: for each of the 15 starting positions, the players who are available,
ranked by who is first choice, second choice, third choice, and so on.

### Problem / Motivation
Fans who want to know who the Ireland team would pick at each position, and who
covers whom, have to piece it together from squad announcements, match-day
team sheets and news coverage. No single place shows the pecking order at every
position at a glance.

### What the page shows
- **Positions:** all 15 rugby union positions, grouped by unit:
  - **Front row:** Loosehead Prop (1), Hooker (2), Tighthead Prop (3)
  - **Second row:** Locks (4, 5)
  - **Back row:** Blindside Flanker (6), Openside Flanker (7), Number 8 (8)
  - **Half-backs:** Scrum-half (9), Fly-half (10)
  - **Centres:** Inside Centre (12), Outside Centre (13)
  - **Back three:** Wings (11, 14), Fullback (15)
- **Depth per position:** an ordered list of players, from first choice down
  (e.g. up to 3–4 deep).
- **Player details on each entry:** name, province/club, and caps.
- **Unavailable players:** injured or otherwise unavailable players stay in the
  chart at their usual rank but are greyed out, with a short status
  (e.g. "Injured").
- **Layout:** positions laid out the way a team lines up on the pitch, so the
  chart reads like a team formation, with the depth list under each position.

### Who it's for
Rugby fans and anyone following the Ireland team who wants a quick view of the
first-choice XV and the cover at each position.

### In scope (initial version)
- A single page showing the full depth chart.
- Clear distinction between first choice and backups.
- Works on desktop and mobile.

### Out of scope (initial version)
- Women's, U20 or sevens teams.
- Live match data, scores or fixtures.
- User accounts, editing or voting on the depth chart.

### Data and ranking
- **Data source:** the depth chart lives in a data file in the repo and is
  updated by hand. The page reads from that file; there is no external feed.
- **Ranking basis:** the order at each position reflects public opinion — the
  general consensus among fans and pundits about who should be first choice —
  not the official squad or match-day selections. The person maintaining the
  data file sets the order to match that consensus. (Collecting votes on the
  site is out of scope; see below.)

---

## 2. Decisions

| # | Question | Decision |
|---|----------|----------|
| 1 | Data source | Maintained by hand in a data file in the repo |
| 2 | Who decides the ranking | Public opinion (fan/pundit consensus), entered by hand |
| 3 | Injured / unavailable players | Shown at their rank, greyed out with a status |
| 4 | Data file format | JSON, at `data/depth-chart.json` |
| 5 | Players in more than one position | Allowed — players are defined once and referenced by id from each position's depth list |
| 6 | Tech stack | Static HTML page generated at build time by a dependency-free Node.js script (`npm run build` → `dist/index.html`); no client-side JavaScript |

## 3. Open Questions
Still to be settled:

1. **Update frequency:** Updated per squad announcement, per match, or ad hoc?
2. **Extra player details:** Photos, age, positions they can cover, recent form?
3. **Hosting:** Where `dist/` is published.

---

## 4. Data File

`data/depth-chart.json` has this shape:

```json
{
  "team": "Ireland men's senior rugby union team",
  "lastUpdated": "YYYY-MM-DD",
  "rankingBasis": "Short note on how the order is decided",
  "players": {
    "<player-id>": {
      "name": "Full name",
      "club": "Province / club",
      "caps": 0,
      "status": "Injured"
    }
  },
  "positions": [
    { "number": 1, "name": "Loosehead Prop", "unit": "Front row",
      "depth": ["<player-id>", "<player-id>"] }
  ]
}
```

- `status` is optional. If it is present, the player is unavailable and is
  shown greyed out with that text (AC6). If it is absent, the player is available.
- `depth` is ordered from first choice down (AC3).
- A player id can appear in more than one position's `depth`.
- `positions` holds exactly 15 entries, numbered 1–15.

## 5. Requirements
_TBD — to be written once the remaining open questions are answered._

## 6. Acceptance Criteria
_Status: agreed 2026-11-22._

### AC1 — All positions shown
- **Given** the data file lists players for every position,
- **when** a user opens the page,
- **then** all 15 positions (1–15) are shown, each labelled with its number and
  name (e.g. "1 · Loosehead Prop").

### AC2 — Pitch-style layout
- **Given** the page has loaded,
- **then** positions are grouped and ordered the way the team lines up:
  front row (1–3), second row (4–5), back row (6–8), half-backs (9–10),
  centres (12–13) and back three (11, 14, 15).

### AC3 — Depth order
- **Given** a position has several players in the data file,
- **then** they are listed in the order given in the file, ranked 1st, 2nd,
  3rd and so on, with the rank visible next to each name.

### AC4 — First choice stands out
- **then** the first-choice player at each position is visually distinct from
  the backups (e.g. larger or bold), so the first-choice XV can be read at a
  glance.

### AC5 — Player details
- **then** each player entry shows their name, province/club and number of caps.

### AC6 — Unavailable players greyed out
- **Given** a player is marked as unavailable in the data file with a status
  (e.g. "Injured", "Suspended"),
- **then** they remain at their rank but are greyed out and their status is
  shown next to their name.
- **And** the greying is not the only cue: the status text is visible, so it
  is clear without relying on colour.

### AC7 — Data file drives the page
- **Given** someone edits the data file by hand (changes the order, adds or
  removes a player, or changes a status),
- **when** the page is next built/loaded,
- **then** the page reflects the change, with no code changes needed.

### AC8 — Invalid data is caught
- **Given** the data file has an error (e.g. a position missing, a player with
  no name, a malformed file),
- **then** the build/validation step fails with a message saying what is wrong
  and where, rather than showing a broken page.

### AC9 — Last updated
- **then** the page shows when the depth chart was last updated, taken from a
  date in the data file.

### AC10 — Desktop and mobile
- **Given** the page is viewed on a phone (~375px wide) or a desktop
  (≥1280px wide),
- **then** all positions and players are readable, nothing overlaps, and there
  is no sideways scrolling. On mobile, units may stack vertically.

### AC11 — Accessibility basics
- **then** the page uses proper headings for units/positions, text meets
  WCAG AA colour contrast (including greyed-out entries' status text), and the
  page is usable with a screen reader.

### AC12 — Out of scope stays out
- **then** the page shows only the Ireland men's senior team, and has no
  voting, accounts, editing or live match data.
