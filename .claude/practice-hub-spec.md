# Practice Hub: course-level practice surface (spec)

Status: approved direction, September 2026. All open decisions resolved; ready for build. Planning done in the Certify project; production build goes to Claude Code as a PR against main.
Sample page (live mockup, click Learn / Practice to switch): https://claude.ai/artifact/NWitswgU4kwEyiF3yjWPTe
Sample page source: `claude/practice-hub-sample.html` in the Certify project (not in this repo).

Repo note: the first build ships the DE Associate hub at `practice/databricks-de-associate.html`
(served at `/practice/databricks-de-associate`). It reads the existing exam and readiness
payloads at runtime and never edits them.

## Why

Competitors (CertSafari and similar) open practice with a configuration modal: practice mode, domain balance, question count. It makes the user decide things they are not equipped to decide, and it treats every question in the bank as interchangeable. Certify's practice today is a long quiz that can run past an hour, embedded between chapters, with no shorter entry point.

The hub replaces the config wall with a surface that decides for the user, exposes purpose-named modes with honest time estimates, and makes question quality and domain readiness the visible hero. Question quality (original scenario questions, official docs only) is the moat, so the page should put it on display rather than behind a modal.

## Information architecture (three levels)

1. Course catalog (`/`): navigation only. No practice entry point in the first release (readiness chip on course cards is a later addition, see Decisions).
2. Course home (per cert): two peer faces behind a segmented toggle.
   - Learn: chapters in order, each with its inline recall check (existing behaviour, unchanged).
   - Practice: the hub described below. Route: `/practice/<cert-slug>`.
3. Chapter: lesson cards (Learn / Recall / Reason) plus the chapter-scoped recall check. Unchanged.

Rule: tests move up one level (chapter to course), not two. The inline recall check stays welded to its chapter. The catalog stays clean.

Naming: the inline chapter test is "Recall check". The course-level surface is "Practice". Never call both "test" or "quiz".

## Practice hub: components, top to bottom

### Course header
- Eyebrow: vendor and "certification prep".
- H1: full cert name. Exam code pill (e.g. DEA-C01).
- Subline: unit count, chapter count, question count (real number from the bank, e.g. "240 scenario questions").
- Readiness figure (right): percentage plus "Ready bar: 85%". The 85% bar is the recommended readiness threshold, not the 70% exam pass mark.

### Learn / Practice toggle
Segmented control. Active segment uses a gold tint (rgba(217,164,65,.12) background, gold-light text, 1px gold hairline at .35 alpha). Tint, not solid gold: solid gold is reserved for the primary action.

### Recommended next (gold-bordered card)
One session, already decided. Logic:
- Pick the domain with the lowest mastery.
- Session: 8 questions from that domain, untimed, explanations as you go.
- Copy names the domain, its current percentage, and what the questions cover.
- Primary CTA "Start session" (solid gold). Secondary "Pick a mode" (ghost).
- Cold start (no history in localStorage): recommend "Readiness check" with copy "Start with a 12-question diagnostic so the bars below can fill in." Bars render empty (track only, no fill, no percentage) until the first session completes.

### Domain mastery bars
- One row per official exam domain, in official order, showing the official exam weight (e.g. DEA-C01: Ingestion and transformation 34%, Store management 26%, Operations and support 22%, Security and governance 18%).
- Fill colour by band: weak (below 60%) gold, mid (60 to 69%) cerulean, strong (70% and above) teal. Gold on the weak bar so the eye lands where the work is.
- Every completed session updates the bars for the domains it touched.

### Practice modes (four cards)
| Mode | Questions | Time | Timed | Pool | Notes |
|---|---|---|---|---|---|
| Quick drill | 5 | ~5 min | No | Unit exam pools | Free, no login. Also the public teaser on the cert landing page. |
| Domain focus | 15 | ~12 min | No | Unit exam pools, filtered to one domain | User picks the domain. Deep-link target from the recall-check bridge. |
| Readiness check | 12 | ~15 min | No | Existing `/ready/<slug>` diagnostic | Absorbs the current `/ready` page as a mode. Sampled by domain weight. Updates all bars. |
| Full mock | Official count (65 for DEA-C01) | ~130 min | Yes | Sealed mock pool | Independent from unit pools. Sampled by official domain weights. Framed "sit cold, exam conditions". 2 to 3 mocks per cert. |

Each card shows an icon, name, one-line description, and "N questions · ~T min". Quick drill carries a small "Free" tag.

### Customize (collapsed details)
The old knobs (question count, timed or review, domain split) live here, collapsed by default. Power users only.

### Learn view additions
- Each chapter row shows recall-check state: passed (teal), waiting (gold), not started (faint).
- Bridge nudge below the chapter list: "Finished a recall check? Take that momentum into Domain focus: <domain>". Deep-links into Practice, Domain focus, preselected to the domain that unit covers.

## Persistence (decided: localStorage)
- Readiness figure, per-domain mastery, and recall-check state are stored in localStorage, keyed per cert slug (e.g. `certify.practice.<cert-slug>`).
- No accounts, no server state, no cross-device sync. Consistent with the no-login product.
- Wrap every read and write in try/catch; the page must render correctly (cold-start state) when storage is empty, blocked, or throws.
- Store per-domain attempt counts and correct counts, not just a percentage, so mastery can be recomputed and later sessions weight in properly.
- The Capacitor shell has its own storage origin from the web, so a user on both will see independent progress. Accepted for the first release.

## Question pools and integrity (locked rules)
- Mock questions are independent from unit exam pools. Never reuse.
- Quick drill and Domain focus reuse existing unit exam pools.
- All content sourced from official vendor docs and exam guides only. No dumps, no third-party banks.
- The four live v1 courses stay frozen: this feature adds a new surface and reads existing pools, it does not edit lesson or test payloads.

## Design tokens (Certify brand, dark only)
- Ground `#14161c`, deep `#0d0f13`, panel `#1b1e26`, panel-2 `#20242e`, borders `#272b36` / `#333846`.
- Text cream `#e9e6dd` (never pure white), muted `#8b90a0`, faint `#62647a`.
- Gold `#d9a441` for action and attention (primary CTA, recommended card border, weak bar, active toggle tint). Gold light `#e5c988` for text-on-dark emphasis.
- Per-topic accent inside structure only: cerulean `#5aa9e6` for AWS courses, indigo for Databricks courses. Never replaces gold as the brand mark.
- Teal `#5dcaa5` as a semantic "strong / passed" signal only.
- Type: Fraunces 600 for H1 and card headings, Hanken Grotesk 400 to 700 for everything else. Eyebrows: Hanken 700, all caps, 2px tracking.
- Wordmark `certify.courses` with the gold check, top-left.
- No em dashes in any copy. No guaranteed-pass claims. No engagement bait.

## Sequencing
1. DE Associate first (hub, Quick drill, Domain focus, Readiness check absorbing `/ready`).
2. Sealed mocks: 2 per cert, DE Associate first.
3. Evaluate, then repeat for DE Professional, ML Associate, DEA-C01.
4. Public teaser: cert landing page gets the question count and a free Quick drill above the fold, before any unlock.
5. Later: readiness chip on catalog course cards (see Decisions).

## Out of scope for the first build
- New question authoring beyond the sealed mocks.
- Accounts, server-side progress, or cross-device sync.
- Readiness chip on the catalog page.
- Changes to lesson or test templates (v1 frozen, v2 for GenAI only).

## Decisions (locked, September 2026)
1. Persistence: localStorage, per cert slug. Sufficient for a no-login product. See the Persistence section for the storage contract.
2. Recommended-next cold start: fall back to Readiness check with the diagnostic copy above. Not a generic "Start here".
3. Readiness chip on catalog course cards: later release, not the first build.
