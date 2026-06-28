#!/usr/bin/env bash
# Build on-brand HTML + matching PDF manuals from the Obsidian vault markdown.
# Source of truth = the vault. Edit a manual in Obsidian, then re-run this, then
# commit the generated files. Requires: pandoc, weasyprint, sips (macOS).
set -euo pipefail

APPS="/Users/naturarum/Documents/Claude/AppsWebsite/apps"
VAULT="/Users/naturarum/Library/Mobile Documents/iCloud~md~obsidian/Documents/code"
TPL="$APPS/tools/manual.template.html"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

build() {
  local slug="$1" appname="$2" title="$3" desc="$4" accent="$5" accentglow="$6" src="$7" imgsrc="$8"
  local out="$APPS/$slug/manual"
  mkdir -p "$out"
  local md="$TMP/$slug.md"
  cp "$src" "$md"
  # cleaner figure captions: drop the "Screenshot: " prefix from image alt text
  sed -i '' -E 's/!\[Screenshot: /![/g' "$md"

  # Optimize + copy referenced images, then point the markdown at the .jpg copies
  if [ -n "$imgsrc" ] && [ -d "$imgsrc" ]; then
    mkdir -p "$out/img"
    rm -f "$out/img/"*.jpg
    for png in "$imgsrc"/*.png; do
      [ -e "$png" ] || continue
      local base; base="$(basename "${png%.png}")"
      sips -s format jpeg -s formatOptions 80 -Z 1200 "$png" --out "$out/img/$base.jpg" >/dev/null 2>&1
    done
    sed -i '' -E 's#\(images/([^)]+)\.png\)#(img/\1.jpg)#g' "$md"
  fi

  # Markdown -> on-brand HTML page
  pandoc --from gfm+implicit_figures --to html5 \
    --template "$TPL" \
    --metadata title="$title" \
    -V appname="$appname" -V description="$desc" \
    -V accent="$accent" -V accentglow="$accentglow" -V pdf="manual.pdf" \
    "$md" -o "$out/index.html"

  # Lazy-load the (many) manual images so the page paints fast; weasyprint ignores it
  sed -i '' 's/<img /<img loading="lazy" /g' "$out/index.html"

  # HTML -> PDF (weasyprint applies the @media print rules in manual.css)
  weasyprint "$out/index.html" "$out/manual.pdf" >/dev/null 2>&1

  echo "built $slug -> $out/index.html + manual.pdf"
}

build hexatone "Hexatone" "Hexatone — Manual" \
  "The full user manual for Hexatone, the isomorphic hexagonal keyboard and microtonal instrument for iPad." \
  "#ffa9c9" "rgba(255,169,201,0.22)" \
  "$VAULT/Hexatone/Hexatone manual.md" "$VAULT/Hexatone/images"

build pond "Pond" "Pond — Manual" \
  "The full user manual for Pond, the ripple sequencer for iPad." \
  "#9ee6e6" "rgba(158,230,230,0.22)" \
  "$VAULT/Pond/Pond manual.md" ""

echo "done."
