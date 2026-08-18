// Certify social kit — capture tool.
// Screenshots the LIVE site into assets/ so value-shot frames use real UI.
// Runs where certify.courses is reachable (your machine or CI), NOT in a
// restricted sandbox. Uses Playwright's bundled Chromium.
//
// One-time setup:
//   npm install -D playwright
//   npx playwright install chromium
//
// Run:
//   node bin/capture.mjs
//
// Edit SHOTS below: each entry loads a URL, waits for a selector, and captures
// either that element (clip to its box) or the full viewport cropped to a box.
// Capture at 2x for crisp downscaling. Keep captures to Certify UI only.

import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ASSETS = join(__dir, '..', 'assets');
mkdirSync(ASSETS, { recursive: true });

// Each shot: out file, url, and either `selector` (capture that element) or
// `clip` (x,y,width,height in CSS px). deviceScaleFactor 3 = retina crisp.
//
// The lesson engine injects cards into #viewport inside a .phone/.screen frame.
// Capture the INNER content, NOT .screen, or you wrap a phone inside our
// device frame. Cards reveal on tap, so `advance` clicks #next N times to land
// on the card you want before capturing.
//
// Real selectors (from lesson-template.html / test-template.html):
//   #viewport   the card area (full screen height: mostly empty below the card)
//   .card.in    the ACTIVE card only: the tight crop you want
//   .art        the diagram only
//   .choices    the quick-check quiz (the recall step)
//   .stage      the whole phone unit, if you ever want the framed device as-is
//
// Use a phone-sized viewport (400x700): the card layout is space-between, so a
// tall desktop viewport stretches the card with dead space between sections.
//
// `cropBottomTo`: capture the selector's box but end the crop at the BOTTOM of
// this inner element (plus a small pad). Used on the quiz card, whose choices
// sit at the top of an otherwise empty card.
//
// Overrides for restricted environments:
//   CAPTURE_BASE_URL   e.g. http://127.0.0.1:8777 to shoot a local checkout
//                      (lessons are standalone files, identical to production)
//   CAPTURE_CHROMIUM   path to a chromium binary if Playwright's download
//                      is unavailable (e.g. /opt/pw-browsers/chromium)
const BASE = process.env.CAPTURE_BASE_URL || 'https://certify.courses';
const LESSON = '/databricks-data-engineer-associate/lesson-01-lakehouse.html'; // Unit 1: free, no paywall
const SHOTS = [
  {
    out: 'lesson-learn.png',
    url: BASE + LESSON,
    selector: '.card.in',
    advance: 3,                 // THE BIG IDEA card: the one-platform diagram
    viewport: { width: 400, height: 700 },
  },
  {
    out: 'lesson-recall.png',
    url: BASE + LESSON,
    selector: '.card.in',
    cropBottomTo: '.choices',
    advance: 5,                 // quick-check card (quiz 1 of 2)
    viewport: { width: 400, height: 700 },
  },
];

async function main() {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch {
    console.error('Playwright not installed. Run:\n  npm install -D playwright\n  npx playwright install chromium');
    process.exit(1);
  }

  const browser = await chromium.launch(
    process.env.CAPTURE_CHROMIUM ? { executablePath: process.env.CAPTURE_CHROMIUM } : {},
  );
  for (const shot of SHOTS) {
    const ctx = await browser.newContext({
      viewport: shot.viewport || { width: 400, height: 700 },
      deviceScaleFactor: 3,
    });
    const page = await ctx.newPage();
    try {
      await page.goto(shot.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(1000); // let webfonts and the intro card settle
      // Advance through revealed cards to reach the target card.
      for (let k = 0; k < (shot.advance || 0); k++) {
        const next = await page.$('#next');
        if (next) { await next.click(); await page.waitForTimeout(900); }
      }
      const outPath = join(ASSETS, shot.out);
      if (shot.selector && shot.cropBottomTo) {
        const el = await page.waitForSelector(shot.selector, { timeout: 15000 });
        const inner = await page.waitForSelector(shot.cropBottomTo, { timeout: 15000 });
        const box = await el.boundingBox();
        const innerBox = await inner.boundingBox();
        const bottom = Math.min(box.y + box.height, innerBox.y + innerBox.height + 28);
        await page.screenshot({
          path: outPath,
          clip: { x: box.x, y: box.y, width: box.width, height: bottom - box.y },
        });
      } else if (shot.selector) {
        const el = await page.waitForSelector(shot.selector, { timeout: 15000 });
        await el.screenshot({ path: outPath });
      } else if (shot.clip) {
        await page.screenshot({ path: outPath, clip: shot.clip });
      } else {
        await page.screenshot({ path: outPath });
      }
      console.log('captured', shot.out);
    } catch (e) {
      console.error('FAILED', shot.out, '-', e.message);
    }
    await ctx.close();
  }
  await browser.close();
  console.log('\ndone. captures in assets/. Reference them in a value-shot slide via shot.src.');
}

main();
