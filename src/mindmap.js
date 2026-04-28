(function initializeMindmap() {
  const clusterColors = {
    Problem: '#79f2c9',
    Biology: '#8fb4ff',
    'Hard Problem': '#ff9ec4',
    'Replay Modes': '#c6f57a',
    Technology: '#68d8ff',
    'Ethics/Risk': '#ffd166',
    'Simulation Layer': '#d9b8ff',
    Roadmap: '#f2f7a1'
  };

  const statusColors = {
    known: '#79f2c9',
    plausible: '#8fb4ff',
    speculative: '#ff9ec4'
  };

  let graph;
  let ui;
  let brain;
  let activeMode;
  let hoveredNode = null;
  let selectedNode = null;
  let epistemicValue = 50;

  function colorWithAlpha(hex, alpha) {
    const clean = hex.replace('#', '');
    const value = parseInt(clean, 16);
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function nodeColor(node) {
    const isHighlighted = activeMode.highlightNodes.includes(node.id);
    const isHovered = hoveredNode && hoveredNode.id === node.id;
    const isSelected = selectedNode && selectedNode.id === node.id;
    const weight = window.BRAIN_REPLAY_UI.epistemicWeight(node.status, epistemicValue);
    const base = isHighlighted ? activeMode.color : statusColors[node.status] || clusterColors[node.cluster] || '#dce8ff';
    const alpha = Math.min(1, 0.3 + weight * 0.55 + (isHighlighted ? 0.25 : 0) + (isHovered || isSelected ? 0.2 : 0));
    return colorWithAlpha(base, alpha);
  }

  function nodeValue(node) {
    const isHighlighted = activeMode.highlightNodes.includes(node.id);
    const isHovered = hoveredNode && hoveredNode.id === node.id;
    const isSelected = selectedNode && selectedNode.id === node.id;
    const weight = window.BRAIN_REPLAY_UI.epistemicWeight(node.status, epistemicValue);
    return 3.5 + weight * 2.2 + (isHighlighted ? 2.3 : 0) + (isHovered || isSelected ? 2.5 : 0);
  }

  function linkColor(link) {
    const key = window.BRAIN_REPLAY_MODES.linkKey(link);
    const source = typeof link.source === 'object' ? link.source : null;
    const target = typeof link.target === 'object' ? link.target : null;
    const touchesSelected = selectedNode && (source?.id === selectedNode.id || target?.id === selectedNode.id);
    const highlighted = activeMode.highlightLinks.includes(key) || touchesSelected;
    return highlighted ? colorWithAlpha(activeMode.secondaryColor, 0.72) : 'rgba(190, 210, 235, 0.13)';
  }

  function linkWidth(link) {
    const key = window.BRAIN_REPLAY_MODES.linkKey(link);
    return activeMode.highlightLinks.includes(key) ? 2.2 : 0.7;
  }

  function refreshGraph() {
    if (!graph) return;
    graph
      .nodeColor(nodeColor)
      .nodeVal(nodeValue)
      .linkColor(linkColor)
      .linkWidth(linkWidth)
      .linkDirectionalParticles((link) => activeMode.highlightLinks.includes(window.BRAIN_REPLAY_MODES.linkKey(link)) ? 3 : 0)
      .linkDirectionalParticleColor(() => activeMode.color)
      .linkDirectionalParticleWidth(1.8)
      .linkDirectionalParticleSpeed(0.006);
  }

  function setMode(modeId) {
    activeMode = window.BRAIN_REPLAY_MODES.modes[modeId] || window.BRAIN_REPLAY_MODES.modes.cue;
    window.BRAIN_REPLAY_UI.setActiveMode(ui, activeMode);
    window.BRAIN_REPLAY_BRAIN.setReplayMode(brain, activeMode);
    refreshGraph();
  }

  function setEpistemic(value) {
    epistemicValue = value;
    refreshGraph();
  }

  function focusNode(node) {
    selectedNode = node;
    window.BRAIN_REPLAY_UI.showNode(ui, node);

    const distance = 82;
    const distRatio = 1 + distance / Math.hypot(node.x || 1, node.y || 1, node.z || 1);
    graph.cameraPosition(
      { x: (node.x || 0) * distRatio, y: (node.y || 0) * distRatio, z: (node.z || 0) * distRatio },
      node,
      900
    );
    refreshGraph();
  }

  function onResize() {
    if (!graph) return;
    graph.width(window.innerWidth).height(window.innerHeight);
  }

  function startBrainAnimation() {
    const startedAt = performance.now();

    function frame(now) {
      window.BRAIN_REPLAY_BRAIN.animateBrainObject(brain, (now - startedAt) / 1000);
      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function init() {
    if (!window.THREE || !window.ForceGraph3D) {
      document.getElementById('graph').innerHTML = '<div class="node-tooltip">Unable to load 3D libraries from CDN.</div>';
      return;
    }

    activeMode = window.BRAIN_REPLAY_MODES.modes[window.BRAIN_REPLAY_MODES.defaultMode];
    ui = window.BRAIN_REPLAY_UI.initUi({
      modes: window.BRAIN_REPLAY_MODES.modes,
      onModeChange: setMode,
      onEpistemicChange: setEpistemic,
      onPanelStateChange: onResize
    });

    graph = ForceGraph3D({ controlType: 'orbit' })(document.getElementById('graph'))
      .graphData(window.BRAIN_REPLAY_GRAPH)
      .backgroundColor('rgba(0,0,0,0)')
      .width(window.innerWidth)
      .height(window.innerHeight)
      .nodeLabel((node) => `${node.label} · ${node.status}`)
      .nodeResolution(24)
      .linkOpacity(1)
      .linkCurvature(0.08)
      .linkDirectionalParticleResolution(8)
      .cooldownTicks(90)
      .onNodeClick(focusNode)
      .onNodeHover((node) => {
        hoveredNode = node;
        window.BRAIN_REPLAY_UI.showTooltip(ui, node);
        document.body.style.cursor = node ? 'pointer' : 'default';
        refreshGraph();
      });

    graph.d3Force('charge').strength(-82);
    graph.d3Force('link').distance(56);
    graph.cameraPosition({ x: 0, y: 70, z: 260 }, { x: 0, y: 0, z: 0 }, 0);

    const controls = graph.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.45;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;

    graph.scene().add(new THREE.AmbientLight('#dce8ff', 0.42));
    const keyLight = new THREE.DirectionalLight('#ffffff', 0.55);
    keyLight.position.set(80, 130, 90);
    graph.scene().add(keyLight);

    brain = window.BRAIN_REPLAY_BRAIN.addBrainObject(graph.scene());
    setMode(activeMode.id);
    startBrainAnimation();

    window.addEventListener('resize', onResize);
  }

  window.addEventListener('DOMContentLoaded', init);
})();
