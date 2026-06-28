#!/usr/bin/env python3
"""Compile the vault News.md into apps/news/news.json (the runtime news feed).

Source of truth = the vault file. Edit posts there, then run this script (or just
ask Claude to "update the news"), then commit the regenerated news.json.

Post format in News.md — posts separated by a line of three dashes (---); each is a
block of `key: value` lines, a blank line, then the markdown body. Keys: date, app,
tag, title, link, label. The preamble before the first --- is ignored.
"""
import json
import re
from pathlib import Path

SRC = Path("/Users/naturarum/Library/Mobile Documents/iCloud~md~obsidian/Documents/code/News.md")
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
    posts.sort(key=lambda p: p["date"], reverse=True)
    return posts

def main():
    if not SRC.exists():
        raise SystemExit(f"News source not found: {SRC}")
    posts = parse(SRC.read_text(encoding="utf-8"))
    OUT.write_text(json.dumps(posts, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {len(posts)} posts -> {OUT}")
    for p in posts:
        print(f"  {p['date']}  {p['app'] or '(general)':10}  {p['title']}")

if __name__ == "__main__":
    main()
