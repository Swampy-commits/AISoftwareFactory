import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderPage, ordinal, formatDate } from '../src/render.mjs';
import { minimalData, realData } from './fixture.mjs';

const POSITION_NAMES = ['Loosehead Prop', 'Hooker', 'Tighthead Prop', 'Lock', 'Blindside Flanker',
  'Openside Flanker', 'Number 8', 'Scrum-half', 'Fly-half', 'Left Wing', 'Inside Centre',
  'Outside Centre', 'Right Wing', 'Fullback'];

test('AC1: all 15 positions are shown with number and name', () => {
  const html = renderPage(realData());
  for (let n = 1; n <= 15; n++) assert.match(html, new RegExp(`id="pos-${n}"><span class="num">${n}</span>`));
  for (const name of POSITION_NAMES) assert.ok(html.includes(name), name);
});

test('AC2: units appear in pitch order, positions in formation order within each unit', () => {
  const html = renderPage(realData());
  const units = [...html.matchAll(/<h2 id="unit-[^"]+">([^<]+)<\/h2>/g)].map((m) => m[1]);
  assert.deepEqual(units, ['Front row', 'Second row', 'Back row', 'Half-backs', 'Centres', 'Back three']);
  const order = [...html.matchAll(/id="pos-(\d+)"/g)].map((m) => Number(m[1]));
  assert.deepEqual(order, [1, 2, 3, 4, 5, 6, 8, 7, 9, 10, 12, 13, 11, 15, 14]);
});

test('AC3: players are listed in data order with visible ranks', () => {
  const data = realData();
  const html = renderPage(data);
  const section = html.split('id="pos-10"')[1].split('</section>')[0];
  const names = [...section.matchAll(/class="name">([^<]+)</g)].map((m) => m[1]);
  const expected = data.positions.find((p) => p.number === 10).depth.map((id) => data.players[id].name);
  assert.deepEqual(names, expected);
  const ranks = [...section.matchAll(/class="rank">([^<]+)</g)].map((m) => m[1]);
  assert.deepEqual(ranks, expected.map((_, i) => ordinal(i + 1)));
});

test('AC4: exactly one first-choice entry per position', () => {
  const html = renderPage(realData());
  assert.equal((html.match(/class="player first/g) || []).length, 15);
});

test('AC5: each entry shows name, club and caps', () => {
  const html = renderPage(minimalData());
  assert.match(html, /class="name">Player 7<\/span>[\s\S]*?class="meta">Leinster · 7 caps</);
  assert.match(html, /Hurt Player[\s\S]*?Munster · 1 cap</);
});

test('AC6: unavailable players keep their rank, are greyed out and show status text', () => {
  const html = renderPage(minimalData());
  const pos1 = html.split('id="pos-1"')[1].split('</section>')[0];
  assert.match(pos1, /<li class="player backup unavailable">\s*<span class="rank">2nd<\/span>[\s\S]*?Hurt Player<\/span><span class="status">Injured<\/span>/);
  assert.equal((html.match(/class="status"/g) || []).length, 1);
});

test('AC7: changing the data changes the page', () => {
  const d = minimalData();
  d.players.p9.name = 'Renamed Scrum-half';
  d.positions[0].depth.reverse();
  const html = renderPage(d);
  assert.ok(html.includes('Renamed Scrum-half'));
  const pos1 = html.split('id="pos-1"')[1].split('</section>')[0];
  assert.match(pos1, /player first unavailable[\s\S]*?Hurt Player/);
});

test('AC9: last updated date is shown', () => {
  const html = renderPage(minimalData());
  assert.match(html, /Last updated: <time datetime="2026-11-22">22 November 2026<\/time>/);
  assert.equal(formatDate('2026-01-05'), '5 January 2026');
});

test('AC11: page has language, heading structure and ordered lists', () => {
  const html = renderPage(realData());
  assert.match(html, /<html lang="en">/);
  assert.equal((html.match(/<h1>/g) || []).length, 1);
  assert.equal((html.match(/<h2 /g) || []).length, 6);
  assert.equal((html.match(/<h3 /g) || []).length, 15);
  assert.equal((html.match(/<ol class="depth">/g) || []).length, 15);
});

test('AC12: no voting, accounts, editing or live data', () => {
  const html = renderPage(realData());
  assert.doesNotMatch(html, /<form|<input|<button|<script/i);
});

test('text from the data file is HTML-escaped', () => {
  const d = minimalData();
  d.players.p1.name = '<img src=x onerror=alert(1)>';
  const html = renderPage(d);
  assert.ok(!html.includes('<img'));
  assert.ok(html.includes('&lt;img src=x'));
});

test('ordinal suffixes', () => {
  assert.deepEqual([1, 2, 3, 4, 11, 12, 13, 21, 22].map(ordinal), ['1st', '2nd', '3rd', '4th', '11th', '12th', '13th', '21st', '22nd']);
});
