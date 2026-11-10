#!/usr/bin/env python3
"""Sanity checks for the built site. Run after `npm run build`, before every commit:

    npm run build && python3 tools/check-site.py

Exits non-zero if anything fails. Mechanical invariants, not taste; each one guards a
house rule or a bug that nearly shipped.

  1. No em-dashes in served pages or in the sources (house style). Manuals are exempt:
     they are generated from vault markdown the author owns.
  2. No plaintext contact address anywhere in the output (the contact form relays mail;
     its fallback assembles the address at runtime).
  3. No words the site must never say: the names behind VoltageControl, "Steam"/"Pipe"
     for Anima, "Decksaver" for the covers.
  4. No prices in served pages (the App Store shows them).
  5. Every local href/src in the output resolves to a built file.
  6. The App Store support and privacy URLs still exist at their old paths.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
SRC = ROOT / "src"
failures = []


def fail(msg):
    failures.append(msg)


if not DIST.is_dir():
    print("dist/ is missing: run `npm run build` first.")
    sys.exit(1)

served = [p for p in DIST.rglob("*") if p.suffix in (".html", ".xml", ".css", ".js") and "/manual/" not in str(p)]
sources = [p for p in SRC.rglob("*") if p.is_file() and p.suffix in (".astro", ".ts", ".css", ".json")]

ADDRESS = re.compile(r"[A-Za-z0-9._%+-]+@(icloud|me|mac|gmail)\.com")
BANNED = re.compile(r"Make Noise|0-CTRL|0-Coast|\bSteam\b|\bPipe\b|Decksaver|SMEM", re.I)
PRICE = re.compile(r"(?<![\w$])\$\s?\d|\d+[.,]\d\d\s?(USD|EUR)\b")

for p in served + sources:
    rel = p.relative_to(ROOT)
    text = p.read_text(encoding="utf-8", errors="replace")
    if "—" in text:
        fail(f"em-dash in {rel}")
    if ADDRESS.search(text):
        fail(f"plaintext address in {rel}: {ADDRESS.search(text).group(0)}")
    m = BANNED.search(text)
    if m and p.suffix != ".js":
        fail(f"banned word in {rel}: {m.group(0)}")
    if p.suffix in (".html", ".xml") and p in served:
        visible = re.sub(r"<script.*?</script>|<style.*?</style>", "", text, flags=re.S)
        m = PRICE.search(re.sub(r"<[^>]+>", " ", visible))
        if m:
            fail(f"price in {rel}: {m.group(0)}")


def resolves(url, page):
    path = url.split("#")[0].split("?")[0]
    if not path:
        return True
    target = (DIST / path.lstrip("/")) if path.startswith("/") else (page.parent / path)
    if path.endswith("/"):
        return (target / "index.html").exists()
    return target.exists() or target.with_suffix(".html").exists() or (target / "index.html").exists()


for p in DIST.rglob("*.html"):
    if "/manual/" in str(p):
        continue
    text = p.read_text(encoding="utf-8", errors="replace")
    for url in re.findall(r'(?:href|src)="([^"]+)"', text):
        if re.match(r"^(https?:|mailto:|data:|#|//)", url):
            continue
        if not resolves(url, p):
            fail(f"broken link in {p.relative_to(DIST)}: {url}")

for keep in ["apps/index.html", "apps/datum/privacy.html", "apps/voltagecontrol/privacy.html", "apps/hexatone/index.html",
             "apps/pond/index.html", "apps/anima/index.html", "apps/voltagecontrol/index.html", "apps/datum/index.html",
             "apps/hexatone/manual/index.html", "apps/pond/manual/index.html", "apps/anima/manual/index.html"]:
    if not (DIST / keep).exists():
        fail(f"old address missing: /{keep}")

if failures:
    print(f"{len(failures)} problem(s):")
    for f in failures:
        print("  -", f)
    sys.exit(1)
print(f"ok: {len(served)} served files and {len(sources)} sources checked")
