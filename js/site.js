/* ==========================================================
   site.js: builds the shared parts of every page from the lists
   in js/site-data.js:
     - top bar with Projects / Experience dropdowns + phone menu
     - footer
     - home-page card grids   (<div data-card-section="work">)
     - "More work" row        (<section id="more-work">)
   It also swaps any image that fails to load for a
   "Photo coming soon" placeholder.

   You shouldn't need to edit this file to add a page. Edit
   js/site-data.js instead.
   ========================================================== */

(function () {
  'use strict';

  // Site root, worked out from where this script lives (…/js/site.js → …/),
  // so the same links work from index.html and from pages/*.html.
  const ROOT = new URL('../', document.currentScript.src).href;

  // Slug of the page being viewed: "index" on the home page.
  const CURRENT = location.pathname.split('/').pop().replace(/\.html$/, '') || 'index';

  const MENUS = [
    { key: 'projects', label: 'Projects' },
    { key: 'experience', label: 'Experience' }
  ];

  // Sub-headings inside a dropdown when it lists more than one section.
  const SECTION_LABELS = { work: 'Projects & Experience', leadership: 'Leadership', hobbies: 'Hobbies' };

  const CHEVRON = '<svg class="nav__chevron" viewBox="0 0 12 12" aria-hidden="true">' +
    '<path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  const pageUrl = (page) => ROOT + 'pages/' + page.slug + '.html';
  const current = (isCurrent) => (isCurrent ? ' aria-current="page"' : '');


  /* ── Top bar ─────────────────────────────────────────── */

  function menuItems(key) {
    let html = '';
    let lastSection = 'work';
    SITE_PAGES.filter((p) => p.menu === key).forEach((p) => {
      if (p.section !== lastSection) {
        html += '<li class="nav__group-label" role="presentation">' + SECTION_LABELS[p.section] + '</li>';
        lastSection = p.section;
      }
      const role = p.role ? '<span class="nav__role">' + esc(p.role) + '</span>' : '';
      html += '<li><a href="' + pageUrl(p) + '"' + current(p.slug === CURRENT) + '>' + esc(p.title) + role + '</a></li>';
    });
    return html;
  }

  function dropdown(menu) {
    const id = 'menu-' + menu.key;
    const active = SITE_PAGES.some((p) => p.menu === menu.key && p.slug === CURRENT);
    return '<li class="nav__dropdown">' +
      '<button class="nav__button' + (active ? ' is-active' : '') + '" type="button" ' +
      'aria-expanded="false" aria-controls="' + id + '">' + menu.label + CHEVRON + '</button>' +
      '<ul class="nav__menu" id="' + id + '">' + menuItems(menu.key) + '</ul>' +
      '</li>';
  }

  function renderHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    header.className = 'topbar';
    header.innerHTML =
      '<div class="container topbar__inner">' +
        '<a class="topbar__brand" href="' + ROOT + 'index.html">Pia Swarup</a>' +
        '<button class="topbar__toggle" type="button" aria-expanded="false" ' +
          'aria-controls="site-nav" aria-label="Open menu"><span></span><span></span><span></span></button>' +
        '<nav class="topbar__nav" id="site-nav" aria-label="Main">' +
          '<ul class="nav">' +
            '<li><a class="nav__link" href="' + ROOT + 'index.html"' + current(CURRENT === 'index') + '>Home</a></li>' +
            MENUS.map(dropdown).join('') +
            '<li><a class="nav__link" href="' + ROOT + SITE_CONTACT.resume + '" target="_blank" rel="noopener">Resume</a></li>' +
          '</ul>' +
        '</nav>' +
      '</div>';

    setupNav(header);
  }

  function setupNav(header) {
    const toggle = header.querySelector('.topbar__toggle');
    const dropdowns = Array.from(header.querySelectorAll('.nav__dropdown'));
    // Desktop with a mouse: dropdowns open on hover. Otherwise: on tap/click.
    const hoverMenus = window.matchMedia('(hover: hover) and (min-width: 861px)');

    function setOpen(item, open) {
      item.classList.toggle('is-open', open);
      item.querySelector('.nav__button').setAttribute('aria-expanded', String(open));
    }
    function closeAll(except) {
      dropdowns.forEach((item) => { if (item !== except) setOpen(item, false); });
    }
    function setPhoneMenu(open) {
      header.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    toggle.addEventListener('click', () => setPhoneMenu(!header.classList.contains('is-open')));

    dropdowns.forEach((item) => {
      const button = item.querySelector('.nav__button');

      button.addEventListener('click', (e) => {
        // A mouse click on desktop lands on a menu hover already opened, so keep it open.
        // Keyboard (e.detail === 0) and touch toggle as usual.
        const keepOpen = hoverMenus.matches && e.detail > 0;
        const open = keepOpen || !item.classList.contains('is-open');
        closeAll(item);
        setOpen(item, open);
      });
      item.addEventListener('mouseenter', () => {
        if (hoverMenus.matches) { closeAll(item); setOpen(item, true); }
      });
      item.addEventListener('mouseleave', () => {
        if (hoverMenus.matches) setOpen(item, false);
      });
    });

    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) { closeAll(); setPhoneMenu(false); }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const open = dropdowns.find((item) => item.classList.contains('is-open'));
      if (open) {
        setOpen(open, false);
        open.querySelector('.nav__button').focus();
      } else if (header.classList.contains('is-open')) {
        setPhoneMenu(false);
        toggle.focus();
      }
    });
  }


  /* ── Footer ──────────────────────────────────────────── */

  function renderFooter() {
    const footer = document.getElementById('site-footer');
    if (!footer) return;

    const c = SITE_CONTACT;
    const social = (label, url) =>
      '<li><a href="' + url + '" target="_blank" rel="noopener">' + label + '</a></li>';

    footer.className = 'site-footer';
    footer.innerHTML =
      '<div class="container footer__inner">' +
        '<section>' +
          '<h2 class="footer__heading">Get in touch</h2>' +
          '<p>Would love to chat, just reach out :)</p>' +
          '<p class="footer__email">' + esc(c.email) + '</p>' +
        '</section>' +
        '<section>' +
          '<h2 class="footer__heading">Follow</h2>' +
          '<ul class="footer__links">' +
            social('LinkedIn', c.linkedin) +
            social('GitHub', c.github) +
          '</ul>' +
        '</section>' +
      '</div>' +
      '<div class="container"><p class="footer__copy">&copy; Pia Swarup</p></div>';
  }


  /* ── Cards ───────────────────────────────────────────── */

  // Picture-only card; the title and blurb sit in an overlay shown on hover.
  // A page without a photo yet shows its title on a light box instead.
  function cardHtml(page) {
    const media = page.thumb
      ? '<img class="card__media" src="' + ROOT + page.thumb + '" alt="' + esc(page.thumbAlt || page.title) + '" loading="lazy">'
      : '<div class="card__media placeholder card__placeholder" aria-hidden="true">' + esc(page.title) + '</div>';

    return '<a class="card' + (page.thumb ? '' : ' card--no-photo') + '" href="' + pageUrl(page) + '">' +
      media +
      '<div class="card__overlay">' +
        '<h3 class="card__title">' + esc(page.title) + '</h3>' +
        (page.role ? '<p class="card__role">' + esc(page.role) + '</p>' : '') +
        '<p class="card__blurb">' + esc(page.blurb) + '</p>' +
      '</div>' +
    '</a>';
  }

  // Home page: <div class="card-grid" data-card-section="work"></div>
  function renderGrids() {
    document.querySelectorAll('[data-card-section]').forEach((grid) => {
      grid.innerHTML = SITE_PAGES
        .filter((p) => p.section === grid.dataset.cardSection)
        .map(cardHtml)
        .join('');
    });
  }

  // Detail pages: <section id="more-work"></section> → the next 3 pages in the list.
  function renderMoreWork() {
    const box = document.getElementById('more-work');
    if (!box) return;

    const start = SITE_PAGES.findIndex((p) => p.slug === CURRENT);
    const next = [];
    for (let i = 1; next.length < 3 && i <= SITE_PAGES.length; i++) {
      const p = SITE_PAGES[(start + i) % SITE_PAGES.length];
      if (p.slug !== CURRENT) next.push(p);
    }

    box.classList.add('more-work');
    box.innerHTML =
      '<h2 class="more-work__title">More work</h2>' +
      '<div class="card-grid">' + next.map(cardHtml).join('') + '</div>';
  }


  /* ── Missing images → placeholders ───────────────────── */

  // Lets a page point at a photo that doesn't exist yet
  // (e.g. ../assets/images/rover/hero.jpg): until the file is
  // added, a "Photo coming soon" box is shown in its place.
  function toPlaceholder(img) {
    const box = document.createElement('div');
    box.className = (img.className + ' placeholder').trim();
    box.setAttribute('role', 'img');
    box.setAttribute('aria-label', img.alt || 'Photo coming soon');
    box.textContent = 'Photo coming soon';
    img.replaceWith(box);
  }

  function usePlaceholdersForMissingImages() {
    document.querySelectorAll('main img').forEach((img) => {
      if (!img.getAttribute('src')) toPlaceholder(img);
      else if (img.complete) { if (!img.naturalWidth) toPlaceholder(img); }
      else img.addEventListener('error', () => toPlaceholder(img), { once: true });
    });
  }


  renderHeader();
  renderFooter();
  renderGrids();
  renderMoreWork();
  usePlaceholdersForMissingImages();
})();
