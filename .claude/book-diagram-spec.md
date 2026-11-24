# Book diagram spec (24 Nov 2026)

How to draw the diagrams in book-engine lessons (`books/`), and how to author
the interactive cards that are built around a picture. Certification lessons
have their own engine and their own anatomy spec (`.claude/anatomy-card-spec.md`);
none of this applies to them.

The rules marked [checked] are enforced by `scripts/validate_book.py` on any
SVG that carries `data-pattern="<name>"`. The rest are review rules. The
reference for every interactive card is `books/card-lab/` (an engine test bed,
unlinked and noindex).

## 1. When to draw

- Draw only when the picture carries the explanation: a process, a shape, a
  change, a comparison, a quantity. If the card reads the same without the
  art, drop the art.
- One idea per diagram. If it needs two, split it across a step build or an
  evolve card.
- Choose the format by what the idea does:
  - It **has parts**: anatomy (or a label card, to make the learner name them).
  - It **happens in order**: flow, step-built.
  - It **changes with a quantity**: graph, or an explorable with a slider.
  - It **branches or combines**: tree, or an evolve card.
  - It **loops back on itself**: cycle.
  - It **differs from something else**: comparison.
  - It **is about size**: scale.
  - It **only shows up over many trials**: a simulate card.

## 2. Canvas and legibility

- Card art uses `viewBox="0 0 320 190"`; evolve stages use `0 0 340 292`
  [checked]. On a phone a 320-wide canvas renders about 1.1 px per unit.
- Text is at least font-size 9; labels are 10 to 11, headings in the art 13 to
  15 [checked].
- Text elements per diagram, at most: anatomy 16, comparison 16, flow 14, tree
  14, scale 14, graph 12, cycle 12 [checked]. If you need more, split it.
- No text sits on a line or a curve, and no text overlaps a shape it does not
  label. Put trough labels below the trough, crest labels above the crest.
- Use `font-family="Hanken Grotesk, system-ui, sans-serif"` on a wrapping
  `<g>` (or `inherit` in the SVG's `<style>`), so a missing font falls back to
  sans, not serif.

## 3. Colour roles

- Colours come from palette variables only: `fill` and `stroke` attributes are
  `var(--...)`, `none`, `transparent`, `currentColor` or `url(#id)` [checked].
  If a diagram truly needs an extra colour, declare it once as a custom
  property on the root (`style='--sea:#5fa8b8'`) and use `var(--sea)`.
- Roles:
  - `--accent`: the main thing (the curve, the focus).
  - `--ink`: text and key marks.
  - `--ink-soft`: neutral lines and secondary labels.
  - `--ink-faint`: axes and grid lines.
  - `--good`: areas, totals, the right answer.
  - `--bad`: errors, the wrong path.
  - `--tint` and `--bg`: panels and knock-outs.
- One colour per quantity, the same in every diagram and clip of a course. A
  course that has a video variable table (`.claude/explainer-video-spec.md`)
  uses the same mapping in its diagrams.
- Gold, or the course's highlight colour, marks the single answer only.
- Never rely on colour alone: label it, or change the shape or line style too.

## 4. Motion

- **Step builds only add.** Each step's elements appear and stay, so draw the
  final picture first, then decide what each step adds. A "before" that must
  vanish belongs in an evolve card, or side by side in a comparison.
- Tag step groups `data-step="1"` to `N` and set `steps: N` on the card. Every
  number from 1 to N is used, and the body text can step along with the art.
- **Evolve cards:** plan keys before drawing.
  - Give each shape that survives to the next stage the same `data-k`.
  - Use `data-from` for a shape that grows out of another (children from a
    parent), and `data-into` for one that collapses into another.
  - Use `data-draw` for lines that should draw themselves in.
  - Put a text-only stage where the reader needs a pause; the next picture
    grows out of the last one.
- Covers loop with CSS `@keyframes` inside the SVG's `<style>`, wrapped in
  `@media (prefers-reduced-motion: reduce)`. No SMIL anywhere.

## 5. Accessibility

- Every non-cover art has an `alt` that describes the final picture and what
  changes, in one or two sentences, not shape by shape.
- Explorables and simulations announce their readouts (the engine handles it);
  their `body` must say in words what the picture shows.

## 6. Do not

- Draw people unless the idea needs a person. Never draw prophets, Imams,
  companions or other sacred figures.
- Copy a book's figures, or redraw them closely.
- Add decoration: borders, textures, drop shadows, clip art.
- Put more than one idea, or more than seven labels, in a diagram.

## 7. Pattern library

Copy a skeleton, keep `data-pattern`, and replace the `<ANGLE>` placeholders.
Each skeleton below passes the [checked] rules as written.

### anatomy: what is inside a thing

The object sits on the left (x 10 to 160); labels sit in a right-hand column at
x 180 and up, each with one straight leader ending in a dot on its part
[checked: at most two short tags at x < 180]. Reveal one label per step. Up to
seven labels.

```svg
<svg viewBox='0 0 320 190' xmlns='http://www.w3.org/2000/svg' data-pattern='anatomy'>
<g font-family='Hanken Grotesk, system-ui, sans-serif'>
<rect x='20' y='30' width='130' height='130' rx='16' fill='var(--tint)' stroke='var(--ink-faint)'/>
<rect x='36' y='46' width='98' height='44' rx='8' fill='var(--accent)' fill-opacity='.25' stroke='var(--accent)'/>
<rect x='36' y='100' width='98' height='44' rx='8' fill='var(--good)' fill-opacity='.25' stroke='var(--good)'/>
<g data-step='1'><line x1='176' y1='58' x2='134' y2='66' stroke='var(--ink-soft)' stroke-width='0.8'/><circle cx='134' cy='66' r='2' fill='var(--accent)'/>
<text x='182' y='56' font-size='11' font-weight='700' fill='var(--accent)'><PART ONE></text>
<text x='182' y='69' font-size='9.5' fill='var(--ink-soft)'>(<what it does>)</text></g>
<g data-step='2'><line x1='176' y1='118' x2='134' y2='122' stroke='var(--ink-soft)' stroke-width='0.8'/><circle cx='134' cy='122' r='2' fill='var(--good)'/>
<text x='182' y='116' font-size='11' font-weight='700' fill='var(--good)'><PART TWO></text>
<text x='182' y='129' font-size='9.5' fill='var(--ink-soft)'>(<what it does>)</text></g>
</g></svg>
```

### flow: a process, in order

Boxes left to right (or top to bottom on a tall idea), arrows between, one box
per step. Three to five boxes.

```svg
<svg viewBox='0 0 320 190' xmlns='http://www.w3.org/2000/svg' data-pattern='flow'>
<g font-family='Hanken Grotesk, system-ui, sans-serif'>
<g data-step='1'><rect x='14' y='66' width='86' height='58' rx='10' fill='var(--tint)' stroke='var(--ink-faint)'/>
<text x='57' y='100' text-anchor='middle' font-size='11' fill='var(--ink)'><STEP ONE></text></g>
<g data-step='2'><path d='M104 95 H114' stroke='var(--ink-soft)' stroke-width='2'/><path d='M113 91 L118 95 L113 99 Z' fill='var(--ink-soft)'/>
<rect x='118' y='66' width='86' height='58' rx='10' fill='var(--tint)' stroke='var(--ink-faint)'/>
<text x='161' y='100' text-anchor='middle' font-size='11' fill='var(--ink)'><STEP TWO></text></g>
<g data-step='3'><path d='M208 95 H218' stroke='var(--ink-soft)' stroke-width='2'/><path d='M217 91 L222 95 L217 99 Z' fill='var(--ink-soft)'/>
<rect x='222' y='66' width='86' height='58' rx='10' fill='var(--tint)' stroke='var(--accent)'/>
<text x='265' y='100' text-anchor='middle' font-size='11' fill='var(--accent)'><RESULT></text></g>
</g></svg>
```

### graph: a quantity that changes

Axes in `--ink-faint`, the curve in `--accent`, labelled points in `--ink`,
derived things (areas, tangents) in `--good`. Axis names at the ends of the
axes, never on the curve. For a graph the learner should move, use an
explorable card instead.

```svg
<svg viewBox='0 0 320 190' xmlns='http://www.w3.org/2000/svg' data-pattern='graph'>
<g font-family='Hanken Grotesk, system-ui, sans-serif'>
<line x1='30' y1='165' x2='300' y2='165' stroke='var(--ink-faint)'/>
<line x1='30' y1='20' x2='30' y2='165' stroke='var(--ink-faint)'/>
<path d='M30 160 C100 155 170 120 290 30' fill='none' stroke='var(--accent)' stroke-width='3'/>
<circle cx='130' cy='139' r='4' fill='var(--ink)'/>
<text x='120' y='126' text-anchor='end' font-size='11' fill='var(--ink-soft)'><POINT></text>
<g data-step='1'><line x1='40' y1='167' x2='280' y2='92' stroke='var(--good)' stroke-width='2.4'/>
<text x='214' y='134' font-size='11' fill='var(--good)'><WHAT APPEARS></text></g>
<text x='300' y='182' text-anchor='end' font-size='10' fill='var(--ink-soft)'><x name></text>
<text x='36' y='26' font-size='10' fill='var(--ink-soft)'><y name></text>
</g></svg>
```

### comparison: two things side by side

Two panels split by a faint divider, the same layout in each, so the
difference is the only thing that changes. Step 1 is the left, step 2 the
right. (This is how a "before" that should vanish is shown: next to the
"after", not under it.)

```svg
<svg viewBox='0 0 320 190' xmlns='http://www.w3.org/2000/svg' data-pattern='comparison'>
<g font-family='Hanken Grotesk, system-ui, sans-serif'>
<line x1='160' y1='30' x2='160' y2='170' stroke='var(--ink-faint)' stroke-dasharray='3 4'/>
<g data-step='1'><text x='80' y='34' text-anchor='middle' font-size='12' font-weight='700' fill='var(--ink)'><LEFT></text>
<rect x='40' y='60' width='80' height='70' rx='10' fill='var(--ink-soft)' fill-opacity='.35'/>
<text x='80' y='160' text-anchor='middle' font-size='10' fill='var(--ink-soft)'><what is true here></text></g>
<g data-step='2'><text x='240' y='34' text-anchor='middle' font-size='12' font-weight='700' fill='var(--accent)'><RIGHT></text>
<rect x='200' y='60' width='80' height='70' rx='10' fill='var(--accent)' fill-opacity='.35'/>
<text x='240' y='160' text-anchor='middle' font-size='10' fill='var(--ink-soft)'><what is true here></text></g>
</g></svg>
```

### tree: one idea branching into parts

The parent at the top, children below on elbow connectors. One level per step,
two to four children per node. For a tree that grows as the reader taps, use
an evolve card (children `data-from` the parent).

```svg
<svg viewBox='0 0 320 190' xmlns='http://www.w3.org/2000/svg' data-pattern='tree'>
<g font-family='Hanken Grotesk, system-ui, sans-serif'>
<circle cx='160' cy='46' r='30' fill='var(--accent)'/>
<text x='160' y='50' text-anchor='middle' font-size='11' font-weight='700' fill='var(--bg)'><PARENT></text>
<g data-step='1'><path d='M130 46 H80 V110 M190 46 H240 V110' fill='none' stroke='var(--ink-soft)' stroke-width='1.4'/>
<circle cx='80' cy='136' r='26' fill='var(--good)'/><text x='80' y='140' text-anchor='middle' font-size='10' font-weight='700' fill='var(--bg)'><CHILD></text>
<circle cx='240' cy='136' r='26' fill='var(--good)'/><text x='240' y='140' text-anchor='middle' font-size='10' font-weight='700' fill='var(--bg)'><CHILD></text></g>
</g></svg>
```

### cycle: a loop that feeds itself

Three to five nodes on a circle, arrows clockwise, the reinforcing (or
balancing) sign in the middle. One node per step.

```svg
<svg viewBox='0 0 320 190' xmlns='http://www.w3.org/2000/svg' data-pattern='cycle'>
<g font-family='Hanken Grotesk, system-ui, sans-serif'>
<circle cx='160' cy='95' r='62' fill='none' stroke='var(--ink-faint)' stroke-dasharray='4 5'/>
<text x='160' y='99' text-anchor='middle' font-size='13' font-weight='700' fill='var(--accent)'>+</text>
<path d='M207 58 L220 61 L211 71 Z' fill='var(--ink-soft)'/><path d='M167 151 L154 157 L167 163 Z' fill='var(--ink-soft)'/><path d='M100 62 L113 58 L106 71 Z' fill='var(--ink-soft)'/>
<g data-step='1'><circle cx='160' cy='33' r='22' fill='var(--tint)' stroke='var(--accent)'/>
<text x='160' y='37' text-anchor='middle' font-size='10' fill='var(--ink)'><A></text></g>
<g data-step='2'><circle cx='214' cy='126' r='22' fill='var(--tint)' stroke='var(--accent)'/>
<text x='214' y='130' text-anchor='middle' font-size='10' fill='var(--ink)'><B></text></g>
<g data-step='3'><circle cx='106' cy='126' r='22' fill='var(--tint)' stroke='var(--accent)'/>
<text x='106' y='130' text-anchor='middle' font-size='10' fill='var(--ink)'><C></text></g>
</g></svg>
```

### scale: how big is it

A number line or a row of ticks, linear or by powers of ten. Mark the things
being compared and say what one tick means.

```svg
<svg viewBox='0 0 320 190' xmlns='http://www.w3.org/2000/svg' data-pattern='scale'>
<g font-family='Hanken Grotesk, system-ui, sans-serif'>
<line x1='20' y1='110' x2='300' y2='110' stroke='var(--ink-soft)' stroke-width='2'/>
<line x1='20' y1='102' x2='20' y2='118' stroke='var(--ink-soft)'/><text x='20' y='134' text-anchor='middle' font-size='10' fill='var(--ink-soft)'>1</text>
<line x1='113' y1='102' x2='113' y2='118' stroke='var(--ink-soft)'/><text x='113' y='134' text-anchor='middle' font-size='10' fill='var(--ink-soft)'>1,000</text>
<line x1='207' y1='102' x2='207' y2='118' stroke='var(--ink-soft)'/><text x='207' y='134' text-anchor='middle' font-size='10' fill='var(--ink-soft)'>1,000,000</text>
<line x1='300' y1='102' x2='300' y2='118' stroke='var(--ink-soft)'/><text x='300' y='134' text-anchor='end' font-size='10' fill='var(--ink-soft)'>1,000,000,000</text>
<g data-step='1'><circle cx='113' cy='110' r='6' fill='var(--accent)'/><text x='113' y='90' text-anchor='middle' font-size='11' fill='var(--accent)'><THING></text></g>
<g data-step='2'><circle cx='300' cy='110' r='6' fill='var(--good)'/><text x='292' y='90' text-anchor='end' font-size='11' fill='var(--good)'><THING></text></g>
<text x='160' y='170' text-anchor='middle' font-size='10' fill='var(--ink-soft)'>each tick is a thousand times the last</text>
</g></svg>
```

## 8. Interactive cards

Five card types (engine v1, 24 Nov 2026) put the learner's hands on the idea.
Lessons stay data only: curves are maths expressions the engine parses
(numbers, `x`, the slider's name, `+ - * / ^`, parentheses, and `sin cos tan
exp ln log sqrt abs floor round min max pow`, `pi`, `e`), and simulations are
built-in models. Nothing in a lesson runs as code. The validator checks every
expression and name.

### explorable: drag a slider, watch the picture and the numbers

A chart (drawn by the engine), one slider, one to three live readouts. The
learner can scrub freely. With a `goal` it becomes a question: the learner
must reach the goal, Continue waits, and it counts as practice.

```json
{"id": "strips", "type": "explorable", "title": "Squeeze the error",
 "body": ["Rectangles under a curve estimate its area. Add strips."],
 "slider": {"id": "n", "label": "Number of strips", "min": 1, "max": 80, "step": 1, "value": 3},
 "plot": {"view": "riemann", "x": [0, 6], "y": [0, 5], "f": "1.5 + 0.8*sin(x)", "xLabel": "x"},
 "readouts": [{"label": "Strips' total", "expr": "area", "digits": 3},
              {"label": "Error", "expr": "error", "digits": 1, "unit": "%"}],
 "goal": {"readout": 1, "op": "below", "value": 1, "text": "Under 1%.", "prompt": "Goal: get the error under 1%."},
 "why": "The slivers shrink faster than their number grows."}
```

- `plot.view` is one of:
  - `riemann`: rectangles under f. The slider counts strips. Readouts may use
    `n dx area exact error`.
  - `secant`: the line from `at` to `at + h`. The slider is h. Readouts may use
    `h slope exact error`.
  - `curve`: f with the slider inside it, for growth and interest. Readouts
    may use `start end`.
- Every readout may also use the slider's name.
- `goal.op` is `below`, `above` or `within` (with a `within` tolerance).
- Use it when the insight is in the movement: the limit, the rate, the growth.
  One slider only. Two sliders means two cards.

### estimate: type a number

```json
{"id": "guess", "type": "estimate", "review": true,
 "prompt": "You flip a fair coin 1,000 times. Roughly how many heads?",
 "answer": 500, "tolerance": 40, "unit": "heads",
 "why": "Half of 1,000 is 500; runs land between 469 and 531 about 95% of the time."}
```

- Correct within `tolerance` of `answer` (absolute). One try.
- Reviewable, and takes `variants`. Set the tolerance to what a sound
  reasoner would reach, not to the exact answer: an estimate card rewards
  reasoning, not recall.

### simulate: run a model many times

```json
{"id": "flips", "type": "simulate", "title": "Flip it yourself", "model": "coins",
 "params": {"p": 0.5}, "runs": [10, 100, 1000],
 "body": ["Run small batches first, then big ones."]}
```

- Models:
  - `coins` (`p`): the running share of heads against a dashed target.
  - `dice` (`dice`, `sides`): a histogram of totals.
  - `drift` (`start`, `advantage`, `size`): a trait's share over generations,
    with "New population" keeping the last runs faint for comparison.
- `runs` are one to three batch sizes. It is not graded, so follow it with a
  question that uses what the learner just saw.
- A new model means engine work: add it to `SIM` in the engine and to
  `SIM_MODELS` in the validator, and list it here.

### label: name the parts of a drawing

```json
{"id": "parts", "type": "label", "review": true, "look": "diagram",
 "prompt": "Label the parts of this graph.", "art": "<svg viewBox='0 0 320 190' ...></svg>",
 "alt": "...",
 "targets": [{"id": "curve", "label": "the curve", "x": 112, "y": 116},
             {"id": "axis", "label": "x-axis", "x": 285, "y": 172}],
 "distractors": ["slope of zero"],
 "why": "..."}
```

- The art is drawn **without** the labels. `targets` are three to six spots in
  the art's own coordinates. The engine places numbered tap spots there.
- The learner taps a name, then a spot; Check marks each right or wrong.
- Targets must be at least 12% of the width or 10% of the height apart
  [checked], and inside the drawing [checked].
- Up to two `distractors` make it a real choice.
- It is the interactive cousin of the anatomy pattern: anatomy teaches the
  parts, label asks for them back, best a few cards later.

### spot: find the mistake in a worked solution

```json
{"id": "spotit", "type": "spot", "review": true,
 "prompt": "Which line of this working is wrong?",
 "working": [{"text": "Slope from x to x + h is ((x + h)² - x²) / h"},
             {"text": "(x + h)² = x² + h²", "wrong": true, "why": "Squaring a sum has a middle term, 2xh."},
             {"text": "So the slope is h"}],
 "why": "Kept, the middle term gives 2x."}
```

- Three to seven lines, exactly one `wrong` with a `why` [checked].
- Make the wrong line the classic slip a learner really makes, and let the
  later lines follow from it faithfully, so the error shows in the conclusion.

### How they count

- Estimate, label, spot, and an explorable with a goal count as questions
  (practice share, first question by card 5, the question-kind mix).
- Explorable, simulate and label count as visual formats for the variety
  rules.
- Estimate, label and spot can be `review: true`.

## 9. Before shipping

1. `python3 scripts/validate_book.py books/<book-id>` passes.
2. Screenshot every diagram at 360 and 390 px wide and on a desktop, at the
   final step. Read each label against what it points at.
3. For step builds, look at every step, not only the last: each must make
   sense on its own.
4. Drive every interactive card in a phone browser: drag the slider end to
   end, reach the goal, run each batch, place every label (including a wrong
   one), tap a wrong line.
