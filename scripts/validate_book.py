#!/usr/bin/env python3
"""Validate book lessons built on the book engine (books/engine/book-engine.v1.js).

Usage, from the repo root:
    python3 scripts/validate_book.py books/<book-id>            # the whole book
    python3 scripts/validate_book.py books/<book-id>/lesson-01-x.html

Exits non-zero on any failure. This is separate from scripts/validate.py, which
checks the certification lessons and exams and knows nothing about books.

The validator checks structure, not quality: whether a wrong answer's
explanation is any good is a job for the author's review.
"""

import json
import os
import re
import sys

# ---- limits: the proposals from the strategy doc, tuned from pilot data ----
MIN_CARDS, MAX_CARDS = 12, 20
MAX_PASSIVE_RUN = 5          # consecutive non-producing cards after the cover: books are read more than drilled
# Practice is measured across the whole book, so one lesson can be mostly
# visual while another is mostly practice; each lesson keeps a small floor.
MIN_PRODUCING_SHARE = 1 / 5  # per lesson
BOOK_PRODUCING_SHARE = 1 / 3 # across all of a book's lessons
HOOK_WITHIN = 5              # a lesson may open with a puzzle, story, number or diagram;
                             # its first question lands by card N
QUESTION_TYPES = {"choice", "predict", "sort", "bucket"}
MIN_QUESTION_KINDS = 2       # a lesson with 3+ questions mixes at least this many kinds;
                             # with "mix": true, no kind may be more than half
OPENER_WINDOW = 3            # in variety books, no two lessons this close open alike
MIN_REVIEW = 2
MIN_STEPPED = 2
MIN_OPTIONS, MAX_OPTIONS = 2, 4

# Card types the v1 engine renders.
TYPES = {"cover", "concept", "case", "compare", "scene", "video", "dialogue",
         "timeline", "figure", "evolve", "choice",
         "predict", "sort", "bucket", "reflect", "commit", "done"}
PRODUCING = {"choice", "predict", "sort", "bucket", "reflect", "commit"}
REVIEWABLE = {"choice", "predict", "sort", "bucket"}

FIELDS = {
    "cover": {"id", "type", "eyebrow", "title", "art", "alt", "lead", "look"},
    "concept": {"id", "type", "title", "body", "art", "alt", "steps", "look"},
    "case": {"id", "type", "title", "body", "art", "alt", "steps", "look"},
    "compare": {"id", "type", "title", "columns", "rows", "body"},
    "scene": {"id", "type", "title", "body", "art", "alt", "steps", "model", "fallback", "look"},
    "video": {"id", "type", "title", "lead", "host", "sources", "poster", "captions",
              "transcript", "seconds"},
    "dialogue": {"id", "type", "title", "cast", "lines", "body"},
    "timeline": {"id", "type", "title", "events", "body"},
    "figure": {"id", "type", "title", "value", "caption", "body"},
    "evolve": {"id", "type", "title", "label", "alt", "look", "stages"},
    "choice": {"id", "type", "prompt", "options", "select", "art", "alt", "look", "review", "variants"},
    "sort": {"id", "type", "prompt", "items", "why", "review", "variants"},
    "bucket": {"id", "type", "prompt", "buckets", "items", "why", "review", "variants"},
    "commit": {"id", "type", "prompt", "minChars", "suggestions"},
    "predict": {"id", "type", "prompt", "options", "takeaway", "art", "alt", "look", "review", "variants"},
    "reflect": {"id", "type", "prompt", "minChars", "example"},
    "done": {"id", "type", "title", "can"},
}
LESSON_FIELDS = {"schema", "book", "n", "title", "idea", "cards"}
RIGHTS_TIERS = {"public-domain", "original", "licensed"}

BASE = "https://certify.courses"
LESSON_RE = re.compile(r'<script type="application/json" id="lesson">(.*?)</script>', re.S)
PALETTE_RE = re.compile(r'<style id="palette">:root\{(.*?)\}</style>')
ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")
EM_DASH = "—"


def hex_luminance(value):
    value = value.lstrip("#")
    if len(value) == 3:
        value = "".join(ch * 2 for ch in value)
    chans = []
    for i in (0, 2, 4):
        c = int(value[i:i + 2], 16) / 255
        chans.append(c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * chans[0] + 0.7152 * chans[1] + 0.0722 * chans[2]


def contrast(a, b):
    la, lb = sorted((hex_luminance(a), hex_luminance(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def strings(node):
    """Every string value in a JSON tree."""
    if isinstance(node, str):
        yield node
    elif isinstance(node, dict):
        for v in node.values():
            yield from strings(v)
    elif isinstance(node, list):
        for v in node:
            yield from strings(v)


def check_art(where, card, errors):
    art = card.get("art")
    if art is None:
        return
    if not art.lstrip().startswith("<svg") or not art.rstrip().endswith("</svg>"):
        errors.append(f"{where}: art must be one <svg> element")
    low = art.lower()
    if "<script" in low or re.search(r"\son\w+\s*=", low) or "javascript:" in low:
        errors.append(f"{where}: art must not contain script or event handlers")
    if re.search(r"<animate|<set[\s>]", low):
        errors.append(f"{where}: SMIL animation is not allowed; use CSS keyframes")
    if re.search(r"stop-color\s*=", low):
        errors.append(f"{where}: gradient stops must use style form, not the stop-color attribute")
    if "@keyframes" in low and "prefers-reduced-motion" not in low:
        errors.append(f"{where}: animated art must stop under prefers-reduced-motion")
    if card["type"] == "cover":
        if "@keyframes" not in low:
            errors.append(f"{where}: the cover art must be animated with CSS keyframes")
    elif not card.get("alt"):
        errors.append(f"{where}: art needs an alt text")


def check_steps(where, card, errors):
    found = set()
    for b in card.get("body") or []:
        if isinstance(b, dict) and "step" in b:
            found.add(b["step"])
    for m in re.finditer(r"data-step='(\d+)'|data-step=\"(\d+)\"", card.get("art") or ""):
        found.add(int(m.group(1) or m.group(2)))
    n = card.get("steps")
    if n is None:
        if found:
            errors.append(f"{where}: has stepped elements but no steps count")
        return
    if not isinstance(n, int) or n < 1:
        errors.append(f"{where}: steps must be a positive whole number")
        return
    if found != set(range(1, n + 1)):
        errors.append(f"{where}: steps is {n} but stepped elements cover {sorted(found)}; they must cover 1 to {n}")


def check_options(where, card, errors):
    opts = card.get("options")
    if not isinstance(opts, list) or not MIN_OPTIONS <= len(opts) <= MAX_OPTIONS:
        errors.append(f"{where}: needs {MIN_OPTIONS} to {MAX_OPTIONS} options")
        return
    if card["type"] == "choice":
        allowed, flag, expl = {"text", "correct", "why"}, "correct", "why"
    else:
        allowed, flag, expl = {"text", "best", "outcome"}, "best", "outcome"
    for k, o in enumerate(opts, 1):
        if not isinstance(o, dict) or not o.get("text"):
            errors.append(f"{where}: option {k} needs text")
            continue
        extra = set(o) - allowed
        if extra:
            errors.append(f"{where}: option {k} has unknown fields {sorted(extra)}")
        if not o.get(expl):
            errors.append(f"{where}: option {k} needs a \"{expl}\" (every option is explained, not only the right one)")
    flagged = sum(1 for o in opts if isinstance(o, dict) and o.get(flag))
    if card["type"] == "choice":
        want = card.get("select", 1)
        if not isinstance(want, int) or want < 1 or want >= len(opts):
            errors.append(f"{where}: select must be a whole number smaller than the option count")
        elif "select" in card and want < 2:
            errors.append(f"{where}: leave select out for a single-answer question")
        elif flagged != want:
            errors.append(f"{where}: {want} option(s) must be correct, found {flagged}")
    if card["type"] == "predict" and flagged < 1:
        errors.append(f"{where}: at least one option must be marked best")
    if card["type"] == "predict" and not card.get("takeaway"):
        errors.append(f"{where}: predict cards need a takeaway")


# Visual formats, for the variety rules. A card with art names its `look`;
# some card types are a format in themselves.
LOOKS = {"diagram", "illustration", "comic", "portrait", "map"}
FORMAT_TYPES = {"dialogue", "timeline", "figure", "compare", "scene", "video", "evolve"}
STORY_TYPES = {"case", "dialogue", "timeline", "scene"}
MIN_FORMATS = 3


def check_dialogue(where, card, errors):
    cast, lines = card.get("cast"), card.get("lines")
    if not isinstance(cast, list) or not 2 <= len(cast) <= 3:
        errors.append(f"{where}: a dialogue has 2 or 3 cast members")
        return
    ids = []
    for k, m in enumerate(cast, 1):
        if not isinstance(m, dict) or not m.get("id") or not m.get("name"):
            errors.append(f"{where}: cast member {k} needs id and name")
            continue
        extra = set(m) - {"id", "name", "side", "art"}
        if extra:
            errors.append(f"{where}: cast member {k} has unknown fields {sorted(extra)}")
        if m.get("side") not in (None, "left", "right"):
            errors.append(f"{where}: cast member {k} side must be left or right")
        if m.get("art"):
            check_art(f"{where} cast {m['id']}", {"type": "cover-avatar", "art": m["art"], "alt": "avatar"}, errors)
        ids.append(m["id"])
    if not isinstance(lines, list) or not 3 <= len(lines) <= 8:
        errors.append(f"{where}: a dialogue has 3 to 8 lines")
        return
    for k, ln in enumerate(lines, 1):
        if not isinstance(ln, dict) or set(ln) != {"who", "text"} or not ln["text"]:
            errors.append(f"{where}: line {k} needs who and text")
        elif ln["who"] not in ids:
            errors.append(f"{where}: line {k} is spoken by {ln['who']!r}, who is not in the cast")
        elif len(ln["text"]) > 220:
            errors.append(f"{where}: line {k} is too long for a speech bubble (220 characters at most)")
    if len({ln.get("who") for ln in lines if isinstance(ln, dict)}) < 2:
        errors.append(f"{where}: a dialogue needs at least two speakers")


def check_timeline(where, card, errors):
    events = card.get("events")
    if not isinstance(events, list) or not 3 <= len(events) <= 7:
        errors.append(f"{where}: a timeline has 3 to 7 events")
        return
    for k, ev in enumerate(events, 1):
        if not isinstance(ev, dict) or not ev.get("when") or not ev.get("label"):
            errors.append(f"{where}: event {k} needs when and label")
        elif set(ev) - {"when", "label", "detail"}:
            errors.append(f"{where}: event {k} has unknown fields")


def check_figure(where, card, errors):
    value = card.get("value")
    if not isinstance(value, str) or not 1 <= len(value) <= 24:
        errors.append(f"{where}: value is the big number or phrase, 24 characters at most")
    if not card.get("caption"):
        errors.append(f"{where}: needs a caption saying what the number is")


def check_compare(where, card, errors):
    cols, rows = card.get("columns"), card.get("rows")
    if not isinstance(cols, list) or not 2 <= len(cols) <= 4:
        errors.append(f"{where}: needs 2 to 4 columns (the first may be an empty row-label column)")
        return
    if not isinstance(rows, list) or not 2 <= len(rows) <= 6:
        errors.append(f"{where}: needs 2 to 6 rows")
        return
    for k, row in enumerate(rows, 1):
        if not isinstance(row, list) or len(row) != len(cols):
            errors.append(f"{where}: row {k} must have {len(cols)} cells")


def check_sort(where, card, errors):
    items = card.get("items")
    if not isinstance(items, list) or not 3 <= len(items) <= 6 or not all(isinstance(i, str) and i for i in items):
        errors.append(f"{where}: needs 3 to 6 text items, listed in the correct order")
    elif len(set(items)) != len(items):
        errors.append(f"{where}: items must be distinct")
    if not card.get("why"):
        errors.append(f"{where}: needs a why")


def check_bucket(where, card, errors):
    buckets, items = card.get("buckets"), card.get("items")
    if not isinstance(buckets, list) or not 2 <= len(buckets) <= 3 or not all(
            isinstance(b, dict) and set(b) == {"id", "name"} and b["id"] and b["name"] for b in buckets):
        errors.append(f"{where}: needs 2 or 3 buckets, each with id and name")
        return
    ids = [b["id"] for b in buckets]
    if len(set(ids)) != len(ids):
        errors.append(f"{where}: bucket ids must be distinct")
    if not isinstance(items, list) or not 4 <= len(items) <= 8:
        errors.append(f"{where}: needs 4 to 8 items")
        return
    used = set()
    for k, it in enumerate(items, 1):
        if not isinstance(it, dict) or set(it) != {"text", "bucket"} or not it["text"]:
            errors.append(f"{where}: item {k} needs text and bucket")
        elif it["bucket"] not in ids:
            errors.append(f"{where}: item {k} names an unknown bucket {it['bucket']!r}")
        else:
            used.add(it["bucket"])
    if used != set(ids):
        errors.append(f"{where}: every bucket needs at least one item")
    if not card.get("why"):
        errors.append(f"{where}: needs a why")


MAX_VIDEOS = 1
VIDEO_SECONDS = (30, 60)
DRIVE_ID_RE = re.compile(r"^[A-Za-z0-9_-]{20,}$")
YOUTUBE_ID_RE = re.compile(r"^[A-Za-z0-9_-]{11}$")
SHAPES = {"portrait", "landscape"}


def check_video(where, card, folder, errors):
    """A video card is optional, but one that exists must be complete: both
    shapes, a poster for each, captions and a transcript."""
    host = card.get("host")
    if host not in ("youtube", "file", "drive"):
        errors.append(f"{where}: host must be \"youtube\", \"file\" or \"drive\"")
        return
    sources, poster = card.get("sources"), card.get("poster")
    if not isinstance(sources, dict) or set(sources) != SHAPES:
        errors.append(f"{where}: sources needs portrait and landscape")
    elif host == "youtube" and not all(YOUTUBE_ID_RE.match(str(v)) for v in sources.values()):
        errors.append(f"{where}: with host youtube, each source is the 11-character video id, not a link")
    elif host == "drive" and not all(DRIVE_ID_RE.match(str(v)) for v in sources.values()):
        errors.append(f"{where}: with host drive, each source is a Google Drive file id, not a link")
    elif host == "file" and not all(re.search(r"\.(mp4|webm)(\?|$)", str(v)) for v in sources.values()):
        errors.append(f"{where}: with host file, each source is a .mp4 or .webm URL")
    if not isinstance(poster, dict) or set(poster) != SHAPES:
        errors.append(f"{where}: poster needs portrait and landscape images")
    else:
        for shape, rel_path in poster.items():
            if not os.path.exists(os.path.join(folder, str(rel_path))):
                errors.append(f"{where}: poster {rel_path!r} does not exist")
    caps = card.get("captions")
    if host == "youtube" and caps not in ("youtube", "burned-in"):
        errors.append(f"{where}: captions must be \"youtube\" (a captions track uploaded with the "
                      f"video) or \"burned-in\"")
    if host == "drive" and caps != "burned-in":
        errors.append(f"{where}: Drive's player cannot load a captions file, so captions must be "
                      f"part of the picture: set captions to \"burned-in\" once they are. Drive's "
                      f"player is also landscape on phones; prefer host youtube or file")
    if host == "file" and caps != "burned-in" and not (
            isinstance(caps, str) and caps.endswith(".vtt") and os.path.exists(os.path.join(folder, caps))):
        errors.append(f"{where}: captions must be an existing .vtt file, or \"burned-in\"")
    if not isinstance(card.get("transcript"), str) or len(card["transcript"]) < 40:
        errors.append(f"{where}: needs a transcript")
    secs = card.get("seconds")
    if not isinstance(secs, int) or not VIDEO_SECONDS[0] <= secs <= VIDEO_SECONDS[1]:
        errors.append(f"{where}: seconds must be {VIDEO_SECONDS[0]} to {VIDEO_SECONDS[1]}")


EVOLVE_STAGES = (3, 7)
STAGE_FIELDS = {"text", "art", "audio"}
TOP_ATTR_RE = re.compile(r"data-(k|from|into|draw)\b")


def evolve_tops(art):
    """Top-level children of a stage's <svg>, as (tag, attributes) pairs."""
    import xml.etree.ElementTree as ET
    try:
        root = ET.fromstring(art)
    except ET.ParseError as e:
        return None, str(e)
    tops = []
    for child in root:
        tag = child.tag.split("}")[-1]
        tops.append((tag, child.attrib))
        for d in child.iter():
            if d is not child and any(TOP_ATTR_RE.match(k) for k in d.attrib):
                return None, "data-k, data-from, data-into and data-draw go on top-level shapes only"
    return (root.attrib.get("viewBox"), tops), None


def check_evolve(where, card, folder, errors):
    """One diagram that changes with each tap: 3 to 7 stages sharing one
    viewBox, the first with art, keys unique per stage, and every data-from
    or data-into naming a key in the nearest stage with art on that side."""
    stages = card.get("stages")
    lo, hi = EVOLVE_STAGES
    if not isinstance(stages, list) or not lo <= len(stages) <= hi:
        errors.append(f"{where}: needs {lo} to {hi} stages")
        return
    if not card.get("alt"):
        errors.append(f"{where}: needs an alt text describing how the diagram changes")
    parsed, boxes = [], set()
    for k, st in enumerate(stages, 1):
        sw = f"{where} stage {k}"
        if not isinstance(st, dict) or not st.get("text"):
            errors.append(f"{sw}: needs text")
            parsed.append(None)
            continue
        extra = set(st) - STAGE_FIELDS
        if extra:
            errors.append(f"{sw}: unknown fields {sorted(extra)}")
        if st.get("audio") and not os.path.isfile(os.path.join(folder, st["audio"])):
            errors.append(f"{sw}: audio {st['audio']!r} does not exist")
        art = st.get("art")
        if not art:
            if k == 1:
                errors.append(f"{sw}: the first stage needs art")
            parsed.append(None)
            continue
        check_art(sw, {"type": "evolve-stage", "art": art, "alt": card.get("alt")}, errors)
        info, err = evolve_tops(art)
        if err:
            errors.append(f"{sw}: {err}")
            parsed.append(None)
            continue
        box, tops = info
        boxes.add(box)
        keys = [a.get("data-k") for _, a in tops if a.get("data-k")]
        if len(keys) != len(set(keys)):
            errors.append(f"{sw}: a data-k is used twice")
        parsed.append((set(keys), tops))
    if len(boxes) > 1:
        errors.append(f"{where}: every stage must share one viewBox, found {sorted(b or 'none' for b in boxes)}")
    for k, p in enumerate(parsed):
        if not p:
            continue
        keys, tops = p
        # A text-only stage keeps the last picture, so neighbours are the
        # nearest stages with art on either side.
        before = next((q[0] for q in reversed(parsed[:k]) if q), set())
        after = next((q[0] for q in parsed[k + 1:] if q), set())
        for _, a in tops:
            if a.get("data-from") and a["data-from"] not in before:
                errors.append(f"{where} stage {k + 1}: data-from={a['data-from']!r} names no shape in the stage before")
            if a.get("data-into") and a["data-into"] not in after:
                errors.append(f"{where} stage {k + 1}: data-into={a['data-into']!r} names no shape in the stage after")


def check_scene(where, card, folder, errors):
    if not card.get("art") and not card.get("fallback"):
        errors.append(f"{where}: needs art (an isometric SVG) or a fallback image")
    if card.get("model") and not card.get("fallback"):
        errors.append(f"{where}: a model needs a fallback image; the v1 engine shows only the fallback")
    if card.get("fallback"):
        if not os.path.exists(os.path.join(folder, str(card["fallback"]))):
            errors.append(f"{where}: fallback {card['fallback']!r} does not exist")
        if not card.get("alt"):
            errors.append(f"{where}: the fallback image needs an alt text")


def check_question(where, card, errors):
    if card["type"] in ("choice", "predict"):
        check_options(where, card, errors)
    elif card["type"] == "sort":
        check_sort(where, card, errors)
    elif card["type"] == "bucket":
        check_bucket(where, card, errors)


def check_variants(where, card, errors):
    """A variant is another wording of the same question, shown in review.
    It overrides fields of its card and must be a complete question itself."""
    variants = card.get("variants")
    if variants is None:
        return
    if not card.get("review"):
        errors.append(f"{where}: variants are only used in review; mark the card review: true")
    if not isinstance(variants, list) or not 1 <= len(variants) <= 3:
        errors.append(f"{where}: variants is a list of 1 to 3 alternative wordings")
        return
    locked = {"id", "type", "review", "variants", "art", "alt"}
    for k, v in enumerate(variants, 1):
        vw = f"{where} variant {k}"
        if not isinstance(v, dict) or not v:
            errors.append(f"{vw}: must be an object of overriding fields")
            continue
        bad = (set(v) & locked) | (set(v) - FIELDS[card["type"]])
        if bad:
            errors.append(f"{vw}: cannot set {sorted(bad)}")
            continue
        merged = dict(card)
        merged.update(v)
        if merged.get("prompt") == card.get("prompt"):
            errors.append(f"{vw}: needs its own prompt, different from the card's")
        check_question(vw, merged, errors)


def check_home(folder, book, errors):
    """The book home lists lessons as static HTML; it must match book.json."""
    path = os.path.join(folder, "index.html")
    rel = os.path.relpath(path, ".").replace(os.sep, "/")
    if not os.path.exists(path):
        errors.append(f"{rel}: the book needs a home page")
        return
    html = open(path, encoding="utf-8").read()
    if EM_DASH in html:
        errors.append(f"{rel}: contains an em dash")
    if 'data-book="%s"' % book["id"] not in html:
        errors.append(f"{rel}: <main> must carry data-book for {book['id']!r}")
    if 'src="../engine/book-home.v1.js"' not in html:
        errors.append(f"{rel}: must load ../engine/book-home.v1.js")
    cans = {i["id"]: i["can"] for i in book["ideas"]}
    listed = re.findall(r'<a href="([^"]+)" data-lesson="(\d+)" data-can="([^"]*)"', html)
    want = [(l["file"], str(l["n"]), cans.get(l["idea"], "")) for l in book["lessons"]]
    if listed != want:
        errors.append(f"{rel}: the lesson links (href, data-lesson, data-can) must match book.json, in order")


def check_lesson(path, book, errors):
    html = open(path, encoding="utf-8").read()
    name = os.path.basename(path)
    rel = os.path.relpath(path, ".").replace(os.sep, "/")

    # ---- page shell ----
    if EM_DASH in html:
        errors.append(f"{rel}: contains an em dash; use a colon, comma, parentheses or a period")
    if f'<link rel="canonical" href="{BASE}/{rel}">' not in html:
        errors.append(f"{rel}: canonical must be {BASE}/{rel}")
    if not re.search(r"<title>[^<{]+</title>", html):
        errors.append(f"{rel}: missing or unfilled <title>")
    if "G-GBFP6K89Q6" not in html or "cloudflareinsights.com/beacon" not in html:
        errors.append(f"{rel}: both analytics tags must be present")
    if not re.search(r'<article class="summary">\s*<h1>[^<{]+</h1>\s*<p>[^<{]{40,}</p>', html):
        errors.append(f"{rel}: needs a plain-text summary (h1 and a paragraph) inside <main id=\"app\">")
    if "{{" in html:
        errors.append(f"{rel}: still holds a template placeholder")
    if 'src="../engine/book-engine.v1.js"' not in html or 'href="../engine/book-engine.v1.css"' not in html:
        errors.append(f"{rel}: must load ../engine/book-engine.v1.js and .css")

    pal = PALETTE_RE.search(html)
    if not pal:
        errors.append(f"{rel}: missing <style id=\"palette\">")
    else:
        page = dict(p.split(":", 1) for p in pal.group(1).split(";") if p)
        want = {f"--{k}": v for k, v in book["palette"].items()}
        if page != want:
            errors.append(f"{rel}: palette does not match book.json ({want})")

    # ---- lesson JSON ----
    m = LESSON_RE.search(html)
    if not m:
        errors.append(f"{rel}: no lesson JSON block")
        return
    try:
        lesson = json.loads(m.group(1))
    except ValueError as e:
        errors.append(f"{rel}: lesson JSON does not parse: {e}")
        return

    extra = set(lesson) - LESSON_FIELDS
    if extra:
        errors.append(f"{rel}: unknown lesson fields {sorted(extra)}")
    if lesson.get("schema") != 1:
        errors.append(f"{rel}: schema must be 1 for book-engine.v1")
    if lesson.get("book") != book["id"]:
        errors.append(f"{rel}: book is {lesson.get('book')!r}, expected {book['id']!r}")
    entry = next((l for l in book["lessons"] if l["file"] == name), None)
    if entry is None:
        errors.append(f"{rel}: not listed in book.json lessons")
    else:
        for key in ("n", "title", "idea"):
            if lesson.get(key) != entry.get(key):
                errors.append(f"{rel}: {key} is {lesson.get(key)!r} but book.json says {entry.get(key)!r}")

    for s in strings(lesson):
        if "<" in s and not s.lstrip().startswith("<svg"):
            errors.append(f"{rel}: raw HTML is not allowed in text fields: {s[:50]!r}")

    cards = lesson.get("cards")
    if not isinstance(cards, list) or not cards:
        errors.append(f"{rel}: no cards")
        return
    if not MIN_CARDS <= len(cards) <= MAX_CARDS:
        errors.append(f"{rel}: {len(cards)} cards; a lesson has {MIN_CARDS} to {MAX_CARDS}")

    seen = set()
    for k, c in enumerate(cards, 1):
        where = f"{rel} card {k} ({c.get('id', '?')})"
        ctype = c.get("type")
        if ctype not in TYPES:
            errors.append(f"{where}: unknown type {ctype!r}")
            continue
        cid = c.get("id")
        if not isinstance(cid, str) or not ID_RE.match(cid):
            errors.append(f"{where}: id must be lowercase letters, digits and hyphens")
        elif cid in seen:
            errors.append(f"{where}: duplicate id")
        seen.add(cid)
        extra = set(c) - FIELDS[ctype]
        if extra:
            errors.append(f"{where}: unknown fields {sorted(extra)}")
        if ctype in ("cover", "concept", "case", "compare", "scene", "video", "dialogue", "timeline",
                     "figure", "evolve", "done") and not c.get("title"):
            errors.append(f"{where}: needs a title")
        if ctype in PRODUCING and not c.get("prompt"):
            errors.append(f"{where}: needs a prompt")
        if ctype in ("concept", "case") and not c.get("body"):
            errors.append(f"{where}: needs a body")
        if ctype == "cover" and not c.get("art"):
            errors.append(f"{where}: the cover needs art")
        if ctype in ("choice", "predict", "sort", "bucket"):
            check_question(where, c, errors)
            check_variants(where, c, errors)
        if ctype == "compare":
            check_compare(where, c, errors)
        if ctype == "dialogue":
            check_dialogue(where, c, errors)
        if ctype == "timeline":
            check_timeline(where, c, errors)
        if ctype == "figure":
            check_figure(where, c, errors)
        if "look" in c and c["look"] not in LOOKS:
            errors.append(f"{where}: look must be one of {sorted(LOOKS)}")
        if "look" in c and not (c.get("art") or ctype == "evolve"):
            errors.append(f"{where}: look describes art, and this card has none")
        if ctype == "video":
            check_video(where, c, os.path.dirname(path), errors)
        if ctype == "scene":
            check_scene(where, c, os.path.dirname(path), errors)
        if ctype == "evolve":
            check_evolve(where, c, os.path.dirname(path), errors)
        if ctype in ("reflect", "commit"):
            if not isinstance(c.get("minChars"), int) or c["minChars"] < 1:
                errors.append(f"{where}: needs a positive minChars")
        if ctype == "commit":
            sugg = c.get("suggestions", [])
            if not isinstance(sugg, list) or len(sugg) > 4 or not all(isinstance(x, str) and x for x in sugg):
                errors.append(f"{where}: suggestions is a list of up to 4 short texts")
        if ctype == "reflect":
            if not c.get("example"):
                errors.append(f"{where}: needs an example answer to compare against")
        if ctype == "done" and not c.get("can"):
            errors.append(f"{where}: needs a \"can\" capability statement")
        if c.get("review") and ctype not in REVIEWABLE:
            errors.append(f"{where}: only {sorted(REVIEWABLE)} cards can be marked for review")
        check_art(where, c, errors)
        check_steps(where, c, errors)

    types = [c.get("type") for c in cards]
    if types[0] != "cover" or types.count("cover") != 1:
        errors.append(f"{rel}: the first card, and only the first, is the cover")
    if types[-1] != "done" or types.count("done") != 1:
        errors.append(f"{rel}: the last card, and only the last, is the done card")

    run = 0
    for k, t in enumerate(types[1:], 2):
        run = 0 if t in PRODUCING else run + 1
        if run > MAX_PASSIVE_RUN and t != "done":
            errors.append(f"{rel}: card {k} is the {run}th card in a row with nothing to do; the limit is {MAX_PASSIVE_RUN}")
    producing = sum(1 for t in types if t in PRODUCING)
    if producing < len(types) * MIN_PRODUCING_SHARE:
        errors.append(f"{rel}: {producing} of {len(types)} cards ask the learner to do something; at least a fifth must")
    if not any(t in PRODUCING for t in types[:HOOK_WITHIN]):
        errors.append(f"{rel}: no question in the first {HOOK_WITHIN} cards; the first question must land by card {HOOK_WITHIN}")
    # Mix the kinds of question: not a lesson of nothing but multiple choice.
    questions = [t for t in types if t in QUESTION_TYPES]
    kinds = set(questions)
    if len(questions) >= 3 and len(kinds) < MIN_QUESTION_KINDS:
        errors.append(f"{rel}: all {len(questions)} questions are {sorted(kinds)[0]} cards; "
                      f"mix at least {MIN_QUESTION_KINDS} kinds of {sorted(QUESTION_TYPES)}")
    # The "no kind above half" cap is opt-in ("mix": true in book.json) so
    # books written before it keep passing; new books turn it on.
    if book.get("mix") and len(questions) >= 4:
        top = max(kinds, key=questions.count)
        if questions.count(top) * 2 > len(questions):
            errors.append(f"{rel}: {questions.count(top)} of {len(questions)} questions are {top} cards; "
                          f"no kind may be more than half")
    if not STORY_TYPES & set(types):
        errors.append(f"{rel}: needs something concrete: a case, dialogue, timeline or scene card")
    # Variety rules, for books that opt in with "variety": true in book.json.
    formats = {c.get("look", "diagram") for c in cards if c.get("art") or c.get("type") == "evolve"} | (FORMAT_TYPES & set(types))
    if book.get("variety"):
        for k, c in enumerate(cards, 1):
            if (c.get("art") or c.get("type") == "evolve") and "look" not in c:
                errors.append(f"{rel} card {k} ({c.get('id', '?')}): name the art's look, one of {sorted(LOOKS)}")
        if len(formats) < MIN_FORMATS:
            errors.append(f"{rel}: uses {len(formats)} visual format(s) ({sorted(formats)}); "
                          f"a lesson in this book needs at least {MIN_FORMATS}")
    if types.count("reflect") != 1:
        errors.append(f"{rel}: needs exactly one reflect card, found {types.count('reflect')}")
    if types.count("video") > MAX_VIDEOS:
        errors.append(f"{rel}: at most {MAX_VIDEOS} video card per lesson")
    for k, t in enumerate(types):
        if t == "video" and (k + 1 >= len(types) or types[k + 1] not in PRODUCING):
            errors.append(f"{rel}: card {k + 1} is a video; the next card must ask the learner to act on it")
    is_last = bool(book["lessons"]) and book["lessons"][-1].get("file") == name
    commits = types.count("commit")
    if book.get("partial"):
        is_last = False   # a book still being written has no last lesson yet
    if is_last and commits != 1:
        errors.append(f"{rel}: the book's last lesson needs exactly one commit card, found {commits}")
    if not is_last and commits:
        errors.append(f"{rel}: a commit card belongs only on the book's last lesson")
    if sum(1 for c in cards if c.get("review")) < MIN_REVIEW:
        errors.append(f"{rel}: mark at least {MIN_REVIEW} cards review: true")
    if sum(1 for c in cards if c.get("steps") or c.get("type") in ("dialogue", "timeline", "evolve")) < MIN_STEPPED:
        errors.append(f"{rel}: at least {MIN_STEPPED} cards must use step builds")

    # Correct answers should not sit in the same position every time.
    spots = [next(i for i, o in enumerate(c["options"]) if o.get("correct"))
             for c in cards if c.get("type") == "choice"
             and not c.get("select") and isinstance(c.get("options"), list)
             and any(isinstance(o, dict) and o.get("correct") for o in c["options"])]
    if len(spots) >= 3 and len(set(spots)) == 1:
        errors.append(f"{rel}: every choice card has its correct answer in position {spots[0] + 1}; vary it")


def check_book(folder, errors, only=None):
    book_path = os.path.join(folder, "book.json")
    if not os.path.exists(book_path):
        errors.append(f"{folder}: no book.json")
        return
    try:
        book = json.load(open(book_path, encoding="utf-8"))
    except ValueError as e:
        errors.append(f"{book_path}: does not parse: {e}")
        return
    rel = os.path.relpath(book_path, ".").replace(os.sep, "/")

    if EM_DASH in open(book_path, encoding="utf-8").read():
        errors.append(f"{rel}: contains an em dash")
    for key in ("schema", "id", "title", "author", "rights", "palette", "ideas", "lessons"):
        if key not in book:
            errors.append(f"{rel}: missing {key}")
    if errors:
        return
    if book["id"] != os.path.basename(os.path.normpath(folder)):
        errors.append(f"{rel}: id {book['id']!r} must equal the folder name")
    if book["rights"].get("tier") not in RIGHTS_TIERS:
        errors.append(f"{rel}: rights.tier must be one of {sorted(RIGHTS_TIERS)}")
    if not book["rights"].get("note"):
        errors.append(f"{rel}: rights.note must say how the status was checked")

    pal = book["palette"]
    if set(pal) != {"bg", "tint", "accent", "ink"} or not all(
            re.match(r"^#[0-9a-fA-F]{6}$", str(v)) for v in pal.values()):
        errors.append(f"{rel}: palette needs bg, tint, accent and ink as six-digit hex colours")
    else:
        for fg, bg, need in (("ink", "bg", 4.5), ("ink", "tint", 4.5), ("accent", "bg", 3.0), ("bg", "accent", 4.5)):
            got = contrast(pal[fg], pal[bg])
            if got < need:
                errors.append(f"{rel}: {fg} on {bg} has contrast {got:.2f}; it needs {need}")

    idea_ids = [i.get("id") for i in book["ideas"]]
    for idea in book["ideas"]:
        if not idea.get("id") or not idea.get("name") or not idea.get("can"):
            errors.append(f"{rel}: every idea needs id, name and can")
    used = set()
    for k, l in enumerate(book["lessons"], 1):
        if l.get("n") != k:
            errors.append(f"{rel}: lesson {k} has n {l.get('n')!r}; lessons are numbered in order from 1")
        if l.get("idea") not in idea_ids:
            errors.append(f"{rel}: lesson {k} names an unknown idea {l.get('idea')!r}")
        used.add(l.get("idea"))
        if not os.path.exists(os.path.join(folder, l.get("file", ""))):
            errors.append(f"{rel}: lesson file {l.get('file')!r} does not exist")
    for missing in sorted(set(idea_ids) - used):
        errors.append(f"{rel}: idea {missing!r} has no lesson")

    if only is None:
        check_home(folder, book, errors)
    openers, all_types = [], []
    for l in book["lessons"]:
        path = os.path.join(folder, l.get("file", ""))
        if os.path.exists(path) and (only is None or os.path.abspath(path) == os.path.abspath(only)):
            check_lesson(path, book, errors)
        openers.append(opener_of(path) if os.path.exists(path) else None)
        all_types += lesson_types(path) if os.path.exists(path) else []
    if only is None and all_types:
        producing = sum(1 for t in all_types if t in PRODUCING)
        if producing < len(all_types) * BOOK_PRODUCING_SHARE:
            errors.append(f"{rel}: {producing} of {len(all_types)} cards across the book ask the learner "
                          f"to do something; at least a third must")
    if book.get("variety") and only is None:
        for k in range(1, len(openers)):
            for back in range(1, OPENER_WINDOW):
                j = k - back
                if j >= 0 and openers[k] and openers[k] == openers[j]:
                    errors.append(f"{rel}: lessons {j + 1} and {k + 1} both open with a {openers[k]} card; "
                                  f"no two lessons within {OPENER_WINDOW} of each other may begin alike")


def lesson_types(path):
    """Every card type in a lesson, in order, or [] if it cannot be read."""
    m = LESSON_RE.search(open(path, encoding="utf-8").read())
    try:
        return [c.get("type") for c in json.loads(m.group(1))["cards"]] if m else []
    except (ValueError, KeyError):
        return []


def opener_of(path):
    """The type of the first card after the cover, or None."""
    m = LESSON_RE.search(open(path, encoding="utf-8").read())
    try:
        cards = json.loads(m.group(1))["cards"] if m else []
    except (ValueError, KeyError):
        return None
    return cards[1].get("type") if len(cards) > 1 else None


def main(argv):
    if len(argv) != 2:
        print(__doc__)
        return 2
    target = argv[1]
    errors = []
    if os.path.isdir(target):
        check_book(target, errors)
    elif os.path.isfile(target):
        check_book(os.path.dirname(target), errors, only=target)
    else:
        print(f"Not found: {target}")
        return 2
    if errors:
        for e in errors:
            print("FAIL", e)
        print(f"\n{len(errors)} problem(s).")
        return 1
    print(f"OK {target}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
