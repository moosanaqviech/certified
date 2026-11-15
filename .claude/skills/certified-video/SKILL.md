---
name: certified-video
description: Make narrated YouTube videos for Certified (certify.courses) from its own lessons and exams. Covers chapter explainers (16:9), exam-question Shorts (9:16) and trade-off comparison videos, with a synthetic narrator, captions, chapters, thumbnail and upload text. Use this whenever the user wants a video, Short, reel, YouTube or TikTok content, a promo or a social clip about a Certified course, chapter, lesson, exam question or certification topic (AWS, Databricks and so on), even if they only say "make a video for chapter 12", "turn this lesson into a Short" or "something for the YouTube channel".
---

# Certified video

Turns Certified course content into finished, upload-ready videos. The pipeline is:
**extract** a lesson or exam, **write a storyboard** (a small Python file of scenes and
narration lines), **preview** a contact sheet, **build** the narrated MP4.

Everything renders locally with Pillow and ffmpeg: no video service, no API key. The narrator
is Piper TTS (LibriTTS voice, CC BY 4.0, speaker 0 by default), and scene timing stretches to
fit what the voice actually says, so visuals stay in sync.

## Setup (once per machine)

```bash
python3 .claude/skills/certified-video/scripts/setup.py
```
It checks ffmpeg, the Python packages (pillow, numpy, fonttools, piper-tts) and Node Playwright,
and downloads the voice model (about 120 MB) to `~/.cache/certified-video/`. Run from the repo
root. If a package is missing it prints the install command.

## Pick the format

| Format | Use for | Shape | Typical length |
|---|---|---|---|
| Chapter explainer | One lesson, retold: title, the key cards, a comparison, one exam-style question, call to action | `landscape`, 1920x1080 | 2 to 3 min |
| Exam-question Short | One scenario question, 5-second countdown, reveal, one-line why | `short`, 1080x1920 | 30 to 50 s |
| Trade-off video | A TO chapter (the lesson pattern: shared ground, one scene per option, `compare` table, decision signals, question) | `landscape` | 2 to 3 min |

If the user doesn't say, offer the explainer for a lesson and the Short for "a question" or "a reel".

## Workflow

**1. Find the source.** Read the course's curriculum index and cert config in `.claude/` for the
chapter's placement and terminology rules (DE Professional says "Lakeflow Spark Declarative
Pipelines", DEA-C01 says "Amazon Data Firehose", and so on). The lesson file is the source of
truth for facts.

**2. Extract it** (from the repo root):
```bash
node .claude/skills/certified-video/scripts/extract.mjs lesson <course>/<lesson>.html --out video-out/<slug>/src
node .claude/skills/certified-video/scripts/extract.mjs exam <course>/<exam>.html --out video-out/<slug>/src
```
`lesson.json` has the palette, the course name and URL, and every card's eyebrow, heading, lead,
pills (title + text), comparison tables, quiz choices and feedback. `art/<key>.png` holds each
SVG from the lesson's `A` object, rendered with the lesson's own colors (reuse them in `title`,
`art` and `bullets` scenes). `exam.json` holds plain-text questions with options, the correct
index, the explanation, `ref` and the `Ch NN` header.

**3. Write the storyboard** at `.claude/videos/<course-folder>/<slug>.py` so it is kept in git
(renders are not). Start from `examples/saa-ch27-explainer.py` or `examples/saa-ch27-short.py`;
`references/storyboard.md` lists every field and scene type. Set `theme` to the lesson path so
the video uses the chapter's palette, and `assets` to the extracted `art` folder.

**4. Preview, then fix layout:**
```bash
python3 .claude/skills/certified-video/scripts/build.py <storyboard.py> --sheet
```
This draws one still per scene (each with its builds complete) into `video-out/<slug>/sheet.png`
in about a second. Look at it: overflowing or cramped text, an empty scene, art too small.
`--still SCENE:SECONDS` renders a single frame. Iterate until the sheet looks right; a full
render takes minutes, the sheet takes a second.

**5. Build:**
```bash
python3 .claude/skills/certified-video/scripts/build.py <storyboard.py>
```
Outputs in `video-out/<slug>/`: `video.mp4` (H.264, AAC, normalized close to YouTube's level),
`captions.srt` (every narration line), `youtube.txt` (title, description, course link,
chapters, voice credit, tags, upload checklist), `narration.md`, and `thumbnail.png`
(landscape) or `cover.png` (Short). `--no-voice` makes a captions-and-music version.

**6. Check and hand over.** Pull two or three frames from the MP4 with ffmpeg and look at them.
You cannot hear the audio, so say so and ask the user to listen for mispronunciations (fix
with `pronounce` or a line's `say`). Send the user the MP4, thumbnail and `youtube.txt`.
`video-out/` is gitignored: never commit renders, since Netlify publishes the repo root.

## Content rules (why they matter)

- **Sealed mocks never appear.** Full-length mocks (`mock-exam-NN`, and the 05-07 style mock
  ranges listed in CLAUDE.md) are a sealed pool; publishing one question on YouTube burns it.
  `extract.mjs` refuses them. Don't retype one by hand either.
- **Shorts use new questions by default.** A question shown publicly stops being a fair
  practice item, so write a fresh scenario from the chapter, following
  `.claude/test-authoring-guide.md` (single best answer, 4 options, plausible distractors, the
  explanation says why the right answer is right and why the top distractor is wrong). Use a
  section-exam question as-is only if the user asks for that. Select-two items don't fit the
  quiz scene; pick single-answer ones.
- **Facts come from the lesson.** The lessons were verified against the official exam guides;
  your memory may be out of date (services get renamed or closed, see the cert configs). If the
  video needs a fact the lesson doesn't state, check the vendor docs or leave it out.
- **Paid chapters get a summary, not the whole lesson.** An explainer should teach the core idea
  and point to the course. The CTA can say the course starts free (every course's first unit
  is free); don't promise a specific paid chapter is free.
- **Site style applies.** No em dashes anywhere (build.py fails on them), no first person
  ("I", "we"), product names as in the cert config. Address the viewer as "you" sparingly.

## Writing the narration

Each narration line becomes one caption and one spoken clip, and builds key off line starts
(item k of a `bullets` scene appears on line k+1 when there is an intro line). So:

- One idea per line, 8 to 25 words, under 150 characters (longer captions wrap to three lines
  and build.py warns). Split long sentences into two lines rather than shrinking text.
- Write for the ear: short sentences, the service name before the detail, numbers as you'd say
  them. Captions show `text`; the voice reads `say` if given, else `text` passed through the
  pronunciation table (common acronyms like SQS, IAM, EC2 are spelled out already; add others
  in `VIDEO["pronounce"]`, for example `{"certify.courses": "certify dot courses"}`).
- Open with the hook in the first line: the exam decision this chapter settles. Shorts start
  straight on the question.
- End explainers on a `quiz` scene then a `cta` scene; end Shorts on a `cta`.

## When the built-in scenes aren't enough

Scene types: `title`, `bullets`, `art`, `compare`, `flow`, `quiz`, `big`, `code`, `cta`, plus
`custom` with your own `draw(ctx, sc, t)` function in the storyboard file. `ctx` has text,
wrapping, shapes, arrows, pills, images and timing helpers (`ctx.reveal(k)`), all in output
pixels, with `ctx.stage` as the safe content box. See the custom-scene section of
`references/storyboard.md`. Prefer reusing lesson art over drawing new art.

## Reference files

- `references/storyboard.md`: storyboard format, every scene type and field, the `ctx` API,
  timing model. Read before writing your first storyboard.
- `references/youtube.md`: upload checklist, YouTube policies that affect this channel
  (synthetic voice credit, inauthentic content, made-for-kids, altered content), Shorts specs,
  and notes for automating uploads later.
