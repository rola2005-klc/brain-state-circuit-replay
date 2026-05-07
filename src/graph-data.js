(function exposeGraphData() {
  const docs = {
    foundation: 'project-brief.html#thesis',
    outline: 'project-brief.html#presentation-path',
    unreturnable: 'docs/unreturnable-present-paradox.md',
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


  const paperLibrary = {
    schacter1998: {
      short: 'Schacter et al. 1998',
      title: 'The cognitive neuroscience of constructive memory',
      url: 'https://pubmed.ncbi.nlm.nih.gov/9864253/',
      note: 'memory is reconstructive, not literal playback'
    },
    conway2000: {
      short: 'Conway & Pleydell-Pearce 2000',
      title: 'The construction of autobiographical memories in the self-memory system',
      url: 'https://pubmed.ncbi.nlm.nih.gov/10657330/',
      note: 'autobiographical memory connects event detail with self-models'
    },
    squire2004: {
      short: 'Squire et al. 2004',
      title: 'The medial temporal lobe and memory',
      url: 'https://pubmed.ncbi.nlm.nih.gov/15217337/',
      note: 'memory systems anchor; not evidence for exact readout'
    },
    bliss1973: {
      short: 'Bliss & Lømo 1973',
      title: 'Long-lasting potentiation of synaptic transmission in the dentate area of the anaesthetized rabbit',
      url: 'https://pubmed.ncbi.nlm.nih.gov/4727084/',
      note: 'classic LTP / plasticity foundation'
    },
    josselyn2015: {
      short: 'Josselyn et al. 2015',
      title: 'Finding the engram',
      url: 'https://www.nature.com/articles/nrn4000',
      note: 'engram concept and experimental limits'
    },
    liu2012: {
      short: 'Liu/Ramirez et al. 2012',
      title: 'Optogenetic stimulation of a hippocampal engram activates fear memory recall',
      url: 'https://www.nature.com/articles/nature11028',
      note: 'controlled animal engram work; not scalp EEG memory access'
    },
    ramirez2013: {
      short: 'Ramirez et al. 2013',
      title: 'Creating a false memory in the hippocampus',
      url: 'https://www.science.org/doi/10.1126/science.1239073',
      note: 'shows reactivation/manipulation risk in animal models'
    },
    nader2000: {
      short: 'Nader et al. 2000',
      title: 'Fear memories require protein synthesis in the amygdala for reconsolidation after retrieval',
      url: 'https://www.nature.com/articles/35021052',
      note: 'reactivated memories can become labile'
    },
    diekelmann2010: {
      short: 'Diekelmann & Born 2010',
      title: 'The memory function of sleep',
      url: 'https://www.nature.com/articles/nrn2762',
      note: 'sleep consolidation and reactivation background'
    },
    cellini2018: {
      short: 'Cellini & Capuozzo 2018',
      title: 'Shaping memory consolidation via targeted memory reactivation during sleep',
      url: 'https://doi.org/10.1016/j.neubiorev.2018.07.017',
      note: 'TMR review; cue-biased consolidation, not exact replay'
    },
    sitaram2017: {
      short: 'Sitaram et al. 2017',
      title: 'Closed-loop brain training: the science of neurofeedback',
      url: 'https://www.nature.com/articles/nrn.2016.164',
      note: 'feedback can shape coarse brain states under constraints'
    },
    shanechi2019: {
      short: 'Shanechi 2019',
      title: 'Brain–machine interfaces from motor to mood',
      url: 'https://www.nature.com/articles/s41593-019-0488-y',
      note: 'closed-loop state estimation/intervention framing'
    },
    hampson2018: {
      short: 'Hampson et al. 2018',
      title: 'Developing a hippocampal neural prosthetic to facilitate human memory encoding and recall',
      url: 'https://pubmed.ncbi.nlm.nih.gov/29589592/',
      note: 'memory prosthesis adjacent work; invasive and task-specific'
    },
    memoryEditing2026: {
      short: 'Memory editing during sleep 2026',
      title: 'Memory editing during sleep: mechanisms, clinical applications, and technological innovations',
      url: 'https://pubmed.ncbi.nlm.nih.gov/40897598/',
      note: 'recent review; supports cue/reactivation adjacency, not exact replay',
      isRecent: true
    },
    closedLoopSleep2025: {
      short: 'Closed-loop sleep stimulation 2025',
      title: 'Stimulating the Stimulated Cortex—Frontocortical Anodal Electric Stimulation Combined With Closed-Loop Acoustic Stimulation During Sleep Impairs Memory in Subjects With High Cognitive Ability',
      url: 'https://pubmed.ncbi.nlm.nih.gov/41042056/',
      note: 'recent cautionary result: closed-loop cueing can backfire',
      isRecent: true
    },
    brainStateDecoding2025: {
      short: 'AI brain-state decoding review 2025',
      title: 'AI-Driven Multimodal Brain-State Decoding for Personalized Closed-Loop TENS: A Comprehensive Review',
      url: 'https://pubmed.ncbi.nlm.nih.gov/41008264/',
      note: 'recent closed-loop personalization / state-decoding review',
      isRecent: true
    },
    mvpaNeurofeedback2026: {
      short: 'MVPA neurofeedback review 2026',
      title: 'Modulating complex brain states using MVPA-based neurofeedback: A systematic review',
      url: 'https://pubmed.ncbi.nlm.nih.gov/41702476/',
      note: 'recent review on feedback for complex brain-state modulation',
      isRecent: true
    },
    adaptiveMemory2026: {
      short: 'Adaptive episodic memory 2026',
      title: 'Adaptive episodic memory: how multiple memory representations drive behavior in humans and nonhumans',
      url: 'https://pubmed.ncbi.nlm.nih.gov/41187993/',
      note: 'recent review; supports multiple reconstructive memory representations',
      isRecent: true
    },
    poldrack2011: {
      short: 'Poldrack 2011',
      title: 'Inferring mental states from neuroimaging data: from reverse inference to large-scale decoding',
      url: 'https://pubmed.ncbi.nlm.nih.gov/21416582/',
      note: 'decoding limits and inference caution'
    },
    loftus1995: {
      short: 'Loftus 1995',
      title: 'The formation of false memories',
      url: 'https://pubmed.ncbi.nlm.nih.gov/7770739/',
      note: 'suggestion and reconstruction can distort memory'
    },
    hopfield1982: {
      short: 'Hopfield 1982',
      title: 'Neural networks and physical systems with emergent collective computational abilities',
      url: 'https://www.pnas.org/doi/10.1073/pnas.79.8.2554',
      note: 'attractor/pattern-completion modeling anchor'
    },
    mcclelland1995: {
      short: 'McClelland et al. 1995',
      title: 'Why there are complementary learning systems in the hippocampus and neocortex',
      url: 'https://pubmed.ncbi.nlm.nih.gov/7624455/',
      note: 'systems-level memory modeling anchor'
    }
  };

  const paperSets = {
    concept: ['schacter1998', 'conway2000'],
    biology: ['squire2004', 'bliss1973', 'josselyn2015'],
    engram: ['josselyn2015', 'liu2012', 'ramirez2013'],
    reactivation: ['nader2000', 'diekelmann2010', 'cellini2018', 'memoryEditing2026'],
    technology: ['sitaram2017', 'shanechi2019', 'poldrack2011', 'brainStateDecoding2025', 'mvpaNeurofeedback2026'],
    ethics: ['loftus1995', 'ramirez2013', 'poldrack2011'],
    simulation: ['hopfield1982', 'mcclelland1995', 'poldrack2011', 'brainStateDecoding2025'],
    prosthesis: ['hampson2018', 'shanechi2019', 'sitaram2017']
  };

  const paperIdsByNode = {
    'project-thesis': ['schacter1998', 'conway2000', 'shanechi2019', 'adaptiveMemory2026'],
    'photo-problem': ['schacter1998', 'conway2000'],
    'unreturnable-present': ['conway2000', 'schacter1998'],
    'integrated-self-state': ['conway2000', 'squire2004', 'poldrack2011'],
    'self-capacity': ['conway2000', 'sitaram2017'],
    'emotion-structured-information': ['sitaram2017', 'shanechi2019', 'poldrack2011'],
    'ethics-architecture': ['loftus1995', 'poldrack2011', 'shanechi2019'],
    'experiential-time-travel': ['schacter1998', 'conway2000'],
    'resonance-over-recreation': ['schacter1998', 'nader2000', 'sitaram2017'],
    'what-we-saw': ['schacter1998', 'conway2000'],
    'what-we-were': ['conway2000', 'poldrack2011'],
    'lost-internal-state': ['schacter1998', 'conway2000', 'squire2004'],
    'moment-as-state': ['squire2004', 'mcclelland1995', 'poldrack2011'],
    plasticity: ['bliss1973', 'squire2004'],
    ltp: ['bliss1973', 'mcclelland1995'],
    'native-record': ['bliss1973', 'josselyn2015', 'squire2004'],
    engrams: ['josselyn2015', 'liu2012', 'ramirez2013'],
    'retroactive-addressability': ['nader2000', 'liu2012', 'poldrack2011'],
    'controlled-reactivation': ['nader2000', 'cellini2018', 'shanechi2019', 'memoryEditing2026', 'closedLoopSleep2025'],
    'reconstruction-vs-replay': ['schacter1998', 'loftus1995', 'poldrack2011'],
    'cue-triggered': ['schacter1998', 'cellini2018', 'diekelmann2010', 'memoryEditing2026'],
    tmr: ['diekelmann2010', 'cellini2018', 'memoryEditing2026', 'closedLoopSleep2025'],
    'direct-engram': ['liu2012', 'ramirez2013', 'poldrack2011'],
    'guided-endogenous': ['sitaram2017', 'cellini2018', 'shanechi2019', 'mvpaNeurofeedback2026'],
    'eeg-role': ['poldrack2011', 'sitaram2017', 'brainStateDecoding2025'],
    'eeg-limits': ['poldrack2011', 'josselyn2015'],
    neurofeedback: ['sitaram2017', 'shanechi2019', 'mvpaNeurofeedback2026'],
    'multimodal-cues': ['cellini2018', 'diekelmann2010', 'loftus1995'],
    consent: ['loftus1995', 'poldrack2011'],
    'false-memory': ['loftus1995', 'ramirez2013', 'schacter1998'],
    'identity-risk': ['conway2000', 'loftus1995'],
    'emotional-risk': ['nader2000', 'loftus1995', 'sitaram2017'],
    manipulation: ['loftus1995', 'ramirez2013', 'poldrack2011'],
    'state-vectors': ['hopfield1982', 'mcclelland1995', 'poldrack2011'],
    protocols: ['shanechi2019', 'sitaram2017', 'cellini2018', 'brainStateDecoding2025'],
    metrics: ['poldrack2011', 'shanechi2019', 'sitaram2017', 'brainStateDecoding2025'],
    'synthetic-data': ['poldrack2011', 'hopfield1982'],
    'literature-map': ['josselyn2015', 'cellini2018', 'sitaram2017', 'memoryEditing2026', 'mvpaNeurofeedback2026'],
    'attractor-models': ['hopfield1982', 'mcclelland1995'],
    'citation-table': ['josselyn2015', 'cellini2018', 'shanechi2019'],
    'next-steps': ['shanechi2019', 'poldrack2011', 'sitaram2017', 'brainStateDecoding2025', 'mvpaNeurofeedback2026']
  };

  const defaultPaperSetByCluster = {
    Overview: paperSets.concept,
    Problem: paperSets.concept,
    Biology: paperSets.biology,
    'Hard Problem': paperSets.reactivation,
    'Resonance Pathways': paperSets.reactivation,
    Technology: paperSets.technology,
    'Ethics/Risk': paperSets.ethics,
    'Simulation Layer': paperSets.simulation,
    Roadmap: paperSets.technology
  };

  function resolvePapers(node) {
    const ids = paperIdsByNode[node.id] || defaultPaperSetByCluster[node.cluster] || paperSets.concept;
    return ids.map((id) => paperLibrary[id]).filter(Boolean);
  }

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
      papers: resolvePapers(node),
      isKey: Boolean(extra.isKey)
    });
  });


  const logicChain = [
    'project-thesis',
    'photo-problem',
    'what-we-saw',
    'what-we-were',
    'lost-internal-state',
    'moment-as-state',
    'plasticity',
    'native-record',
    'engrams',
    'retroactive-addressability',
    'controlled-reactivation',
    'reconstruction-vs-replay',
    'cue-triggered',
    'tmr',
    'guided-endogenous',
    'eeg-role',
    'eeg-limits',
    'neurofeedback',
    'multimodal-cues',
    'false-memory',
    'consent',
    'identity-risk',
    'emotional-risk',
    'ethics-architecture',
    'resonance-over-recreation',
    'state-vectors',
    'protocols',
    'metrics',
    'synthetic-data',
    'literature-map',
    'citation-table',
    'next-steps'
  ];

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

  window.BRAIN_REPLAY_GRAPH = { nodes, links, logicChain };
})();
