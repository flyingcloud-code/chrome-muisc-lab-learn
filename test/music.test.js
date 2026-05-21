import test from 'node:test';
import assert from 'node:assert/strict';
import { chordFrequencies, noteFrequency } from '../src/audio/engine.js';
import { createStepSequence } from '../src/sequencer.js';

test('maps A4 to 440 Hz and C4 close to standard tuning', () => {
  assert.equal(noteFrequency('A4'), 440);
  assert.equal(Math.round(noteFrequency('C4') * 100) / 100, 261.63);
});

test('builds major and minor triads from a root note', () => {
  assert.deepEqual(chordFrequencies('C4', 'major').map((n) => Math.round(n)), [262, 330, 392]);
  assert.deepEqual(chordFrequencies('C4', 'minor').map((n) => Math.round(n)), [262, 311, 392]);
});

test('step sequencer advances and wraps predictably', () => {
  const sequence = createStepSequence(4);
  assert.equal(sequence.current(), 0);
  assert.equal(sequence.next(), 1);
  assert.equal(sequence.next(), 2);
  assert.equal(sequence.next(), 3);
  assert.equal(sequence.next(), 0);
});
