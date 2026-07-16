(function exposeReplayModes() {
  const modes = {
    cue: {
      id: 'cue',
      label: 'Cue-triggered recall',
      shortLabel: 'Cue recall',
      copy: 'Uses sensory or contextual cues to bias recall. This is the most conservative mode and emphasizes known cue-driven memory effects.',
      statusBias: 'known',
      color: '#79f2c9',
      secondaryColor: '#8fb4ff',
      pulse: 0.45,
      highlightNodes: ['cue-triggered', 'multimodal-cues', 'unreturnable-present', 'self-capacity', 'what-we-saw', 'reconstruction-vs-replay'],
      highlightLinks: ['cue-triggered->multimodal-cues', 'photo-problem->unreturnable-present', 'reconstruction-vs-replay->cue-triggered']
    },
    tmr: {
      id: 'tmr',
      label: 'TMR',
      shortLabel: 'TMR',
      copy: 'Targets memory reactivation through associated cues, often discussed in sleep and consolidation contexts. It is real adjacent science, but still far from exact replay.',
      statusBias: 'known',
      color: '#8fb4ff',
      secondaryColor: '#79f2c9',
      pulse: 0.62,
      highlightNodes: ['tmr', 'cue-triggered', 'literature-map', 'metrics', 'synthetic-data'],
      highlightLinks: ['cue-triggered->tmr', 'literature-map->citation-table']
    },
    direct: {
      id: 'direct',
      label: 'Direct Engram',
      shortLabel: 'Direct',
      copy: 'Explores the speculative edge of direct trace access. The UI intentionally highlights EEG limits, uncertainty, and ethical risk around this mode.',
      statusBias: 'speculative',
      color: '#ff9ec4',
      secondaryColor: '#ffd166',
      pulse: 0.95,
      highlightNodes: ['direct-engram', 'engrams', 'retroactive-addressability', 'eeg-limits', 'controlled-reactivation', 'consent'],
      highlightLinks: ['tmr->direct-engram', 'eeg-limits->direct-engram', 'engrams->retroactive-addressability']
    },
    guided: {
      id: 'guided',
      label: 'Guided Endogenous Resonance',
      shortLabel: 'Guided',
      copy: 'Combines cues, attention, narrative, and feedback to guide partial state re-entry. It sits between current cueing and more speculative direct control, without implying exact playback.',
      statusBias: 'plausible',
      color: '#c6f57a',
      secondaryColor: '#8fb4ff',
      pulse: 0.72,
      highlightNodes: ['guided-endogenous', 'integrated-self-state', 'self-capacity', 'emotion-structured-information', 'neurofeedback', 'protocols', 'state-vectors', 'emotional-risk', 'metrics'],
      highlightLinks: ['integrated-self-state->self-capacity', 'self-capacity->emotion-structured-information', 'direct-engram->guided-endogenous', 'guided-endogenous->neurofeedback', 'protocols->guided-endogenous']
    }
  };

  function linkKey(link) {
    const source = typeof link.source === 'object' ? link.source.id : link.source;
    const target = typeof link.target === 'object' ? link.target.id : link.target;
    return `${source}->${target}`;
  }

  window.BRAIN_REPLAY_MODES = {
    modes,
    defaultMode: 'cue',
    linkKey
  };
})();
