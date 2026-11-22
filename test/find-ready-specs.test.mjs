import { test } from 'node:test';
import assert from 'node:assert/strict';
import { specStatus, isSpecPath } from '../scripts/find-ready-specs.mjs';

test('reads the Status row from a spec header table', () => {
  assert.equal(specStatus('| Field | Value |\n|---|---|\n| Status  | Ready for build |\n'), 'Ready for build');
  assert.equal(specStatus('| Status | Implemented |'), 'Implemented');
  assert.equal(specStatus('# no table'), null);
});

test('only top-level specs/*.md count, and _template.md is ignored', () => {
  assert.ok(isSpecPath('specs/foo.md'));
  assert.ok(!isSpecPath('specs/_template.md'));
  assert.ok(!isSpecPath('specs/sub/foo.md'));
  assert.ok(!isSpecPath('README.md'));
});
