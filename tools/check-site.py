#!/usr/bin/env python3
"""Static sanity checks for the apps site. Run before every commit:

    python3 tools/check-site.py

Exits non-zero if anything fails. These are mechanical invariants, not taste:
each one corresponds to a bug that actually shipped or nearly shipped.

  1. CSS brace balance in every inline <style> and every .css file.
     (A single stray brace silently kills every rule after it: no console
     error, page still half-renders. This is how an unstyled contact form and
     a visible spam honeypot nearly went live.)
  2. No em-dashes in served files (the house style rule). Manuals are exempt:
     they are generated from vault markdown the author owns.
  3. No plaintext contact address outside the generated manuals.
  4. Shared assets carry a ?v= cache-busting query, so a returning visitor can
     never pair new HTML with an old cached stylesheet.
  5. Every page with a #vignette canvas also loads vignette.js and carries the
     inline position fallback (so the canvas cannot fall into flow if CSS is
     missing or stale).
  6. No leftover temp/workshop pages (_*.html).
  7. Local href/src targets resolve on disk.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANUAL = "/manual/"
failures = []
notes = []


def pages():
    for p in sorted(ROOT.rglob("*.html")):
        rel = str(p.relative_to(ROOT))
        if MANUAL in "/" + rel or p.name.startswith("_"):
            continue
        yield p, rel


def strip_comments(css):
    return re.sub(r"/\*.*?\*/", "", css, flags=re.S)


def check_css_balance():
    for p, rel in pages():
        css = "\n".join(re.findall(r"<style>(.*?)</style>", p.read_text(encoding="utf-8"), re.S))
        if not css:
            continue
        s = strip_comments(css)
        if s.count("{") != s.count("}"):
            failures.append(f"[css] {rel}: inline <style> unbalanced ({s.count('{')} open, {s.count('}')} close)")
    for p in sorted((ROOT / "assets").glob("*.css")):
        s = strip_comments(p.read_text(encoding="utf-8"))
        if s.count("{") != s.count("}"):
            failures.append(f"[css] assets/{p.name}: unbalanced ({s.count('{')} open, {s.count('}')} close)")


def check_no_em_dashes():
    exts = ("*.html", "*.css", "*.js", "*.json")
    for pat in exts:
        for p in sorted(ROOT.rglob(pat)):
            rel = str(p.relative_to(ROOT))
            if MANUAL in "/" + rel or p.name.startswith("_") or "/tools/" in "/" + rel:
                continue
            for i, line in enumerate(p.read_text(encoding="utf-8", errors="ignore").split("\n"), 1):
                if "—" in line or "&mdash;" in line or "&#8212;" in line:
                    failures.append(f"[dash] {rel}:{i}: em-dash -> {line.strip()[:70]}")


def check_no_plaintext_email():
    for pat in ("*.html", "*.js"):
        for p in sorted(ROOT.rglob(pat)):
            rel = str(p.relative_to(ROOT))
            if MANUAL in "/" + rel or p.name.startswith("_"):
                continue
            t = p.read_text(encoding="utf-8", errors="ignore")
            if re.search(r"nrrrm\s*@\s*icloud", t):
                failures.append(f"[email] {rel}: plaintext address present (should be JS-assembled)")


def check_asset_versioning():
    shared = re.compile(r'(?:href|src)="(?:\.\./)*assets/(base|manual)\.css(\?[^"]*)?"'
                        r'|(?:href|src)="(?:\.\./)*assets/(site|vignette|news)\.js(\?[^"]*)?"')
    for p, rel in pages():
        for m in shared.finditer(p.read_text(encoding="utf-8")):
            asset = m.group(1) or m.group(3)
            query = m.group(2) or m.group(4) or ""
            if "v=" not in query:
                failures.append(f"[cache] {rel}: assets/{asset} has no ?v= cache-buster")


def check_canvas_wiring():
    for p, rel in pages():
        t = p.read_text(encoding="utf-8")
        if 'id="vignette"' not in t:
            continue
        if "vignette.js" not in t:
            failures.append(f"[canvas] {rel}: has #vignette canvas but never loads vignette.js")
        tag = re.search(r"<canvas id=\"vignette\"[^>]*>", t)
        if tag and "position:fixed" not in tag.group(0).replace(" ", ""):
            failures.append(f"[canvas] {rel}: canvas lacks the inline position:fixed fallback")


def check_no_temp_pages():
    for p in sorted(ROOT.rglob("_*.html")):
        failures.append(f"[temp] {p.relative_to(ROOT)}: leftover workshop page, delete before commit")


def check_local_targets():
    attr = re.compile(r'(?:href|src)="([^"#?][^":]*?)(?:[?#][^"]*)?"')
    for p, rel in pages():
        # manual.template.html is a pandoc template, not a served page: its ../../
        # paths resolve from the generated apps/<app>/manual/ output, and $pdf$ is
        # a pandoc variable. Versioning still applies to it; link resolution does not.
        if rel.startswith("tools/"):
            continue
        for target in attr.findall(p.read_text(encoding="utf-8")):
            if target.startswith(("http", "//", "mailto:", "data:")):
                continue
            resolved = (p.parent / target).resolve()
            if not resolved.exists():
                # a bare directory link resolves to its index.html
                if (resolved / "index.html").exists():
                    continue
                failures.append(f"[link] {rel}: -> {target} does not exist on disk")


for fn in (check_css_balance, check_no_em_dashes, check_no_plaintext_email,
           check_asset_versioning, check_canvas_wiring, check_no_temp_pages,
           check_local_targets):
    fn()

if failures:
    print(f"FAIL: {len(failures)} problem(s)\n")
    for f in failures:
        print("  " + f)
    sys.exit(1)

print("PASS: css balanced, no em-dashes, no plaintext address, assets versioned,")
print("      canvas wired with fallback, no temp pages, local targets resolve.")
for n in notes:
    print("  note: " + n)
