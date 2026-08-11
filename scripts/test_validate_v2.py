#!/usr/bin/env python3
"""Tests for the v2 (step-sequenced) lesson checks in validate.py.

Builds four lesson fixtures on the fly in a temp directory (so no lesson-like
HTML is committed into the site tree) and asserts validate.py's behavior:

  1. a v1 file: engine detected as v1, existing checks pass unchanged;
  2. a valid v2 file with a 3-step card + a .stepcap: passes;
  3. a v2 file with a step gap (steps:3 but no data-step 2): must FAIL;
  4. a v2 file containing a SMIL <animateMotion>: must FAIL.

Each fixture is a real template shell (frozen engine included) with only the
payload zone swapped, so the full-script syntax check and node payload
evaluation run exactly as they do on a shipped lesson.

Run: python3 scripts/test_validate_v2.py   (exit 0 = all assertions held)
"""

import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import validate  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
V1_SHELL = (ROOT / ".claude" / "lesson-template.html").read_text(encoding="utf-8")
V2_SHELL = (ROOT / ".claude" / "lesson-template-v2.html").read_text(encoding="utf-8")


def splice(shell, payload):
    """Replace the shell's LESSON PAYLOAD zone with `payload`, keeping the
    frozen engine and the marker comments intact."""
    begin = validate.BEGIN_RE["lesson"].search(shell)
    end = validate.END_RE["lesson"].search(shell)
    close = shell.find("*/", begin.end()) + 2
    open_before = shell.rfind("/*", 0, end.start())
    return shell[:close] + "\n\n" + payload + "\n\n" + shell[open_before:]


# --- shared payload pieces (no em dashes anywhere) --------------------------

NAV = """const NAV = { catalog: "index.html", next: null, nextLabel: null };"""

ART = """const A = {
  cover: `<svg viewBox="0 0 320 200"><rect x="40" y="40" width="240" height="120" rx="16" fill="var(--surface-2)" stroke="var(--line)"/></svg>`,
  done: `<svg viewBox="0 0 84 84"><circle cx="42" cy="42" r="38" fill="none" stroke="var(--accent)" stroke-width="3"/></svg>`
};"""

COVER = """  { glow: "radial-gradient(540px 340px at 50% 18%, var(--accent-glow), transparent 70%)",
    html: `
    <div class="spacer" style="flex:0.3"></div>
    <div class="eyebrow reveal">Module</div>
    <h1 class="reveal">A fixture lesson</h1>
    <p class="lead reveal">Framing sentence for the test fixture.</p>
    <div class="art grow reveal">${A.cover}</div>` }"""


def concept(n):
    return """  { html: `
    <div class="eyebrow reveal">Concept %d</div>
    <h2 class="reveal">A single idea, stated plainly</h2>
    <div class="pills reveal">
      <div class="pill"><p><b>Point</b>A concrete explanation.</p></div>
    </div>
    <div class="spacer"></div>` }""" % n


QUIZ = """  { quiz: true,
    html: `
    <div class="eyebrow reveal">Quick check</div>
    <h2 class="reveal" style="font-size:24px">A scenario question?</h2>
    <div class="choices reveal">
      <button class="choice" data-correct="false"><span class="key">A</span>A wrong answer</button>
      <button class="choice" data-correct="true"><span class="key">B</span>The right answer</button>
      <button class="choice" data-correct="false"><span class="key">C</span>Another wrong answer</button>
    </div>
    <div class="feedback"><b>Correct.</b> Why B is right and A is not.</div>` }"""

DONE = """  { last: true,
    html: `
    <div class="spacer" style="flex:0.4"></div>
    <div class="done-badge reveal">${A.done}</div>
    <h2 class="reveal" style="text-align:center;font-size:27px">Lesson complete</h2>
    <div class="pills reveal">
      <div class="pill"><p><b>Takeaway</b>Restated crisply.</p></div>
    </div>
    <div class="spacer"></div>` }"""

# A valid 3-step diagram card with a .stepcap caption swap (data-step 0..3).
STEP3_CARD = """  { steps: 3,
    html: `
    <div class="eyebrow reveal">Mechanism</div>
    <h2 class="reveal">Assembles in three steps</h2>
    <div class="art reveal"><svg viewBox="0 0 320 200">
      <rect x="20" y="80" width="60" height="40" rx="8" fill="var(--surface-2)" stroke="var(--line)"/>
      <g data-step="1"><rect x="130" y="80" width="60" height="40" rx="8" fill="var(--accent-glow)" stroke="var(--accent)"/></g>
      <g data-step="2"><rect x="240" y="80" width="60" height="40" rx="8" fill="var(--accent-glow)" stroke="var(--accent)"/></g>
      <g data-step="3"><line x1="80" y1="100" x2="130" y2="100" stroke="var(--accent)" stroke-width="2"/></g>
    </svg></div>
    <div class="stepcap">
      <p class="lead" data-step="0">Tap to build the pipeline.</p>
      <p class="lead" data-step="1">First the source lands.</p>
      <p class="lead" data-step="2">Then the sink appears.</p>
      <p class="lead" data-step="3">Finally data flows between them.</p>
    </div>
    <div class="spacer"></div>` }"""

# steps:3 but data-step 2 is missing: a gap, must fail.
STEP_GAP_CARD = """  { steps: 3,
    html: `
    <div class="eyebrow reveal">Mechanism</div>
    <div class="art reveal"><svg viewBox="0 0 320 200">
      <g data-step="1"><rect x="20" y="80" width="60" height="40" fill="var(--accent-glow)" stroke="var(--accent)"/></g>
      <g data-step="3"><rect x="240" y="80" width="60" height="40" fill="var(--accent-glow)" stroke="var(--accent)"/></g>
    </svg></div>
    <div class="spacer"></div>` }"""

# valid steps, but a SMIL animateMotion element: must fail.
STEP_SMIL_CARD = """  { steps: 2,
    html: `
    <div class="eyebrow reveal">Mechanism</div>
    <div class="art reveal"><svg viewBox="0 0 320 200">
      <g data-step="1"><circle cx="20" cy="100" r="6" fill="var(--accent)">
        <animateMotion dur="3s" repeatCount="indefinite" path="M0 0 H 200"/>
      </circle></g>
      <g data-step="2"><rect x="240" y="80" width="60" height="40" fill="var(--accent-glow)" stroke="var(--accent)"/></g>
    </svg></div>
    <div class="spacer"></div>` }"""


def payload(*cards):
    body = ",\n\n".join(cards)
    return NAV + "\n\n" + ART + "\n\nconst cards = [\n\n" + body + "\n];"


# Nine cards each, one quiz, a final last:true card.
V1_PAYLOAD = payload(COVER, concept(1), concept(2), concept(3), concept(4),
                     concept(5), concept(6), QUIZ, DONE)
V2_VALID = payload(COVER, STEP3_CARD, concept(2), concept(3), concept(4),
                   concept(5), concept(6), QUIZ, DONE)
V2_GAP = payload(COVER, STEP_GAP_CARD, concept(2), concept(3), concept(4),
                 concept(5), concept(6), QUIZ, DONE)
V2_SMIL = payload(COVER, STEP_SMIL_CARD, concept(2), concept(3), concept(4),
                  concept(5), concept(6), QUIZ, DONE)


def run(shell, pl, tmp, name):
    path = tmp / name
    path.write_text(splice(shell, pl), encoding="utf-8")
    rep = validate.validate_file(str(path))
    return rep


def main():
    failures = []

    def expect(cond, msg):
        status = "ok  " if cond else "FAIL"
        print(f"  [{status}] {msg}")
        if not cond:
            failures.append(msg)

    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)

        print("Fixture 1: v1 lesson (existing checks, unchanged)")
        r = run(V1_SHELL, V1_PAYLOAD, tmp, "fixture-v1.html")
        expect(not r.failed, "v1 fixture passes with no errors")
        expect(any("v1 engine" in m for m in r.passes), "engine detected as v1")
        expect(not any("v2 engine" in m for m in r.passes + r.errors),
               "no v2-only checks run on a v1 file")

        print("Fixture 2: valid v2 lesson with a 3-step card")
        r = run(V2_SHELL, V2_VALID, tmp, "fixture-v2-valid.html")
        expect(not r.failed, "valid v2 fixture passes with no errors")
        expect(any("v2 engine" in m for m in r.passes), "engine detected as v2")
        expect(any("3 steps" in m for m in r.passes), "3-step card reported as covering 1..3")

        print("Fixture 3: v2 lesson with a step gap (must fail)")
        r = run(V2_SHELL, V2_GAP, tmp, "fixture-v2-gap.html")
        expect(r.failed, "gap fixture fails")
        expect(any("data-step" in m and ("[2]" in m or "gap" in m) for m in r.errors),
               "the gap (missing data-step 2) is the reported error")

        print("Fixture 4: v2 lesson with a SMIL animateMotion (must fail)")
        r = run(V2_SHELL, V2_SMIL, tmp, "fixture-v2-smil.html")
        expect(r.failed, "SMIL fixture fails")
        expect(any("SMIL" in m for m in r.errors), "the SMIL element is the reported error")

    print()
    if failures:
        print(f"{len(failures)} assertion(s) failed.")
        return 1
    print("All v2 validator assertions held.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
