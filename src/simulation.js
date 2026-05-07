/* Brain-State Circuit Resonance simulation core.
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

const STIMULATION_PROTOCOLS = {
  cue: {
    id: 'cue',
    name: 'Sensory / context cueing',
    method: 'Non-invasive memory cues such as sound, odor, image, place, or story context.',
    mechanism: 'Biases hippocampus and sensory cortex toward a remembered pattern; lower direct-control risk but weaker precision.',
    affectedSystems: ['hippocampus', 'sensory'],
    weights: { hippocampus: 1.15, sensory: 1.05, amygdala: 0.35, insula: 0.45, pfc: 0.25, motor: 0.15 },
    riskMultiplier: 0.80,
    precision: 0.72
  },
  neurofeedback: {
    id: 'neurofeedback',
    name: 'Neurofeedback training',
    method: 'Real-time feedback from EEG/fMRI-like signals helps the person learn a regulation strategy.',
    mechanism: 'Strengthens prefrontal control and gradually reduces emotional overshoot while approaching the target.',
    affectedSystems: ['pfc', 'amygdala', 'insula'],
    weights: { hippocampus: 0.45, sensory: 0.35, amygdala: 0.75, insula: 0.70, pfc: 1.20, motor: 0.35 },
    riskMultiplier: 0.65,
    precision: 0.82
  },
  dbs: {
    id: 'dbs',
    name: 'Closed-loop deep stimulation',
    method: 'Implant-like adaptive stimulation acts more directly on a target circuit when decoded state diverges.',
    mechanism: 'Moves limbic/control nodes faster, but high emotional salience can increase safety risk.',
    affectedSystems: ['amygdala', 'insula', 'pfc', 'hippocampus'],
    weights: { hippocampus: 0.80, sensory: 0.35, amygdala: 1.10, insula: 1.00, pfc: 0.95, motor: 0.40 },
    riskMultiplier: 1.28,
    precision: 0.88
  },
  mimo: {
    id: 'mimo',
    name: 'Hippocampal prosthesis-inspired MIMO correction',
    method: 'A model predicts a desired hippocampal output pattern from the current input state and applies corrective stimulation.',
    mechanism: 'Corrects hippocampus-to-cortex transition errors, improving reconstruction without assuming exact memory replay.',
    affectedSystems: ['hippocampus', 'pfc', 'sensory'],
    weights: { hippocampus: 1.25, sensory: 0.80, amygdala: 0.40, insula: 0.45, pfc: 0.95, motor: 0.55 },
    riskMultiplier: 0.92,
    precision: 0.94
  }
};

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

function weightedBlendPatterns(current, target, strength, weights = {}) {
  const result = {};
  for (const key of Object.keys(target)) {
    const c = current[key] ?? 0;
    const weight = weights[key] ?? 1;
    result[key] = clamp(c + (target[key] - c) * clamp(strength * weight, 0, 0.9));
  }
  return result;
}

function interventionRecord(protocol, strength, similarity) {
  return {
    protocol: protocol.id,
    name: protocol.name,
    method: protocol.method,
    mechanism: protocol.mechanism,
    affectedSystems: protocol.affectedSystems,
    strength: clamp(strength),
    decodedGap: clamp(1 - similarity)
  };
}

function applyCue(current, target, cueStrength = 0.2, noise = 0.04, seed = 7) {
  return noisyPattern(blendPatterns(current, target, cueStrength), noise, seed);
}

function replayStep(current, target, stimulation = 0.25, feedback = 0.5, noise = 0.02, seed = 1, protocol = STIMULATION_PROTOCOLS.cue) {
  const similarity = cosineSimilarity(current, target);
  const adaptiveGain = clamp(stimulation * protocol.precision * (0.45 + feedback * (1 - similarity)), 0, 0.72);
  let next = weightedBlendPatterns(current, target, adaptiveGain, protocol.weights);

  if (protocol.id === 'neurofeedback') {
    next.amygdala = clamp(next.amygdala - 0.08 * feedback * (next.amygdala - target.amygdala));
    next.pfc = clamp(next.pfc + 0.06 * feedback * (target.pfc - next.pfc));
  }

  if (protocol.id === 'mimo') {
    next.hippocampus = clamp(next.hippocampus + (target.hippocampus - next.hippocampus) * 0.18 * feedback);
    next.sensory = clamp(next.sensory + (target.sensory - next.sensory) * 0.12 * feedback);
  }

  if (protocol.id === 'dbs' && safetyRisk(next) > 0.58) {
    next.amygdala = clamp(next.amygdala + 0.03 * stimulation);
    next.insula = clamp(next.insula + 0.02 * stimulation);
  }

  return noisyPattern(next, noise * (1.08 - protocol.precision * 0.35), seed);
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

function stateMetrics(step, pattern, target, protocol, intervention = null) {
  const baseRisk = safetyRisk(pattern);
  const risk = clamp(baseRisk * protocol.riskMultiplier);
  return {
    step,
    pattern,
    similarity: cosineSimilarity(pattern, target),
    error: reconstructionError(pattern, target),
    risk,
    intervention
  };
}

function simulateReplay({ targetId = 'calm', cue = 0.25, stimulation = 0.28, feedback = 0.5, steps = 12, seed = 1, protocol = 'cue' } = {}) {
  const target = TARGET_STATES[targetId] || TARGET_STATES.calm;
  const selectedProtocol = STIMULATION_PROTOCOLS[protocol] || STIMULATION_PROTOCOLS.cue;
  let current = noisyPattern(emptyPattern(0.35), 0.5, seed);
  const history = [stateMetrics(0, current, target.pattern, selectedProtocol, {
    protocol: 'baseline',
    name: 'Baseline decoded state',
    method: 'Start from a noisy latent brain-state estimate.',
    mechanism: 'No intervention has happened yet; the system only estimates distance from the target.',
    affectedSystems: [],
    strength: 0,
    decodedGap: clamp(1 - cosineSimilarity(current, target.pattern))
  })];
  current = applyCue(current, target.pattern, cue, 0.05, seed + 100);
  history.push(stateMetrics(1, current, target.pattern, selectedProtocol, interventionRecord(STIMULATION_PROTOCOLS.cue, cue, cosineSimilarity(current, target.pattern))));
  for (let i = 2; i <= steps; i++) {
    const beforeSimilarity = cosineSimilarity(current, target.pattern);
    current = replayStep(current, target.pattern, stimulation, feedback, 0.025, seed + i, selectedProtocol);
    history.push(stateMetrics(i, current, target.pattern, selectedProtocol, interventionRecord(selectedProtocol, stimulation, beforeSimilarity)));
  }
  return { target, current, history, decoded: decodeState(current), protocol: selectedProtocol };
}

const api = {
  DEFAULT_SYSTEMS,
  STIMULATION_PROTOCOLS,
  TARGET_STATES,
  clamp,
  seededRandom,
  emptyPattern,
  noisyPattern,
  blendPatterns,
  weightedBlendPatterns,
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
