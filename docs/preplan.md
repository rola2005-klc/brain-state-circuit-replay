# Preplan: Privacy-Aware Neural Photography for Brain-State Replay

Status: early preplan  
Purpose: define what must exist before Brain-State Circuit Replay could move from speculative demo to a responsible long-term research/product concept.

## 1. Why a preplan is necessary

The strongest version of Brain-State Circuit Replay assumes some future ability to record rich brain-body states over time. That immediately creates two problems:

1. **Realism problem:** current consumer technology cannot record enough neural detail to reconstruct a past self-state.
2. **Privacy problem:** if a system could record inner states, it would create extremely sensitive data: emotion, memory, attention, identity, relationships, and possible mental health signals.

Therefore the project should not jump directly to “replay the past.” It needs a staged plan that separates what can be built now from what remains future-facing and ethically constrained.

## 2. Core distinction

Brain-State Circuit Replay should distinguish three modes:

| Mode | Data source | Claim strength | Example |
| --- | --- | --- | --- |
| Generative emulation | photos, diary, audio, memory cues, synthetic assumptions | weak/speculative | approximating childhood self-state without neural records |
| Multimodal reconstruction | wearable/body data + context + user report + low-res neural signals | medium/future-adjacent | reconstructing stress/flow/calm states from recorded life data |
| Recorded-state replay | high-resolution future neural/body recording | strongest but not currently realistic | replaying a state snapshot recorded by future neural photography |

The current repo should honestly live in the first mode, with a roadmap toward the second. The third is a frontier hypothesis.

## 3. Privacy-first principles

If neural photography ever becomes possible, the data should be treated as more sensitive than photos, location history, or medical records.

Principles:

1. **Local-first storage:** raw brain/body data should stay on the user's device by default.
2. **Data minimization:** record only the features needed for the task, not continuous raw inner life.
3. **User-owned encryption:** data should be encrypted with keys controlled by the user.
4. **Revocability:** users must be able to delete state records and prevent future replay.
5. **Consent per replay:** recording consent is not the same as replay consent.
6. **No hidden inference:** the system should disclose what it inferred: emotion, attention, memory category, identity-state estimate, etc.
7. **No manipulation mode:** replay should not be optimized to make users more attached, nostalgic, dependent, or suggestible.
8. **Uncertainty display:** the interface must show confidence and ambiguity; it should never pretend a reconstructed state is exact.
9. **Trauma safeguards:** high-risk memories/states require stronger restrictions and possibly clinician-mediated use.
10. **No third-party access by default:** employers, schools, insurers, advertisers, and platforms should not access inner-state records.

## 4. Technical roadmap

### Phase 0 — Current toy model

Goal: make the theory explicit and computational.

Already implemented:

- conceptual neural systems;
- intervention protocols;
- similarity/error/risk metrics;
- synthetic dataset;
- nearest-centroid decoder baseline;
- theory and research docs.

### Phase 1 — Privacy-aware conceptual model

Build next:

- real-vs-speculative table;
- privacy threat model;
- user-consent state machine;
- local-only data architecture diagram;
- README section explaining that neural photography is a future precondition, not a current claim.

### Phase 2 — Multimodal mock recording

Instead of pretending to have real neural data, simulate a safe mock record:

```text
timestamp
external cues: image/audio/location labels
body signals: heart rate, sleep, movement, stress proxy
self report: mood, memory tag, meaning tag
brain-state embedding: synthetic vector
privacy metadata: consent, sensitivity, retention rule
```

This becomes a toy version of “neural photo metadata.”

### Phase 3 — Replay planner

Given a recorded/mock state, generate a safe replay plan:

- cue sequence;
- target state vector;
- allowed intervention types;
- maximum emotional intensity;
- stop conditions;
- uncertainty statement;
- user consent prompt.

### Phase 4 — Stronger science layer

Add literature-backed analysis:

- targeted memory reactivation;
- hippocampal replay;
- cortical reinstatement;
- neurofeedback;
- body ownership/self-model illusions;
- memory reconsolidation;
- privacy and neurorights.

### Phase 5 — Frontier scenario

Only as speculative ethics:

- past-self blending;
- temporary self-model substitution;
- identity continuity;
- agency and consent;
- memory distortion risk.

## 5. Product architecture sketch

```text
Moment capture
  ├─ external record: photo/video/audio/location
  ├─ body record: heart rate, sleep, movement, stress proxy
  ├─ self-report: mood, meaning, memory tag
  └─ future neural embedding: brain-state vector
        ↓
Privacy filter
  ├─ local encryption
  ├─ sensitivity classification
  ├─ retention/delete policy
  └─ replay permission
        ↓
Replay model
  ├─ target state estimate
  ├─ cue/intervention sequence
  ├─ similarity/error/risk monitor
  └─ uncertainty display
        ↓
Experience
  ├─ present self remains dominant
  ├─ past self-state partially blends
  └─ user can stop/reverse at any time
```

## 6. What the project should claim now

Safe claim:

> This project explores how a future privacy-preserving neural photography system might represent, reconstruct, and safely replay approximate brain-body states.

Avoid claiming:

- current devices can record enough brain data;
- exact childhood states can be recovered;
- memories are stored as replayable files;
- emotional or identity states can be safely manipulated without risk.

## 7. Next implementation tasks

1. Add a `docs/privacy.md` threat model.
2. Add a `docs/neural-photography.md` concept note.
3. Add mock state-record schema in `data/mock_state_records.csv`.
4. Add a replay-plan generator script that takes a mock record and outputs cue sequence + risk constraints.
5. Add README section: “Why this requires a preplan.”
6. Add web demo panel: “recorded state vs inferred state vs emulated state.”
