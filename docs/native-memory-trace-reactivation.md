# Native Memory Trace Reactivation

## Purpose

This explainer separates what the project can reasonably borrow from neuroscience from what remains speculative. The central refinement is:

> No previous external brain-state recording is strictly required because plasticity and LTP are the native biological record; the hard problem is retroactive addressability and controlled reactivation.

## EEG correlates

EEG measures electrical activity at the scalp. It is non-invasive, relatively accessible, and useful for timing-sensitive signals. In a brain-state replay concept, EEG could contribute broad state estimates such as:

- sleep stage or arousal;
- attention and task engagement;
- coarse oscillatory patterns;
- event-related responses;
- feedback signals for training or monitoring.

EEG is not a readout of synaptic traces. It does not directly show LTP, identify an engram, or reveal a specific memory circuit. At best, EEG can provide correlates of the current global or regional state that may help guide a coarse closed-loop system.

## LTP and synaptic traces

Long-term potentiation is a lasting strengthening of synaptic transmission associated with learning and memory mechanisms. More broadly, experience changes synaptic weights, circuit excitability, and network dynamics.

For this project, the important claim is not that LTP is a complete explanation of memory. The point is that the brain already contains physical traces of prior experience. A future system would not necessarily need a saved external recording of the original state. It would need a way to address, reactivate, and monitor traces that are already biologically stored.

This is why "native memory trace" is a useful phrase: the record is not a camera file, but a changed biological system.

## Engrams

An engram is a physical memory trace or a distributed set of cells and circuits involved in storing and retrieving a memory. Animal studies have shown that tagged ensembles can be reactivated in ways that influence memory-like behavior.

What this supports:

- memory is tied to distributed biological traces;
- reactivation can be causal in animal models;
- memory should not be modeled as one isolated storage location.

What this does not support:

- exact human memory playback;
- consumer-level control of autobiographical memories;
- precise engram addressing with EEG;
- safe direct reactivation of arbitrary past moments.

## Targeted Memory Reactivation

Targeted Memory Reactivation uses cues associated with learning or experience to bias later memory processing, often during sleep. Examples include sounds or odors paired with a learning episode and then re-presented later.

TMR is one of the most realistic floors for this project. It suggests that external cues can influence which traces become active or strengthened. It does not imply that a whole past self-state can be restored, and it does not produce exact replay.

In the project vocabulary, TMR belongs with cue-triggered recall: both use external cues to bias access to an existing trace.

## Cue-free or direct reactivation

Direct reactivation means influencing a memory trace without relying mainly on ordinary sensory cues. In animal work, this often involves invasive tagging and optogenetic control. In humans, direct, memory-specific reactivation remains a frontier idea.

For this project, direct reactivation should be treated as speculative. It is useful as a north-star mechanism, but not as something the current simulation demonstrates.

The unresolved engineering problem is addressability:

- Which trace is being targeted?
- How is it distinguished from overlapping traces?
- How do we reactivate it without distortion or harm?
- How do we measure success without claiming exact replay?

## Guided endogenous replay

Guided endogenous replay is the idea of helping the brain reactivate its own stored traces through a combination of cueing, attention, neurofeedback, context, and possibly stimulation. It does not assume the system has a perfect map of the memory. It assumes the brain already has the trace, and the interface nudges the conditions that make reactivation more likely.

This is more plausible than exact direct control, but still speculative when framed as replaying a specific past moment. It may be a better long-term framing for the project because it respects the reconstructive nature of memory.

## Exact visual replay limitations

Brain-State Circuit Resonance should not claim exact visual playback of past experience.

Reasons:

- memory is reconstructive and changes with retrieval;
- visual imagery is only one part of a moment;
- perceptual details decay, blend, and distort;
- current non-invasive systems cannot read exact original visual scenes from memory traces;
- even advanced decoding would infer partial content from present activity, not recover a perfect past file.

The project should therefore use terms like partial reconstruction, state approximation, cue-biased recall, and guided reactivation. It should avoid claims of exact memory video, literal time travel, or reading a past moment directly from EEG.

## Practical boundary for this repo

The current codebase is a toy conceptual simulation. It can model:

- target state vectors;
- protocol differences;
- cue strength and feedback;
- reconstruction error;
- safety risk;
- synthetic examples for reproducible testing.

It cannot validate real brain-state replay. Its value is making the assumptions explicit and building a presentable scientific framework before expanding interactive features.
