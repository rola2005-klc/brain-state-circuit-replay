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

  function initUi({ modes, onModeChange, onEpistemicChange, onPanelStateChange, onSelectNode }) {
    const elements = {
      modeButtons: document.getElementById('modeButtons'),
      modeTitle: document.getElementById('modeTitle'),
      modeCopy: document.getElementById('modeCopy'),
      slider: document.getElementById('epistemicSlider'),
      epistemicLabel: document.getElementById('epistemicLabel'),
      panel: document.getElementById('sidePanel'),
      closePanel: document.getElementById('closePanel'),
      nodeTitle: document.getElementById('nodeTitle'),
      nodeCluster: document.getElementById('nodeCluster'),
      nodeStatus: document.getElementById('nodeStatus'),
      nodeDescription: document.getElementById('nodeDescription'),
      nodePurpose: document.getElementById('nodePurpose'),
      nodeReflects: document.getElementById('nodeReflects'),
      nodeConnections: document.getElementById('nodeConnections'),
      nodePapers: document.getElementById('nodePapers'),
      logicChainStep: document.getElementById('logicChainStep'),
      prevLogicNode: document.getElementById('prevLogicNode'),
      nextLogicNode: document.getElementById('nextLogicNode'),
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

    elements.closePanel.addEventListener('click', () => setPanelOpen(elements, false, onPanelStateChange));
    document.querySelectorAll('[data-toggle-target]').forEach((button) => {
      button.addEventListener('click', () => togglePanel(button.dataset.toggleTarget, onPanelStateChange));
    });
    document.querySelectorAll('[data-close-target]').forEach((button) => {
      button.addEventListener('click', () => closePanelById(button.dataset.closeTarget, onPanelStateChange));
    });
    document.querySelectorAll('[data-explore-map]').forEach((button) => {
      button.addEventListener('click', () => startExploring(onPanelStateChange));
    });

    if (elements.prevLogicNode) {
      elements.prevLogicNode.addEventListener('click', () => selectLogicNeighbor(elements, -1, onSelectNode));
    }
    if (elements.nextLogicNode) {
      elements.nextLogicNode.addEventListener('click', () => selectLogicNeighbor(elements, 1, onSelectNode));
    }

    window.addEventListener('mousemove', (event) => {
      elements.tooltip.style.left = `${event.clientX}px`;
      elements.tooltip.style.top = `${event.clientY}px`;
    });

    ['topOverlay', 'mapGuide', 'controlDeck', 'sidePanel', 'firstVisitStrip'].forEach((id) => {
      updateDockState(id, document.getElementById(id)?.classList.contains('open'));
    });

    return elements;
  }

  function setPanelOpen(elements, isOpen, callback) {
    elements.panel.classList.toggle('open', isOpen);
    updateDockState(elements.panel.id, isOpen);
    if (callback) callback(isOpen);
  }

  function togglePanel(id, callback) {
    const panel = document.getElementById(id);
    if (!panel) return;
    const isOpen = panel.classList.contains('open');
    closePanelById(id, callback, isOpen);
  }

  function closePanelById(id, callback, forceClose = true) {
    const panel = document.getElementById(id);
    if (!panel) return;
    const shouldOpen = forceClose === true ? false : true;
    panel.classList.toggle('open', shouldOpen);
    updateDockState(id, shouldOpen);
    if (callback) callback(shouldOpen);
  }

  function startExploring(callback) {
    ['topOverlay', 'controlDeck', 'firstVisitStrip'].forEach((id) => closePanelById(id, callback));
    const guide = document.getElementById('mapGuide');
    if (guide) {
      guide.classList.add('open');
      updateDockState('mapGuide', true);
    }
    if (callback) callback(true);
  }

  function updateDockState(id, isOpen) {
    document.querySelectorAll(`[data-toggle-target="${id}"]`).forEach((button) => {
      button.classList.toggle('active', isOpen);
      button.setAttribute('aria-pressed', String(isOpen));
    });
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
    renderLogicChain(elements, node);
    renderConnections(elements, node);
    renderPapers(elements, node);

    if (node.docLink) {
      elements.nodeDocLink.href = node.docLink;
      elements.nodeDocLink.textContent = 'Open related section';
      elements.nodeDocLink.classList.remove('hidden');
    } else {
      elements.nodeDocLink.classList.add('hidden');
    }

    setPanelOpen(elements, true);
  }

  function logicIndex(nodeId) {
    const chain = window.BRAIN_REPLAY_GRAPH?.logicChain || [];
    return chain.indexOf(nodeId);
  }

  function selectLogicNeighbor(elements, direction, onSelectNode) {
    const chain = window.BRAIN_REPLAY_GRAPH?.logicChain || [];
    const currentId = elements.panel?.dataset.currentNodeId;
    const index = logicIndex(currentId);
    if (index < 0) return;
    const nextIndex = Math.min(chain.length - 1, Math.max(0, index + direction));
    if (nextIndex === index) return;
    if (onSelectNode) onSelectNode(chain[nextIndex]);
  }

  function renderLogicChain(elements, node) {
    if (!elements.logicChainStep) return;
    const chain = window.BRAIN_REPLAY_GRAPH?.logicChain || [];
    const byId = new Map((window.BRAIN_REPLAY_GRAPH?.nodes || []).map((item) => [item.id, item]));
    const index = logicIndex(node.id);
    elements.panel.dataset.currentNodeId = node.id;

    if (index < 0) {
      elements.logicChainStep.textContent = 'This node is outside the main walkthrough chain; use connected ideas for local context.';
      if (elements.prevLogicNode) elements.prevLogicNode.disabled = true;
      if (elements.nextLogicNode) elements.nextLogicNode.disabled = true;
      return;
    }

    const previous = byId.get(chain[index - 1]);
    const next = byId.get(chain[index + 1]);
    elements.logicChainStep.textContent = `Step ${index + 1} / ${chain.length}${next ? ` · Next: ${next.label}` : ' · End of chain'}`;
    if (elements.prevLogicNode) {
      elements.prevLogicNode.disabled = !previous;
      elements.prevLogicNode.textContent = previous ? `← ${previous.label}` : '← Previous';
    }
    if (elements.nextLogicNode) {
      elements.nextLogicNode.disabled = !next;
      elements.nextLogicNode.textContent = next ? `${next.label} →` : 'End →';
    }
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

  function renderPapers(elements, node) {
    if (!elements.nodePapers) return;
    elements.nodePapers.innerHTML = '';
    const papers = node.papers || [];
    if (!papers.length) {
      const li = document.createElement('li');
      li.textContent = 'No direct paper attached yet; use the related brief section for the broader citation table.';
      elements.nodePapers.appendChild(li);
      return;
    }

    papers.forEach((paper) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = paper.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = `${paper.isRecent ? 'New · ' : ''}${paper.short || paper.title}`;
      const span = document.createElement('span');
      span.textContent = `${paper.title}${paper.note ? ` — ${paper.note}` : ''}`;
      li.append(a, span);
      elements.nodePapers.appendChild(li);
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
