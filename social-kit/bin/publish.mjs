// Certify social kit: publisher.
//
// Posts rendered carousels to Instagram and a Facebook Page through the Meta
// Graph API. The kit already renders posts into out/<slug>/ (JPGs plus
// captions.txt); those files are committed, and Netlify publishes the repo
// root, so every slide is public at
//   https://certify.courses/social-kit/out/<slug>/<NN-layout>.jpg
// which is what Instagram needs: it fetches images by URL, it takes no upload.
//
// What gets posted, and when, is data:
//   schedule.json  the queue: [{ slug, publish_at (ISO 8601, UTC), platforms }]
//   posted.json    the ledger: what already went out, with Meta's ids. A
//                  (slug, platform) pair in the ledger is never posted again,
//                  so reruns and overlapping cron runs cannot double-post.
// Captions come from content/posts.mjs (captionIg + hashtags, captionFb).
//
// Usage:
//   node bin/publish.mjs                 dry run of everything due now
//   node bin/publish.mjs --all           dry run of every queued entry, due or not
//   node bin/publish.mjs --check-urls    dry run, and HEAD-check each image URL
//   node bin/publish.mjs --live          post what is due (needs the env below)
//
// Live mode needs, as environment variables (GitHub Actions secrets):
//   META_PAGE_TOKEN    a long-lived token with pages_manage_posts,
//                      pages_read_engagement, pages_show_list, instagram_basic,
//                      instagram_content_publish (a system user token is best:
//                      it does not expire). If it is a user or system user
//                      token, the script exchanges it for the Page's own token
//                      for the Facebook calls.
//   FB_PAGE_ID         the Facebook Page id
//   IG_USER_ID         the Instagram professional account id linked to the Page
// Optional: META_GRAPH_VERSION (default below), SOCIAL_SITE_URL, and
// META_GRAPH_BASE (tests only: points the script at a fake Graph API).
//
// Exit code: 0 when everything due was posted (or would be, in a dry run);
// 1 on any validation or API failure. The ledger is written after each
// successful platform post, so a failure part way through keeps what worked.

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { posts } from '../content/posts.mjs';

const KIT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SCHEDULE = join(KIT, 'schedule.json');
const LEDGER = join(KIT, 'posted.json');
const OUT = join(KIT, 'out');

const SITE = (process.env.SOCIAL_SITE_URL || 'https://certify.courses').replace(/\/+$/, '');
/* META_GRAPH_BASE exists only so tests can point at a fake Graph API. */
const GRAPH = (process.env.META_GRAPH_BASE || 'https://graph.facebook.com') + '/' + (process.env.META_GRAPH_VERSION || 'v23.0');
const PLATFORMS = ['instagram', 'facebook'];

/* Instagram limits (content publishing docs): a carousel holds 2 to 10 items,
   a caption at most 2,200 characters and 30 hashtags; JPEG only. */
const IG_MAX_ITEMS = 10;
const IG_MAX_CAPTION = 2200;
const IG_MAX_TAGS = 30;

const args = new Set(process.argv.slice(2));
const LIVE = args.has('--live');
const ALL = args.has('--all');
const CHECK_URLS = args.has('--check-urls') || LIVE;

const readJson = (p, fallback) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : fallback);

/* ---------- build the plan ---------- */

function slidesFor(slug) {
  const dir = join(OUT, slug);
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return null;
  return readdirSync(dir).filter((f) => /^\d{2}-[a-z-]+\.jpg$/.test(f)).sort();
}

function captionsFor(post) {
  const ig = `${post.captionIg.trim()}\n\n${post.hashtags.trim()}`;
  return { instagram: ig, facebook: post.captionFb.trim() };
}

function validateEntry(entry, idx, problems) {
  const tag = `schedule[${idx}] ${entry.slug || '(no slug)'}`;
  const post = posts.find((p) => p.slug === entry.slug);
  if (!post) { problems.push(`${tag}: no post with this slug in content/posts.mjs`); return null; }
  const when = Date.parse(entry.publish_at);
  if (!entry.publish_at || Number.isNaN(when) || !/(Z|[+-]\d{2}:\d{2})$/.test(entry.publish_at)) {
    problems.push(`${tag}: publish_at must be ISO 8601 with a zone, e.g. 2026-11-18T15:00:00Z`);
  }
  const platforms = entry.platforms || PLATFORMS;
  const bad = platforms.filter((p) => !PLATFORMS.includes(p));
  if (bad.length) problems.push(`${tag}: unknown platform(s) ${bad.join(', ')}`);
  const slides = slidesFor(entry.slug);
  if (!slides || !slides.length) {
    problems.push(`${tag}: no rendered JPGs in out/${entry.slug}/ (run node render.mjs and commit out/)`);
    return null;
  }
  if (slides.length > IG_MAX_ITEMS) problems.push(`${tag}: ${slides.length} slides, Instagram allows ${IG_MAX_ITEMS}`);
  const caps = captionsFor(post);
  if (caps.instagram.length > IG_MAX_CAPTION) {
    problems.push(`${tag}: Instagram caption is ${caps.instagram.length} characters, limit ${IG_MAX_CAPTION}`);
  }
  const tags = (caps.instagram.match(/#[\p{L}\p{N}_]+/gu) || []).length;
  if (tags > IG_MAX_TAGS) problems.push(`${tag}: ${tags} hashtags, Instagram allows ${IG_MAX_TAGS}`);
  for (const [k, v] of Object.entries(caps)) {
    if (/[—–]/.test(v)) problems.push(`${tag}: ${k} caption contains an em or en dash`);
  }
  return {
    slug: entry.slug,
    when: Number.isNaN(when) ? Infinity : when,
    platforms,
    urls: slides.map((f) => `${SITE}/social-kit/out/${entry.slug}/${f}`),
    captions: caps,
  };
}

/* ---------- Graph API ---------- */

async function graph(method, path, params, token) {
  const body = new URLSearchParams({ ...params, access_token: token });
  const url = method === 'GET' ? `${GRAPH}/${path}?${body}` : `${GRAPH}/${path}`;
  const res = await fetch(url, method === 'GET' ? {} : { method, body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    const e = data.error || {};
    // Never echo the token: Meta's messages do not include it, and neither do we.
    throw new Error(`${method} ${path}: ${e.message || res.status} (code ${e.code ?? '?'}, subcode ${e.error_subcode ?? '?'})`);
  }
  return data;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* Containers are processed asynchronously; publish only once FINISHED. */
async function waitForContainer(id, token) {
  for (let i = 0; i < 30; i++) {
    const { status_code } = await graph('GET', id, { fields: 'status_code' }, token);
    if (status_code === 'FINISHED') return;
    if (status_code === 'ERROR' || status_code === 'EXPIRED') throw new Error(`container ${id} is ${status_code}`);
    await sleep(5000);
  }
  throw new Error(`container ${id} not ready after 150 s`);
}

async function postInstagram(item, env) {
  const { IG_USER_ID: ig, token } = env;
  let creation;
  if (item.urls.length === 1) {
    ({ id: creation } = await graph('POST', `${ig}/media`, { image_url: item.urls[0], caption: item.captions.instagram }, token));
  } else {
    const children = [];
    for (const url of item.urls) {
      const { id } = await graph('POST', `${ig}/media`, { image_url: url, is_carousel_item: 'true' }, token);
      children.push(id);
    }
    for (const id of children) await waitForContainer(id, token);
    ({ id: creation } = await graph('POST', `${ig}/media`, {
      media_type: 'CAROUSEL', children: children.join(','), caption: item.captions.instagram,
    }, token));
  }
  await waitForContainer(creation, token);
  const { id } = await graph('POST', `${ig}/media_publish`, { creation_id: creation }, token);
  return id;
}

async function postFacebook(item, env) {
  const { FB_PAGE_ID: page, pageToken } = env;
  if (item.urls.length === 1) {
    const r = await graph('POST', `${page}/photos`, { url: item.urls[0], caption: item.captions.facebook, published: 'true' }, pageToken);
    return r.post_id || r.id;
  }
  const media = [];
  for (const url of item.urls) {
    const { id } = await graph('POST', `${page}/photos`, { url, published: 'false' }, pageToken);
    media.push(id);
  }
  const params = { message: item.captions.facebook };
  media.forEach((id, i) => { params[`attached_media[${i}]`] = JSON.stringify({ media_fbid: id }); });
  const { id } = await graph('POST', `${page}/feed`, params, pageToken);
  return id;
}

/* A system user or user token needs exchanging for the Page token before
   /{page}/photos and /{page}/feed accept it; a Page token passes through. */
async function resolvePageToken(env) {
  try {
    const r = await graph('GET', env.FB_PAGE_ID, { fields: 'access_token' }, env.token);
    if (r.access_token) return r.access_token;
  } catch (e) { /* already a Page token, or no page access: the post will say */ }
  return env.token;
}

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    const type = res.headers.get('content-type') || '';
    if (!res.ok) return `HTTP ${res.status}`;
    if (!/image\/jpe?g/.test(type)) return `content-type ${type || 'missing'}, Instagram needs image/jpeg`;
    return null;
  } catch (e) { return e.message; }
}

/* ---------- main ---------- */

async function main() {
  const schedule = readJson(SCHEDULE, []);
  const ledger = readJson(LEDGER, {});
  const problems = [];
  const items = schedule.map((e, i) => validateEntry(e, i, problems)).filter(Boolean);
  const dupes = schedule.map((e) => e.slug).filter((s, i, a) => a.indexOf(s) !== i);
  if (dupes.length) problems.push(`schedule: slug(s) queued twice: ${[...new Set(dupes)].join(', ')}`);
  if (problems.length) {
    console.error('SCHEDULE INVALID:\n' + problems.map((p) => '  - ' + p).join('\n'));
    process.exit(1);
  }

  const now = Date.now();
  const due = items
    .filter((it) => ALL || it.when <= now)
    .map((it) => ({ ...it, platforms: it.platforms.filter((p) => !(ledger[it.slug] && ledger[it.slug][p])) }))
    .filter((it) => it.platforms.length)
    .sort((a, b) => a.when - b.when);

  const queued = items.length;
  const done = items.filter((it) => it.platforms.every((p) => ledger[it.slug] && ledger[it.slug][p])).length;
  console.log(`${LIVE ? 'LIVE' : 'DRY RUN'}: ${queued} queued, ${done} fully posted, ${due.length} ${ALL ? 'pending' : 'due now'}`);

  if (!due.length) return;

  let env = null;
  if (LIVE) {
    const missing = ['META_PAGE_TOKEN', 'FB_PAGE_ID', 'IG_USER_ID'].filter((k) => !process.env[k]);
    if (missing.length) {
      console.error(`live mode needs ${missing.join(', ')}; nothing posted`);
      process.exit(1);
    }
    env = { token: process.env.META_PAGE_TOKEN, FB_PAGE_ID: process.env.FB_PAGE_ID, IG_USER_ID: process.env.IG_USER_ID };
    env.pageToken = await resolvePageToken(env);
  }

  let failed = false;
  for (const it of due) {
    console.log(`\n${it.slug}  (${new Date(it.when).toISOString()})  -> ${it.platforms.join(', ')}`);
    it.urls.forEach((u) => console.log(`  image  ${u}`));
    if (CHECK_URLS) {
      const bad = [];
      for (const u of it.urls) { const why = await checkUrl(u); if (why) bad.push(`${u}: ${why}`); }
      if (bad.length) {
        console.error('  skipped: image URL not live yet (merge and let Netlify deploy first)\n' + bad.map((b) => '    ' + b).join('\n'));
        failed = true;
        continue;
      }
    }
    for (const p of it.platforms) {
      const cap = it.captions[p];
      console.log(`  ${p}: ${it.urls.length === 1 ? 'single image' : it.urls.length + '-slide carousel'}, caption ${cap.length} chars: "${cap.slice(0, 70).replace(/\s+/g, ' ')}..."`);
      if (!LIVE) continue;
      try {
        const id = p === 'instagram' ? await postInstagram(it, env) : await postFacebook(it, env);
        ledger[it.slug] = { ...(ledger[it.slug] || {}), [p]: { id, posted_at: new Date().toISOString() } };
        writeFileSync(LEDGER, JSON.stringify(ledger, null, 2) + '\n');
        console.log(`    posted: ${id}`);
      } catch (e) {
        console.error(`    FAILED: ${e.message}`);
        failed = true;
      }
    }
  }
  if (failed) process.exit(1);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
