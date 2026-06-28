# News feed

One JSON file drives all the news on the site. Add a post here and it shows up
automatically on the **hub** ("What's new") and on the **app page it concerns**
("Updates") — no build step, no HTML to touch.

## To post

Add an object to the **top** of `news.json` (newest first):

```json
{
  "date": "2026-07-15",
  "app": "pond",
  "tag": "Update",
  "title": "Pond 1.1 — new scales",
  "body": "Added three scales and fixed a sync bug.\n\n- Dorian b2\n- Lydian\n- Faster MIDI clock lock",
  "link": { "href": "https://apps.apple.com/app/pond-ripple-sequencer/id6779643312", "label": "App Store" }
}
```

| field | notes |
|---|---|
| `date` | `YYYY-MM-DD`. Sorted newest-first automatically. |
| `app`  | `hexatone` · `pond` · `anima` · `re-deemer`, or `""` for a general post (hub only). |
| `tag`  | short label shown as a pill, e.g. `Update`, `Out now`, `News`. Optional. |
| `title`| the headline. |
| `body` | optional. Plain text + light markdown: blank line = new paragraph, `- ` = bullet, `**bold**`, `*italic*`, `[text](url)`. |
| `link` | optional `{ "href": "...", "label": "..." }`. Internal paths are site-relative (`hexatone/manual/`); external URLs (`https://…`) open in a new tab. |

That's it — commit and push. The hub shows the latest 6 across all apps; each app page shows its latest 5.
