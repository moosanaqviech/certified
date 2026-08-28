#!/usr/bin/env python3
"""Regenerate sitemap.xml from what is actually on disk.

Run from the repo root: python3 scripts/build_sitemap.py [--check]

The sitemap had drifted: whole courses were missing because entries were
added by hand as pages shipped. Deriving it from disk keeps it honest.

What gets included, and the two rules that are easy to get wrong:

1. Paywalled pages stay OUT. The edge gate in netlify/edge-functions/gate.ts
   frees each paid course's Unit 1 and gates the rest, so a gated lesson would
   answer a crawler with the paywall, not the lesson. Only the free stems of a
   paid course belong here. FREE_STEMS below mirrors that gate: if the gate's
   free set changes, change it here too.
2. Only known content folders are walked, so /unlock (noindex), the Google
   site-verification file, and the authoring templates under .claude/ are
   excluded by construction. A new content folder has to be added to this
   script before its pages ship.

URL forms follow what each page already declares: blog posts and readiness
quizzes are served at clean extensionless URLs (matching their canonical
tags), lessons and exams keep .html, and a course home is its bare folder.
"""

import argparse
import os
import re
import subprocess
import sys

BASE = "https://certify.courses"

# Courses the edge gate charges for, with the stems it leaves free.
# Mirrors COURSES[].free in netlify/edge-functions/gate.ts.
FREE_STEMS = {
    "databricks-data-engineer-associate": {
        "lesson-01-lakehouse",
        "lesson-02-delta-lake",
        "lesson-03-unity-catalog",
        "lesson-04-compute-cost",
        "practice-exam-01",
    },
    "databricks-data-engineer-professional": {
        "lesson-01-dabs-project-structure",
        "lesson-02-libraries-and-dependencies",
        "lesson-03-python-and-pandas-udfs",
        "lesson-04-production-pipelines",
        "lesson-05-automating-jobs",
        "lesson-06-streaming-tables-vs-materialized-views",
        "lesson-07-cdc-apply-changes",
        "lesson-08-structured-streaming-vs-lakeflow",
        "lesson-09-control-flow-task-config",
        "lesson-10-testing-pipelines",
        "pro-practice-exam-01",
    },
}

# Free courses: every page ships.
OPEN_COURSES = [
    "aws-data-engineer-associate",
    "databricks-machine-learning-associate",
    "databricks-generative-ai-engineer-associate",
]

COURSES = OPEN_COURSES + list(FREE_STEMS)

# Files inside a walked folder that are not pages.
EXCLUDE_FILES = {"blog/POST_TEMPLATE.html"}

PRIORITY = {"root": "1.0", "index": "0.9", "blog": "0.9", "quiz": "0.8", "page": "0.6"}


def require_full_history():
    """Fail loudly on a shallow clone rather than emitting wrong lastmod dates.

    git_date() reads each page's date from `git log -1` on that file. In a
    shallow clone (CI checkouts default to depth 1) almost every file has no
    commit in range, so every date silently collapses onto the fallback and
    --check fails on dates alone. Catch that here so the message names the
    real cause.
    """
    out = subprocess.run(
        ["git", "rev-parse", "--is-shallow-repository"],
        capture_output=True, text=True, check=False,
    ).stdout.strip()
    if out == "true":
        sys.exit(
            "refusing to run against a shallow clone: per-file lastmod dates\n"
            "would all collapse onto the head commit. Fetch full history\n"
            "(actions/checkout with fetch-depth: 0, or `git fetch --unshallow`)."
        )


def git_date(path):
    """Last commit date for a file, or None if git does not know it yet."""
    out = subprocess.run(
        ["git", "log", "-1", "--format=%cs", "--", path],
        capture_output=True, text=True, check=False,
    ).stdout.strip()
    return out or None


def collect():
    """Yield (loc, path, kind) for every page that belongs in the sitemap."""
    yield f"{BASE}/", "index.html", "root"

    # /app.html is a standalone root-level page (app-store landing / QR target),
    # not inside a walked content folder, so it is listed explicitly. Its sibling
    # /get.html is a noindex redirect stub and is deliberately kept out.
    yield f"{BASE}/app.html", "app.html", "page"

    yield f"{BASE}/blog/", "blog/index.html", "index"
    for name in sorted(os.listdir("blog")):
        if not name.endswith(".html") or name == "index.html":
            continue
        if f"blog/{name}" in EXCLUDE_FILES:
            continue
        yield f"{BASE}/blog/{name[:-5]}", f"blog/{name}", "blog"

    for course in COURSES:
        yield f"{BASE}/{course}/", f"{course}/index.html", "index"
        free = FREE_STEMS.get(course)
        for name in sorted(os.listdir(course)):
            if not name.endswith(".html") or name == "index.html":
                continue
            stem = name[:-5]
            if free is not None and stem not in free:
                continue  # behind the paywall
            yield f"{BASE}/{course}/{name}", f"{course}/{name}", "page"

    for name in sorted(os.listdir("ready")):
        if name.endswith(".html"):
            yield f"{BASE}/ready/{name[:-5]}", f"ready/{name}", "quiz"

    for name in sorted(os.listdir("legal")):
        if name.endswith(".html"):
            yield f"{BASE}/legal/{name}", f"legal/{name}", "page"

    if os.path.isdir("press"):
        for name in sorted(os.listdir("press")):
            if name.endswith(".html"):
                yield f"{BASE}/press/{name}", f"press/{name}", "page"


def build():
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    seen, count = set(), 0
    for loc, path, kind in collect():
        if loc in seen:
            sys.exit(f"duplicate URL: {loc}")
        seen.add(loc)
        if not os.path.exists(path):
            sys.exit(f"missing file for {loc}: {path}")
        lastmod = git_date(path) or "2026-08-07"
        lines += ["  <url>", f"    <loc>{loc}</loc>",
                  f"    <lastmod>{lastmod}</lastmod>",
                  f"    <priority>{PRIORITY[kind]}</priority>", "  </url>"]
        count += 1
    lines.append("</urlset>")
    return "\n".join(lines) + "\n", count


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true",
                    help="exit non-zero if sitemap.xml is out of date")
    args = ap.parse_args()

    require_full_history()
    xml, count = build()
    current = open("sitemap.xml").read() if os.path.exists("sitemap.xml") else ""
    if args.check:
        if xml != current:
            print("sitemap.xml is out of date; run python3 scripts/build_sitemap.py")
            return 1
        print(f"sitemap.xml up to date ({count} URLs)")
        return 0

    open("sitemap.xml", "w").write(xml)
    before = len(re.findall(r"<loc>", current))
    print(f"wrote sitemap.xml: {count} URLs (was {before})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
