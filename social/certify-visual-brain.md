# Certify visual brain (social kit)

The rendering rules for every social frame this kit produces. The voice and
caption rules live in `already-certified-social-brand.md` (kept in the
brand Google Drive); this file owns everything visual. The render pipeline
(`build/render.mjs`) is the single implementation of these rules: change the
rule here, change the code there, never patch an output PNG by hand.

## Canvas

Portrait 1080 x 1350 for every frame, carousels and single statics alike.
All children of a carousel are identical in size and aspect ratio.

## Palette (fixed, from the live site)

| Role | Hex | Use |
| --- | --- | --- |
| Background (primary) | #14161c | Default frame background |
| Background (deep) | #0d0f13 | Tension frames, contrast panels |
| Panel | #1b1e26 | Hairline rules, cards, separators |
| Text (primary) | #e9e6dd | Headlines and body. Warm cream, never pure white |
| Accent (gold) | #d9a441 | The single gold element per frame |
| Accent (gold, light) | #e5c988 | Link-tone gold, secondary gold only |

Hard rules:

- Cream #e9e6dd, never #ffffff. Pure white is banned everywhere.
- Backgrounds only in the dark family (#14161c, #0d0f13, #1b1e26).
- Exactly one gold content element per frame. The brand mark's gold
  checkmark is excluded from that count. The renderer assigns the element
  deterministically:
  - hook frame: the gold accent bar above the headline
  - tension frame: the gold accent bar above the headline
  - body or value frame without a `gold` callout: the eyebrow
  - value or artwork frame with a `gold` callout: the callout span (the
    eyebrow drops to muted cream)
  - cta frame: the closing "certify.courses" line

## Typography

Two Google Fonts, embedded locally in `build/fonts/` so renders are
offline and deterministic.

- Fraunces (display serif): headlines, big statements, the wordmark.
  700 for hooks, 500 to 600 for other headlines. Never long body copy.
- Hanken Grotesk (sans): body, eyebrows, labels. 400 body, 500 to 600
  emphasis, 700 for small all-caps eyebrows.

## Frame anatomy

96px padding on all sides. Content sits in a column: eyebrow (when the
slide type carries one), headline, body or lines, then a footer brand row
pinned to the bottom: gold check plus the "Certify" wordmark in cream.
Eyebrows render in Hanken 700, all caps, wide letter-spacing.

## Slide types (post.json `slides[].type`)

- `hook`: headline only, 8 words or fewer. Opens every carousel.
- `body`: eyebrow, headline, body paragraph.
- `value`: eyebrow, then either a `lines` list or headline plus body.
  May carry a `gold` callout naming the substring to set in gold.
- `tension`: headline plus body on the deep background (#0d0f13).
  No eyebrow.
- `cta`: a `lines` list whose final line is exactly "certify.courses".
  Closes every carousel.
- `artwork`: the single frame of a `static` post. Eyebrow, headline,
  `lines`, optional `gold` callout.

## Copy limits on a frame

- Hook headline: 8 words or fewer.
- Body, each entry of `lines`, kicker, comparison notes: 15 words or
  fewer. Feed captions are long-form and exempt.
- No em or en dashes anywhere in the kit, captions included. Colons,
  commas, parentheses, periods only.

## Captions

- Instagram: long-form caption, "certify.courses" spoken in the text, no
  live links, 13 to 15 lowercase hashtags carried in the `hashtags` array
  and appended in-caption at render time.
- Facebook: shorter caption with a live https://certify.courses link.
  2 to 3 title-case hashtags, or none.
- Never: dumps, leaked questions, guaranteed-pass claims, hype
  adjectives, engagement bait.

## Sources (post.json `source`)

Every post cites where its claim comes from. Course-backed posts cite the
course chapter (for example "Databricks DE Professional, Unit 9, Ch 32,
obj 9.1 and 9.3"). AWS DEA-C01 posts have no curriculum chapters yet:
they cite the official exam guide domain instead, never a chapter number.
Platform posts (pedagogy, product) cite the platform itself.

## Cert keys (post.json `cert`)

`databricks-de-associate`, `databricks-de-professional`, `aws-dea-c01`,
`databricks-ml-associate`, `databricks-genai-associate`, `platform`.
The validator's allowlist in `build/validate.mjs` is the enforcement point.

## Pipeline

From `social/`:

```
node build/render.mjs && node build/validate.mjs
```

Render writes `out/<slug>/slide-NN.png` (carousels) or
`out/<slug>/post.png` (statics) plus `captions.txt` per post, using the
pre-installed Chromium (`/opt/pw-browsers/chromium`, override with the
`CHROMIUM` env var). Validate exits non-zero on any rule breach,
including wrong PNG dimensions.
