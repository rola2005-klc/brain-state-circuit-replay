(() => {
const {
  DEFAULT_SYSTEMS,
  TARGET_STATES,
  simulateReplay
} = window.BSCR;

const els = {
  targetState: document.getElementById('targetState'),
  cue: document.getElementById('cue'),
  stimulation: document.getElementById('stimulation'),
  feedback: document.getElementById('feedback'),
  cueValue: document.getElementById('cueValue'),
  stimValue: document.getElementById('stimValue'),
  feedbackValue: document.getElementById('feedbackValue'),
  runButton: document.getElementById('runButton'),
  targetDescription: document.getElementById('targetDescription'),
  similarity: document.getElementById('similarity'),
  similarityBar: document.getElementById('similarityBar'),
  error: document.getElementById('error'),
  errorBar: document.getElementById('errorBar'),
  risk: document.getElementById('risk'),
  riskBar: document.getElementById('riskBar'),
  decoded: document.getElementById('decoded'),
  brainMap: document.getElementById('brainMap'),
  timeline: document.getElementById('timeline')
};

let seed = 5;
let latest = null;

function init() {
  for (const [id, state] of Object.entries(TARGET_STATES)) {
    const option = document.createElement('option');
    option.value = id;
    option.textContent = state.name;
    els.targetState.appendChild(option);
  }
  els.targetState.value = 'childhood';
  for (const input of [els.cue, els.stimulation, els.feedback, els.targetState]) {
    input.addEventListener('input', run);
  }
  els.runButton.addEventListener('click', () => { seed += 17; run(); });
  run();
}

function run() {
  els.cueValue.textContent = Number(els.cue.value).toFixed(2);
  els.stimValue.textContent = Number(els.stimulation.value).toFixed(2);
  els.feedbackValue.textContent = Number(els.feedback.value).toFixed(2);
  latest = simulateReplay({
    targetId: els.targetState.value,
    cue: Number(els.cue.value),
    stimulation: Number(els.stimulation.value),
    feedback: Number(els.feedback.value),
    steps: 14,
    seed
  });
  render(latest);
}

function render(result) {
  const last = result.history[result.history.length - 1];
  const similarityPct = Math.round(last.similarity * 100);
  const riskPct = Math.round(last.risk * 100);
  els.targetDescription.textContent = result.target.description;
  els.similarity.textContent = `${similarityPct}%`;
  els.similarityBar.style.width = `${similarityPct}%`;
  els.error.textContent = last.error.toFixed(2);
  els.errorBar.style.width = `${Math.min(100, Math.round(last.error * 120))}%`;
  els.risk.textContent = `${riskPct}%`;
  els.riskBar.style.width = `${riskPct}%`;
  els.decoded.innerHTML = `<strong>Decoded closest state:</strong> ${result.decoded.name} (${Math.round(result.decoded.score * 100)}% match).`;
  drawBrain(last.pattern, result.target.pattern);
  drawTimeline(result.history);
}

function drawBrain(pattern, target) {
  const w = 900;
  const h = 560;
  const points = DEFAULT_SYSTEMS.map(node => ({ ...node, px: node.x * w, py: node.y * h }));
  const edges = [
    ['hippocampus', 'amygdala'], ['hippocampus', 'pfc'], ['hippocampus', 'sensory'],
    ['amygdala', 'insula'], ['pfc', 'motor'], ['sensory', 'motor'], ['insula', 'pfc'], ['sensory', 'insula']
  ];
  els.brainMap.innerHTML = '';
  const bg = svg('path', { d: 'M168 288 C120 168 210 70 360 72 C528 20 750 80 790 246 C838 450 662 534 446 502 C270 548 108 438 168 288Z', fill: 'rgba(255,255,255,0.035)', stroke: 'rgba(255,255,255,0.10)', 'stroke-width': 3 });
  els.brainMap.appendChild(bg);
  for (const [a, b] of edges) {
    const p1 = points.find(p => p.id === a);
    const p2 = points.find(p => p.id === b);
    els.brainMap.appendChild(svg('line', { class: 'edge', x1: p1.px, y1: p1.py, x2: p2.px, y2: p2.py }));
  }
  for (const node of points) {
    const value = pattern[node.id] ?? 0;
    const targetValue = target[node.id] ?? 0;
    const radius = 42 + value * 26;
    const hue = Math.round(170 + value * 70);
    els.brainMap.appendChild(svg('circle', { cx: node.px, cy: node.py, r: radius + 8, fill: `rgba(124,247,212,${0.06 + value * 0.16})` }));
    els.brainMap.appendChild(svg('circle', { class: 'node', cx: node.px, cy: node.py, r: radius, fill: `hsl(${hue} 88% ${40 + value * 24}%)` }));
    els.brainMap.appendChild(svg('circle', { cx: node.px, cy: node.py, r: 8 + targetValue * 10, fill: 'rgba(5,7,12,0.55)' }));
    const label = svg('text', { class: 'node-label', x: node.px, y: node.py + radius + 30 });
    label.textContent = node.label;
    const role = svg('text', { class: 'node-role', x: node.px, y: node.py + radius + 49 });
    role.textContent = node.role;
    els.brainMap.appendChild(label);
    els.brainMap.appendChild(role);
  }
}

function drawTimeline(history) {
  const canvas = els.timeline;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(5, 8, 15, 0.95)';
  ctx.fillRect(0, 0, w, h);
  drawSeries(ctx, history.map(d => d.similarity), '#7cf7d4', 'similarity', 34);
  drawSeries(ctx, history.map(d => d.risk), '#ff7d9d', 'safety risk', 66);
  ctx.fillStyle = '#9fb0c8';
  ctx.font = '22px system-ui';
  ctx.fillText('0', 28, h - 28);
  ctx.fillText(`${history.length - 1} replay steps`, w - 190, h - 28);
}

function drawSeries(ctx, values, color, label, legendY) {
  const pad = 56;
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.beginPath();
  values.forEach((v, i) => {
    const x = pad + i * ((w - pad * 2) / (values.length - 1));
    const y = h - pad - v * (h - pad * 2);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.font = '22px system-ui';
  ctx.fillText(label, 34, legendY);
}

function svg(tag, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
  return el;
}

init();
})();
