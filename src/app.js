import { experiments, findExperiment } from './data/experiments.js';
import {
  chordFrequencies,
  noteFrequency,
  playChord,
  playDrum,
  playNote,
  playTone,
  scaleNotes,
} from './audio/engine.js';

const app = document.querySelector('#app');
const cleanups = [];
const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];
const wheelNotes = ['C4', 'G4', 'D4', 'A4', 'E4', 'B4', 'F#4', 'C#4', 'Ab4', 'Eb4', 'Bb4', 'F4'];

function html(strings, ...values) {
  return strings.reduce((result, item, index) => result + item + (values[index] ?? ''), '');
}

function setPage(markup) {
  for (const cleanup of cleanups.splice(0)) cleanup();
  app.innerHTML = markup;
}

function on(target, event, handler) {
  target.addEventListener(event, handler);
  cleanups.push(() => target.removeEventListener(event, handler));
}

function setIntervalSafe(handler, delay) {
  const id = setInterval(handler, delay);
  cleanups.push(() => clearInterval(id));
  return id;
}

function requestFrameSafe(handler) {
  let id = requestAnimationFrame(function tick(time) {
    handler(time);
    id = requestAnimationFrame(tick);
  });
  cleanups.push(() => cancelAnimationFrame(id));
}

function routeTo(slug) {
  window.location.hash = slug ? `#/experiment/${slug}` : '#/';
}

function render() {
  const match = window.location.hash.match(/^#\/experiment\/([\w-]+)/);
  if (match) {
    renderExperiment(match[1]);
    return;
  }
  renderHome();
}

function renderHome() {
  setPage(html`
    <header class="topbar home-topbar">
      <button class="brand" type="button">CHROME MUSIC LAB</button>
      <nav>
        <a href="#experiments">Experiments</a>
        <a href="#about">About</a>
      </nav>
    </header>
    <main>
      <section id="experiments" class="experiment-grid">
        ${experiments.map(renderTile).join('')}
      </section>
      <section id="about" class="about">
        <article>
          <h2>What is Chrome Music Lab?</h2>
          <p>这是一个本地复刻版：用简单、动手、即时反馈的网页实验，让音乐概念可以被看见、听见、摸到。</p>
        </article>
        <article>
          <h2>What can it be used for?</h2>
          <p>它适合课堂、亲子探索和音乐入门。每个实验只聚焦一个概念：节奏、音高、频率、波形、和弦、琶音、弦长或声音可视化。</p>
        </article>
        <article>
          <h2>How is this local version built?</h2>
          <p>本地版使用原生 HTML、CSS、JavaScript、Canvas 和 Web Audio API，没有远程运行时依赖。高级联网协作与云端分享被降级为本地体验。</p>
        </article>
      </section>
    </main>
    <footer class="footer">
      <span class="google-mark">Google-inspired local study clone</span>
      <div class="footer-piano">${Array.from({ length: 8 }, (_, i) => `<button data-footer-note="${i}"></button>`).join('')}</div>
    </footer>
  `);

  document.querySelector('.brand').addEventListener('click', () => routeTo(''));
  for (const tile of document.querySelectorAll('.lab-tile')) {
    tile.addEventListener('click', () => routeTo(tile.dataset.slug));
  }
  for (const key of document.querySelectorAll('[data-footer-note]')) {
    key.addEventListener('click', () => playNote(scaleNotes[Number(key.dataset.footerNote)], { type: 'triangle' }));
  }
}

function renderTile(item) {
  return html`
    <button class="lab-tile tile-${item.slug}" type="button" data-slug="${item.slug}" style="--tile-color:${item.color}">
      <img src="./assets/thumbnails/${item.thumbnail}" alt="${item.title}" loading="eager" />
      <div class="tile-art fallback-art">${tileArt(item.slug)}</div>
      <span>${item.title}</span>
    </button>
  `;
}

function tileArt(slug) {
  if (slug === 'shared-piano') return '<div class="falling-notes"></div><div class="mini-keys"></div><div class="animal-badges"><b>🐯</b><b>🐻</b><b>🐱</b></div>';
  if (slug === 'piano-roll') return '<div class="mini-keys"></div><div class="falling-notes roll"></div>';
  if (slug === 'song-maker') return '<div class="mini-grid smile"></div>';
  if (slug === 'rhythm') return '<div class="monkey"><i></i></div><div class="sticks"></div><div class="drum"></div>';
  if (slug === 'spectrogram') return '<div class="spectral"></div>';
  if (slug === 'sound-waves') return '<div class="dot-field"></div>';
  if (slug === 'arpeggios') return '<div class="wheel-thumb">▶</div>';
  if (slug === 'kandinsky') return '<div class="k-shapes"><b></b><i></i><em></em></div>';
  if (slug === 'voice-spinner') return '<div class="spinner-thumb">🎙</div>';
  if (slug === 'harmonics') return '<div class="harmonic-lines"></div>';
  if (slug === 'oscillators') return '<div class="osc-faces"><b></b><i></i><em></em></div>';
  if (slug === 'strings') return '<div class="string-thumb"></div>';
  if (slug === 'melody-maker') return '<div class="mini-grid melody"></div>';
  if (slug === 'chords') return '<div class="chord-thumb"></div>';
  return '<div class="mini-grid"></div>';
}

function renderExperiment(slug) {
  const item = findExperiment(slug);
  if (!item) {
    routeTo('');
    return;
  }
  setPage(html`
    <header class="topbar experiment-topbar">
      <button class="back" type="button" aria-label="Back">←</button>
      <h1>${item.title}</h1>
      <button class="help" type="button" aria-label="Help">?</button>
    </header>
    <main class="stage" style="--accent:${item.color}">
      <div class="help-panel" hidden>
        <h2>${item.title}</h2>
        <p>${item.summary}</p>
        <small>${item.concept}</small>
      </div>
      <section class="experiment-host" data-host></section>
    </main>
  `);
  document.querySelector('.back').addEventListener('click', () => routeTo(''));
  document.querySelector('.help').addEventListener('click', () => {
    const panel = document.querySelector('.help-panel');
    panel.hidden = !panel.hidden;
  });
  renderers[slug](document.querySelector('[data-host]'));
}

function button(label, className = '') {
  return `<button class="${className}" type="button">${label}</button>`;
}

function renderPiano(host) {
  host.innerHTML = html`
    <div class="piano-room">
      <div class="room-strip">
        <span>Live</span><strong>Room: LOCAL</strong><select data-wave><option value="sine">Piano</option><option value="triangle">Marimba</option><option value="sawtooth">Synth</option><option value="square">Woodwind</option></select>
      </div>
      <div class="piano-keys">${scaleNotes.concat(['D5', 'E5', 'F5', 'G5', 'A5']).map((note) => `<button data-note="${note}">${note.replace(/\d/, '')}</button>`).join('')}</div>
    </div>
  `;
  host.querySelectorAll('[data-note]').forEach((key) => {
    key.addEventListener('pointerdown', () => {
      key.classList.add('active');
      playNote(key.dataset.note, { type: host.querySelector('[data-wave]').value, duration: 0.35 });
      setTimeout(() => key.classList.remove('active'), 180);
    });
  });
}

function renderSongMaker(host) {
  renderGridComposer(host, {
    className: 'song-maker',
    steps: 16,
    drumRows: 2,
    title: 'SONG MAKER',
    polyphonic: true,
  });
}

function renderMelodyMaker(host) {
  renderGridComposer(host, {
    className: 'melody-maker',
    steps: 16,
    drumRows: 0,
    title: 'MELODY MAKER',
    polyphonic: false,
  });
}

function renderGridComposer(host, config) {
  const rows = [...scaleNotes].reverse();
  const notes = new Set();
  const drums = new Set();
  let playing = false;
  let step = 0;
  let tempo = 120;

  host.innerHTML = html`
    <div class="composer ${config.className}">
      <div class="composer-grid" style="--steps:${config.steps};--rows:${rows.length}">
        ${rows.map((note) => Array.from({ length: config.steps }, (_, col) => `<button data-cell="${note}:${col}" aria-label="${note} ${col}"></button>`).join('')).join('')}
      </div>
      ${config.drumRows ? `<div class="drum-grid" style="--steps:${config.steps}">${Array.from({ length: config.steps * config.drumRows }, (_, i) => `<button data-drum="${Math.floor(i / config.steps)}:${i % config.steps}"></button>`).join('')}</div>` : ''}
      <div class="control-row">
        ${button('Play', 'primary play')}
        ${button('Restart', 'restart')}
        ${button('Undo', 'undo')}
        <label>Tempo <input data-tempo type="range" min="70" max="180" value="120" /></label>
      </div>
    </div>
  `;

  host.querySelectorAll('[data-cell]').forEach((cell) => {
    cell.addEventListener('click', () => {
      const [note, col] = cell.dataset.cell.split(':');
      if (!config.polyphonic) {
        host.querySelectorAll(`[data-cell$=":${col}"]`).forEach((other) => {
          if (other !== cell) {
            notes.delete(other.dataset.cell);
            other.classList.remove('on');
          }
        });
      }
      cell.classList.toggle('on');
      cell.classList.contains('on') ? notes.add(cell.dataset.cell) : notes.delete(cell.dataset.cell);
      playNote(note, { type: 'triangle' });
    });
  });
  host.querySelectorAll('[data-drum]').forEach((cell) => {
    cell.addEventListener('click', () => {
      cell.classList.toggle('on');
      cell.classList.contains('on') ? drums.add(cell.dataset.drum) : drums.delete(cell.dataset.drum);
      playDrum(cell.dataset.drum.startsWith('0') ? 'kick' : 'hat');
    });
  });

  const clearStep = () => host.querySelectorAll('.current').forEach((node) => node.classList.remove('current'));
  const tick = () => {
    clearStep();
    host.querySelectorAll(`[data-cell$=":${step}"], [data-drum$=":${step}"]`).forEach((node) => node.classList.add('current'));
    for (const key of notes) {
      const [note, col] = key.split(':');
      if (Number(col) === step) playNote(note, { type: 'triangle', duration: 0.18 });
    }
    for (const key of drums) {
      const [row, col] = key.split(':');
      if (Number(col) === step) playDrum(row === '0' ? 'kick' : 'hat');
    }
    step = (step + 1) % config.steps;
  };

  let timer = null;
  host.querySelector('.play').addEventListener('click', (event) => {
    playing = !playing;
    event.currentTarget.textContent = playing ? 'Stop' : 'Play';
    if (playing) {
      tick();
      timer = setInterval(tick, 60000 / tempo / 2);
      cleanups.push(() => clearInterval(timer));
    } else {
      clearInterval(timer);
      clearStep();
    }
  });
  host.querySelector('.restart').addEventListener('click', () => {
    step = 0;
    clearStep();
  });
  host.querySelector('.undo').addEventListener('click', () => {
    const last = [...notes].pop();
    if (last) {
      notes.delete(last);
      host.querySelector(`[data-cell="${last}"]`)?.classList.remove('on');
    }
  });
  host.querySelector('[data-tempo]').addEventListener('input', (event) => {
    tempo = Number(event.target.value);
  });
}

function renderRhythm(host) {
  const animals = ['🐵', '🐻', '🐱'];
  const active = new Set();
  let step = 0;
  host.innerHTML = html`
    <div class="rhythm-lab">
      <div class="animals">${animals.map((animal, i) => `<div class="animal" data-animal="${i}">${animal}<span></span></div>`).join('')}</div>
      <div class="rhythm-grid">${animals.map((_, row) => Array.from({ length: 12 }, (_, col) => `<button data-hit="${row}:${col}"></button>`).join('')).join('')}</div>
      <div class="control-row">${button('Play', 'primary play')}</div>
    </div>
  `;
  host.querySelectorAll('[data-hit]').forEach((hit) => {
    hit.addEventListener('click', () => {
      hit.classList.toggle('on');
      hit.classList.contains('on') ? active.add(hit.dataset.hit) : active.delete(hit.dataset.hit);
    });
  });
  let timer = null;
  host.querySelector('.play').addEventListener('click', (event) => {
    if (timer) {
      clearInterval(timer);
      timer = null;
      event.currentTarget.textContent = 'Play';
      return;
    }
    event.currentTarget.textContent = 'Stop';
    timer = setInterval(() => {
      host.querySelectorAll('.current, .strike').forEach((node) => node.classList.remove('current', 'strike'));
      host.querySelectorAll(`[data-hit$=":${step}"]`).forEach((node) => node.classList.add('current'));
      for (let row = 0; row < animals.length; row += 1) {
        if (active.has(`${row}:${step}`)) {
          host.querySelector(`[data-animal="${row}"]`).classList.add('strike');
          playDrum(row === 0 ? 'kick' : row === 1 ? 'snare' : 'hat');
        }
      }
      step = (step + 1) % 12;
    }, 180);
    cleanups.push(() => clearInterval(timer));
  });
}

function renderSpectrogram(host) {
  host.innerHTML = html`
    <div class="spectrogram-lab">
      <canvas width="960" height="420"></canvas>
      <div class="control-row">${button('Voice', 'primary tone')} ${button('Flute', 'tone')} ${button('Drum', 'tone')}</div>
    </div>
  `;
  const canvas = host.querySelector('canvas');
  const context = canvas.getContext('2d');
  let pulse = 0;
  host.querySelectorAll('.tone').forEach((btn, index) => {
    btn.addEventListener('click', () => {
      pulse = 80 + index * 50;
      if (index === 2) playDrum('snare');
      else playTone(220 + index * 220, { type: index ? 'sine' : 'sawtooth', duration: 0.6 });
    });
  });
  requestFrameSafe((time) => {
    context.drawImage(canvas, -3, 0);
    const x = canvas.width - 4;
    for (let y = 0; y < canvas.height; y += 4) {
      const wave = Math.sin(time / 120 + y / (pulse || 120));
      const hot = Math.max(0, wave * 120 + pulse - y * 0.15);
      context.fillStyle = `hsl(${(y / canvas.height) * 270 + hot}, 95%, ${hot > 30 ? 55 : 10}%)`;
      context.fillRect(x, canvas.height - y, 5, 4);
    }
    pulse *= 0.96;
  });
}

function renderSoundWaves(host) {
  host.innerHTML = html`
    <div class="waves-lab">
      <div class="wave-dots">${Array.from({ length: 220 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div>
      <div class="mini-key-row">${scaleNotes.map((note) => `<button data-note="${note}">${noteNames[scaleNotes.indexOf(note)]}</button>`).join('')}</div>
    </div>
  `;
  host.querySelectorAll('[data-note]').forEach((key, index) => {
    key.addEventListener('click', () => {
      host.querySelector('.wave-dots').style.setProperty('--wave', index + 1);
      host.querySelector('.wave-dots').classList.remove('burst');
      void host.querySelector('.wave-dots').offsetWidth;
      host.querySelector('.wave-dots').classList.add('burst');
      playNote(key.dataset.note);
    });
  });
}

function renderArpeggios(host) {
  let quality = 'major';
  let pattern = [0, 1, 2, 1];
  host.innerHTML = html`
    <div class="arp-lab">
      <div class="arp-wheel">${wheelNotes.map((note, i) => `<button style="--rot:${i * 30}deg;--hue:${i * 30}" data-root="${note}">${note.replace('4', '')}</button>`).join('')}<button class="arp-play">▶</button></div>
      <div class="control-row">${button('Major', 'quality active')} ${button('Minor', 'quality')} ${button('Up', 'pattern')} ${button('UpDown', 'pattern active')}</div>
    </div>
  `;
  host.querySelectorAll('[data-root]').forEach((root) => {
    root.addEventListener('click', async () => {
      const freqs = chordFrequencies(root.dataset.root, quality);
      for (let i = 0; i < pattern.length; i += 1) {
        setTimeout(() => playTone(freqs[pattern[i]], { type: 'triangle' }), i * 140);
      }
    });
  });
  host.querySelectorAll('.quality').forEach((btn) => {
    btn.addEventListener('click', () => {
      quality = btn.textContent.toLowerCase();
      host.querySelectorAll('.quality').forEach((n) => n.classList.toggle('active', n === btn));
    });
  });
  host.querySelectorAll('.pattern').forEach((btn) => {
    btn.addEventListener('click', () => {
      pattern = btn.textContent === 'Up' ? [0, 1, 2, 2] : [0, 1, 2, 1];
      host.querySelectorAll('.pattern').forEach((n) => n.classList.toggle('active', n === btn));
    });
  });
  host.querySelector('.arp-play').addEventListener('click', () => host.querySelector('[data-root="C4"]').click());
}

function renderKandinsky(host) {
  const paths = [];
  host.innerHTML = html`
    <div class="kandinsky-lab">
      <canvas width="960" height="460"></canvas>
      <div class="control-row">${button('Play Drawing', 'primary play')} ${button('Clear', 'clear')}</div>
    </div>
  `;
  const canvas = host.querySelector('canvas');
  const context = canvas.getContext('2d');
  context.lineWidth = 8;
  context.lineCap = 'round';
  context.strokeStyle = '#26a69a';
  let drawing = null;
  canvas.addEventListener('pointerdown', (event) => {
    drawing = [{ x: event.offsetX, y: event.offsetY }];
    context.beginPath();
    context.moveTo(event.offsetX, event.offsetY);
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!drawing) return;
    drawing.push({ x: event.offsetX, y: event.offsetY });
    context.lineTo(event.offsetX, event.offsetY);
    context.stroke();
  });
  canvas.addEventListener('pointerup', () => {
    if (drawing) paths.push(drawing);
    drawing = null;
  });
  host.querySelector('.play').addEventListener('click', () => {
    paths
      .flatMap((path) => path.filter((_, i) => i % 8 === 0))
      .sort((a, b) => a.x - b.x)
      .forEach((point, index) => {
        setTimeout(() => playTone(180 + (1 - point.y / canvas.height) * 720, { type: 'sine', duration: 0.12 }), index * 70);
      });
  });
  host.querySelector('.clear').addEventListener('click', () => {
    paths.length = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
  });
}

function renderVoiceSpinner(host) {
  host.innerHTML = html`
    <div class="voice-lab">
      <div class="voice-disc"><div class="needle"></div><span>drag</span></div>
      <p>拖动圆盘：顺时针更快，逆时针更低更慢。本地 MVP 用合成声音模拟录音。</p>
    </div>
  `;
  const disc = host.querySelector('.voice-disc');
  disc.addEventListener('pointermove', (event) => {
    if (event.buttons !== 1) return;
    const rect = disc.getBoundingClientRect();
    const dx = event.clientX - rect.left - rect.width / 2;
    const dy = event.clientY - rect.top - rect.height / 2;
    const angle = Math.atan2(dy, dx);
    disc.style.setProperty('--spin', `${angle}rad`);
    playTone(260 + Math.abs(angle) * 130, { type: angle > 0 ? 'sawtooth' : 'triangle', duration: 0.08, gain: 0.08 });
  });
}

function renderHarmonics(host) {
  host.innerHTML = html`
    <div class="harmonics-lab">
      ${Array.from({ length: 8 }, (_, i) => `<button style="--n:${i + 1}" data-harmonic="${i + 1}"><span>${i + 1}x</span></button>`).join('')}
    </div>
  `;
  host.querySelectorAll('[data-harmonic]').forEach((bar) => {
    bar.addEventListener('click', () => {
      bar.classList.add('ring');
      setTimeout(() => bar.classList.remove('ring'), 400);
      playTone(110 * Number(bar.dataset.harmonic), { type: 'sine', duration: 0.6 });
    });
  });
}

function renderPianoRoll(host) {
  const notes = [
    [0, 'C4', 2], [1, 'E4', 1], [2, 'G4', 2], [4, 'C5', 1],
    [5, 'B4', 1], [6, 'G4', 2], [8, 'E4', 1], [9, 'D4', 1], [10, 'C4', 3],
  ];
  host.innerHTML = html`
    <div class="roll-lab">
      <canvas width="960" height="460"></canvas>
      <div class="control-row">${button('Play', 'primary play')}</div>
    </div>
  `;
  const canvas = host.querySelector('canvas');
  const context = canvas.getContext('2d');
  let running = false;
  let offset = 0;
  host.querySelector('.play').addEventListener('click', (event) => {
    running = !running;
    event.currentTarget.textContent = running ? 'Stop' : 'Play';
  });
  requestFrameSafe(() => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#f8f8f8';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#333';
    context.fillRect(180, 0, 3, canvas.height);
    for (const [start, note, len] of notes) {
      const x = 900 - (start * 95 + offset);
      const y = 400 - scaleNotes.indexOf(note) * 42;
      context.fillStyle = '#ec407a';
      context.fillRect(x, y, len * 80, 28);
      if (running && x <= 180 && x + 3 > 176) playNote(note, { duration: 0.18 });
    }
    if (running) offset = (offset + 3) % 1100;
  });
}

function renderOscillators(host) {
  const waves = ['sine', 'square', 'triangle', 'sawtooth'];
  host.innerHTML = html`
    <div class="osc-lab">
      ${waves.map((wave) => `<button data-wave="${wave}"><span>${wave}</span><b></b></button>`).join('')}
    </div>
  `;
  host.querySelectorAll('[data-wave]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (event.buttons !== 1) return;
      const rect = card.getBoundingClientRect();
      const ratio = 1 - (event.clientY - rect.top) / rect.height;
      const frequency = 90 + ratio * 850;
      card.style.setProperty('--pitch', ratio);
      playTone(frequency, { type: card.dataset.wave, duration: 0.08, gain: 0.08 });
    });
  });
}

function renderStrings(host) {
  host.innerHTML = html`
    <div class="strings-lab">
      ${Array.from({ length: 8 }, (_, i) => `<button style="--len:${100 - i * 8}%" data-string="${i}"><span></span></button>`).join('')}
    </div>
  `;
  host.querySelectorAll('[data-string]').forEach((string) => {
    string.addEventListener('click', () => {
      string.classList.add('pluck');
      setTimeout(() => string.classList.remove('pluck'), 500);
      playTone(160 + Number(string.dataset.string) * 70, { type: 'triangle', duration: 0.55 });
    });
  });
}

function renderChords(host) {
  let quality = 'major';
  host.innerHTML = html`
    <div class="chords-lab">
      <div class="quality-switch">${button('Major', 'active')} ${button('Minor')}</div>
      <div class="chord-keys">${scaleNotes.slice(0, 7).map((note) => `<button data-root="${note}">${note.replace('4', '')}</button>`).join('')}</div>
    </div>
  `;
  host.querySelectorAll('.quality-switch button').forEach((btn) => {
    btn.addEventListener('click', () => {
      quality = btn.textContent.toLowerCase();
      host.querySelectorAll('.quality-switch button').forEach((node) => node.classList.toggle('active', node === btn));
    });
  });
  host.querySelectorAll('[data-root]').forEach((key) => {
    key.addEventListener('click', () => {
      host.querySelectorAll('[data-root]').forEach((node) => node.classList.remove('active'));
      key.classList.add('active');
      playChord(key.dataset.root, quality, { type: 'sine', duration: 0.5 });
    });
  });
}

const renderers = {
  'shared-piano': renderPiano,
  'song-maker': renderSongMaker,
  rhythm: renderRhythm,
  spectrogram: renderSpectrogram,
  'sound-waves': renderSoundWaves,
  arpeggios: renderArpeggios,
  kandinsky: renderKandinsky,
  'voice-spinner': renderVoiceSpinner,
  harmonics: renderHarmonics,
  'piano-roll': renderPianoRoll,
  oscillators: renderOscillators,
  strings: renderStrings,
  'melody-maker': renderMelodyMaker,
  chords: renderChords,
};

window.addEventListener('hashchange', render);
render();
