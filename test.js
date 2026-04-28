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

// Protocols should represent distinct plausible intervention mechanisms
assert(sim.STIMULATION_PROTOCOLS.cue.affectedSystems.includes('hippocampus'));
assert(sim.STIMULATION_PROTOCOLS.neurofeedback.affectedSystems.includes('pfc'));
assert(sim.STIMULATION_PROTOCOLS.dbs.riskMultiplier > sim.STIMULATION_PROTOCOLS.cue.riskMultiplier);

const cueReplay = sim.simulateReplay({ targetId: 'childhood', protocol: 'cue', cue: 0.45, stimulation: 0.35, feedback: 0.5, steps: 8, seed: 21 });
const dbsReplay = sim.simulateReplay({ targetId: 'childhood', protocol: 'dbs', cue: 0.45, stimulation: 0.35, feedback: 0.5, steps: 8, seed: 21 });
assert.strictEqual(cueReplay.protocol.id, 'cue');
assert.strictEqual(dbsReplay.protocol.id, 'dbs');
assert(cueReplay.history.some(step => step.intervention && step.intervention.mechanism), 'history should explain how the state changed');
assert(dbsReplay.history.at(-1).risk >= cueReplay.history.at(-1).risk, 'DBS-like direct modulation should carry equal or higher modeled risk than cue-only replay');

const mimoReplay = sim.simulateReplay({ targetId: 'flow', protocol: 'mimo', cue: 0.2, stimulation: 0.35, feedback: 0.8, steps: 8, seed: 33 });
assert(mimoReplay.history.at(-1).error < mimoReplay.history[0].error, 'MIMO-inspired protocol should reduce reconstruction error');
assert(mimoReplay.history.at(-1).intervention.affectedSystems.includes('hippocampus'));

console.log('All simulation tests passed.');
