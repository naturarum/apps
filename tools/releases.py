#!/usr/bin/env python3
"""Release notes: ONE file per release, in the vault. Everything else is generated.

Vault layout, per app:
    <App>/Public/app.md                 facts about the app (slug, store URL, repo, in-app notes file)
    <App>/Public/releases/<version>.md  one file per release

A release file:
    ---
    version: 1.4.1
    build: 10
    status: live            # draft | submitted | live
    live: 2026-09-25        # the day it went live (blank if unknown)
    news_title: ...         # only if the release gets a news post
    news_tag: Update
    news_date: 2026-09-25   # defaults to `live`
    news_link: ...          # defaults to the app's store_url (label "App Store")
    news_label: ...
    ---
    ## What's New
    The release notes, exactly as they ship: App Store "What's New" field, in-app sheet,
    repo CHANGELOG. Written once, here.

    ## App Store
    (optional, history only) the store text, when an old release shipped a different one.

    ## News
    (optional) the website news post body. It is published ONLY once status is live.

Run this file to validate every release and check the in-app copies for drift:
    python3 tools/releases.py
"""
import re
import sys
from pathlib import Path

VAULT = Path("/Users/naturarum/Library/Mobile Documents/iCloud~md~obsidian/Documents/code")
STATUSES = ("draft", "submitted", "live")
DATE = re.compile(r"\d{4}-\d{2}-\d{2}")
EMDASH = "\u2014"
WN = "What's New"


def parse_doc(text):
    """Frontmatter (`key: value`, `# comments` allowed) + a dict of `## ` sections."""
    meta, body = {}, text
    m = re.match(r"\A---\n(.*?)\n---[ \t]*\n?(.*)\Z", text, re.S)
    if m:
        for line in m.group(1).split("\n"):
            line = re.sub(r"\s+#\s.*$", "", line).rstrip()
            if not line.strip() or line.lstrip().startswith("#"):
                continue
            k, _, v = line.partition(":")
            meta[k.strip()] = v.strip()
        body = m.group(2)
    sections, cur, buf = {}, None, []
    for line in body.split("\n"):
        h = re.match(r"^## (.+?)\s*$", line)
        if h:
            if cur is not None:
                sections[cur] = "\n".join(buf).strip("\n")
            cur, buf = h.group(1), []
        elif cur is not None:
            buf.append(line)
    if cur is not None:
        sections[cur] = "\n".join(buf).strip("\n")
    return meta, sections


def vkey(version):
    return tuple(int(x) for x in re.findall(r"\d+", version))


def load_apps(vault=VAULT):
    apps = []
    for appmd in sorted(vault.glob("*/Public/app.md")):
        meta, sections = parse_doc(appmd.read_text(encoding="utf-8"))
        rels = []
        for f in sorted((appmd.parent / "releases").glob("*.md")):
            rm, rs = parse_doc(f.read_text(encoding="utf-8"))
            rels.append({"meta": rm, "sections": rs, "path": f,
                         "version": rm.get("version", ""), "status": rm.get("status", "")})
        rels.sort(key=lambda r: vkey(r["version"]), reverse=True)
        apps.append({"meta": meta, "sections": sections, "dir": appmd.parent, "releases": rels})
    return apps


def validate(apps):
    errors, warnings = [], []
    for a in apps:
        am = a["meta"]
        where = a["dir"].relative_to(VAULT)
        if not am.get("slug"):
            errors.append(f"{where}/app.md: missing `slug`")
        seen = set()
        for r in a["releases"]:
            p, m, s = r["path"].relative_to(VAULT), r["meta"], r["sections"]
            v = r["version"]
            if not v:
                errors.append(f"{p}: missing `version`")
            elif v != r["path"].stem:
                errors.append(f"{p}: version {v!r} does not match the file name")
            if v in seen:
                errors.append(f"{p}: duplicate version {v}")
            seen.add(v)
            if r["status"] not in STATUSES:
                errors.append(f"{p}: status must be one of {'/'.join(STATUSES)}, got {r['status']!r}")
            if not s.get("What's New", "").strip():
                errors.append(f"{p}: missing the `## What's New` section")
            for k in ("live", "news_date"):
                if m.get(k) and not DATE.fullmatch(m[k]):
                    errors.append(f"{p}: `{k}` must be YYYY-MM-DD, got {m[k]!r}")
            if r["status"] == "live" and not m.get("live"):
                warnings.append(f"{p}: live, but the live date is unknown (fill `live:`)")
            if "News" in s:
                if not m.get("news_title"):
                    errors.append(f"{p}: has a `## News` section but no `news_title`")
                if not (m.get("news_date") or m.get("live")):
                    errors.append(f"{p}: news post needs `news_date` or `live`")
                if r["status"] != "live":
                    warnings.append(f"{p}: news post held back until status is live (now {r['status']})")
                if EMDASH in s["News"] or EMDASH in m.get("news_title", ""):
                    errors.append(f"{p}: em-dash in the news post (house rule: none on the site)")
                if m.get("live") and m.get("news_date") and m["news_date"] < m["live"]:
                    warnings.append(f"{p}: news dated {m['news_date']}, before the release went live ({m['live']})")
            for sec in ("What's New", "App Store"):
                if EMDASH in s.get(sec, ""):
                    warnings.append(f"{p}: em-dash in `{sec}` (public copy; humanize strips these)")
            # about to be pasted into App Store Connect, which shows markdown literally
            if r["status"] != "live" and "App Store" not in s:
                if re.search(r"\*\*|^#+ ", s.get(WN, ""), re.M):
                    warnings.append(f"{p}: What's New has **bold** or # headings; the App Store "
                                    "shows them literally (use plain lines and '- ' bullets)")
    return errors, warnings


def news_posts(apps):
    """Website news posts for every LIVE release that has a `## News` section."""
    posts = []
    for a in apps:
        am = a["meta"]
        for r in a["releases"]:
            m, s = r["meta"], r["sections"]
            if "News" not in s or r["status"] != "live":
                continue
            post = {"date": m.get("news_date") or m["live"], "app": am["slug"],
                    "tag": m.get("news_tag", ""), "title": m["news_title"]}
            body = s["News"].strip()
            if body:
                post["body"] = body
            href = m.get("news_link") or am.get("store_url", "")
            if href:
                default = "App Store" if href == am.get("store_url") else "Read more"
                post["link"] = {"href": href, "label": m.get("news_label") or default}
            posts.append(post)
    return posts


# --- in-app notes ---------------------------------------------------------------

def repo_version(am):
    """MARKETING_VERSION from the app's project.yml, or None."""
    py = am.get("project_yml")
    if not py:
        return None
    f = Path(am["repo"]).expanduser() / py
    m = re.search(r"MARKETING_VERSION:\s*\"?([\d.]+)", f.read_text(encoding="utf-8"))
    return m.group(1) if m else None


def inapp_releases(a):
    """Releases the app's bundled notes should carry: everything up to the repo's version."""
    cap = repo_version(a["meta"])
    return [r for r in a["releases"] if cap is None or vkey(r["version"]) <= vkey(cap)]


def render_inapp(a):
    """Render the bundled notes file, or None when the app has no generated one."""
    am, fmt = a["meta"], a["meta"].get("inapp_format")
    header = a["sections"].get("In-app header", "").strip("\n")
    rels = inapp_releases(a)
    if fmt == "changelog":          # Hexatone CHANGELOG.md
        parts = [f"## {r['version']}\n\n{r['sections'][WN]}" for r in rels]
        return header + "\n\n" + "\n\n".join(parts) + "\n"
    if fmt == "whatsnew":           # Pond WHATSNEW.md
        parts = [f"## Version {r['version']}\n\n{r['sections'][WN]}" for r in rels]
        return header + "\n\n---\n\n" + "\n\n---\n\n".join(parts) + "\n"
    return None


def swift_card_drift(a):
    """Anima: the What's New card is a Swift array. Compare it to the release it names."""
    am = a["meta"]
    src = (Path(am["repo"]).expanduser() / am["inapp_file"]).read_text(encoding="utf-8")
    title = re.search(r'static let title = "[^"]*?([\d.]+)"', src)
    block = src.split("static let items: [String] = [", 1)[1].split("\n    ]", 1)[0]
    items = [i.replace('\\"', '"') for i in re.findall(r'"((?:[^"\\]|\\.)*)"', block)]
    version = title.group(1) if title else "?"
    rel = next((r for r in a["releases"] if r["version"] == version), None)
    if rel is None:
        return f"card is titled {version}, but there is no releases/{version}.md"
    bullets = [re.sub(r"^-\s+", "", l).strip() for l in rel["sections"]["What's New"].split("\n")
               if re.match(r"^-\s", l)]
    if bullets != items:
        return f"card ({len(items)} items) differs from releases/{version}.md ({len(bullets)} bullets)"
    return None


def main():
    apps = load_apps()
    errors, warnings = validate(apps)
    for a in apps:
        am = a["meta"]
        print(f"\n{am.get('name', a['dir'].name)}  [{am.get('slug')}]  status: {am.get('status', '?')}")
        for r in a["releases"]:
            m = r["meta"]
            news = "news" if "News" in r["sections"] else ""
            print(f"  {r['version']:8} build {m.get('build') or '?':>4}  {r['status']:9} "
                  f"live {m.get('live') or '?':10}  {news}")
        fmt = am.get("inapp_format")
        if fmt in ("changelog", "whatsnew"):
            f = Path(am["repo"]).expanduser() / am["inapp_file"]
            now = f.read_text(encoding="utf-8") if f.exists() else ""
            want = render_inapp(a)
            if now == want:
                state = "in sync"
            elif re.sub(r"\s+", " ", now) == re.sub(r"\s+", " ", want):
                state = "same words, different line wrapping (run build-changelogs.py)"
            else:
                state = "DIFFERS from the release files (run build-changelogs.py --check)"
            print(f"  in-app {am['inapp_file']}: {state}")
        elif fmt == "swift-card":
            drift = swift_card_drift(a)
            print(f"  in-app card: {'in sync' if not drift else 'DRIFT: ' + drift}")
            if drift:
                warnings.append(f"{a['dir'].relative_to(VAULT)}: in-app card {drift}")
    print()
    for w in warnings:
        print("warning:", w)
    for e in errors:
        print("ERROR:  ", e)
    print(f"\n{len(errors)} error(s), {len(warnings)} warning(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
