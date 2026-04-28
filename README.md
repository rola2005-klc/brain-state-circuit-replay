# Brain-State Circuit Replay

**Can a future brain-computer interface help someone re-enter a useful past brain-body state?**

This repository is a portfolio-ready conceptual simulation for a speculative neuroscience / BCI idea. It does **not** claim to model the real brain biologically. Instead, it turns the idea into an interactive demo that recruiters, researchers, and classmates can understand quickly.

## Project thesis

We may not be able to go back in time, but we may learn how to revisit brain-body states.

The demo imagines a future closed-loop BCI system that tries to reconstruct a target mental state by:

1. representing a target state as a distributed pattern across conceptual neural systems;
2. applying memory cues and stimulation as controlled nudges;
3. monitoring similarity, reconstruction error, and safety risk;
4. showing why exact replay is impossible but partial state reconstruction may be useful.

## Why this is interesting

Humans already experience accidental state replay:

- a song brings back a whole period of life;
- a smell triggers childhood memory;
- trauma cues recreate body states;
- athletes re-enter flow states.

This project asks whether future neurotechnology could make state replay intentional, measurable, and safe.

## Scientific backing

This is a speculative project, but it is now grounded in adjacent real research areas:

- **Memory engrams:** animal studies show that activating tagged neural ensembles can evoke memory-like behavior.
- **Targeted memory reactivation:** sounds/odors paired with learning can bias later memory reactivation, especially during sleep.
- **Closed-loop neurostimulation:** human studies increasingly decode cognitive/emotional states and adapt stimulation in response.
- **Hippocampal memory prostheses:** MIMO-style models have been explored for supporting memory encoding/recall.
- **Neurofeedback:** real-time fMRI/BCI feedback can train partial self-regulation of brain activity.

Read the research map: [`docs/research.md`](docs/research.md)

Long-term development plan: [`docs/development-plan.md`](docs/development-plan.md)

Synthetic data layer: [`docs/data-model.md`](docs/data-model.md)

## Demo features

- Interactive target states: calm focus, autobiographical memory, skill/flow, emotional memory
- Intervention protocol selector: sensory/context cueing, neurofeedback, closed-loop DBS-like modulation, MIMO-inspired hippocampal correction
- Method/mechanism panel explaining how the selected protocol changes the simulated state
- Adjustable cue strength, stimulation strength, and feedback strength
- Conceptual neural network map with activation levels
- Timeline chart for similarity and risk across replay steps
- Research-anchor section and linked backup docs
- Safety framing: emotional replay is powerful and should require safeguards
- Pure JavaScript simulation core with Node tests

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
docs/concept.md         # presentable concept note
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
