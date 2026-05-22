import test from 'node:test';
import assert from 'node:assert/strict';
import { experiments } from '../src/data/experiments.js';
import {
  ARPEGGIOS_MAJOR_ORDER,
  ARPEGGIOS_MINOR_ORDER,
  OFFICIAL_NOTE_COLORS,
  OPEN_SOURCE_PORTS,
  SOURCE_TYPES,
  noteColor,
} from '../src/data/official-open-source.js';

test('marks official open-source Chrome Music Lab experiments separately from local recreations', () => {
  const bySlug = Object.fromEntries(experiments.map((item) => [item.slug, item]));

  for (const [slug, path] of Object.entries(OPEN_SOURCE_PORTS)) {
    assert.equal(bySlug[slug].source.type, SOURCE_TYPES.OFFICIAL_OPEN_SOURCE);
    assert.equal(bySlug[slug].source.path, path);
    assert.equal(bySlug[slug].source.license, 'Apache-2.0');
  }

  for (const slug of ['shared-piano', 'song-maker', 'rhythm', 'kandinsky', 'oscillators']) {
    assert.equal(bySlug[slug].source.type, SOURCE_TYPES.LOCAL_RECREATION);
  }
});

test('ports official note color and arpeggio wheel constants', () => {
  assert.equal(OFFICIAL_NOTE_COLORS.C, '#BF4FA8');
  assert.equal(OFFICIAL_NOTE_COLORS.G, '#EDD929');
  assert.equal(OFFICIAL_NOTE_COLORS['A#'], '#45b5a1');
  assert.deepEqual(ARPEGGIOS_MAJOR_ORDER, ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F']);
  assert.deepEqual(ARPEGGIOS_MINOR_ORDER, ['A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F', 'C', 'G', 'D']);
  assert.equal(noteColor('C4'), OFFICIAL_NOTE_COLORS.C);
  assert.equal(noteColor('F#4'), OFFICIAL_NOTE_COLORS['F#']);
});
