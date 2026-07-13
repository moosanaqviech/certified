# CLAUDE.md - Certified (certification exam prep app)

Mobile-first static site of interactive lessons and timed practice exams,
deployed on Netlify. Live course: Databricks DE Associate (complete).
In progress: Databricks DE Professional (see curriculum-index-de-professional.md,
the authoritative source for unit/chapter placement and eyebrow labels).

## Site structure

Root `index.html` is the multi-course catalog page (vendor list, links out to
each course). Each course lives in its own top-level folder and has its own
`index.html` acting as that course's home:

- `databricks-data-engineer-associate/` - lessons + practice exams for the
  live Associate course.
- Databricks DE Professional lessons/exams go in a sibling
  `databricks-data-engineer-professional/` folder as they're authored.

Blog posts and comparison/guide pages (the SEO content, e.g.
`databricks-data-engineer-associate-certification-guide.html`) live in the
`blog/` folder regardless of which course they're about; do not move them
into a course folder. They are served at clean `/blog/<slug>` URLs, and the
daily automation writes new posts there (see `blog/CONTENT_PLAN.md` and
`blog/BLOG_STYLE_GUIDE.md`). A blog post linking to a sibling post uses a
plain filename; linking out of `blog/` needs a `../` prefix (the catalog is
`../index.html`, a lesson is
`../databricks-data-engineer-associate/lesson-01-lakehouse.html`). Any link
from a root-level page into a lesson or exam must be prefixed with that
course's folder
(`databricks-data-engineer-associate/lesson-01-lakehouse.html`, not
`lesson-01-lakehouse.html`); a root-level page linking to a blog post uses
the `blog/` prefix
(`blog/databricks-data-engineer-associate-certification-guide.html`).

## Architecture: frozen engines, injected payloads

Lessons and exams are standalone HTML files built from frozen templates.
NEVER edit anything below the `ENGINE` marker in either template or in any
generated file. Never edit the `<style>` block of the test template.

- **Lessons** (`lesson-template.html`): copy template, then touch exactly two
  zones: the 5 palette vars in `:root` (`--bg`, `--bg-tint`, `--accent`,
  `--accent-glow` at ~0.12 alpha, `--accent-ink`), and the payload between
  the `LESSON PAYLOAD - BEGIN / END` markers (the `A` SVG object and the
  `cards` array). Also set the `<title>`. Extra named palette colors are
  allowed when SVGs in `A` reference them.
- **Exams** (`test-template.html`): copy template, replace only the payload
  between the `EXAM PAYLOAD - BEGIN / END` markers (`E` config + `QUESTIONS`
  array). Exams keep the gold palette; no per-exam palettes.

Read lesson-authoring-guide.md and test-authoring-guide.md before authoring
anything. They define card shapes, helper classes, and question rules.

## Hard rules for all generated content

- NO em dashes anywhere (content, options, explanations, commit messages).
  Use colons, commas, parentheses, or periods.
- SVG art: static string literals only, no nested template interpolation
  (backtick parity failures). viewBox around 0 0 320 200. Use palette vars
  for stroke/fill so art recolors with the theme.
- Quiz cards: exactly one `data-correct="true"` per card, plus a `.feedback`
  block. Final card carries `last: true`.
- Lessons: 8 to 12 cards, target 9. A second quiz card is required at 11
  or more cards. Chapters exceeding 12 cards should be split, not extended.
- Trade-off lessons (flagged TO in the index) follow the fixed pattern:
  shared ground, one card per option, side-by-side comparison table,
  decision-signal card, two quiz cards testing opposite directions.
- Exam questions: scenario-based, single best answer, 4 options, plausible
  distractors, one question per chapter in scope with a `/* Ch NN - name */`
  comment header, 2 minutes per question, `explain` covers why correct is
  right AND why the top distractor is wrong. Correct letters spread evenly
  across A/B/C/D, never three identical in a row.
- DE Professional terminology (Nov 2025 syllabus): say "Lakeflow Spark
  Declarative Pipelines", never "Delta Live Tables" or "DLT". Liquid
  Clustering is the recommended layout approach; partitioning and Z-Order
  appear only as the contrast case.

## Workflow per lesson or exam

1. Read the curriculum index entry for unit, chapter number, and title.
   If the request conflicts with the index, flag it and propose a one-line fix.
2. Pick a palette tied to the concept's domain; check it against accent
   colors already used in neighboring lessons and explain the choice.
3. Copy the template to the new file, inject palette + payload.
4. Run `python scripts/validate.py <file>` and fix anything it reports
   before presenting the result.
5. Wire the file into that course's own index.html (quicklink + card href),
   e.g. `databricks-data-engineer-associate/index.html` for Associate content.
   Never wire it into the root `index.html`, that page is the cross-course
   catalog and doesn't list individual lessons.

File naming: `lesson-NN-name.html` (Professional numbering continues from
the new index, chapters 1-37), `pro-practice-exam-NN.html` for Professional
exams (Associate keeps `practice-exam-NN.html`).

## Revisions

Prefer targeted edits (single card, single question, single value) over
regenerating a file. Drop-in replacement blocks over full rewrites.

## Deployment

Netlify static hosting; pushing to main deploys. Do not add build steps,
bundlers, or shared JS imports: every lesson and exam must work as a
standalone file opened locally.
