#!/usr/bin/env python3
"""Compile the website news feed (apps/news/news.json) from the vault.

Two sources, both in the vault:
  1. Release posts: every release file (<App>/Public/releases/<version>.md) that has a
     `## News` section AND `status: live`. A release that is not live yet is held back,
     so the site can never announce a version before it is on the App Store.
  2. Everything else (coverage, announcements, teasers): posts written directly in
     News.md, in the format documented at the top of that file.

Edit the vault, run this script, commit the regenerated news.json. Never edit news.json.
"""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import releases  # noqa: E402

SRC = releases.VAULT / "News.md"
OUT = Path(__file__).resolve().parent.parent / "news" / "news.json"


def parse(text):
    posts = []
    for chunk in re.split(r'(?m)^---[ \t]*$', text):
        lines = chunk.split('\n')
        i = 0
        while i < len(lines) and not lines[i].strip():      # skip leading blanks
            i += 1
        meta = {}
        while i < len(lines) and lines[i].strip():          # key:value lines until a blank line
            if ':' in lines[i]:
                k, v = lines[i].split(':', 1)
                meta[k.strip().lower()] = v.strip()
            i += 1
        if 'title' not in meta or 'date' not in meta:        # preamble / not a post
            continue
        while i < len(lines) and not lines[i].strip():       # skip blank(s) before body
            i += 1
        body = '\n'.join(lines[i:]).strip()
        post = {
            "date": meta["date"],
            "app": meta.get("app", ""),
            "tag": meta.get("tag", ""),
            "title": meta["title"],
        }
        if body:
            post["body"] = body
        if meta.get("link"):
            post["link"] = {"href": meta["link"], "label": meta.get("label", "Read more")}
        posts.append(post)
    return posts


def main():
    if not SRC.exists():
        raise SystemExit(f"News source not found: {SRC}")
    apps = releases.load_apps()
    errors, warnings = releases.validate(apps)
    if errors:
        for e in errors:
            print("ERROR:", e)
        raise SystemExit("fix the release files first (python3 tools/releases.py)")

    from_releases = releases.news_posts(apps)
    from_news_md = parse(SRC.read_text(encoding="utf-8"))

    # the same post written twice (once in News.md, once in a release file) is a mistake
    rel_keys = {(p["app"], p["title"]) for p in from_releases}
    dupes = [p for p in from_news_md if (p["app"], p["title"]) in rel_keys]
    if dupes:
        for p in dupes:
            print(f"ERROR: News.md repeats the release post {p['title']!r}; keep it in the release file only")
        raise SystemExit(1)

    tagged = [(p, 0) for p in from_releases] + [(p, 1) for p in from_news_md]
    # newest first; on the same day, release posts first, then by title (deterministic)
    tagged.sort(key=lambda t: t[0]["title"])
    tagged.sort(key=lambda t: t[1])
    tagged.sort(key=lambda t: t[0]["date"], reverse=True)
    posts = [p for p, _ in tagged]

    OUT.write_text(json.dumps(posts, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {len(posts)} posts -> {OUT}  "
          f"({len(from_releases)} from release files, {len(from_news_md)} from News.md)")
    for p in posts:
        print(f"  {p['date']}  {p['app'] or '(general)':14}  {p['title']}")
    for w in warnings:
        if "held back" in w:
            print("  held back (not live yet):", w.split(": ", 1)[0])


if __name__ == "__main__":
    main()
