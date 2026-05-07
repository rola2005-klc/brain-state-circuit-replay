(function initCommentMode() {
  const STORAGE_KEY = 'brainReplayComments:v1';
  const TYPES = ['confusion', 'question', 'todo', 'note'];
  const VERSION = 1;

  const drawer = document.getElementById('commentsDrawer');
  const toggles = Array.from(document.querySelectorAll('[data-comments-toggle]'));
  if (!drawer || !toggles.length) return;

  const state = {
    comments: loadComments(),
    target: getCurrentTarget()
  };

  const elements = buildDrawer();
  drawer.appendChild(elements.root);

  toggles.forEach((button) => {
    button.setAttribute('aria-controls', drawer.id);
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => setOpen(!drawer.classList.contains('open')));
  });

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    createComment();
  });
  elements.exportButton.addEventListener('click', exportComments);
  elements.importInput.addEventListener('change', importComments);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drawer.classList.contains('open')) setOpen(false);
  });

  window.addEventListener('brainreplay:targetchange', (event) => {
    if (event.detail) setTarget(normalizeTarget(event.detail));
  });
  window.addEventListener('hashchange', () => setTarget(getCurrentTarget()));
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) setTarget(getCurrentTarget());
  });

  setTarget(state.target);
  renderList();

  function buildDrawer() {
    const root = document.createElement('div');
    root.className = 'comments-drawer-inner';

    const header = document.createElement('div');
    header.className = 'comments-head';

    const titleWrap = document.createElement('div');
    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = 'Comment Mode';
    const title = document.createElement('h2');
    title.textContent = 'Comments';
    titleWrap.append(eyebrow, title);

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'comments-close';
    close.setAttribute('aria-label', 'Close comments');
    close.textContent = '×';
    close.addEventListener('click', () => setOpen(false));
    header.append(titleWrap, close);

    const targetCard = document.createElement('div');
    targetCard.className = 'comments-target-card';
    const targetLabel = document.createElement('strong');
    const targetMeta = document.createElement('span');
    targetCard.append(targetLabel, targetMeta);

    const form = document.createElement('form');
    form.className = 'comments-form';

    const typeLabel = document.createElement('label');
    typeLabel.textContent = 'Type';
    const type = document.createElement('select');
    TYPES.forEach((item) => {
      const option = document.createElement('option');
      option.value = item;
      option.textContent = item;
      type.appendChild(option);
    });
    typeLabel.appendChild(type);

    const textLabel = document.createElement('label');
    textLabel.textContent = 'Comment';
    const text = document.createElement('textarea');
    text.rows = 5;
    text.maxLength = 4000;
    text.placeholder = 'Add confusion, a question, a todo, or a note...';
    textLabel.appendChild(text);

    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.textContent = 'Add comment';
    form.append(typeLabel, textLabel, submit);

    const tools = document.createElement('div');
    tools.className = 'comments-tools';
    const exportButton = document.createElement('button');
    exportButton.type = 'button';
    exportButton.textContent = 'Export JSON';
    const importLabel = document.createElement('label');
    importLabel.className = 'comments-import';
    importLabel.textContent = 'Import JSON';
    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = 'application/json,.json';
    importLabel.appendChild(importInput);
    tools.append(exportButton, importLabel);

    const list = document.createElement('div');
    list.className = 'comments-list';
    list.setAttribute('aria-live', 'polite');

    const status = document.createElement('p');
    status.className = 'comments-status';
    status.setAttribute('aria-live', 'polite');

    root.append(header, targetCard, form, tools, status, list);
    return { root, form, type, text, targetLabel, targetMeta, exportButton, importInput, status, list };
  }

  function setOpen(isOpen) {
    drawer.classList.toggle('open', isOpen);
    drawer.setAttribute('aria-hidden', String(!isOpen));
    toggles.forEach((button) => {
      button.classList.toggle('active', isOpen);
      button.setAttribute('aria-expanded', String(isOpen));
      button.setAttribute('aria-pressed', String(isOpen));
    });
    if (isOpen) elements.text.focus();
  }

  function loadComments() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!Array.isArray(parsed)) return [];
      return parsed.map(normalizeComment).filter(Boolean);
    } catch (error) {
      return [];
    }
  }

  function saveComments() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.comments));
      setStatus('Saved locally in this browser. Export JSON when you want agents to review it.');
      return true;
    } catch (error) {
      console.warn('Comment Mode could not save to localStorage:', error);
      setStatus('Storage is full or unavailable. Export JSON now; new edits may only live in this tab.', true);
      return false;
    }
  }

  function createComment() {
    const body = elements.text.value.trim();
    if (!body) return;
    const now = new Date().toISOString();
    state.comments.unshift({
      id: makeId(),
      version: VERSION,
      type: TYPES.includes(elements.type.value) ? elements.type.value : 'note',
      body,
      resolved: false,
      target: state.target,
      createdAt: now,
      updatedAt: now
    });
    elements.text.value = '';
    saveComments();
    renderList();
  }

  function updateComment(id, patch) {
    state.comments = state.comments.map((comment) => {
      if (comment.id !== id) return comment;
      return Object.assign({}, comment, patch, { updatedAt: new Date().toISOString() });
    });
    saveComments();
    renderList();
  }

  function deleteComment(id) {
    state.comments = state.comments.filter((comment) => comment.id !== id);
    saveComments();
    renderList();
  }

  function exportComments() {
    const payload = {
      schema: 'brain-replay-comments/v1',
      version: VERSION,
      exportedAt: new Date().toISOString(),
      source: location.href,
      storageKey: STORAGE_KEY,
      agentHandoff: {
        prompt: 'Review unresolved confusion/question/todo comments. For each, suggest or implement a content/UI/code fix, then mark resolved only after verification.',
        repo: 'brain-state-circuit-replay'
      },
      comments: state.comments
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `brain-replay-comments-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    setStatus('Exported comments JSON for Hermes/Claude/Codex handoff.');
  }

  function importComments(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'));
        const incoming = Array.isArray(parsed) ? parsed : parsed.comments;
        if (!Array.isArray(incoming)) {
          setStatus('Import failed: JSON does not contain a comments array.', true);
          return;
        }
        mergeComments(incoming);
      } catch (error) {
        console.warn('Comment import failed:', error);
        setStatus('Import failed: invalid JSON file.', true);
        return;
      } finally {
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  }

  function mergeComments(incoming) {
    const byId = new Map(state.comments.map((comment) => [comment.id, comment]));
    incoming.map(normalizeComment).filter(Boolean).forEach((comment) => {
      const existing = byId.get(comment.id);
      if (!existing || String(comment.updatedAt) > String(existing.updatedAt)) {
        byId.set(comment.id, comment);
      }
    });
    state.comments = Array.from(byId.values()).sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
    saveComments();
    setStatus(`Imported ${incoming.length} comment item(s).`);
    renderList();
  }

  function setStatus(message, isError = false) {
    elements.status.textContent = message || '';
    elements.status.classList.toggle('error', Boolean(isError));
  }

  function renderList() {
    elements.list.textContent = '';
    const targetComments = state.comments.filter((comment) => comment.target && comment.target.id === state.target.id);
    const allCount = state.comments.length;

    const summary = document.createElement('p');
    summary.className = 'comments-summary';
    summary.textContent = `${targetComments.length} on this target - ${allCount} total`;
    elements.list.appendChild(summary);

    if (!targetComments.length) {
      const empty = document.createElement('p');
      empty.className = 'comments-empty';
      empty.textContent = 'No comments for this target yet.';
      elements.list.appendChild(empty);
      return;
    }

    targetComments.forEach((comment) => {
      const article = document.createElement('article');
      article.className = 'comment-item';
      article.classList.toggle('resolved', Boolean(comment.resolved));

      const meta = document.createElement('div');
      meta.className = 'comment-meta';
      const type = document.createElement('strong');
      type.textContent = comment.type;
      const date = document.createElement('time');
      date.dateTime = comment.updatedAt;
      date.textContent = formatDate(comment.updatedAt);
      meta.append(type, date);

      const body = document.createElement('p');
      body.textContent = comment.body;

      const actions = document.createElement('div');
      actions.className = 'comment-actions';
      const resolve = document.createElement('button');
      resolve.type = 'button';
      resolve.textContent = comment.resolved ? 'Reopen' : 'Resolve';
      resolve.addEventListener('click', () => updateComment(comment.id, { resolved: !comment.resolved }));
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = 'Delete';
      remove.addEventListener('click', () => deleteComment(comment.id));
      actions.append(resolve, remove);

      article.append(meta, body, actions);
      elements.list.appendChild(article);
    });
  }

  function setTarget(target) {
    state.target = normalizeTarget(target);
    elements.targetLabel.textContent = state.target.label;
    elements.targetMeta.textContent = state.target.kind;
    renderList();
  }

  function getCurrentTarget() {
    const panel = document.getElementById('sidePanel');
    const nodeId = panel?.dataset.currentNodeId;
    const nodeLabel = panel?.dataset.currentNodeLabel || document.getElementById('nodeTitle')?.textContent?.trim();
    if (nodeId) {
      return { kind: 'mindmap-node', id: nodeId, label: nodeLabel || nodeId, url: routeUrl() };
    }

    const journeyActive = document.querySelector('.journey-step[aria-current="step"]');
    if (journeyActive?.dataset.commentTargetId) {
      return {
        kind: 'journey-step',
        id: journeyActive.dataset.commentTargetId,
        label: journeyActive.dataset.commentTargetLabel || journeyActive.textContent.trim(),
        url: routeUrl()
      };
    }

    const hash = decodeURIComponent(location.hash || '');
    if (hash) {
      const section = document.getElementById(hash.slice(1));
      const heading = section?.querySelector('h1, h2, h3')?.textContent?.trim();
      return { kind: 'route-hash', id: `${location.pathname}${hash}`, label: heading || hash, url: routeUrl() };
    }

    const heading = document.querySelector('h1')?.textContent?.trim();
    return { kind: 'route', id: location.pathname || 'index.html', label: heading || document.title || 'Current page', url: routeUrl() };
  }

  function normalizeTarget(target) {
    const fallback = { kind: 'route', id: location.pathname || 'index.html', label: document.title || 'Current page', url: routeUrl() };
    const next = target || fallback;
    return {
      kind: String(next.kind || fallback.kind),
      id: String(next.id || fallback.id),
      label: String(next.label || next.id || fallback.label),
      url: String(next.url || routeUrl())
    };
  }

  function normalizeComment(comment) {
    if (!comment || typeof comment !== 'object') return null;
    const target = normalizeTarget(comment.target);
    const body = String(comment.body || comment.text || '').trim();
    if (!body) return null;
    const now = new Date().toISOString();
    return {
      id: String(comment.id || makeId()),
      version: VERSION,
      type: TYPES.includes(comment.type) ? comment.type : 'note',
      body,
      resolved: Boolean(comment.resolved),
      target,
      createdAt: String(comment.createdAt || comment.updatedAt || now),
      updatedAt: String(comment.updatedAt || comment.createdAt || now)
    };
  }

  function routeUrl() {
    return `${location.pathname}${location.hash || ''}`;
  }

  function makeId() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `comment-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'unknown date';
    return date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }
})();
