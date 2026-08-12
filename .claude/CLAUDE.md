# CLAUDE.md - Certified (certification exam prep app)

Mobile-first static site of interactive lessons and timed practice exams,
deployed on Netlify. Live courses: Databricks DE Associate (complete) and
Databricks DE Professional (complete, see curriculum-index-de-professional.md
for unit/chapter placement and eyebrow labels).
In progress: AWS Data Engineer Associate (DEA-C01) (see
curriculum-index-aws-dea-c01.md, the authoritative source for unit/chapter
placement; it is marked Draft until re-checked against the official exam
guide PDF) and Databricks Machine Learning Associate (see
curriculum-index-databricks-ml-associate.md and
cert-config-databricks-ml-associate.md; the index is LOCKED, verified against
the official 1 Mar 2025 exam guide PDF. All 30 authored lessons are live and
cover 38 of the guide's 48 objectives; 8 gap lessons (numbered from 31) and
the practice exams using the ml-practice-exam-NN.html prefix are the
remaining work. Exams map to objectives, not chapters: the real exam is 48
scored questions against 48 objectives).
Onboarded, index LOCKED, lessons not yet authored: Databricks Generative AI
Engineer Associate (see curriculum-index-databricks-genai-associate.md and
cert-config-databricks-genai-associate.md; the index is LOCKED, re-verified
against the official 18 Mar 2026 exam guide PDF on 12 Aug 2026. 55 chapters
cover all 56 objectives across 6 units. The course home
(databricks-generative-ai-engineer-associate/index.html) is live as a syllabus
preview and wired into the root catalog, but no lesson or exam exists yet.
Exams map to objectives and SAMPLE them: the real exam is 45 scored questions
against 56 objectives, so one full mock cannot cover them all).

## Site structure

Root `index.html` is the multi-course catalog page (vendor list, links out to
each course). Each course lives in its own top-level folder and has its own
`index.html` acting as that course's home:

- `databricks-data-engineer-associate/` - lessons + practice exams for the
  live Associate course.
- `databricks-data-engineer-professional/` - lessons + practice exams for the
  live Professional course.
- AWS Data Engineer Associate (DEA-C01) lessons/exams go in a sibling
  `aws-data-engineer-associate/` folder as they're authored (see
  curriculum-index-aws-dea-c01.md).
- Databricks Machine Learning Associate lessons/exams go in a sibling
  `databricks-machine-learning-associate/` folder as they're authored (see
  curriculum-index-databricks-ml-associate.md). Exam files use the
  `ml-practice-exam-NN.html` prefix.
- Databricks Generative AI Engineer Associate lessons/exams go in a sibling
  `databricks-generative-ai-engineer-associate/` folder as they're authored
  (see curriculum-index-databricks-genai-associate.md). Exam files use the
  `genai-practice-exam-NN.html` prefix.

Blog posts and comparison/guide pages (the SEO content, e.g.
`databricks-data-engineer-associate-certification-guide.html`) live in the
`blog/` folder regardless of which course they're about; do not move them
into a course folder. They are served at clean `/blog/<slug>` URLs, and the
daily automation writes new posts there (see `blog/CONTENT_PLAN.md` and
`blog/BLOG_STYLE_GUIDE.md`). Any link from a root-level page into a lesson or
exam must be prefixed with that course's folder
(`databricks-data-engineer-associate/lesson-01-lakehouse.html`, not
`lesson-01-lakehouse.html`).

## URL forms: link to the canonical form, always

Netlify serves one file at several URLs: `x.html` answers 200 at both
`/x.html` and `/x`, and `dir/index.html` answers at `/dir/`, `/dir` and
`/dir/index.html`. Nothing redirects between those forms, so a link to the
wrong one gets that duplicate crawled and filed under "Alternate page with
proper canonical tag" in Search Console. Every page therefore declares one
self-referencing `<link rel="canonical">`, and every internal link must use
that same form:

| Page | Canonical URL | Link to it as |
| --- | --- | --- |
| root catalog | `/` | `../` or `./`, never `index.html` |
| course home | `/<course>/` | `<course>/`, never `<course>/index.html` |
| blog post | `/blog/<slug>` | `<slug>` from `blog/`, `blog/<slug>` from root |
| readiness quiz | `/ready/<slug>` | `ready/<slug>`, no `.html` |
| lesson or exam | `/<course>/<file>.html` | keeps `.html` |
| legal page | `/legal/<file>.html` | keeps `.html` |

Lessons and exams keep `.html` because their course index `UNITS` array,
their `NAV` blocks, the legacy `_redirects` targets and `sitemap.xml` all use
that form. `python3 scripts/check_seo.py` fails any page missing a canonical
or linking to a non-canonical form, and runs in CI as `guard-seo`.

## Architecture: frozen engines, injected payloads

Lessons and exams are standalone HTML files built from frozen templates.
NEVER edit anything below the `ENGINE` marker in either template or in any
generated file. Never edit the `<style>` block of the test template.

- **Lessons** (`lesson-template.html`): copy template, then touch exactly two
  zones: the 5 palette vars in `:root` (`--bg`, `--bg-tint`, `--accent`,
  `--accent-glow` at ~0.12 alpha, `--accent-ink`), and the payload between
  the `LESSON PAYLOAD - BEGIN / END` markers (the `NAV` block, the `A` SVG
  object, and the `cards` array). Also set the `<title>`. Extra named palette colors are
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
  for stroke/fill so art recolors with the theme. Gradient stops MUST use
  style form: <stop style="stop-color:var(--x)"/>, never the attribute form
  stop-color="var(--x)" (WebKit and the iOS shell do not resolve var() in
  presentation attributes). Illustration-grade effort goes on the cover
  only; see the cover-art triage in the authoring skill.
- Quiz cards: exactly one `data-correct="true"` per card, plus a `.feedback`
  block. Final card carries `last: true`.
- Every lesson carries a `NAV` block at the top of its payload. The final
  card's footer reads "Chapter catalog" (always `index.html`) and "Next
  chapter", which points at the next chapter in that course's index.html
  `UNITS` order, or at the unit's practice exam when the chapter closes a
  unit, or is `null` on the last chapter of a course (the footer then
  collapses to a single "Back to catalog"). `NAV` duplicates ordering data
  index.html owns, so reordering chapters means updating both;
  `scripts/validate.py` fails any lesson that has drifted from its index.
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
- DEA-C01 terminology: say "Amazon Data Firehose", never "Kinesis Data
  Firehose"; say "Amazon Managed Service for Apache Flink", never "Kinesis
  Data Analytics". Both renames are cosmetic only (API/CLI/IAM/CloudWatch
  identifiers kept the pre-rename names), so IAM policy, CLI, and SDK
  examples should use the retained identifiers even while prose uses the
  current service name.
- GenAI Engineer Associate terminology (18 Mar 2026 guide): say "Mosaic AI
  Vector Search", "Mosaic AI Agent Framework", "Mosaic AI Gateway" (short
  form "AI Gateway"), "Foundation Model APIs", "Agent Bricks" (Knowledge
  Assistant, Multiagent Supervisor, Information Extraction), "Genie Spaces",
  and "Models in Unity Catalog". Prompts are promoted with MLflow prompt
  versions and aliases, never by branch merge. The full list is in
  cert-config-databricks-genai-associate.md.

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

File naming: `lesson-NN-name.html` (each course numbers its own chapters
starting at 01, per that course's curriculum index). Practice exams:
`practice-exam-NN.html` for Associate, `pro-practice-exam-NN.html` for
Professional, `aws-practice-exam-NN.html` for AWS Data Engineer Associate,
`ml-practice-exam-NN.html` for ML Associate, `genai-practice-exam-NN.html`
for Generative AI Engineer Associate.

## Revisions

Prefer targeted edits (single card, single question, single value) over
regenerating a file. Drop-in replacement blocks over full rewrites.

## Deployment

Netlify static hosting; pushing to main deploys. Do not add build steps,
bundlers, or shared JS imports: every lesson and exam must work as a
standalone file opened locally.

Do not redirect the old Netlify subdomain to the apex domain. The
`alreadycertified.netlify.app` subdomain must resolve on its own and must
never be forwarded to `certify.courses`, so `_redirects` and `netlify.toml`
must not contain a host redirect from that subdomain. (`certify.courses`
must also not be set as Netlify's primary domain, since that forces the same
redirect from the dashboard; that part is not enforceable in code.) The
`guard-redirects` GitHub Actions check fails any change that reintroduces a
subdomain host redirect.

## Search engine submission: sitemap for Google, IndexNow for Bing

Two channels, and they cover different engines. Google only reads
`sitemap.xml` (regenerate it with `python3 scripts/build_sitemap.py` when
pages ship). Bing, Yandex, Seznam and Naver also accept a push: the
`indexnow` GitHub Actions workflow POSTs changed URLs to IndexNow on every
push to main that touches a `.html` file or `sitemap.xml`, so a new blog post
gets crawled in hours instead of whenever the sitemap is next read.

Ownership is proved by `c76872b850255d58b2badb72e9eef50a.txt` at the repo
root, served at `https://certify.courses/<key>.txt`. The key is public by
design (it only proves that whoever submits URLs can also publish files on
the host), so it is committed rather than kept in a GitHub secret and the
workflow needs no configuration. Do not delete or rename that file without
also changing its contents to match: `scripts/indexnow.py` refuses to run
unless exactly one root-level `<key>.txt` exists and contains its own key.

`scripts/indexnow.py` only ever submits URLs that appear in `sitemap.xml`,
which is what keeps paywalled lessons and non-canonical URL forms out of the
submission. It maps changed files to URLs through `check_seo.py`'s
`canonical_for()`, so the three scripts share one set of URL rules. Useful
invocations: `--changed --dry-run` to preview what a push would send,
`--all` to resubmit the whole site (also available as the `all` scope on the
workflow's manual run), `--url <URL>` for a single page.
