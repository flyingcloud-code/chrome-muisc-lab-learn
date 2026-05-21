const NOTE_OFFSETS = {
  C: -9,
  'C#': -8,
  Db: -8,
  D: -7,
  'D#': -6,
  Eb: -6,
  E: -5,
  F: -4,
  'F#': -3,
  Gb: -3,
  G: -2,
  'G#': -1,
  Ab: -1,
  A: 0,
  'A#': 1,
  Bb: 1,
  B: 2,
};

let audioContext;

export function noteFrequency(note) {
  const match = /^([A-G](?:#|b)?)(-?\d+)$/.exec(note);
  if (!match) {
    throw new Error(`Invalid note: ${note}`);
  }

  const [, pitch, octaveText] = match;
  const octave = Number(octaveText);
  const semitonesFromA4 = NOTE_OFFSETS[pitch] + (octave - 4) * 12;
  return 440 * 2 ** (semitonesFromA4 / 12);
}

export function chordFrequencies(root, quality = 'major') {
  const intervals = quality === 'minor' ? [0, 3, 7] : [0, 4, 7];
  const rootFrequency = noteFrequency(root);
  return intervals.map((interval) => rootFrequency * 2 ** (interval / 12));
}

export async function getAudioContext() {
  if (!audioContext) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    audioContext = new Ctor();
  }
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }
  return audioContext;
}

export async function playTone(frequency, options = {}) {
  const context = await getAudioContext();
  const {
    duration = 0.22,
    type = 'sine',
    gain = 0.16,
    attack = 0.01,
    release = 0.08,
  } = options;
  const oscillator = context.createOscillator();
  const envelope = context.createGain();
  const now = context.currentTime;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.exponentialRampToValueAtTime(gain, now + attack);
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);

  oscillator.connect(envelope).connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + release + 0.02);
}

export function playNote(note, options) {
  return playTone(noteFrequency(note), options);
}

export function playChord(root, quality = 'major', options = {}) {
  return Promise.all(chordFrequencies(root, quality).map((frequency) => playTone(frequency, options)));
}

export async function playDrum(kind = 'kick') {
  const context = await getAudioContext();
  const now = context.currentTime;
  const gain = context.createGain();
  gain.connect(context.destination);

  if (kind === 'kick') {
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(140, now);
    oscillator.frequency.exponentialRampToValueAtTime(45, now + 0.18);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    oscillator.connect(gain);
    oscillator.start(now);
    oscillator.stop(now + 0.22);
    return;
  }

  const buffer = context.createBuffer(1, context.sampleRate * 0.12, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  const noise = context.createBufferSource();
  const filter = context.createBiquadFilter();
  filter.type = kind === 'hat' ? 'highpass' : 'bandpass';
  filter.frequency.value = kind === 'hat' ? 7000 : 1200;
  gain.gain.setValueAtTime(kind === 'hat' ? 0.08 : 0.16, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  noise.buffer = buffer;
  noise.connect(filter).connect(gain);
  noise.start(now);
  noise.stop(now + 0.13);
}

export const scaleNotes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
