// Certify social kit — layouts.
// Each layout returns a full SVG string for one 1080x1350 (or 1080x1920) frame.
// Geometry mirrors the shipped frames. New posts are new data, never new layouts.

import { CANVAS, COLOR, FONT, MARGIN, BRAND_MARK } from './tokens.mjs';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// A body line can be a plain string, or an array of runs for inline emphasis:
//   ['Delete a row: ', { t: 'rewritten', gold: true }, ' every time.']  gold
//   ['the row is ', { t: 'marked', em: true }, ', file survives.']       cream bold
// librsvg trims whitespace at tspan boundaries, so the parent <text> carries
// xml:space="preserve" and boundary spaces are kept literally.
function runsToTspans(line, baseFill) {
  if (typeof line === 'string') return esc(line);
  return line
    .map((r) => {
      if (typeof r === 'string') return `<tspan fill="${baseFill}">${esc(r)}</tspan>`;
      const fill = r.gold ? COLOR.gold : r.em ? COLOR.cream : baseFill;
      const weight = r.gold || r.em ? ' font-weight="600"' : '';
      return `<tspan fill="${fill}"${weight}>${esc(r.t)}</tspan>`;
    })
    .join('');
}

const isRuns = (l) => Array.isArray(l);
const runText = (l) =>
  isRuns(l) ? l.map((r) => (typeof r === 'string' ? r : r.t)).join('') : l;

function frame(kind, inner, withMark = true) {
  const { w, h } = kind === 'story' ? CANVAS.story : CANVAS.feed;
  const bg = inner.bg || COLOR.bg;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="${w}" height="${h}" fill="${bg}"/>
${inner.body}
${withMark && kind !== 'story' ? BRAND_MARK : ''}
</svg>`;
}

// ---- HOOK: Fraunces gold, left aligned, grows to fill. Slide 1 always. ----
export function hook({ lines }) {
  // Pick a size so the longest line fits the ~888px content width.
  const longest = Math.max(...lines.map((l) => l.length));
  let size = 124;
  if (longest > 16) size = 104;
  if (longest > 20) size = 88;
  if (longest > 26) size = 72;
  const step = Math.round(size * 1.14);
  const block = lines.length * step;
  let y = Math.round((1350 - block) / 2 + size); // vertically centered block
  const body = lines
    .map((l) => {
      const t = `<text x="${MARGIN.left}" y="${y}" font-family="${FONT.display}" font-size="${size}" font-weight="700" fill="${COLOR.gold}" text-anchor="start">${esc(l)}</text>`;
      y += step;
      return t;
    })
    .join('\n');
  return frame('feed', { body });
}

// ---- TENSION: near-black, one quiet statement, no gold by design. ----
export function tension({ lines }) {
  const size = 76;
  const step = 93;
  const block = lines.length * step;
  let y = Math.round((1350 - block) / 2 + size * 0.8);
  const body = lines
    .map((l) => {
      const t = `<text x="${MARGIN.left}" y="${y}" font-family="${FONT.display}" font-size="${size}" font-weight="600" fill="${COLOR.cream}" text-anchor="start">${esc(l)}</text>`;
      y += step;
      return t;
    })
    .join('\n');
  return frame('feed', { bg: COLOR.bgTension, body });
}

// ---- VALUE / CONTEXT: eyebrow, headline, body lines. Optional gold. ----
// gold budget: either goldHeadline true, OR one inline-gold run in a body line.
// Eyebrow pins to the top; the headline + body group centers in the frame.
export function value({ eyebrow, headlineLines = [], bodyLines = [], goldHeadline = false }) {
  const HL = 68, BL = 52, GAP = 96;
  let out = '';
  if (eyebrow) {
    out += `<text x="${MARGIN.left}" y="146" font-family="${FONT.body}" font-size="26" font-weight="700" fill="${COLOR.eyebrow}" letter-spacing="4.5" text-anchor="start">${esc(eyebrow)}</text>`;
  }
  const groupH = headlineLines.length * HL + (bodyLines.length ? GAP + bodyLines.length * BL : 0);
  let y = Math.round((1350 - groupH) / 2 + 40);
  for (const l of headlineLines) {
    const fill = goldHeadline ? COLOR.gold : COLOR.cream;
    out += `\n<text x="${MARGIN.left}" y="${y}" font-family="${FONT.display}" font-size="54" font-weight="600" fill="${fill}" text-anchor="start">${esc(l)}</text>`;
    y += HL;
  }
  if (bodyLines.length) y += GAP - HL + BL;
  for (const l of bodyLines) {
    out += `\n<text x="${MARGIN.left}" y="${y}" font-family="${FONT.body}" font-size="36" font-weight="400" fill="${COLOR.body}" text-anchor="start" xml:space="preserve">${runsToTspans(l, COLOR.body)}</text>`;
    y += BL;
  }
  return frame('feed', { body: out });
}

// ---- STAT: one number, one claim, one source. ----
export function stat({ eyebrow, big, bodyLines = [], foot }) {
  let out = '';
  if (eyebrow) {
    out += `<text x="${MARGIN.left}" y="146" font-family="${FONT.body}" font-size="26" font-weight="700" fill="${COLOR.eyebrow}" letter-spacing="4.5" text-anchor="start">${esc(eyebrow)}</text>`;
  }
  out += `\n<text x="540" y="635" text-anchor="middle" font-family="${FONT.display}" font-size="300" font-weight="700" fill="${COLOR.gold}">${esc(big)}</text>`;
  let y = 795;
  for (const l of bodyLines) {
    out += `\n<text x="540" y="${y}" font-family="${FONT.body}" font-size="40" font-weight="500" fill="${COLOR.cream}" text-anchor="middle">${esc(l)}</text>`;
    y += 56;
  }
  if (foot) {
    out += `\n<text x="540" y="955" font-family="${FONT.body}" font-size="30" font-weight="400" fill="${COLOR.eyebrow}" text-anchor="middle">${esc(foot)}</text>`;
  }
  return frame('feed', { body: out });
}

// ---- SINGLE statement: big gold headline + body. For single static posts. ----
// The gold headline IS the frame's one gold element, so body uses em (cream)
// for emphasis, never a second gold. Content group centers vertically.
export function single({ eyebrow, headlineLines = [], bodyLines = [] }) {
  const HL = 100, BL = 56, GAP = 90;
  let out = '';
  if (eyebrow) {
    out += `<text x="${MARGIN.left}" y="146" font-family="${FONT.body}" font-size="26" font-weight="700" fill="${COLOR.eyebrow}" letter-spacing="4.5" text-anchor="start">${esc(eyebrow)}</text>`;
  }
  const groupH = headlineLines.length * HL + (bodyLines.length ? GAP + bodyLines.length * BL : 0);
  let y = Math.round((1350 - groupH) / 2 + 40);
  for (const l of headlineLines) {
    out += `\n<text x="${MARGIN.left}" y="${y}" font-family="${FONT.display}" font-size="82" font-weight="700" fill="${COLOR.gold}" text-anchor="start">${esc(l)}</text>`;
    y += HL;
  }
  if (bodyLines.length) y += GAP - HL + BL;
  for (const l of bodyLines) {
    out += `\n<text x="${MARGIN.left}" y="${y}" font-family="${FONT.body}" font-size="38" font-weight="400" fill="${COLOR.body}" text-anchor="start" xml:space="preserve">${runsToTspans(l, COLOR.body)}</text>`;
    y += BL;
  }
  return frame('feed', { body: out });
}

// ---- VALUE-SHOT: eyebrow, headline, then a captured screen in a device ----
// frame, with an optional gold callout ring. Per the Product Frames rule:
// one screenshot per frame, 1px #272b36 bezel, 34px radius, on a #1b1e26 panel,
// no shadows/tilts. The callout ring is the frame's one gold element.
// shot: { dataUri, w, h }  (render.mjs resolves src -> dataUri and dims)
// callout: { nx, ny, nw, nh, label }  normalized 0..1 region inside the shot
export function valueShot({ eyebrow, headlineLines = [], shot, caption, callout }) {
  const PAD = 18;              // bezel thickness
  const PANEL_R = 34;          // panel corner radius
  const IMG_R = PANEL_R - 12;  // image corner radius
  let out = '';

  if (eyebrow) {
    out += `<text x="${MARGIN.left}" y="146" font-family="${FONT.body}" font-size="26" font-weight="700" fill="${COLOR.eyebrow}" letter-spacing="4.5" text-anchor="start">${esc(eyebrow)}</text>`;
  }
  let headTop = 230;
  for (const l of headlineLines) {
    out += `\n<text x="${MARGIN.left}" y="${headTop}" font-family="${FONT.display}" font-size="54" font-weight="600" fill="${COLOR.cream}" text-anchor="start">${esc(l)}</text>`;
    headTop += 68;
  }

  // Device frame: fit the shot into a target width, cap height so the caption
  // and brand mark never get crowded.
  const targetW = 760;
  const scale = targetW / shot.w;
  let imgW = targetW;
  let imgH = Math.round(shot.h * scale);
  const maxImgH = 640;
  if (imgH > maxImgH) { imgH = maxImgH; imgW = Math.round(shot.w * (maxImgH / shot.h)); }

  const panelW = imgW + PAD * 2;
  const panelH = imgH + PAD * 2;
  const panelX = Math.round((1080 - panelW) / 2);
  const frameTop = headlineLines.length ? headTop + 40 : 300;
  const panelY = frameTop;
  const imgX = panelX + PAD;
  const imgY = panelY + PAD;

  const clipId = 'shotclip' + Math.random().toString(36).slice(2, 8);
  out += `
  <clipPath id="${clipId}"><rect x="${imgX}" y="${imgY}" width="${imgW}" height="${imgH}" rx="${IMG_R}"/></clipPath>
  <rect x="${panelX}" y="${panelY}" width="${panelW}" height="${panelH}" rx="${PANEL_R}" fill="${COLOR.panel}" stroke="${COLOR.panelStroke}" stroke-width="1"/>
  <image x="${imgX}" y="${imgY}" width="${imgW}" height="${imgH}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})" xlink:href="${shot.dataUri}"/>`;

  // Gold callout ring over a normalized region of the shot (ring only; the
  // label goes below the panel so it never sits on the screenshot).
  if (callout) {
    const cx = Math.round(imgX + callout.nx * imgW);
    const cy = Math.round(imgY + callout.ny * imgH);
    const cw = Math.round(callout.nw * imgW);
    const ch = Math.round(callout.nh * imgH);
    out += `
  <rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="12" fill="none" stroke="${COLOR.gold}" stroke-width="3.5"/>`;
  }

  // Labels below the frame: gold callout label first, then grey caption.
  let belowY = panelY + panelH + 58;
  if (callout && callout.label) {
    out += `\n<text x="540" y="${belowY}" text-anchor="middle" font-family="${FONT.body}" font-size="30" font-weight="600" fill="${COLOR.gold}">${esc(callout.label)}</text>`;
    belowY += 52;
  }
  if (caption) {
    out += `\n<text x="540" y="${belowY}" text-anchor="middle" font-family="${FONT.body}" font-size="30" font-weight="400" fill="${COLOR.body}">${esc(caption)}</text>`;
  }

  return frame('feed', { body: out });
}

// ---- CTA: centered wordmark, closing lines, url. Always closes a carousel. ----
export function cta({ lines = [], url }) {
  let out = `
  <g>
    <circle cx="465" cy="546" r="46" fill="none" stroke="${COLOR.panelStroke}" stroke-width="2"/>
    <path d="M 443.16 547.04 l 15.6 16.64 l 29.12 -32.24" stroke="${COLOR.gold}" stroke-width="7.28" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="531" y="560" font-family="${FONT.display}" font-size="76" font-weight="700" fill="${COLOR.cream}">Certify</text>
  </g>`;
  let y = 740;
  for (const l of lines) {
    out += `\n<text x="540" y="${y}" font-family="${FONT.display}" font-size="58" font-weight="600" fill="${COLOR.cream}" text-anchor="middle">${esc(l)}</text>`;
    y += 74;
  }
  if (url) {
    out += `\n<text x="540" y="${y + 18}" text-anchor="middle" font-family="${FONT.body}" font-size="36" font-weight="600" fill="${COLOR.goldUrl}">${esc(url)}</text>`;
  }
  return frame('feed', { body: out }, false); // cta has its own mark, no bottom mark
}

export const LAYOUTS = { hook, tension, value, stat, single, cta, 'value-shot': valueShot };
export { isRuns, runText };
