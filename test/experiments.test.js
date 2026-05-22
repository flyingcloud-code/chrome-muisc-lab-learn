import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { experiments } from '../src/data/experiments.js';
import { SOURCE_TYPES } from '../src/data/official-open-source.js';

test('defines the 14 Chrome Music Lab experiments in display order', () => {
  assert.deepEqual(experiments.map((item) => item.slug), [
    'shared-piano',
    'song-maker',
    'rhythm',
    'spectrogram',
    'sound-waves',
    'arpeggios',
    'kandinsky',
    'voice-spinner',
    'harmonics',
    'piano-roll',
    'oscillators',
    'strings',
    'melody-maker',
    'chords',
  ]);
});

test('each experiment has enough metadata to render a tile and help panel', () => {
  for (const item of experiments) {
    assert.equal(typeof item.title, 'string');
    assert.equal(item.title.length > 2, true);
    assert.equal(typeof item.summary, 'string');
    assert.equal(item.summary.length > 20, true);
    assert.equal(typeof item.source, 'object');
    assert.equal(Object.values(SOURCE_TYPES).includes(item.source.type), true);
    assert.equal(typeof item.color, 'string');
    assert.match(item.color, /^#[0-9a-f]{6}$/i);
    assert.equal(existsSync(new URL(`../assets/thumbnails/${item.thumbnail}`, import.meta.url)), true);
  }
});
