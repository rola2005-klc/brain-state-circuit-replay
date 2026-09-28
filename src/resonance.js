(function initHome() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initHero();
  initDecoderLab();
  initStimLab();

  // Deterministic randomness so every visitor sees the same toy worlds.
  function mulberry32(seed) {
    let t = seed >>> 0;
    return function rand() {
      t += 0x6D2B79F5;
      let x = Math.imul(t ^ (t >>> 15), 1 | t);
      x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }

  function gaussian(rand) {
    let u = 0;
    while (u === 0) u = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  function setupCanvas(canvas, width, height) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  // ---------------------------------------------------------------------------
  // Hero: a photo (what we saw) dissolves into seven orbits (what we were).
  // Holding raises resonance toward a ceiling below 1.0; releasing returns to
  // the present. It is an illustration of the thesis, not a model output.
  // ---------------------------------------------------------------------------
  function initHero() {
    const stage = document.getElementById('heroStage');
    const canvas = document.getElementById('heroCanvas');
    const button = document.getElementById('holdButton');
    const resonanceEl = document.getElementById('heroResonance');
    const stateEl = document.getElementById('heroState');
    if (!stage || !canvas || !button || !canvas.getContext) return;

    const ring = button.querySelector('.hold-ring');
    const buttonText = button.querySelector('.hold-text');
    const DIMENSIONS = ['Body', 'Attention', 'Emotion', 'Context', 'Self-model', 'Meaning', 'Configured ignorance'];
    const CEILING = 0.72;
    const TAP_HOLD_MS = 2600;

    let ctx = null;
    let size = 0;
    let particles = [];
    let layout = null;
    let holding = false;
    let pressStartedAt = 0;
    let releaseTimer = 0;
    let mix = 0;
    let resonance = 0;
    let time = 0;
    let lastFrame = 0;
    let rafId = 0;
    let inView = true;
    let lastReadoutAt = 0;

    const photo = paintPhoto();

    function paintPhoto() {
      // A small procedural "photograph": dusk over water, two figures on the shore.
      const cols = 64;
      const rows = 48;
      const off = document.createElement('canvas');
      off.width = cols;
      off.height = rows;
      const g = off.getContext('2d');
      const horizon = Math.round(rows * 0.58);

      const sky = g.createLinearGradient(0, 0, 0, horizon);
      sky.addColorStop(0, '#1d2547');
      sky.addColorStop(0.55, '#6a4d7a');
      sky.addColorStop(0.85, '#e0875a');
      sky.addColorStop(1, '#f6b36b');
      g.fillStyle = sky;
      g.fillRect(0, 0, cols, horizon);

      const sunX = cols * 0.64;
      const sunY = horizon - 4;
      const glow = g.createRadialGradient(sunX, sunY, 1, sunX, sunY, 16);
      glow.addColorStop(0, 'rgba(255, 226, 170, 0.95)');
      glow.addColorStop(1, 'rgba(255, 200, 140, 0)');
      g.fillStyle = glow;
      g.fillRect(0, 0, cols, horizon);
      g.fillStyle = '#ffe4b0';
      g.beginPath();
      g.arc(sunX, sunY, 5, 0, Math.PI * 2);
      g.fill();

      const sea = g.createLinearGradient(0, horizon, 0, rows);
      sea.addColorStop(0, '#3a4a70');
      sea.addColorStop(1, '#0f1729');
      g.fillStyle = sea;
      g.fillRect(0, horizon, cols, rows - horizon);

      const rand = mulberry32(7);
      for (let y = horizon + 1; y < rows - 6; y += 2) {
        const spread = 3 + (y - horizon) * 0.55;
        const width = 2 + rand() * spread;
        g.fillStyle = `rgba(255, 205, 150, ${0.75 - (y - horizon) / rows})`;
        g.fillRect(sunX - width / 2 + (rand() - 0.5) * 3, y, width, 1);
      }

      g.fillStyle = '#0a0d14';
      g.beginPath();
      g.moveTo(0, rows);
      g.lineTo(0, rows - 7);
      g.quadraticCurveTo(cols * 0.35, rows - 10, cols * 0.62, rows - 4);
      g.lineTo(cols * 0.62, rows);
      g.closePath();
      g.fill();

      [[cols * 0.22, 1], [cols * 0.27, 0.92]].forEach(([x, scale]) => {
        const base = rows - 8.5;
        g.fillRect(Math.round(x), Math.round(base - 7 * scale), 2, Math.round(7 * scale));
        g.beginPath();
        g.arc(Math.round(x) + 1, base - 8.3 * scale, 1.5 * scale, 0, Math.PI * 2);
        g.fill();
      });

      const data = g.getImageData(0, 0, cols, rows).data;
      return { cols, rows, data };
    }

    function buildParticles() {
      const rand = mulberry32(42);
      const list = [];
      for (let row = 0; row < photo.rows; row += 1) {
        for (let col = 0; col < photo.cols; col += 1) {
          const index = (row * photo.cols + col) * 4;
          const ringIndex = Math.min(DIMENSIONS.length - 1, Math.floor(rand() * DIMENSIONS.length));
          const rgb = [photo.data[index], photo.data[index + 1], photo.data[index + 2]];
          list.push({
            col,
            row,
            // Four pre-mixed shades: the photo's own colour brightening as it becomes "state".
            colors: [0, 0.3, 0.55, 0.75].map((amount) => {
              const mixed = rgb.map((channel, c) => Math.round(channel + ([255, 231, 199][c] - channel) * amount));
              return `rgb(${mixed[0]}, ${mixed[1]}, ${mixed[2]})`;
            }),
            ring: ringIndex,
            angle0: rand() * Math.PI * 2,
            jitter: (rand() - 0.5),
            pull: 0.5 + rand() * 0.5,
            delay: (col / photo.cols) * 0.3 + rand() * 0.15,
            swirl: (rand() - 0.5) * 2
          });
        }
      }
      return list;
    }

    function computeLayout() {
      const rect = stage.getBoundingClientRect();
      size = Math.max(240, Math.min(rect.width, rect.height));
      ctx = setupCanvas(canvas, rect.width, rect.height);
      const cx = rect.width / 2;
      const cy = rect.height / 2 + size * 0.03;
      const photoW = size * 0.38;
      const photoH = photoW * (photo.rows / photo.cols);
      const rings = DIMENSIONS.map((label, index) => ({
        label,
        radius: size * (0.265 + index * 0.034),
        speed: (0.16 + index * 0.035) * (index % 2 ? -1 : 1)
      }));
      layout = {
        width: rect.width,
        height: rect.height,
        cx,
        cy,
        photoW,
        photoH,
        cell: photoW / photo.cols,
        tilt: -0.07,
        squash: 0.88,
        rings
      };
    }

    function homePosition(p) {
      const x = (p.col + 0.5) * layout.cell - layout.photoW / 2;
      const y = (p.row + 0.5) * layout.cell - layout.photoH / 2 - layout.photoH * 0.06;
      const cos = Math.cos(layout.tilt);
      const sin = Math.sin(layout.tilt);
      return { x: layout.cx + x * cos - y * sin, y: layout.cy + x * sin + y * cos };
    }

    function shortestTurn(from, to) {
      let delta = (to - from) % (Math.PI * 2);
      if (delta > Math.PI) delta -= Math.PI * 2;
      if (delta < -Math.PI) delta += Math.PI * 2;
      return delta;
    }

    function drawFrame() {
      const { width, height, cx, cy, rings, squash } = layout;
      ctx.clearRect(0, 0, width, height);

      const alignPhase = time * 0.22;
      const ringAlpha = 0.06 + mix * 0.16;

      rings.forEach((ringDef) => {
        ctx.beginPath();
        ctx.ellipse(cx, cy, ringDef.radius, ringDef.radius * squash, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(214, 226, 244, ${ringAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Polaroid frame fades as the photo dissolves.
      const frameAlpha = Math.max(0, 1 - mix * 1.6);
      if (frameAlpha > 0.01) {
        const pad = layout.photoW * 0.05;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(layout.tilt);
        ctx.fillStyle = `rgba(236, 230, 218, ${0.92 * frameAlpha})`;
        ctx.shadowColor = `rgba(0, 0, 0, ${0.5 * frameAlpha})`;
        ctx.shadowBlur = 24;
        roundRect(ctx, -layout.photoW / 2 - pad, -layout.photoH / 2 - layout.photoH * 0.06 - pad, layout.photoW + pad * 2, layout.photoH + pad * 2 + layout.photoH * 0.2, 4);
        ctx.fill();
        ctx.restore();
      }

      const cellSize = layout.cell + 0.35;
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        const home = homePosition(p);
        const ringDef = rings[p.ring];
        const t = smoothstep(clamp((mix - p.delay) / 0.55, 0, 1));
        let x = home.x;
        let y = home.y;
        let s = cellSize;
        if (t > 0) {
          const base = p.angle0 + time * ringDef.speed;
          const angle = base + shortestTurn(base, alignPhase) * resonance * p.pull;
          const radius = ringDef.radius + p.jitter * size * 0.02;
          const ox = cx + Math.cos(angle) * radius;
          const oy = cy + Math.sin(angle) * radius * squash;
          const bend = Math.sin(t * Math.PI) * size * 0.08 * p.swirl;
          x = home.x + (ox - home.x) * t - bend * Math.sin(angle);
          y = home.y + (oy - home.y) * t + bend * Math.cos(angle);
          s = cellSize + (2.3 - cellSize) * t;
        }
        ctx.globalAlpha = 1 - t * 0.12;
        ctx.fillStyle = p.colors[t < 0.2 ? 0 : t < 0.5 ? 1 : t < 0.8 ? 2 : 3];
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;

      const labelAlpha = clamp((mix - 0.35) / 0.4, 0, 1);
      if (labelAlpha > 0.01) {
        ctx.font = `500 ${Math.max(9.5, size * 0.019)}px "JetBrains Mono", ui-monospace, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.lineJoin = 'round';
        rings.forEach((ringDef, index) => {
          const y = cy - ringDef.radius * squash - 3;
          ctx.lineWidth = 4;
          ctx.strokeStyle = `rgba(10, 13, 18, ${0.85 * labelAlpha})`;
          ctx.strokeText(ringDef.label, cx, y);
          ctx.fillStyle = index === rings.length - 1
            ? `rgba(255, 211, 161, ${labelAlpha})`
            : `rgba(214, 226, 244, ${0.82 * labelAlpha})`;
          ctx.fillText(ringDef.label, cx, y);
        });
      }
    }

    function roundRect(context, x, y, width, height, radius) {
      context.beginPath();
      context.moveTo(x + radius, y);
      context.arcTo(x + width, y, x + width, y + height, radius);
      context.arcTo(x + width, y + height, x, y + height, radius);
      context.arcTo(x, y + height, x, y, radius);
      context.arcTo(x, y, x + width, y, radius);
      context.closePath();
    }

    function updateReadout(force) {
      const now = performance.now();
      if (!force && now - lastReadoutAt < 90) return;
      lastReadoutAt = now;
      resonanceEl.textContent = resonance.toFixed(2);
      let label = 'present';
      if (holding && resonance > CEILING - 0.03) label = 'ceiling · partial by design';
      else if (holding) label = 'cueing';
      else if (mix > 0.04) label = 'returning to present';
      stateEl.textContent = label;
      if (ring) ring.style.setProperty('--p', (resonance / CEILING).toFixed(3));
    }

    function step(now) {
      rafId = 0;
      const dt = Math.min(0.05, (now - (lastFrame || now)) / 1000);
      lastFrame = now;
      time += dt;

      const mixTarget = holding ? 1 : 0;
      mix += (mixTarget - mix) * Math.min(1, dt * (holding ? 1.1 : 1.6));
      const ceiling = CEILING + Math.sin(time * 1.7) * 0.02 + Math.sin(time * 4.3) * 0.008;
      const resTarget = holding ? ceiling * clamp(mix * 1.15, 0, 1) : 0;
      resonance += (resTarget - resonance) * Math.min(1, dt * (holding ? 0.9 : 2.2));
      resonance = clamp(resonance, 0, 0.99);

      drawFrame();
      updateReadout(false);
      schedule();
    }

    function schedule() {
      if (reduceMotion || rafId || !inView || document.hidden) return;
      rafId = requestAnimationFrame(step);
    }

    function renderStatic() {
      mix = holding ? 1 : 0;
      resonance = holding ? CEILING - 0.04 : 0;
      drawFrame();
      updateReadout(true);
    }

    function startHold() {
      clearTimeout(releaseTimer);
      if (!holding) {
        holding = true;
        pressStartedAt = performance.now();
        button.classList.add('is-holding');
        button.setAttribute('aria-pressed', 'true');
        if (buttonText) buttonText.textContent = 'Hold… let go to return';
      }
      if (reduceMotion) renderStatic();
      else schedule();
    }

    function endHold(allowTap) {
      if (!holding) return;
      const heldFor = performance.now() - pressStartedAt;
      if (allowTap && heldFor < 280) {
        // A tap still gets the full effect, then returns on its own.
        clearTimeout(releaseTimer);
        releaseTimer = setTimeout(() => endHold(false), TAP_HOLD_MS);
        return;
      }
      holding = false;
      button.classList.remove('is-holding');
      button.setAttribute('aria-pressed', 'false');
      if (buttonText) buttonText.textContent = 'Press & hold to cue the memory';
      if (reduceMotion) renderStatic();
      else schedule();
    }

    [stage, button].forEach((target) => {
      target.addEventListener('pointerdown', (event) => {
        if (event.button !== undefined && event.button !== 0) return;
        event.preventDefault();
        startHold();
      });
      target.addEventListener('pointerup', () => endHold(true));
      target.addEventListener('pointercancel', () => endHold(false));
      target.addEventListener('pointerleave', (event) => {
        if (event.pointerType === 'mouse' && holding && performance.now() - pressStartedAt > 280) endHold(false);
      });
      target.addEventListener('contextmenu', (event) => event.preventDefault());
    });

    button.addEventListener('keydown', (event) => {
      if ((event.key === ' ' || event.key === 'Enter') && !event.repeat) {
        event.preventDefault();
        startHold();
      }
    });
    button.addEventListener('keyup', (event) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        endHold(false);
      }
    });
    // Assistive tech "clicks" arrive without pointer events: treat as a tap.
    button.addEventListener('click', (event) => {
      if (event.detail === 0 && !holding) {
        startHold();
        releaseTimer = setTimeout(() => endHold(false), TAP_HOLD_MS);
      }
    });
    button.setAttribute('aria-pressed', 'false');

    particles = buildParticles();
    computeLayout();

    if ('ResizeObserver' in window) {
      new ResizeObserver(() => {
        computeLayout();
        if (reduceMotion) renderStatic();
        else drawFrame();
      }).observe(stage);
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        inView = entries[0].isIntersecting;
        if (inView) {
          lastFrame = 0;
          schedule();
        }
      }).observe(stage);
    }

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        lastFrame = 0;
        schedule();
      }
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => (reduceMotion ? renderStatic() : drawFrame()));
    }

    if (reduceMotion) renderStatic();
    else schedule();
  }

  // ---------------------------------------------------------------------------
  // Limit 1: decoder accuracy vs noise, read straight from the sweep CSV so the
  // chart updates whenever scripts/evaluate_decoder_noise.py is re-run.
  // ---------------------------------------------------------------------------
  function initDecoderLab() {
    const svg = document.getElementById('decoderChart');
    const slider = document.getElementById('noiseSlider');
    const valueEl = document.getElementById('noiseValue');
    const readout = document.getElementById('noiseReadout');
    if (!svg || !slider) return;

    const NS = 'http://www.w3.org/2000/svg';
    const CHANCE = 0.25;
    const box = { left: 46, right: 16, top: 16, bottom: 46, width: 560, height: 360 };
    const plotW = box.width - box.left - box.right;
    const plotH = box.height - box.top - box.bottom;

    let rows = [
      { sigma: 0, nc: 0.9083, lr: 0.8917 },
      { sigma: 0.05, nc: 0.8333, lr: 0.8333 },
      { sigma: 0.1, nc: 0.7667, lr: 0.7417 },
      { sigma: 0.2, nc: 0.6417, lr: 0.6333 },
      { sigma: 0.4, nc: 0.4333, lr: 0.425 },
      { sigma: 0.8, nc: 0.2917, lr: 0.3167 },
      { sigma: 1.5, nc: 0.2833, lr: 0.2833 }
    ];
    let cursor = null;

    render();

    fetch('data/decoder_noise_sweep.csv', { cache: 'no-cache' })
      .then((response) => (response.ok ? response.text() : Promise.reject(new Error(String(response.status)))))
      .then((text) => {
        const parsed = parseCsv(text);
        if (parsed.length >= 2) {
          rows = parsed;
          render();
        }
      })
      .catch(() => { /* keep the bundled copy of the sweep */ });

    slider.addEventListener('input', update);

    function parseCsv(text) {
      const lines = text.trim().split(/\r?\n/);
      const header = lines.shift().split(',').map((cell) => cell.trim());
      const sigmaAt = header.indexOf('sigma');
      const ncAt = header.indexOf('nearest_centroid_accuracy');
      const lrAt = header.indexOf('logistic_regression_accuracy');
      if (sigmaAt < 0 || ncAt < 0 || lrAt < 0) return [];
      return lines
        .map((line) => line.split(','))
        .map((cells) => ({ sigma: Number(cells[sigmaAt]), nc: Number(cells[ncAt]), lr: Number(cells[lrAt]) }))
        .filter((row) => [row.sigma, row.nc, row.lr].every(Number.isFinite))
        .sort((a, b) => a.sigma - b.sigma);
    }

    function el(name, attrs, text) {
      const node = document.createElementNS(NS, name);
      Object.entries(attrs || {}).forEach(([key, value]) => node.setAttribute(key, value));
      if (text !== undefined) node.textContent = text;
      return node;
    }

    function xOf(sigma) {
      const max = rows[rows.length - 1].sigma || 1;
      return box.left + Math.sqrt(Math.max(0, sigma) / max) * plotW;
    }

    function yOf(accuracy) {
      return box.top + (1 - accuracy) * plotH;
    }

    function formatSigma(sigma) {
      return sigma === 0 ? '0' : String(Number(sigma.toFixed(2))).replace(/^0\./, '.');
    }

    function render() {
      const title = svg.querySelector('title');
      const desc = svg.querySelector('desc');
      svg.textContent = '';
      if (title) svg.appendChild(title);
      if (desc) svg.appendChild(desc);

      [0, 0.25, 0.5, 0.75, 1].forEach((tick) => {
        svg.appendChild(el('line', { class: 'grid-line', x1: box.left, x2: box.left + plotW, y1: yOf(tick), y2: yOf(tick) }));
        svg.appendChild(el('text', { class: 'tick-label', x: box.left - 8, y: yOf(tick) + 4, 'text-anchor': 'end' }, `${Math.round(tick * 100)}%`));
      });

      rows.forEach((row) => {
        svg.appendChild(el('text', { class: 'tick-label', x: xOf(row.sigma), y: box.top + plotH + 18, 'text-anchor': 'middle' }, formatSigma(row.sigma)));
      });
      svg.appendChild(el('text', { class: 'axis-label', x: box.left + plotW / 2, y: box.height - 6, 'text-anchor': 'middle' }, 'noise σ added to each feature'));

      svg.appendChild(el('line', { class: 'chance-line', x1: box.left, x2: box.left + plotW, y1: yOf(CHANCE), y2: yOf(CHANCE) }));
      svg.appendChild(el('text', { class: 'chance-label', x: box.left + 8, y: yOf(CHANCE) - 7, 'text-anchor': 'start' }, 'chance · 25%'));

      [['nc', 'Nearest-centroid'], ['lr', 'Logistic regression']].forEach(([key]) => {
        const d = rows.map((row, index) => `${index ? 'L' : 'M'}${xOf(row.sigma).toFixed(1)},${yOf(row[key]).toFixed(1)}`).join(' ');
        svg.appendChild(el('path', { class: `series series-${key}`, d }));
        rows.forEach((row) => svg.appendChild(el('circle', { class: `point-${key}`, cx: xOf(row.sigma), cy: yOf(row[key]), r: 3.2 })));
      });

      const legendX = box.left + plotW - 168;
      const legendY = box.top + 18;
      [['nc', 'Nearest-centroid'], ['lr', 'Logistic regression']].forEach(([key, label], index) => {
        const y = legendY + index * 20;
        svg.appendChild(el('line', { class: `series series-${key}`, x1: legendX, x2: legendX + 22, y1: y, y2: y }));
        svg.appendChild(el('text', { class: `series-label series-label-${key}`, x: legendX + 30, y: y + 4 }, label));
      });

      cursor = {
        line: el('line', { class: 'cursor-line', y1: box.top, y2: box.top + plotH }),
        nc: el('circle', { class: 'cursor-dot point-nc', r: 6.5 }),
        lr: el('circle', { class: 'cursor-dot point-lr', r: 6.5 })
      };
      svg.appendChild(cursor.line);
      svg.appendChild(cursor.lr);
      svg.appendChild(cursor.nc);

      // Wide invisible hit areas: click a noise level to jump the slider there.
      rows.forEach((row, index) => {
        const prev = index ? xOf(rows[index - 1].sigma) : box.left;
        const next = index < rows.length - 1 ? xOf(rows[index + 1].sigma) : box.left + plotW;
        const x0 = index ? (prev + xOf(row.sigma)) / 2 : box.left;
        const x1 = index < rows.length - 1 ? (xOf(row.sigma) + next) / 2 : box.left + plotW;
        const hit = el('rect', { class: 'hit', x: x0, y: box.top, width: Math.max(1, x1 - x0), height: plotH });
        hit.addEventListener('click', () => {
          slider.value = String(index);
          update();
        });
        svg.appendChild(hit);
      });

      slider.max = String(rows.length - 1);
      if (Number(slider.value) > rows.length - 1) slider.value = String(rows.length - 1);
      update();
    }

    function update() {
      const row = rows[clamp(Number(slider.value), 0, rows.length - 1)];
      const x = xOf(row.sigma);
      cursor.line.setAttribute('x1', x);
      cursor.line.setAttribute('x2', x);
      cursor.nc.setAttribute('cx', x);
      cursor.nc.setAttribute('cy', yOf(row.nc));
      cursor.lr.setAttribute('cx', x);
      cursor.lr.setAttribute('cy', yOf(row.lr));

      const sigmaText = row.sigma.toFixed(2);
      valueEl.textContent = `σ = ${sigmaText}`;
      slider.setAttribute('aria-valuetext', `sigma ${sigmaText}`);
      const nc = (row.nc * 100).toFixed(1);
      const lr = (row.lr * 100).toFixed(1);
      const lead = Math.round(Math.max(row.nc, row.lr) * 100 - CHANCE * 100);
      let verdict;
      if (row.sigma === 0) verdict = 'on clean synthetic data. This is the number that looks impressive — and the least realistic one.';
      else if (lead <= 7) verdict = '— essentially chance. The decoder can no longer tell the states apart.';
      else verdict = `— only about ${lead} points above chance (25%).`;
      readout.textContent = `At σ = ${sigmaText}: nearest-centroid ${nc}%, logistic regression ${lr}% ${verdict}`;
    }
  }

  // ---------------------------------------------------------------------------
  // Limit 2: stimulation coverage vs precision. A live re-implementation of
  // scripts/simulate_stimulation_coverage.py (unit square, grid electrodes).
  // ---------------------------------------------------------------------------
  function initStimLab() {
    const canvas = document.getElementById('stimCanvas');
    const electrodeGroup = document.getElementById('electrodeGroup');
    const engramGroup = document.getElementById('engramGroup');
    const radiusSlider = document.getElementById('radiusSlider');
    const radiusValue = document.getElementById('radiusValue');
    const recallEl = document.getElementById('stimRecall');
    const precisionEl = document.getElementById('stimPrecision');
    const challengeEl = document.getElementById('stimChallenge');
    if (!canvas || !canvas.getContext || !electrodeGroup || !engramGroup || !radiusSlider) return;

    const K_VALUES = [4, 9, 16, 36, 64, 144];
    const ENSEMBLE = 200;
    const BACKGROUND = 2000;
    const worlds = {
      focal: makeWorld([[0.5, 0.5]], 0.07),
      distributed: makeWorld([[0.3, 0.7], [0.7, 0.3], [0.5, 0.5]], 0.05)
    };
    const state = { k: 16, radius: 0.1, layout: 'focal' };
    let ctx = null;
    let side = 0;

    function makeWorld(clusters, spread) {
      const rand = mulberry32(42);
      const ensemble = [];
      for (let i = 0; i < ENSEMBLE; i += 1) {
        const [cx, cy] = clusters[i % clusters.length];
        ensemble.push([clamp(cx + gaussian(rand) * spread, 0, 1), clamp(cy + gaussian(rand) * spread, 0, 1)]);
      }
      const bgRand = mulberry32(43);
      const background = [];
      for (let i = 0; i < BACKGROUND; i += 1) background.push([bgRand(), bgRand()]);
      return { ensemble, background };
    }

    function gridSide(k) {
      return Math.max(1, Math.round(Math.sqrt(k)));
    }

    // Nearest electrode on a regular grid is found per axis: O(1) per cell.
    function isStimulated(point, gridN, radius) {
      const stepSize = 1 / (gridN + 1);
      const ix = clamp(Math.round(point[0] / stepSize) - 1, 0, gridN - 1);
      const iy = clamp(Math.round(point[1] / stepSize) - 1, 0, gridN - 1);
      const dx = point[0] - (ix + 1) * stepSize;
      const dy = point[1] - (iy + 1) * stepSize;
      return dx * dx + dy * dy <= radius * radius;
    }

    function evaluate() {
      const world = worlds[state.layout];
      const gridN = gridSide(state.k);
      const hitsMask = world.ensemble.map((p) => isStimulated(p, gridN, state.radius));
      const offMask = world.background.map((p) => isStimulated(p, gridN, state.radius));
      const hits = hitsMask.filter(Boolean).length;
      const off = offMask.filter(Boolean).length;
      return {
        gridN,
        hitsMask,
        offMask,
        hits,
        off,
        recall: hits / ENSEMBLE,
        precision: hits + off ? hits / (hits + off) : null
      };
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      side = rect.width;
      ctx = setupCanvas(canvas, side, side);
    }

    function draw(result) {
      if (!ctx) return;
      const world = worlds[state.layout];
      const pad = side * 0.04;
      const span = side - pad * 2;
      const px = (value) => pad + value * span;
      ctx.clearRect(0, 0, side, side);

      ctx.strokeStyle = 'rgba(214, 226, 244, 0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(pad, pad, span, span);

      const stepSize = 1 / (result.gridN + 1);
      ctx.fillStyle = 'rgba(143, 180, 255, 0.07)';
      ctx.strokeStyle = 'rgba(143, 180, 255, 0.32)';
      for (let i = 0; i < result.gridN; i += 1) {
        for (let j = 0; j < result.gridN; j += 1) {
          const ex = px((i + 1) * stepSize);
          const ey = px((j + 1) * stepSize);
          ctx.beginPath();
          ctx.arc(ex, ey, state.radius * span, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      }

      const dot = Math.max(1.2, side / 320);
      world.background.forEach((p, index) => {
        const lit = result.offMask[index];
        ctx.fillStyle = lit ? 'rgba(255, 158, 196, 0.85)' : 'rgba(214, 226, 244, 0.22)';
        const s = lit ? dot * 1.5 : dot;
        ctx.fillRect(px(p[0]) - s / 2, px(p[1]) - s / 2, s, s);
      });
      world.ensemble.forEach((p, index) => {
        const lit = result.hitsMask[index];
        ctx.beginPath();
        ctx.arc(px(p[0]), px(p[1]), lit ? dot * 1.7 : dot * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = lit ? '#79f2c9' : '#f2b872';
        ctx.fill();
      });

      ctx.strokeStyle = 'rgba(238, 242, 248, 0.8)';
      ctx.lineWidth = 1.2;
      const arm = Math.max(2.5, side / 150);
      for (let i = 0; i < result.gridN; i += 1) {
        for (let j = 0; j < result.gridN; j += 1) {
          const ex = px((i + 1) * stepSize);
          const ey = px((j + 1) * stepSize);
          ctx.beginPath();
          ctx.moveTo(ex - arm, ey);
          ctx.lineTo(ex + arm, ey);
          ctx.moveTo(ex, ey - arm);
          ctx.lineTo(ex, ey + arm);
          ctx.stroke();
        }
      }
    }

    function update() {
      const result = evaluate();
      radiusValue.textContent = state.radius.toFixed(2);
      recallEl.textContent = `${Math.round(result.recall * 100)}%`;
      precisionEl.textContent = result.precision === null ? '—' : `${Math.round(result.precision * 100)}%`;
      const met = result.recall >= 0.8 && result.precision !== null && result.precision >= 0.2;
      challengeEl.classList.toggle('is-met', met);
      if (met) {
        challengeEl.textContent = 'You found a sweet spot in the toy — only because the memory sits right under an electrode. Real engrams are 3-D, sparse, and different in every person.';
      } else if (result.recall >= 0.8) {
        challengeEl.textContent = `Challenge: ≥ 80% recall with ≥ 20% precision. Recall is there, but ${Math.round((1 - (result.precision || 0)) * 100)}% of what you stimulate is off-target.`;
      } else {
        challengeEl.textContent = 'Challenge: reach ≥ 80% recall with ≥ 20% precision.';
      }
      draw(result);
    }

    function buildRadioGroup(group, values, getLabel, isChecked, onPick) {
      const buttons = Array.from(group.querySelectorAll('button'));
      if (!buttons.length) {
        values.forEach((value) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.setAttribute('role', 'radio');
          b.dataset.value = String(value);
          b.textContent = getLabel(value);
          group.appendChild(b);
          buttons.push(b);
        });
      }
      function sync() {
        buttons.forEach((b) => {
          const checked = isChecked(b);
          b.setAttribute('aria-checked', String(checked));
          b.tabIndex = checked ? 0 : -1;
        });
      }
      buttons.forEach((b, index) => {
        b.addEventListener('click', () => {
          onPick(b);
          sync();
        });
        b.addEventListener('keydown', (event) => {
          const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
          if (!delta) return;
          event.preventDefault();
          const next = buttons[(index + delta + buttons.length) % buttons.length];
          onPick(next);
          sync();
          next.focus();
        });
      });
      sync();
    }

    buildRadioGroup(
      electrodeGroup,
      K_VALUES,
      (k) => String(k),
      (b) => Number(b.dataset.value) === state.k,
      (b) => { state.k = Number(b.dataset.value); update(); }
    );
    buildRadioGroup(
      engramGroup,
      [],
      null,
      (b) => b.dataset.layout === state.layout,
      (b) => { state.layout = b.dataset.layout; update(); }
    );
    radiusSlider.addEventListener('input', () => {
      state.radius = Number(radiusSlider.value);
      update();
    });

    resize();
    update();
    if ('ResizeObserver' in window) {
      new ResizeObserver(() => { resize(); update(); }).observe(canvas);
    } else {
      window.addEventListener('resize', () => { resize(); update(); });
    }
  }
})();
