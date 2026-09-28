(function initReader() {
  // Renders docs/<name>.md in the browser, so the site always shows the current Markdown.
  const REPO = 'https://github.com/rola2005-klc/brain-state-circuit-replay';
  const DOCS = [
    ['unreturnable-present-paradox', 'The Unreturnable Present Paradox (thesis)'],
    ['limitations', 'Known limitations'],
    ['stimulation-coverage-precision', 'Stimulation coverage and precision'],
    ['native-memory-trace-reactivation', 'Native memory trace reactivation'],
    ['research', 'Research map'],
    ['future-research-directions', 'Future research directions'],
    ['data-model', 'Synthetic data model']
  ];
  const DEFAULT_DOC = DOCS[0][0];
  const known = new Map(DOCS);

  const article = document.getElementById('readerArticle');
  const toc = document.getElementById('readerToc');
  const docsNav = document.getElementById('readerDocs');
  const sourceLink = document.getElementById('sourceLink');
  const thesisTab = document.getElementById('thesisTab');
  const progress = document.getElementById('readProgress');
  if (!article) return;

  const requested = new URLSearchParams(window.location.search).get('doc');
  const name = known.has(requested) ? requested : DEFAULT_DOC;

  renderDocList();
  if (sourceLink) sourceLink.href = `${REPO}/blob/main/docs/${name}.md`;
  if (thesisTab && name !== DEFAULT_DOC) thesisTab.removeAttribute('aria-current');

  if (!window.marked) {
    fail();
    return;
  }

  fetch(`docs/${name}.md`, { cache: 'no-cache' })
    .then((response) => (response.ok ? response.text() : Promise.reject(new Error(String(response.status)))))
    .then(render)
    .catch(fail);

  initProgress();

  function renderDocList() {
    if (!docsNav) return;
    DOCS.forEach(([id, label]) => {
      const link = document.createElement('a');
      link.href = id === DEFAULT_DOC ? 'read.html' : `read.html?doc=${id}`;
      link.textContent = label;
      if (id === name) link.setAttribute('aria-current', 'page');
      docsNav.appendChild(link);
    });
  }

  function render(markdown) {
    article.innerHTML = window.marked.parse(markdown, { gfm: true });
    rewriteLinks();
    rewriteImages();
    wrapTables();
    const headings = identifyHeadings();
    buildToc(headings);

    const title = article.querySelector('h1');
    if (title) document.title = `${title.textContent.trim()} — Brain-State Circuit Resonance`;

    const source = document.createElement('p');
    source.className = 'reader-source';
    source.innerHTML = `Rendered live from <a href="${REPO}/blob/main/docs/${name}.md"><code>docs/${name}.md</code></a> — edits to the Markdown appear here automatically.`;
    article.appendChild(source);

    if (window.location.hash) {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (target) target.scrollIntoView();
    }
    document.dispatchEvent(new CustomEvent('site:contentchange'));
  }

  // Resolve a Markdown-relative link (relative to docs/) into a site or GitHub URL.
  function resolve(href) {
    if (!href || /^(https?:|mailto:|tel:|#)/i.test(href)) return href;
    const [pathPart, hash = ''] = href.split('#');
    const segments = ['docs'];
    pathPart.split('/').forEach((segment) => {
      if (!segment || segment === '.') return;
      if (segment === '..') segments.pop();
      else segments.push(segment);
    });
    const path = segments.join('/');
    const fragment = hash ? `#${hash}` : '';
    const docMatch = /^docs\/([a-z0-9-]+)\.md$/i.exec(path);
    if (docMatch && known.has(docMatch[1])) {
      return (docMatch[1] === DEFAULT_DOC ? 'read.html' : `read.html?doc=${docMatch[1]}`) + fragment;
    }
    if (/\.(html|png|jpe?g|svg|csv)$/i.test(path)) return path + fragment;
    return `${REPO}/blob/main/${path}${fragment}`;
  }

  function rewriteLinks() {
    article.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      const resolved = resolve(href);
      link.setAttribute('href', resolved);
      if (/^https?:/i.test(resolved) && !resolved.startsWith(window.location.origin)) {
        link.setAttribute('rel', 'noopener');
      }
    });
  }

  function rewriteImages() {
    article.querySelectorAll('img[src]').forEach((img) => {
      img.setAttribute('src', resolve(img.getAttribute('src')));
      img.loading = 'lazy';
      img.decoding = 'async';
      const figure = document.createElement('figure');
      img.replaceWith(figure);
      figure.appendChild(img);
      if (img.alt) {
        const caption = document.createElement('figcaption');
        caption.textContent = img.alt;
        figure.appendChild(caption);
      }
      // Markdown wraps images in <p>; a figure inside a paragraph is invalid, so unwrap.
      const parent = figure.parentElement;
      if (parent && parent.tagName === 'P' && parent.childNodes.length === 1) parent.replaceWith(figure);
    });
  }

  function wrapTables() {
    article.querySelectorAll('table').forEach((table) => {
      const wrap = document.createElement('div');
      wrap.className = 'table-wrap';
      wrap.tabIndex = 0;
      wrap.setAttribute('role', 'region');
      wrap.setAttribute('aria-label', 'Table');
      table.replaceWith(wrap);
      wrap.appendChild(table);
    });
  }

  function slug(text, used) {
    let base = text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 60) || 'section';
    let id = base;
    let n = 2;
    while (used.has(id) || document.getElementById(id)) id = `${base}-${n++}`;
    used.add(id);
    return id;
  }

  function identifyHeadings() {
    const used = new Set();
    return Array.from(article.querySelectorAll('h2, h3')).map((heading) => {
      heading.id = heading.id || slug(heading.textContent, used);
      return heading;
    });
  }

  function buildToc(headings) {
    if (!toc) return;
    toc.textContent = '';
    headings.forEach((heading) => {
      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      if (heading.tagName === 'H3') link.className = 'toc-sub';
      toc.appendChild(link);
    });
  }

  function fail() {
    article.innerHTML = '';
    const message = document.createElement('p');
    message.className = 'reader-status';
    message.innerHTML = `This document could not be loaded here. Read it <a href="${REPO}/blob/main/docs/${name}.md">on GitHub</a> instead.`;
    article.appendChild(message);
  }

  function initProgress() {
    if (!progress) return;
    let frame = 0;
    function update() {
      frame = 0;
      const rect = article.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight * 0.6);
      const done = Math.min(1, Math.max(0, -rect.top / total));
      progress.style.transform = `scaleX(${done.toFixed(4)})`;
    }
    window.addEventListener('scroll', () => {
      if (!frame) frame = requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
})();
