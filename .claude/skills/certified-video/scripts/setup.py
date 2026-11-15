"""One-time setup check for the certified-video skill.

  python3 setup.py           # check everything, download the narrator voice if missing
  python3 setup.py --check   # check only, change nothing

The voice model (about 120 MB) is cached outside the repo, in ~/.cache/certified-video
(override with CERTIFIED_VIDEO_CACHE). It is never committed: Netlify publishes the repo root.
"""
import importlib
import os
import shutil
import subprocess
import sys
import tarfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import videokit as vk

VOICE_URL = "https://github.com/rhasspy/piper/releases/download/v0.0.2/voice-en-us-libritts-high.tar.gz"
PIP = {"PIL": "pillow", "numpy": "numpy", "fontTools": "fonttools", "piper": "piper-tts"}

def ok(msg): print("  ok   ", msg)
def bad(msg): print("  MISSING", msg)

def main():
    check_only = "--check" in sys.argv
    missing = False
    print("certified-video setup")
    if shutil.which("ffmpeg"): ok("ffmpeg")
    else: bad("ffmpeg (macOS: brew install ffmpeg; Debian/Ubuntu: apt-get install ffmpeg)"); missing = True
    for mod, pkg in PIP.items():
        try: importlib.import_module(mod); ok(pkg)
        except ImportError: bad(f"{pkg}  ->  pip install {pkg}"); missing = True
    node = shutil.which("node")
    if node:
        r = subprocess.run([node, "-e", "require('playwright')"], capture_output=True)
        if r.returncode == 0: ok("node + playwright (for extract.mjs)")
        else: bad("playwright for node  ->  npm i -g playwright && npx playwright install chromium"); missing = True
    else: bad("node (only needed for extract.mjs)"); missing = True
    if vk._font_path("fallback"): ok("fallback font for symbols: " + vk._font_path("fallback"))
    else: print("  note  no symbol fallback font found; arrows and subscripts may not render")
    if os.path.exists(vk.VOICE_PATH): ok("narrator voice: " + vk.VOICE_PATH)
    elif check_only: bad("narrator voice (run without --check to download)"); missing = True
    else:
        os.makedirs(os.path.dirname(vk.VOICE_DIR), exist_ok=True)
        tgz = os.path.join(os.path.dirname(vk.VOICE_DIR), "voice.tar.gz")
        print("  downloading narrator voice (about 120 MB) from the Piper GitHub release ...")
        if shutil.which("curl"):
            subprocess.run(["curl", "-sSL", "--fail", "-o", tgz, VOICE_URL], check=True)
        else:
            import urllib.request; urllib.request.urlretrieve(VOICE_URL, tgz)
        os.makedirs(vk.VOICE_DIR, exist_ok=True)
        with tarfile.open(tgz) as tf:
            try: tf.extractall(vk.VOICE_DIR, filter="data")
            except TypeError: tf.extractall(vk.VOICE_DIR)
        os.remove(tgz)
        if os.path.exists(vk.VOICE_PATH): ok("narrator voice: " + vk.VOICE_PATH)
        else: bad("voice archive did not contain en-us-libritts-high.onnx"); missing = True
    print("ready" if not missing else "fix the MISSING items above, then run this again")
    sys.exit(1 if missing else 0)

if __name__ == "__main__":
    main()
