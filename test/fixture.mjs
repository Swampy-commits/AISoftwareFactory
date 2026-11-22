import { readFileSync } from 'node:fs';

export const realData = () =>
  JSON.parse(readFileSync(new URL('../data/depth-chart.json', import.meta.url), 'utf8'));

/** A minimal valid data set: one player per position, plus one injured backup. */
export function minimalData() {
  const units = { 1: 'Front row', 2: 'Front row', 3: 'Front row', 4: 'Second row', 5: 'Second row',
    6: 'Back row', 7: 'Back row', 8: 'Back row', 9: 'Half-backs', 10: 'Half-backs',
    11: 'Back three', 12: 'Centres', 13: 'Centres', 14: 'Back three', 15: 'Back three' };
  const players = {};
  const positions = [];
  for (let n = 1; n <= 15; n++) {
    players[`p${n}`] = { name: `Player ${n}`, club: 'Leinster', caps: n };
    positions.push({ number: n, name: `Position ${n}`, unit: units[n], depth: [`p${n}`] });
  }
  players.hurt = { name: 'Hurt Player', club: 'Munster', caps: 1, status: 'Injured' };
  positions[0].depth.push('hurt');
  return { team: 'Test team', lastUpdated: '2026-11-22', players, positions };
}
