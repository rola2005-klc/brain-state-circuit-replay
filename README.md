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

## Scientific concepts referenced

- memory engrams
- brain-state decoding
- neural stimulation
- closed-loop BCI
- predictive processing
- autobiographical memory
- identity and agency ethics

## Demo features

- Interactive target states: calm focus, autobiographical memory, skill/flow, emotional memory
- Adjustable cue strength, stimulation strength, and feedback strength
- Conceptual neural network map with activation levels
- Timeline chart for similarity and risk across replay steps
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

## Repository structure

```text
index.html              # static website entry point
style.css               # responsive visual design
src/simulation.js       # pure simulation logic
src/app.js              # UI rendering and interaction
test.js                 # Node tests for simulation behavior
docs/concept.md         # presentable concept note
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
