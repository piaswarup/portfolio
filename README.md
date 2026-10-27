# Pia Swarup's Portfolio

Visit **[piaswarup.github.io/portfolio](https://piaswarup.github.io/portfolio)** to view my portfolio!

Plain HTML, CSS and a little JavaScript. No build step: edit a file, save, and refresh.

## Preview locally

In VS Code, right-click `index.html` → **Open with Live Server**. The browser reloads every time you save.

## How the site is organised

```
index.html              home page (portrait, bio, project cards)
pages/<slug>.html       one page per project; the write-up is plain HTML you edit directly
pages/_template.html    blank page to copy for a new project
js/site-data.js         THE list of every page (cards, dropdown menus, "More work" rows)
js/site.js              builds the top bar, footer, cards and "More work" rows (no need to edit)
css/style.css           all styles; colors, font, spacing are at the top under "Settings"
assets/images/<slug>/   images for each page
assets/videos/          videos
assets/files/resume.pdf the resume linked in the top bar
```

## Add a new project

1. **Copy the template.** Duplicate `pages/_template.html` and rename it, e.g. `pages/line-robot.html`.
   The file name without `.html` is the page's *slug* (`line-robot`).
2. **Add it to the list.** Open `js/site-data.js` and add an entry to `SITE_PAGES`:
   ```js
   {
     slug: 'line-robot',
     title: 'Line-Following Robot',
     blurb: 'One line that appears on the card when you hover.',
     tag: 'Project',
     section: 'work',              // 'work' = card on the home page; 'leadership' / 'hobbies' = menus only
     thumb: 'assets/images/line-robot/thumb.jpg',   // or null until you have a photo
     thumbAlt: 'Short description of the card image',
     menu: 'projects'              // which dropdown: 'projects' or 'experience'
   },
   ```
   The order of the list is the order of the cards and menu items. Keep the entry inside its section
   (all `work` entries first, then `leadership`, then `hobbies`), or the menu sub-headings get mixed up.
   For a job, add `role: 'Hardware Robotics Intern'` and it shows under the title in the menu and card.
3. **Add images.** Make a folder `assets/images/line-robot/` and put the photos in it
   (`hero.jpg`, `01.jpg`, `02.jpg`, ...). In the new page, replace `SLUG` in the image paths with the slug.
4. **Write the page.** Fill in everything in `[square brackets]` in the new page: title, tagline,
   Overview, My role, Design & build, Results. Put tool names in `<strong>...</strong>` so they stand out.

That's it: the card, the dropdown entry and the "More work" links appear automatically.

## Tips

- **Missing photos are fine.** If an image file doesn't exist yet, the page shows a grey
  "Photo coming soon" box in its place. Drop the file in with the same name and it appears.
- **Keep images small.** Aim for at most about 1600 px wide and under 400 KB (JPG for photos, PNG for charts).
- **Card images** look best as 4:3 with the object centred on a white background.
- **Hero options:** add `page-hero--contain` to the hero's class to show the whole image instead of
  cropping it (good for renders on white), or `page-hero--bottom` to crop from the top.
- **Several images in a row:** wrap them in `<div class="gallery">...</div>` inside a `<figure>`.
- **Videos:** put the `.mp4` in `assets/videos/` and copy a `<video ...>` block from an existing page.
  Add `class="video--portrait"` for phone videos shot vertically.
- **Find unfinished text:** search the project for `[TODO` in VS Code (Ctrl+Shift+F).
- **Links and paths must be relative** (`../assets/...`, never starting with `/`), because the site lives
  at `/portfolio/` on GitHub Pages.
