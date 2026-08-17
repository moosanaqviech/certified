// Renders every registered post to PNG frames via headless Chromium.
// Usage, from social/: node build/render.mjs
// Output: out/<slug>/slide-NN.png (carousel) or out/<slug>/post.png (static),
// plus out/<slug>/captions.txt with the assembled IG and FB captions.
// The visual rules implemented here are documented in certify-visual-brain.md.

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { POSTS } from "./posts.mjs";

const KIT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(KIT, "out");
const CHROMIUM = process.env.CHROMIUM || "/opt/pw-browsers/chromium";

const C = {
  bg: "#14161c",
  bgDeep: "#0d0f13",
  panel: "#1b1e26",
  cream: "#e9e6dd",
  gold: "#d9a441",
};

const esc = (s) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

// Wraps the single gold callout substring. Applied after escaping; the
// callout strings in post.json never contain HTML-special characters.
function withGold(text, gold) {
  const safe = esc(text);
  if (!gold) return safe;
  return safe.replace(esc(gold), `<span class="gold">${esc(gold)}</span>`);
}

const brandMark = `
  <footer class="brand">
    <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
      <path d="M4 12.5l5.2 5.2L20 6.5" fill="none" stroke="${C.gold}"
        stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span class="wordmark">Certify</span>
  </footer>`;

function slideBody(slide) {
  const goldEyebrow = !slide.gold;
  const eyebrow = slide.eyebrow
    ? `<p class="eyebrow ${goldEyebrow ? "eyebrow-gold" : "eyebrow-muted"}">${esc(slide.eyebrow)}</p>`
    : "";

  switch (slide.type) {
    case "hook":
      return `<main class="center">
        <div class="bar"></div>
        <h1 class="hook">${esc(slide.headline)}</h1>
      </main>`;

    case "tension":
      return `<main class="center">
        <div class="bar"></div>
        <h1 class="headline">${esc(slide.headline)}</h1>
        <p class="body">${esc(slide.body)}</p>
      </main>`;

    case "body":
      return `<main>
        ${eyebrow}
        <h1 class="headline">${esc(slide.headline)}</h1>
        <p class="body">${esc(slide.body)}</p>
      </main>`;

    case "value": {
      const head = slide.headline
        ? `<h1 class="headline">${esc(slide.headline)}</h1>`
        : "";
      const content = slide.lines
        ? `<ul class="rows">${slide.lines
            .map((l) => `<li>${withGold(l, slide.gold)}</li>`)
            .join("")}</ul>`
        : `<p class="body">${withGold(slide.body, slide.gold)}</p>`;
      return `<main>${eyebrow}${head}${content}</main>`;
    }

    case "artwork": {
      const lines = slide.lines
        .map((l) => `<p class="body">${withGold(l, slide.gold)}</p>`)
        .join("");
      return `<main>
        ${eyebrow}
        <h1 class="headline art-headline">${esc(slide.headline)}</h1>
        <div class="art-lines">${lines}</div>
      </main>`;
    }

    case "cta": {
      const [first, ...rest] = slide.lines;
      const domain = rest.pop();
      const mids = rest
        .map((l) => `<p class="cta-mid">${esc(l)}</p>`)
        .join("");
      return `<main class="center">
        <h1 class="cta-lead">${esc(first)}</h1>
        ${mids}
        <p class="cta-domain">${esc(domain)}</p>
      </main>`;
    }

    default:
      throw new Error(`Unknown slide type: ${slide.type}`);
  }
}

function frameHtml(post, slide) {
  const bg = slide.background || (slide.type === "tension" ? C.bgDeep : C.bg);
  const { width, height } = post.size;
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<link rel="stylesheet" href="../../build/fonts/fonts.css">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
  body {
    background: ${bg};
    color: ${C.cream};
    font-family: "Hanken Grotesk", sans-serif;
    padding: 96px;
    display: flex;
    flex-direction: column;
  }
  main { flex: 1; display: flex; flex-direction: column; justify-content: flex-start; padding-top: 72px; }
  main.center { justify-content: center; padding-top: 0; }
  .bar { width: 104px; height: 10px; background: ${C.gold}; border-radius: 5px; margin-bottom: 56px; }
  .eyebrow { font-weight: 700; font-size: 30px; letter-spacing: 0.22em; text-transform: uppercase; margin-bottom: 44px; }
  .eyebrow-gold { color: ${C.gold}; }
  .eyebrow-muted { color: ${C.cream}; opacity: 0.55; }
  .hook { font-family: Fraunces, serif; font-weight: 700; font-size: 96px; line-height: 1.12; }
  .headline { font-family: Fraunces, serif; font-weight: 600; font-size: 76px; line-height: 1.15; margin-bottom: 48px; }
  .body { font-size: 42px; line-height: 1.5; opacity: 0.92; max-width: 860px; }
  .rows { list-style: none; }
  .rows li { font-size: 42px; line-height: 1.45; padding: 40px 0; border-top: 2px solid ${C.panel}; }
  .rows li:last-child { border-bottom: 2px solid ${C.panel}; }
  .art-headline { font-weight: 700; }
  .art-lines .body { margin-bottom: 36px; }
  .cta-lead { font-family: Fraunces, serif; font-weight: 600; font-size: 68px; line-height: 1.2; margin-bottom: 44px; }
  .cta-mid { font-size: 42px; line-height: 1.5; opacity: 0.92; margin-bottom: 64px; }
  .cta-domain { font-family: Fraunces, serif; font-weight: 600; font-size: 58px; color: ${C.gold}; }
  .gold { color: ${C.gold}; font-weight: 600; }
  .brand { display: flex; align-items: center; gap: 18px; }
  .wordmark { font-family: Fraunces, serif; font-weight: 600; font-size: 44px; }
</style></head>
<body>
${slideBody(slide)}
${brandMark}
</body></html>`;
}

function screenshot(htmlPath, pngPath, width, height) {
  execFileSync(
    CHROMIUM,
    [
      "--headless",
      "--no-sandbox",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      `--window-size=${width},${height}`,
      "--virtual-time-budget=8000",
      `--screenshot=${pngPath}`,
      `file://${htmlPath}`,
    ],
    { stdio: "pipe" }
  );
}

function assembleCaptions(post) {
  const ig = post.captions.instagram;
  const fb = post.captions.facebook;
  const fbTags = fb.hashtags.length ? `\n\n${fb.hashtags.join(" ")}` : "";
  return [
    "== instagram ==",
    `${ig.text}\n\n${ig.hashtags.join(" ")}`,
    "",
    "== facebook ==",
    `${fb.text}${fbTags}`,
    "",
  ].join("\n");
}

if (!existsSync(CHROMIUM)) {
  console.error(`Chromium not found at ${CHROMIUM}; set the CHROMIUM env var.`);
  process.exit(1);
}

for (const { post: number, slug } of POSTS) {
  const post = JSON.parse(
    readFileSync(join(KIT, "posts", slug, "post.json"), "utf8")
  );
  const dir = join(OUT, slug);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });

  post.slides.forEach((slide, i) => {
    const name =
      post.format === "static"
        ? "post"
        : `slide-${String(i + 1).padStart(2, "0")}`;
    const htmlPath = join(dir, `${name}.html`);
    const pngPath = join(dir, `${name}.png`);
    writeFileSync(htmlPath, frameHtml(post, slide));
    screenshot(htmlPath, pngPath, post.size.width, post.size.height);
    rmSync(htmlPath);
  });

  writeFileSync(join(dir, "captions.txt"), assembleCaptions(post));
  console.log(`post ${number} (${slug}): ${post.slides.length} frame(s) rendered`);
}

console.log("render complete");
