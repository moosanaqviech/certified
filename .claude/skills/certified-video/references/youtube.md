# Publishing on YouTube

## Upload checklist (every video)

- **Title and description** from `youtube.txt`. Keep the course link and the narration credit
  line; the LibriTTS voice is CC BY 4.0, which requires attribution.
- **Audience:** "No, it's not made for kids". Certification prep is for adults, and the
  made-for-kids setting would switch off comments and personalized ads.
- **Subtitles:** upload `captions.srt` (English). It has every line, including the ones not
  captioned on screen.
- **Thumbnail:** `thumbnail.png` (1280x720) for landscape videos. Shorts use a frame; the app
  lets you choose one (`cover.png` shows the default).
- **Chapters:** already in the description when the storyboard marks at least three.
- **Altered or synthetic content:** YouTube asks creators to disclose realistic content that
  could be mistaken for real people or events. An animated explainer with an obviously
  synthetic narrator is not that, but YouTube's guidance changes: check the current wording
  in YouTube Studio when uploading and answer accordingly.

## Policies that shape this channel

- **Inauthentic (formerly "repetitious") content, YouTube Partner Program, July 2025:**
  mass-produced, templated videos with little variation can be demonetized. Automation of the
  rendering and uploading is fine; what counts is that each video teaches something different
  and is worth watching. Vary scene mix, write each script for its chapter, and have a person
  review every video before it goes public.
- **Accuracy:** exam-prep viewers act on what they learn. Facts come from the verified lessons;
  a wrong answer in a Short is worse than no Short. Errata process: the site's
  `/how-lessons-are-made` page.
- **Sealed mocks** never appear (see SKILL.md).

## Shorts specs

- 9:16, up to 3 minutes (YouTube allows up to 3 minutes since October 2024; 30 to 50 s works
  best for a question).
- Hook in the first second: start on the question, not a logo.
- Put `#Shorts` in the description (build.py adds it) and keep text out of the bottom fifth
  and right edge (the layout already does).

## Automating uploads later

When the channel moves to scheduled, automatic uploads, these limits matter:

- **YouTube Data API v3** quota: each Google Cloud project gets 10,000 units a day by default,
  and `videos.insert` has historically cost about 1,600 units (roughly 6 uploads a day). Check
  Google's current quota table before planning volume; request more through the audit form.
- Videos uploaded from an **unverified API project** (created after 28 July 2020) are locked
  to private until the project passes Google's compliance audit. Start the audit early.
- OAuth is per channel: each channel needs its own refresh token, stored as a secret, never in
  the repo.
- Upload as `private` or `unlisted` with `publishAt` for scheduling, which also leaves a window
  for the human review step.
- `video-out/<slug>/youtube.txt` already holds the fields an uploader needs (title,
  description, tags); `captions.srt` goes up with `captions.insert`.
