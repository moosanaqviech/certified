"""Certified video kit: the rendering engine behind build.py and scenes.py.

Coordinates are logical pixels of the output frame: 1920x1080 for "landscape",
1080x1920 for "short". Frames are drawn at SS times that size and box-filtered
down, which is what gives the shapes and text clean edges.
"""
from __future__ import annotations

import math
import os
import re
import subprocess
import wave
from functools import lru_cache

import numpy as np
from PIL import Image, ImageDraw, ImageFont

SKILL_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT_DIR = os.path.join(SKILL_DIR, "assets", "fonts")
LOGO_PNG = os.path.join(SKILL_DIR, "assets", "logo-mark.png")
CACHE_DIR = os.environ.get("CERTIFIED_VIDEO_CACHE", os.path.expanduser("~/.cache/certified-video"))
VOICE_DIR = os.path.join(CACHE_DIR, "voices", "en-us-libritts-high")
VOICE_PATH = os.path.join(VOICE_DIR, "en-us-libritts-high.onnx")

SS, FPS, SR = 2, 30, 44100
FORMATS = {"landscape": (1920, 1080), "short": (1080, 1920)}
GOLD, INK, MUTED = (217, 164, 65), (238, 240, 255), (165, 174, 210)

FONTS = {
    "display": "Fraunces-SemiBold.ttf",      # headings, like the lessons' --display
    "display_bold": "Fraunces-Bold.ttf",
    "body": "HankenGrotesk-Medium.ttf",      # body copy, like the lessons' --body
    "semi": "HankenGrotesk-SemiBold.ttf",
    "heavy": "HankenGrotesk-ExtraBold.ttf",  # labels, keys, badges
    "mono": "JetBrainsMono-Medium.ttf",
}
# The bundled fonts are latin subsets. Characters they lack (arrows, subscripts)
# are drawn with the first fallback font found here.
FALLBACK_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
    "/Library/Fonts/Arial Unicode.ttf",
    "C:/Windows/Fonts/seguisym.ttf",
]

# ---------------------------------------------------------------- small math
def clamp(t): return max(0.0, min(1.0, t))
def ease(t): t = clamp(t); return t * t * (3 - 2 * t)
def ease_out(t): t = clamp(t); return 1 - (1 - t) ** 3
def ease_back(t):
    t = clamp(t); c1 = 1.70158; c3 = c1 + 1
    return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2
def lerp(a, b, t): return a + (b - a) * t
def lerpc(c1, c2, t): return tuple(int(round(lerp(a, b, t))) for a, b in zip(c1[:3], c2[:3]))
def A(c, a): return tuple(c[:3]) + (int(255 * clamp(a)),)

def hex2rgb(s):
    s = s.strip()
    m = re.match(r"rgba?\(([^)]+)\)", s)
    if m: return tuple(int(float(v)) for v in m.group(1).split(",")[:3])
    s = s.lstrip("#")
    if len(s) == 3: s = "".join(c * 2 for c in s)
    return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))

# ---------------------------------------------------------------- fonts
@lru_cache(maxsize=None)
def _font_path(kind):
    if kind == "fallback":
        return next((p for p in FALLBACK_CANDIDATES if os.path.exists(p)), None)
    return os.path.join(FONT_DIR, FONTS[kind])

@lru_cache(maxsize=None)
def font(kind, px):
    return ImageFont.truetype(_font_path(kind), max(1, int(px)))

@lru_cache(maxsize=None)
def _coverage(kind):
    path = _font_path(kind)
    if not path: return frozenset()
    try:
        from fontTools.ttLib import TTFont
        return frozenset(TTFont(path, lazy=True).getBestCmap().keys())
    except Exception:
        return frozenset(range(0x20, 0x250))

# ---------------------------------------------------------------- theme
class Theme:
    """Colors for one video. Built from a lesson's palette so the video matches the chapter."""
    def __init__(self, bg="#0b0d1a", bg_tint="#22265a", accent="#aeb2ff", accent_ink=None):
        self.bg, self.bg_tint, self.accent = hex2rgb(bg), hex2rgb(bg_tint), hex2rgb(accent)
        self.accent_ink = hex2rgb(accent_ink) if accent_ink else self.bg
        self.ink, self.muted, self.gold = INK, MUTED, GOLD
        self.panel = lerpc(self.bg, (255, 255, 255), 0.07)
        self.panel_hi = lerpc(self.bg, self.accent, 0.22)
        self.line = lerpc(self.bg, (255, 255, 255), 0.18)

    @classmethod
    def from_lesson(cls, path):
        css = open(path, encoding="utf-8").read()
        root = re.search(r":root\s*\{(.*?)\}", css, re.S)
        block = root.group(1) if root else css
        def var(name):
            m = re.search(r"--" + re.escape(name) + r"\s*:\s*([^;]+);", block)
            return m.group(1).strip() if m else None
        return cls(var("bg") or "#0b0d1a", var("bg-tint") or "#22265a",
                   var("accent") or "#aeb2ff", var("accent-ink"))

def make_background(W, H, theme):
    """Radial glow of bg-tint over bg (the lessons' page background) plus a faint dot grid."""
    y, x = np.ogrid[0:H, 0:W]
    cx, cy, rx, ry = W * 0.5, -H * 0.12, W * 0.7, H * 0.85
    glow = np.clip(1 - np.sqrt(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2), 0, 1) ** 1.5
    base, tint = np.array(theme.bg, np.float32), np.array(theme.bg_tint, np.float32)
    arr = base + (tint - base) * glow[..., None].astype(np.float32)
    img = Image.fromarray(arr.clip(0, 255).astype(np.uint8)).resize((W * SS, H * SS), Image.BILINEAR)
    d = ImageDraw.Draw(img, "RGBA")
    dot = A(lerpc(theme.bg, (255, 255, 255), 0.25), 0.35)
    for gx in range(0, W + 1, 64):
        for gy in range(0, H + 1, 64):
            d.ellipse([gx * SS - 2, gy * SS - 2, gx * SS + 2, gy * SS + 2], fill=dot)
    return img

@lru_cache(maxsize=64)
def _load_image(path):
    im = Image.open(path).convert("RGBA")
    return im

@lru_cache(maxsize=256)
def _scaled(path, w_px, h_px):
    return _load_image(path).resize((w_px, h_px), Image.LANCZOS)

# ---------------------------------------------------------------- drawing context
class Ctx:
    """Everything a scene draws with. One Ctx per frame.

    Layout regions (logical px):
      stage   : where scene content goes (clear of the badge and the caption zone)
      caption : the caption box zone at the bottom (landscape) or lower third (short)
    """
    def __init__(self, img, theme, fmt, assets_dir=None, badge=None):
        self.img, self.th, self.fmt = img, theme, fmt
        self.W, self.H = FORMATS[fmt]
        self.short = fmt == "short"
        self.d = ImageDraw.Draw(img, "RGBA")
        self.assets_dir, self.badge_text = assets_dir, badge
        if self.short:  # Shorts UI covers the bottom ~20% and a strip on the right
            self.stage = (70, 250, 1010, 1300)
            self.cap_zone = (70, 1330, 1010, 1600)
        else:
            self.stage = (110, 150, 1810, 860)
            self.cap_zone = (170, 880, 1750, 1050)
        self.t = 0.0
        self.anchors = []

    # -- coordinates
    def P(self, x, y): return (int(round(x * SS)), int(round(y * SS)))
    def box(self, x0, y0, x1, y1): return [int(x0 * SS), int(y0 * SS), int(x1 * SS), int(y1 * SS)]
    @property
    def sw(self): return self.stage[2] - self.stage[0]
    @property
    def sh(self): return self.stage[3] - self.stage[1]

    # -- timing helpers for scenes
    def at(self, k):
        """Visual time at which narration line k starts (clamped to the lines that exist)."""
        if not self.anchors: return 0.0
        return self.anchors[max(0, min(k, len(self.anchors) - 1))]
    def reveal(self, k, dur=0.45, delay=0.0):
        """0 -> 1 as narration line k starts. Use for step-by-step builds."""
        return ease_out((self.t - self.at(k) - delay) / dur)
    def line_now(self):
        k = 0
        for i, a in enumerate(self.anchors):
            if self.t >= a - 0.05: k = i
        return k

    # -- text
    def _runs(self, s, kind):
        cov, fb = _coverage(kind), _font_path("fallback")
        fbcov = _coverage("fallback") if fb else frozenset()
        runs, cur, buf = [], None, ""
        for ch in s:
            k = kind if (ord(ch) in cov or ch in " \t" or not fb or ord(ch) not in fbcov) else "fallback"
            if k != cur and buf: runs.append((cur, buf)); buf = ""
            cur = k; buf += ch
        if buf: runs.append((cur, buf))
        return runs

    def measure(self, s, size, kind="body"):
        return sum(font(k, size * SS).getlength(r) for k, r in self._runs(s, kind)) / SS

    def text(self, x, y, s, size, kind="body", fill=None, alpha=1.0, anchor="lm", stroke=0, stroke_fill=None):
        """Single line. anchor: first letter l/m/r (horizontal), second t/m/s/b (vertical)."""
        if alpha <= 0 or not s: return
        fill = A(fill or self.th.ink, alpha)
        sf = A(stroke_fill or self.th.bg, alpha) if stroke else None
        w = self.measure(s, size, kind)
        h, v = anchor[0], anchor[1] if len(anchor) > 1 else "m"
        cx = x - (w / 2 if h == "m" else w if h == "r" else 0)
        for k, r in self._runs(s, kind):
            f = font(k, size * SS)
            self.d.text(self.P(cx, y), r, font=f, fill=fill, anchor="l" + v,
                        stroke_width=int(stroke * SS), stroke_fill=sf)
            cx += f.getlength(r) / SS

    def wrap(self, s, size, kind, maxw):
        lines = []
        for para in str(s).split("\n"):
            cur = ""
            for word in para.split():
                test = (cur + " " + word).strip()
                if cur and self.measure(test, size, kind) > maxw: lines.append(cur); cur = word
                else: cur = test
            lines.append(cur)
        return lines

    def fit(self, s, kind, maxw, size, min_size, max_lines):
        """Largest size <= size whose wrap fits in max_lines (never below min_size)."""
        while size > min_size and len(self.wrap(s, size, kind, maxw)) > max_lines: size -= 2
        return size

    def para(self, x, y, s, size, kind="body", maxw=800, fill=None, alpha=1.0, lh=1.3, align="l"):
        """Wrapped text with its top at y. Returns the y below the last line."""
        for i, ln in enumerate(self.wrap(s, size, kind, maxw)):
            yy = y + i * size * lh + size * lh / 2
            xx = x if align == "l" else x + maxw / 2 if align == "m" else x + maxw
            self.text(xx, yy, ln, size, kind, fill, alpha, {"l": "lm", "m": "mm", "r": "rm"}[align])
        return y + len(self.wrap(s, size, kind, maxw)) * size * lh

    def para_height(self, s, size, kind, maxw, lh=1.3):
        return len(self.wrap(s, size, kind, maxw)) * size * lh

    # -- shapes
    def rrect(self, x0, y0, x1, y1, r=18, fill=None, outline=None, width=0):
        self.d.rounded_rectangle(self.box(x0, y0, x1, y1), radius=int(r * SS), fill=fill,
                                 outline=outline, width=int(width * SS))
    def circle(self, x, y, r, fill=None, outline=None, width=0):
        self.d.ellipse(self.box(x - r, y - r, x + r, y + r), fill=fill, outline=outline, width=int(width * SS))
    def line(self, pts, fill, width=4):
        self.d.line([self.P(*p) for p in pts], fill=fill, width=int(width * SS), joint="curve")
    def arrow(self, x1, y1, x2, y2, col, w=6, head=22):
        L = math.hypot(x2 - x1, y2 - y1)
        if L < 2: return
        ang = math.atan2(y2 - y1, x2 - x1); head = min(head, L * 0.6)
        bx, by = x2 - head * math.cos(ang), y2 - head * math.sin(ang)
        self.d.line([self.P(x1, y1), self.P(bx, by)], fill=col, width=int(w * SS))
        px, py, hw = -math.sin(ang), math.cos(ang), head * 0.6
        self.d.polygon([self.P(x2, y2), self.P(bx + px * hw, by + py * hw), self.P(bx - px * hw, by - py * hw)], fill=col)
    def dashed(self, x1, y1, x2, y2, col, w=3, dash=16, gap=12, offset=0.0):
        L = math.hypot(x2 - x1, y2 - y1)
        if L < 1: return
        ux, uy = (x2 - x1) / L, (y2 - y1) / L
        s = -(offset % (dash + gap))
        while s < L:
            a, b = max(0, s), min(L, s + dash)
            if b > a: self.d.line([self.P(x1 + ux * a, y1 + uy * a), self.P(x1 + ux * b, y1 + uy * b)], fill=col, width=int(w * SS))
            s += dash + gap
    def check(self, x, y, s, col, w=6):
        self.line([(x - s * 0.5, y), (x - s * 0.15, y + s * 0.35), (x + s * 0.55, y - s * 0.4)], col, w)

    def pill(self, x, y, label, col, size=28, alpha=1.0, anchor="l", txt=None, kind="heavy"):
        w = self.measure(label, size, kind) + size * 1.4; h = size * 1.9
        x0 = x if anchor == "l" else x - w / 2 if anchor == "m" else x - w
        self.rrect(x0, y - h / 2, x0 + w, y + h / 2, h / 2, fill=A(col, alpha))
        self.text(x0 + w / 2, y + 1, label, size, kind, txt or self.th.accent_ink, alpha, "mm")
        return w

    def image(self, src, cx, cy, w=None, h=None, alpha=1.0, scale=1.0):
        """Paste a PNG centered at (cx, cy). src: a key in the assets dir ('cover') or a path.
        Give w or h (or both, to fit inside that box). Returns the drawn box."""
        path = src if os.path.isabs(src) or os.path.exists(src) else os.path.join(self.assets_dir or "", src + ".png")
        im = _load_image(path); iw, ih = im.size
        if w and h: k = min(w / iw, h / ih)
        elif w: k = w / iw
        elif h: k = h / ih
        else: k = 1
        dw, dh = iw * k * scale, ih * k * scale
        sc = _scaled(path, max(1, int(dw * SS)), max(1, int(dh * SS)))
        if alpha < 1:
            a = sc.getchannel("A").point(lambda v: int(v * clamp(alpha)))
            sc = sc.copy(); sc.putalpha(a)
        self.img.paste(sc, self.P(cx - dw / 2, cy - dh / 2), sc)
        return (cx - dw / 2, cy - dh / 2, cx + dw / 2, cy + dh / 2)

    def logo(self, cx, cy, h, alpha=1.0):
        if os.path.exists(LOGO_PNG): self.image(LOGO_PNG, cx, cy, h=h, alpha=alpha)

    # -- chrome
    def heading(self, s, alpha=1.0, size=None, y=None, align=None):
        """Scene heading at the top of the stage. Returns the y below it."""
        x0, y0, x1, _ = self.stage
        size = size or (60 if self.short else 62)
        size = self.fit(s, "display", x1 - x0, size, 40, 2)
        align = align or ("m" if self.short else "l")
        return self.para(x0, (y if y is not None else y0) + 8 * (1 - alpha), s, size, "display", x1 - x0,
                         alpha=alpha, lh=1.15, align=align) + 26

    def chrome(self, badge=True):
        if self.badge_text and badge:
            if self.short: self.pill(self.W / 2, 165, self.badge_text.upper(), self.th.accent, 26, 1, "m")
            else: self.pill(60, 72, self.badge_text.upper(), self.th.accent, 24, 1, "l")
        if self.short: self.logo(self.W - 90, 165, 64, 0.9)
        else: self.logo(self.W - 80, 72, 60, 0.9)

    def caption(self, s, age):
        """Caption box for the current narration line. age = seconds since the line started."""
        a = ease(age / 0.35)
        if a <= 0 or not s: return
        x0, y0, x1, y1 = self.cap_zone
        maxw = x1 - x0 - 80
        size = self.fit(s, "semi", maxw, 50 if self.short else 44, 30, 3)
        lh = size * 1.3; lines = self.wrap(s, size, "semi", maxw)
        bh = len(lines) * lh + 40
        top = (y0 if self.short else y1 - bh) + 12 * (1 - a)
        self.rrect(x0, top, x1, top + bh, 24, fill=A(lerpc(self.th.bg, (0, 0, 0), 0.35), 0.86 * a),
                   outline=A(self.th.accent, a), width=2.5)
        for i, ln in enumerate(lines):
            self.text((x0 + x1) / 2, top + 20 + lh * i + lh / 2, ln, size, "semi", self.th.ink, a, "mm")

# ---------------------------------------------------------------- narration lines and timing
WPS = 2.6  # words per second used to estimate speech before synthesis

DEFAULT_PRONOUNCE = {  # spoken forms; only applied to what is said, never to captions
    "SQS": "S Q S", "SNS": "S N S", "IAM": "I A M", "EC2": "E C 2", "S3": "S 3", "KMS": "K M S",
    "VPC": "V P C", "VPCs": "V P Cs", "ALB": "A L B", "NLB": "N L B", "GWLB": "G W L B", "RDS": "R D S",
    "ACM": "A C M", "MQ": "M Q", "AZ": "A Z", "AZs": "A Zs", "EBS": "E B S", "EFS": "E F S",
    "FSx": "F S x", "TLS": "T L S", "MFA": "M F A", "SCP": "S C P", "SCPs": "S C Ps", "STS": "S T S",
    "DMS": "D M S", "EMR": "E M R", "ETL": "E T L", "CDC": "C D C", "SQL": "sequel", "JMS": "J M S",
    "API": "A P I", "APIs": "A P Is", "LLM": "L L M", "LLMs": "L L Ms", "RAG": "rag", "ML": "M L",
    "AI": "A I", "UC": "unity catalog", "DLQ": "dead-letter queue", "FIFO": "fife-oh", "AWS": "A W S",
    "e.g.": "for example", "i.e.": "that is", "vs": "versus", "vs.": "versus", "%": " percent",
}

def spoken(text, extra=None):
    table = dict(DEFAULT_PRONOUNCE); table.update(extra or {})
    out = text
    for k in sorted(table, key=len, reverse=True):
        if k == "%": out = out.replace("%", table[k]); continue
        out = re.sub(r"(?<![\w-])" + re.escape(k) + r"(?![\w-])", table[k], out)
    return out

def norm_lines(sc):
    out = []
    for ln in sc.get("lines", []):
        if isinstance(ln, str): ln = {"text": ln}
        ln = dict(ln); ln.setdefault("say", ln["text"]); ln.setdefault("pause", 0.0)
        ln.setdefault("caption", sc.get("captions", True))
        out.append(ln)
    return out

def est_speech(s): return 0.4 + len(s.split()) / WPS

def plan_visual(sc):
    """Visual timeline of a scene, before real speech lengths are known."""
    lines = sc["_lines"]; t = sc.get("lead", 0.35); anchors = []
    for ln in lines:
        anchors.append(t)
        t += est_speech(ln["say"]) + ln["pause"] + 0.35
    T = max(sc.get("dur", 0.0), (t + 0.6) if lines else sc.get("dur", 4.0))
    sc["_vis"], sc["_T"] = anchors, T

def plan_real(sc, clips):
    """Stretch the visual timeline so each line has room for its real audio.
    Visuals keep their sync because both timelines share the line anchors."""
    vis, T = sc["_vis"], sc["_T"]
    pairs, r_prev, v_prev, speech_end, starts = [(0.0, 0.0)], 0.0, 0.0, 0.0, []
    for k, v in enumerate(vis):
        r = max(r_prev + (v - v_prev), speech_end + 0.35) if k else v
        if v > 0: pairs.append((v, r))
        dur = len(clips[k]) / SR if clips[k] is not None else est_speech(sc["_lines"][k]["say"])
        starts.append(r); speech_end = r + dur + sc["_lines"][k]["pause"]
        r_prev, v_prev = r, v
    Tr = max(r_prev + (T - v_prev), speech_end + 0.8) if vis else T
    pairs.append((T, Tr))
    sc["_pairs"], sc["_Tr"], sc["_starts"] = pairs, Tr, starts

def warp(pairs, tr):
    """Real time -> visual time."""
    for (v0, r0), (v1, r1) in zip(pairs, pairs[1:]):
        if tr <= r1: return v0 + (v1 - v0) * (tr - r0) / max(1e-9, r1 - r0)
    return pairs[-1][0]

def unwarp(pairs, tv):
    for (v0, r0), (v1, r1) in zip(pairs, pairs[1:]):
        if tv <= v1: return r0 + (r1 - r0) * (tv - v0) / max(1e-9, v1 - v0)
    return pairs[-1][1]

# ---------------------------------------------------------------- voice (Piper, LibriTTS, CC BY 4.0)
class Voice:
    ATTRIBUTION = ("Narration: synthetic voice made with Piper TTS, trained on the LibriTTS dataset "
                   "(CC BY 4.0, openslr.org/60).")

    def __init__(self, speaker=0, length_scale=1.0):
        self.speaker, self.length_scale, self._v = speaker, length_scale, None

    def synth(self, text):
        import io
        if self._v is None:
            if not os.path.exists(VOICE_PATH):
                raise SystemExit(f"Voice model not found at {VOICE_PATH}. Run: python3 scripts/setup.py")
            from piper import PiperVoice
            self._v = PiperVoice.load(VOICE_PATH)
        from piper import SynthesisConfig
        cfg = SynthesisConfig(speaker_id=self.speaker, length_scale=self.length_scale, noise_scale=0.6, noise_w_scale=0.75)
        buf = io.BytesIO()
        with wave.open(buf, "wb") as w: self._v.synthesize_wav(text, w, syn_config=cfg)
        buf.seek(0)
        with wave.open(buf) as w:
            sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64) / 32768
        n = int(len(x) * SR / sr)
        return np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x)

# ---------------------------------------------------------------- audio: music bed and effects
def _tone(f, dur, amp, decay=3.0, attack=0.01, harm=(1, 0.3, 0.1)):
    m = int(dur * SR); tt = np.arange(m) / SR
    env = np.minimum(1, tt / attack) * np.exp(-tt * decay)
    return amp * env * sum(h * np.sin(2 * np.pi * f * (i + 1) * tt) for i, h in enumerate(harm))

def music_bed(total, seed=0):
    """Soft pad plus plucked arpeggio. Four progressions, picked by seed, so episodes vary."""
    n = int(total * SR); out = np.zeros(n)
    progs = [
        [(261.63, 329.63, 392.0), (220.0, 261.63, 329.63), (174.61, 220.0, 261.63), (196.0, 246.94, 293.66)],
        [(220.0, 261.63, 329.63), (174.61, 220.0, 261.63), (261.63, 329.63, 392.0), (196.0, 246.94, 293.66)],
        [(293.66, 349.23, 440.0), (233.08, 293.66, 349.23), (261.63, 329.63, 392.0), (220.0, 277.18, 329.63)],
        [(246.94, 293.66, 369.99), (196.0, 246.94, 293.66), (293.66, 369.99, 440.0), (220.0, 277.18, 329.63)],
    ]
    chords = progs[seed % len(progs)]; beat = 60 / (96 + 4 * (seed % 3))
    def add(sig, t0):
        a = int(t0 * SR)
        if a < n: out[a:a + len(sig)] += sig[: n - a]
    i, t0 = 0, 0.0
    while t0 < total:
        ch = chords[(i // 8) % 4]
        if i % 8 == 0:
            for f in ch: add(_tone(f / 2, beat * 8, 0.035, decay=0.25, attack=0.5), t0)
        add(_tone(ch[[0, 1, 2, 1, 0, 2, 1, 2][i % 8]] * 2, beat * 1.2, 0.04, decay=6), t0)
        t0 += beat / 2; i += 1
    fl = int(2.5 * SR); out[-fl:] *= np.linspace(1, 0, min(fl, n)); out[:SR] *= np.linspace(0, 1, min(SR, n))
    return out

def sfx(kind):
    if kind == "tick": return _tone(1500, 0.05, 0.10, decay=60, harm=(1,))
    if kind == "ding":
        a = _tone(1046.5, 1.2, 0.12, decay=2.5, harm=(1, 0.2)); b = np.zeros_like(a)
        c = _tone(1568, 1.0, 0.09, decay=2.8, harm=(1,)); o = int(0.08 * SR); b[o:o + len(c)] = c[: len(b) - o]
        return a + b
    if kind == "whoosh":
        m = int(0.4 * SR); rng = np.random.default_rng(1); nz = np.convolve(rng.standard_normal(m), np.ones(12) / 12, "same")
        return 0.08 * nz * np.sin(np.linspace(0, np.pi, m))
    return np.zeros(1)

def write_wav(path, x):
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())

def ffmpeg(*args):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *args], check=True)

def loudnorm(src, dst, target=-14.0):
    """Two-pass EBU R128 normalization to YouTube's playback level, video stream copied."""
    import json
    p = subprocess.run(["ffmpeg", "-hide_banner", "-i", src, "-af", f"loudnorm=I={target}:TP=-1.5:LRA=11:print_format=json",
                        "-f", "null", "-"], capture_output=True, text=True)
    m = json.loads(p.stderr[p.stderr.rfind("{"):])
    af = (f"loudnorm=I={target}:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
          f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    ffmpeg("-i", src, "-c:v", "copy", "-af", af, "-ar", str(SR), "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", dst)

def ts(sec, srt=True):
    sec = max(0.0, sec)
    h, rem = divmod(sec, 3600); m, s = divmod(rem, 60)
    if srt:
        ms = min(999, int(round((s % 1) * 1000)))
        return f"{int(h):02d}:{int(m):02d}:{int(s):02d},{ms:03d}"
    return f"{int(m)}:{int(s):02d}" if h < 1 else f"{int(h)}:{int(m):02d}:{int(s):02d}"
