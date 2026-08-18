// Certify social kit — render entry point.
// Usage: node render.mjs
// Validates all posts, then for each slide builds an SVG, rasterizes to PNG
// (resvg-js with the real fonts), converts to JPG, and writes a captions.txt.
// Exits non-zero if validation fails: nothing renders on a broken post.

import { readFileSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { LAYOUTS } from './lib/layouts.mjs';
import { validateAll } from './lib/validate.mjs';
import { posts } from './content/posts.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dir, 'out');
const FONT_DIR = join(__dir, 'fonts', 'static');

// Rasterize an SVG string to PNG via rsvg-convert (librsvg), resolving fonts
// through fontconfig. FONTCONFIG_PATH points at a local conf that includes the
// kit's static fonts, so the build does not depend on system font install.
function svgToPng(svg, outPath) {
  execFileSync('rsvg-convert', ['-o', outPath], {
    input: svg,
    cwd: __dir,
    env: { ...process.env, FONTCONFIG_FILE: join(__dir, 'fonts', 'fonts.conf') },
  });
}

// Read PNG width/height from the IHDR chunk (bytes 16-24).
function pngSize(buf) {
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

// For a value-shot slide, load the capture, embed as a data URI, attach dims.
function resolveShot(slide) {
  if (slide.layout !== 'value-shot' || !slide.shot || !slide.shot.src) return slide;
  const p = slide.shot.src.startsWith('/') ? slide.shot.src : join(__dir, slide.shot.src);
  const buf = readFileSync(p);
  const { w, h } = pngSize(buf);
  const dataUri = 'data:image/png;base64,' + buf.toString('base64');
  return { ...slide, shot: { dataUri, w, h } };
}

function slideFileName(slide, i) {
  const n = String(i + 1).padStart(2, '0');
  return `${n}-${slide.layout}`;
}

function main() {
  // 1. Validate everything first.
  const errs = validateAll(posts);
  if (errs.length) {
    console.error('VALIDATION FAILED:\n' + errs.map((e) => '  - ' + e).join('\n'));
    process.exit(1);
  }
  console.log(`validation clean: ${posts.length} posts\n`);

  // 2. Render.
  if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });

  for (const post of posts) {
    const dir = join(OUT, post.slug);
    mkdirSync(dir, { recursive: true });
    let count = 0;

    for (const [i, slide] of post.slides.entries()) {
      const build = LAYOUTS[slide.layout];
      if (!build) throw new Error(`unknown layout: ${slide.layout}`);
      const svg = build(resolveShot(slide));
      const base = slideFileName(slide, i);
      writeFileSync(join(dir, base + '.svg'), svg);
      svgToPng(svg, join(dir, base + '.png'));
      // PNG -> JPG (Instagram accepts JPG only). ImageMagick handles this.
      execFileSync('convert', [
        join(dir, base + '.png'), '-quality', '92', join(dir, base + '.jpg'),
      ]);
      count++;
    }

    // captions.txt: IG caption + hashtags, then FB variant.
    const cap =
`SOURCE: ${post.source}
FORMAT: ${post.format}

=== INSTAGRAM ===
${post.captionIg}

${post.hashtags}

=== FACEBOOK ===
${post.captionFb}
`;
    writeFileSync(join(dir, 'captions.txt'), cap);
    console.log(`  ${post.slug}: ${count} frames`);
  }

  console.log(`\ndone. output in out/`);
}

main();
