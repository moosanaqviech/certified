# Storyboard format

A storyboard is a Python file with two names: `VIDEO` (settings) and `SCENES` (a list of scene
dicts). Python rather than JSON so a scene can carry a custom `draw` function. Paths are
resolved from the current directory first (run build.py from the repo root), then from the
storyboard's folder.

## Contents
1. VIDEO fields
2. Narration lines and timing
3. Scene types
4. Custom scenes and the ctx API
5. Layout regions

## 1. VIDEO fields

| Field | Required | Meaning |
|---|---|---|
| `slug` | yes | Output folder name under `video-out/` |
| `format` | yes | `"landscape"` (1920x1080) or `"short"` (1080x1920) |
| `theme` | yes | Lesson path (palette read from its `:root`), or a dict `bg`, `bg_tint`, `accent`, `accent_ink` |
| `assets` | if using art | Folder of PNGs, usually `video-out/<slug>/src/art`; scenes refer to art by file stem (`"cover"`) |
| `badge` | no | Chip shown top-left (landscape) or top-center (short) on every scene except `title` |
| `course` | no | `dict(name=..., url=...)`, written into `youtube.txt` |
| `voice` | no | `dict(speaker=0, length_scale=1.0)`; `False` for no narration. Larger length_scale is slower |
| `pronounce` | no | Extra spoken forms, merged over the default acronym table |
| `music`, `music_seed` | no | Background bed on/off (default on); seed 0-3 picks the chord progression |
| `thumbnail` | no | `dict(text=..., sub=..., kicker=..., art=...)`, landscape only |
| `youtube` | no | `dict(title=..., description=..., tags=[...])` |

## 2. Narration lines and timing

`lines` is a list. Each item is a string, or a dict:

```python
dict(text="Caption shown on screen", say="What the voice reads instead", pause=0, caption=True)
```

- `pause` adds silence after the line (the quiz countdown uses it).
- `caption=False` speaks the line without a caption box (the line is still in captions.srt).
  Scene types `title`, `quiz` and `cta` turn captions off by default because they show their own
  text; set `captions=True` on the scene to override.

**Timing model.** build.py first lays out a *visual* timeline from estimated speech (2.6 words
per second), then synthesizes each line and stretches the gap before any line whose audio runs
long. Builds key off line starts, so they stay in sync after the stretch. `dur` on a scene is a
minimum length; scenes with no lines need one (default 4 s). Builds use `ctx.reveal(k)`.

**Which line reveals which item** (bullets, compare rows, flow steps): if a scene has one more
line than items, line 0 introduces the heading and item k appears on line k+1. Otherwise item k
appears on line k. Override with `first_item_line=N`. Extra items beyond the lines stagger in.

`chapter="Name"` on a scene starts a YouTube chapter there. YouTube needs the first on scene 0,
at least three, each at least 10 s; otherwise `youtube.txt` omits them and build.py says why.

Other per-scene keys: `chrome=False` hides badge and logo; `badge=False` hides only the badge.

## 3. Scene types

### title
`title`, optional `eyebrow`, `subtitle`, `art`. Landscape: text left, art right. Short: art top.

### bullets
`heading`, `items` (strings, or `(bold, text)` pairs, which is how lesson pills map), optional
`art` (right column on landscape, above the list on shorts). The active item is outlined. Up to
about 4 items on landscape, 4 on shorts; text shrinks to fit, so more items means smaller type.

### art
`art`, optional `heading`, optional `callouts`: `[dict(text=..., x=0.62, y=0.4, line=1, side="r")]`
with x and y as fractions of the drawn image box. Slow zoom over the scene. Best for lesson
diagrams that already explain themselves; narrate what the viewer should look at.

### compare
`heading`, `columns` (header row; first entry labels the row-name column), `rows` (lists the same
length as columns). Rows build one per line. Lesson comparison tables come out of extract.mjs as
`tables[0]`: header row first. Keep to 3 or 4 columns on landscape, 3 on shorts.

### flow
`heading`, `steps` (strings or `(title, sub)`). Horizontal on landscape (up to 5), vertical on
shorts (up to 5). Arrows draw in as each step arrives; a dot travels completed arrows.

### quiz
`question`, `options` (exactly 4), `correct` (0-3), optional `explain`, `countdown` (default 5),
`label` (pill text, default "Exam question"). Without `lines`, narration is generated: read the
question, "Pause and pick your answer." plus the countdown, "The answer is X: ...", then
`explain`. With your own `lines`, set `reveal_line` to the index of the line that reveals the
answer, and give the line before it a `pause` for the countdown. Ticks and a chime are added.

### big
`text` (one statement or number), optional `kicker`, `sub`, `color` (RGB tuple). For a takeaway.

### code
`heading`, `code` (multi-line string), optional `lang`, `typing` (default True), `cps` (typing
speed), `highlight` as `{line_index: [code line numbers]}` to highlight lines while that
narration line plays. Keep code under about 14 lines on landscape, 12 on shorts.

### cta
`title`, `url` (default `certify.courses`), `sub`, `subscribe` (default True), `button` text.
Default button: "Subscribe for more" (landscape) or "Follow for daily exam questions" (short).

## 4. Custom scenes and the ctx API

```python
def my_scene(ctx, sc, t):
    x0, y0, x1, y1 = ctx.stage
    top = ctx.heading("How the visibility timeout works", ctx.reveal(0))
    r = ctx.reveal(1)
    ctx.rrect(x0, top, x0 + 600, top + 200, 20, fill=ctx.th.panel)
    ctx.arrow(x0 + 620, top + 100, x0 + 620 + 300 * r, top + 100, ctx.th.accent)
    ctx.text(x0 + 30, top + 100, "Message in flight", 40, "heavy", ctx.th.ink, r)

SCENES = [dict(type="custom", draw=my_scene, lines=["...", "..."])]
```

All coordinates are output pixels; `t` is the scene's visual time in seconds.

- Text: `text(x, y, s, size, kind, fill, alpha, anchor)` single line, anchor like `"lm"`, `"mm"`,
  `"rm"`; `para(x, y, s, size, kind, maxw, fill, alpha, lh, align)` wrapped, returns the bottom
  y; `wrap`, `measure`, `fit(s, kind, maxw, size, min_size, max_lines)`, `para_height`.
  Kinds: `display` and `display_bold` (Fraunces), `body`, `semi`, `heavy` (Hanken Grotesk),
  `mono` (JetBrains Mono). Characters outside the bundled latin fonts fall back to a system font.
- Shapes: `rrect`, `circle`, `line`, `arrow`, `dashed`, `check`, `pill(x, y, label, color, ...)`.
- Images: `image(key_or_path, cx, cy, w, h, alpha, scale)` returns the drawn box; `logo(...)`.
- Colors: `ctx.th.bg`, `bg_tint`, `accent`, `accent_ink`, `ink`, `muted`, `gold` (the site's
  action gold, #d9a441), `panel`, `panel_hi`, `line`. Use `A(color, alpha)` from videokit for
  translucency (`from videokit import A, ease_out` works inside storyboards run by build.py).
- Timing: `reveal(k, dur, delay)` eases 0 to 1 when line k starts; `at(k)`; `line_now()`.
- Easing: `ease`, `ease_out`, `ease_back`, `lerp`, `lerpc`, `clamp` from videokit.

## 5. Layout regions

| | Landscape | Short |
|---|---|---|
| `ctx.stage` (content) | x 110-1810, y 150-860 | x 70-1010, y 250-1300 |
| caption zone | y 880-1050 | y 1330-1600 |
| badge / logo | top-left / top-right, y 72 | top-center / top-right, y 165 |

The Short layout keeps content out of the bottom fifth and the right edge, where the YouTube
Shorts interface (title, buttons) sits on top of the video.
