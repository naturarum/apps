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

## Deploy

Pushing to `main` publishes via GitHub Pages (source: `main` / root).
`.nojekyll` tells Pages to serve the files as-is.
