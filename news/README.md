# News feed

The news shown on the hub ("What's new") and each app page ("Updates") is driven by
**`news.json`** here, rendered client-side by `assets/news.js`. No build step is needed
to *display* it.

## Source of truth = the vault, not this JSON

Posts are written in **`…/Obsidian/Documents/code/News.md`** (in the vault). `news.json`
is **generated** from it — don't hand-edit `news.json`, it gets overwritten.

**To post:** add an entry at the top of `News.md` in Obsidian (the format is documented at
the top of that file), then either:

- run `python3 apps/tools/build-news.py`, or
- just tell Claude **"update the news"** —

…which regenerates `news.json`. Commit + push and it's live (hub shows the latest 6 across
all apps; each app page shows that app's latest 5).

## Post fields (in News.md)

`date` (YYYY-MM-DD) · `app` (`hexatone`/`pond`/`anima`/`re-deemer`, or blank = general) ·
`tag` (short pill) · `title` · `link` + `label` (optional) · then a blank line and the
markdown body (paragraphs, `- ` bullets, `**bold**`, `*italic*`, `[links](url)`).
