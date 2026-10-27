# Pia Swarup — Portfolio Redesign Spec

This file is the brief for rebuilding this portfolio. Claude Code: read all of it before any step.

## Working rules (important)

- **Never run git commands that change anything** (no commit, push, merge, reset, checkout, stash). Pia does all git herself. Read-only commands like `git status` / `git diff` are fine.
- **Work one build step at a time** (see "Build plan"). Only do the step Pia asks for, then stop.
- At the end of each step, give: (1) the list of files created/changed/deleted, (2) what Pia should check in the browser (Live Server), (3) a suggested commit message.
- **Never invent facts, numbers, dates or claims.** Use only what is in `content.json` or this file. Where something is missing, write a visible placeholder in square brackets saying exactly what to add, e.g. `[TODO: add 1–2 sentences on how you tuned the PID gains]`.
- Do not delete the old site files (`js/`, `theme.json`, `content.json`, `assets/models/`) until Step 6. `content.json` is the source of truth for all text until then.

## Goal

Replace the old horizontal-scroll, Three.js site with a plain, fast, conventional portfolio that looks essentially like the HTML5 UP "Phantom" template used on rjansens.com, coded from scratch (do not copy the template's files or Rowan's content):
- Home page: name, portrait, a bio paragraph, then a grid of image cards. Each card = thumbnail, bold title, one-line description; the whole card is a link.
- One page per card, with a hero image at the top and a write-up below with images inline.
- Normal vertical scrolling. Minimal animation (a subtle hover on cards is fine; nothing else).
- Audience: recruiters and engineers skimming quickly.

## Constraints

- Static HTML + CSS + a little vanilla JS. **No build step, no frameworks, no npm.** Must work on GitHub Pages and with VS Code Live Server.
- Hosted at `https://piaswarup.github.io/portfolio/` (a sub-path), so **all links and asset paths must be relative** (`css/style.css`, `../assets/...`) — never start a path with `/`.
- Must look good on phones (single-column grid, collapsible menu) as well as desktop.
- Adding a new project must be easy: copy one template page + add one entry to one list.

## Design

- White background, clean, lots of whitespace, Phantom-like.
- Font: **Inter** from Google Fonts (weights 400/500/600/700), fallback `'Helvetica Neue', Arial, sans-serif`. (Old site's font.)
- Colors from the old site, adapted to a white background:
  - Accent / headings / links: navy `#253a7a` (darker hover `#1a2d63`)
  - Body text: near-black `#1f2433`; secondary text: `#5c6b8a`
  - Light tint for tags / placeholders: `#eef2fa`; borders: `#e3e7f0`
- Define all colors, font, spacing, and radius as CSS custom properties at the top of `css/style.css` so they can be tuned in one place.
- Cards: image fills the top of the card (aspect ratio 4:3, `object-fit: cover`), title bold, one-line description below, a small tag (e.g. "Internship", "Project", "Leadership"). 3 columns desktop → 2 tablet → 1 phone.
- **Image placeholders**: many items have no photo yet. Use a light-tint box at the same aspect ratio with centered text "Photo coming soon" (CSS class `.placeholder`). Swapping in a real photo must only mean changing one image path.

## Navigation

- Fixed top bar on every page: "Pia Swarup" (links home) on the left; on the right: **Home**, **Projects** (dropdown listing every project page), **Experience** (dropdown listing every internship page), **Resume** (opens `assets/files/resume.pdf` in a new tab). Any page reachable in one click from anywhere.
- On phones the menu collapses into a hamburger button.
- Footer on every page: email shown as text `pswarup(at)olin(dot)edu` (keep this obfuscated format — not a mailto link), plus LinkedIn, GitHub, Instagram links, and the line "Would love to chat, just reach out :)". Small "© Pia Swarup" line.
- Bottom of each detail page: a "More work" row with 3 cards to other pages (like rjansens' "NEXT").

## File structure (target)

```
index.html                 home page
css/style.css              all styles
js/site-data.js            ONE list of every card (see below) — the only list to edit when adding a page
js/site.js                 builds the top bar, dropdowns, footer, home-page grids and "More work" rows from site-data.js
pages/<slug>.html          one plain HTML file per card (write-up is hand-editable HTML)
pages/_template.html       blank page to copy when adding a new project
assets/images/<slug>/      images per page (hero.jpg, 01.jpg, 02.jpg, ...)
assets/files/resume.pdf
README.md                  short "how to add a project" instructions for Pia
```

- `js/site-data.js` defines a plain global array (not fetched JSON, so it also works when opening files directly), e.g.
  `{ slug, title, blurb, tag, section: "work" | "leadership" | "hobbies", thumb, menu: "projects" | "experience" | null }`.
- The write-up text lives directly in each `pages/<slug>.html` as normal HTML, so Pia edits text there. Header/footer are injected by `js/site.js` into placeholder elements (`<header id="site-header"></header>`, `<footer id="site-footer"></footer>`).
- Each page has a proper `<title>` ("Title | Pia Swarup"), meta description, and `alt` text on every image.

## Home page content

1. Portrait (`assets/images/portrait.png`), name "Pia Swarup", subtitle "Mechanical Engineering · Olin College of Engineering".
2. Bio paragraph. Draft (Pia will edit; keep the bracketed parts visible):
   > I'm a mechanical engineering student at Olin College of Engineering, interested in robotics and physical AI. I love the full loop of designing, machining, building and testing hardware, from reaction-wheel bicycles and farm robots to the suspension of an off-road racecar as Project Manager of Olin Baja SAE. I've interned in hardware robotics at ReviMo and in warehouse robotics at Movu. Outside of engineering I'm a karate black belt [TODO: confirm wording — e.g. "and compete in kumite for the Belgian national team"], and I spend my free time machining, building electronics and making mechanical sculptures. [TODO: one sentence on where you grew up / what you're looking for, e.g. "I'm currently looking for summer 2027 internships in robotics and hardware."]
3. Section **"Projects & Experience"** — card grid in this order:
   1. ReviMo — Hardware Robotics Intern (tag: Internship)
   2. Autonomous Self-Balancing Bicycle (Project)
   3. Baja SAE Suspension (Project)
   4. Soil Sampling Drone Attachment (Project)
   5. Soil Probing Ground Rover (Project)
   6. Robotics Software: State Machine, Particle Filter & Computer Vision — card title "Robotics Software" (Project)
   7. Biomimetic Hopping Mechanism (Project)
   8. Movu NV — Warehouse Robotics Intern (Internship)
   9. Veg Nutraceuticals — Web Design & Marketing Intern (Internship)
4. Section **"Leadership"** — smaller cards: Olin Baja SAE — Project Manager; High School VEX Robotics — Founder & President.
5. Section **"Hobbies"** — smaller cards: Machining; Circuits & Electronics; Mechanical Sculptures; Karate.

Every card links to its own page. Use `content.json` for card blurbs (`tagline` / `description`), shortened to one line where needed.

Note: spell the company "Veg Nutraceuticals" (the old content.json misspells it "Neutraceuticals").

## Detail page template

Top to bottom:
1. Hero image (or placeholder), title, one-line tagline.
2. A small facts strip: Role · Dates · Location (if any) · Tools/technologies (as tags) · links (GitHub etc. from `githubUrl` / `links` in content.json, if present).
3. Write-up sections with `<h2>` headings:
   - **Overview / The problem**
   - **My role**
   - **Design & build**
   - **Results**
   - (internships: **What I did** instead of Design & build, from `responsibilities`)
4. Inline images between paragraphs (placeholders where missing), each with an optional short caption.
5. "More work" row.

Draft the write-ups from the bullets in `content.json` (`description`, `achievements`, `responsibilities`, `impact`) as short readable paragraphs, keeping every number exactly as written. Add `[TODO: ...]` prompts where a section needs info that isn't in content.json (e.g. what problem the project solved, what went wrong and how you fixed it, what you'd do next). Hobby pages are short: one paragraph + photo placeholders, using the `[Write 5–7 sentences ...]` prompts already in content.json as the TODO text. The karate description in content.json contains a row of `*` characters — replace with `[TODO: finish this sentence]`.

Known images to use:
- ReviMo: `assets/images/niko_front.png`
- Bicycle: `assets/images/pia_bike.jpeg`
- Baja Suspension: `assets/images/wheel_hub_FEA.png`
- Movu: `assets/images/movu_escala.png` (hero), `assets/images/movu_sim.png` (inline)
- Veg Nutraceuticals: `assets/images/vitrient_mockup.png` (hero), `assets/images/label.png` (inline)
- Everything else: placeholders.

## Build plan (one commit per step)

1. **Foundation** — `css/style.css` (variables, typography, layout, cards, placeholder, top bar, footer, responsive), `js/site-data.js`, `js/site.js`, and `pages/_template.html`. New `index.html` with just the header/footer working (old index content removed; old JS files stay on disk but are no longer referenced).
2. **Home page** — portrait, bio, the three card sections.
3. **Detail page template** — finish `pages/_template.html` and build the ReviMo page as the reference example.
4. **All project pages** — bicycle, Baja, drone, rover, robotics software, hopper.
5. **Experience, leadership and hobby pages** — Movu, Veg Nutraceuticals, Baja PM, VEX, four hobbies.
6. **Clean-up** — delete old `js/animations.js`, `js/scroll.js`, `js/renderer.js`, `js/main.js`, `js/data.js`, `js/three-setup.js`, old `css/styles.css`, `theme.json`, `content.json`, and the duplicate root `10.21.2026.pdf`. Move images into `assets/images/<slug>/`. Compress large images (e.g. `pia_bike.jpeg` 2.7 MB, `movu_escala.png` 1.9 MB) to roughly ≤ 400 KB / ≤ 1600 px wide. Write the README "how to add a project". Check every link and the phone layout. **Keep `assets/models/`** for Step 7.
7. **(Last priority, optional) Interactive 3D** — add a rotatable 3D model viewer on the Baja Suspension page (`assets/models/wheel-hub.glb`) and Hopper page (`assets/models/hopper.glb`) using Google's `<model-viewer>` web component (one pinned-version script tag from a CDN, loaded only on those pages, lazy-loaded below the hero image so it doesn't slow the page). Alternative if Pia prefers: an embedded public Onshape / Autodesk viewer link. The page must still work fine if the model fails to load.

## How Pia previews

VS Code → right-click `index.html` → "Open with Live Server". The browser auto-reloads on every save.
