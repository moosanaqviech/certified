"""Text-to-speech narration for the book clips (spec: Script).

Voice: Kokoro-82M (Apache-2.0, commercial use allowed) through kokoro-onnx.
One WAV per caption line, so a scene can start each line with its caption.
Usage, from this folder:

    pip install kokoro-onnx soundfile
    # model files: kokoro-v1.0.onnx and voices-v1.0.bin from
    # github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0)
    python narrate.py lesson-01 --models DIR

Writes audio/<clip>/NN.wav (not committed; rerun to regenerate) and prints
each line's length. The scene file holds the script; this file only reads it.
"""
import argparse, os

import soundfile as sf
from kokoro_onnx import Kokoro

HERE = os.path.dirname(os.path.abspath(__file__))
CLIPS = {"lesson-01": "lesson-01-infinity-principle.py"}
VOICE, SPEED, LANG = "af_heart", 0.95, "en-us"


def load_script(clip):
    path = os.path.join(HERE, CLIPS[clip])
    src = open(path).read()
    # read NARRATION without importing Manim: exec just that assignment
    start = src.index("NARRATION = [")
    end = src.index("]\n", start) + 1
    ns = {}
    exec(src[start:end], ns)
    return ns["NARRATION"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("clip", choices=sorted(CLIPS))
    ap.add_argument("--models", required=True)
    a = ap.parse_args()
    k = Kokoro(os.path.join(a.models, "kokoro-v1.0.onnx"), os.path.join(a.models, "voices-v1.0.bin"))
    out = os.path.join(HERE, "audio", a.clip)
    os.makedirs(out, exist_ok=True)
    for i, line in enumerate(load_script(a.clip)):
        samples, rate = k.create(line, voice=VOICE, speed=SPEED, lang=LANG)
        sf.write(os.path.join(out, f"{i:02d}.wav"), samples, rate)
        print(f"{i:02d} {len(samples) / rate:5.2f}s  {line}")


if __name__ == "__main__":
    main()
