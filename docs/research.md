# Research Map: Similar Ideas and Experiments

Project thesis: **We may not be able to go back in time, but we may learn how to revisit brain-body states.**

This project is not claiming that exact state replay is possible today. The goal is to build a research-grounded conceptual prototype around a plausible architecture: **state encoding → cue/reactivation → closed-loop modulation → safety monitoring**.

## 1. Memory engrams: activating stored memory-like circuits

- **Liu, Ramirez et al. (2012), Nature — “Optogenetic stimulation of a hippocampal engram activates fear memory recall.”**  
  https://pubmed.ncbi.nlm.nih.gov/22441246/  
  In mice, neurons active during fear learning were tagged and later optogenetically reactivated. Reactivating the ensemble was sufficient to evoke fear-memory behavior.

- **Ramirez et al. (2013), Science — “Creating a false memory in the hippocampus.”**  
  https://pubmed.ncbi.nlm.nih.gov/23888038/  
  Reactivating cells from one context during fear conditioning in another context could create a false context-specific fear memory in mice.

- **Ramirez et al. (2015), Nature — “Activating positive memory engrams suppresses depression-like behaviour.”**  
  https://pubmed.ncbi.nlm.nih.gov/26085274/  
  Reactivating positive memory engrams reduced depression-like behavior in stressed mice.

- **Roy et al. (2022), Nature Communications — “Brain-wide mapping reveals that engrams for a single memory are distributed across multiple brain regions.”**  
  https://pubmed.ncbi.nlm.nih.gov/35379803/  
  A single memory is likely distributed across a brain-wide engram complex rather than stored in one place.

**Project implication:** Model a past state as a **distributed activation signature**, not a single button.

## 2. Targeted memory reactivation: external cues bias memory replay

- **Cellini & Capuozzo (2018), Annals NYAS — “Shaping memory consolidation via targeted memory reactivation during sleep.”**  
  https://pubmed.ncbi.nlm.nih.gov/29762867/

- **Antony & Schechtman (2023), Hippocampus — “Reap while you sleep: Consolidation of memories differs by how they were sown.”**  
  https://pubmed.ncbi.nlm.nih.gov/36973868/

**Project implication:** The current **memory cue strength** parameter is scientifically meaningful. Cues can bias reactivation, although they do not restore a full past self.

## 3. Closed-loop neurostimulation: decode state, then intervene adaptively

- **Basu et al. (2023), Nature Biomedical Engineering — “Closed-loop enhancement and neural decoding of cognitive control in humans.”**  
  https://pubmed.ncbi.nlm.nih.gov/34725508/

- **Oganesian & Shanechi (2024), Nature Reviews Bioengineering — “Brain-computer interfaces for neuropsychiatric disorders.”**  
  https://pubmed.ncbi.nlm.nih.gov/40988938/

- **Wickramasuriya et al. (2019), Frontiers in Neuroscience — “Skin Conductance as a Viable Alternative for Closing the Deep Brain Stimulation Loop in Neuropsychiatric Disorders.”**  
  https://pubmed.ncbi.nlm.nih.gov/31447627/

**Project implication:** The strongest engineering framing is a **closed-loop controller**: decode current state, compare with target, apply cue/stimulation, monitor risk, adapt.

## 4. Hippocampal memory prosthesis: modeling neural transformations

- **Hampson et al. (2018), Journal of Neural Engineering — “Developing a hippocampal neural prosthetic to facilitate human memory encoding and recall.”**  
  https://pubmed.ncbi.nlm.nih.gov/29589592/

- **Deadwyler et al. (2017), Experimental Neurology — “A cognitive prosthesis for memory facilitation by closed-loop functional ensemble stimulation of hippocampal neurons in primate brain.”**  
  https://pubmed.ncbi.nlm.nih.gov/27233622/

- **Song et al. (2018), IEEE TNSRE — “Sparse Large-Scale Nonlinear Dynamical Modeling of Human Hippocampus for Memory Prostheses.”**  
  https://pubmed.ncbi.nlm.nih.gov/28113595/

**Project implication:** Phase 2 should include a toy **state-transition / MIMO-inspired model** showing how input patterns become output patterns over time.

## 5. Real-time fMRI neurofeedback: learning to regulate brain states

- **Herwig et al. (2019), NeuroImage — “Training emotion regulation through real-time fMRI neurofeedback of amygdala activity.”**  
  https://pubmed.ncbi.nlm.nih.gov/30287300/

- **Zhu et al. (2019), Frontiers in Human Neuroscience — “Emotion Regulation of Hippocampus Using Real-Time fMRI Neurofeedback in Healthy Human.”**  
  https://pubmed.ncbi.nlm.nih.gov/31379539/

- **Lorenzetti et al. (2018), Frontiers in Neurology — “Emotion Regulation Using Virtual Environments and Real-Time fMRI Neurofeedback.”**  
  https://pubmed.ncbi.nlm.nih.gov/30087646/

**Project implication:** A future mode could be a **neurofeedback trainer**, where the user learns to move a simulated state toward a target through strategy and feedback.

## Grounded vs speculative

### Grounded enough to cite

- Memories can be represented by distributed neural ensembles.
- Animal engram experiments show causal memory-like reactivation.
- Human closed-loop stimulation and neurofeedback can modulate selected cognitive/emotional states under specialized conditions.
- Cues can bias memory reactivation/consolidation.

### Still speculative

- Exact return to a whole past self/body state.
- Safe consumer-level emotional memory replay.
- Full state reconstruction from non-invasive signals.
- A universal “click this circuit” interface.

## Best current framing

> Can a closed-loop neurotechnology system decode, approximate, and safely guide the brain toward useful brain-body state signatures using memory cues, adaptive stimulation, and safety constraints?
