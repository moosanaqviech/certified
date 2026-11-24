#!/usr/bin/env python3
"""Build the Cee character sheet for book explainer videos.

Cee is the brand mark brought to life (see .claude/explainer-video-spec.md):
the lavender C glyph from assets/logo-mark.svg, two eyes in its bowl, and the
gold check as its one hand. No mouth. Run from the repo root:

    python3 scripts/build_cee.py

Outputs, under books/_shared/video/:
  cee.svg              the neutral pose (the default import)
  cee-<pose>.svg       one per pose: neutral, curious, puzzled, aha, pointing
  cee-sheet.svg        all five poses on the book backdrop, with labels

Every pose shares one viewBox, so swapping poses in Manim keeps Cee in place.
The C and its lids carry the logo's lavender gradient and the check a gold
gradient in the same direction. Manim's SVG import may drop gradients, so a
scene re-applies them in code (see the spec) and the flat LAV and GOLD
values are the fallback. Parts carry ids (body, eye-l, eye-r, pupil-l, pupil-r, lid-l, lid-r, hand,
prop) so a scene can address them. The SVGs are committed; nothing on the
site depends on this script.
"""
import math, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "books", "_shared", "video")

LAV = "#d3d6ff"      # the logo gradient's midpoint: the flat fallback
LAV_STOPS = ("#eef0ff", "#d3d6ff", "#aeb2ff")   # as in assets/logo-mark.svg
GOLD = "#d9a441"
GOLD_STOPS = ("#f3cf7a", "#d9a441", "#b5802b")  # light at the tip, deep at the base
EYE = "#ffffff"
PUPIL = "#0f1220"
BG = "#0f1a24"       # infinite-powers palette.bg, for the sheet only
INK = "#eef3f5"
INK_SOFT = "#9fb0bb"

# One canvas for every pose, in the logo's own coordinates (the C spans
# x 264 to 668, y 256 to 768), with room above for a raised hand or a prop.
VIEWBOX = (200, 150, 820, 680)

# The check as drawn in the logo, and the point it pivots around.
CHECK = [(664, 517), (708, 561), (793, 473)]
PIVOT = (708, 530)

# Eye centres, in the upper bowl of the C.
EYE_L, EYE_R = (440, 450), (532, 450)


def glyph_path():
    with open(os.path.join(ROOT, "assets", "logo-mark.svg")) as f:
        svg = f.read()
    m = re.search(r'<g transform="([^"]+)"><path d="([^"]+)"', svg)
    if not m:
        raise SystemExit("could not find the C glyph in assets/logo-mark.svg")
    return m.group(1), m.group(2)


def move_check(rotate=0.0, scale=1.0, dx=0.0, dy=0.0):
    """Rotate and scale the check about PIVOT, then shift it."""
    a = math.radians(rotate)
    out = []
    for x, y in CHECK:
        x, y = x - PIVOT[0], y - PIVOT[1]
        x, y = x * scale, y * scale
        x, y = x * math.cos(a) - y * math.sin(a), x * math.sin(a) + y * math.cos(a)
        out.append((round(x + PIVOT[0] + dx, 1), round(y + PIVOT[1] + dy, 1)))
    return out


def hand(points, width=26):
    d = "M%s %s L%s %s L%s %s" % (points[0] + points[1] + points[2])
    return (f'<path id="hand" d="{d}" fill="none" stroke="url(#gold)" '
            f'stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>')


def eye(side, centre, rx=27, ry=32, look=(0, 0), pupil=12, lid=None):
    """An eye: white ellipse, dark pupil offset by `look`. `lid` (a tilt in
    degrees) adds a lavender upper lid over the top half: a narrowed eye."""
    cx, cy = centre
    white = f'<ellipse id="eye-{side}" cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{EYE}"/>'
    px, py = cx + look[0], cy + look[1]
    dot = f'<circle id="pupil-{side}" cx="{px}" cy="{py}" r="{pupil}" fill="{PUPIL}"/>'
    if lid is not None:
        top = (f'<path id="lid-{side}" d="M{cx - rx - 2} {cy + 2} A{rx + 2} {ry + 2} 0 0 1 {cx + rx + 2} {cy + 2} Z" '
               f'fill="url(#lav)" transform="rotate({lid} {cx} {cy})"/>')
        return white + dot + top
    return white + dot


def question_mark(x, y, s=1.0):
    d = (f"M{x - 14 * s} {y - 18 * s} Q{x - 14 * s} {y - 38 * s} {x + 4 * s} {y - 38 * s} "
         f"Q{x + 22 * s} {y - 38 * s} {x + 22 * s} {y - 20 * s} "
         f"Q{x + 22 * s} {y - 6 * s} {x + 4 * s} {y + 2 * s} L{x + 4 * s} {y + 12 * s}")
    return (f'<g id="prop"><path d="{d}" fill="none" stroke="{GOLD}" stroke-width="{9 * s}" '
            f'stroke-linecap="round" stroke-linejoin="round"/>'
            f'<circle cx="{x + 4 * s}" cy="{y + 30 * s}" r="{5.5 * s}" fill="{GOLD}"/></g>')


def sparks(cx, cy, r1=26, r2=46, angles=(-110, -50, 10)):
    lines = []
    for a in angles:
        t = math.radians(a)
        lines.append(f'<line x1="{cx + r1 * math.cos(t):.1f}" y1="{cy + r1 * math.sin(t):.1f}" '
                     f'x2="{cx + r2 * math.cos(t):.1f}" y2="{cy + r2 * math.sin(t):.1f}"/>')
    return (f'<g id="prop" stroke="{GOLD}" stroke-width="7" stroke-linecap="round">'
            + "".join(lines) + "</g>")


AHA = move_check(rotate=-12, scale=1.25, dx=30, dy=-150)
POINT = move_check(rotate=30, scale=0.9, dx=10, dy=-6)


def pointer(points, reach=150, gap=20):
    """A dashed gold line carrying on from the check's long arm, ending in a
    dot: the target marker. In a scene, redraw it from the hand to the real
    target (see the spec); here it shows the direction."""
    (x1, y1), (x2, y2) = points[1], points[2]
    L = math.hypot(x2 - x1, y2 - y1)
    ux, uy = (x2 - x1) / L, (y2 - y1) / L
    sx, sy = x2 + ux * gap, y2 + uy * gap
    ex, ey = x2 + ux * (gap + reach), y2 + uy * (gap + reach)
    return (f'<g id="prop"><line x1="{sx:.1f}" y1="{sy:.1f}" x2="{ex:.1f}" y2="{ey:.1f}" stroke="{GOLD}" '
            f'stroke-width="7" stroke-linecap="round" stroke-dasharray="12 12"/>'
            f'<circle cx="{ex + ux * 14:.1f}" cy="{ey + uy * 14:.1f}" r="7" fill="{GOLD}"/></g>')

POSES = {
    "neutral": {
        "when": "default, on screen",
        "eyes": eye("l", EYE_L, look=(5, 2)) + eye("r", EYE_R, look=(5, 2)),
        "hand": hand(move_check()),
        "prop": "",
    },
    "curious": {
        "when": "the opening puzzle",
        "eyes": eye("l", EYE_L, look=(7, -10)) + eye("r", EYE_R, rx=30, ry=37, look=(8, -13)),
        "hand": hand(move_check(rotate=-20, dx=40, dy=-175)),
        "prop": "",
    },
    "puzzled": {
        "when": "the naive answer fails",
        "eyes": eye("l", EYE_L, lid=-12, look=(0, 12)) + eye("r", EYE_R, lid=12, look=(0, 12)),
        "hand": hand(move_check(rotate=18, dx=4, dy=40)),
        "prop": question_mark(735, 320, 1.3),
    },
    "aha": {
        "when": "the reveal",
        "eyes": eye("l", EYE_L, rx=31, ry=38, pupil=11) + eye("r", EYE_R, rx=31, ry=38, pupil=11),
        "hand": hand(AHA),
        "prop": sparks(*AHA[2]),
    },
    "pointing": {
        "when": "directing attention",
        "eyes": eye("l", EYE_L, look=(13, 2)) + eye("r", EYE_R, look=(13, 2)),
        "hand": hand(POINT),
        "prop": pointer(POINT),
    },
}


def defs():
    def grad(gid, stops, x2, y2, units=""):
        st = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in zip((0, 0.5, 1), stops))
        return f'<linearGradient id="{gid}" x1="0" y1="0" x2="{x2}" y2="{y2}"{units}>{st}</linearGradient>'
    return grad("lav", LAV_STOPS, 0.55, 1) + grad("gold", GOLD_STOPS, 0.3, 1)


def pose_svg(name, transform, d):
    p = POSES[name]
    vb = " ".join(str(v) for v in VIEWBOX)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" '
            f'width="{VIEWBOX[2]}" height="{VIEWBOX[3]}">\n'
            f'  <title>Cee, {name}</title>\n'
            f'  <defs>{defs()}</defs>\n'
            f'  <g id="body" transform="{transform}"><path d="{d}" fill="url(#lav)"/></g>\n'
            f'  {p["eyes"]}\n'
            f'  {p["hand"]}\n'
            + (f'  {p["prop"]}\n' if p["prop"] else "")
            + "</svg>\n")


def sheet_svg(poses):
    cell_w, cell_h, cols = 420, 440, 3
    W, H = cell_w * cols + 60, 150 + cell_h * 2 + 40
    font = 'font-family="Hanken Grotesk, system-ui, sans-serif"'
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">',
             f'<rect width="{W}" height="{H}" fill="{BG}"/>',
             f'<g {font}>',
             f'<text x="40" y="70" fill="{INK}" font-size="40" font-weight="700">Cee</text>',
             f'<text x="40" y="108" fill="{INK_SOFT}" font-size="19">Character sheet for book explainer videos. '
             f'Reacts, never speaks. Five poses, one shared canvas.</text>']
    for i, (name, svg) in enumerate(poses):
        col, row = i % cols, i // cols
        if row == 1:
            x0 = 30 + col * cell_w + cell_w // 2   # centre the second row
        else:
            x0 = 30 + col * cell_w
        y0 = 140 + row * cell_h
        inner = svg.split("\n", 1)[1].rsplit("</svg>", 1)[0]
        vb = " ".join(str(v) for v in VIEWBOX)
        parts.append(f'<rect x="{x0 + 10}" y="{y0}" width="{cell_w - 20}" height="{cell_h - 20}" rx="18" '
                     f'fill="none" stroke="{INK_SOFT}" stroke-opacity="0.25"/>')
        art_w = cell_w - 40
        art_h = round(art_w * VIEWBOX[3] / VIEWBOX[2])
        parts.append(f'<svg x="{x0 + 20}" y="{y0 + 30}" width="{art_w}" height="{art_h}" viewBox="{vb}">'
                     + inner.replace('id="', f'id="{name}-').replace('url(#', f'url(#{name}-') + "</svg>")
        parts.append(f'<text x="{x0 + cell_w // 2}" y="{y0 + cell_h - 68}" fill="{INK}" font-size="24" '
                     f'font-weight="700" text-anchor="middle">{name}</text>')
        parts.append(f'<text x="{x0 + cell_w // 2}" y="{y0 + cell_h - 40}" fill="{INK_SOFT}" font-size="17" '
                     f'text-anchor="middle">{POSES[name]["when"]}</text>')
    parts.append("</g></svg>\n")
    return "\n".join(parts)


def main():
    os.makedirs(OUT, exist_ok=True)
    transform, d = glyph_path()
    built = []
    for name in POSES:
        svg = pose_svg(name, transform, d)
        with open(os.path.join(OUT, f"cee-{name}.svg"), "w") as f:
            f.write(svg)
        built.append((name, svg))
    with open(os.path.join(OUT, "cee.svg"), "w") as f:
        f.write(built[0][1])
    with open(os.path.join(OUT, "cee-sheet.svg"), "w") as f:
        f.write(sheet_svg(built))
    print("wrote", len(built) + 2, "files to", os.path.relpath(OUT, ROOT))


if __name__ == "__main__":
    main()
