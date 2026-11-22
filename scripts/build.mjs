#!/usr/bin/env node
// Validate data/depth-chart.json and build dist/index.html from it.
// Usage: node scripts/build.mjs [--check] [--data path] [--out path]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validate } from '../src/validate.mjs';
import { renderPage } from '../src/render.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};
const checkOnly = args.includes('--check');
const dataPath = resolve(root, opt('--data', 'data/depth-chart.json'));
const outPath = resolve(root, opt('--out', 'dist/index.html'));

function fail(lines) {
  console.error(`✗ ${dataPath} is not valid:`);
  for (const l of lines) console.error(`  - ${l}`);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(readFileSync(dataPath, 'utf8'));
} catch (e) {
  fail([e.code === 'ENOENT' ? 'file not found' : `could not parse JSON: ${e.message}`]);
}

const errors = validate(data);
if (errors.length) fail(errors);

if (checkOnly) {
  console.log(`✓ ${dataPath} is valid`);
} else {
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, renderPage(data));
  console.log(`✓ Built ${outPath}`);
}
