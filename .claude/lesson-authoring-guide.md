lesson-authoring-guide.md
# Lesson authoring guide
 
The shell (`lesson-template.html`) holds all CSS, the page scaffold, the card engine, quiz wiring, and keyboard / swipe navigation. It never changes. To make a lesson you touch exactly two zones:
 
1. The **palette** block inside `:root`.
2. The **payload** block between the `LESSON PAYLOAD — BEGIN / END` markers (`NAV`, `A`, and `cards`).
Everything below the `ENGINE` marker stays frozen.
 
## Palette (5 vars)
 
| Var | Meaning |
|---|---|
| `--bg` | page background |
| `--bg-tint` | ambient glow tint behind the card |
| `--accent` | topic color: quiz-correct border, feedback heading, code highlights |
| `--accent-glow` | fill behind a correct answer (use the accent at ~0.12 alpha) |
| `--accent-ink` | text color sitting on top of the accent chip (usually the dark bg) |
 
You can add extra named colors here (for example `--silver`, `--lake`) when the SVGs in `A` reference them.
 
## Card shape
 
Each entry in `cards` is an object:
 
- `html` (required): the card's inner markup.
- `glow` (optional): a per-card radial gradient, for example `radial-gradient(540px 340px at 50% 20%, var(--accent-glow), transparent 70%)`.
- `quiz` (optional): `true` gates the Continue button until an answer is tapped. The card must contain `.choices` with `.choice` buttons (one carrying `data-correct="true"`) and a `.feedback` block.
- `last` (optional): `true` on the final card. Swaps the footer for the two NAV buttons (see below).
 
## NAV (where the lesson exits to)
 
The final card replaces the back arrow and the primary button with two exits, both driven by the `NAV` block at the top of the payload:
 
```js
const NAV = {
  catalog:   "index.html",
  next:      "lesson-29-diagnosing-cluster-failures.html",
  nextLabel: "Next chapter"
};
```
 
- `catalog` is always `"index.html"`: the course home is a sibling of every lesson, so no folder prefix is ever needed.
- `next` is the following chapter in that course's `index.html` `UNITS` order. When the chapter closes a unit, it is that unit's practice exam instead, and `nextLabel` becomes `"Practice test"`. The engine appends the arrow, so the label itself carries no glyph.
- On the last chapter of a course, set `next` and `nextLabel` to `null`. The footer collapses to a single full-width "Back to catalog".
 
This duplicates ordering that `index.html` already owns, so moving a chapter means editing both. `python scripts/validate.py <file>` fails any lesson whose `NAV` has drifted from its course index, and that check is the only thing keeping the two in sync.
 
Keyboard and swipe still only move between cards: leaving a lesson always takes a deliberate tap, so a stray swipe on the final card cannot navigate away.
## Helper classes available in card HTML
 
- `.eyebrow` (with optional `.dot`), `h1`, `h2`, `.lead` (and `.lead strong`): typography.
- `.reveal`: staggered entrance animation. Put it on the top-level children you want to rise in, in order (first four get the stagger).
- `.art` / `.art.grow`: centers an SVG; `.grow` lets it fill remaining height.
- `.pills` + `.pill` (with `<b>` heading inside `<p>`, and optional `.ic` SVG): the recap / point list.
- `.tag`: a small pill label.
- `.choices` + `.choice` (+ `.key`): quiz options. The engine adds `.correct` / `.wrong` / `.dim` on tap.
- `.feedback` (with `<b>`): the after-answer explanation.
- `.codeblock` (spans `.kw` `.st` `.cm` `.al`) and inline `code`.
- `.done-badge`: the final-card checkmark holder.
- `.spacer`: flexible vertical filler (use `style="flex:0.3"` etc. to tune).
## SVGs
 
Put each illustration in `A` as a template-string SVG keyed by name, then reference it inside a card with `${A.name}`. Use `viewBox` (typically `0 0 320 200` ish) and the palette vars for stroke / fill so art recolors with the theme.
 
## Low-token workflow
 
1. Keep `lesson-template.html` and this guide in project knowledge. Drop the bulky finished lessons; one template plus this spec is all the reference needed.
2. Start a **fresh chat per lesson** so prior lessons are not re-read every turn.
3. Give the topic, the palette, and roughly how many cards. Ask only for the **payload** (the `A` object and the `cards` array), not the whole file.
4. Paste that payload between the markers in your saved template, set the five palette vars and the `<title>`, and save as `lesson-NN-name.html`.
5. For revisions, ask for the single card or value to change, not a regenerate.
The shell is about two-thirds of each file. Producing only the payload is what brings the per-lesson cost down.
 
