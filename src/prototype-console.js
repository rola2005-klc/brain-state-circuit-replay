(function initializePrototypeConsole() {
  const api = window.BSCR;
  if (!api || !api.evaluateResonance) return;

  const els = {
    target: document.getElementById('prototypeTarget'),
    protocol: document.getElementById('prototypeProtocol'),
    cue: document.getElementById('prototypeCue'),
    feedback: document.getElementById('prototypeFeedback'),
    noise: document.getElementById('prototypeNoise'),
    cueValue: document.getElementById('prototypeCueValue'),
    feedbackValue: document.getElementById('prototypeFeedbackValue'),
    noiseValue: document.getElementById('prototypeNoiseValue'),
    targetScore: document.getElementById('prototypeTargetScore'),
    targetBar: document.getElementById('prototypeTargetBar'),
    rivalScore: document.getElementById('prototypeRivalScore'),
    rivalName: document.getElementById('prototypeRivalName'),
    rivalBar: document.getElementById('prototypeRivalBar'),
    margin: document.getElementById('prototypeMargin'),
    marginNote: document.getElementById('prototypeMarginNote'),
    marginBar: document.getElementById('prototypeMarginBar'),
    correct: document.getElementById('prototypeCorrect'),
    chance: document.getElementById('prototypeChance'),
    correctBar: document.getElementById('prototypeCorrectBar'),
    risk: document.getElementById('prototypeRisk'),
    riskBar: document.getElementById('prototypeRiskBar'),
    timeline: document.getElementById('prototypeTimeline'),
    narrative: document.getElementById('prototypeNarrative'),
    run: document.getElementById('prototypeRun')
  };

  if (!els.target || !els.protocol) return;

  const RUNS = 12;
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

    [els.target, els.protocol, els.cue, els.feedback, els.noise].forEach((input) => {
      input.addEventListener('input', render);
    });
    els.run.addEventListener('click', () => {
      seed += 23;
      render();
    });

    render();
  }

  function signed(value) {
    const text = Math.abs(value).toFixed(3);
    return value < 0 ? `−${text}` : `+${text}`;
  }

  function render() {
    const cue = Number(els.cue.value);
    const feedback = Number(els.feedback.value);
    const noise = Number(els.noise.value);
    els.cueValue.textContent = cue.toFixed(2);
    els.feedbackValue.textContent = feedback.toFixed(2);
    els.noiseValue.textContent = noise.toFixed(2);

    const targetId = els.target.value;
    const summary = api.evaluateResonance({
      targetId,
      protocol: els.protocol.value,
      cue,
      feedback,
      stimulation: 0.42,
      steps: 14,
      noise,
      runs: RUNS,
      seed
    });
    const target = api.TARGET_STATES[targetId];
    const first = summary.results[0];
    const rivalCounts = {};
    summary.results.forEach((item) => {
      rivalCounts[item.margin.rival.name] = (rivalCounts[item.margin.rival.name] || 0) + 1;
    });
    const rivalName = Object.entries(rivalCounts).sort((a, b) => b[1] - a[1])[0][0];
    const chanceRuns = Math.round(summary.chance * RUNS);

    els.targetScore.textContent = summary.meanTargetScore.toFixed(3);
    els.targetBar.style.width = `${Math.round(summary.meanTargetScore * 100)}%`;
    els.rivalScore.textContent = summary.meanRivalScore.toFixed(3);
    els.rivalName.textContent = rivalName;
    els.rivalBar.style.width = `${Math.round(summary.meanRivalScore * 100)}%`;
    els.margin.textContent = signed(summary.meanMargin);
    els.marginNote.textContent = `± ${summary.sdMargin.toFixed(3)} over ${RUNS} runs · was ${signed(summary.meanBaselineMargin)}`;
    els.marginBar.style.width = `${Math.round(Math.max(0, Math.min(1, Math.abs(summary.meanMargin) / 0.1)) * 100)}%`;
    els.marginBar.parentElement.classList.toggle('is-negative', summary.meanMargin < 0);
    els.correct.textContent = `${summary.correct} of ${RUNS}`;
    els.chance.textContent = `chance: ${chanceRuns} of ${RUNS}`;
    els.correctBar.style.width = `${Math.round((summary.correct / RUNS) * 100)}%`;
    els.risk.textContent = `${Math.round(summary.meanRisk * 100)}%`;
    els.riskBar.style.width = `${Math.round(summary.meanRisk * 100)}%`;

    const verdict = summary.meanMargin <= 0
      ? `The closest wrong state, ${rivalName}, actually wins (margin ${signed(summary.meanMargin)}).`
      : `The honest signal is the margin: ${signed(summary.meanMargin)}, up from ${signed(summary.meanBaselineMargin)} before the cue.`;
    els.narrative.textContent = `Similarity to ${target.name} looks high (${summary.meanTargetScore.toFixed(3)}), but ${rivalName} still scores ${summary.meanRivalScore.toFixed(3)}. ${verdict} With sensor noise σ = ${noise.toFixed(2)}, a decoder picks the right state in ${summary.correct} of ${RUNS} runs — chance is ${chanceRuns}.`;

    drawTimeline(first.run.history, targetId);
  }

  function drawTimeline(history, targetId) {
    const canvas = els.timeline;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const pad = { left: 56, right: 18, top: 34, bottom: 30 };
    const topBottom = 170;
    const riskTop = 190;
    const riskBottom = height - pad.bottom + 12;
    const targetSeries = history.map((step) => step.similarity);
    const rivalSeries = history.map((step) => api.decodeMargin(step.pattern, targetId).rival.score);
    // Zoom the similarity axis to the data (labelled), so a small margin is visible.
    const lowest = Math.min(...targetSeries, ...rivalSeries);
    const lo = Math.max(0.5, Math.min(0.9, Math.floor((lowest - 0.02) * 20) / 20));
    const hi = 1.0;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(4, 8, 16, 0.9)';
    ctx.fillRect(0, 0, width, height);

    const n = history.length;
    const x = (index) => pad.left + index * ((width - pad.left - pad.right) / (n - 1));
    const y = (value) => topBottom - ((Math.max(lo, Math.min(hi, value)) - lo) / (hi - lo)) * (topBottom - pad.top);
    const ry = (value) => riskBottom - Math.max(0, Math.min(1, value)) * (riskBottom - riskTop);

    ctx.strokeStyle = 'rgba(220, 236, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.font = '600 17px system-ui, sans-serif';
    ctx.fillStyle = '#8f9bb0';
    [lo, (lo + hi) / 2, hi].forEach((tick) => {
      ctx.beginPath();
      ctx.moveTo(pad.left, y(tick));
      ctx.lineTo(width - pad.right, y(tick));
      ctx.stroke();
      ctx.fillText(tick.toFixed(tick === hi ? 1 : 3).replace(/0+$/, '').replace(/\.$/, '.0'), 8, y(tick) + 6);
    });

    // Band between target and rival: the margin, shaded.
    for (let i = 0; i < n - 1; i += 1) {
      const ahead = targetSeries[i] + targetSeries[i + 1] >= rivalSeries[i] + rivalSeries[i + 1];
      ctx.fillStyle = ahead ? 'rgba(242, 184, 114, 0.22)' : 'rgba(255, 158, 196, 0.22)';
      ctx.beginPath();
      ctx.moveTo(x(i), y(targetSeries[i]));
      ctx.lineTo(x(i + 1), y(targetSeries[i + 1]));
      ctx.lineTo(x(i + 1), y(rivalSeries[i + 1]));
      ctx.lineTo(x(i), y(rivalSeries[i]));
      ctx.closePath();
      ctx.fill();
    }

    line(ctx, targetSeries.map((value, index) => [x(index), y(value)]), '#79f2c9', 5, []);
    line(ctx, rivalSeries.map((value, index) => [x(index), y(value)]), '#aab6c8', 3.5, [10, 8]);

    ctx.strokeStyle = 'rgba(220, 236, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(pad.left, riskBottom);
    ctx.lineTo(width - pad.right, riskBottom);
    ctx.stroke();
    line(ctx, history.map((step, index) => [x(index), ry(step.risk)]), '#ff9ec4', 3.5, []);

    ctx.font = '700 18px system-ui, sans-serif';
    let legendX = pad.left;
    [['target', '#79f2c9'], ['closest wrong state', '#aab6c8'], ['margin', '#f2b872']].forEach(([label, color]) => {
      ctx.fillStyle = color;
      ctx.fillText(label, legendX, 24);
      legendX += ctx.measureText(label).width + 22;
    });
    ctx.fillStyle = '#ff9ec4';
    ctx.fillText('risk', 10, riskBottom - 4);
    ctx.fillStyle = '#8f9bb0';
    ctx.font = '600 15px system-ui, sans-serif';
    ctx.fillText('cue', x(1) - 12, height - 6);
    ctx.fillText(`step ${n - 1}`, width - pad.right - 58, height - 6);
  }

  function line(ctx, points, color, widthPx, dash) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = widthPx;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.setLineDash(dash);
    ctx.beginPath();
    points.forEach(([px, py], index) => {
      if (index === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.restore();
  }

  window.addEventListener('DOMContentLoaded', init);
})();
