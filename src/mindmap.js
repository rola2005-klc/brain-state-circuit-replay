(function initializeMindmap() {
  const clusterColors = {
    Overview: '#ffffff',
    Problem: '#79f2c9',
    Biology: '#8fb4ff',
    'Hard Problem': '#ff9ec4',
    'Resonance Pathways': '#c6f57a',
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
    return highlighted ? colorWithAlpha(activeMode.secondaryColor, 0.78) : 'rgba(190, 210, 235, 0.09)';
  }

  function linkWidth(link) {
    const key = window.BRAIN_REPLAY_MODES.linkKey(link);
    return activeMode.highlightLinks.includes(key) ? 2.6 : 0.52;
  }

  function makeStarField() {
    const count = 280;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const radius = 360 + Math.random() * 240;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[i * 3 + 1] = Math.cos(phi) * radius;
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color: '#dce8ff',
        size: 1.15,
        transparent: true,
        opacity: 0.26,
        depthWrite: false
      })
    );
  }



  function makeLabelSprite(node) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const label = node.label.length > 34 ? `${node.label.slice(0, 31)}…` : node.label;
    const fontSize = 40;
    const paddingX = 22;
    const paddingY = 14;
    context.font = `800 ${fontSize}px Inter, Arial, sans-serif`;
    const metrics = context.measureText(label);
    canvas.width = Math.ceil(metrics.width + paddingX * 2);
    canvas.height = fontSize + paddingY * 2;
    context.font = `800 ${fontSize}px Inter, Arial, sans-serif`;
    context.textBaseline = 'middle';
    context.fillStyle = 'rgba(4, 7, 12, 0.78)';
    roundRect(context, 0, 0, canvas.width, canvas.height, 18);
    context.fill();
    context.strokeStyle = colorWithAlpha(statusColors[node.status] || clusterColors[node.cluster] || '#ffffff', 0.82);
    context.lineWidth = 3;
    roundRect(context, 2, 2, canvas.width - 4, canvas.height - 4, 16);
    context.stroke();
    context.fillStyle = '#f5fbff';
    context.fillText(label, paddingX, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(canvas.width / 6.4, canvas.height / 6.4, 1);
    sprite.position.set(0, 12, 0);
    return sprite;
  }

  function roundRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
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

  function focusNodeById(nodeId) {
    const graphData = window.BRAIN_REPLAY_GRAPH || { nodes: [] };
    const node = graphData.nodes.find((item) => item.id === nodeId);
    if (node) focusNode(node);
  }

  function focusNode(node) {
    selectedNode = node;
    window.BRAIN_REPLAY_UI.showNode(ui, node);

    const distance = 92;
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

  function showGraphFallback(message) {
    const graphElement = document.getElementById('graph');
    if (!graphElement) return;
    graphElement.innerHTML = `
      <div class="node-tooltip graph-fallback">
        <strong>3D view unavailable in this browser context.</strong>
        <span>${message}</span>
        <span>The concept map data and project documents still load; try a WebGL-enabled browser for the interactive graph.</span>
      </div>
    `;
  }

  function init() {
    if (!window.THREE || !window.ForceGraph3D) {
      showGraphFallback('Unable to load 3D libraries from CDN.');
      return;
    }

    activeMode = window.BRAIN_REPLAY_MODES.modes[window.BRAIN_REPLAY_MODES.defaultMode];
    ui = window.BRAIN_REPLAY_UI.initUi({
      modes: window.BRAIN_REPLAY_MODES.modes,
      onModeChange: setMode,
      onEpistemicChange: setEpistemic,
      onPanelStateChange: onResize,
      onSelectNode: focusNodeById
    });
    selectedNode = window.BRAIN_REPLAY_GRAPH.nodes.find((node) => node.id === 'project-thesis') || window.BRAIN_REPLAY_GRAPH.nodes[0];
    if (selectedNode) window.BRAIN_REPLAY_UI.showNode(ui, selectedNode);

    try {
      graph = ForceGraph3D({ controlType: 'orbit' })(document.getElementById('graph'))
        .graphData(window.BRAIN_REPLAY_GRAPH)
        .backgroundColor('rgba(0,0,0,0)')
        .width(window.innerWidth)
        .height(window.innerHeight)
        .nodeLabel((node) => `${node.label} · ${node.cluster} · ${node.status}
${node.purpose || ''}`)
        .nodeThreeObjectExtend(true)
        .nodeThreeObject((node) => node.isKey ? makeLabelSprite(node) : null)
        .nodeResolution(24)
        .enableNodeDrag(true)
        .linkOpacity(1)
        .linkCurvature(0.05)
        .linkDirectionalParticleResolution(8)
        .cooldownTicks(90)
        .onNodeClick(focusNode)
        .onNodeHover((node) => {
          hoveredNode = node;
          window.BRAIN_REPLAY_UI.showTooltip(ui, node);
          document.body.style.cursor = node ? 'pointer' : 'default';
          refreshGraph();
        });
    } catch (error) {
      showGraphFallback(error && error.message ? error.message : 'WebGL graph initialization failed.');
      return;
    }

    graph.d3Force('charge').strength(-118);
    graph.d3Force('link').distance(72);
    graph.cameraPosition({ x: 0, y: 78, z: 285 }, { x: 0, y: 4, z: 0 }, 0);

    const controls = graph.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.45;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;

    graph.scene().fog = new THREE.FogExp2('#03050a', 0.0032);
    graph.scene().add(makeStarField());
    graph.scene().add(new THREE.AmbientLight('#dce8ff', 0.36));
    const keyLight = new THREE.DirectionalLight('#ffffff', 0.68);
    keyLight.position.set(80, 130, 90);
    graph.scene().add(keyLight);
    const rimLight = new THREE.DirectionalLight('#79f2c9', 0.34);
    rimLight.position.set(-140, 60, -120);
    graph.scene().add(rimLight);

    brain = window.BRAIN_REPLAY_BRAIN.addBrainObject(graph.scene());
    setMode(activeMode.id);
    startBrainAnimation();

    window.addEventListener('resize', onResize);
  }

  window.addEventListener('DOMContentLoaded', init);
})();
