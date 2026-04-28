# Synthetic Data Layer

This repository now includes a small, generated dataset to make the theory more concrete.

Important: this is **not real neural data**. It is a controlled toy dataset that lets us test whether the project architecture is coherent:

> target brain-body state → protocol-specific intervention → distributed state vector → decoded label / safety risk

## Dataset

Generated file:

```text
data/synthetic_state_samples.csv
```

Current size:

- 480 rows
- 4 target states
- 4 intervention protocols
- 6 conceptual neural systems

## Features

Each row contains:

| Column | Meaning |
|---|---|
| `target_state` | target state label: calm, childhood, flow, grief |
| `protocol` | cue, neurofeedback, dbs, or mimo |
| `hippocampus` | episodic indexing / memory binding activation |
| `amygdala` | emotional salience activation |
| `pfc` | prefrontal control / self-regulation activation |
| `sensory` | sensory-fragment activation |
| `insula` | body/interoceptive activation |
| `motor` | readiness/action activation |
| `cue_strength` | external cue intensity |
| `stimulation_strength` | modeled modulation intensity |
| `feedback_strength` | closed-loop feedback/adaptation strength |
| `similarity_to_target` | cosine similarity to the target state vector |
| `reconstruction_error` | root mean squared distance from the target vector |
| `safety_risk` | toy risk metric based on salience/body activation and PFC control |

## Protocol logic

The dataset generator encodes four possible ways a system might alter state:

1. **Cueing** — sound/odor/context cues nudge hippocampus and sensory cortex.
2. **Neurofeedback** — feedback increases PFC regulation and reduces emotional overshoot.
3. **Closed-loop DBS-like stimulation** — stronger direct modulation with higher modeled risk.
4. **MIMO-inspired hippocampal correction** — a memory-prosthesis-inspired transition correction for hippocampus and sensory cortex.

## Reproduce

```bash
python3 scripts/generate_synthetic_data.py --samples-per-state 120 --seed 42 --out data/synthetic_state_samples.csv
```

Expected current output:

```text
wrote 480 rows to data/synthetic_state_samples.csv
nearest-centroid decoding accuracy: 90.83% (120 test rows)
```

Evaluate without writing a CSV:

```bash
python3 scripts/evaluate_decoder.py --samples-per-state 120 --seed 42
```

## Why nearest-centroid decoding?

The goal is not to prove a complex ML method. The first data layer should be transparent:

- Each state is represented by a vector.
- Each label has a centroid.
- A new sample is classified by whichever centroid is closest.

This gives a simple baseline that reviewers can understand quickly. Later, the project can add logistic regression, random forests, HMM/state-space models, or neural sequence models.

## What this supports

This data layer supports the project claim that a brain-state replay system would need:

1. a measurable state representation;
2. intervention methods that affect different systems differently;
3. a decoder that maps signals back to state labels;
4. a safety score that changes with protocol and emotional salience;
5. clear limitations separating toy simulation from real neuroscience.

## Limitations

- The numbers are generated from assumptions, not recorded from brains.
- Brain systems are simplified into six scalar values.
- Protocol effects are heuristic, not biophysical.
- High decoder accuracy means the synthetic states are separable, not that real brain states are easy to decode.

This is the right next step for a portfolio project: it turns a speculative theory into a testable toy system while staying scientifically honest.
