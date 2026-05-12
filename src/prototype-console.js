(function initializePrototypeConsole() {
  const api = window.BSCR;
  if (!api) return;

  const els = {
    target: document.getElementById('prototypeTarget'),
    protocol: document.getElementById('prototypeProtocol'),
    cue: document.getElementById('prototypeCue'),
    feedback: document.getElementById('prototypeFeedback'),
    cueValue: document.getElementById('prototypeCueValue'),
    feedbackValue: document.getElementById('prototypeFeedbackValue'),
    similarity: document.getElementById('prototypeSimilarity'),
    similarityBar: document.getElementById('prototypeSimilarityBar'),
    risk: document.getElementById('prototypeRisk'),
    riskBar: document.getElementById('prototypeRiskBar'),
    error: document.getElementById('prototypeError'),
    errorBar: document.getElementById('prototypeErrorBar'),
    timeline: document.getElementById('prototypeTimeline'),
    narrative: document.getElementById('prototypeNarrative'),
    run: document.getElementById('prototypeRun')
  };

  if (!els.target || !els.protocol) return;

  let seed = 19;

  function init() {
    Object.entries(api.TARGET_STATES).forEach(([id, state]) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = state.name;
      els.target.appendChild(option);
    });
    els.target.value = 'childhood';

    Object.entries(api.STIMULATION_PROTOCOLS).forEach(([id, protocol]) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = protocol.name;
      els.protocol.appendChild(option);
    });
    els.protocol.value = 'neurofeedback';

    [els.target, els.protocol, els.cue, els.feedback].forEach((input) => {
      input.addEventListener('input', render);
    });
    els.run.addEventListener('click', () => {
      seed += 23;
      render();
    });

    render();
  }

  function render() {
    const cue = Number(els.cue.value);
    const feedback = Number(els.feedback.value);
    els.cueValue.textContent = cue.toFixed(2);
    els.feedbackValue.textContent = feedback.toFixed(2);

    const result = api.simulateReplay({
      targetId: els.target.value,
      protocol: els.protocol.value,
      cue,
      feedback,
      stimulation: 0.42,
      steps: 14,
      seed
    });

    const final = result.history[result.history.length - 1];
    const resonance = Math.round(final.similarity * 100);
    const risk = Math.round(final.risk * 100);
    const gap = Math.round(final.error * 100);

    setMetric(els.similarity, els.similarityBar, `${resonance}%`, resonance);
    setMetric(els.risk, els.riskBar, `${risk}%`, risk);
    setMetric(els.error, els.errorBar, final.error.toFixed(2), Math.min(100, gap));
    els.narrative.textContent = `${result.protocol.name} moved the synthetic state toward ${result.target.name}; the decoder now reads ${result.decoded.name} at ${Math.round(result.decoded.score * 100)}% match.`;
    drawTimeline(result.history);
  }

  function setMetric(label, bar, text, value) {
    label.textContent = text;
    bar.style.width = `${value}%`;
  }

  function drawTimeline(history) {
    const canvas = els.timeline;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(4, 8, 16, 0.86)';
    ctx.fillRect(0, 0, width, height);
    drawGrid(ctx, width, height);
    drawSeries(ctx, history.map((item) => item.similarity), '#79f2c9', true);
    drawSeries(ctx, history.map((item) => item.risk), '#ff9ec4', false);
    ctx.fillStyle = '#dce8f9';
    ctx.font = '700 22px system-ui';
    ctx.fillText('resonance', 24, 36);
    ctx.fillStyle = '#ffb2cb';
    ctx.fillText('risk', 24, 66);
  }

  function drawGrid(ctx, width, height) {
    ctx.strokeStyle = 'rgba(220, 236, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += 45) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  function drawSeries(ctx, values, color, fillArea) {
    const pad = 28;
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const points = values.map((value, index) => ({
      x: pad + index * ((width - pad * 2) / (values.length - 1)),
      y: height - pad - value * (height - pad * 2)
    }));
    if (fillArea) {
      const gradient = ctx.createLinearGradient(0, pad, 0, height - pad);
      gradient.addColorStop(0, 'rgba(121, 242, 201, 0.24)');
      gradient.addColorStop(1, 'rgba(121, 242, 201, 0.02)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      points.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.lineTo(points[points.length - 1].x, height - pad);
      ctx.lineTo(points[0].x, height - pad);
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 7;
    ctx.shadowColor = color;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  window.addEventListener('DOMContentLoaded', init);
})();
