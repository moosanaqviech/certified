#!/usr/bin/env python3
"""Ping IndexNow (Bing Webmaster Tools and friends) with pages that changed.

Run from the repo root:

    python3 scripts/indexnow.py --changed            # pages touched by HEAD
    python3 scripts/indexnow.py --changed --since main
    python3 scripts/indexnow.py --all                # every URL in sitemap.xml
    python3 scripts/indexnow.py --url https://certify.courses/blog/some-post
    python3 scripts/indexnow.py --all --dry-run      # print, submit nothing

Why this exists
---------------
Google finds new pages on its own schedule via sitemap.xml. Bing does not
have to wait: IndexNow is a push protocol, so one HTTP POST after a deploy
tells Bing (and Yandex, Seznam, Naver, and the other participating engines,
which share submissions with each other) exactly which URLs changed. A blog
post that would otherwise sit uncrawled for days gets picked up in hours.

Ownership is proved by a key file served from the site root. The key is
public by design: it only proves that whoever submits URLs can also publish
files on the host, so it is committed to the repo rather than kept in a
GitHub secret. Bing Webmaster Tools generates a key under Configure My Site
-> IndexNow; any 8 to 128 character hex-ish string works just as well, and
swapping ours for one generated there is a two step change: rename the root
key file and put the new value inside it.

The two rules that keep submissions honest
------------------------------------------
1. Only URLs that appear in sitemap.xml are ever submitted. That file is
   generated from disk by scripts/build_sitemap.py and already excludes the
   paywalled lessons (a gated URL answers a crawler with the paywall, not the
   lesson) and every non-canonical URL form. Filtering through it means this
   script cannot invent a URL the site does not want indexed.
2. Changed files are mapped to URLs with check_seo.py's canonical_for(), the
   same function CI uses to enforce canonical tags, so a page is submitted
   under exactly the URL form it canonicalises to.

Exit status is non-zero if the endpoint rejects the submission, so a broken
key or a malformed payload shows up as a red run instead of silence.
"""

import argparse
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from check_seo import BASE, canonical_for  # noqa: E402  (shares the URL rules)

HOST = BASE.split("//", 1)[1]

# Any participating endpoint forwards the submission to all the others, so
# this one call covers Bing, Yandex, Seznam, Naver and the rest. Override with
# --endpoint https://www.bing.com/indexnow to talk to Bing directly.
DEFAULT_ENDPOINT = "https://api.indexnow.org/indexnow"

# Protocol cap per request.
MAX_URLS_PER_REQUEST = 10_000

KEY_FILE_RE = re.compile(r"^[A-Za-z0-9-]{8,128}\.txt$")

LOC_RE = re.compile(r"<loc>([^<]+)</loc>")

# What the endpoint tells us, in the order the protocol documents it.
STATUS_MEANING = {
    200: "OK, URLs submitted",
    202: "accepted, key validation pending",
    400: "bad request (malformed payload)",
    403: "forbidden: the key file did not validate against the host",
    422: "unprocessable: URLs do not belong to the host, or the key is malformed",
    429: "too many requests (rate limited)",
}


def find_key():
    """Return (key, key_location) from the single key file at the repo root.

    The file has to be named <key>.txt and contain that same key, which is
    what the endpoint fetches to verify ownership. Requiring exactly one such
    file at the root keeps a stray root-level .txt from being mistaken for it.
    """
    candidates = [
        n for n in sorted(os.listdir("."))
        if KEY_FILE_RE.match(n) and os.path.isfile(n)
    ]
    if not candidates:
        sys.exit(
            "no IndexNow key file at the repo root. Create <key>.txt containing\n"
            "that key (32 hex characters is plenty), commit it, and deploy so it\n"
            f"is served at {BASE}/<key>.txt."
        )
    if len(candidates) > 1:
        sys.exit(
            "more than one file at the repo root looks like an IndexNow key file: "
            + ", ".join(candidates)
        )
    name = candidates[0]
    key = name[:-4]
    body = open(name, encoding="utf-8").read().strip()
    if body != key:
        sys.exit(
            f"{name} must contain exactly its own key ({key}), but holds {body!r}. "
            "The endpoint fetches this file and compares it to the submitted key."
        )
    return key, f"{BASE}/{name}"


def sitemap_urls():
    """Every URL the site wants indexed, as written in sitemap.xml."""
    if not os.path.exists("sitemap.xml"):
        sys.exit("sitemap.xml is missing; run python3 scripts/build_sitemap.py")
    urls = LOC_RE.findall(open("sitemap.xml", encoding="utf-8").read())
    if not urls:
        sys.exit("sitemap.xml has no <loc> entries")
    return urls


def resolve_since(ref):
    """A commit to diff against, falling back to HEAD~1 when `ref` is unusable.

    On the first push of a branch GitHub reports a before-sha of all zeros,
    and a force push can leave a before-sha that is no longer reachable. Both
    should degrade to "what this commit changed", not crash the run.
    """
    if ref and set(ref) != {"0"}:
        ok = subprocess.run(
            ["git", "cat-file", "-e", f"{ref}^{{commit}}"],
            capture_output=True, check=False,
        ).returncode == 0
        if ok:
            return ref
        print(f"note: {ref} is not in this clone; diffing HEAD~1..HEAD instead")
    return "HEAD~1"


def changed_pages(since):
    """URLs for the .html files added, copied, modified or renamed since `since`.

    Deletions are skipped: IndexNow does accept removed URLs (the crawler
    fetches them, gets a 404 and drops them), but a deleted page here is
    normally a rename, and the new URL is already in the same diff.
    """
    out = subprocess.run(
        ["git", "diff", "--name-only", "--diff-filter=ACMRT", f"{since}..HEAD"],
        capture_output=True, text=True, check=True,
    ).stdout.split()
    urls = []
    for path in out:
        if not path.endswith(".html"):
            continue
        url = canonical_for(path)  # None for the noindex folders
        if url and url not in urls:
            urls.append(url)
    return urls


def post(endpoint, payload, attempts=3):
    """POST the payload, retrying the statuses that are worth retrying."""
    body = json.dumps(payload).encode()
    request = urllib.request.Request(
        endpoint, data=body, method="POST",
        headers={"Content-Type": "application/json; charset=utf-8"},
    )
    for attempt in range(1, attempts + 1):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                code, detail = response.status, response.read(500).decode(errors="replace")
        except urllib.error.HTTPError as e:
            code, detail = e.code, e.read(500).decode(errors="replace")
        except urllib.error.URLError as e:
            code, detail = None, str(e.reason)

        label = STATUS_MEANING.get(code, "unexpected response")
        if code in (200, 202):
            print(f"{code} {label}")
            return True
        retryable = code is None or code == 429 or (code and code >= 500)
        print(f"{code or 'network error'} {label}: {detail.strip()[:300]}")
        if not retryable or attempt == attempts:
            return False
        delay = 2 ** attempt
        print(f"retrying in {delay}s ({attempt}/{attempts - 1} used)")
        time.sleep(delay)
    return False


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    mode = ap.add_mutually_exclusive_group(required=True)
    mode.add_argument("--changed", action="store_true",
                      help="submit pages touched since --since (default HEAD~1)")
    mode.add_argument("--all", action="store_true",
                      help="submit every URL in sitemap.xml")
    mode.add_argument("--url", action="append", metavar="URL",
                      help="submit one URL (repeatable)")
    mode.add_argument("--key-url", action="store_true",
                      help="print the key file URL and exit; CI polls it to "
                           "confirm the deploy is live before submitting")
    ap.add_argument("--since", default="HEAD~1", metavar="REF",
                    help="commit to diff against with --changed")
    ap.add_argument("--endpoint", default=DEFAULT_ENDPOINT,
                    help=f"IndexNow endpoint (default {DEFAULT_ENDPOINT})")
    ap.add_argument("--dry-run", action="store_true",
                    help="print what would be submitted and stop")
    args = ap.parse_args()

    key, key_location = find_key()
    if args.key_url:
        print(key_location)
        return 0

    indexable = sitemap_urls()

    if args.all:
        urls, dropped = indexable, []
    else:
        wanted = args.url or changed_pages(resolve_since(args.since))
        allowed = set(indexable)
        urls = [u for u in wanted if u in allowed]
        dropped = [u for u in wanted if u not in allowed]

    for url in dropped:
        print(f"skipped (not in sitemap.xml): {url}")

    if not urls:
        print("nothing to submit")
        return 0

    print(f"{len(urls)} URL(s) for {HOST}, key file {key_location}")
    for url in urls[:50]:
        print(f"  {url}")
    if len(urls) > 50:
        print(f"  ... and {len(urls) - 50} more")

    if args.dry_run:
        print("dry run: nothing submitted")
        return 0

    ok = True
    for start in range(0, len(urls), MAX_URLS_PER_REQUEST):
        batch = urls[start:start + MAX_URLS_PER_REQUEST]
        ok = post(args.endpoint, {
            "host": HOST,
            "key": key,
            "keyLocation": key_location,
            "urlList": batch,
        }) and ok
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
