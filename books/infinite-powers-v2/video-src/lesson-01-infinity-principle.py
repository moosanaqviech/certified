"""Infinite Powers, lesson 1: the Infinity Principle (video card `principle-clip`).

Spec: .claude/explainer-video-spec.md. Manim Community 0.22.1, Hanken Grotesk.
Sits after card `principle` and before `fiction`, whose question (atoms
cannot really be sliced forever) picks up the clip's last line.

The example is ours: strips filling a curved area. The book's own
illustrations are not used, and the circle (pizza) argument is kept for
lesson 2, where the book makes it.

Narration: Kokoro-82M text-to-speech (Apache-2.0), voice af_heart. Make the
audio first (python narrate.py lesson-01 --models DIR, see narrate.py); the
scene starts each line with its caption and waits for it to finish.

Render from this folder, one shape after the other (they share a cache):
    manim -qh --fps 30 lesson-01-infinity-principle.py Clip -o lesson-01-169
    manim -qh --fps 30 -r 1080,1920 lesson-01-infinity-principle.py Clip -o lesson-01-916
Renders are not committed to video-src; the card's copies live in ../media/.
"""
import os, sys, wave

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "_shared", "video"))
from manim import *
from cee_manim import Cee

# infinite-powers-v2 palette and variable table (spec)
BG, TINT, INK = "#0f1a24", "#17242f", "#eef3f5"
CURVE, STEP, AREA, GOLD = "#5cc8d8", "#f2b84b", "#7fd6a4", "#d9a441"
FONT = "Hanken Grotesk"

config.background_color = BG
PORTRAIT = config.pixel_height > config.pixel_width
if PORTRAIT:
    config.frame_width = 8.0
    config.frame_height = 8.0 * 16 / 9

# The script, one caption per line. It is also the card's transcript.
SCRIPT = [
    "How much space is inside a curved shape?",
    "A ruler only measures straight edges.",
    "Try rectangles: width times height, easy.",
    "But four of them miss the curve. See the gaps?",
    "So cut thinner. Eight strips. Sixteen. Sixty-four.",
    "Each strip stays simple, and the gaps keep shrinking.",
    "Go all the way: infinitely many, infinitely thin.",
    "The gaps vanish. The strips add up to the exact area.",
    "Cut it up, solve each piece, add them back.",
    "That is the Infinity Principle.",
    "But real things are made of atoms. Can you really keep cutting forever?",
]


# What the voice says: the script, with "eight, sixteen, sixty-four" split so
# each count lands on its own strip change. narrate.py reads this list.
NARRATION = [
    "How much space is inside a curved shape?",
    "A ruler only measures straight edges.",
    "Try rectangles: width times height, easy.",
    "But four of them miss the curve. See the gaps?",
    "So cut thinner.",
    "Eight strips.",
    "Sixteen.",
    "Sixty-four.",
    "Each strip stays simple, and the gaps keep shrinking.",
    "Go all the way: infinitely many, infinitely thin.",
    "The gaps vanish. The strips add up to the exact area.",
    "Cut it up, solve each piece, add them back.",
    "That is the Infinity Principle.",
    "But real things are made of atoms. Can you really keep cutting forever?",
]
AUDIO = os.path.join(os.path.dirname(os.path.abspath(__file__)), "audio", "lesson-01")


def f(x):
    return 1.55 + 0.85 * np.sin(0.95 * x - 0.6) + 0.12 * x


class Clip(Scene):
    # ---- captions -------------------------------------------------------
    def caption(self, i):
        text = SCRIPT[i]
        size = 34 if PORTRAIT else 30
        width = 7.0 if PORTRAIT else 9.6
        words, lines, cur = text.split(), [], ""
        for w in words:   # wrap to two lines at most
            trial = (cur + " " + w).strip()
            if Text(trial, font=FONT, font_size=size).width > width and cur:
                lines.append(cur); cur = w
            else:
                cur = trial
        lines.append(cur)
        body = VGroup(*[Text(l, font=FONT, font_size=size, color=INK) for l in lines]).arrange(DOWN, buff=0.14)
        band = RoundedRectangle(corner_radius=0.14, width=body.width + 0.6, height=body.height + 0.36,
                                fill_color=TINT, fill_opacity=0.9, stroke_width=0)
        cap = VGroup(band, body)
        cap.move_to(UP * 4.35 if PORTRAIT else DOWN * 2.85 + RIGHT * 1.15)
        return cap

    def speak(self, k):
        """Start narration line k now; return when it ends (scene time)."""
        path = os.path.join(AUDIO, f"{k:02d}.wav")
        with wave.open(path) as w:
            dur = w.getnframes() / w.getframerate()
        self.add_sound(path)
        return self.renderer.time + dur

    def wait_until(self, t, pause=0.35):
        left = t + pause - self.renderer.time
        if left > 0.02:
            self.wait(left)

    def say(self, i, k, extra=None, after=0.0, run_time=0.6):
        """Swap in caption i and start narration line k with it, run any
        extra animations alongside, then wait for the line to finish plus a
        short pause (and `after` seconds of silence, for a question beat)."""
        new = self.caption(i)
        anims = [FadeIn(new, shift=UP * 0.08)]
        if getattr(self, "cap", None) is not None:
            anims.append(FadeOut(self.cap))
        end = self.speak(k)
        self.play(*anims, *(extra or []), run_time=run_time)
        self.cap = new
        self.wait_until(end, pause=0.35 + after)

    # ---- scene ----------------------------------------------------------
    def construct(self):
        self.cap = None
        if PORTRAIT:
            cee = Cee(height=1.15).move_to_anchor(LEFT * 2.9 + DOWN * 3.5)
        else:
            cee = Cee(height=1.15).move_to_anchor(LEFT * 5.9 + DOWN * 2.3)

        axes = Axes(x_range=[0, 6, 1], y_range=[0, 3.2, 1],
                    x_length=6.4 if PORTRAIT else 7.4, y_length=4.0 if PORTRAIT else 4.0,
                    tips=False, axis_config=dict(include_ticks=False, stroke_width=0))
        axes.move_to(UP * 1.0 if PORTRAIT else RIGHT * 1.15 + UP * 0.7)
        base = Line(axes.c2p(0, 0), axes.c2p(6, 0), color=INK, stroke_width=2, stroke_opacity=0.6)
        left = Line(axes.c2p(0, 0), axes.c2p(0, f(0)), color=INK, stroke_width=2, stroke_opacity=0.6)
        right = Line(axes.c2p(6, 0), axes.c2p(6, f(6)), color=INK, stroke_width=2, stroke_opacity=0.6)
        graph = axes.plot(f, x_range=[0, 6], color=CURVE, stroke_width=5)

        # 1. Puzzle
        self.play(FadeIn(cee, shift=UP * 0.2), run_time=0.7)
        self.play(Create(base), Create(left), Create(right), run_time=0.8)
        self.say(0, 0, extra=[Create(graph)], run_time=1.4)
        ruler = VGroup(*[Line(axes.c2p(x, -0.18), axes.c2p(x, -0.08 if x % 1 else -0.32), color=INK,
                              stroke_width=2, stroke_opacity=0.7) for x in np.arange(0, 6.01, 0.5)])
        self.say(1, 1, extra=[Create(ruler)], run_time=0.8)

        # 2. Try: four rectangles
        def strips(n):
            r = axes.get_riemann_rectangles(graph, x_range=[0, 6], dx=6 / n, input_sample_type="left",
                                            color=AREA, fill_opacity=0.28, stroke_width=1.5 if n < 40 else 0.6,
                                            stroke_color=AREA)
            return r

        def dx_mark(n):
            w = 6 / n
            line = Line(axes.c2p(0, -0.42), axes.c2p(w, -0.42), color=STEP, stroke_width=5)
            lab = Text("dx", font=FONT, font_size=26, color=STEP).next_to(line, DOWN, buff=0.1)
            return VGroup(line, lab)

        rects = strips(4)
        mark = dx_mark(4)
        self.play(FadeOut(ruler), run_time=0.4)
        self.say(2, 2, extra=[LaggedStart(*[GrowFromEdge(r, DOWN) for r in rects], lag_ratio=0.2),
                              FadeIn(mark)], run_time=1.4)
        self.bring_to_front(graph)
        self.say(3, 3, extra=[cee.pose("puzzled")], after=1.6)   # the question beat: let it sit

        # 3. Build: thinner strips
        count = Text("4 strips", font=FONT, font_size=30, color=INK)
        count.next_to(axes.c2p(6, f(6)), UP, buff=0.35).align_to(axes.c2p(6, 0), RIGHT)
        if PORTRAIT:
            count.next_to(axes.c2p(3, 3.2), UP, buff=0.1)
        self.play(FadeIn(count), cee.pose("neutral"), run_time=0.5)
        new_cap = self.caption(4)
        end = self.speak(4)                      # "So cut thinner."
        self.play(FadeOut(self.cap), FadeIn(new_cap), run_time=0.5)
        self.cap = new_cap
        self.wait_until(end, pause=0.15)
        for k, n in zip((5, 6, 7), (8, 16, 64)):   # each count lands on its change
            end = self.speak(k)
            nxt, nmark = strips(n), dx_mark(n)
            ncount = Text(f"{n} strips", font=FONT, font_size=30, color=INK).move_to(count, aligned_edge=RIGHT)
            if PORTRAIT:
                ncount.move_to(count)
            self.play(ReplacementTransform(rects, nxt), Transform(mark, nmark), Transform(count, ncount),
                      run_time=1.1)
            self.bring_to_front(graph)
            rects = nxt
            self.wait_until(end, pause=0.25)
        self.say(5, 8)

        # 4. Reveal: infinitely many, infinitely thin
        area = axes.get_area(graph, x_range=[0, 6], color=AREA, opacity=0.42)
        inf = Text("infinitely many", font=FONT, font_size=30, color=INK).move_to(count, aligned_edge=RIGHT)
        if PORTRAIT:
            inf.move_to(count)
        self.say(6, 9, extra=[ReplacementTransform(rects, area), FadeOut(mark), Transform(count, inf)],
                 run_time=1.2)
        outline = VGroup(graph.copy(), left.copy(), right.copy(), base.copy()).set_stroke(GOLD, width=6)
        self.say(7, 10, extra=[Create(outline), cee.pose("aha")], run_time=1.2)

        # 5. Name it
        title = Text("The Infinity Principle", font=FONT, font_size=40, weight=BOLD, color=INK)
        if PORTRAIT:
            title.move_to(UP * 5.6)
        else:
            title.to_edge(UP, buff=0.45)
        self.say(8, 11, extra=[FadeOut(count)])
        self.say(9, 12, extra=[Write(title)], run_time=1.0)

        # 6. Hand on: point at the area, ask the next card's question
        target = axes.c2p(0.9, f(0.9) * 0.45)
        self.play(cee.point_at(target))
        self.say(10, 13, after=1.4)
        self.play(*[FadeOut(m) for m in self.mobjects], run_time=0.8)
