(function initSite() {
  initMenu();
  initScrollSpy();

  function initMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.getElementById('siteNav');
    if (!toggle || !nav) return;

    function setOpen(isOpen) {
      toggle.setAttribute('aria-expanded', String(isOpen));
      nav.classList.toggle('is-open', isOpen);
    }

    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // Highlights the in-page link whose section is currently being read. Links are looked
  // up on every update, so tables of contents rendered later (read.html) work too.
  function initScrollSpy() {
    let frame = 0;

    function entries() {
      return Array.from(document.querySelectorAll('[data-scrollspy] a[href^="#"]'))
        .map((link) => ({ link, target: document.getElementById(decodeURIComponent(link.hash.slice(1))) }))
        .filter((entry) => entry.target);
    }

    function update() {
      frame = 0;
      const list = entries();
      if (!list.length) return;
      const line = window.innerHeight * 0.3;
      let active = null;
      list.forEach((entry) => {
        if (entry.target.getBoundingClientRect().top <= line) active = entry;
      });
      // At the very bottom, the last section wins even if its top never reaches the line.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        active = list[list.length - 1];
      }
      list.forEach((entry) => {
        const isActive = entry === active;
        entry.link.classList.toggle('is-active', isActive);
        if (isActive) entry.link.setAttribute('aria-current', 'location');
        else entry.link.removeAttribute('aria-current');
      });
    }

    window.addEventListener('scroll', () => {
      if (!frame) frame = requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener('resize', update);
    document.addEventListener('site:contentchange', update);
    update();
  }
})();
