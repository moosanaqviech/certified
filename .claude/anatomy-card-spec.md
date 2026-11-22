# Anatomy card spec (LOCKED, 22 Nov 2026)

A lesson card that shows one thing cut open, with every part named by an
outside label, revealed one label per tap. The style comes from a textbook
anatomy plate (a heart in cross-section): clean art in the middle, all text
outside the art, a thin leader line from each label to its part, and two
colour families that carry meaning.

Reference implementation: card 3 of
`aws-solutions-architect-associate/lesson-08-network-segmentation.html`
(`A.anatomy`, a VPC cut open: internet gateway, public and private subnets,
route table, public IP). Copy from it, or from the skeleton below.

`scripts/validate.py` enforces the rules marked [checked] on any SVG that
carries `data-pattern="anatomy"`. The rest are review rules.

## When to use it

Use it for a "what is inside this thing, and what does each part do" concept
where the parts sit in fixed places: a VPC, a Delta table (log and data
files), a Spark executor, a serving endpoint, a Lambda execution environment,
a Glue job, an S3 bucket's protection layers.

Do not use it for a process over time (use an ordered step build), a
comparison of options (use the trade-off table), or a concept with no
physical layout. One anatomy card per lesson is the norm; never two in a row.

## Layout

- Canvas `viewBox="0 0 272 200"` [checked]. Narrower than the usual 320 on
  purpose: the shell caps the SVG at 320 CSS px, so 272 units render about
  18% larger and the labels stay readable on a phone.
- The drawing sits on the left, x 8 to 132. The label column starts at
  x 146; labels sit at x >= 140 [checked].
- Nothing is written on the drawing except at most two small context tags,
  font-size 8 or less, such as "internet" beside a cloud [checked].
- No border, background panel or decoration around the object. One object
  fills the frame.
- A "cut open" cue: a hatched outer wall (the `pattern` in the skeleton) with
  an inner wall, so the object reads as sectioned, not just outlined.

## Labels

- 3 to 7 labels [checked]; 6 or 7 is typical. Above 7 it does not fit a
  phone: split the object over two cards.
- Each label is two lines: a name (font-size 10, weight 700) and below it, in
  brackets, what the part does (font-size 8.2, `var(--ink-soft)`), e.g.
  `internet gateway` / `(the VPC's door to the internet)`. Keep the bracket
  line to about 32 characters; at most one label may wrap to a third line.
- Vertical pitch 28 units: names at y 14, 42, 70, 98, 126, 154, 182, bracket
  line 11 below each name. Fewer labels: keep the pitch and centre the stack.
- Label order top to bottom follows the parts' order top to bottom, so no two
  leaders cross.
- Every leader is one straight line, stroke `var(--ink-soft)` at 0.8, from
  (142, name y minus 3.5) to the part, ending in a dot of r 1.8 on the part.
  The dot lands on the exact part the name says (the subnet's edge for
  "subnet", the route row for "route table"), never on a neighbouring part.
  Leaders may cross the drawing, never another leader or a label.
- Name colour matches the part's colour family. Bracket lines stay
  `var(--ink-soft)`.
- SVG text uses `font-family="Hanken Grotesk, system-ui, sans-serif"` on a
  wrapping `<g>` [checked], so a missing web font falls back to sans, not
  serif.

## Colour

- Two semantic families from the lesson palette, e.g. `var(--accent)` for the
  reachable or active side and `var(--lav)` for the protected or passive side.
  Parts are tinted fills (about 0.12 alpha) with a solid stroke in their
  family colour.
- `var(--warn)` only for the one "this does not work" part, if the concept
  has one (a red X marker).
- Neutral parts (walls, devices) use `var(--ink-soft)` and `var(--ink-faint)`.

## Step build

- The card is a step build [checked]: `steps: N`, one label per step. The
  object's most general label (the container, e.g. "VPC") can show from the
  start; every other label arrives on its own tap.
- Each step group holds the label, its leader and a highlight of its part (a
  thicker or recoloured stroke drawn over the base shape), so the learner sees
  which shape the new label means.
- Every `data-step` group carries an inline `style="pointer-events:none"`
  [checked]: the frozen engine's `.step-on` would otherwise let a revealed
  group swallow taps.
- One step may add a flow line (`class` with a CSS `stroke-dashoffset`
  keyframe), wrapped in `@media (prefers-reduced-motion: reduce)`. No SMIL.

## Captions

- `.stepcap-swap` with one caption per step, `data-step="0"` as the intro
  ("Here is an X cut open: tap through its parts").
- Stack the captions in one grid cell [checked]: `style="display:grid"` on the
  container and `grid-area:1/1` on each caption. Without it the caption sits
  lower on every tap and squeezes the art.
- The art wrapper is `<div class="art reveal" style="min-height:0;flex-shrink:0;margin:2px 0 12px">`.
- Each caption adds what the bracket line cannot (the rule, the exam trap),
  not a repeat of the label.

## Checks before shipping

1. `python3 scripts/validate.py <file>` passes, including the anatomy line.
2. Screenshot the final step at 360 px and 390 px wide and on desktop with
   the real fonts loaded (Google Fonts may be blocked in a cloud session: the
   `@fontsource/hanken-grotesk` npm package has the same files). No label
   runs past the right edge, no leaders cross, and every dot sits on its part.
3. Read each label against its dot: does the dot touch the thing the name
   says?

## Skeleton

Names in `<ANGLE_BRACKETS>` are placeholders. Prefix ids and classes with the
chapter (`s08h`, `s08flow`) so two lessons never collide. Remove unused label
groups and renumber the steps.

```js
  anatomy: `<svg viewBox="0 0 272 200" data-pattern="anatomy">
    <defs>
      <pattern id="<ID>h" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="5" style="stroke:var(--ink-faint)" stroke-width="1.2"/>
      </pattern>
    </defs>
    <style>
      .<ID>flow { stroke-dasharray: 3 4; animation: <ID>run 1.4s linear infinite; }
      @keyframes <ID>run { from { stroke-dashoffset: 14; } to { stroke-dashoffset: 0; } }
      @media (prefers-reduced-motion: reduce) { .<ID>flow { animation: none; } }
    </style>
    <g font-family="Hanken Grotesk, system-ui, sans-serif">
    <!-- the object, cut open: hatched outer wall, inner wall, two chambers -->
    <rect x="8" y="32" width="124" height="162" rx="16" fill="url(#<ID>h)" fill-opacity="0.55" stroke="var(--ink-faint)"/>
    <rect x="15" y="39" width="110" height="148" rx="10" fill="var(--surface)" stroke="var(--ink-faint)" stroke-opacity="0.6"/>
    <rect x="20" y="48" width="100" height="64" rx="9" fill="rgba(<ACCENT_RGB>,0.13)" stroke="var(--accent)"/>
    <rect x="20" y="118" width="100" height="64" rx="9" fill="rgba(196,181,253,0.12)" stroke="var(--lav)"/>
    <!-- parts inside the chambers go here, in neutral ink -->
    <!-- container label, visible from the start -->
    <path d="M142 38.5 L132 46" stroke="var(--ink-soft)" stroke-width="0.8"/><circle cx="132" cy="46" r="1.8" fill="var(--ink-soft)"/>
    <text x="146" y="42" fill="var(--ink)" font-size="10" font-weight="700"><CONTAINER></text>
    <text x="146" y="53" fill="var(--ink-soft)" font-size="8.2">(<WHAT IT DOES>)</text>
    <!-- one group per label: highlight of the part, leader, dot, name, job -->
    <g style="pointer-events:none" data-step="1">
      <rect x="20" y="48" width="100" height="64" rx="9" fill="none" stroke="var(--accent)" stroke-width="1.9"/>
      <path d="M142 66.5 L120 62" stroke="var(--ink-soft)" stroke-width="0.8"/><circle cx="120" cy="62" r="1.8" fill="var(--accent)"/>
      <text x="146" y="70" fill="var(--accent)" font-size="10" font-weight="700"><PART NAME></text>
      <text x="146" y="81" fill="var(--ink-soft)" font-size="8.2">(<WHAT IT DOES>)</text>
    </g>
    <!-- data-step="2" .. N: next labels at name y 98, 126, 154, 182 -->
    </g>
  </svg>`,
```

```js
  { steps: <N>,
    html: `
    <div class="eyebrow reveal"><EYEBROW></div>
    <h2 class="reveal" style="font-size:25px"><TITLE></h2>
    <div class="art reveal" style="min-height:0;flex-shrink:0;margin:2px 0 12px">${A.anatomy}</div>
    <div class="stepcap-swap" style="display:grid">
      <p class="lead" data-step="0" style="pointer-events:none;grid-area:1/1;font-size:14.5px">Here is <OBJECT> cut open: tap through its parts.</p>
      <p class="lead" data-step="1" style="pointer-events:none;grid-area:1/1;font-size:14.5px"><CAPTION FOR STEP 1></p>
      <!-- one caption per step, up to data-step="<N>" -->
    </div>` },
```
