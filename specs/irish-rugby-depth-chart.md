# Spec: Irish Rugby Team Depth Chart Page

| Field   | Value       |
|---------|-------------|
| Status  | Draft — feature description |
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

---

## 2. Open Questions
To be settled before the detailed requirements are written:

1. **Data source:** Where does the depth chart come from — maintained by hand
   (e.g. a JSON/YAML file in the repo), or pulled from an external source?
2. **Who decides the ranking:** Based on the latest official squad / match-day
   selections, or an editorial view?
3. **Update frequency:** Updated per squad announcement, per match, or ad hoc?
4. **Injuries / availability:** Should injured or unavailable players be shown
   (e.g. greyed out with a status)?
5. **Extra player details:** Photos, age, positions they can cover, recent form?
6. **Players in more than one position:** Can a player appear at several
   positions (e.g. a utility back at 12 and 15)?
7. **Tech stack / hosting:** Static page, or part of a larger app?

---

## 3. Requirements
_TBD — to be written once the open questions are answered._

## 4. Acceptance Criteria
_TBD._
