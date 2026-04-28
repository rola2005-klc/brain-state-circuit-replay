(function exposeGraphData() {
  const docs = {
    foundation: 'docs/presentable-foundation.md',
    outline: 'docs/presentation-outline.md',
    nativeTrace: 'docs/native-memory-trace-reactivation.md',
    research: 'docs/research.md',
    data: 'docs/data-model.md',
    plan: 'docs/development-plan.md'
  };

  const nodes = [
    {
      id: 'photo-problem',
      label: 'Photo problem',
      cluster: 'Problem',
      status: 'plausible',
      description: 'A photo preserves external light from a moment, but it does not preserve the internal state of being there. The project begins from that mismatch between visual record and lived experience.',
      docLink: docs.foundation
    },
    {
      id: 'what-we-saw',
      label: 'What we saw',
      cluster: 'Problem',
      status: 'known',
      description: 'Cameras can capture a partial visual trace of the outside world. That trace is valuable, but it omits attention, body state, emotion, context, and interpretation.',
      docLink: docs.outline
    },
    {
      id: 'what-we-were',
      label: 'What we were',
      cluster: 'Problem',
      status: 'speculative',
      description: 'The target is not a better photograph; it is a constrained approximation of an internal moment-state. This is a research question about state reconstruction, not a claim that exact subjective experience can be replayed.',
      docLink: docs.foundation
    },
    {
      id: 'lost-internal-state',
      label: 'Lost internal state',
      cluster: 'Problem',
      status: 'plausible',
      description: 'Many parts of a lived moment fade or transform after the event. The MVP treats those parts as dimensions to reason about, including sensory fragments, salience, context, and body feeling.',
      docLink: docs.data
    },
    {
      id: 'moment-as-state',
      label: 'Moment as state',
      cluster: 'Biology',
      status: 'plausible',
      description: 'A meaningful moment can be modeled as a distributed brain-body state, not a single stored image. The framing is useful for simulation, but it is still a simplification of biological memory.',
      docLink: docs.data
    },
    {
      id: 'plasticity',
      label: 'Plasticity',
      cluster: 'Biology',
      status: 'known',
      description: 'Experience changes neural systems through plasticity. This is the biological foundation for saying the organism itself carries traces of prior moments.',
      docLink: docs.nativeTrace
    },
    {
      id: 'ltp',
      label: 'LTP',
      cluster: 'Biology',
      status: 'known',
      description: 'Long-term potentiation is one well-studied mechanism by which synaptic efficacy can change. It supports the foundation, but it does not imply that a non-invasive interface can read exact memories.',
      docLink: docs.research
    },
    {
      id: 'native-record',
      label: 'Native biological record',
      cluster: 'Biology',
      status: 'plausible',
      description: 'The project assumes no prior external brain-state recording is strictly required for the concept. Instead, plasticity and circuit changes are treated as the native record that future cueing or stimulation might partially address.',
      docLink: docs.nativeTrace
    },
    {
      id: 'engrams',
      label: 'Engrams',
      cluster: 'Biology',
      status: 'known',
      description: 'Engram research studies distributed neuronal ensembles associated with memory in controlled settings. This does not mean EEG can identify a human engram or retrieve an exact past scene.',
      docLink: docs.research
    },
    {
      id: 'retroactive-addressability',
      label: 'Retroactive addressability',
      cluster: 'Hard Problem',
      status: 'speculative',
      description: 'The hard problem is whether a prior state trace can be addressed after the fact without having recorded it directly. Current science supports cueing and reactivation effects, not precise lookup of past mental states.',
      docLink: docs.nativeTrace
    },
    {
      id: 'controlled-reactivation',
      label: 'Controlled reactivation',
      cluster: 'Hard Problem',
      status: 'speculative',
      description: 'Controlled reactivation would mean nudging circuits toward a target memory-related state while monitoring safety and distortion. This is a frontier concept and should be presented with uncertainty visible.',
      docLink: docs.foundation
    },
    {
      id: 'reconstruction-vs-replay',
      label: 'Reconstruction vs replay',
      cluster: 'Hard Problem',
      status: 'plausible',
      description: 'The MVP distinguishes approximate reconstruction from literal replay. It avoids claiming visual playback, exact subjective duplication, or time travel.',
      docLink: docs.outline
    },
    {
      id: 'cue-triggered',
      label: 'Cue-triggered recall',
      cluster: 'Replay Modes',
      status: 'known',
      description: 'Sensory and contextual cues can influence recall by reintroducing parts of the original context. In this concept, cueing is the most conservative replay mode.',
      docLink: docs.research
    },
    {
      id: 'tmr',
      label: 'Targeted Memory Reactivation',
      cluster: 'Replay Modes',
      status: 'known',
      description: 'TMR uses cues, often during sleep, to bias memory consolidation or reactivation. It is real adjacent science, but it does not provide exact memory playback.',
      docLink: docs.research
    },
    {
      id: 'direct-engram',
      label: 'Direct engram access',
      cluster: 'Replay Modes',
      status: 'speculative',
      description: 'Directly accessing a specific human memory trace would require capabilities far beyond scalp EEG. The node marks a speculative frontier, not a current product path.',
      docLink: docs.nativeTrace
    },
    {
      id: 'guided-endogenous',
      label: 'Guided endogenous replay',
      cluster: 'Replay Modes',
      status: 'plausible',
      description: 'A person may be guided through cues, attention, narrative, and feedback to re-enter parts of a memory-related state. This is more plausible than direct engram control but still limited and subjective.',
      docLink: docs.plan
    },
    {
      id: 'eeg-role',
      label: 'EEG role',
      cluster: 'Technology',
      status: 'known',
      description: 'EEG can measure broad, non-invasive scalp-level correlates of neural activity. In this project it can support coarse state feedback, not read memory content.',
      docLink: docs.data
    },
    {
      id: 'eeg-limits',
      label: 'EEG limits',
      cluster: 'Technology',
      status: 'known',
      description: 'EEG cannot read synaptic traces, identify engrams, or produce exact visual memory playback. The UI keeps this limitation visible because it is central to the scientific boundary.',
      docLink: docs.foundation
    },
    {
      id: 'neurofeedback',
      label: 'Neurofeedback',
      cluster: 'Technology',
      status: 'plausible',
      description: 'Neurofeedback can help people learn partial regulation of measured states. It may fit a guided replay concept, but it remains indirect and noisy.',
      docLink: docs.research
    },
    {
      id: 'multimodal-cues',
      label: 'Multimodal cues',
      cluster: 'Technology',
      status: 'plausible',
      description: 'Sound, odor, image, place, haptics, and narrative can be combined to evoke state fragments. They may improve reconstruction, but they also raise false-memory and manipulation risks.',
      docLink: docs.plan
    },
    {
      id: 'consent',
      label: 'Consent',
      cluster: 'Ethics/Risk',
      status: 'known',
      description: 'Any system that touches memory, emotion, or identity requires explicit consent and clear boundaries. The concept must preserve user agency before it optimizes reconstruction.',
      docLink: docs.foundation
    },
    {
      id: 'false-memory',
      label: 'False memory',
      cluster: 'Ethics/Risk',
      status: 'known',
      description: 'Suggestion and reconstruction can distort remembered experience. A replay system must expose uncertainty instead of presenting generated state content as truth.',
      docLink: docs.research
    },
    {
      id: 'identity-risk',
      label: 'Identity risk',
      cluster: 'Ethics/Risk',
      status: 'plausible',
      description: 'Autobiographical memory is tied to self-understanding. Tools that alter confidence, salience, or interpretation could affect identity even without reading memories directly.',
      docLink: docs.foundation
    },
    {
      id: 'emotional-risk',
      label: 'Emotional risk',
      cluster: 'Ethics/Risk',
      status: 'known',
      description: 'Reactivating high-salience memories may amplify distress. Safety metrics need to track emotional load, not just similarity to a target state.',
      docLink: docs.plan
    },
    {
      id: 'manipulation',
      label: 'Manipulation',
      cluster: 'Ethics/Risk',
      status: 'plausible',
      description: 'Cueing and feedback can be used to steer attention and interpretation. That creates misuse risk even when the underlying sensing is coarse.',
      docLink: docs.foundation
    },
    {
      id: 'state-vectors',
      label: 'State vectors',
      cluster: 'Simulation Layer',
      status: 'plausible',
      description: 'The simulation layer represents moments as simplified state vectors. This is a conceptual scaffold for reasoning, not a validated neural encoding.',
      docLink: docs.data
    },
    {
      id: 'protocols',
      label: 'Protocols',
      cluster: 'Simulation Layer',
      status: 'plausible',
      description: 'Protocols describe cueing, feedback, and intervention strategies as model operations. They help compare assumptions without implying real clinical control.',
      docLink: docs.plan
    },
    {
      id: 'metrics',
      label: 'Metrics',
      cluster: 'Simulation Layer',
      status: 'plausible',
      description: 'Similarity, uncertainty, reconstruction error, and safety risk are useful conceptual measures. Any real version would need stronger validation and ethical review.',
      docLink: docs.data
    },
    {
      id: 'synthetic-data',
      label: 'Synthetic data',
      cluster: 'Simulation Layer',
      status: 'known',
      description: 'Synthetic data can test UI and modeling assumptions before real human studies. It should be labeled clearly so viewers do not mistake it for biological evidence.',
      docLink: docs.data
    },
    {
      id: 'literature-map',
      label: 'Literature map',
      cluster: 'Roadmap',
      status: 'known',
      description: 'The next credible step is mapping adjacent evidence from memory, engrams, TMR, neurofeedback, and closed-loop stimulation. This keeps the foundation anchored.',
      docLink: docs.research
    },
    {
      id: 'attractor-models',
      label: 'Attractor models',
      cluster: 'Roadmap',
      status: 'plausible',
      description: 'Attractor models can help describe partial state re-entry and pattern completion. They are a useful bridge between concept diagrams and more formal simulation.',
      docLink: docs.plan
    },
    {
      id: 'citation-table',
      label: 'Citation table',
      cluster: 'Roadmap',
      status: 'known',
      description: 'A citation table should separate known evidence, plausible extrapolation, and speculation. That distinction makes the project easier to present responsibly.',
      docLink: docs.research
    },
    {
      id: 'next-steps',
      label: 'Next steps',
      cluster: 'Roadmap',
      status: 'plausible',
      description: 'The immediate path is better documentation, clearer assumptions, and richer simulations. The MVP intentionally stays static and GitHub Pages-compatible.',
      docLink: docs.plan
    }
  ];

  const links = [
    ['photo-problem', 'what-we-saw'], ['photo-problem', 'what-we-were'], ['what-we-were', 'lost-internal-state'],
    ['lost-internal-state', 'moment-as-state'], ['moment-as-state', 'plasticity'], ['plasticity', 'ltp'],
    ['plasticity', 'native-record'], ['native-record', 'engrams'], ['engrams', 'retroactive-addressability'],
    ['retroactive-addressability', 'controlled-reactivation'], ['controlled-reactivation', 'reconstruction-vs-replay'],
    ['reconstruction-vs-replay', 'cue-triggered'], ['cue-triggered', 'tmr'], ['tmr', 'direct-engram'],
    ['direct-engram', 'guided-endogenous'], ['cue-triggered', 'multimodal-cues'], ['guided-endogenous', 'neurofeedback'],
    ['eeg-role', 'eeg-limits'], ['eeg-role', 'neurofeedback'], ['eeg-limits', 'direct-engram'],
    ['multimodal-cues', 'false-memory'], ['false-memory', 'consent'], ['false-memory', 'manipulation'],
    ['consent', 'identity-risk'], ['identity-risk', 'emotional-risk'], ['emotional-risk', 'metrics'],
    ['state-vectors', 'protocols'], ['protocols', 'metrics'], ['metrics', 'synthetic-data'],
    ['state-vectors', 'moment-as-state'], ['protocols', 'guided-endogenous'], ['synthetic-data', 'next-steps'],
    ['literature-map', 'citation-table'], ['literature-map', 'attractor-models'], ['attractor-models', 'state-vectors'],
    ['citation-table', 'eeg-limits'], ['next-steps', 'literature-map'], ['next-steps', 'protocols']
  ].map(([source, target]) => ({ source, target }));

  window.BRAIN_REPLAY_GRAPH = { nodes, links };
})();
