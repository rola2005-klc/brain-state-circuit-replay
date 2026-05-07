(function initJourney() {
  const steps = [
    {
      icon: '🧍',
      title: 'Present moment: "I can\'t go back anymore"',
      copy: 'A meaningful moment becomes fragile when the person notices it is unrevisitable. Anticipatory grief can interrupt the very presence the person wants to protect.',
      values: { body: 56, attention: 82, emotion: 88, context: 70, selfModel: 78, meaning: 92, ignorance: 86, safety: 44 }
    },
    {
      icon: '📷',
      title: 'Cue, photo, or object as anchor',
      copy: 'A photo, song, place, odor, object, or phrase acts as an external anchor. It preserves a doorway into context, not the integrated self-state itself.',
      values: { body: 48, attention: 74, emotion: 66, context: 90, selfModel: 62, meaning: 78, ignorance: 66, safety: 70 }
    },
    {
      icon: '🧠',
      title: 'Native biological trace and plasticity as record',
      copy: 'The nervous system carries traces through plasticity and circuit change. The thesis treats biology as the native record while keeping EEG and external sensors in a limited monitoring role.',
      values: { body: 62, attention: 58, emotion: 64, context: 72, selfModel: 70, meaning: 68, ignorance: 54, safety: 74 }
    },
    {
      icon: '🧭',
      title: 'Trace navigation and retroactive addressability',
      copy: 'The hard problem is addressing the right trace after the fact. Current science supports cueing and reactivation effects, not precise lookup of a stored past self.',
      values: { body: 54, attention: 86, emotion: 72, context: 76, selfModel: 82, meaning: 82, ignorance: 60, safety: 52 }
    },
    {
      icon: '✨',
      title: 'Partial integrated self-state reconstruction',
      copy: 'A future system might guide partial resonance across body state, attention, emotion topology, context, self-model, meaning, and configured ignorance: the specific boundary of what the past self did not yet know or have to account for. The target is self-capacity: the ability to feel the world that way.',
      values: { body: 76, attention: 78, emotion: 84, context: 66, selfModel: 88, meaning: 88, ignorance: 72, safety: 64 }
    },
    {
      icon: '🛡️',
      title: 'Ethics gate: return to present',
      copy: 'The final gate rejects state chasing. Resonance over Recreation means the past-associated state should help the person return to present agency, not trap them in the past.',
      values: { body: 70, attention: 72, emotion: 68, context: 58, selfModel: 80, meaning: 84, ignorance: 56, safety: 94 }
    },
    {
      icon: '🌌',
      title: 'Open horizon: what science cannot do yet',
      copy: 'The project ends by naming future research questions rather than pretending they are solved: encoding-imminence, configured ignorance, affective topology, sleep-integrated resonance, personal corpus state archaeology, and voluntary loosening of unwanted state-attractors.',
      values: { body: 64, attention: 88, emotion: 74, context: 82, selfModel: 86, meaning: 96, ignorance: 78, safety: 90 }
    }
  ];

  const path = document.getElementById('journeyPath');
  const stepCount = document.getElementById('stepCount');
  const stepTitle = document.getElementById('stepTitle');
  const stepCopy = document.getElementById('stepCopy');
  const prev = document.getElementById('prevStep');
  const next = document.getElementById('nextStep');
  const bars = {
    body: document.getElementById('barBody'),
    attention: document.getElementById('barAttention'),
    emotion: document.getElementById('barEmotion'),
    context: document.getElementById('barContext'),
    selfModel: document.getElementById('barSelfModel'),
    meaning: document.getElementById('barMeaning'),
    ignorance: document.getElementById('barIgnorance'),
    safety: document.getElementById('barSafety')
  };
  let activeIndex = 0;

  function renderPath() {
    path.innerHTML = '';
    steps.forEach((step, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'journey-step';
      button.dataset.commentTargetId = `journey-step-${index + 1}`;
      button.dataset.commentTargetLabel = `${index + 1}. ${step.title}`;
      button.setAttribute('aria-current', index === activeIndex ? 'step' : 'false');
      button.innerHTML = `<span>${step.icon}</span><strong>${index + 1}. ${step.title}</strong>`;
      button.addEventListener('click', () => setStep(index));
      path.appendChild(button);
    });
  }

  function setStep(index) {
    activeIndex = Math.max(0, Math.min(steps.length - 1, index));
    const step = steps[activeIndex];
    stepCount.textContent = `Step ${activeIndex + 1} of ${steps.length}`;
    stepTitle.textContent = step.title;
    stepCopy.textContent = step.copy;

    Object.entries(step.values).forEach(([key, value]) => {
      bars[key].value = value;
    });

    prev.disabled = activeIndex === 0;
    next.disabled = activeIndex === steps.length - 1;
    renderPath();
    window.dispatchEvent(new CustomEvent('brainreplay:targetchange', {
      detail: {
        kind: 'journey-step',
        id: `journey-step-${activeIndex + 1}`,
        label: `${activeIndex + 1}. ${step.title}`,
        url: `${window.location.pathname}${window.location.hash || ''}`
      }
    }));
  }

  prev.addEventListener('click', () => setStep(activeIndex - 1));
  next.addEventListener('click', () => setStep(activeIndex + 1));

  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') setStep(activeIndex - 1);
    if (event.key === 'ArrowRight') setStep(activeIndex + 1);
  });

  setStep(0);
})();
