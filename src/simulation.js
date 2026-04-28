/* Brain-State Circuit Replay simulation core.
 * A conceptual, educational model — not a biological claim.
 */

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function seededRandom(seed) {
  let t = seed >>> 0;
  return function rand() {
    t += 0x6D2B79F5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

const DEFAULT_SYSTEMS = [
  { id: 'hippocampus', label: 'Hippocampus', role: 'episodic indexing', x: 0.28, y: 0.50 },
  { id: 'amygdala', label: 'Amygdala', role: 'emotional salience', x: 0.44, y: 0.70 },
  { id: 'pfc', label: 'Prefrontal cortex', role: 'control / self narrative', x: 0.60, y: 0.28 },
  { id: 'sensory', label: 'Sensory cortex', role: 'perceptual fragments', x: 0.74, y: 0.50 },
  { id: 'insula', label: 'Insula', role: 'body / interoception', x: 0.56, y: 0.82 },
  { id: 'motor', label: 'Motor cortex', role: 'readiness / action', x: 0.80, y: 0.26 }
];

const TARGET_STATES = {
  calm: {
    name: 'Calm focus',
    description: 'A stable state with high executive control and low threat salience.',
    pattern: { hippocampus: 0.45, amygdala: 0.22, pfc: 0.86, sensory: 0.55, insula: 0.42, motor: 0.36 }
  },
  childhood: {
    name: 'Autobiographical memory',
    description: 'A vivid memory-like state with sensory fragments and episodic indexing.',
    pattern: { hippocampus: 0.92, amygdala: 0.58, pfc: 0.52, sensory: 0.83, insula: 0.68, motor: 0.30 }
  },
  flow: {
    name: 'Skill / flow state',
    description: 'A performance state combining motor readiness, focus, and low self-noise.',
    pattern: { hippocampus: 0.38, amygdala: 0.30, pfc: 0.74, sensory: 0.67, insula: 0.52, motor: 0.88 }
  },
  grief: {
    name: 'Emotional memory',
    description: 'A high-salience state used here to show why safeguards matter.',
    pattern: { hippocampus: 0.76, amygdala: 0.90, pfc: 0.36, sensory: 0.62, insula: 0.82, motor: 0.25 }
  }
};

function emptyPattern(value = 0) {
  return DEFAULT_SYSTEMS.reduce((acc, node) => {
    acc[node.id] = value;
    return acc;
  }, {});
}

function noisyPattern(base, noise = 0.15, seed = 42) {
  const rand = seededRandom(seed);
  const result = {};
  for (const key of Object.keys(base)) {
    result[key] = clamp(base[key] + (rand() - 0.5) * noise);
  }
  return result;
}

function blendPatterns(current, target, strength) {
  const result = {};
  for (const key of Object.keys(target)) {
    const c = current[key] ?? 0;
    result[key] = clamp(c + (target[key] - c) * clamp(strength));
  }
  return result;
}

function applyCue(current, target, cueStrength = 0.2, noise = 0.04, seed = 7) {
  return noisyPattern(blendPatterns(current, target, cueStrength), noise, seed);
}

function replayStep(current, target, stimulation = 0.25, feedback = 0.5, noise = 0.02, seed = 1) {
  const similarity = cosineSimilarity(current, target);
  const adaptiveGain = clamp(stimulation * (0.55 + feedback * (1 - similarity)), 0, 0.65);
  return noisyPattern(blendPatterns(current, target, adaptiveGain), noise, seed);
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (const key of Object.keys(b)) {
    const av = a[key] ?? 0;
    const bv = b[key] ?? 0;
    dot += av * bv;
    magA += av * av;
    magB += bv * bv;
  }
  if (magA === 0 || magB === 0) return 0;
  return clamp(dot / (Math.sqrt(magA) * Math.sqrt(magB)));
}

function reconstructionError(current, target) {
  const keys = Object.keys(target);
  const mse = keys.reduce((sum, key) => sum + Math.pow((current[key] ?? 0) - target[key], 2), 0) / keys.length;
  return Math.sqrt(mse);
}

function safetyRisk(pattern) {
  const amygdala = pattern.amygdala ?? 0;
  const insula = pattern.insula ?? 0;
  const pfc = pattern.pfc ?? 0;
  return clamp(0.55 * amygdala + 0.30 * insula - 0.25 * pfc + 0.15);
}

function decodeState(pattern) {
  let best = null;
  for (const [id, state] of Object.entries(TARGET_STATES)) {
    const score = cosineSimilarity(pattern, state.pattern);
    if (!best || score > best.score) best = { id, name: state.name, score };
  }
  return best;
}

function simulateReplay({ targetId = 'calm', cue = 0.25, stimulation = 0.28, feedback = 0.5, steps = 12, seed = 1 } = {}) {
  const target = TARGET_STATES[targetId] || TARGET_STATES.calm;
  let current = noisyPattern(emptyPattern(0.35), 0.5, seed);
  const history = [{ step: 0, pattern: current, similarity: cosineSimilarity(current, target.pattern), error: reconstructionError(current, target.pattern), risk: safetyRisk(current) }];
  current = applyCue(current, target.pattern, cue, 0.05, seed + 100);
  history.push({ step: 1, pattern: current, similarity: cosineSimilarity(current, target.pattern), error: reconstructionError(current, target.pattern), risk: safetyRisk(current) });
  for (let i = 2; i <= steps; i++) {
    current = replayStep(current, target.pattern, stimulation, feedback, 0.025, seed + i);
    history.push({ step: i, pattern: current, similarity: cosineSimilarity(current, target.pattern), error: reconstructionError(current, target.pattern), risk: safetyRisk(current) });
  }
  return { target, current, history, decoded: decodeState(current) };
}

const api = {
  DEFAULT_SYSTEMS,
  TARGET_STATES,
  clamp,
  seededRandom,
  emptyPattern,
  noisyPattern,
  blendPatterns,
  applyCue,
  replayStep,
  cosineSimilarity,
  reconstructionError,
  safetyRisk,
  decodeState,
  simulateReplay
};

if (typeof module !== 'undefined') module.exports = api;
if (typeof window !== 'undefined') window.BSCR = api;
