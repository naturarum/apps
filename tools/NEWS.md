# News feed

The news shown on the hub ("What's new") and each app page ("Updates") is driven by
**`news.json`** here, rendered client-side by `assets/news.js`. No build step is needed
to *display* it.

## Source of truth = the vault, not this JSON

`news.json` is **generated** from the vault (don't hand-edit it; it gets overwritten).
It merges two sources:

- **Release posts** come from each app's release files,
  `…/Obsidian/Documents/code/<App>/Public/releases/<version>.md`. A release file holds the
  What's New text (also used for the App Store and the in-app notes) and an optional
  `## News` section. That post is published **only once the release is `status: live`**.
- **Everything else** (coverage, teasers, betas) is written in `…/code/News.md`.

**To post:** edit the vault, then

```bash
python3 tools/releases.py        # validate every release, check in-app notes for drift
python3 tools/build-news.py      # regenerate news.json
```

Commit + push and it's live (hub shows the latest 6 across all apps; each app page shows
that app's latest 5). `tools/build-changelogs.py` writes the in-app notes files (Hexatone
`CHANGELOG.md`, Pond `WHATSNEW.md`) into the app repos from the same release files.

## Post fields (in News.md)

`date` (YYYY-MM-DD) · `app` (`hexatone`/`pond`/`anima`/`re-deemer`/`voltagecontrol`/`datum`,
or blank = general) ·
`tag` (short pill) · `title` · `link` + `label` (optional) · then a blank line and the
markdown body (paragraphs, `- ` bullets, `**bold**`, `*italic*`, `[links](url)`).
