const assert = require('assert');
const sim = require('./src/simulation.js');

function approx(value, expected, tolerance = 1e-6) {
  assert(Math.abs(value - expected) <= tolerance, `${value} not within ${tolerance} of ${expected}`);
}

// clamp behavior
assert.strictEqual(sim.clamp(2), 1);
assert.strictEqual(sim.clamp(-1), 0);
approx(sim.clamp(0.42), 0.42);

// Similarity basics
assert.strictEqual(sim.cosineSimilarity({ a: 0 }, { a: 1 }), 0);
approx(sim.cosineSimilarity({ a: 1, b: 0 }, { a: 1, b: 0 }), 1);
assert(sim.cosineSimilarity({ a: 1, b: 0 }, { a: 0, b: 1 }) < 0.01);

// Blending should move current toward target
const current = { hippocampus: 0, amygdala: 0, pfc: 0, sensory: 0, insula: 0, motor: 0 };
const target = sim.TARGET_STATES.calm.pattern;
const blended = sim.blendPatterns(current, target, 0.5);
approx(blended.pfc, target.pfc * 0.5);
assert(sim.reconstructionError(blended, target) < sim.reconstructionError(current, target));

// Replay should improve similarity over time for the same target
const result = sim.simulateReplay({ targetId: 'flow', cue: 0.25, stimulation: 0.35, feedback: 0.7, steps: 14, seed: 11 });
const first = result.history[0].similarity;
const last = result.history[result.history.length - 1].similarity;
assert(last > first, `expected final similarity ${last} > initial ${first}`);
assert.strictEqual(result.decoded.id, 'flow');

// Safety risk should rise for high-amygdala/high-insula/low-PFC state
const lowRisk = sim.safetyRisk({ amygdala: 0.1, insula: 0.1, pfc: 0.9 });
const highRisk = sim.safetyRisk({ amygdala: 0.95, insula: 0.9, pfc: 0.1 });
assert(highRisk > lowRisk, 'risk function should rank high salience state as riskier');

console.log('All simulation tests passed.');
