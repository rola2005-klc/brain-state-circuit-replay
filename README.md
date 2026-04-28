# Brain-State Circuit Replay

**Photos record what we saw. Brain-State Circuit Replay asks whether we can reconstruct what we were.**

This repository is currently building the conceptual and scientific foundation for a speculative neuroscience / BCI thesis. The first goal is a clear, presentable idea: if photos, videos, music, and smell can trigger memory, could future interfaces help a person partially re-enter the **integrated self-state** of a past moment?

The emotional problem is **The Unreturnable Present Paradox / 当下不可归悖论**: when a person is very happy or inside an important moment, the thought "I can't go back anymore" can create anticipatory grief that blocks the person from fully living that moment.

The interactive simulation is secondary. It supports the thesis by making assumptions visible: target states, replay modes, similarity, reconstruction error, and safety risk. The main artifact is the foundation: what the concept means, what science supports, what is plausible extrapolation, and what remains speculative.

This project does **not** claim literal time travel, medical treatment, exact human memory replay, exact visual playback, or EEG reading synaptic traces.

## Start here: one-minute path

1. Open the GitHub Pages 3D mindmap: [`index.html`](index.html)
2. Follow the process journey: [`journey.html`](journey.html)
3. Read the full thesis: [`docs/unreturnable-present-paradox.md`](docs/unreturnable-present-paradox.md)
4. Check the scientific foundation: [`docs/presentable-foundation.md`](docs/presentable-foundation.md)

Audience paths:

- **Researchers:** start with the [full thesis](docs/unreturnable-present-paradox.md), then read the [native memory trace explainer](docs/native-memory-trace-reactivation.md), [research map](docs/research.md), and [data model](docs/data-model.md).
- **Internship reviewers:** start with the [3D mindmap](index.html), skim the [process journey](journey.html), then inspect the [foundation](docs/presentable-foundation.md), [presentation outline](docs/presentation-outline.md), tests, and synthetic data scripts.
- **General viewers:** start with the [process journey](journey.html), then use the [3D mindmap](index.html) to explore the idea visually.

## Project thesis

We may not be able to go back in time, but we may learn how to revisit parts of brain-body-self states.

The central theory is that a meaningful past moment is not only a stored image. It is a distributed integrated self-state involving body state, attention, emotion topology, context, self-model, meaning, and configured ignorance: the ability to feel the world that way from that version of the self.

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

This project asks whether future neurotechnology could make state replay intentional, measurable, and safe while treating emotion as structured information rather than noise. The design target is **Resonance over Recreation**: past-state replay should return the person to the present, not trap them in the past.

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
journey.html            # one-minute process journey page
style.css               # responsive visual design
src/journey.js          # keyboard/click process journey interaction
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
docs/unreturnable-present-paradox.md # refined thesis and ethical boundary
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
