# Chrome Music Lab Local Clone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local, playable Chrome Music Lab-style website with a recognizable homepage and 14 experiment MVPs.

**Architecture:** Use a zero-dependency static SPA so the app can run locally without package installation. Shared data, audio helpers, sequencing, and experiment renderers are split into focused ES modules.

**Tech Stack:** HTML, CSS, JavaScript ES modules, Web Audio API, Canvas/SVG, Node built-in test runner.

---

## File Structure

- Create `package.json`: scripts for tests and local static server.
- Create `index.html`: app shell and module entry.
- Create `src/data/experiments.js`: experiment metadata, colors, routes, descriptions.
- Create `src/audio/engine.js`: Web Audio helpers for notes, chords, drums, oscillators, and safe user-gesture startup.
- Create `src/sequencer.js`: small deterministic loop scheduler used by grid-based experiments.
- Create `src/app.js`: router, homepage, experiment shell, experiment rendering functions.
- Create `src/styles.css`: Chrome Music Lab-inspired layout, grid, experiment controls, responsive behavior.
- Create `test/experiments.test.js`: metadata coverage tests.
- Create `test/music.test.js`: frequency/chord/sequencer tests.

## Tasks

### Task 1: Test Metadata and Music Primitives

**Files:**
- Create: `test/experiments.test.js`
- Create: `test/music.test.js`

- [ ] **Step 1: Write failing tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { experiments } from '../src/data/experiments.js';

test('defines the 14 Chrome Music Lab experiments in display order', () => {
  assert.deepEqual(experiments.map((item) => item.slug), [
    'shared-piano', 'song-maker', 'rhythm', 'spectrogram', 'sound-waves',
    'arpeggios', 'kandinsky', 'voice-spinner', 'harmonics', 'piano-roll',
    'oscillators', 'strings', 'melody-maker', 'chords',
  ]);
});
```

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { noteFrequency, chordFrequencies } from '../src/audio/engine.js';
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
```

- [ ] **Step 2: Run tests and verify missing modules fail**

Run: `npm test`

Expected: FAIL because `src/data/experiments.js`, `src/audio/engine.js`, and `src/sequencer.js` do not exist yet.

### Task 2: Implement Shared Data, Audio, and Sequencer

**Files:**
- Create: `package.json`
- Create: `src/data/experiments.js`
- Create: `src/audio/engine.js`
- Create: `src/sequencer.js`

- [ ] **Step 1: Add scripts and implementation**

Implement the exact exports covered by tests, plus simple Web Audio helpers used by the UI.

- [ ] **Step 2: Run tests**

Run: `npm test`

Expected: PASS.

### Task 3: Build Homepage and Routing

**Files:**
- Create: `index.html`
- Create: `src/app.js`
- Create: `src/styles.css`

- [ ] **Step 1: Implement app shell**

Build `/` as a hash-routed SPA with a top nav, 14 colorful experiment tiles, About section, and footer.

- [ ] **Step 2: Verify in browser**

Run: `npm run dev`, open `http://127.0.0.1:8000`, and verify the homepage resembles the target skeleton.

### Task 4: Implement 14 Experiment MVPs

**Files:**
- Modify: `src/app.js`
- Modify: `src/styles.css`

- [ ] **Step 1: Implement experiment renderers**

Create one renderer per experiment with playable local interactions: grids, piano keys, rhythm loop, spectrogram canvas, wave dots, arpeggio wheel, drawing canvas, spinner, harmonics, piano roll, oscillators, strings, melody grid, and chords.

- [ ] **Step 2: Verify interactions**

Open each tile, trigger sound/animation, return to homepage, and confirm no route breaks.

### Task 5: Final Verification

**Files:**
- Modify only if verification finds bugs.

- [ ] **Step 1: Run automated tests**

Run: `npm test`

Expected: PASS.

- [ ] **Step 2: Run static server and browser QA**

Run: `npm run dev`, inspect desktop and mobile viewport, click through all experiments.

- [ ] **Step 3: Build check**

Because this is zero-dependency static code, build check is syntax/import validation through `npm test` plus live browser load.

