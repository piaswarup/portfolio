# Pia Swarup — Portfolio

This file describes the finished portfolio site and how to work on it. Claude Code: read all of it before
making changes.

## Working rules (important)

- **Never run git commands that change anything** (no commit, push, merge, reset, checkout, stash). Pia does all git herself. Read-only commands like `git status` / `git diff` are fine.
- Only do what Pia asks for, then stop.
- At the end of each change, give: (1) the list of files created/changed/deleted, (2) what Pia should check in the browser (Live Server), (3) a suggested commit message.
- **Never invent facts, numbers, dates or claims.** Use only what Pia has said or what is in documents she has provided. Where something is missing, write a visible placeholder in square brackets saying exactly what to add, e.g. `[TODO: add 1–2 sentences on how you tuned the PID gains]`, or ask.
- Keep every number exactly as Pia or her documents give it.

## Writing style

- Focus each page on what **Pia herself** did. Use "we" for shared team work, and only where Pia says it was shared.
- **Never name teammates or classmates.** Write "a teammate", "with a teammate", or "we".
- **No em dashes (—).** Use a colon or comma instead. En dashes in ranges (e.g. 7–8) are fine.
- Name tools in prose and put them in `<strong>`, e.g. `<strong>SOLIDWORKS</strong>`. There is **no facts strip** (no Role · Dates · Tools block).
- Short, readable paragraphs for recruiters and engineers skimming quickly.
- Spell the company "Veg Nutraceuticals". The Movu work is under an NDA: keep it high level.

## What the site is

A plain, fast portfolio in the style of the HTML5 UP "Phantom" template (like rjansens.com), coded from
scratch. Static HTML + CSS + a little vanilla JS. **No build step, no frameworks, no npm.** Works on GitHub
Pages and with VS Code Live Server.

- Hosted at `https://piaswarup.github.io/portfolio/` (a sub-path), so **all links and asset paths must be relative** (`css/style.css`, `../assets/...`). Never start a path with `/`.
- Normal vertical scrolling, minimal animation (only the card hover).
- Works on phones: single-column grid, hamburger menu.

## File structure

```
index.html                 home page
pages/<slug>.html          one page per project / job / hobby (write-up is hand-editable HTML)
pages/_template.html       blank page to copy when adding a new project (keeps its [TODO] prompts)
js/site-data.js            THE list of every page (SITE_PAGES) + contact details (SITE_CONTACT)
js/site.js                 builds the top bar, dropdowns, footer, home grid and "More work" rows
css/style.css              all styles; colors, font, spacing, radius are variables at the top
assets/images/<slug>/      images per page (thumb.jpg = card image)
assets/videos/             videos (.mp4)
assets/files/resume.pdf    resume linked from the top bar
assets/models/             3D models kept for the optional 3D viewer (not used yet)
README.md                  "how to add a project" instructions for Pia
```

## Home page

1. Intro: name "Pia Swarup", subtitle "Mechanical Engineering · Olin College of Engineering", and the bio on the
   left; square portrait (`assets/images/portrait.jpg`) on the right.
2. One section, **"Projects & Experience"**: a grid of picture-only cards for every `section: 'work'` entry in
   `site-data.js`, in list order. Hovering shows the title (plus role, for jobs) and the one-line blurb.
   3 columns desktop → 2 tablet → 1 phone.

Leadership and hobby pages have no home card; they're reached from the dropdowns and "More work" rows.

## Navigation and footer (built by `js/site.js`)

- Fixed top bar: "Pia Swarup" (home) on the left; **Home**, **Projects** (dropdown), **Experience** (dropdown),
  **Resume** (opens `assets/files/resume.pdf` in a new tab) on the right. Hamburger on phones.
- Each dropdown lists every page with that `menu` value. A sub-heading (Leadership, Hobbies) appears where the
  `section` changes, so **entries must stay grouped: all `work`, then `leadership`, then `hobbies`.**
- Footer: email as text `pswarup(at)olin(dot)edu` (keep this obfuscated format, not a mailto link), LinkedIn,
  GitHub, "Would love to chat, just reach out :)", and "© Pia Swarup".
- Bottom of each detail page: "More work" row with 3 cards to the next pages in the list.

## `SITE_PAGES` entry fields

`slug`, `title`, `role` (optional job title, shown under the title in the menu and card), `blurb` (one line),
`tag`, `section` (`'work' | 'leadership' | 'hobbies'`), `thumb` (or `null` to show the title on a light box),
`thumbAlt`, `menu` (`'projects' | 'experience'`).

## Detail page layout

Each page has `<header id="site-header">`, `<article class="container page">`, `<section id="more-work">`,
`<footer id="site-footer">`, a `<title>` "Title | Pia Swarup", a meta description, and `alt` text on every image.

Inside the article, top to bottom:
1. Hero image (or looping muted video), `<h1>` title, `.page-tagline`.
2. `.prose` write-up with `<h2>` sections: **Overview**, **My role**, **Design & build** (jobs: **What I did**),
   **Results**, then `<h2>` **What I learned** / **Next steps** where Pia has given them (own sections, not
   sub-headings of Results; the machining page keeps an `<h3>` one inside its 8 ball section). In-progress
   projects use **Status and next steps**. Hobby pages are shorter.
3. Images and videos between paragraphs, each in a `<figure>` with a short `<figcaption>`.

## CSS helpers

- Hero: `.page-hero` (16:9, cropped); add `--contain` (whole image on white, never enlarged), `--natural`
  (keeps its own shape, e.g. video), `--small` (small photo at its own shape, centred, max 40rem),
  `--bottom` (crop from the top). `<p class="page-hero__credit">` right after a hero adds a small centred
  photo credit (used for the farm-ng Amiga photo on the rover page).
- Inline: `.gallery` (images side by side, one caption), `.figure--small`, `video.video--portrait`
  (phone videos), `.embed` / `.embed--portrait` (YouTube / Google Drive iframes).
- Cards: `.card`, `.card__overlay`, `.card__role`, `.card__placeholder`. Missing photo: `.placeholder`
  ("Photo coming soon"); `site.js` swaps in a placeholder automatically if an image file is missing.

## Design

- White background, clean, lots of whitespace. Content width `--max-width: 80rem`.
- Font: **Inter** (400/500/600/700) from Google Fonts, fallback `'Helvetica Neue', Arial, sans-serif`.
- Colors: navy `#253a7a` accent/headings/links (hover `#1a2d63`); text `#1f2433`; secondary `#5c6b8a`;
  light tint `#eef2fa`; borders `#e3e7f0`; card hover overlay `rgba(26,45,99,0.88)`.

## Images and videos

- Photos at most ~1600 px wide and ~400 KB (JPG for photos, PNG for charts and diagrams).
- Card images (`thumb.jpg`): 1200×900, object trimmed and scaled to fit 80% × 72% of the card, centred on
  white, so every home card shows its object at about the same scale. Transparent PNGs are flattened onto white.
- Videos: H.264 `.mp4`, compressed for the web, with a poster image. Bike page videos have no audio.
- Only use Pia's own photos, CAD and plots, not other teams' or papers' images. Exception: the farm-ng Amiga
  photo on the rover page (hero and card), credited under the hero.

## Adding a project

Copy `pages/_template.html` to `pages/<slug>.html`, add one entry to `SITE_PAGES` in `js/site-data.js`
(inside the right section group), and put images in `assets/images/<slug>/`. See README.md.

## Status

Build steps 1–6 are done (foundation, home page, page template, all project / experience / leadership / hobby
pages, clean-up). Step 7, an optional interactive 3D viewer (`<model-viewer>`) on the Baja and Hopper pages
using `assets/models/`, was skipped for now.

## How Pia previews

VS Code → right-click `index.html` → "Open with Live Server". The browser auto-reloads on every save.
