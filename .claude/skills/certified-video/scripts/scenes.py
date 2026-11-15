"""Built-in scene types. Each is draw(ctx, sc, t) where t is the scene's visual time.

Builds are tied to narration lines: item k appears when its line starts (ctx.reveal),
so a scene stays in sync with the voice however long the voice takes.
See references/storyboard.md for every field.
"""
import math
from videokit import A, clamp, ease, ease_out, ease_back, lerp, lerpc

LETTERS = "ABCD"

def _item_line(ctx, sc, k, n):
    first = sc.get("first_item_line")
    if first is None: first = 1 if len(sc["_lines"]) > n else 0
    return first + k

def _item_reveal(ctx, sc, k, n):
    line = _item_line(ctx, sc, k, n)
    extra = max(0, line - (len(sc["_lines"]) - 1))  # more items than lines: stagger the rest
    return ctx.reveal(min(line, len(sc["_lines"]) - 1) if sc["_lines"] else 0, delay=0.4 * extra)

def _item_active(ctx, sc, k, n):
    return ctx.line_now() == _item_line(ctx, sc, k, n)

def _split(item):
    if isinstance(item, (list, tuple)): return item[0], (item[1] if len(item) > 1 else "")
    if isinstance(item, dict): return item.get("title", ""), item.get("text", "")
    return "", item

# ---------------------------------------------------------------- title
def title(ctx, sc, t):
    th = ctx.th; x0, y0, x1, y1 = ctx.stage
    a_art, a_txt, a_sub = ease_out(t / 0.9), ease_out((t - 0.2) / 0.7), ease_out((t - 0.6) / 0.7)
    art = sc.get("art")
    if ctx.short:
        ty = y0 + 40
        if art:
            ctx.image(art, ctx.W / 2, y0 + 330 + 8 * math.sin(t * 1.4), w=900, h=620, alpha=a_art, scale=lerp(0.94, 1, a_art))
            ty = y0 + 690
        if sc.get("eyebrow"): ctx.pill(ctx.W / 2, ty, sc["eyebrow"].upper(), th.accent, 26, a_txt, "m"); ty += 60
        size = ctx.fit(sc["title"], "display", x1 - x0, 78, 50, 4)
        ty = ctx.para(x0, ty + 16 * (1 - a_txt), sc["title"], size, "display", x1 - x0, alpha=a_txt, lh=1.12, align="m")
        if sc.get("subtitle"): ctx.para(x0, ty + 24, sc["subtitle"], 38, "body", x1 - x0, th.muted, a_sub, align="m")
    else:
        tw = (x1 - x0) * (0.46 if art else 0.9)
        if art:
            ctx.image(art, x0 + (x1 - x0) * 0.74, (y0 + y1) / 2 + 8 * math.sin(t * 1.4), w=(x1 - x0) * 0.54, h=y1 - y0 + 60,
                      alpha=a_art, scale=lerp(0.94, 1, a_art))
        size = ctx.fit(sc["title"], "display", tw, 86, 54, 3)
        block = (70 if sc.get("eyebrow") else 0) + ctx.para_height(sc["title"], size, "display", tw, 1.12) + \
                (ctx.para_height(sc.get("subtitle", ""), 40, "body", tw) + 30 if sc.get("subtitle") else 0)
        ty = (y0 + y1) / 2 - block / 2
        if sc.get("eyebrow"): ctx.pill(x0, ty + 20, sc["eyebrow"].upper(), th.accent, 26, a_txt, "l"); ty += 70
        ty = ctx.para(x0 + 20 * (1 - a_txt), ty, sc["title"], size, "display", tw, alpha=a_txt, lh=1.12)
        if sc.get("subtitle"): ctx.para(x0, ty + 30, sc["subtitle"], 40, "body", tw, th.muted, a_sub)

# ---------------------------------------------------------------- bullets
def bullets(ctx, sc, t):
    th = ctx.th; x0, y0, x1, y1 = ctx.stage
    top = ctx.heading(sc["heading"], ease_out(t / 0.5)) if sc.get("heading") else y0
    items = sc["items"]; n = len(items); art = sc.get("art")
    if art and not ctx.short:
        ctx.image(art, x1 - (x1 - x0) * 0.2, (top + y1) / 2, w=(x1 - x0) * 0.36, h=y1 - top, alpha=ease_out(t / 0.8))
        x1 = x0 + (x1 - x0) * 0.6
    elif art and ctx.short:
        ctx.image(art, ctx.W / 2, top + 170, w=760, h=320, alpha=ease_out(t / 0.8)); top += 360
    w = x1 - x0; pad = 26
    bsize, tsize = (46, 40) if ctx.short else (48, 40)
    def heights(bs, tsz):
        hs = []
        for it in items:
            b, tx = _split(it)
            h = pad * 2 + (ctx.para_height(b, bs, "heavy", w - 70, 1.2) if b else 0) + (ctx.para_height(tx, tsz, "body", w - 70) if tx else 0) + (8 if b and tx else 0)
            hs.append(h)
        return hs
    hs = heights(bsize, tsize)
    while sum(hs) + 18 * (n - 1) > y1 - top and tsize > 24:
        bsize -= 2; tsize -= 2; hs = heights(bsize, tsize)
    y = top + max(0, (y1 - top) - (sum(hs) + 18 * (n - 1))) * 0.4
    for k, it in enumerate(items):
        r = _item_reveal(ctx, sc, k, n)
        if r <= 0: y += hs[k] + 18; continue
        active = _item_active(ctx, sc, k, n)
        b, tx = _split(it); xo = 30 * (1 - r)
        ctx.rrect(x0 + xo, y, x0 + w + xo, y + hs[k], 20, fill=A(th.panel_hi if active else th.panel, 0.95 * r),
                  outline=A(th.accent, r if active else 0.35 * r), width=2.5 if active else 1.5)
        ctx.rrect(x0 + xo, y, x0 + xo + 10, y + hs[k], 5, fill=A(th.accent, r))
        yy = y + pad
        if b: yy = ctx.para(x0 + 40 + xo, yy, b, bsize, "heavy", w - 70, th.ink, r, 1.2) + (8 if tx else 0)
        if tx: ctx.para(x0 + 40 + xo, yy, tx, tsize, "body", w - 70, th.muted if not active else th.ink, r)
        y += hs[k] + 18

# ---------------------------------------------------------------- art
def art(ctx, sc, t):
    x0, y0, x1, y1 = ctx.stage
    top = ctx.heading(sc["heading"], ease_out(t / 0.5)) if sc.get("heading") else y0
    a = ease_out(t / 0.8); zoom = 1 + 0.05 * clamp(t / max(1.0, sc["_T"]))
    bx = ctx.image(sc["art"], (x0 + x1) / 2, (top + y1) / 2, w=x1 - x0, h=y1 - top, alpha=a, scale=zoom)
    for c in sc.get("callouts", []):
        r = ctx.reveal(c.get("line", 0))
        if r <= 0: continue
        cx, cy = lerp(bx[0], bx[2], c["x"]), lerp(bx[1], bx[3], c["y"])
        ctx.circle(cx, cy, 10 + 4 * math.sin(t * 5), A(ctx.th.gold, 0.35 * r)); ctx.circle(cx, cy, 7, A(ctx.th.gold, r))
        side = c.get("side", "r")
        ctx.pill(cx + (24 if side == "r" else -24), cy, c["text"], ctx.th.gold, 26, r, "l" if side == "r" else "r", txt=ctx.th.bg)

# ---------------------------------------------------------------- compare (trade-off table)
def compare(ctx, sc, t):
    th = ctx.th; x0, y0, x1, y1 = ctx.stage
    top = ctx.heading(sc["heading"], ease_out(t / 0.5)) if sc.get("heading") else y0
    cols, rows = sc["columns"], sc["rows"]; nc, nr = len(cols), len(rows)
    first_w = (x1 - x0) * (0.3 if not ctx.short else 0.28)
    cw = ((x1 - x0) - first_w) / max(1, nc - 1); gap = 8
    size = 42 if not ctx.short else 32
    def row_h(cells, s):
        return max(ctx.para_height(c, s, "body" if j else "heavy", (first_w if j == 0 else cw) - 36) for j, c in enumerate(cells)) + 34
    hh = row_h(cols, size)
    while hh + sum(row_h(r, size) for r in rows) + gap * nr > y1 - top and size > 20:
        size -= 2; hh = row_h(cols, size)
    top += max(0, (y1 - top) - (hh + sum(row_h(r, size) for r in rows) + gap * nr)) * 0.4
    ha = ease_out((t - 0.2) / 0.5); x = x0
    for j, c in enumerate(cols):
        w = first_w if j == 0 else cw
        if j: ctx.rrect(x + gap / 2, top, x + w - gap / 2, top + hh, 14, fill=A(th.accent, ha))
        ctx.para(x + 18, top + 17, c, size, "heavy", w - 36, th.accent_ink if j else th.muted, ha, align="m" if j else "l")
        x += w
    y = top + hh + gap
    for k, row in enumerate(rows):
        h = row_h(row, size); r = _item_reveal(ctx, sc, k, nr)
        if r > 0:
            active = _item_active(ctx, sc, k, nr); x = x0
            ctx.rrect(x0, y, x1, y + h, 14, fill=A(th.panel_hi if active else th.panel, 0.95 * r),
                      outline=A(th.accent, r) if active else None, width=2)
            for j, c in enumerate(row):
                w = first_w if j == 0 else cw
                ctx.para(x + 18, y + 17, c, size, "heavy" if j == 0 else "body", w - 36, th.ink if j == 0 or active else th.muted, r,
                         align="m" if j else "l")
                x += w
        y += h + gap

# ---------------------------------------------------------------- flow (pipeline / ordered steps)
def flow(ctx, sc, t):
    th = ctx.th; x0, y0, x1, y1 = ctx.stage
    top = ctx.heading(sc["heading"], ease_out(t / 0.5)) if sc.get("heading") else y0
    steps = sc["steps"]; n = len(steps); boxes = []
    if ctx.short:
        bw, gap = x1 - x0 - 80, 46
        bh = min(170, (y1 - top - gap * (n - 1)) / n)
        for k in range(n):
            yy = top + k * (bh + gap); boxes.append((x0 + 40, yy, x0 + 40 + bw, yy + bh))
    else:
        gap = 70; bw = ((x1 - x0) - gap * (n - 1)) / n; bh = min(300, (y1 - top) * 0.75)
        cy = (top + y1) / 2
        for k in range(n):
            xx = x0 + k * (bw + gap); boxes.append((xx, cy - bh / 2, xx + bw, cy + bh / 2))
    for k in range(n - 1):  # connectors under the boxes
        r = _item_reveal(ctx, sc, k + 1, n)
        if r <= 0: continue
        a, b = boxes[k], boxes[k + 1]
        if ctx.short: p1, p2 = ((a[0] + a[2]) / 2, a[3] + 6), ((b[0] + b[2]) / 2, b[1] - 6)
        else: p1, p2 = (a[2] + 6, (a[1] + a[3]) / 2), (b[0] - 6, (b[1] + b[3]) / 2)
        ctx.arrow(p1[0], p1[1], lerp(p1[0], p2[0], r), lerp(p1[1], p2[1], r), A(th.accent, r), 6, 20)
        ph = (t * 0.8 + k * 0.3) % 1
        if r >= 1: ctx.circle(lerp(p1[0], p2[0], ph), lerp(p1[1], p2[1], ph), 7, A(th.gold, 0.9))
    for k, st in enumerate(steps):
        r = _item_reveal(ctx, sc, k, n)
        if r <= 0: continue
        bx0, by0, bx1, by1 = boxes[k]; active = _item_active(ctx, sc, k, n)
        s = lerp(0.9, 1, ease_back(r)); cx, cy = (bx0 + bx1) / 2, (by0 + by1) / 2
        hw, hh = (bx1 - bx0) / 2 * s, (by1 - by0) / 2 * s
        ctx.rrect(cx - hw, cy - hh, cx + hw, cy + hh, 22, fill=A(th.panel_hi if active else th.panel, r),
                  outline=A(th.accent, r if active else 0.5 * r), width=2.5)
        b, tx = _split(st)
        ctx.circle(cx - hw + 34, cy - hh + 34, 20, A(th.accent, r))
        ctx.text(cx - hw + 34, cy - hh + 35, str(k + 1), 22, "heavy", th.accent_ink, r, "mm")
        inner = hw * 2 - 40
        tsz = ctx.fit(b or tx, "heavy", inner, 34 if not ctx.short else 36, 22, 3)
        if ctx.short:
            ctx.para(cx - hw + 70, cy - (ctx.para_height(b, tsz, "heavy", inner - 60, 1.15) + (ctx.para_height(tx, 28, "body", inner - 60) if tx else 0)) / 2,
                     b or tx, tsz, "heavy", inner - 60, th.ink, r, 1.15)
            if b and tx: ctx.para(cx - hw + 70, cy + ctx.para_height(b, tsz, "heavy", inner - 60, 1.15) / 2 - (ctx.para_height(tx, 28, "body", inner - 60)) / 2 + 6, tx, 28, "body", inner - 60, th.muted, r)
        else:
            tsz = ctx.fit(b or tx, "heavy", inner, 44, 24, 3)
            bh_ = ctx.para_height(b or tx, tsz, "heavy", inner, 1.15) + (ctx.para_height(tx, 32, "body", inner) + 12 if b and tx else 0)
            yy = max(cy - hh + 64, cy - bh_ / 2 + 12)
            yy = ctx.para(cx - hw + 20, yy, b or tx, tsz, "heavy", inner, th.ink, r, 1.15, "m")
            if b and tx: ctx.para(cx - hw + 20, yy + 12, tx, 32, "body", inner, th.muted, r, align="m")

# ---------------------------------------------------------------- quiz (exam-style question)
def quiz_lines(sc):
    """Default narration for a quiz scene: read, count down, reveal, explain."""
    if sc.get("lines"): return sc["lines"]
    L = LETTERS[sc["correct"]]
    lines = [{"text": sc["question"], "caption": False},
             {"text": "Pause and pick your answer.", "pause": sc.get("countdown", 5), "caption": False},
             {"text": f"The answer is {L}: {sc['options'][sc['correct']]}", "caption": True}]
    if sc.get("explain"): lines.append({"text": sc["explain"], "caption": True})
    sc.setdefault("reveal_line", 2)
    return lines

def quiz(ctx, sc, t):
    th = ctx.th; x0, y0, x1, y1 = ctx.stage
    rl = sc.get("reveal_line", max(0, len(sc["_lines"]) - 2))
    ra = ctx.reveal(rl); a = ease_out(t / 0.5)
    lbl = sc.get("label", "Exam question")
    yq = y0 + (40 if ctx.short else 10)
    ctx.pill(x0 if not ctx.short else ctx.W / 2, yq, lbl.upper(), th.gold, 24, a, "l" if not ctx.short else "m", txt=th.bg)
    qsize = ctx.fit(sc["question"], "semi", x1 - x0, 48 if ctx.short else 46, 26, 7 if ctx.short else 4)
    qbottom = ctx.para(x0, yq + 44, sc["question"], qsize, "semi", x1 - x0, th.ink, a, 1.28)
    opts = sc["options"]; osize = 40 if ctx.short else 40
    avail = y1 - qbottom - 30; ow = x1 - x0 - 100
    s_ = osize
    while sum(ctx.para_height(o, s_, "body", ow) + 36 for o in opts) + 16 * 3 > avail and s_ > 22: s_ -= 2
    y = qbottom + 30
    for i, o in enumerate(opts):
        h = ctx.para_height(o, s_, "body", ow) + 36
        r = ease_out((t - 0.4 - i * 0.18) / 0.4)
        ok = i == sc["correct"]
        dim = 1 - 0.55 * ra if not ok else 1
        fill = lerpc(th.panel, th.accent, 0.28 * ra) if ok else th.panel
        ctx.rrect(x0, y, x1, y + h, 18, fill=A(fill, r * 0.95), outline=A(th.accent if ok and ra > 0 else th.line, r * (ra if ok else 0.6)),
                  width=3 if ok and ra > 0 else 1.5)
        kc = th.accent if ok and ra > 0 else th.line
        ctx.circle(x0 + 44, y + h / 2, 24, A(kc, r * dim))
        ctx.text(x0 + 44, y + h / 2 + 1, LETTERS[i], 26, "heavy", th.accent_ink if ok and ra > 0 else th.ink, r * dim, "mm")
        ctx.para(x0 + 86, y + 18, o, s_, "body", ow, th.ink, r * dim)
        if ok and ra > 0: ctx.check(x1 - 40, y + h / 2, 30 * ease_back(ra), th.accent, 6)
        y += h + 16
    # countdown ring during the pause before the reveal
    if rl >= 1 and sc["_lines"][rl - 1]["pause"] > 0:
        c_end = ctx.at(rl); c_len = sc["_lines"][rl - 1]["pause"]; c_start = c_end - c_len
        if c_start <= t < c_end:
            rem = c_end - t; cx, cy = (x1 - 50, yq) if not ctx.short else (x1 - 30, yq)
            ctx.circle(cx, cy, 38, A(th.panel, 1))
            ang = 360 * (rem / c_len)
            ctx.d.arc(ctx.box(cx - 38, cy - 38, cx + 38, cy + 38), -90, -90 + ang, fill=A(th.gold, 1), width=int(6 * 2))
            ctx.text(cx, cy + 1, str(int(math.ceil(rem))), 34, "heavy", th.ink, 1, "mm")

def quiz_sfx(sc):
    rl = sc.get("reveal_line", max(0, len(sc["_lines"]) - 2)); out = []
    if rl >= 1 and sc["_lines"][rl - 1]["pause"] > 0:
        end = sc["_vis"][rl]; ln = sc["_lines"][rl - 1]["pause"]
        out += [(end - ln + k, "tick") for k in range(int(ln))]
    if rl < len(sc["_vis"]): out.append((sc["_vis"][rl], "ding"))
    return out

# ---------------------------------------------------------------- big statement
def big(ctx, sc, t):
    th = ctx.th; x0, y0, x1, y1 = ctx.stage
    a = ease_back(t / 0.6); cy = (y0 + y1) / 2
    if sc.get("kicker"): ctx.pill(ctx.W / 2, cy - 200, sc["kicker"].upper(), th.accent, 26, ease_out(t / 0.4), "m")
    size = ctx.fit(sc["text"], "display", x1 - x0, 110 if not ctx.short else 96, 54, 3)
    h = ctx.para_height(sc["text"], size, "display", x1 - x0, 1.1)
    yb = ctx.para(x0, cy - h / 2 + 20 * (1 - clamp(a)), sc["text"], size, "display", x1 - x0, sc.get("color") and tuple(sc["color"]) or th.ink,
                  clamp(a), 1.1, "m")
    if sc.get("sub"): ctx.para(x0, yb + 30, sc["sub"], 42, "body", x1 - x0, th.muted, ease_out((t - 0.5) / 0.6), align="m")

# ---------------------------------------------------------------- code
def code(ctx, sc, t):
    th = ctx.th; x0, y0, x1, y1 = ctx.stage
    top = ctx.heading(sc["heading"], ease_out(t / 0.5)) if sc.get("heading") else y0
    lines = sc["code"].rstrip("\n").split("\n"); size = 42 if not ctx.short else 32
    while (len(lines) * size * 1.45 + 110 > y1 - top or max(ctx.measure(l, size, "mono") for l in lines) > x1 - x0 - 80) and size > 16:
        size -= 2
    h = len(lines) * size * 1.45 + 100
    ctx.rrect(x0, top, x1, top + h, 20, fill=A(lerpc(th.bg, (0, 0, 0), 0.4), 0.96), outline=A(th.line, 1), width=1.5)
    for i, c in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]): ctx.circle(x0 + 34 + i * 30, top + 32, 9, c)
    if sc.get("lang"): ctx.text(x1 - 30, top + 32, sc["lang"], 22, "heavy", th.muted, 1, "rm")
    total = sum(len(l) + 1 for l in lines); speed = sc.get("cps", 45)
    shown = int((t - ctx.at(0) - 0.2) * speed) if sc.get("typing", True) else total
    hl = set()
    for k, nums in (sc.get("highlight") or {}).items():
        if ctx.line_now() == int(k): hl |= set(nums)
    for i, ln in enumerate(lines):
        yy = top + 74 + i * size * 1.45 + size * 0.7
        if i + 1 in hl: ctx.rrect(x0 + 10, yy - size * 0.75, x1 - 10, yy + size * 0.75, 8, fill=A(th.accent, 0.18))
        n = max(0, min(len(ln), shown)); shown -= len(ln) + 1
        if n: ctx.text(x0 + 40, yy, ln[:n], size, "mono", th.accent if i + 1 in hl else th.ink, 1, "lm")

# ---------------------------------------------------------------- call to action
def cta(ctx, sc, t):
    th = ctx.th; x0, y0, x1, y1 = ctx.stage; cx = ctx.W / 2
    a = ease_out(t / 0.6)
    cy = y0 + (260 if ctx.short else 150)
    ctx.circle(cx, cy, 120 + 6 * math.sin(t * 2), A(th.accent, 0.12 * a))
    ctx.logo(cx, cy, 170 * lerp(0.8, 1, ease_back(t / 0.7)), a)
    yy = cy + 150
    size = ctx.fit(sc.get("title", "Study the full chapter free"), "display", x1 - x0, 72, 44, 2)
    yy = ctx.para(x0, yy, sc.get("title", "Study the full chapter free"), size, "display", x1 - x0, th.ink, a, 1.12, "m")
    b = ease_out((t - 0.4) / 0.5)
    ctx.text(cx, yy + 50, sc.get("url", "certify.courses"), 52, "heavy", th.gold, b, "mm")
    if sc.get("sub"): ctx.para(x0, yy + 100, sc["sub"], 36, "body", x1 - x0, th.muted, b, align="m")
    c = ease_out((t - 1.0) / 0.5)
    if sc.get("subscribe", True) and c > 0:
        lbl = sc.get("button", "Follow for daily exam questions" if ctx.short else "Subscribe for more")
        bob = 4 * math.sin(t * 5)
        ctx.pill(cx, y1 - 70 + bob, lbl, (225, 48, 48), 32, c, "m", txt=(255, 255, 255))

def custom(ctx, sc, t):
    sc["draw"](ctx, sc, t)

SCENES = {"title": title, "bullets": bullets, "art": art, "compare": compare, "flow": flow,
          "quiz": quiz, "big": big, "code": code, "cta": cta, "custom": custom}
CAPTIONS_DEFAULT = {"title": False, "cta": False, "quiz": False}   # these show their own text
SFX = {"quiz": quiz_sfx}
LINE_BUILDERS = {"quiz": quiz_lines}
