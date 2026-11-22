import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../src/validate.mjs';
import { minimalData, realData } from './fixture.mjs';

test('the committed data file is valid', () => {
  assert.deepEqual(validate(realData()), []);
});

test('minimal fixture is valid', () => {
  assert.deepEqual(validate(minimalData()), []);
});

// AC8 — invalid data is caught, with a message saying what and where
const cases = [
  ['a missing position', (d) => d.positions.splice(4, 1), /position 5 is missing/],
  ['a duplicate position number', (d) => { d.positions[1].number = 1; }, /position 1 appears more than once/],
  ['a player with no name', (d) => { d.players.p3.name = ''; }, /players\.p3\.name: is missing or empty/],
  ['a player with no club', (d) => { delete d.players.p3.club; }, /players\.p3\.club/],
  ['negative caps', (d) => { d.players.p3.caps = -1; }, /players\.p3\.caps/],
  ['non-integer caps', (d) => { d.players.p3.caps = '12'; }, /players\.p3\.caps/],
  ['an empty status', (d) => { d.players.p3.status = ''; }, /players\.p3\.status/],
  ['an unknown player id', (d) => { d.positions[2].depth.push('ghost'); }, /unknown player id "ghost"/],
  ['a player listed twice at one position', (d) => { d.positions[2].depth.push('p3'); }, /listed twice/],
  ['an empty depth list', (d) => { d.positions[2].depth = []; }, /depth: must be a non-empty list/],
  ['a wrong unit', (d) => { d.positions[0].unit = 'Centres'; }, /must be "Front row" for position 1/],
  ['a bad date', (d) => { d.lastUpdated = '2026-13-01'; }, /lastUpdated/],
  ['a missing team', (d) => { delete d.team; }, /^team:/],
  ['missing players', (d) => { delete d.players; }, /^players:/],
  ['missing positions', (d) => { delete d.positions; }, /^positions: must be an array/],
];

for (const [label, mutate, expected] of cases) {
  test(`AC8: rejects ${label}`, () => {
    const d = minimalData();
    mutate(d);
    const errors = validate(d);
    assert.ok(errors.some((e) => expected.test(e)), `expected an error matching ${expected}, got:\n${errors.join('\n')}`);
  });
}

test('AC8: rejects a non-object', () => {
  assert.equal(validate([]).length, 1);
  assert.equal(validate(null).length, 1);
});

test('a player may appear at more than one position', () => {
  const d = minimalData();
  d.positions[11].depth.push('p13');
  assert.deepEqual(validate(d), []);
});
