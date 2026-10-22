#!/usr/bin/env python3
"""Write each app's bundled in-app release notes from the vault release files.

    python3 tools/build-changelogs.py            write them (into each app repo; not committed)
    python3 tools/build-changelogs.py --check    show what would change, write nothing

Which file and which format come from the app's <App>/Public/app.md:
    repo, inapp_file, inapp_format (changelog = Hexatone CHANGELOG.md, whatsnew = Pond
    WHATSNEW.md), project_yml (caps the notes at the repo's MARKETING_VERSION, so a draft
    for a later version never leaks into an earlier build).
Anima's card is Swift code (inapp_format: swift-card); it is only checked for drift, by
tools/releases.py, never written.
"""
import difflib
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import releases  # noqa: E402


def main():
    check = "--check" in sys.argv[1:]
    apps = releases.load_apps()
    errors, _ = releases.validate(apps)
    if errors:
        for e in errors:
            print("ERROR:", e)
        raise SystemExit("fix the release files first (python3 tools/releases.py)")
    changed = 0
    for a in apps:
        am = a["meta"]
        want = releases.render_inapp(a)
        if want is None:
            continue
        f = Path(am["repo"]).expanduser() / am["inapp_file"]
        now = f.read_text(encoding="utf-8") if f.exists() else ""
        cap = releases.repo_version(am) or "all"
        if now == want:
            print(f"{am['slug']:10} {f}  in sync (up to {cap})")
            continue
        changed += 1
        if check:
            print(f"{am['slug']:10} {f}  WOULD CHANGE (up to {cap}):")
            sys.stdout.writelines(difflib.unified_diff(
                now.splitlines(True), want.splitlines(True), "repo", "from release files", n=1))
        else:
            f.write_text(want, encoding="utf-8")
            print(f"{am['slug']:10} {f}  written (up to {cap}); review and commit in that repo")
    return 1 if (check and changed) else 0


if __name__ == "__main__":
    sys.exit(main())
