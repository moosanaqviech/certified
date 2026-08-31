// Certify social kit — review bundle.
// Builds out/review.html: a mobile-first contact sheet of the day's posts so
// each carousel/single and its captions can be checked on a phone before
// anything is scheduled. Reads the rendered out/<slug>/ dirs; run after render.
// Usage: node bin/review.mjs [slug ...]   (default: the three new posts)

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dir, '..', 'out');

const slugs = process.argv.slice(2);
const SLUGS = slugs.length
  ? slugs
  : ['how-long-de-associate', 'genai-track-complete', 'streaming-table-or-mv'];

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

let cards = '';
for (const slug of SLUGS) {
  const dir = join(OUT, slug);
  if (!existsSync(dir)) { cards += `<section><h2>${esc(slug)}</h2><p class="miss">not rendered</p></section>`; continue; }
  const jpgs = readdirSync(dir).filter((f) => f.endsWith('.jpg')).sort();
  const caps = existsSync(join(dir, 'captions.txt'))
    ? readFileSync(join(dir, 'captions.txt'), 'utf8')
    : '';
  const frames = jpgs
    .map((f) => `<figure><img loading="lazy" src="${slug}/${f}" alt="${esc(f)}"><figcaption>${esc(f)}</figcaption></figure>`)
    .join('\n');
  cards += `
<section>
  <h2>${esc(slug)} <span class="count">${jpgs.length} ${jpgs.length === 1 ? 'frame' : 'frames'}</span></h2>
  <div class="rail">${frames}</div>
  <details><summary>Captions</summary><pre>${esc(caps)}</pre></details>
</section>`;
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Certify social kit review</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #0d0f13; color: #e9e6dd;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.5; }
  header { padding: 20px 16px 8px; }
  header h1 { margin: 0; font-size: 19px; }
  header p { margin: 6px 0 0; color: #8b90a0; font-size: 13px; }
  section { padding: 12px 0 20px; border-top: 1px solid #272b36; margin-top: 12px; }
  h2 { margin: 0 0 10px; padding: 0 16px; font-size: 15px; color: #d9a441; font-weight: 600; }
  h2 .count { color: #62647a; font-weight: 400; font-size: 12px; }
  .rail { display: flex; gap: 12px; overflow-x: auto; padding: 0 16px 10px;
    scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
  figure { margin: 0; flex: 0 0 78%; max-width: 340px; scroll-snap-align: center; }
  img { width: 100%; height: auto; border-radius: 14px; border: 1px solid #272b36; display: block; background: #14161c; }
  figcaption { color: #62647a; font-size: 11px; margin-top: 6px; text-align: center; }
  details { margin: 6px 16px 0; }
  summary { cursor: pointer; color: #8b90a0; font-size: 13px; }
  pre { white-space: pre-wrap; word-break: break-word; background: #14161c; border: 1px solid #272b36;
    border-radius: 12px; padding: 12px; font-size: 12.5px; color: #8b90a0; overflow-x: auto; }
  .miss { color: #b4504a; padding: 0 16px; }
  footer { color: #62647a; font-size: 12px; padding: 8px 16px 40px; }
</style>
</head>
<body>
<header>
  <h1>Social kit review</h1>
  <p>Swipe each rail. Tap Captions for the Instagram and Facebook copy. Draft only, nothing scheduled.</p>
</header>
${cards}
<footer>Generated from social-kit/out by bin/review.mjs. Frames are 1080x1350 JPG.</footer>
</body>
</html>`;

writeFileSync(join(OUT, 'review.html'), html);
console.log(`review bundle: out/review.html (${SLUGS.length} posts)`);
