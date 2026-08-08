#!/usr/bin/env python3
"""Check that every page declares one canonical URL and links only to those.

Run from the repo root: python3 scripts/check_seo.py

Why this exists
---------------
Netlify serves a static file at more than one URL. `about.html` answers 200 at
BOTH /about.html and /about; `dir/index.html` answers 200 at /dir/,
/dir/index.html and /dir. Nothing redirects between those forms, so without a
canonical tag Google sees two identical pages and picks one itself, and with a
canonical tag it still crawls whichever form our own links point at and files
it under "Alternate page with proper canonical tag" in Search Console.

So two rules, and both have to hold for a URL form to stay out of the index:

1. Every indexable page carries exactly one self-referencing canonical.
2. Every internal link uses the same URL form the target page canonicalises
   to, so the duplicate form is never advertised in the first place.

The site's URL conventions (these mirror scripts/build_sitemap.py):

    index.html          ->  /
    <dir>/index.html    ->  /<dir>/
    blog/<slug>.html    ->  /blog/<slug>          (extensionless)
    ready/<slug>.html   ->  /ready/<slug>         (extensionless)
    <course>/<page>.html -> /<course>/<page>.html (keeps .html)
    legal/<page>.html   ->  /legal/<page>.html    (keeps .html)

Lessons and exams keep .html because that is the form their course index,
their NAV blocks, the legacy _redirects targets and the sitemap all use;
changing it would mean touching the frozen NAV/UNITS data for no gain.
"""

import os
import re
import sys

BASE = "https://certify.courses"

SKIP_DIRS = {".git", ".github", ".claude", "node_modules", "netlify", "scripts"}
# Not pages: the Google site-verification stub and the blog post template
# (its canonical is a {{CANONICAL}} placeholder filled in per post).
SKIP_FILES = {"googleef9aef6f3bc362a7.html", "blog/POST_TEMPLATE.html"}
# Served but deliberately kept out of the index with <meta name="robots">.
NOINDEX_DIRS = {"unlock"}

CLEAN_DIRS = {"blog", "ready"}  # published extensionless

CANON_RE = re.compile(r'<link rel="canonical"[^>]*href="([^"]*)"')
HREF_RE = re.compile(r'href="([^"]*)"')
PLACEHOLDER_RE = re.compile(r"COURSE-FOLDER|lesson-NN-name|practice-exam-NN\.html|\{\{|SLUG")


def pages():
    for root, dirs, files in os.walk("."):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS and not d.startswith(".")]
        for name in sorted(files):
            if name.endswith(".html"):
                rel = os.path.relpath(os.path.join(root, name), ".")
                if rel not in SKIP_FILES:
                    yield rel


def canonical_for(rel):
    """The single URL this file must declare, or None if it is not indexed."""
    parts = rel.split("/")
    if parts[0] in NOINDEX_DIRS:
        return None
    if parts[-1] == "index.html":
        return f"{BASE}/" + "".join(f"{p}/" for p in parts[:-1])
    if parts[0] in CLEAN_DIRS and len(parts) > 1:
        return f"{BASE}/{'/'.join(parts[:-1])}/{parts[-1][:-5]}"
    return f"{BASE}/{rel}"


def link_target(rel, href):
    """Resolve an internal href to a repo path, or None if it is external."""
    if re.match(r"^(https?:|mailto:|tel:|#|//)", href) or not href:
        return None
    path = href.split("#")[0].split("?")[0]
    if not path:
        return None
    resolved = os.path.normpath(os.path.join(os.path.dirname(rel), path))
    if resolved.startswith(".."):
        return None
    if path.endswith("/") or os.path.isdir(resolved):
        resolved = os.path.join(resolved, "index.html")
    return resolved if resolved.endswith(".html") else None


def expected_href(rel, target):
    """The href `rel` should use to reach `target`, in canonical form."""
    url = canonical_for(target)
    if url is None:
        return None  # noindex pages may be linked in whatever form
    rel_path = os.path.relpath(url[len(BASE) + 1:] or ".", os.path.dirname(rel) or ".")
    if url.endswith("/"):
        rel_path = "./" if rel_path == "." else rel_path + "/"
    return rel_path


def main():
    errors = []
    for rel in pages():
        text = open(rel, encoding="utf-8").read()
        want = canonical_for(rel)

        found = CANON_RE.findall(text)
        if want is None:
            pass  # noindex: a canonical is harmless either way
        elif not found:
            errors.append(f"{rel}: no <link rel=\"canonical\">; it must declare {want}")
        elif len(found) > 1:
            errors.append(f"{rel}: {len(found)} canonical tags; there must be exactly one")
        elif found[0] != want:
            errors.append(f"{rel}: canonical is {found[0]}, expected {want}")

        if PLACEHOLDER_RE.search("\n".join(found)):
            errors.append(f"{rel}: canonical still holds a template placeholder")

        for href in HREF_RE.findall(text):
            target = link_target(rel, href)
            if target is None or not os.path.exists(target):
                continue
            want_href = expected_href(rel, target)
            if want_href is not None and href.split("#")[0] != want_href:
                errors.append(
                    f'{rel}: links to "{href}" but {target} canonicalises to '
                    f'{canonical_for(target)}; use "{want_href}"'
                )

    if errors:
        for e in errors:
            print(f"FAIL {e}")
        print(f"\n{len(errors)} problem(s). Every page needs one self-referencing "
              "canonical, and every internal link must use that same URL form.")
        return 1
    print(f"ok: canonicals and internal link forms are consistent "
          f"({sum(1 for _ in pages())} pages checked)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
