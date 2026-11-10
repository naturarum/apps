# naturarum

The naturarum site: news, apps, tools and (later) covers. Built with [Astro](https://astro.build),
deployed by Cloudflare from this repo.

## Run it

```
npm install
npm run dev        # http://127.0.0.1:4321
npm run build      # static output in dist/
python3 tools/check-site.py   # after a build, before every commit
```

## Where things live

| What | Where |
| --- | --- |
| Masthead, index sheet, colophon | `src/layouts/Base.astro`, `src/components/` |
| Every app (copy, specs, panel, questions) | `src/data/apps.ts` |
| Tabs, tagline, the covers switch | `src/data/site.ts` (`SHOW_COVERS`) |
| News posts | `src/data/news.json`, **generated**: edit `News.md` and the release files in the vault, then run `python3 tools/build-news.py` |
| Manuals (web + PDF) | `public/apps/<app>/manual/`, **generated** by `tools/build-manuals.sh` from the vault |
| Screenshots and icons | `public/apps/<app>/img/` (1200 px long side, JPEG q80; icons 256 px PNG) |
| SFZ Builder | `src/pages/tools/sfz-builder/index.astro` |
| Styles | `src/styles/kit.css` (everything in the `kit` layer) |

Old addresses are kept on purpose: `/apps/<app>/`, `/apps/<app>/manual/` and
`/apps/datum/privacy.html`, `/apps/voltagecontrol/privacy.html` are linked from the App Store.
`public/_redirects` covers the few that moved.

## Cloudflare

Framework preset Astro, build command `npm run build`, output directory `dist`, Node 22
(`.node-version`). Set `SITE_URL` (for example `https://naturarum.com`) once the domain is
attached; the RSS feed uses it for absolute links.

## House rules

No em-dashes, no prices (the App Store shows them), no plaintext email address, brand voice
(no first person outside news posts). `tools/check-site.py` enforces the mechanical ones.
