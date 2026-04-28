# Long-Term Development Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Turn Brain-State Circuit Replay from a thin website into a research-backed GitHub project with data, plausible methods, simulations, and strong portfolio storytelling.

**Architecture:** Keep the static web demo as the public face, but make the GitHub repository the real artifact: research notes, simulation core, tests, notebooks, diagrams, and a staged roadmap. The scientific model should remain honest: approximate state signatures and closed-loop modulation, not literal time travel.

**Tech Stack:** Vanilla HTML/CSS/JS for demo, Node tests for simulation, Markdown docs for research, future Python notebooks for synthetic data and modeling.

---

## Phase 1 — Backup the theory with research and methods

### Task 1: Add research map

**Objective:** Give the project credible scientific anchors.

**Files:**
- Create: `docs/research.md`
- Modify: `README.md`

**Verification:** README links to research doc; research doc has at least five research threads: engrams, targeted memory reactivation, closed-loop stimulation, hippocampal prosthesis, neurofeedback.

### Task 2: Add method taxonomy

**Objective:** Explain possible mechanisms for changing state.

**Files:**
- Create: `docs/methods.md`

**Content:**
- Non-invasive cues: audio/odor/visual/context cues
- Neurofeedback: fMRI/EEG feedback loop
- Non-invasive stimulation: TMS/tES as conceptual modulation
- Invasive stimulation: DBS/ECoG/hippocampal prosthesis
- Safety layer: emotional salience, autonomy, consent, stop conditions

### Task 3: Update website backup content

**Objective:** The page should still be meaningful if the interactive chart feels simple.

**Files:**
- Modify: `index.html`
- Modify: `style.css`

**Content:** Add sections for Research Anchors, Possible Methods, and Limitations.

---

## Phase 2 — Make the simulation scientifically richer

### Task 4: Add stimulation protocols to simulation core

**Objective:** Replace one generic stimulation slider with plausible mechanisms.

**Files:**
- Modify: `src/simulation.js`
- Test: `test.js`

**Protocols:**
- `cue`: sensory/context cue nudges hippocampus + sensory cortex.
- `neurofeedback`: improves PFC control and reduces amygdala overshoot.
- `dbs`: stronger direct modulation, higher risk if emotional salience is high.
- `mimo`: hippocampal prosthesis-inspired state-transition correction.

**Test first:** Verify that each protocol produces distinct patterns and safety profiles.

### Task 5: Add state transition explanation

**Objective:** The demo should answer: “Through what method does stimulation change the state?”

**Files:**
- Modify: `src/app.js`
- Modify: `index.html`

**UI:** Add protocol selector and an explanation panel showing mechanism, affected systems, and current intervention steps.

### Task 6: Add failure modes

**Objective:** Show why exact replay is hard and risky.

**Files:**
- Modify: `src/simulation.js`
- Modify: `src/app.js`

**Failure modes:**
- emotional overshoot
- low target specificity
- noisy decoding
- memory cue collision

---

## Phase 3 — Add data / ML component

### Task 7: Generate synthetic brain-state dataset

**Objective:** Create a toy dataset that supports decoding demonstrations.

**Files:**
- Create: `data/synthetic_state_samples.csv`
- Create: `scripts/generate_synthetic_data.py`

**Columns:** state label, hippocampus, amygdala, pfc, sensory, insula, motor, risk, cue strength, stimulation type.

### Task 8: Add decoding notebook

**Objective:** Show data science ability.

**Files:**
- Create: `notebooks/state_decoding_demo.ipynb`

**Model:** Simple classifier or nearest-centroid decoder predicting state from synthetic vectors.

### Task 9: Add limitations report

**Objective:** Prevent overclaiming and show ethical maturity.

**Files:**
- Create: `docs/limitations-and-ethics.md`

---

## Phase 4 — Portfolio polish

### Task 10: Add images/GIF

**Objective:** Make README visually strong.

**Files:**
- Create: `assets/demo-screenshot.png`
- Modify: `README.md`

### Task 11: Add pitch deck outline

**Objective:** Make it presentation-ready.

**Files:**
- Create: `docs/pitch.md`

### Task 12: Add GitHub issues/project board

**Objective:** Show long-term execution.

**Verification:** Issues exist for each phase and are linked from README.
