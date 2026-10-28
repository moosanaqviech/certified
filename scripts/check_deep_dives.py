#!/usr/bin/env python3
"""Check the "Go deeper" links from lessons to blog deep dives.

Run from the repo root: python3 scripts/check_deep_dives.py

A lesson may close with a "Go deeper" block on its final card: an anchor
carrying `data-deeper` that links to a blog post covering the chapter in more
depth (full code, every option, the edge cases a card has no room for). The
markup lives in the lesson payload, so the frozen engine is untouched; see
"Deep dives" in blog/BLOG_STYLE_GUIDE.md for the block and when to add one.

Each link must:

1. use the canonical form `../blog/<slug>` (no .html, no query string),
2. point at a post that exists as blog/<slug>.html,
3. point at a post listed in sitemap.xml (published, not a draft), and
4. be answered by a link from that post back to the lesson, so a reader who
   followed it, in the app's WebView included, always has a way back.

Unlike check_seo.py, which skips links whose target is missing, a broken or
renamed deep dive fails here, so it cannot ship as a dead end.
"""

import os
import re
import sys

DEEPER_RE = re.compile(r'<a\b[^>]*\bdata-deeper\b[^>]*>')
HREF_RE = re.compile(r'href="([^"]*)"')
SLUG_RE = re.compile(r"^\.\./blog/([a-z0-9-]+)$")
SKIP_DIRS = {".git", ".github", ".claude", "node_modules", "netlify", "scripts", "blog"}


def lessons():
    for root, dirs, files in os.walk("."):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS and not d.startswith(".")]
        for name in sorted(files):
            if name.endswith(".html") and root != ".":
                yield os.path.relpath(os.path.join(root, name), ".")


def main():
    sitemap = open("sitemap.xml", encoding="utf-8").read()
    errors, count = [], 0
    for rel in lessons():
        text = open(rel, encoding="utf-8").read()
        for tag in DEEPER_RE.findall(text):
            count += 1
            m = HREF_RE.search(tag)
            href = m.group(1) if m else ""
            sm = SLUG_RE.match(href)
            if not sm:
                errors.append(f'{rel}: Go deeper link "{href}" must be ../blog/<slug>, no extension or query')
                continue
            slug = sm.group(1)
            post = f"blog/{slug}.html"
            if not os.path.exists(post):
                errors.append(f"{rel}: Go deeper link points at {post}, which does not exist")
                continue
            if f"<loc>https://certify.courses/blog/{slug}</loc>" not in sitemap:
                errors.append(f"{rel}: {post} is not in sitemap.xml; publish it before linking it")
            back = "../" + rel.replace(os.sep, "/")
            if f'href="{back}"' not in open(post, encoding="utf-8").read():
                errors.append(f'{rel}: {post} never links back to the lesson (href="{back}")')

    if errors:
        for e in errors:
            print(f"FAIL {e}")
        print(f"\n{len(errors)} problem(s) in Go deeper links.")
        return 1
    print(f"ok: {count} Go deeper link(s), each to a published post that links back")
    return 0


if __name__ == "__main__":
    sys.exit(main())
