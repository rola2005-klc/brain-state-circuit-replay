(function initHome() {
  const portrait = document.getElementById('portrait');
  if (!portrait) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(hover: hover)').matches) return;

  // The rings lean toward the cursor at different depths: a small nod to resonance.
  let frame = 0;
  let target = { x: 0, y: 0 };

  function apply() {
    frame = 0;
    portrait.style.setProperty('--tx', target.x.toFixed(3));
    portrait.style.setProperty('--ty', target.y.toFixed(3));
  }

  window.addEventListener('pointermove', (event) => {
    const rect = portrait.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const reach = Math.max(rect.width, 420);
    target = {
      x: Math.max(-1, Math.min(1, (event.clientX - cx) / reach)),
      y: Math.max(-1, Math.min(1, (event.clientY - cy) / reach))
    };
    if (!frame) frame = requestAnimationFrame(apply);
  }, { passive: true });

  document.addEventListener('pointerleave', () => {
    target = { x: 0, y: 0 };
    if (!frame) frame = requestAnimationFrame(apply);
  });
})();
