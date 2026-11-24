"""Cee for Manim Community (see .claude/explainer-video-spec.md).

    from cee_manim import Cee
    cee = Cee(height=1.1).move_to_anchor(LEFT * 5.6 + DOWN * 2.7)
    self.play(FadeIn(cee))
    self.play(cee.pose("curious"))
    self.play(cee.point_at(some_point))   # pointing pose plus a dashed gold line
    self.play(cee.pose("aha"))            # also clears the pointer line

Why a helper, not a bare SVGMobject:
- Manim re-centres and rescales every SVG on its own bounding box, so the
  shared viewBox does not keep Cee still between poses. Each pose is lined
  up here on its body (same height, same centre) instead.
- Manim drops SVG gradients (the body imports black, the check uncoloured),
  so the logo's lavender gradient and the gold check gradient are painted
  back on here.
- The pose files' pointer line only shows a direction; point_at() draws a
  live one to the real target.
"""
import math
import os

from manim import (VGroup, VMobject, Circle, DashedLine, Dot, Transform, FadeIn,
                   FadeOut, AnimationGroup, Create, Succession, DR, DOWN, ORIGIN,
                   SVGMobject, normalize, config)

HERE = os.path.dirname(os.path.abspath(__file__))
POSES = ("neutral", "curious", "puzzled", "aha", "pointing")

LAV_STOPS = ("#eef0ff", "#d3d6ff", "#aeb2ff")
GOLD_STOPS = ("#f3cf7a", "#d9a441", "#b5802b")
GOLD = "#d9a441"
PUPIL = "#0f1220"

BODY_UNITS = 512.0   # the C's height in the SVG's own units
HAND_UNITS = 26.0    # the check's stroke width in the same units


def _stroke(height, svg_units):
    """Manim stroke widths are in hundredths of a scene unit."""
    return svg_units / BODY_UNITS * height * 100


def _parts(svg):
    """Split an imported pose into named parts by what each shape is."""
    subs = list(svg.submobjects)
    body = subs[0]
    hand_i = next(i for i, s in enumerate(subs) if abs(s.get_stroke_width() - HAND_UNITS) < 0.5)
    hand = subs[hand_i]
    eyes, pupils, lids = [], [], []
    for s in subs[1:hand_i]:
        if isinstance(s, Circle) and s.get_fill_color().to_hex().lower() == "#ffffff":
            eyes.append(s)
        elif isinstance(s, Circle):
            pupils.append(s)
        else:
            lids.append(s)
    prop = subs[hand_i + 1:]
    return dict(body=body, eyes=eyes, pupils=pupils, lids=lids, hand=hand, prop=prop)


class Cee(VGroup):
    def __init__(self, height=1.1, start="neutral", **kw):
        super().__init__(**kw)
        self.cee_height = height
        self.anchor = ORIGIN
        self.pointer = None
        self.poses = {name: self._load(name) for name in POSES}
        self.current = start
        self.add(self.poses[start].copy())

    # ---- building -------------------------------------------------------
    def _load(self, name):
        svg = SVGMobject(os.path.join(HERE, f"cee-{name}.svg"))
        p = _parts(svg)
        svg.scale(self.cee_height / p["body"].height)
        svg.shift(-p["body"].get_center())
        p["body"].set_fill(list(LAV_STOPS), opacity=1).set_stroke(width=0)
        p["body"].set_sheen_direction(DR)
        for lid in p["lids"]:
            lid.set_fill(list(LAV_STOPS), opacity=1).set_stroke(width=0).set_sheen_direction(DR)
        for e in p["eyes"]:
            e.set_fill("#ffffff", 1).set_stroke(width=0)
        for q in p["pupils"]:
            q.set_fill(PUPIL, 1).set_stroke(width=0)
        p["hand"].set_fill(opacity=0)
        p["hand"].set_stroke(list(GOLD_STOPS), width=_stroke(self.cee_height, HAND_UNITS))
        p["hand"].set_sheen_direction(DOWN)
        for s in p["prop"]:
            if s.get_fill_opacity() > 0 and s.get_stroke_width() == 0:
                s.set_fill(GOLD, 1).set_stroke(width=0)
            else:
                s.set_stroke(GOLD, width=_stroke(self.cee_height, s.get_stroke_width())).set_fill(opacity=0)
        if name == "pointing":
            p["prop"] = []     # point_at() draws the real line
        group = VGroup(p["body"], VGroup(*p["eyes"]), VGroup(*p["pupils"]), VGroup(*p["lids"]),
                       p["hand"], VGroup(*p["prop"]))
        return group

    def move_to_anchor(self, point):
        """Place the body's centre at `point`; every pose uses the same spot."""
        shift = point - self.anchor
        self.anchor = point
        for g in self.poses.values():
            g.shift(shift)
        self.submobjects[0].shift(shift)
        return self

    @property
    def view(self):
        return self.submobjects[0]

    def hand_tip(self, name=None):
        hand = (self.poses[name] if name else self.view)[4]
        pts = hand.get_anchors()
        return pts[-1]

    # ---- animation ------------------------------------------------------
    def pose(self, name, run_time=0.6, target=None):
        """Animate to a pose. Parts that exist in both poses morph; lids and
        props that exist in only one fade. `target` overrides the stored pose
        (point_at passes one with the hand turned)."""
        target = target if target is not None else self.poses[name].copy()
        anims = []
        if self.pointer is not None:
            anims.append(FadeOut(self.pointer))
            self.pointer = None
        anims.append(Transform(self.view, target, run_time=run_time))
        self.current = name
        return AnimationGroup(*anims)

    def aimed(self, point):
        """The pointing pose turned toward `point`: the check rotates about
        its corner until its long arm lines up with the target, and the
        pupils look the same way. Works for targets to Cee's right, above or
        below (Cee stands bottom left, so targets always are)."""
        g = self.poses["pointing"].copy()
        hand = g[4]
        a = hand.get_anchors()            # P1, P2, P2, P3: short arm, then long arm
        corner, tip = a[1], a[-1]
        arm = tip - corner
        want = point - corner
        turn = math.atan2(want[1], want[0]) - math.atan2(arm[1], arm[0])
        hand.rotate(turn, about_point=corner)
        look = normalize(point - g[0].get_center())
        for eye, pupil in zip(g[1], g[2]):
            room = (eye.height - pupil.height) / 2 * 0.55
            pupil.move_to(eye.get_center() + look * room)
        return g

    def point_at(self, point, run_time=0.6, gap=0.14):
        """Pointing pose aimed at `point`, then a dashed gold line from the
        check's tip to just short of it, ending in a gold dot."""
        target = self.aimed(point)
        tip = target[4].get_anchors()[-1]
        direction = normalize(point - tip)
        end = point - direction * gap
        start = tip + direction * gap * 0.8
        line = DashedLine(start, end, color=GOLD, stroke_width=5, dash_length=0.12, dashed_ratio=0.55)
        dot = Dot(end, radius=0.065, color=GOLD)
        to_pose = self.pose("pointing", run_time=run_time, target=target)   # clears any old pointer
        self.pointer = VGroup(line, dot)
        return Succession(to_pose, AnimationGroup(Create(line), FadeIn(dot), run_time=0.7))
