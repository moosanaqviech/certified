# Explainer video spec (books pilot, 22 Nov 2026)

How to make the clip behind a book lesson's `video` card: a 30 to 60 second
animated explainer with a calm narrator, one idea per clip, built in Manim
Community Edition. Books only for now; certification lessons have no video
card and this spec does not apply to them.

The style is borrowed from the classic animated-maths explainer (the look of
3Blue1Brown's 2017 *Essence of Calculus* series): dark backdrop, colour that
means something, equations that morph instead of cut, a concrete puzzle before
any notation, and a small character who reacts the way the viewer would. A
style is free to borrow. The things that are not are listed under "Sourcing",
and they are hard rules.

The engine side is unchanged: the card format, the YouTube recipe and the
validator rules are in the books section of `.claude/CLAUDE.md` and in
`scripts/validate_book.py`. This file covers what goes inside the clip.

## When to use it

- At most one video card per lesson (validator). Most lessons need none.
- Use a clip only for an idea that moves: a limit closing in, a curve
  straightening as you zoom, slivers adding up to an area, a rate changing.
  If a still diagram or a step-built `scene` card says it as well, use that.
- One idea per clip. If the script needs "and also", it is two clips, or the
  second half belongs on a card.
- The next card must ask the learner to act on the clip (validator), so end
  the clip on a question or a half-finished thought that card picks up.

## The look

- **Backdrop**: the book's `palette.bg` from `book.json`, flat, edge to edge.
  No gradients, textures, vignettes or frames. (Infinite Powers: `#0f1a24`.)
- **Ink**: the book's `palette.ink` for text and neutral strokes, at 60%
  opacity for secondary marks (axes, grid, old steps).
- **Colour means a quantity.** Each book keeps a variable table (below): every
  quantity gets one colour and keeps it in the drawing, the equation, the
  caption and every later clip of the book. A colour is never decorative and
  never reused for a second quantity in the same book.
- **Gold `#d9a441`** is reserved for the character's check and for the single
  "this is the answer" highlight at the reveal. Nothing else is gold.
- **Type**: Hanken Grotesk for words (`Text`), LaTeX via `MathTex` for
  mathematics. Words in sentence case, never all caps.
- **Density**: at most one equation and two short lines of words on screen at
  once (about 7 words a line). Old material fades to 30% or leaves before new
  material arrives.
- **Strokes**: flat fills at about 0.25 opacity with a solid stroke in the same
  colour, stroke width 3 to 4 (at 1080 px). No drop shadows, glows or 3D.

### Variable table, per book

Add a table here when a book gets its first clip.

**infinite-powers-v2** (bg `#0f1a24`, ink `#eef3f5`, accent `#5cc8d8`)

| Quantity | Colour | Hex |
| --- | --- | --- |
| the curve, the function | cyan (accent) | `#5cc8d8` |
| a small step, dx, a slice width | amber | `#f2b84b` |
| the change it causes, dy | coral | `#f07a6a` |
| area, accumulated total | mint | `#7fd6a4` |
| time | lavender | `#b9b4f5` |
| a limit or target value | white, dashed | `#eef3f5` |

Amber sits close to the character's gold, so keep them apart: amber is
never used in the corner where the character stands.

## Motion vocabulary

Use only these moves, with their Manim Community names. A clip that needs
something else should prompt an update to this list first.

| Move | Manim | Use it for |
| --- | --- | --- |
| write on | `Write`, `Create` | first appearance of text, a curve, an axis |
| morph | `TransformMatchingTex`, `ReplacementTransform` | one equation becoming the next; a shape becoming another (strips sliding into a rectangle) |
| zoom | `MovingCameraScene`, `self.camera.frame.animate` | "look closer": the curve going straight, the gap shrinking |
| slide and stack | `.animate.shift`, `.animate.arrange` | pieces rearranging to show they add up |
| point | `Indicate`, `Circumscribe` (in the quantity's colour) | "this one": never more than one at a time |
| fade | `FadeIn`, `FadeOut`, `.animate.set_opacity(0.3)` | entering and retiring material |
| trace | `ValueTracker` with `always_redraw` | a quantity changing continuously (dx shrinking, a point sliding along a curve) |

Timing:

- Default `run_time` 1 s; morphs and zooms 1.5 to 2 s; never under 0.5 s.
- Hold every new element at least 1.5 s before the next one starts.
- After the narrator asks a question, hold the frame silent for 1.5 to 2 s.
- No cuts inside a clip. Every change is a visible move from the previous
  frame, so the viewer can see where each thing came from.
- Easing: Manim's default `smooth`. No bounce, overshoot or spin.

## The character: Cee

Cee is the site's brand mark brought to life: the lavender serif C from
`assets/logo-mark.svg` (same glyph, same `#eef0ff` to `#aeb2ff` gradient)
with two eyes, and the gold check (`#d9a441`) as its one hand. Cee has no
mouth and never speaks: the narrator speaks, Cee reacts. That keeps it
clearly ours and clearly unlike any other channel's characters.

Files: `books/_shared/video/cee.svg` (neutral) and `cee-<pose>.svg` for each
pose, plus `cee-sheet.svg` (all five on the backdrop, for review). All are
generated by `python3 scripts/build_cee.py`; change a pose there, never by
hand. Every pose shares one viewBox, so a pose swap in Manim
(`SVGMobject`, then `ReplacementTransform`) keeps Cee in place.

- Body: the C glyph path from `logo-mark.svg`, unaltered, with the logo's
  lavender gradient (`#eef0ff` to `#d3d6ff` to `#aeb2ff`, top left to bottom
  right). The check carries a gold gradient the same way (`#f3cf7a` to
  `#d9a441` to `#b5802b`, light tip to deep base); the "?" and sparks stay
  flat gold. Manim's SVG import may drop gradients, so after loading, re-apply
  them in code (`set_fill([...])` / `set_stroke([...])` with
  `set_sheen_direction(DR)`) and check one frame; the flat midpoints
  (`#d3d6ff`, `#d9a441`) are the fallback.
- Eyes: two white ellipses with dark `#0f1220` pupils, set in the upper bowl
  of the C. Pupils move to look at whatever is being discussed. A narrowed
  eye is a lavender lid over the top half, tilted.
- Hand: the gold check, round caps, detached from the body. It moves on its
  own to point, tick or tap.
- Ids for scenes to address: `body`, `eye-l`, `eye-r`, `pupil-l`, `pupil-r`,
  `lid-l`, `lid-r`, `hand`, `prop` (the "?" or the sparks).

Poses (the full set; add one only by updating this list):

| Pose | Eyes | Check | When |
| --- | --- | --- | --- |
| neutral | open, looking at the action | resting at the opening | default, on screen |
| curious | one eye wider, pupils up and to the side | raised like a raised hand | the opening puzzle |
| puzzled | eyes narrowed | tilted, with a small gold "?" above | the moment the naive answer fails |
| aha | eyes wide | raised high, three gold sparks at its tip | the reveal |
| pointing | looking at the target | extended, with a dashed gold line carrying on from its long arm to a target dot | directing attention to one part |

The pose file's pointer line only shows the direction. In a scene,
`cee.point_at(point)` turns the check about its corner so the long arm aims
at the target, moves the pupils to look the same way, and draws the line
fresh from the tip to the real target (a `DashedLine` in gold,
stroke 7 at 1080 px, ending in a gold dot just short of the part), grow it
with `Create`, and remove it before the next pose. The line may cross empty
backdrop, never a label or another quantity.

Rules:

- Cee stands bottom left: in the corner in landscape, and in portrait just
  above the Shorts safe area, under the diagram, with the words at the top.
  (A top-left Cee in portrait made the pointer line cut through the text.)
  The body is about 1.15 scene units tall (about 14% of the short side). It
  never enters the diagram, and never covers a quantity.
- At most three pose changes per clip. A typical clip: curious at the
  puzzle, puzzled at the wrong turn, aha at the reveal.
- Cee is optional. A clip with no wrong turn can skip it.
- Cee never wears, holds or turns into anything else, and never gets a
  second colour.

## Script

About 140 words a minute, so 70 words for a 30 s clip and 140 for 60 s. The
script is the transcript; write it first and time the animation to it.

Five beats:

1. **Puzzle** (0 to 6 s): a concrete question the viewer could try to answer.
   No notation. "How far has the cyclist gone after ten seconds, if her speed
   keeps changing?"
2. **Try** (6 to 20 s): the obvious approach, and where it falls short. Cee
   goes puzzled here.
3. **Build** (20 to 45 s): the picture that fixes it, one move at a time.
4. **Reveal** (one beat): the payoff, with the single gold highlight. Cee
   goes aha.
5. **Name and hand on** (last 5 s): give the idea its name if it has one,
   then end on the question the next card asks.

Voice: second person, plain words, short sentences, present tense. Say
"notice", "look", "what if". Never "obviously", "simply" or "trivially". No
em dashes in the script, captions or on screen. Narration is recorded by the
owner or with a text-to-speech voice whose licence covers commercial use.
No music, or one quiet royalty-free bed under -24 LUFS.

## Two shapes

The card needs a portrait and a landscape clip. Compose each one; never crop
one from the other.

- **Portrait** 1080 x 1920, 30 fps. The diagram stacks above the equation.
  Keep everything inside a safe area: 120 px from the top, 380 px from the
  bottom and 160 px from the right (the Shorts controls).
- **Landscape** 1920 x 1080, 30 fps. The diagram sits on the left two thirds
  and the equation on the right third. 80 px margin on every side, and keep
  captions and Cee out of the bottom 12% (130 px): the player's control bar
  covers it whenever the clip is paused or just started.
- Minimum sizes at 1080 px wide: words 44 px, equations 56 px, labels 36 px.
  Check on a real phone, not just the render.
- One scene file renders both: a `SHAPE` switch sets the frame size and the
  layout, and the beats and timings stay identical.

## Production

- Manim Community Edition (MIT licence), pinned version written in the scene
  file's header. Never import 3Blue1Brown's own `manimlib` video code.
- Scene source: `books/<book-id>/video-src/lesson-NN-<slug>.py`, one file per
  clip, committed. Renders are not committed: they go to YouTube.
- Cee in a scene: always through `books/_shared/video/cee_manim.py`
  (`Cee(height=1.15).move_to_anchor(...)`, `cee.pose(name)`,
  `cee.point_at(point)`), never a bare `SVGMobject`. Manim re-centres and
  rescales each SVG on its own bounds and drops gradients; the helper lines
  every pose up on the body and paints the gradients back.
  `books/_shared/video/cee_test_clip.py` is the working reference (30 s, both
  shapes, all five poses), tested on Manim Community 0.22.1.
- Install: `pip install manim` in a virtualenv (Debian's system setuptools
  fails to build its `srt` dependency) after the Pango and Cairo dev
  packages (`libpango1.0-dev libcairo2-dev pkg-config`). No LaTeX is needed
  unless a scene uses `MathTex`. Render the two shapes one after the other,
  not in parallel: they share Manim's text cache.
- Render: `manim -qh --fps 30 -r 1920,1080` (landscape) and `-r 1080,1920`
  (portrait), with the background set from the book's `palette.bg`.
- Posters: one frame per shape from the puzzle beat (Cee curious, the question
  readable), saved as JPEG under `books/<book-id>/media/` and named in the
  card's `poster`.
- Captions: upload them to YouTube (`captions: "youtube"`), or burn them in
  (`"burned-in"`): Hanken Grotesk, ink colour on a 60% bg-coloured band, two
  lines at most, inside the safe area. Captions match the transcript word for
  word.
- Upload and wire the card with the YouTube recipe in CLAUDE.md (two videos,
  Public or Unlisted, embedding allowed), then set `seconds` to the real
  length.
- Until the clips are on YouTube, a card may use `host: "file"` with the two
  renders committed under `books/<book-id>/media/` (H.264, `-crf 26`,
  `+faststart`, no audio track while there is no narration; about 1 MB per
  shape for 45 s). Swap to `host: "youtube"` and delete the files once
  uploaded.
- First real clip: `books/infinite-powers-v2/video-src/lesson-01-infinity-principle.py`
  (lesson 1, card `principle-clip`, 43 s), the reference for new clips.

## Sourcing (hard rules)

- **No pi creatures and no lookalikes.** 3Blue1Brown's characters are its
  own. Cee is our only character; never draw a pi-shaped or blob-shaped
  character with a mouth, and never restyle Cee toward theirs.
- **No 3Blue1Brown code, clips, audio or assets.** Their video scripts
  repository is non-commercial and meant for their own videos, and clips need
  a paid licence. We write every scene ourselves in Manim Community.
- **No shot-for-shot remakes** of any of their scenes. Classical arguments
  (slicing a circle, Archimedes' polygons, Riemann strips) are free to use,
  but with our own framing, layout, colours and narration.
- Never name or imitate another channel in a clip, its title or its
  description.
- The book's own sourcing rules still apply (CLAUDE.md, books section): our
  own wording, short credited phrases only, none of the book's figures, and
  the book's text never committed. For `infinite-powers-v2` the owner has
  allowed retelling the book's stories and examples; for other books in
  copyright a clip is an original scene, never a re-enactment from the book.

## Checks before shipping

1. `python3 scripts/validate_book.py books/<book-id>` passes (one video at
   most, both shapes, posters exist, transcript, 30 to 60 seconds, next card
   asks for action).
2. Colour audit: list every quantity in the clip with its colour and compare
   it against the book's variable table. Scrub the render once and check that
   no colour changes meaning.
3. Watch both shapes on a phone with the sound off: the captions alone carry
   it, nothing sits under the Shorts controls, and every label is readable.
4. Watch with the sound on and the screen covered: the narration alone makes
   sense.
5. Transcript, captions and narration match word for word. No em dashes.
6. Sourcing: Cee is the only character, no frame resembles a 3Blue1Brown
   scene, and nothing is copied from the book's figures.
