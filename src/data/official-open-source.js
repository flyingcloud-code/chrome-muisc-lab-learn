/**
 * Constants ported from the archived Google Creative Lab Chrome Music Lab
 * repository. The original project is licensed under Apache-2.0.
 *
 * Source: googlecreativelab/chrome-music-lab
 */

export const SOURCE_TYPES = {
  OFFICIAL_OPEN_SOURCE: 'official-open-source-port',
  LOCAL_RECREATION: 'local-recreation',
};

export const OFFICIAL_REPOSITORY = 'googlecreativelab/chrome-music-lab';

export const OPEN_SOURCE_PORTS = {
  'arpeggios': 'arpeggios',
  'chords': 'chords',
  'harmonics': 'harmonics & strings',
  'melody-maker': 'melodymaker',
  'piano-roll': 'pianoroll',
  'sound-waves': 'soundwaves',
  'spectrogram': 'spectrogram',
  'strings': 'harmonics & strings',
  'voice-spinner': 'soundspinner',
};

export const OFFICIAL_NOTE_COLORS = {
  C: '#BF4FA8',
  'C#': '#8064c6',
  Db: '#8064c6',
  D: '#4D61D8',
  'D#': '#ed3883',
  Eb: '#ed3883',
  E: '#45B5A1',
  F: '#95C631',
  'F#': '#f6be37',
  Gb: '#f6be37',
  G: '#EDD929',
  'G#': '#95c631',
  Ab: '#95c631',
  A: '#F7943D',
  'A#': '#45b5a1',
  Bb: '#45b5a1',
  B: '#E33159',
};

export const ARPEGGIOS_MAJOR_ORDER = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];

export const ARPEGGIOS_MINOR_ORDER = ['A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F', 'C', 'G', 'D'];

export function noteColor(note) {
  const pitch = note.replace(/-?\d+$/, '');
  return OFFICIAL_NOTE_COLORS[pitch] || '#26a69a';
}
