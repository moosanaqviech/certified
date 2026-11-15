"""Build a Certified video from a storyboard file.

  python3 build.py STORYBOARD.py --sheet          # one still per scene -> sheet.png (fast layout check)
  python3 build.py STORYBOARD.py --still 3:4.5    # scene 3 at 4.5 s visual time -> still_3_4.5.png
  python3 build.py STORYBOARD.py                  # full narrated render
  python3 build.py STORYBOARD.py --no-voice       # captions and music only

Outputs go to --out (default video-out/<slug>/ under the current directory):
  video.mp4, captions.srt, youtube.txt, narration.md, thumbnail.png (landscape) or cover.png (short)
"""
import argparse
import importlib.util
import multiprocessing as mp
import os
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import videokit as vk
import scenes as S

JOB = {}

# ---------------------------------------------------------------- loading and checks
def load_storyboard(path):
    spec = importlib.util.spec_from_file_location("storyboard", path)
    mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
    return mod.VIDEO, mod.SCENES

def lint(video, scenes):
    """Site rules that apply to video text too: no em dashes; captions short enough to read."""
    problems, warnings = [], []
    def walk(x, where):
        if isinstance(x, str):
            if "\u2014" in x: problems.append(f"em dash in {where}: {x[:70]!r}")
        elif isinstance(x, dict):
            for k, v in x.items():
                if not callable(v): walk(v, f"{where}.{k}")
        elif isinstance(x, (list, tuple)):
            for i, v in enumerate(x): walk(v, f"{where}[{i}]")
    walk(video, "VIDEO")
    for i, sc in enumerate(scenes):
        walk({k: v for k, v in sc.items() if not k.startswith("_")}, f"SCENES[{i}]")
        for ln in sc["_lines"]:
            if ln["caption"] and len(ln["text"]) > 150:
                warnings.append(f"scene {i}: caption over 150 chars, split it: {ln['text'][:60]!r}...")
        if sc["type"] == "quiz":
            if len(sc["options"]) != 4: problems.append(f"scene {i}: quiz needs exactly 4 options")
            if not 0 <= sc["correct"] <= 3: problems.append(f"scene {i}: quiz correct must be 0-3")
    for w in warnings: print("warning:", w)
    if problems:
        for p in problems: print("error:", p)
        raise SystemExit(1)

def resolve(path, base):
    for cand in (path, os.path.join(base, path)):
        if os.path.exists(cand): return os.path.abspath(cand)
    return path

def prepare(video, scenes, sb_dir):
    th = video.get("theme")
    if isinstance(th, str): theme = vk.Theme.from_lesson(resolve(th, sb_dir))
    elif isinstance(th, dict): theme = vk.Theme(**th)
    else: theme = vk.Theme()
    for sc in scenes:
        sc.setdefault("type", "custom" if "draw" in sc else "bullets")
        sc.setdefault("captions", S.CAPTIONS_DEFAULT.get(sc["type"], True))
        if sc["type"] in S.LINE_BUILDERS: sc["lines"] = S.LINE_BUILDERS[sc["type"]](sc)
        sc["_lines"] = vk.norm_lines(sc)
        vk.plan_visual(sc)
    assets = video.get("assets")
    return theme, resolve(assets, sb_dir) if assets else None

# ---------------------------------------------------------------- frames
def draw_frame(si, tv):
    video, scenes, theme = JOB["video"], JOB["scenes"], JOB["theme"]
    sc = scenes[si]; fmt = video.get("format", "landscape")
    img = JOB["bg"].copy()
    ctx = vk.Ctx(img, theme, fmt, JOB["assets"], video.get("badge"))
    ctx.t, ctx.anchors = tv, sc["_vis"]
    S.SCENES[sc["type"]](ctx, sc, tv)
    if sc.get("chrome", True): ctx.chrome(badge=sc.get("badge", sc["type"] != "title"))
    k = ctx.line_now() if sc["_lines"] else None
    if k is not None and sc["_lines"][k]["caption"] and tv >= sc["_vis"][k] - 0.05:
        ctx.caption(sc["_lines"][k]["text"], tv - sc["_vis"][k])
    small = img.reduce(vk.SS)
    T = sc["_T"]; fade = min(1.0, tv / 0.3, (T - tv) / 0.3)
    if si == 0: fade = min(1.0, (T - tv) / 0.3)
    if fade < 1: small = Image.blend(JOB["bg_small"], small, max(0.0, fade))
    return small

def render_scene(si):
    import subprocess
    W, H = vk.FORMATS[JOB["video"].get("format", "landscape")]
    path = os.path.join(JOB["parts"], f"scene_{si:03d}.mp4")
    ff = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                           "-r", str(vk.FPS), "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "18",
                           "-pix_fmt", "yuv420p", "-g", "60", path], stdin=subprocess.PIPE)
    sc = JOB["scenes"][si]
    for fi in range(int(round(sc["_Tr"] * vk.FPS))):
        ff.stdin.write(draw_frame(si, vk.warp(sc["_pairs"], fi / vk.FPS)).tobytes())
    ff.stdin.close(); ff.wait()
    return path

def sheet_time(sc):
    T = sc["_T"]; last = sc["_vis"][-1] if sc["_vis"] else 0
    return max(0.2, min(T - 0.35, max(last + 1.6, T * 0.8)))

def make_sheet(out):
    fmt = JOB["video"].get("format", "landscape")
    tw, th, cols = (480, 270, 4) if fmt == "landscape" else (270, 480, 6)
    frames = [draw_frame(i, sheet_time(sc)).resize((tw, th)) for i, sc in enumerate(JOB["scenes"])]
    rows = (len(frames) + cols - 1) // cols
    sheet = Image.new("RGB", (tw * cols, th * rows), "black")
    for i, f in enumerate(frames): sheet.paste(f, ((i % cols) * tw, (i // cols) * th))
    sheet.save(out); return out

# ---------------------------------------------------------------- side outputs
def thumbnail(path):
    video, theme = JOB["video"], JOB["theme"]; spec = video.get("thumbnail") or {}
    W, H = vk.FORMATS["landscape"]
    img = vk.make_background(W, H, theme); ctx = vk.Ctx(img, theme, "landscape", JOB["assets"], None)
    text = spec.get("text") or video.get("youtube", {}).get("title", "")
    if spec.get("art"): ctx.image(spec["art"], 1390, 560, w=900, h=820)
    if spec.get("kicker"): ctx.pill(100, 150, spec["kicker"].upper(), theme.accent, 40, 1, "l")
    size = ctx.fit(text, "heavy", 1000 if spec.get("art") else 1700, 150, 80, 3)
    y = ctx.para(100, 230, text, size, "heavy", 1000 if spec.get("art") else 1700, theme.ink, 1, 1.05) if text else 230
    if spec.get("sub"): ctx.para(100, y + 30, spec["sub"], 64, "heavy", 1000, theme.gold, 1)
    ctx.logo(150, 960, 120)
    img.reduce(vk.SS).resize((1280, 720), Image.LANCZOS).save(path)

def chapters(starts):
    marks = [(starts[i], sc["chapter"]) for i, sc in enumerate(JOB["scenes"]) if sc.get("chapter")]
    if not marks or marks[0][0] > 0.01: return [], "first chapter must be on scene 0"
    total = starts[-1]; ends = [m[0] for m in marks[1:]] + [total]
    if len(marks) < 3: return [], "YouTube needs at least 3 chapters"
    if any(e - m[0] < 10 for m, e in zip(marks, ends)): return [], "every chapter must be at least 10 s"
    return [f"{vk.ts(t, False)} {name}" for t, name in marks], None

def write_docs(out, starts, used_voice):
    video, scenes = JOB["video"], JOB["scenes"]; yt = video.get("youtube", {}); fmt = video.get("format", "landscape")
    # captions.srt: every narration line, including ones not captioned on screen
    items = []
    for si, sc in enumerate(scenes):
        st = sc["_starts"]
        for k, ln in enumerate(sc["_lines"]):
            a = starts[si] + st[k] + 0.05
            b = starts[si] + (st[k + 1] - 0.05 if k + 1 < len(st) else sc["_Tr"] - 0.1)
            items.append((a, b, ln["text"]))
    with open(os.path.join(out, "captions.srt"), "w", encoding="utf-8") as f:
        for i, (a, b, s) in enumerate(items, 1): f.write(f"{i}\n{vk.ts(a)} --> {vk.ts(b)}\n{s}\n\n")
    with open(os.path.join(out, "narration.md"), "w", encoding="utf-8") as f:
        f.write(f"# Narration: {yt.get('title', video.get('slug', ''))}\n\n")
        for a, b, s in items: f.write(f"**[{vk.ts(a, False)}]** {s}\n\n")
    ch, why = chapters(starts) if fmt == "landscape" else ([], None)
    course = video.get("course") or {}
    lines = ["TITLE", yt.get("title", ""), "", "DESCRIPTION", yt.get("description", "").strip(), ""]
    if course: lines += [f"Full course: {course.get('name', '')} {course.get('url', '')}".strip(), ""]
    if ch: lines += ["CHAPTERS", *ch, ""]
    if used_voice: lines += [vk.Voice.ATTRIBUTION, ""]
    if fmt == "short": lines += ["#Shorts", ""]
    lines += ["TAGS", ", ".join(yt.get("tags", [])), "", "UPLOAD CHECKLIST",
              "- Audience: No, it's not made for kids (adult certification prep).",
              "- Subtitles: upload captions.srt as English.",
              "- Thumbnail: thumbnail.png" if fmt == "landscape" else "- Shorts: pick the cover frame in the YouTube app if wanted.",
              "- Keep the narration credit line above in the description (CC BY 4.0 requires it)." if used_voice else ""]
    with open(os.path.join(out, "youtube.txt"), "w", encoding="utf-8") as f: f.write("\n".join(lines).rstrip() + "\n")
    if fmt == "landscape" and video.get("chapters_required", True) and why and any(sc.get("chapter") for sc in scenes):
        print("note: chapters omitted:", why)

def build_audio(path, starts, clips):
    video, scenes = JOB["video"], JOB["scenes"]
    total = starts[-1]; n = int(total * vk.SR)
    music = vk.music_bed(total, video.get("music_seed", 0)) if video.get("music", True) else np.zeros(n)
    music = music[:n] if len(music) >= n else np.pad(music, (0, n - len(music)))
    voice, duck, fx = np.zeros(n), np.zeros(n), np.zeros(n)
    def add(buf, sig, t):
        a = int(t * vk.SR)
        if 0 <= a < n: buf[a:a + len(sig)] += sig[: n - a]
    for si, sc in enumerate(scenes):
        for k, clip in enumerate(clips[si]):
            if clip is None: continue
            t0 = starts[si] + sc["_starts"][k]; add(voice, clip, t0)
            a, b = int(t0 * vk.SR), int((t0 + len(clip) / vk.SR) * vk.SR)
            duck[max(0, a - vk.SR // 5): min(n, b + vk.SR // 3)] = 1
        if sc["type"] in S.SFX:
            for tv, kind in S.SFX[sc["type"]](sc): add(fx, vk.sfx(kind), starts[si] + vk.unwarp(sc["_pairs"], tv))
    k = vk.SR // 4; duck = np.convolve(duck, np.ones(k) / k, mode="same")
    mix = music * (0.6 - 0.38 * duck) * 1.4 + voice * 0.95 + fx
    peak = np.abs(mix).max() or 1
    vk.write_wav(path, mix / peak * 0.89)

# ---------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("storyboard"); ap.add_argument("--out")
    ap.add_argument("--sheet", action="store_true"); ap.add_argument("--still", action="append", default=[])
    ap.add_argument("--no-voice", action="store_true"); ap.add_argument("--workers", type=int, default=os.cpu_count() or 2)
    args = ap.parse_args()
    sb = os.path.abspath(args.storyboard); video, scenes = load_storyboard(sb)
    theme, assets = prepare(video, scenes, os.path.dirname(sb))
    lint(video, scenes)
    out = os.path.abspath(args.out or os.path.join("video-out", video.get("slug", "video")))
    os.makedirs(out, exist_ok=True)
    W, H = vk.FORMATS[video.get("format", "landscape")]
    JOB.update(video=video, scenes=scenes, theme=theme, assets=assets, parts=os.path.join(out, "parts"))
    JOB["bg"] = vk.make_background(W, H, theme); JOB["bg_small"] = JOB["bg"].reduce(vk.SS)

    if args.sheet or args.still:
        for sc in scenes: vk.plan_real(sc, [None] * len(sc["_lines"]))
        if args.sheet: print("sheet:", make_sheet(os.path.join(out, "sheet.png")))
        for spec in args.still:
            si, t = spec.split(":"); p = os.path.join(out, f"still_{si}_{t}.png")
            draw_frame(int(si), float(t)).save(p); print("still:", p)
        return

    use_voice = not args.no_voice and video.get("voice", True) is not False
    vcfg = video.get("voice") if isinstance(video.get("voice"), dict) else {}
    voice = vk.Voice(vcfg.get("speaker", 0), vcfg.get("length_scale", 1.0)) if use_voice else None
    clips = []
    for sc in scenes:
        cs = [voice.synth(vk.spoken(ln["say"], video.get("pronounce"))) if voice else None for ln in sc["_lines"]]
        vk.plan_real(sc, cs); clips.append(cs)
    starts = np.cumsum([0] + [sc["_Tr"] for sc in scenes]).tolist()
    print(f"length {starts[-1]:.1f} s across {len(scenes)} scenes")
    os.makedirs(JOB["parts"], exist_ok=True)
    build_audio(os.path.join(JOB["parts"], "audio.wav"), starts, clips)
    methods = mp.get_all_start_methods()
    if "fork" in methods and args.workers > 1:
        with mp.get_context("fork").Pool(args.workers) as pool: parts = pool.map(render_scene, range(len(scenes)))
    else:
        parts = [render_scene(i) for i in range(len(scenes))]
    lst = os.path.join(JOB["parts"], "list.txt")
    with open(lst, "w") as f:
        for p in parts: f.write(f"file '{p}'\n")
    raw = os.path.join(JOB["parts"], "raw.mp4")
    vk.ffmpeg("-f", "concat", "-safe", "0", "-i", lst, "-i", os.path.join(JOB["parts"], "audio.wav"),
              "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", raw)
    vk.loudnorm(raw, os.path.join(out, "video.mp4"))
    write_docs(out, starts, use_voice)
    if video.get("format", "landscape") == "landscape": thumbnail(os.path.join(out, "thumbnail.png"))
    else: draw_frame(0, sheet_time(scenes[0])).save(os.path.join(out, "cover.png"))
    import shutil; shutil.rmtree(JOB["parts"], ignore_errors=True)
    print("done:", out)

if __name__ == "__main__":
    main()
