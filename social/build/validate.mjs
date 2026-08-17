// Validates every registered post against the kit rules (see
// certify-visual-brain.md), then checks rendered output dimensions.
// Usage, from social/: node build/validate.mjs
// Exits 0 when clean, 1 with a findings list otherwise.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { POSTS } from "./posts.mjs";

const KIT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(KIT, "out");

const CERT_KEYS = [
  "databricks-de-associate",
  "databricks-de-professional",
  "aws-dea-c01",
  "databricks-ml-associate",
  "databricks-genai-associate",
  "platform",
];

const DARK_FAMILY = ["#14161c", "#0d0f13", "#1b1e26"];
const ALLOWED_HEX = [...DARK_FAMILY, "#e9e6dd", "#d9a441", "#e5c988"];

// Content bans: dumps, leaked questions, guaranteed-pass claims, hype
// adjectives, engagement bait.
const BANNED = [
  [/\bdumps?\b/i, "exam-dump language"],
  [/leaked/i, "leaked-questions language"],
  [/guaranteed?\s+pass/i, "guaranteed-pass claim"],
  [/game.chang/i, "hype adjective (game-changing)"],
  [/revolutionar/i, "hype adjective (revolutionary)"],
  [/\bultimate\b/i, "hype adjective (ultimate)"],
  [/comment\s+(yes|below)/i, "engagement bait"],
  [/tag\s+a\s+friend/i, "engagement bait"],
];

const problems = [];
const flag = (slug, msg) => problems.push(`${slug}: ${msg}`);
const words = (s) => s.trim().split(/\s+/).length;

// Slide-level text fields subject to the 15-word cap. Feed captions are
// long-form and exempt.
const CAPPED_FIELDS = ["body", "kicker", "note"];

function checkSlideText(slug, i, slide) {
  for (const f of CAPPED_FIELDS) {
    if (slide[f] && words(slide[f]) > 15)
      flag(slug, `slide ${i + 1} ${f} is ${words(slide[f])} words (max 15)`);
  }
  if (slide.lines)
    for (const l of slide.lines)
      if (words(l) > 15)
        flag(slug, `slide ${i + 1} line "${l}" is ${words(l)} words (max 15)`);
}

// The renderer puts exactly one gold content element on every frame:
// hook and tension get the accent bar, cta gets the closing domain line,
// body/value/artwork get either the named callout or the eyebrow. The
// data-side invariants below keep that mapping single-valued.
function checkGold(slug, i, slide) {
  if (["hook", "tension", "cta"].includes(slide.type)) {
    if (slide.gold)
      flag(slug, `slide ${i + 1} (${slide.type}) must not carry a gold callout`);
    return;
  }
  if (!slide.eyebrow)
    flag(slug, `slide ${i + 1} (${slide.type}) needs an eyebrow`);
  if (slide.gold) {
    const haystack = [slide.body || "", ...(slide.lines || [])].join("\n");
    if (!haystack.includes(slide.gold))
      flag(slug, `slide ${i + 1} gold callout "${slide.gold}" not found in slide text`);
  }
}

function checkSlides(slug, post) {
  const s = post.slides;
  if (post.format === "carousel") {
    if (s.length < 3) flag(slug, "carousel needs at least 3 slides");
    if (s[0].type !== "hook") flag(slug, "carousel must open on a hook slide");
    if (s[s.length - 1].type !== "cta")
      flag(slug, "carousel must close on a CTA slide");
    if (s.filter((x) => x.type === "hook").length > 1)
      flag(slug, "only one hook slide allowed");
    if (s.filter((x) => x.type === "cta").length > 1)
      flag(slug, "only one CTA slide allowed");
  } else if (post.format === "static") {
    if (s.length !== 1 || s[0].type !== "artwork")
      flag(slug, "static post must be exactly one artwork slide");
  } else {
    flag(slug, `unknown format "${post.format}"`);
  }

  s.forEach((slide, i) => {
    if (slide.type === "hook" && words(slide.headline) > 8)
      flag(slug, `hook headline is ${words(slide.headline)} words (max 8)`);
    if (slide.type === "cta") {
      if (!slide.lines || slide.lines[slide.lines.length - 1] !== "certify.courses")
        flag(slug, "CTA slide must end on the line \"certify.courses\"");
    }
    if (slide.background && !DARK_FAMILY.includes(slide.background))
      flag(slug, `slide ${i + 1} background ${slide.background} is outside the dark family`);
    checkSlideText(slug, i, slide);
    checkGold(slug, i, slide);
  });
}

function checkCaptions(slug, post) {
  const ig = post.captions?.instagram;
  const fb = post.captions?.facebook;
  if (!ig || !fb) {
    flag(slug, "captions.instagram and captions.facebook are both required");
    return;
  }

  if (ig.hashtags.length < 13 || ig.hashtags.length > 15)
    flag(slug, `IG needs 13 to 15 hashtags, has ${ig.hashtags.length}`);
  for (const h of ig.hashtags)
    if (!/^#[a-z0-9]+$/.test(h))
      flag(slug, `IG hashtag ${h} must be lowercase alphanumeric`);
  if (/https?:|www\./i.test(ig.text))
    flag(slug, "IG caption must not contain live links");
  if (!ig.text.includes("certify.courses"))
    flag(slug, "IG caption must speak certify.courses");

  if (fb.hashtags.length !== 0 && (fb.hashtags.length < 2 || fb.hashtags.length > 3))
    flag(slug, `FB needs 2 to 3 hashtags or none, has ${fb.hashtags.length}`);
  for (const h of fb.hashtags)
    if (!/^#[A-Z][A-Za-z0-9]*$/.test(h))
      flag(slug, `FB hashtag ${h} must be title-case`);
  if (!fb.text.includes("https://certify.courses"))
    flag(slug, "FB caption must carry the live https://certify.courses link");
}

function checkSource(slug, post) {
  if (!post.source || !post.source.trim()) {
    flag(slug, "source is required");
    return;
  }
  // DEA-C01 has no curriculum chapters yet: posts cite the official exam
  // guide domain, never a chapter number.
  if (post.cert === "aws-dea-c01") {
    if (!/exam guide/i.test(post.source))
      flag(slug, "aws-dea-c01 source must cite the official exam guide");
    if (/\bch\b|\bchapter\b/i.test(post.source))
      flag(slug, "aws-dea-c01 source must not cite a chapter number");
  }
}

function checkRaw(slug, raw, post) {
  const dash = raw.match(/[\u2013\u2014]/);
  if (dash) flag(slug, `contains an ${dash[0] === "\u2014" ? "em" : "en"} dash`);
  // Hashtags like #deac01 can look like hex colors; exempt declared tags.
  const tags = new Set(
    [
      ...(post?.captions?.instagram?.hashtags || []),
      ...(post?.captions?.facebook?.hashtags || []),
    ].map((t) => t.toLowerCase())
  );
  for (const hex of raw.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
    const h = hex[0].toLowerCase();
    if (tags.has(h)) continue;
    if (h === "#fff" || h === "#ffffff")
      flag(slug, "pure white is banned (use cream #e9e6dd)");
    else if (!ALLOWED_HEX.includes(h))
      flag(slug, `color ${hex[0]} is outside the brand palette`);
  }
  for (const [re, label] of BANNED)
    if (re.test(raw)) flag(slug, `banned content: ${label}`);
}

function pngSize(path) {
  const buf = readFileSync(path);
  if (buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function checkOutput(slug, post) {
  const dir = join(OUT, slug);
  if (!existsSync(dir)) {
    flag(slug, "no rendered output (run build/render.mjs first)");
    return;
  }
  const pngs = readdirSync(dir).filter((f) => f.endsWith(".png")).sort();
  if (pngs.length !== post.slides.length) {
    flag(slug, `expected ${post.slides.length} PNG frame(s), found ${pngs.length}`);
    return;
  }
  for (const f of pngs) {
    const size = pngSize(join(dir, f));
    if (!size) {
      flag(slug, `${f} is not a PNG`);
    } else if (size.width !== post.size.width || size.height !== post.size.height) {
      flag(slug, `${f} is ${size.width}x${size.height}, expected ${post.size.width}x${post.size.height}`);
    }
  }
}

const seenSlugs = new Set();
const seenNumbers = new Set();
for (const { post: number, slug } of POSTS) {
  if (seenSlugs.has(slug)) flag(slug, "duplicate slug in registry");
  if (seenNumbers.has(number)) flag(slug, `duplicate post number ${number}`);
  seenSlugs.add(slug);
  seenNumbers.add(number);

  const file = join(KIT, "posts", slug, "post.json");
  if (!existsSync(file)) {
    flag(slug, "posts folder or post.json missing");
    continue;
  }
  const raw = readFileSync(file, "utf8");
  let post;
  try {
    post = JSON.parse(raw);
  } catch (e) {
    flag(slug, `post.json does not parse: ${e.message}`);
    continue;
  }

  if (post.slug !== slug) flag(slug, `post.json slug "${post.slug}" mismatches folder`);
  if (post.post !== number) flag(slug, `post.json number ${post.post} mismatches registry ${number}`);
  if (!CERT_KEYS.includes(post.cert))
    flag(slug, `cert "${post.cert}" is not in the allowlist [${CERT_KEYS.join(", ")}]`);
  if (post.size?.width !== 1080 || post.size?.height !== 1350)
    flag(slug, `size must be 1080x1350, got ${post.size?.width}x${post.size?.height}`);

  checkRaw(slug, raw, post);
  checkSource(slug, post);
  checkSlides(slug, post);
  checkCaptions(slug, post);
  checkOutput(slug, post);
}

// Unregistered post folders are an error too: everything in posts/ renders.
if (existsSync(join(KIT, "posts")))
  for (const dir of readdirSync(join(KIT, "posts")))
    if (!seenSlugs.has(dir)) flag(dir, "folder exists but is not registered in posts.mjs");

if (problems.length) {
  console.error(`FAIL: ${problems.length} problem(s)`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`OK: ${POSTS.length} post(s) validated, rendered output verified`);
