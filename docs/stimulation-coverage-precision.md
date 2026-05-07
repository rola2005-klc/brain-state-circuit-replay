# Stimulation: Coverage, Precision, and Where Memory Lives

A literature map for the second professor-flagged limitation: even granting that
some target memory state can be detected, can we *write* to the right neurons
with enough coverage and precision to evoke it? This document surveys what is
known about engram localization and the tradeoffs of current stimulation
modalities. It is paired with a deliberately simple 2-D toy simulation
([scripts/simulate_stimulation_coverage.py](../scripts/simulate_stimulation_coverage.py))
that visualizes the precision/coverage tradeoff in the abstract.

---

## 1. Where do memories live?

Memory is not stored at a single address. The dominant view across rodent
optogenetics, human imaging, and lesion studies is that an episodic memory is
encoded as a **distributed engram** — a sparse subset of neurons in multiple
regions whose coactivation is a learned signature.

Components implicated for an autobiographical "happy" memory:

| Region | Role in the engram | Key references |
|---|---|---|
| Hippocampus (DG, CA3, CA1) | Indexing and binding of episodic content; sparse coding in DG | Tonegawa et al. *Nature* 2012; Liu et al. *Nature* 2012 |
| Medial PFC | Site of remote-memory consolidation; takes over from hippocampus over weeks | Frankland & Bontempi *Nat Rev Neurosci* 2005; Kitamura et al. *Science* 2017 |
| Amygdala (BLA) | Affective tagging — gives a memory its emotional "valence" | Redondo et al. *Nature* 2014 |
| Sensory / association cortex | Modality-specific content (visual scene, voices, smells) | Josselyn & Tonegawa *Science* 2020 (review) |
| Default-mode network (PCC, mPFC, AG) | Self-referential retrieval and replay | Buckner & DiNicola *Nat Rev Neurosci* 2019 |

Two consequences for a stimulation-based replay device:

1. **There is no single coordinate to target.** Reactivating a memory means
   driving a *pattern* across regions in a coordinated way.
2. **Engram cells are sparse** (~2–5% of a region's neurons in rodent work).
   Recruiting unrelated neighbors should be expected to corrupt or override
   the target memory, not just dilute it.

---

## 2. Stimulation modalities and their tradeoffs

Every available modality picks a point on a coverage-vs-precision-vs-invasiveness
surface. None currently achieves single-engram resolution at whole-brain coverage
in humans.

| Modality | Spatial resolution | Coverage | Cell-type specific? | Human-ready? |
|---|---|---|---|---|
| Optogenetics | Single-neuron (with viral targeting) | Local (mm-scale) | Yes | No — rodent / NHP only |
| Chemogenetics (DREADDs) | Cell-type | Regional | Yes (with viral expression) | No — research only |
| Single-electrode microstimulation | ~100 μm | One site | No | Limited (research / DBS leads) |
| DBS | ~mm | One or two deep targets | No | Yes (clinical for movement, OCD, depression) |
| ECoG / surface grids | ~mm at the cortical surface | Broad cortical surface | No | Yes (epilepsy monitoring) |
| High-density Utah / Neuropixels arrays | ~50–100 μm per channel | Few mm³ around the array | No | Limited (research; some BCI trials) |
| Transcranial focused ultrasound | ~mm to cm | Adjustable depth | No | Yes — non-invasive, but coarse |
| TMS | ~cm | Cortical surface only | No | Yes — non-invasive, but coarse |

Roughly: invasive techniques win on precision but lose on coverage; non-invasive
techniques win on coverage but lose on precision and on access to deep
subcortical structures (hippocampus, amygdala) that an emotional memory would
require.

---

## 3. The precision/coverage tradeoff, made concrete

A toy 2-D simulation of this tradeoff lives at
[scripts/simulate_stimulation_coverage.py](../scripts/simulate_stimulation_coverage.py).
It places a synthetic "ensemble" of memory neurons in the unit square (one
cluster for a focal engram, three clusters with `--distributed` for a
multi-region engram), drops K electrodes on a grid each with stimulation
radius r, and reports:

- **recall** = ensemble points stimulated / ensemble size
- **precision** = ensemble points stimulated / total points stimulated

Output figure: [docs/figures/stim-coverage.png](figures/stim-coverage.png),
sweep CSV: [data/stimulation_coverage_sweep.csv](../data/stimulation_coverage_sweep.csv).

Observed tradeoff (with default settings):

- Few large-radius electrodes get full recall but precision collapses near the
  baseline rate (≈9% — the fraction of total points that are ensemble) because
  most stimulated tissue is off-target.
- Many small-radius electrodes can hit a focal cluster with better precision,
  but only if their grid happens to align with the cluster.
- For a *distributed* ensemble, no fixed grid simultaneously achieves high
  precision and high recall at small r — you need either many more electrodes
  or per-subject targeting.

The simulation is deliberately *not* anatomical. It is a thinking aid for the
shape of the tradeoff, not a model of any specific brain region. This caveat
is repeated in the script docstring and in [limitations.md](limitations.md).

---

## 4. What this means for the project

The professor's framing was correct: lacking either where-to-stimulate
information or sufficiently precise hardware breaks the replay-via-stimulation
arm of this concept. Honest paths forward, ordered by current feasibility:

1. **Cue-driven reactivation**, not direct stimulation — leverage the brain's
   own retrieval circuitry via external sensory triggers (sound, smell, photo,
   place). This is what the project's `cue` and `mimo` synthetic protocols
   already lean on, and matches how sleep-based Targeted Memory Reactivation
   actually works.
2. **Closed-loop neuromodulation, not single-engram stimulation** — use focal
   modalities (DBS, focused ultrasound) to bias *state* (arousal, valence,
   default-mode engagement) rather than write content.
3. **Treat single-engram stimulation as out-of-scope for humans today** and
   say so in the project framing. Animal optogenetic engram reactivation
   (Liu 2012, Ramirez 2013) does not transfer to humans without cell-type
   genetic targeting that does not exist clinically.

---

## 5. Selected references

- Liu et al. (2012). Optogenetic stimulation of a hippocampal engram activates fear memory recall. *Nature* 484, 381–385.
- Ramirez et al. (2013). Creating a false memory in the hippocampus. *Science* 341, 387–391.
- Redondo et al. (2014). Bidirectional switch of the valence associated with a hippocampal contextual memory engram. *Nature* 513, 426–430.
- Frankland & Bontempi (2005). The organization of recent and remote memories. *Nat Rev Neurosci* 6, 119–130.
- Kitamura et al. (2017). Engrams and circuits crucial for systems consolidation of a memory. *Science* 356, 73–78.
- Josselyn & Tonegawa (2020). Memory engrams: Recalling the past and imagining the future. *Science* 367, eaaw4325.
- Buckner & DiNicola (2019). The brain's default network: updated anatomy, physiology and evolving insights. *Nat Rev Neurosci* 20, 593–608.
- Paulk et al. (2022). Large-scale neural recordings with single neuron resolution using Neuropixels probes in human cortex. *Nat Neurosci* 25, 252–263.
- Legon et al. (2018). Transcranial focused ultrasound modulates the activity of primary somatosensory cortex in humans. *Nat Neurosci* 21, 471–474.
