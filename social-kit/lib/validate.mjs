// Certify social kit — text validator.
// Runs before render. Any violation fails the build (exit 1 from render.mjs).
// Mirrors the rules from certify-visual-brain.md and already-certified-social-brand.md.

const BANNED = [
  /\bguaranteed?\b/i, /\bpass guaranteed\b/i, /\bbraindump/i, /\bdump\b/i,
  /\bgame[- ]?chang/i, /\bunlock your potential\b/i, /\bcomment below\b/i,
  /\btag a friend\b/i, /\blink in bio\b/i, /\bsupercharge\b/i, /\brevolutionary\b/i,
];

const WORDS = (s) => String(s).trim().split(/\s+/).filter(Boolean).length;

function checkText(label, s, maxWords, errs) {
  if (s == null) return;
  const flat = typeof s === 'string'
    ? s
    : s.map((r) => (typeof r === 'string' ? r : r.t)).join('');
  if (/[—–]/.test(flat)) errs.push(`${label}: contains an em or en dash`);
  for (const re of BANNED) if (re.test(flat)) errs.push(`${label}: banned phrasing (${re})`);
  if (maxWords && WORDS(flat) > maxWords) {
    errs.push(`${label}: ${WORDS(flat)} words, over the ${maxWords} limit`);
  }
}

export function validatePost(post) {
  const errs = [];
  const seenLetters = post.slug || 'post';

  for (const [i, slide] of post.slides.entries()) {
    const tag = `${seenLetters} slide ${i + 1} (${slide.layout})`;

    if (i === 0 && slide.layout !== 'hook' && post.slides.length > 1) {
      errs.push(`${tag}: carousel must open on a hook`);
    }
    if (post.slides.length > 1 && i === post.slides.length - 1 && slide.layout !== 'cta') {
      errs.push(`${tag}: carousel must close on a cta`);
    }

    if (slide.layout === 'hook') {
      (slide.lines || []).forEach((l) => checkText(`${tag} hook`, l, 8, errs));
    }
    if (slide.layout === 'tension') {
      (slide.lines || []).forEach((l) => checkText(`${tag} tension`, l, 8, errs));
    }
    if (slide.layout === 'value' || slide.layout === 'single') {
      checkText(`${tag} eyebrow`, slide.eyebrow, 6, errs);
      (slide.headlineLines || []).forEach((l) => checkText(`${tag} headline`, l, 8, errs));
      (slide.bodyLines || []).forEach((l) => checkText(`${tag} body`, l, 15, errs));

      // One gold element per frame (brand mark excluded).
      const goldRuns = (slide.bodyLines || [])
        .filter(Array.isArray)
        .reduce((n, line) => n + line.filter((r) => r && r.gold).length, 0);
      const headlineGold = slide.layout === 'single' || slide.goldHeadline ? 1 : 0;
      const goldCount = headlineGold + goldRuns;
      if (goldCount > 1) {
        errs.push(`${tag}: ${goldCount} gold elements, limit is 1 (use em for extra emphasis)`);
      }
      if (slide.layout === 'single' && goldRuns > 0) {
        errs.push(`${tag}: single already has a gold headline, body must use em not gold`);
      }
    }
    if (slide.layout === 'stat') {
      checkText(`${tag} eyebrow`, slide.eyebrow, 6, errs);
      (slide.bodyLines || []).forEach((l) => checkText(`${tag} body`, l, 15, errs));
      checkText(`${tag} foot`, slide.foot, 15, errs);
    }
    if (slide.layout === 'value-shot') {
      checkText(`${tag} eyebrow`, slide.eyebrow, 6, errs);
      (slide.headlineLines || []).forEach((l) => checkText(`${tag} headline`, l, 8, errs));
      checkText(`${tag} caption`, slide.caption, 12, errs);
      if (slide.callout) checkText(`${tag} callout`, slide.callout.label, 8, errs);
      if (!slide.shot || !slide.shot.src) {
        errs.push(`${tag}: value-shot needs shot.src (a captured PNG in assets/)`);
      }
      // The callout ring is the one gold element; without a callout the frame
      // carries no gold, which is allowed for a product frame.
    }

    if (slide.layout === 'cta') {
      (slide.lines || []).forEach((l) => checkText(`${tag} cta`, l, 10, errs));
    }
  }

  // Captions: long-form allowed, but still no dashes / banned phrasing, and hashtag cap.
  if (post.captionIg) {
    if (/[—–]/.test(post.captionIg)) errs.push(`${seenLetters} IG caption: em or en dash`);
    for (const re of BANNED) if (re.test(post.captionIg)) errs.push(`${seenLetters} IG caption: banned (${re})`);
    if (post.captionIg.length > 2200) errs.push(`${seenLetters} IG caption: over 2200 chars`);
  }
  if (post.hashtags) {
    const n = post.hashtags.trim().split(/\s+/).filter((h) => h.startsWith('#')).length;
    if (n > 30) errs.push(`${seenLetters}: ${n} hashtags, over 30`);
    if (n < 8) errs.push(`${seenLetters}: only ${n} hashtags, want 10 to 15 on IG`);
  }
  if (post.captionFb && /[—–]/.test(post.captionFb)) {
    errs.push(`${seenLetters} FB caption: em or en dash`);
  }

  return errs;
}

export function validateAll(posts) {
  const all = [];
  for (const p of posts) all.push(...validatePost(p));
  return all;
}
