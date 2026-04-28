(function exposeReplayUi() {
  const stateRank = { known: 0, plausible: 1, speculative: 2 };

  function statusClass(status) {
    return `status-${status || 'plausible'}`;
  }

  function createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'node-tooltip hidden';
    document.body.appendChild(tooltip);
    return tooltip;
  }

  function initUi({ modes, onModeChange, onEpistemicChange, onPanelStateChange }) {
    const elements = {
      modeButtons: document.getElementById('modeButtons'),
      modeTitle: document.getElementById('modeTitle'),
      modeCopy: document.getElementById('modeCopy'),
      slider: document.getElementById('epistemicSlider'),
      epistemicLabel: document.getElementById('epistemicLabel'),
      panel: document.getElementById('sidePanel'),
      panelToggle: document.getElementById('panelToggle'),
      closePanel: document.getElementById('closePanel'),
      nodeTitle: document.getElementById('nodeTitle'),
      nodeCluster: document.getElementById('nodeCluster'),
      nodeStatus: document.getElementById('nodeStatus'),
      nodeDescription: document.getElementById('nodeDescription'),
      nodePurpose: document.getElementById('nodePurpose'),
      nodeReflects: document.getElementById('nodeReflects'),
      nodeConnections: document.getElementById('nodeConnections'),
      nodeDocLink: document.getElementById('nodeDocLink'),
      tooltip: createTooltip()
    };

    Object.values(modes).forEach((mode) => {
      const button = document.createElement('button');
      button.className = 'mode-button';
      button.type = 'button';
      button.dataset.mode = mode.id;
      button.textContent = mode.shortLabel;
      button.title = mode.label;
      button.addEventListener('click', () => onModeChange(mode.id));
      elements.modeButtons.appendChild(button);
    });

    elements.slider.addEventListener('input', () => {
      const value = Number(elements.slider.value);
      elements.epistemicLabel.textContent = epistemicLabel(value);
      onEpistemicChange(value);
    });

    elements.panelToggle.addEventListener('click', () => setPanelOpen(elements, !elements.panel.classList.contains('open'), onPanelStateChange));
    elements.closePanel.addEventListener('click', () => setPanelOpen(elements, false, onPanelStateChange));

    window.addEventListener('mousemove', (event) => {
      elements.tooltip.style.left = `${event.clientX}px`;
      elements.tooltip.style.top = `${event.clientY}px`;
    });

    return elements;
  }

  function setPanelOpen(elements, isOpen, callback) {
    elements.panel.classList.toggle('open', isOpen);
    elements.panelToggle.setAttribute('aria-expanded', String(isOpen));
    if (callback) callback(isOpen);
  }

  function epistemicLabel(value) {
    if (value < 28) return 'Current science emphasis';
    if (value > 72) return 'Speculative frontier emphasis';
    return 'Balanced map';
  }

  function setActiveMode(elements, mode) {
    elements.modeTitle.textContent = mode.label;
    elements.modeCopy.textContent = mode.copy;
    elements.modeButtons.querySelectorAll('.mode-button').forEach((button) => {
      button.classList.toggle('active', button.dataset.mode === mode.id);
    });
  }

  function showNode(elements, node) {
    if (!node) return;

    elements.nodeTitle.textContent = node.label;
    elements.nodeCluster.textContent = node.cluster;
    elements.nodeStatus.textContent = node.status;
    elements.nodeStatus.className = `status-badge ${statusClass(node.status)}`;
    elements.nodeDescription.textContent = node.description;
    elements.nodePurpose.textContent = node.purpose || 'This node explains one role in the project argument.';
    elements.nodeReflects.textContent = node.reflects || 'This node connects back to the project concept.';
    renderConnections(elements, node);

    if (node.docLink) {
      elements.nodeDocLink.href = node.docLink;
      elements.nodeDocLink.textContent = 'Open related doc';
      elements.nodeDocLink.classList.remove('hidden');
    } else {
      elements.nodeDocLink.classList.add('hidden');
    }

    setPanelOpen(elements, true);
  }

  function renderConnections(elements, node) {
    if (!elements.nodeConnections) return;
    const graph = window.BRAIN_REPLAY_GRAPH || { nodes: [], links: [] };
    const byId = new Map(graph.nodes.map((item) => [item.id, item]));
    const neighbors = graph.links
      .map((link) => {
        const source = typeof link.source === 'object' ? link.source.id : link.source;
        const target = typeof link.target === 'object' ? link.target.id : link.target;
        if (source === node.id) return byId.get(target);
        if (target === node.id) return byId.get(source);
        return null;
      })
      .filter(Boolean)
      .slice(0, 6);

    elements.nodeConnections.innerHTML = '';
    if (!neighbors.length) {
      const li = document.createElement('li');
      li.textContent = 'This is a standalone framing node.';
      elements.nodeConnections.appendChild(li);
      return;
    }

    neighbors.forEach((neighbor) => {
      const li = document.createElement('li');
      const strong = document.createElement('strong');
      const span = document.createElement('span');
      strong.textContent = neighbor.label;
      span.textContent = ` — ${neighbor.cluster.toLowerCase()} / ${neighbor.status}`;
      li.append(strong, span);
      elements.nodeConnections.appendChild(li);
    });
  }

  function showTooltip(elements, node) {
    if (!node) {
      elements.tooltip.classList.add('hidden');
      return;
    }

    elements.tooltip.innerHTML = `<strong>${node.label}</strong><br><span>${node.cluster} · ${node.status}</span><br><em>${node.purpose || 'Click to inspect this concept.'}</em>`;
    elements.tooltip.classList.remove('hidden');
  }

  function epistemicWeight(status, sliderValue) {
    const target = sliderValue / 50;
    const rank = stateRank[status] ?? 1;
    const distance = Math.abs(rank - target);
    return Math.max(0.24, 1 - distance * 0.34);
  }

  window.BRAIN_REPLAY_UI = {
    initUi,
    setActiveMode,
    showNode,
    showTooltip,
    epistemicWeight
  };
})();
