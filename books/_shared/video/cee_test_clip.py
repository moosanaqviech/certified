"""Test clip: Cee in a 30-second explainer (the slope at one point).

Not a lesson clip. It exercises the spec end to end: backdrop and the
infinite-powers-v2 variable colours, write-on, a ValueTracker trace, the one
gold answer highlight, and all five Cee poses including point_at().

Render (Manim Community 0.22.1), from this folder:
    manim -qh --fps 30 cee_test_clip.py CeeTest                      # landscape
    manim -qh --fps 30 -r 1080,1920 cee_test_clip.py CeeTest -o CeeTestPortrait
Renders are not committed.
"""
import os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from manim import *
from cee_manim import Cee

BG, INK = "#0f1a24", "#eef3f5"
CURVE, STEP, CHANGE, GOLD = "#5cc8d8", "#f2b84b", "#f07a6a", "#d9a441"
FONT = "Inter"   # the spec's Hanken Grotesk is not installed here; Inter is the stand-in

config.background_color = BG
PORTRAIT = config.pixel_height > config.pixel_width
if PORTRAIT:
    config.frame_width = 8.0
    config.frame_height = 8.0 * 16 / 9


def f(x):
    return 0.1 * x * x + 0.15 * x + 0.5


class CeeTest(Scene):
    def caption(self, text, t2c=None):
        cap = Text(text, font=FONT, font_size=30 if not PORTRAIT else 34, color=INK,
                   t2c=t2c or {})
        if PORTRAIT:
            cap.width = min(cap.width, 7.0)
            cap.move_to(UP * 4.3)
        else:
            cap.move_to(DOWN * 3.35 + RIGHT * 1.0)
        return cap

    def swap_caption(self, old, new):
        if old is None:
            self.play(FadeIn(new, shift=UP * 0.1), run_time=0.6)
        else:
            self.play(FadeOut(old), FadeIn(new, shift=UP * 0.1), run_time=0.6)
        return new

    def construct(self):
        # Cee: bottom left, in portrait above the Shorts controls (spec)
        if PORTRAIT:
            cee = Cee(height=1.15).move_to_anchor(LEFT * 2.9 + DOWN * 3.5)
        else:
            cee = Cee(height=1.15).move_to_anchor(LEFT * 5.9 + DOWN * 2.75)
        self.play(FadeIn(cee, shift=UP * 0.2), run_time=0.8)

        # 1. Puzzle
        q = Text("How steep is a curve at one point?", font=FONT, font_size=40, color=INK)
        if PORTRAIT:
            q.width = min(q.width, 7.2)
            q.move_to(UP * 5.4)
        else:
            q.to_edge(UP, buff=0.6)
        self.play(Write(q), cee.pose("curious"), run_time=1.6)
        self.wait(1.5)

        # 2. The curve
        axes = Axes(x_range=[0, 6, 1], y_range=[0, 5, 1],
                    x_length=6.2 if PORTRAIT else 7.0, y_length=4.4 if PORTRAIT else 4.6,
                    tips=False, axis_config=dict(color=INK, stroke_opacity=0.6, stroke_width=2,
                                                 include_ticks=False))
        axes.move_to(UP * 0.9 if PORTRAIT else RIGHT * 1.0 + DOWN * 0.15)
        graph = axes.plot(f, x_range=[0, 6], color=CURVE, stroke_width=5)
        self.play(Create(axes), run_time=1.0)
        self.play(Create(graph), cee.pose("neutral"), run_time=1.5)

        x0 = 2.5
        P = Dot(axes.c2p(x0, f(x0)), color=INK, radius=0.07)
        self.play(FadeIn(P, scale=0.5))
        cap = self.swap_caption(None, self.caption("Pick a point. Steep, but by how much?"))
        self.wait(1.2)

        # 3. Try: a second point, slope = dy / dx
        dx = ValueTracker(2.4)

        def Q():
            return axes.c2p(x0 + dx.get_value(), f(x0 + dx.get_value()))

        def secant():
            a, b = np.array(P.get_center()), np.array(Q())
            d = normalize(b - a)
            return Line(a - d * 1.4, b + d * 1.4, color=INK, stroke_width=3)

        sec = always_redraw(secant)
        q_dot = always_redraw(lambda: Dot(Q(), color=INK, radius=0.06))
        run = always_redraw(lambda: Line(P.get_center(), axes.c2p(x0 + dx.get_value(), f(x0)),
                                         color=STEP, stroke_width=5))
        rise = always_redraw(lambda: Line(axes.c2p(x0 + dx.get_value(), f(x0)), Q(),
                                          color=CHANGE, stroke_width=5))
        dx_lab = always_redraw(lambda: Text("dx", font=FONT, font_size=26, color=STEP)
                               .next_to(run, DOWN, buff=0.12).set_opacity(min(1, dx.get_value() / 0.6)))
        dy_lab = always_redraw(lambda: Text("dy", font=FONT, font_size=26, color=CHANGE)
                               .next_to(rise, RIGHT, buff=0.12).set_opacity(min(1, dx.get_value() / 0.6)))
        self.play(FadeIn(q_dot), Create(run), Create(rise), run_time=1.0)
        self.play(FadeIn(dx_lab), FadeIn(dy_lab), Create(sec), run_time=1.0)
        cap = self.swap_caption(cap, self.caption("Use a second point: slope = dy / dx",
                                                  t2c={"dy": CHANGE, "dx": STEP}))
        self.wait(1.5)
        cap = self.swap_caption(cap, self.caption("But that measures two points, not one."))
        self.play(cee.pose("puzzled"))
        self.wait(2.0)   # the question beat: silence

        # 4. Build: shrink dx
        cap = self.swap_caption(cap, self.caption("So slide the second point closer, and closer.",
                                                  t2c={}))
        self.play(cee.pose("neutral"), run_time=0.5)
        self.play(dx.animate.set_value(0.02), run_time=4.0, rate_func=smooth)
        self.wait(0.6)

        # 5. Reveal: the single gold highlight
        a = np.array(P.get_center())
        slope = (0.2 * x0 + 0.15) * (axes.y_length / 5) / (axes.x_length / 6)
        d = normalize(np.array([1.0, slope, 0.0]))
        tangent = Line(a - d * 1.9, a + d * 1.9, color=GOLD, stroke_width=6)
        self.remove(sec)
        self.play(FadeOut(run), FadeOut(rise), FadeOut(dx_lab), FadeOut(dy_lab), FadeOut(q_dot),
                  Create(tangent), cee.pose("aha"), run_time=1.0)
        cap = self.swap_caption(cap, self.caption("One point, one slope: the derivative."))
        self.wait(1.8)

        # 6. Name and hand on: point at it
        # aim at the tangent's near end, so the line crosses no quantity
        self.play(cee.point_at(a - d * 1.75))
        cap = self.swap_caption(cap, self.caption("Next: what does that slope tell you?"))
        self.wait(2.0)
        self.play(*[FadeOut(m) for m in self.mobjects], run_time=0.8)
