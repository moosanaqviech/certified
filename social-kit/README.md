# Certify social kit

Regenerated from the shipped SVG frames (Aug 2026). Turns structured post data
into brand-locked Instagram + Facebook assets. No canvas, no hand-editing.

## Run

    node render.mjs

Validates every post, then writes `out/<slug>/` with per-slide SVG + PNG + JPG
and a `captions.txt` (IG caption + hashtags, FB variant).

## Layout

    lib/tokens.mjs      brand tokens, extracted verbatim from shipped SVGs
    lib/layouts.mjs     layouts: hook, tension, value, value-shot, stat, single, cta
    lib/validate.mjs    brand gate: dashes, word limits, gold budget, hashtags
    content/posts.mjs   the content (posts 16-19)
    bin/capture.mjs     screenshots the live site into assets/ (see below)
    assets/             captured screens used by value-shot frames
    render.mjs          validate -> build SVG -> rasterize -> JPG -> captions
    fonts/static/       static Fraunces + Hanken instances (see below)
    fonts/fonts.conf    local fontconfig so the build is self-contained

## Product screenshots (value-shot)

Teaching posts use SVG diagrams. Product posts (a claim about the app) use a
real screenshot in a device frame, per the Visual Brain "Product Frames" rule:
one screenshot per frame, 1px #272b36 bezel, 34px radius, on a #1b1e26 panel,
no shadows or tilts, at most one gold callout which is that frame's gold element.

Screenshots are REAL captures of the live site, never mockups. The kit cannot
reach certify.courses from a sandbox, so capture runs where the site is live:

    npm install -D playwright
    npx playwright install chromium
    node bin/capture.mjs        # edit the SHOTS list first: urls + selectors

That writes PNGs into assets/. Then a slide references one:

    {
      layout: 'value-shot',
      eyebrow: 'LEARN',
      headlineLines: ['One concept, one diagram'],
      shot: { src: 'assets/lesson-streaming-tables.png' },
      callout: { nx: 0.09, ny: 0.20, nw: 0.24, nh: 0.13, label: 'tap to build' },
      caption: 'A real lesson card, straight from the app.',
    }

callout coords are normalized 0..1 within the shot; the gold ring lands on the
element you name, and the label sits below the frame. Omit callout for a plain
framed screen. assets/placeholder-lesson.png is a stand-in to prove the frame
renders; replace it with a real capture before shipping a product post.


## Requirements

    node (ESM)
    rsvg-convert      (librsvg2-bin) renders SVG text via fontconfig
    convert           (ImageMagick)  PNG -> JPG for Instagram

resvg-js was tried first and rejected: it silently ignores custom font buffers
and falls back to a bundled sans, so Fraunces never applied. librsvg resolves
the bundled static fonts through fontconfig and renders correctly.

## Fonts

Google's Fraunces and Hanken Grotesk ship as variable fonts that librsvg's
matcher does not weight-resolve cleanly. `fonts/static/` holds static instances
pinned per weight (Fraunces opsz=144, SOFT=0, WONK=0) with clean family names.
Regenerate with the fonttools instancer if the weights ever change.

## Adding a post

Append an entry to `content/posts.mjs`. A post is data: an ordered `slides`
array (each names a layout + copy) plus `captionIg`, `hashtags`, `captionFb`.
Rules the validator enforces: no em/en dashes anywhere, hook <= 8 words, body
<= 15, exactly one gold element per value/single frame (use `em` for a second
emphasis), 10-30 hashtags. Carousels open on `hook`, close on `cta`.
