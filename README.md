# Brain-State Circuit Replay

**Photos record what we saw. Brain-State Circuit Replay asks whether we can reconstruct what we were.**

This repository is currently building the conceptual and scientific foundation for a speculative neuroscience / BCI thesis. The first goal is a clear, presentable idea: if photos, videos, music, and smell can trigger memory, could future interfaces help a person partially re-enter the **brain-body state** of a past moment?

The interactive simulation is secondary. It supports the thesis by making assumptions visible: target states, replay modes, similarity, reconstruction error, and safety risk. The main artifact is the foundation: what the concept means, what science supports, what is plausible extrapolation, and what remains speculative.

This project does **not** claim literal time travel, medical treatment, exact human memory replay, exact visual playback, or EEG reading synaptic traces.

## Start here

- Presentable foundation: [`docs/presentable-foundation.md`](docs/presentable-foundation.md)
- 8-slide presentation outline: [`docs/presentation-outline.md`](docs/presentation-outline.md)
- Technical explainer on native memory traces: [`docs/native-memory-trace-reactivation.md`](docs/native-memory-trace-reactivation.md)
- Original theory note: [`docs/theory.md`](docs/theory.md)
- Research map: [`docs/research.md`](docs/research.md)

## Project thesis

We may not be able to go back in time, but we may learn how to revisit brain-body states.

The central theory is that a meaningful past moment is not only a stored image. It is a distributed state involving perception, memory, emotion, body sensation, attention, and interpretation.

The refined idea is that no previous external brain-state recording is strictly required because plasticity and LTP are the native biological record. Experience changes synapses and circuit dynamics. The hard problem is **retroactive addressability and controlled reactivation**: how to access the right trace, reactivate it safely, and measure what happened without pretending it is exact.

A future closed-loop system might approximate that state by:

1. using photos, audio, place, smell, sleep cues, or context as external memory cues;
2. treating plasticity and engram-like traces as the biological record;
3. representing a target moment as a distributed brain-body state signature;
4. applying cueing, neurofeedback, or carefully bounded stimulation as controlled nudges;
5. monitoring similarity, reconstruction error, and safety risk;
6. showing why exact replay is impossible but partial state reconstruction is scientifically imaginable.

## Why this is interesting

Humans already experience accidental state replay:

- a song brings back a whole period of life;
- a smell triggers childhood memory;
- trauma cues recreate body states;
- athletes re-enter flow states.

This project asks whether future neurotechnology could make state replay intentional, measurable, and safe.

## Scientific backing

This is a speculative project, but it is now grounded in adjacent real research areas:

- **LTP and plasticity:** experience can leave durable changes in synapses and circuit dynamics.
- **Memory engrams:** animal studies show that activating tagged neural ensembles can evoke memory-like behavior.
- **Targeted memory reactivation:** sounds/odors paired with learning can bias later memory reactivation, especially during sleep.
- **Closed-loop neurostimulation:** human studies increasingly decode cognitive/emotional states and adapt stimulation in response.
- **Hippocampal memory prostheses:** MIMO-style models have been explored for supporting memory encoding/recall.
- **Neurofeedback:** real-time fMRI/BCI feedback can train partial self-regulation of brain activity.

Important boundary: EEG is a non-invasive state correlate. It may help monitor broad state dynamics, but it is not a circuit/engram readout and does not read synaptic memory traces.

## Current repo role

The repo currently contains three layers:

1. **Presentation foundation:** thesis, pitch outline, scientific boundaries, and roadmap.
2. **Technical concept:** native memory traces, replay modes, EEG limits, and synthetic data assumptions.
3. **Supporting demo:** a browser simulation that makes the concept tangible without claiming biological validation.

The realistic floor is cue-triggered recall and Targeted Memory Reactivation. The frontier is direct engram reactivation and guided endogenous replay. The simulation exists to keep those categories explicit.

## Run locally

```bash
python3 -m http.server 8765
```

Open:

```text
http://127.0.0.1:8765
```

## Run tests

```bash
node test.js
```

Expected output:

```text
All simulation tests passed.
```

## Data-backed toy model

The repo includes a generated synthetic dataset and decoder baseline:

```bash
python3 scripts/generate_synthetic_data.py --samples-per-state 120 --seed 42 --out data/synthetic_state_samples.csv
python3 scripts/evaluate_decoder.py --samples-per-state 120 --seed 42
```

Current baseline: nearest-centroid decoder reaches about **90.83%** accuracy on 120 held-out synthetic test rows. This does **not** prove real brain-state decoding; it proves the project has an explicit state representation, protocol assumptions, and a reproducible evaluation path.

Synthetic data layer: [`docs/data-model.md`](docs/data-model.md)

## Repository structure

```text
index.html              # static website entry point
style.css               # responsive visual design
src/simulation.js       # pure simulation logic
src/app.js              # UI rendering and interaction
test.js                 # Node tests for simulation behavior
tests/test_synthetic_data.py # Python tests for synthetic data generation/decoding
scripts/generate_synthetic_data.py # synthetic state dataset generator
scripts/evaluate_decoder.py # nearest-centroid decoding report
data/synthetic_state_samples.csv # generated toy dataset
docs/theory.md         # user's core photo-to-brain-state-replay theory
docs/concept.md         # presentable concept note
docs/presentable-foundation.md # thesis, pitch, framework, and boundaries
docs/presentation-outline.md # 8-slide presentation structure
docs/native-memory-trace-reactivation.md # EEG/LTP/engram/TMR explainer
docs/research.md        # literature-backed research map
docs/data-model.md      # synthetic data schema and baseline
docs/development-plan.md # long-term implementation plan
docs/roadmap.md         # product/research roadmap
```

## Important disclaimer

This project is an educational and speculative interface prototype. It is not medical advice, not a diagnostic tool, and not a validated neuroscience model.

## Future direction

The long-term version could become a serious portfolio project combining:

- literature review of engrams and BCI decoding;
- Python notebooks for toy dynamical systems;
- EEG/neurofeedback-inspired mock data;
- a React/Three.js visual interface;
- ethical analysis of memory manipulation and brain-state data.
