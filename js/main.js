// ============================================================
// Main entry point — loads content.json + theme.json at runtime
// ============================================================

import { HorizontalScroller } from './scroll.js';
import { AnimationObserver  } from './animations.js';
import { createModel         } from './three-setup.js';
import {
  renderHero, renderNav, renderExperience,
  renderProjects, renderLeadership,
  renderHobbies, renderContact,
} from './renderer.js';

// ── Load a JSON file, return null on failure ──────────────────
async function loadJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Could not load ${path}:`, err.message);
    return null;
  }
}

// ── Apply theme.json values to CSS custom properties ──────────
function applyTheme(theme) {
  if (!theme) return;
  const root = document.documentElement;

  const set = (prop, val) => val && root.style.setProperty(prop, val);

  const c = theme.colors || {};
  set('--bg',                  c.background);
  set('--bg-darker',           c.backgroundDarker);
  set('--text-primary',        c.textPrimary);
  set('--text-secondary',      c.textSecondary);
  set('--text-muted',          c.textMuted);
  set('--bg-card',             c.cardBackground);
  set('--bg-card-hover',       c.cardBackgroundHover);
  set('--border',              c.border);
  set('--border-hover',        c.borderHover);

  const t = theme.typography || {};
  if (t.fontFamily)   set('--font',            t.fontFamily);
  if (t.baseFontSize) document.documentElement.style.fontSize = t.baseFontSize;

  const s = theme.sections || {};
  set('--w-hero',       s.hero);
  set('--w-nav',        s.nav);
  set('--w-experience', s.experience);
  set('--w-projects',   s.projects);
  set('--w-leadership', s.leadership);
  set('--w-hobbies',    s.hobbies);
  set('--w-contact',    s.contact);

  const sp = theme.spacing || {};
  set('--padding-section',  sp.sectionPadding);
  set('--portrait-height',  sp.portraitHeight);
}

// ── Build the list of snap points (sections + sub-entries) ─────
function collectSnapPoints() {
  const points = new Set();
  document.querySelectorAll('.section').forEach(section => {
    const sectionX = section.offsetLeft;
    points.add(sectionX);
    section.querySelectorAll('.exp-entry, .proj-card, .lead-entry').forEach(entry => {
      points.add(sectionX + entry.offsetLeft);
    });
  });
  return [...points].sort((a, b) => a - b);
}

// ── Section label helper (labels come from content.json > navigation) ────
const NAV_KEYS = ['hero', 'nav', 'experience', 'projects', 'leadership', 'hobbies', 'contact'];

function buildSectionMap(navLabels) {
  return NAV_KEYS.map(key => ({
    id:    `section-${key}`,
    label: navLabels?.[key] || key,
  }));
}

function getCurrentSection(scrollX, sectionMap) {
  for (let i = sectionMap.length - 1; i >= 0; i--) {
    const el = document.getElementById(sectionMap[i].id);
    if (el && el.offsetLeft <= scrollX + window.innerWidth * 0.5) {
      return sectionMap[i].label;
    }
  }
  return sectionMap[0].label;
}

// ── Entry point ───────────────────────────────────────────────
async function init() {
  // Fetch both files in parallel
  const [content, theme] = await Promise.all([
    loadJSON('./content.json'),
    loadJSON('./theme.json'),
  ]);

  // Apply visual theme before rendering so CSS vars are set
  applyTheme(theme);

  // Extract data with safe fallbacks in case content.json is missing
  const personal   = content?.personal    || {};
  const contact    = content?.contact     || {};
  const experience = content?.experience  || [];
  const projects   = content?.projects    || [];
  const leadership = content?.leadership  || [];
  const hobbies    = content?.hobbies     || [];
  const sectionMap = buildSectionMap(content?.navigation);

  // Render all sections
  renderHero(document.getElementById('section-hero'), personal);
  renderNav(document.getElementById('section-nav'));
  renderExperience(document.getElementById('section-experience'), experience);
  renderProjects(document.getElementById('section-projects'), projects);
  renderLeadership(document.getElementById('section-leadership'), leadership);
  renderHobbies(document.getElementById('section-hobbies'), hobbies);
  renderContact(document.getElementById('section-contact'), personal, contact);

  // ── Animation observer ──────────────────────────────────────
  const anim = new AnimationObserver();
  document.querySelectorAll('[data-reveal]').forEach(el => anim.observe(el));

  // ── Scroller (scroll config comes from theme.json) ───────────
  const scrollConfig = theme?.scroll || {};
  const track      = document.getElementById('scroll-track');
  const progressFill = document.getElementById('progress-fill');
  const sectionNav   = document.getElementById('section-label');

  // Build nav items from sectionMap
  sectionMap.forEach(({ id, label }) => {
    const btn = document.createElement('button');
    btn.className = 'section-nav-item';
    btn.dataset.sectionId = id;
    btn.textContent = label;
    sectionNav.appendChild(btn);
  });

  const navItems = sectionNav.querySelectorAll('.section-nav-item');

  function updateActiveNav(scrollX) {
    const activeLabel = getCurrentSection(scrollX, sectionMap);
    navItems.forEach(btn => {
      const label = sectionMap.find(s => s.id === btn.dataset.sectionId)?.label;
      btn.classList.toggle('active', label === activeLabel);
    });
  }

  const scroller = new HorizontalScroller(track, (progress, scrollX) => {
    progressFill.style.width = `${progress * 100}%`;
    updateActiveNav(scrollX);
    anim.tick(scrollX);
  }, scrollConfig);

  // Nav item click → scroll to section
  navItems.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.sectionId);
      if (target) scroller.scrollToEl(target);
    });
  });

  // Register snap points after layout
  requestAnimationFrame(() => {
    scroller.setSnapPoints(collectSnapPoints());
    anim.tick(0);
  });

  window.addEventListener('resize', () => {
    scroller.setSnapPoints(collectSnapPoints());
  });

  // ── 3D Models ────────────────────────────────────────────────
  setTimeout(() => {
    document.querySelectorAll('canvas[data-model]').forEach(canvas => {
      createModel(canvas, canvas.getAttribute('data-model') || 'icosahedron', scroller);
    });
  }, 80);

  // ── Nav card clicks ──────────────────────────────────────────
  document.querySelectorAll('.nav-card[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (target) scroller.scrollToEl(target);
    });
  });

  // ── Scroll hint ──────────────────────────────────────────────
  const scrollHint = document.getElementById('scroll-hint');
  let hintHidden = false;
  const hideHint = () => {
    if (hintHidden) return;
    hintHidden = true;
    scrollHint.classList.add('hidden');
  };
  window.addEventListener('wheel',     hideHint, { once: true });
  window.addEventListener('touchmove', hideHint, { once: true });

  // ── Keyboard focus scrolling ─────────────────────────────────
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('focus', () => {
      const rect = el.getBoundingClientRect();
      if (rect.right > window.innerWidth || rect.left < 0) {
        scroller.scrollTo(el.closest('.section')?.offsetLeft ?? 0);
      }
    });
  });
}

init();
