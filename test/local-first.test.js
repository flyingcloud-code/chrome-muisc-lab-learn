import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { experiments } from '../src/data/experiments.js';

test('experiment renderer is local-first and does not embed the live official site', () => {
  const appSource = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');

  assert.equal(appSource.includes('<iframe'), false);
  assert.equal(appSource.includes('musiclab.chromeexperiments.com'), false);
});

test('experiment metadata does not route through remote official paths', () => {
  for (const experiment of experiments) {
    assert.equal('officialPath' in experiment, false);
  }
});
