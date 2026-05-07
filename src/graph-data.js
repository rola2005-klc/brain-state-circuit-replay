(function exposeGraphData() {
  const docs = {
    foundation: 'project-brief.html#thesis',
    outline: 'project-brief.html#presentation-path',
    unreturnable: 'project-brief.html#problem',
    nativeTrace: 'project-brief.html#scientific-anchors',
    research: 'project-brief.html#scientific-anchors',
    data: 'project-brief.html#system-concept',
    plan: 'project-brief.html#next-steps'
  };

  const nodes = [
    {
      id: 'project-thesis',
      label: 'Brain-State Circuit Resonance',
      cluster: 'Overview',
      status: 'plausible',
      description: 'The whole project asks how future AI/neurotechnology could help a person safely re-approach a past-associated integrated self-state: not what the camera saw, but what the person was.',
      docLink: docs.foundation
    },
    {
      id: 'photo-problem',
      label: 'Photo problem',
      cluster: 'Problem',
      status: 'plausible',
      description: 'A photo preserves external light from a moment, but it does not preserve the internal state of being there. The project begins from that mismatch between visual record and lived experience.',
      docLink: docs.foundation
    },
    {
      id: 'unreturnable-present',
      label: 'The Unreturnable Present Paradox',
      cluster: 'Problem',
      status: 'plausible',
      description: 'When a person notices that a happy or important present cannot be returned to, anticipatory grief can interrupt the moment itself. The project asks whether safe state resonance could reduce that pressure.',
      docLink: docs.unreturnable
    },
    {
      id: 'integrated-self-state',
      label: 'Integrated Self-State',
      cluster: 'Problem',
      status: 'plausible',
      description: 'The target is not scene replay or a single emotion. It is a partial body-attention-emotion-context-self-meaning configuration that includes configured ignorance: what the past self did not yet know or have to account for.',
      docLink: docs.unreturnable
    },
    {
      id: 'self-capacity',
      label: 'Self-Capacity',
      cluster: 'Problem',
      status: 'plausible',
      description: 'The desired recovery is often the capacity to feel the world a certain way. This reframes resonance as a question of human emotional capacity, not content extraction.',
      docLink: docs.unreturnable
    },
    {
      id: 'emotion-structured-information',
      label: 'Emotion as Structured Information',
      cluster: 'Technology',
      status: 'plausible',
      description: 'Emotion is treated as structured information about salience, value, body state, prediction, memory, and self-relevance. AI should carry and protect it, not erase it.',
      docLink: docs.unreturnable
    },
    {
      id: 'ethics-architecture',
      label: 'Ethics as Architecture',
      cluster: 'Ethics/Risk',
      status: 'known',
      description: 'Safety cannot be added after intensity optimization. Consent, uncertainty, anti-addiction limits, and return-to-present design are architectural requirements.',
      docLink: docs.unreturnable
    },
    {
      id: 'experiential-time-travel',
      label: 'Experiential Time Travel (Metaphor)',
      cluster: 'Hard Problem',
      status: 'speculative',
      description: 'Weak means state reinstatement; medium means subjective similarity; strong is only a metaphor. The project does not claim literal physics time travel.',
      docLink: docs.unreturnable
    },
    {
      id: 'resonance-over-recreation',
      label: 'Resonance over Recreation',
      cluster: 'Ethics/Risk',
      status: 'plausible',
      description: 'The design target is bounded resonance with a past-associated self-capacity, not copying the past or trapping the person in nostalgic state chasing.',
      docLink: docs.unreturnable
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
      cluster: 'Resonance Pathways',
      status: 'known',
      description: 'Sensory and contextual cues can influence recall by reintroducing parts of the original context. In this concept, cueing is the most conservative path toward partial resonance.',
      docLink: docs.research
    },
    {
      id: 'tmr',
      label: 'Targeted Memory Reactivation',
      cluster: 'Resonance Pathways',
      status: 'known',
      description: 'TMR uses cues, often during sleep, to bias memory consolidation or reactivation. It is real adjacent science, but it does not provide exact memory playback.',
      docLink: docs.research
    },
    {
      id: 'direct-engram',
      label: 'Direct engram access',
      cluster: 'Resonance Pathways',
      status: 'speculative',
      description: 'Directly accessing a specific human memory trace would require capabilities far beyond scalp EEG. The node marks a speculative frontier, not a current product path or exact playback claim.',
      docLink: docs.nativeTrace
    },
    {
      id: 'guided-endogenous',
      label: 'Guided endogenous resonance',
      cluster: 'Resonance Pathways',
      status: 'plausible',
      description: 'A person may be guided through cues, attention, narrative, and feedback to re-approach parts of a memory-related state. This is more plausible than direct engram control but still limited, noisy, and subjective.',
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
      description: 'Neurofeedback can help people learn partial regulation of measured states. It may fit a guided resonance concept, but it remains indirect and noisy.',
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
      description: 'Suggestion and reconstruction can distort remembered experience. A resonance system must expose uncertainty instead of presenting generated state content as truth.',
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
      description: 'Similarity, uncertainty, reconstruction error, and safety risk are useful conceptual measures. Any real version would need stronger validation boundaries, stop criteria, and ethical review.',
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
      description: 'The immediate path is clearer assumptions, stronger validation boundaries, uncertainty displays, richer simulations, and research anchors. The MVP intentionally stays static and GitHub Pages-compatible.',
      docLink: docs.plan
    }
  ];


  const nodeExplanations = {
    'project-thesis': {
      isKey: true,
      purpose: 'This is the center of the map: the portfolio thesis visitors should remember in one sentence.',
      reflects: 'It turns your original fear of losing an irreplaceable present into a research/design question about safe state resonance.'
    },
    'photo-problem': {
      isKey: true,
      purpose: 'Shows the starting dissatisfaction: photos preserve external appearance but miss inner being.',
      reflects: 'Directly encodes your line: photos record what we saw, not what we were.'
    },
    'unreturnable-present': {
      isKey: true,
      purpose: 'Names the emotional paradox that motivates the whole project.',
      reflects: 'It captures the moment where knowing “I cannot return here” creates grief inside the present itself.'
    },
    'integrated-self-state': {
      isKey: true,
      purpose: 'Defines the real target of resonance, so the project is not mistaken for video playback or single-emotion detection.',
      reflects: 'It preserves your core idea that the meaningful object is body + attention + emotion + context + self-model + meaning.'
    },
    'self-capacity': {
      isKey: true,
      purpose: 'Reframes resonance as recovering a way of being, not copying content.',
      reflects: 'It expresses your idea that people often miss the capacity to feel/open to the world, not just the event.'
    },
    'emotion-structured-information': {
      isKey: true,
      purpose: 'Explains why emotion belongs in AI/neurotech as signal, not noise.',
      reflects: 'It connects your belief that technology should carry and protect human feeling instead of flattening it.'
    },
    'ethics-architecture': {
      isKey: true,
      purpose: 'Makes safety a core design layer instead of an afterthought.',
      reflects: 'It encodes your concern about addiction, escape, privacy, manipulation, and drug-like state chasing.'
    },
    'experiential-time-travel': {
      isKey: true,
      purpose: 'Keeps the time-travel phrase powerful but scientifically bounded.',
      reflects: 'It says the project is about experiential return/metaphor, not physics time travel.'
    },
    'resonance-over-recreation': {
      isKey: true,
      purpose: 'Sets the design target: bounded resonance rather than exact recreation.',
      reflects: 'It protects the project from overclaiming exact memory replay while keeping the emotional aim alive.'
    },
    'native-record': {
      isKey: true,
      purpose: 'Explains why the body/brain itself may be the “record,” even without prior external recording.',
      reflects: 'It translates your trace-back intuition into a biology-adjacent hypothesis about plasticity and memory traces.'
    },
    'retroactive-addressability': {
      isKey: true,
      purpose: 'Marks the hardest technical question: can a past-associated trace be addressed after the fact?',
      reflects: 'It is where your concept becomes frontier research rather than just memory journaling.'
    },
    'reconstruction-vs-replay': {
      isKey: true,
      purpose: 'Prevents visitors from thinking the project promises exact playback.',
      reflects: 'It keeps the claim honest: partial reconstruction/state approximation, not perfect replay.'
    },
    'guided-endogenous': {
      isKey: true,
      purpose: 'Represents the most plausible product/research pathway: guided self-state re-entry using cues and feedback.',
      reflects: 'It makes the idea actionable without pretending we can directly read or control engrams.'
    },
    'eeg-limits': {
      isKey: true,
      purpose: 'Shows scientific humility and protects credibility.',
      reflects: 'It makes clear EEG can support coarse feedback but cannot read synapses, engrams, or exact memories.'
    },
    'metrics': {
      isKey: true,
      purpose: 'Turns the concept into something buildable/testable in simulation.',
      reflects: 'It asks how resonance, uncertainty, reconstruction error, and safety load could be measured.'
    },
    'literature-map': {
      isKey: true,
      purpose: 'Shows the next credible research step.',
      reflects: 'It anchors the speculative concept in adjacent literature instead of leaving it as only a personal essay.'
    }
  };

  const defaultPurposeByCluster = {
    Problem: 'Defines the lived problem or philosophical target the project is trying to solve.',
    Biology: 'Anchors the concept in memory, plasticity, traces, or state biology without overclaiming access.',
    'Hard Problem': 'Marks the frontier gap between current science and the future capability the project imagines.',
    'Resonance Pathways': 'Shows possible ways a system could attempt partial state re-entry, from conservative to speculative.',
    Technology: 'Maps tools that could support coarse sensing, cueing, feedback, or simulation.',
    'Ethics/Risk': 'Keeps consent, distortion, identity, addiction, and return-to-present safeguards visible.',
    'Simulation Layer': 'Turns the thesis into a prototype layer that can be tested with synthetic, clearly labeled data.',
    Roadmap: 'Shows how the project becomes more credible over time: literature, citations, models, and next steps.'
  };

  const defaultReflectsByCluster = {
    Problem: 'It ties the map back to your original human question: why losing access to a past self-state matters.',
    Biology: 'It asks what kind of biological trace could make “returning toward a state” even thinkable.',
    'Hard Problem': 'It preserves the ambition while making the uncertainty explicit.',
    'Resonance Pathways': 'It shows the path from memory cueing to speculative replay-like resonance.',
    Technology: 'It separates useful tools from exaggerated claims about mind reading.',
    'Ethics/Risk': 'It ensures the project is not just intensity optimization, but care for identity and agency.',
    'Simulation Layer': 'It makes the concept presentable as an open-source artifact rather than only a theory.',
    Roadmap: 'It explains what reviewers should see as the next serious research/build direction.'
  };

  nodes.forEach((node) => {
    const extra = nodeExplanations[node.id] || {};
    Object.assign(node, {
      purpose: extra.purpose || defaultPurposeByCluster[node.cluster] || 'Explains one part of the project argument.',
      reflects: extra.reflects || defaultReflectsByCluster[node.cluster] || 'Connects this node back to the project thesis.',
      isKey: Boolean(extra.isKey)
    });
  });

  const links = [
    ['project-thesis', 'photo-problem'], ['project-thesis', 'unreturnable-present'], ['project-thesis', 'integrated-self-state'], ['project-thesis', 'ethics-architecture'],
    ['photo-problem', 'what-we-saw'], ['photo-problem', 'what-we-were'], ['photo-problem', 'unreturnable-present'],
    ['unreturnable-present', 'integrated-self-state'], ['integrated-self-state', 'self-capacity'],
    ['self-capacity', 'emotion-structured-information'], ['emotion-structured-information', 'ethics-architecture'],
    ['ethics-architecture', 'resonance-over-recreation'], ['resonance-over-recreation', 'experiential-time-travel'],
    ['what-we-were', 'lost-internal-state'], ['lost-internal-state', 'moment-as-state'], ['moment-as-state', 'integrated-self-state'],
    ['moment-as-state', 'plasticity'], ['plasticity', 'ltp'],
    ['plasticity', 'native-record'], ['native-record', 'engrams'], ['engrams', 'retroactive-addressability'],
    ['retroactive-addressability', 'controlled-reactivation'], ['controlled-reactivation', 'reconstruction-vs-replay'],
    ['reconstruction-vs-replay', 'cue-triggered'], ['cue-triggered', 'tmr'], ['tmr', 'direct-engram'],
    ['direct-engram', 'guided-endogenous'], ['cue-triggered', 'multimodal-cues'], ['guided-endogenous', 'neurofeedback'],
    ['eeg-role', 'eeg-limits'], ['eeg-role', 'neurofeedback'], ['eeg-limits', 'direct-engram'],
    ['multimodal-cues', 'false-memory'], ['false-memory', 'consent'], ['false-memory', 'manipulation'],
    ['consent', 'identity-risk'], ['identity-risk', 'emotional-risk'], ['emotional-risk', 'ethics-architecture'], ['emotional-risk', 'metrics'],
    ['state-vectors', 'protocols'], ['protocols', 'metrics'], ['metrics', 'synthetic-data'],
    ['state-vectors', 'moment-as-state'], ['protocols', 'guided-endogenous'], ['synthetic-data', 'next-steps'],
    ['literature-map', 'citation-table'], ['literature-map', 'attractor-models'], ['attractor-models', 'state-vectors'],
    ['citation-table', 'eeg-limits'], ['next-steps', 'literature-map'], ['next-steps', 'protocols']
  ].map(([source, target]) => ({ source, target }));

  window.BRAIN_REPLAY_GRAPH = { nodes, links };
})();
