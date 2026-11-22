#!/usr/bin/env node
// Print `specs=<JSON array>` for $GITHUB_OUTPUT: the spec files that should be
// built by the spec-build workflow.
//
// - workflow_dispatch: the spec named in SPEC_INPUT (if its status is ready,
//   or FORCE=true).
// - push: spec files changed between BEFORE_SHA and AFTER_SHA whose Status
//   is "Ready for build".
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

export const READY = 'ready for build';

export function specStatus(markdown) {
  const m = markdown.match(/^\|\s*Status\s*\|\s*([^|\n]+?)\s*\|/im);
  return m ? m[1].trim() : null;
}

export const isSpecPath = (p) => /^specs\/(?!_)[^/]+\.md$/.test(p);

function changedFiles(before, after) {
  const zero = /^0+$/.test(before || '');
  const args = !before || zero
    ? ['diff-tree', '--no-commit-id', '--name-only', '-r', '--root', after]
    : ['diff', '--name-only', '--diff-filter=AM', `${before}..${after}`];
  return execFileSync('git', args, { encoding: 'utf8' }).split('\n').filter(Boolean);
}

function main() {
  const { SPEC_INPUT, FORCE, BEFORE_SHA, AFTER_SHA } = process.env;
  let candidates;
  if (SPEC_INPUT) {
    if (!isSpecPath(SPEC_INPUT) || !existsSync(SPEC_INPUT)) {
      console.error(`Not a spec file: ${SPEC_INPUT} (expected specs/<name>.md)`);
      process.exit(1);
    }
    candidates = [SPEC_INPUT];
  } else {
    candidates = changedFiles(BEFORE_SHA, AFTER_SHA || 'HEAD').filter(isSpecPath);
  }

  const ready = candidates.filter((p) => {
    if (!existsSync(p)) return false;
    const status = specStatus(readFileSync(p, 'utf8'));
    const ok = FORCE === 'true' || (status || '').toLowerCase() === READY;
    console.error(`${p}: status "${status ?? 'none'}" -> ${ok ? 'build' : 'skip'}`);
    return ok;
  });

  console.log(`specs=${JSON.stringify(ready)}`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
