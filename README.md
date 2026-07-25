# apps

A small, static hub for my music apps, served at
**<https://naturarum.github.io/apps/>**.

It's plain HTML + CSS + a little vanilla JS — no build step, no dependencies.
Open `index.html` in a browser to work on it locally.

## Layout

```
index.html            hub / landing page (the app grid)
assets/
  base.css            shared design system (tokens, components, light/dark)
  site.js             scroll-reveal + current year
  favicon.svg         shared favicon / brand mark
hexatone/             Hexatone (live) — full page + the in-browser SFZ Builder
pond/                 Pond (coming soon) — teaser
synth/                Synth (coming soon) — teaser
```

Re-deemer lives at its own site (<https://naturarum.github.io/re-deemer>); the
hub just links out to it.

## Adding a new app

1. Make a folder, e.g. `myapp/`, and copy a teaser page (`pond/index.html`) into it.
2. Set its accent in the page's inline `:root { --accent: … }` and swap the hero
   motif, name, and copy.
3. Add one `<a class="app-card">…</a>` block to the `APP LIST` in `index.html`
   (point `href` at `myapp/`, set `--card-accent`, the icon, name, description,
   and a status badge: `badge-available` / `badge-soon` / `badge-plugin`).

Everything shares `assets/base.css`, so the look stays consistent automatically.

## Before committing

Run the static checker. It is mechanical, fast, and every check exists because
that bug actually happened:

```bash
python3 tools/check-site.py
```

It verifies CSS brace balance (a single stray brace silently kills every rule
after it, with no console error), the no-em-dash house rule, that no plaintext
contact address is in the source, that shared assets carry a `?v=` cache-buster,
that each `#vignette` canvas loads its script and keeps its inline position
fallback, that no `_*.html` workshop page is left behind, and that local links
resolve.

### Cache-busting

`base.css`, `site.js`, `vignette.js` and `news.js` are referenced with a `?v=`
query. **Bump it whenever you change one of them**, otherwise a returning
visitor can pair the new HTML with an old cached stylesheet and see a
half-styled page. One find-and-replace across the pages plus
`tools/manual.template.html` does it.

## Deploy

Pushing to `main` publishes via GitHub Pages (source: `main` / root).
`.nojekyll` tells Pages to serve the files as-is.
