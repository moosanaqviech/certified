#!/usr/bin/env python3
"""
Certified content validator.

Runs the pre-delivery checks documented in CLAUDE.md and the
certified-content-author skill against a lesson or exam HTML file
(or several). Detects the file type from its payload markers, isolates
the payload zone, and validates only that zone. The frozen engine below
the payload is never inspected.

Usage:
    python scripts/validate.py <file> [<file> ...]

Exit code is 0 only if every file passes with no ERRORs. WARNINGs do
not fail the run.

NOTE: this is a faithful reconstruction from the documented check list
(CLAUDE.md + skill), not necessarily byte-identical to a prior original.
The card-count rule here is the current one: 8 to 12 cards, target 9,
a second quiz card required at 11+ cards, split above 12.
"""

import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

EM_DASH = "\u2014"
LETTERS = ["A", "B", "C", "D"]

# Card-count rule (current):
CARD_MIN = 8
CARD_MAX = 12
CARD_TARGET = 9
SECOND_QUIZ_AT = 11  # lessons with this many cards or more need >= 2 quiz cards


class Report:
    """Collects PASS / WARN / FAIL lines for one file."""

    def __init__(self, path):
        self.path = path
        self.errors = []
        self.warnings = []
        self.passes = []

    def ok(self, msg):
        self.passes.append(msg)

    def warn(self, msg):
        self.warnings.append(msg)

    def fail(self, msg):
        self.errors.append(msg)

    def print(self):
        print(f"\n=== {self.path} ===")
        for m in self.passes:
            print(f"  PASS  {m}")
        for m in self.warnings:
            print(f"  WARN  {m}")
        for m in self.errors:
            print(f"  FAIL  {m}")
        status = "FAIL" if self.errors else ("PASS (with warnings)" if self.warnings else "PASS")
        print(f"  ---> {status}")

    @property
    def failed(self):
        return bool(self.errors)


# ---------------------------------------------------------------------------
# Payload isolation
# ---------------------------------------------------------------------------

BEGIN_RE = {
    "lesson": re.compile(r"LESSON PAYLOAD\s*[\u2014-]\s*BEGIN"),
    "exam": re.compile(r"EXAM PAYLOAD\s*[\u2014-]\s*BEGIN"),
    "readiness": re.compile(r"READINESS PAYLOAD\s*[\u2014-]\s*BEGIN"),
}
END_RE = {
    "lesson": re.compile(r"LESSON PAYLOAD\s*[\u2014-]\s*END"),
    "exam": re.compile(r"EXAM PAYLOAD\s*[\u2014-]\s*END"),
    "readiness": re.compile(r"READINESS PAYLOAD\s*[\u2014-]\s*END"),
}


def detect_type(text):
    if BEGIN_RE["readiness"].search(text):
        return "readiness"
    if BEGIN_RE["lesson"].search(text):
        return "lesson"
    if BEGIN_RE["exam"].search(text):
        return "exam"
    return None


def extract_payload(text, kind):
    """Return the evaluable JS between the payload marker comments.

    The BEGIN / END markers live inside /* ... */ comment blocks, so the
    real code starts after the first '*/' following BEGIN and ends before
    the last '/*' preceding END.
    """
    begin = BEGIN_RE[kind].search(text)
    end = END_RE[kind].search(text)
    if not begin or not end:
        return None
    close = text.find("*/", begin.end())
    code_start = close + 2 if close != -1 else begin.end()
    open_before = text.rfind("/*", 0, end.start())
    code_end = open_before if open_before != -1 else end.start()
    if code_end <= code_start:
        return None
    return text[code_start:code_end]


# ---------------------------------------------------------------------------
# Comment / string classification (for the em-dash scan)
# ---------------------------------------------------------------------------

def classify_comment_mask(src):
    """Return a list of booleans, one per char: True if the char sits inside
    a // or /* */ comment. Backtick, single- and double-quoted strings are
    tracked so a '/*' inside a string is not mistaken for a comment."""
    mask = [False] * len(src)
    state = "code"  # code | line_comment | block_comment | backtick | single | double
    i = 0
    n = len(src)
    while i < n:
        c = src[i]
        nxt = src[i + 1] if i + 1 < n else ""
        if state == "code":
            if c == "/" and nxt == "/":
                state = "line_comment"
                mask[i] = mask[i + 1] = True
                i += 2
                continue
            if c == "/" and nxt == "*":
                state = "block_comment"
                mask[i] = mask[i + 1] = True
                i += 2
                continue
            if c == "`":
                state = "backtick"
            elif c == "'":
                state = "single"
            elif c == '"':
                state = "double"
        elif state == "line_comment":
            mask[i] = True
            if c == "\n":
                state = "code"
        elif state == "block_comment":
            mask[i] = True
            if c == "*" and nxt == "/":
                mask[i + 1] = True
                i += 2
                state = "code"
                continue
        elif state == "backtick":
            if c == "\\":
                i += 2
                continue
            if c == "`":
                state = "code"
        elif state == "single":
            if c == "\\":
                i += 2
                continue
            if c == "'":
                state = "code"
        elif state == "double":
            if c == "\\":
                i += 2
                continue
            if c == '"':
                state = "code"
        i += 1
    return mask


def line_of(src, idx):
    return src.count("\n", 0, idx) + 1


# ---------------------------------------------------------------------------
# Shared checks
# ---------------------------------------------------------------------------

def check_backtick_parity(payload, rep):
    count = payload.count("`")
    if count % 2 == 0:
        rep.ok(f"backtick parity ({count} backticks, balanced)")
    else:
        rep.fail(f"backtick parity: odd number of backticks ({count}); a template literal is unclosed")


def check_em_dashes(payload, rep):
    mask = classify_comment_mask(payload)
    content_hits, comment_hits = [], []
    for i, ch in enumerate(payload):
        if ch == EM_DASH:
            (comment_hits if mask[i] else content_hits).append(line_of(payload, i))
    if content_hits:
        where = ", ".join(f"line {ln}" for ln in sorted(set(content_hits)))
        rep.fail(f"em dash in content ({where}); use a colon, comma, parentheses, or period")
    else:
        rep.ok("no em dashes in content")
    if comment_hits:
        where = ", ".join(f"line {ln}" for ln in sorted(set(comment_hits)))
        rep.warn(f"em dash inside a comment ({where}); harmless to readers, but the rule is no em dashes anywhere")


def run_node(harness):
    """Evaluate the payload with node. Returns (ok, data_or_errtext, node_missing)."""
    try:
        with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as f:
            f.write(harness)
            tmp = f.name
        proc = subprocess.run(["node", tmp], capture_output=True, text=True, timeout=20)
        Path(tmp).unlink(missing_ok=True)
        if proc.returncode != 0:
            return False, proc.stderr.strip(), False
        return True, proc.stdout.strip(), False
    except FileNotFoundError:
        return False, "node not found", True
    except subprocess.TimeoutExpired:
        return False, "node evaluation timed out", False


# ---------------------------------------------------------------------------
# Full <script> syntax check
#
# The payload harness above only evaluates the isolated payload zone, so a
# stray token left between the payload END marker and the frozen ENGINE
# section (e.g. by a scripted find/replace) can pass every other check while
# still breaking the page's actual <script> tag in a browser. This check
# runs `node --check` against the whole inline script exactly as shipped.
# ---------------------------------------------------------------------------

SCRIPT_TAG_RE = re.compile(r"<script>(.*?)</script>", re.DOTALL)


def check_full_script_syntax(text, rep):
    scripts = SCRIPT_TAG_RE.findall(text)
    if not scripts:
        rep.warn("no inline <script> tag found; skipped full-script syntax check")
        return
    if len(scripts) > 1:
        rep.warn(f"{len(scripts)} inline <script> tags found; checking the first only")

    try:
        with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as f:
            f.write(scripts[0])
            tmp = f.name
        proc = subprocess.run(["node", "--check", tmp], capture_output=True, text=True, timeout=20)
        Path(tmp).unlink(missing_ok=True)
        if proc.returncode != 0:
            err = proc.stderr.strip().splitlines()
            first = err[0] if err else "unknown error"
            rep.fail(f"full <script> tag fails to parse (syntax error the isolated payload check cannot see): {first}")
        else:
            rep.ok("full inline <script> tag (as shipped) parses cleanly")
    except FileNotFoundError:
        rep.warn("node not found: full-script syntax check skipped (install Node.js to enable)")
    except subprocess.TimeoutExpired:
        rep.fail("full <script> tag syntax check timed out")


# ---------------------------------------------------------------------------
# Lesson checks
# ---------------------------------------------------------------------------

LESSON_HARNESS = """
%s
const out = {
  cardCount: cards.length,
  cards: cards.map(function(c){
    var html = c.html || "";
    return {
      quiz: !!c.quiz,
      last: !!c.last,
      correctTrue: (html.match(/data-correct=["']true["']/g) || []).length,
      correctFalse: (html.match(/data-correct=["']false["']/g) || []).length,
      hasFeedback: /class=["'][^"']*\\bfeedback\\b/.test(html),
      hasChoices: /class=["'][^"']*\\bchoices\\b/.test(html)
    };
  })
};
console.log(JSON.stringify(out));
"""


def check_lesson(payload, rep):
    ok, data, missing = run_node(LESSON_HARNESS % payload)
    if missing:
        rep.warn("node not found: syntax, card-count, and quiz-wiring checks skipped (install Node.js to enable)")
        return
    if not ok:
        rep.fail(f"payload does not evaluate (syntax error):\n        {data.splitlines()[-1] if data else 'unknown error'}")
        return
    rep.ok("payload evaluates without syntax errors")
    info = json.loads(data)

    n = info["cardCount"]
    cards = info["cards"]

    # Card count
    if n < CARD_MIN:
        rep.fail(f"card count {n} is below the minimum of {CARD_MIN}")
    elif n > CARD_MAX:
        rep.fail(f"card count {n} exceeds {CARD_MAX}; this chapter likely bundles two concepts, split it")
    else:
        note = "" if n == CARD_TARGET else f" (target is {CARD_TARGET})"
        rep.ok(f"card count {n} within {CARD_MIN}-{CARD_MAX}{note}")

    # Quiz cards
    quiz_idxs = [i for i, c in enumerate(cards) if c["quiz"]]
    if not quiz_idxs:
        rep.fail("no quiz card found; a lesson needs at least one")
    else:
        rep.ok(f"{len(quiz_idxs)} quiz card(s)")
    if n >= SECOND_QUIZ_AT and len(quiz_idxs) < 2:
        rep.fail(f"{n} cards but only {len(quiz_idxs)} quiz card; {SECOND_QUIZ_AT}+ cards require at least 2")

    # Quiz wiring
    for i in quiz_idxs:
        c = cards[i]
        if c["correctTrue"] != 1:
            rep.fail(f'card {i} (quiz): needs exactly one data-correct="true", found {c["correctTrue"]}')
        if not c["hasChoices"]:
            rep.fail(f"card {i} (quiz): missing a .choices block")
        if not c["hasFeedback"]:
            rep.fail(f"card {i} (quiz): missing a .feedback block")
    if quiz_idxs and all(
        cards[i]["correctTrue"] == 1 and cards[i]["hasChoices"] and cards[i]["hasFeedback"]
        for i in quiz_idxs
    ):
        rep.ok("quiz wiring correct on every quiz card")

    # Last card
    last_idxs = [i for i, c in enumerate(cards) if c["last"]]
    if len(last_idxs) != 1:
        rep.fail(f'expected exactly one card with last:true, found {len(last_idxs)}')
    elif last_idxs[0] != n - 1:
        rep.fail(f"last:true is on card {last_idxs[0]}, but the final card is {n - 1}")
    else:
        rep.ok("final card carries last:true")


# ---------------------------------------------------------------------------
# Exam checks
# ---------------------------------------------------------------------------

EXAM_HARNESS = """
%s
const out = {
  questionCount: QUESTIONS.length,
  correct: QUESTIONS.map(function(q){ return q.correct; }),
  multi: QUESTIONS.map(function(q){ return Array.isArray(q.correct); }),
  optCounts: QUESTIONS.map(function(q){ return (q.opts || []).length; }),
  minutes: E.minutes,
  pass: E.pass
};
console.log(JSON.stringify(out));
"""

# Multiple-response support. `correct` is a scalar index for single-answer
# questions and an array of indexes for multiple-response ones. Single-answer
# questions stay at exactly 4 options; multi questions may run to 6, because
# the vendors' own multi items typically offer 5 or 6.
MULTI_OPT_MIN = 4
MULTI_OPT_MAX = 6
MULTI_SHARE_WARN = 0.25  # warn above this share; real exams are mostly single


def check_answer_shapes(info, rep, single_opts=4):
    """Validate `correct` against `opts` for both question shapes.

    Returns the list of single-answer letters (for the run and distribution
    checks) or None if something is broken badly enough to stop.
    """
    correct, multi, counts = info["correct"], info["multi"], info["optCounts"]
    n = len(correct)
    errs = []

    for i, (c, is_multi, k) in enumerate(zip(correct, multi, counts)):
        if is_multi:
            if not (MULTI_OPT_MIN <= k <= MULTI_OPT_MAX):
                errs.append(f"q{i}: multi question has {k} options, allowed {MULTI_OPT_MIN}-{MULTI_OPT_MAX}")
            if len(c) < 2:
                errs.append(f"q{i}: multi `correct` needs at least 2 indexes, found {len(c)}")
            if len(set(c)) != len(c):
                errs.append(f"q{i}: multi `correct` has duplicate indexes {c}")
            if len(c) >= k:
                errs.append(f"q{i}: multi `correct` selects {len(c)} of {k} options, leaving too few distractors")
            bad = [x for x in c if not isinstance(x, int) or x < 0 or x >= k]
            if bad:
                errs.append(f"q{i}: multi `correct` index out of range for {k} options: {bad}")
        else:
            if k != single_opts:
                errs.append(f"q{i}: single-answer question has {k} options, expected exactly {single_opts}")
            if not isinstance(c, int) or c < 0 or c >= k:
                errs.append(f"q{i}: `correct` index {c!r} out of range for {k} options")

    if errs:
        for e in errs:
            rep.fail(e)
        return None

    n_multi = sum(1 for m in multi if m)
    if n_multi:
        rep.ok(f"{n - n_multi} single-answer and {n_multi} multiple-response question(s), all well formed")
        if n and n_multi / n > MULTI_SHARE_WARN:
            rep.warn(
                f"{n_multi} of {n} questions are multiple-response "
                f"({n_multi / n:.0%}); the real exams are mostly single answer"
            )
    else:
        rep.ok(f"every question has exactly {single_opts} options and a valid correct index")

    return [LETTERS[c] for c, m in zip(correct, multi) if not m]


def check_letter_spread(letters, n_multi, rep):
    """Run and distribution checks, over single-answer questions only.

    A multiple-response question has no single correct letter, so including
    it would corrupt both checks. They are skipped for those questions and
    the exclusion is reported rather than left implicit.
    """
    if n_multi:
        rep.ok(f"letter checks below cover the {len(letters)} single-answer question(s); {n_multi} multi excluded")

    runs = [i - 2 for i in range(2, len(letters)) if letters[i] == letters[i - 1] == letters[i - 2]]
    if runs:
        rep.fail(f"three identical correct answers in a row starting at question(s): {runs}")
    else:
        rep.ok("no three identical correct answers in a row")

    n = len(letters)
    if n:
        dist = {L: letters.count(L) for L in LETTERS}
        shares = {L: dist[L] / n for L in LETTERS}
        skewed = [f"{L}={dist[L]}" for L in LETTERS if shares[L] < 0.15 or shares[L] > 0.35]
        summary = " ".join(f"{L}:{dist[L]}" for L in LETTERS)
        if skewed:
            rep.warn(f"answer distribution skewed ({summary}); aim for roughly a quarter each")
        else:
            rep.ok(f"answer distribution balanced ({summary})")


def check_exam(payload, rep):
    ok, data, missing = run_node(EXAM_HARNESS % payload)
    if missing:
        rep.warn("node not found: syntax, option, and answer-distribution checks skipped (install Node.js to enable)")
        return
    if not ok:
        rep.fail(f"payload does not evaluate (syntax error):\n        {data.splitlines()[-1] if data else 'unknown error'}")
        return
    rep.ok("payload evaluates without syntax errors")
    info = json.loads(data)

    n = info["questionCount"]
    rep.ok(f"{n} question(s)")

    letters = check_answer_shapes(info, rep)
    if letters is None:
        return
    check_letter_spread(letters, sum(1 for m in info["multi"] if m), rep)


# ---------------------------------------------------------------------------
# Readiness-quiz checks (spec section 10)
#
# The readiness quiz forks the exam engine but ships a different payload:
# an R config object (domains + verdict bands) and a QUESTIONS array whose
# items carry a `domain` tag. Section 10 of the readiness spec extends the
# exam checklist with the per-domain and band rules validated below.
# ---------------------------------------------------------------------------

READINESS_HARNESS = """
%s
const out = {
  questionCount: QUESTIONS.length,
  correct: QUESTIONS.map(function(q){ return q.correct; }),
  multi: QUESTIONS.map(function(q){ return Array.isArray(q.correct); }),
  optCounts: QUESTIONS.map(function(q){ return (q.opts || []).length; }),
  qDomains: QUESTIONS.map(function(q){ return q.domain; }),
  domains: (R.domains || []).map(function(d){
    return { id:d.id, count:d.count, weight:d.weight,
             prescribe:(d.prescribe==null?"":String(d.prescribe)),
             href:(d.href==null?"":String(d.href)) };
  }),
  bands: (R.bands || []).map(function(b){
    return { min:b.min, label:(b.label==null?"":String(b.label)),
             note:(b.note==null?"":String(b.note)) };
  })
};
console.log(JSON.stringify(out));
"""


def check_readiness(payload, rep):
    ok, data, missing = run_node(READINESS_HARNESS % payload)
    if missing:
        rep.warn("node not found: readiness payload checks skipped (install Node.js to enable)")
        return
    if not ok:
        rep.fail(f"payload does not evaluate (syntax error):\n        {data.splitlines()[-1] if data else 'unknown error'}")
        return
    rep.ok("payload evaluates without syntax errors")
    info = json.loads(data)

    n = info["questionCount"]
    domains = info["domains"]
    dom_ids = [d["id"] for d in domains]

    # Exactly 12 questions
    if n == 12:
        rep.ok("exactly 12 questions")
    else:
        rep.fail(f"question count is {n}; a readiness quiz must have exactly 12")

    # Options: exactly 4 each
    bad_opts = [i for i, k in enumerate(info["optCounts"]) if k != 4]
    if bad_opts:
        rep.fail(f"questions with != 4 options: {bad_opts}")
    else:
        rep.ok("every question has exactly 4 options")

    # Single answer only. Practice exams support multiple-response questions
    # (`correct` as an array); the readiness quiz deliberately does not, since
    # its 12-question band scoring assumes one point per single-answer item.
    multi_idx = [i for i, m in enumerate(info["multi"]) if m]
    if multi_idx:
        rep.fail(
            f"multiple-response `correct` array at question(s) {multi_idx}; "
            "readiness quizzes are single answer only (practice exams support multi)"
        )
        return
    rep.ok("every question is single answer, as the readiness format requires")

    # Every question's domain matches an R.domains id
    unknown = sorted({d for d in info["qDomains"] if d not in dom_ids})
    if unknown:
        rep.fail(f"question domain(s) not found in R.domains: {unknown}")
    else:
        rep.ok("every question domain matches an R.domains id")

    # Per-domain counts equal R.domains.count, and those sum to 12
    actual = {i: info["qDomains"].count(i) for i in dom_ids}
    mismatched = [
        f'{d["id"]} (questions={actual.get(d["id"], 0)}, R.domains.count={d["count"]})'
        for d in domains if actual.get(d["id"], 0) != d["count"]
    ]
    if mismatched:
        rep.fail("per-domain question count != R.domains.count: " + "; ".join(mismatched))
    else:
        rep.ok("per-domain question counts equal each R.domains.count")

    declared_sum = sum(d["count"] for d in domains)
    if declared_sum == 12:
        rep.ok("R.domains.count values sum to 12")
    else:
        rep.fail(f"R.domains.count values sum to {declared_sum}, not 12")

    # Counts should track the weights (heavier domain gets >= questions).
    ordered = sorted(domains, key=lambda d: d["weight"], reverse=True)
    tracks = all(ordered[i]["count"] <= ordered[i - 1]["count"] for i in range(1, len(ordered)))
    if ordered and tracks:
        rep.ok("per-domain counts track the exam weights")
    elif ordered:
        rep.warn("per-domain counts do not monotonically track weights; confirm the split is intentional")

    # Correct-answer index range
    correct = info["correct"]
    out_of_range = [i for i, c in enumerate(correct) if not isinstance(c, int) or c < 0 or c > 3]
    if out_of_range:
        rep.fail(f"correct index out of range (must be 0-3) at questions: {out_of_range}")
        return
    letters = [LETTERS[c] for c in correct]

    # Three-in-a-row
    runs = [i - 2 for i in range(2, len(letters)) if letters[i] == letters[i - 1] == letters[i - 2]]
    if runs:
        rep.fail(f"three identical correct answers in a row starting at question(s): {runs}")
    else:
        rep.ok("no three identical correct answers in a row")

    # Distribution balance (soft)
    if n:
        dist = {L: letters.count(L) for L in LETTERS}
        shares = {L: dist[L] / n for L in LETTERS}
        skewed = [f"{L}={dist[L]}" for L in LETTERS if shares[L] < 0.15 or shares[L] > 0.35]
        summary = " ".join(f"{L}:{dist[L]}" for L in LETTERS)
        if skewed:
            rep.warn(f"answer distribution skewed ({summary}); aim for roughly a quarter each")
        else:
            rep.ok(f"answer distribution balanced ({summary})")

    # Verdict bands: label + note, descend by min, cover 0
    bands = info["bands"]
    if not bands:
        rep.fail("R.bands is empty; the result screen needs at least one verdict band")
    else:
        missing_fields = [i for i, b in enumerate(bands) if not b["label"] or not b["note"]]
        if missing_fields:
            rep.fail(f"band(s) missing label or note at index: {missing_fields}")
        else:
            rep.ok("every band has a label and a note")
        descending = all(bands[i]["min"] < bands[i - 1]["min"] for i in range(1, len(bands)))
        if descending:
            rep.ok("bands descend by min")
        else:
            rep.fail("bands are not strictly descending by min")
        if any(b["min"] == 0 for b in bands):
            rep.ok("bands cover 0 (a floor band exists)")
        else:
            rep.fail("no band with min:0; the lowest scores would match no band")

    # Every domain has non-placeholder prescribe + href
    empties = [d["id"] for d in domains if not d["prescribe"].strip() or not d["href"].strip()]
    if empties:
        rep.fail(f"domain(s) missing prescribe or href: {empties}")
    else:
        rep.ok("every domain has a prescribe line and an href")
    placeholders = [
        d["id"] for d in domains
        if "units 1-4" in d["prescribe"].lower() or d["href"].strip() in ("/aws-dea-c01/#unit-1", "#", "")
    ]
    if placeholders:
        rep.warn(f"domain(s) still look like the template placeholder (fill from the curriculum index): {placeholders}")


# ---------------------------------------------------------------------------
# Chapter navigation (NAV)
#
# The final card's two buttons ("Chapter catalog" and "Next chapter" /
# "Practice test") are driven by the NAV block in the lesson payload. That
# duplicates ordering data the course index.html already owns, so the two
# have to be checked against each other or they drift apart silently.
#
# The play order is read straight from the UNITS array: inside each unit
# literal `lessons:[...]` precedes `test:{...}`, so an in-order scan of the
# file: keys already yields "the chapter after the last lesson of a unit is
# that unit's practice exam", which is exactly the rule NAV.next follows.
# ---------------------------------------------------------------------------

NAV_RE = re.compile(r"const NAV\s*=\s*\{(.*?)\n\};", re.S)
ENGINE_TAG_RE = re.compile(r'<script src="(\.\./lesson-engine\.js(?:\?v=(\d+))?)"\s*></script>')
INLINE_ENGINE_RE = re.compile(r"const vp\s*=\s*document\.getElementById\('viewport'\);")
UNITS_TEST_RE = re.compile(r'test:\s*\{[^}]*?file:\s*"([^"]+)"', re.S)
FILE_KEY_RE = re.compile(r'file:\s*"([^"]+)"')


def parse_nav(text):
    """Return the NAV literal as a dict, or None when the file has no NAV."""
    m = NAV_RE.search(text)
    if not m:
        return None
    body = m.group(1)
    nav = {}
    for key in ("catalog", "next", "nextLabel"):
        km = re.search(r'\b%s\s*:\s*(null|"([^"]*)")' % key, body)
        if km:
            nav[key] = None if km.group(1) == "null" else km.group(2)
    return nav


def course_order(index_path):
    """(ordered files, test files) from a course index.html UNITS array."""
    src = index_path.read_text(encoding="utf-8")
    if "const UNITS = [" not in src:
        return None, None
    blk = src[src.index("const UNITS = ["):]
    if "\n];" not in blk:
        return None, None
    blk = blk[: blk.index("\n];")]
    return FILE_KEY_RE.findall(blk), set(UNITS_TEST_RE.findall(blk))


def check_engine(path, text, rep):
    """Lessons load the engine from /lesson-engine.js instead of inlining it.

    A lesson that inlines its own copy is pre-migration and only warns; one
    that does both, or neither, is broken.
    """
    p = Path(path)
    tag = ENGINE_TAG_RE.search(text)
    inlined = bool(INLINE_ENGINE_RE.search(text))

    if tag and inlined:
        rep.fail("lesson both loads the shared engine and inlines a copy; the two will fight")
        return True
    if not tag:
        if inlined:
            rep.warn("engine is still inlined in this file rather than loaded from /lesson-engine.js (not yet migrated)")
        elif "const cards = [" in text:
            rep.fail("no engine: the lesson neither inlines one nor loads /lesson-engine.js, so nothing will render")
        return False

    shared = p.parent.parent / "lesson-engine.js"
    if not shared.exists():
        rep.fail(f"loads {tag.group(1)} but no lesson-engine.js sits beside {p.parent.name}/")
    elif tag.group(2) is None:
        rep.warn(f"loads the shared engine without a ?v= cache buster; a stale cached engine can pair with a new payload")
    else:
        rep.ok(f"loads the shared engine ({tag.group(1)})")
    return True


def check_nav(path, text, rep):
    p = Path(path)
    index = p.parent / "index.html"
    nav = parse_nav(text)
    shared_engine = bool(ENGINE_TAG_RE.search(text))

    if nav is None:
        if shared_engine:
            # The shared engine dereferences NAV unconditionally, so a lesson
            # loading it without one renders a blank page.
            rep.fail("no NAV block, but this lesson loads the shared engine, which requires one; the page will render nothing")
        elif "const cards = [" in text and index.exists():
            rep.warn(
                "no NAV block: the final card still ends in Restart rather than "
                "chapter navigation (not yet migrated)"
            )
        return

    missing = [k for k in ("catalog", "next", "nextLabel") if k not in nav]
    if missing:
        rep.fail(f"NAV is missing required key(s): {', '.join(missing)}")
        return

    if nav["catalog"] != "index.html":
        rep.fail(
            f'NAV.catalog is "{nav["catalog"]}"; it must be "index.html", '
            "the course home always sits beside the lesson"
        )

    if not index.exists():
        rep.warn("NAV present but there is no sibling index.html to check the chapter order against")
        return

    ordered, tests = course_order(index)
    if not ordered:
        rep.warn("could not read the UNITS array from the sibling index.html; chapter order not checked")
        return
    if p.name not in ordered:
        rep.warn(f"{p.name} is not listed in the sibling index.html; chapter order not checked")
        return

    i = ordered.index(p.name)
    exp_next = ordered[i + 1] if i + 1 < len(ordered) else None
    exp_label = None if exp_next is None else ("Practice test" if exp_next in tests else "Next chapter")

    if nav["next"] != exp_next:
        rep.fail(
            f'NAV.next is {nav["next"] or "null"} but the course index puts '
            f'{exp_next or "nothing"} after this chapter; the lesson and index.html have drifted'
        )
        return

    if nav["next"] is None:
        rep.ok("NAV: last chapter of the course, final card offers Back to catalog")
    else:
        if nav["nextLabel"] != exp_label:
            rep.fail(
                f'NAV.nextLabel is "{nav["nextLabel"]}" but {nav["next"]} is '
                f'{"a practice exam" if exp_next in tests else "a lesson"}, so it must be "{exp_label}"'
            )
        if not (p.parent / nav["next"]).exists():
            rep.fail(f"NAV.next points at {nav['next']}, which does not exist in {p.parent.name}/")
        else:
            rep.ok(f'NAV: next is {nav["next"]}, matching the course index order')


# ---------------------------------------------------------------------------
# Driver
# ---------------------------------------------------------------------------

def validate_file(path):
    rep = Report(path)
    text = Path(path).read_text(encoding="utf-8")
    kind = detect_type(text)
    # Engine wiring and NAV are checked from the raw file, not the payload
    # zone, so they still run on lessons saved without payload markers.
    check_engine(path, text, rep)
    check_nav(path, text, rep)
    if kind is None:
        rep.fail("no LESSON or EXAM payload markers found; is this a Certified content file?")
        return rep
    payload = extract_payload(text, kind)
    if payload is None:
        rep.fail("could not isolate the payload zone between the BEGIN / END markers")
        return rep

    rep.ok(f"detected {kind} file")
    check_backtick_parity(payload, rep)
    check_em_dashes(payload, rep)
    check_full_script_syntax(text, rep)
    if kind == "lesson":
        check_lesson(payload, rep)
    elif kind == "readiness":
        check_readiness(payload, rep)
    else:
        check_exam(payload, rep)
    return rep


def main(argv):
    if len(argv) < 2:
        print("usage: python scripts/validate.py <file> [<file> ...]")
        return 2
    any_failed = False
    for path in argv[1:]:
        if not Path(path).exists():
            print(f"\n=== {path} ===\n  FAIL  file not found")
            any_failed = True
            continue
        rep = validate_file(path)
        rep.print()
        any_failed = any_failed or rep.failed
    print()
    return 1 if any_failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))