import { UNIT_FOR_NUMBER } from './positions.mjs';

const isNonEmptyString = (v) => typeof v === 'string' && v.trim() !== '';
const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

function isValidDate(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

/**
 * Check depth chart data against the format in the spec (section 4).
 * Returns a list of human-readable errors, each naming where the problem is.
 * An empty list means the data is valid.
 */
export function validate(data) {
  const errors = [];
  const err = (path, msg) => errors.push(`${path}: ${msg}`);

  if (!isPlainObject(data)) {
    return ['(root): must be a JSON object'];
  }

  if (!isNonEmptyString(data.team)) err('team', 'must be a non-empty string');
  if (!isValidDate(data.lastUpdated)) {
    err('lastUpdated', `must be a date in YYYY-MM-DD format (got ${JSON.stringify(data.lastUpdated)})`);
  }
  if (data.rankingBasis !== undefined && !isNonEmptyString(data.rankingBasis)) {
    err('rankingBasis', 'must be a non-empty string if present');
  }

  // Players
  const players = isPlainObject(data.players) ? data.players : null;
  if (!players) {
    err('players', 'must be an object mapping player ids to players');
  } else {
    for (const [id, p] of Object.entries(players)) {
      const at = `players.${id}`;
      if (!isPlainObject(p)) {
        err(at, 'must be an object');
        continue;
      }
      if (!isNonEmptyString(p.name)) err(`${at}.name`, 'is missing or empty');
      if (!isNonEmptyString(p.club)) err(`${at}.club`, 'is missing or empty');
      if (!Number.isInteger(p.caps) || p.caps < 0) {
        err(`${at}.caps`, `must be a whole number of 0 or more (got ${JSON.stringify(p.caps)})`);
      }
      if (p.status !== undefined && !isNonEmptyString(p.status)) {
        err(`${at}.status`, 'must be a non-empty string if present (remove it if the player is available)');
      }
    }
  }

  // Positions
  if (!Array.isArray(data.positions)) {
    err('positions', 'must be an array');
    return errors;
  }
  if (data.positions.length !== 15) {
    err('positions', `must have exactly 15 entries (has ${data.positions.length})`);
  }

  const seenNumbers = new Set();
  data.positions.forEach((pos, i) => {
    const at = `positions[${i}]`;
    if (!isPlainObject(pos)) {
      err(at, 'must be an object');
      return;
    }
    const label = Number.isInteger(pos.number) ? `${at} (number ${pos.number})` : at;

    if (!Number.isInteger(pos.number) || pos.number < 1 || pos.number > 15) {
      err(`${at}.number`, `must be a whole number from 1 to 15 (got ${JSON.stringify(pos.number)})`);
    } else if (seenNumbers.has(pos.number)) {
      err(`${at}.number`, `position ${pos.number} appears more than once`);
    } else {
      seenNumbers.add(pos.number);
    }

    if (!isNonEmptyString(pos.name)) err(`${label}.name`, 'is missing or empty');

    const expectedUnit = UNIT_FOR_NUMBER[pos.number];
    if (!isNonEmptyString(pos.unit)) {
      err(`${label}.unit`, 'is missing or empty');
    } else if (expectedUnit && pos.unit !== expectedUnit) {
      err(`${label}.unit`, `must be "${expectedUnit}" for position ${pos.number} (got "${pos.unit}")`);
    }

    if (!Array.isArray(pos.depth) || pos.depth.length === 0) {
      err(`${label}.depth`, 'must be a non-empty list of player ids');
      return;
    }
    const seenIds = new Set();
    pos.depth.forEach((id, j) => {
      if (players && !Object.hasOwn(players, id)) {
        err(`${label}.depth[${j}]`, `unknown player id "${id}"`);
      }
      if (seenIds.has(id)) err(`${label}.depth[${j}]`, `player "${id}" is listed twice`);
      seenIds.add(id);
    });
  });

  for (let n = 1; n <= 15; n++) {
    if (!seenNumbers.has(n)) err('positions', `position ${n} is missing`);
  }

  return errors;
}
