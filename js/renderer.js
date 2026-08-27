// ============================================================
// HTML Renderer — builds all sections from data passed in at runtime.
// Content comes from content.json (loaded in main.js), not imported here.
// ============================================================

// ── Icons (inline SVG, no external dependency) ───────────────

const icons = {
  arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  user:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  image:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  github:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77A5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`,
  linkedin:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
  instagram:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  fileText:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  mail:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  // hobby icons
  camera:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  map:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
  music:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  book:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  activity:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  code:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  compass:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
};

function icon(name) {
  return icons[name] || icons.image;
}

function tags(arr, cls = 'tag') {
  return arr.map(t => `<span class="${cls}">${t}</span>`).join('');
}

function imgOrPlaceholder(src, label = 'Add your image') {
  if (src) {
    return `<img src="${src}" alt="${label}" loading="lazy">`;
  }
  return `
    <div class="img-placeholder">
      ${icon('image')}
      <span>${label}</span>
    </div>`;
}

// ── HERO ─────────────────────────────────────────────────────

export function renderHero(el, personal) {
  el.innerHTML = `
    <div class="hero-inner">
      <div class="hero-left">
        <p class="hero-eyebrow" data-reveal="up" data-delay="1">Portfolio</p>
        <h1 class="hero-name" data-reveal="up" data-delay="2">${personal.name}</h1>
        <p class="hero-major"  data-reveal="up" data-delay="3">${personal.major}</p>
        <p class="hero-college" data-reveal="up" data-delay="4">${personal.college}</p>
        <div class="hero-interests" data-reveal="up" data-delay="5">
          ${(personal.interests || []).map(i => `<span class="interest-tag">${i}</span>`).join('')}
        </div>
      </div>
      <div class="hero-right">
        <div class="hero-portrait-wrap">
          ${personal.portrait
            ? `<img class="hero-portrait" src="${personal.portrait}" alt="${personal.name}">`
            : `<div class="hero-portrait-placeholder">
                 <div class="hero-portrait-placeholder-icon">${icon('user')}</div>
                 <p>Add your portrait image path in content.json</p>
               </div>`
          }
          <div class="hero-portrait-overlay"></div>
        </div>
      </div>
    </div>`;
}

// ── NAV ──────────────────────────────────────────────────────

const navItems = [
  { num: '01', label: 'Experience',                  id: 'section-experience' },
  { num: '02', label: 'Projects',                    id: 'section-projects' },
  { num: '03', label: 'Entrepreneurship\n& Leadership', id: 'section-leadership' },
  { num: '04', label: 'Hobbies\n& Other',            id: 'section-hobbies' },
];

export function renderNav(el) {
  el.innerHTML = `
    <div class="nav-inner">
      ${navItems.map((item, i) => `
        <button
          class="nav-card"
          data-target="${item.id}"
          data-reveal="up"
          data-delay="${i + 1}"
          aria-label="Jump to ${item.label.replace('\n', ' ')}"
        >
          <span class="nav-card-number">${item.num}</span>
          <span class="nav-card-title">${item.label.replace('\n', '<br>')}</span>
          <span class="nav-card-arrow">${icon('arrowRight')}</span>
        </button>`).join('')}
    </div>`;
}

// ── EXPERIENCE ───────────────────────────────────────────────

export function renderExperience(el, experience) {
  el.innerHTML = `
    <div class="section-header">
      <span class="section-eyebrow">Experience</span>
      <div class="section-title-line"></div>
    </div>
    <div class="exp-inner">
      ${experience.map((job, i) => `
        <article class="exp-entry" id="exp-${job.id}">
          <div class="exp-text">
            <h2 class="exp-company" data-reveal="up" data-delay="1">${job.company}</h2>
            <p  class="exp-position" data-reveal="up" data-delay="2">${job.position}</p>
            <p  class="exp-meta"     data-reveal="up" data-delay="2">${job.dates} &nbsp;·&nbsp; ${job.location}</p>
            <p  class="exp-description" data-reveal="up" data-delay="3">${job.description}</p>
            <ul class="exp-responsibilities" data-reveal="up" data-delay="4">
              ${job.responsibilities.map(r => `<li>${r}</li>`).join('')}
            </ul>
            <div class="exp-tags" data-reveal="up" data-delay="5">
              ${tags(job.technologies)}
            </div>
          </div>
          <div class="exp-visual" data-reveal="scale" data-delay="2">
            ${job.visual.type === 'model'
              ? `<div class="exp-canvas-wrap">
                   <canvas data-model="${job.visual.modelShape}" ${job.visual.modelPath ? `data-model-path="${job.visual.modelPath}"` : ''} aria-label="Interactive 3D model"></canvas>
                 </div>
                 <p class="visual-caption"><em>Interactive model</em> — ${job.visual.caption}</p>`
              : job.visual.type === 'image' && job.visual.image
                ? `<div class="exp-image-wrap">${imgOrPlaceholder(job.visual.image, job.visual.caption)}</div>
                   <p class="visual-caption">${job.visual.caption}</p>`
                : `<div class="exp-image-wrap">${imgOrPlaceholder(null, job.visual.caption)}</div>
                   <p class="visual-caption">${job.visual.caption}</p>`
            }
          </div>
        </article>`).join('')}
    </div>`;
}

// ── PROJECTS ─────────────────────────────────────────────────

export function renderProjects(el, projects) {
  el.innerHTML = `
    <div class="section-header">
      <span class="section-eyebrow">Projects</span>
      <div class="section-title-line"></div>
    </div>
    <div class="projects-inner">
      ${projects.map((proj, i) => `
        <article class="proj-card" id="${proj.id}">
          <div class="proj-visual" data-reveal="scale" data-delay="1">
            ${proj.visual.type === 'model'
              ? `<div class="proj-canvas-wrap">
                   <canvas data-model="${proj.visual.modelShape}" ${proj.visual.modelPath ? `data-model-path="${proj.visual.modelPath}"` : ''} aria-label="Interactive 3D model"></canvas>
                 </div>`
              : `<div class="proj-image-wrap">${imgOrPlaceholder(proj.visual.image, proj.name)}</div>`
            }
          </div>
          <div class="proj-text">
            <p class="proj-number" data-reveal="up" data-delay="1">Project ${String(i + 1).padStart(2, '0')}</p>
            <h2 class="proj-name" data-reveal="up" data-delay="2">${proj.name}</h2>
            <p class="proj-tagline" data-reveal="up" data-delay="2">${proj.tagline}</p>
            <p class="proj-role-line" data-reveal="up" data-delay="3">${proj.role} &nbsp;·&nbsp; ${proj.dates}</p>
            <p class="proj-description" data-reveal="up" data-delay="3">${proj.description}</p>
            <ul class="proj-achievements" data-reveal="up" data-delay="4">
              ${proj.achievements.map(a => `<li>${a}</li>`).join('')}
            </ul>
            <div class="proj-footer" data-reveal="up" data-delay="5">
              <div class="proj-tags">${tags(proj.technologies)}</div>
              ${proj.githubUrl
                ? `<a class="proj-link" href="${proj.githubUrl}" target="_blank" rel="noopener">
                     ${icon('github')} GitHub
                   </a>`
                : ''}
            </div>
          </div>
        </article>`).join('')}
    </div>`;
}

// ── LEADERSHIP ───────────────────────────────────────────────

export function renderLeadership(el, leadership) {
  el.innerHTML = `
    <div class="section-header">
      <span class="section-eyebrow">Entrepreneurship &amp; Leadership</span>
      <div class="section-title-line"></div>
    </div>
    <div class="leadership-inner">
      ${leadership.map((item, i) => `
        <article class="lead-entry" id="${item.id}">
          <div class="lead-text">
            <h2 class="lead-org"      data-reveal="up" data-delay="1">${item.organization}</h2>
            <p  class="lead-position" data-reveal="up" data-delay="2">${item.position}</p>
            <p  class="lead-dates"    data-reveal="up" data-delay="2">${item.dates}</p>
            <p  class="lead-description" data-reveal="up" data-delay="3">${item.description}</p>
            <ul class="lead-impact"   data-reveal="up" data-delay="4">
              ${item.impact.map(imp => `<li>${imp}</li>`).join('')}
            </ul>
            <div class="exp-tags"     data-reveal="up" data-delay="5">
              ${tags(item.skills)}
            </div>
          </div>
          <div class="lead-visual"   data-reveal="scale" data-delay="2">
            <div class="lead-image-wrap">
              ${imgOrPlaceholder(item.image, item.organization)}
            </div>
          </div>
        </article>`).join('')}
    </div>`;
}

// ── HOBBIES ──────────────────────────────────────────────────

export function renderHobbies(el, hobbies) {
  el.innerHTML = `
    <div class="section-header">
      <span class="section-eyebrow">Hobbies &amp; Other</span>
      <div class="section-title-line"></div>
    </div>
    <div class="hobbies-inner">
      ${hobbies.map((hobby, i) => `
        <div class="hobby-card" data-reveal="up" data-delay="${i + 1}">
          <div class="hobby-icon">${icon(hobby.icon)}</div>
          <div class="hobby-image-wrap">
            ${imgOrPlaceholder(hobby.image, hobby.title)}
          </div>
          <h3 class="hobby-title">${hobby.title}</h3>
          <p class="hobby-description">${hobby.description}</p>
        </div>`).join('')}
    </div>`;
}

// ── CONTACT ──────────────────────────────────────────────────

export function renderContact(el, personal, contact) {
  const links = [
    contact.linkedin  && { label: 'LinkedIn',  href: contact.linkedin,  ico: 'linkedin'  },
    contact.github    && { label: 'GitHub',     href: contact.github,    ico: 'github'    },
    contact.instagram && { label: 'Instagram',  href: contact.instagram, ico: 'instagram' },
    contact.resume    && { label: 'Resume',     href: contact.resume,    ico: 'fileText'  },
  ].filter(Boolean);

  el.innerHTML = `
    <div class="contact-inner">
      <p class="contact-closing" data-reveal="up" data-delay="1">${personal.closingMessage}</p>
      <p class="contact-email-label" data-reveal="up" data-delay="2">Email</p>
      <a class="contact-email" href="mailto:${contact.email}" data-reveal="up" data-delay="2">
        ${contact.email}
      </a>
      <div class="contact-links" data-reveal="up" data-delay="3">
        ${links.map(l => `
          <a class="contact-link" href="${l.href}" target="_blank" rel="noopener">
            ${icon(l.ico)} ${l.label}
          </a>`).join('')}
      </div>
    </div>
    <span class="contact-end-marker">End of portfolio</span>`;
}
