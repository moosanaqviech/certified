#!/usr/bin/env python3
"""Fill catalog.json's per-cert display fields from the root catalog page.

catalog.json is the feed the iOS and Android app renders its course list
from. The website's catalog page (root index.html) already shows the same
facts on each cert row: chapter, question and mock counts, the unlock price,
the "Last verified" date, the difficulty chip, the topic icon and the Read the
guide / Am I ready? / Practice links. This script reads them from that page,
so the page stays the one place they are typed and catalog.json can never
disagree with it.

What it owns: the optional display fields in FIELDS below, accent and ink,
and generated_at. accent and ink are the vendor tile colours the page draws
(style.css .cert-logo--<vendor>: accent is the tile tint's base colour, ink
the glyph colour), so the app's tiles match the site's. What it leaves alone:
every other key (id, vendor, track, exam_code, units, ...), which stays
hand-edited in catalog.json. A live cert row is matched to its catalog.json
entry by the course folder of its "Start learning" link, compared with the
entry's lesson_url; a cert's vendor tile comes from the page's vendor section
whose heading names its vendor.

Rules:
  * A field is written only when the page shows a real value for it, and is
    removed when the page stops showing one. Never 0, "", null or a guessed
    URL. (The AIF-C01 and SAA-C03 rows read "4 practice exams", not "N
    scenario questions", so they get no questions_total.)
  * lessons_total is an existing field and is not rewritten, but the run
    fails if it disagrees with the row's "N chapters".
  * generated_at moves only when the certs actually change, so re-running on
    an unchanged page is a no-op and --check is stable in CI.

Usage:
  python3 scripts/build_catalog.py           rewrite catalog.json
  python3 scripts/build_catalog.py --check   exit 1 if catalog.json is stale
"""

import html
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGE = ROOT / "index.html"
STYLE = ROOT / "style.css"
CATALOG = ROOT / "catalog.json"
BASE = "https://certify.courses/"

# The display fields this script owns, in the order they are written after the
# hand-edited keys.
FIELDS = [
    "questions_total",
    "mocks_total",
    "level",
    "last_verified",
    "icon",
    "practice_url",
    "ready_url",
    "guide_url",
    "price",
    "price_note",
]

LEVELS = {"foundational", "associate", "professional", "specialty"}

# The topic glyphs the catalog cards draw, keyed by a fragment unique to each
# glyph's SVG markup. The cert-logo--* class is not used because it does not
# track the glyph (the analytics bars and the Spark star both carry
# cert-logo--data). A glyph not listed here (the SAA-C03 layers stack) gets no
# icon, since the app's icon set has no match for it.
ICONS = [
    ('<ellipse cx="12" cy="6" rx="7" ry="3"/>', "database"),   # cylinder
    ('<circle cx="18" cy="6" r="2.4"/>', "ml"),                # node graph
    ('<path d="M4 20V10"/>', "analytics"),                     # bar chart
    ('<path d="M12 3l2.6 5.3', "spark"),                       # five-point star
    ('<path d="M11 4l1.8 4.7', "genai"),                       # sparkles
    ('<path d="M12 3l1.8 4.6', "genai"),                       # sparkles (AIF-C01 cut)
]

MONTHS = {m: i for i, m in enumerate(
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], start=1)}


class CatalogError(Exception):
    pass


def text(fragment):
    """Visible text of an HTML fragment, whitespace collapsed."""
    return " ".join(html.unescape(re.sub(r"<[^>]+>", " ", fragment)).split())


def absolute(href):
    if href.startswith(("http://", "https://", "#")) or href.startswith("/"):
        raise CatalogError(f"unexpected link form on the catalog page: {href!r}")
    return BASE + href


def live_rows(page):
    """Each live cert row's HTML (rows with a "Start learning" link)."""
    chunks = re.split(r'(?=<div class="cert-row[ "])', page)
    rows = []
    for chunk in chunks[1:]:
        if 'class="cta-button"' in chunk:
            rows.append(chunk)
    return rows


def parse_row(row):
    """The catalog fields one cert row shows, plus its folder and chapters."""
    def one(pattern, what, required=True):
        m = re.search(pattern, row, re.S)
        if not m and required:
            raise CatalogError(f"cert row has no {what}:\n{row[:300]}")
        return m

    folder = one(r'<a class="cta-button" href="([^"/]+)/"', "Start learning link").group(1)
    out = {}

    meta = text(one(r'<div class="cert-meta">(.*?)</div>', "cert-meta line").group(1))
    chapters = re.search(r"(\d+) chapters", meta)
    if not chapters:
        raise CatalogError(f"{folder}: no chapter count in {meta!r}")
    q = re.search(r"(\d+) scenario questions", meta)
    if q and int(q.group(1)) > 0:
        out["questions_total"] = int(q.group(1))
    mocks = re.search(r"(\d+) full(?:-length)? mocks?", meta)
    if mocks and int(mocks.group(1)) > 0:
        out["mocks_total"] = int(mocks.group(1))

    level = one(r'difficulty-badge--([a-z]+)"', "difficulty chip").group(1)
    if level not in LEVELS:
        raise CatalogError(f"{folder}: difficulty chip {level!r} is not one of {sorted(LEVELS)}")
    out["level"] = level

    verified = re.search(r"Last verified (\d{1,2}) ([A-Z][a-z]{2}) (\d{4})", row)
    if verified:
        d, mon, y = verified.groups()
        if mon not in MONTHS:
            raise CatalogError(f"{folder}: bad month in 'Last verified' date: {mon!r}")
        out["last_verified"] = f"{y}-{MONTHS[mon]:02d}-{int(d):02d}"

    logo = one(r'<div class="cert-logo[^"]*">(.*?)</div>', "cert logo").group(1)
    for marker, icon in ICONS:
        if marker in logo:
            out["icon"] = icon
            break

    practice = re.search(r'<a class="practice-link" href="([^"]+)"', row)
    if practice:
        out["practice_url"] = absolute(practice.group(1))
    for href, label in re.findall(r'<a class="guide-link" href="([^"]+)">([^<]+)</a>', row):
        label = text(label)
        if label == "Am I ready?":
            out["ready_url"] = absolute(href)
        elif label == "Read the guide":
            out["guide_url"] = absolute(href)
        else:
            raise CatalogError(f"{folder}: unknown guide link label {label!r}")

    facts = re.search(r'<span class="cert-price">([^<]+)</span>([^<]*)</span>', row)
    if facts:
        price, note = text(facts.group(1)), text(facts.group(2))
        if price:
            out["price"] = price
        if note:
            out["price_note"] = note

    return folder, int(chapters.group(1)), out


def tile_colours(css):
    """{vendor class: (accent, ink)} from style.css's .cert-logo--<vendor> rules."""
    out = {}
    for name, body in re.findall(r"\.cert-logo--([a-z]+)\s*\{([^}]*)\}", css):
        ink = re.search(r"--tile-ink:\s*#([0-9a-fA-F]{6})\s*;", body)
        tint = re.search(r"--tile-bg:\s*rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,", body)
        if ink and tint:
            accent = "#" + "".join(f"{int(c):02X}" for c in tint.groups())
            out[name] = (accent, "#" + ink.group(1).upper())
    return out


def vendor_tiles(page, colours):
    """{vendor heading: (accent, ink)}, one tile class per vendor section."""
    out = {}
    for section in re.split(r'(?=<section class="vendor-section)', page)[1:]:
        heading = re.search(r'<h2 class="vendor-name"[^>]*>(.*?)</h2>', section, re.S)
        if not heading:
            continue
        name = text(heading.group(1))
        classes = set(re.findall(r'class="cert-logo cert-logo--([a-z]+)', section))
        if len(classes) != 1:
            raise CatalogError(f"vendor section {name!r} mixes tile classes {sorted(classes)}")
        cls = classes.pop()
        if cls not in colours:
            raise CatalogError(f"style.css has no tile colours for .cert-logo--{cls}")
        out[name] = colours[cls]
    return out


def tile_for(vendor, tiles):
    for name, colours in tiles.items():
        if vendor == name or vendor in [part.strip() for part in name.split("/")]:
            return colours
    raise CatalogError(f"no vendor section on the catalog page for vendor {vendor!r}")


def folder_of(lesson_url):
    m = re.match(re.escape(BASE) + r"([^/]+)/", lesson_url or "")
    return m.group(1) if m else None


def build(catalog, page, css):
    tiles = vendor_tiles(page, tile_colours(css))
    rows = {}
    for row in live_rows(page):
        folder, chapters, fields = parse_row(row)
        if folder in rows:
            raise CatalogError(f"two live cert rows link to {folder}/")
        rows[folder] = (chapters, fields)

    certs = []
    seen = set()
    for cert in catalog["certs"]:
        base = {k: v for k, v in cert.items() if k not in FIELDS}
        base["accent"], base["ink"] = tile_for(cert["vendor"], tiles)
        folder = folder_of(cert.get("lesson_url"))
        if cert.get("status") == "live":
            if folder not in rows:
                raise CatalogError(
                    f"{cert['id']}: live in catalog.json but the catalog page has no "
                    f"live row linking to {folder}/")
            chapters, fields = rows[folder]
            seen.add(folder)
            if cert.get("lessons_total") != chapters:
                raise CatalogError(
                    f"{cert['id']}: lessons_total is {cert.get('lessons_total')} but the "
                    f"catalog page shows {chapters} chapters")
            base.update({k: fields[k] for k in FIELDS if k in fields})
        certs.append(base)

    missing = sorted(set(rows) - seen)
    if missing:
        raise CatalogError(
            "the catalog page has live rows with no live catalog.json entry: "
            + ", ".join(f"{f}/" for f in missing))
    return certs


def render(data):
    return json.dumps(data, indent=2, ensure_ascii=False) + "\n"


def main(argv):
    check = "--check" in argv
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    try:
        certs = build(catalog, PAGE.read_text(encoding="utf-8"),
                      STYLE.read_text(encoding="utf-8"))
    except CatalogError as e:
        print(f"build_catalog: {e}", file=sys.stderr)
        return 1

    if certs == catalog["certs"]:
        print(f"catalog.json up to date ({len(certs)} certs)")
        return 0
    if check:
        print("catalog.json is stale: run python3 scripts/build_catalog.py",
              file=sys.stderr)
        return 1

    catalog["certs"] = certs
    catalog["generated_at"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    CATALOG.write_text(render(catalog), encoding="utf-8")
    print(f"wrote catalog.json ({len(certs)} certs)")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
