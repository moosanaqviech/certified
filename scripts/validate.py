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
}
END_RE = {
    "lesson": re.compile(r"LESSON PAYLOAD\s*[\u2014-]\s*END"),
    "exam": re.compile(r"EXAM PAYLOAD\s*[\u2014-]\s*END"),
}


def detect_type(text):
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
  optCounts: QUESTIONS.map(function(q){ return (q.opts || []).length; }),
  minutes: E.minutes,
  pass: E.pass
};
console.log(JSON.stringify(out));
"""


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

    # Option counts
    bad_opts = [i for i, k in enumerate(info["optCounts"]) if k != 4]
    if bad_opts:
        rep.fail(f"questions with != 4 options: {bad_opts}")
    else:
        rep.ok("every question has exactly 4 options")

    # Correct-answer index range
    correct = info["correct"]
    out_of_range = [i for i, c in enumerate(correct) if not isinstance(c, int) or c < 0 or c > 3]
    if out_of_range:
        rep.fail(f"correct index out of range (must be 0-3) at questions: {out_of_range}")
        return

    letters = [LETTERS[c] for c in correct]

    # Three-in-a-row
    runs = []
    for i in range(2, len(letters)):
        if letters[i] == letters[i - 1] == letters[i - 2]:
            runs.append(i - 2)
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


# ---------------------------------------------------------------------------
# Driver
# ---------------------------------------------------------------------------

def validate_file(path):
    rep = Report(path)
    text = Path(path).read_text(encoding="utf-8")
    kind = detect_type(text)
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
    if kind == "lesson":
        check_lesson(payload, rep)
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