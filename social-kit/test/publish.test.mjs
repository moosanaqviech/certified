// End-to-end test of bin/publish.mjs --live against a fake Graph API.
// No network and no real credentials: one local HTTP server plays both
// certify.courses (serving out/<slug>/*.jpg) and graph.facebook.com, records
// every call, and the test checks the call sequence and the ledger.
// Usage: node test/publish.test.mjs   (exit 0 = pass)

import http from 'node:http';
import { mkdtempSync, writeFileSync, readFileSync, cpSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const KIT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SLUG = 'poisoning-or-clash';

// Work on a copy of the kit so the real schedule and ledger stay untouched.
const work = mkdtempSync(join(tmpdir(), 'social-test-'));
for (const f of ['bin', 'content', 'lib']) cpSync(join(KIT, f), join(work, f), { recursive: true });
cpSync(join(KIT, 'out', SLUG), join(work, 'out', SLUG), { recursive: true });
writeFileSync(join(work, 'package.json'), readFileSync(join(KIT, 'package.json')));
writeFileSync(join(work, 'schedule.json'), JSON.stringify([
  { slug: SLUG, publish_at: '2020-01-01T00:00:00Z', platforms: ['instagram', 'facebook'] },
]));
writeFileSync(join(work, 'posted.json'), '{}\n');

const calls = [];
let n = 0;
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  let body = '';
  req.on('data', (c) => { body += c; });
  req.on('end', () => {
    const params = Object.fromEntries(new URLSearchParams(req.method === 'GET' ? url.search : body));
    const send = (code, obj, type = 'application/json') => {
      res.writeHead(code, { 'content-type': type });
      res.end(type === 'application/json' ? JSON.stringify(obj) : obj);
    };
    // Images, as Netlify would serve them.
    if (url.pathname.startsWith('/social-kit/out/')) {
      const f = join(KIT, url.pathname.replace('/social-kit/', ''));
      return existsSync(f) ? send(200, req.method === 'HEAD' ? '' : readFileSync(f), 'image/jpeg') : send(404, { error: 'nf' });
    }
    // Graph API.
    const path = url.pathname.replace(/^\/v[\d.]+\//, '');
    calls.push({ method: req.method, path, params });
    if (params.access_token !== 'TEST_SYSTEM_TOKEN' && params.access_token !== 'TEST_PAGE_TOKEN') {
      return send(400, { error: { message: 'bad token', code: 190 } });
    }
    if (req.method === 'GET' && path === 'PAGE1' && params.fields === 'access_token') return send(200, { access_token: 'TEST_PAGE_TOKEN', id: 'PAGE1' });
    if (req.method === 'GET' && params.fields === 'status_code') return send(200, { status_code: 'FINISHED', id: path });
    if (path === 'IG1/media') return send(200, { id: `ig_container_${++n}` });
    if (path === 'IG1/media_publish') return send(200, { id: 'ig_media_999' });
    if (path === 'PAGE1/photos') {
      if (params.access_token !== 'TEST_PAGE_TOKEN') return send(400, { error: { message: 'needs page token', code: 190 } });
      return send(200, { id: `photo_${++n}` });
    }
    if (path === 'PAGE1/feed') return send(200, { id: 'PAGE1_post_777' });
    return send(404, { error: { message: `unexpected ${req.method} ${path}`, code: 100 } });
  });
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const run = (extra = []) => new Promise((resolve) => {
  // spawnSync would block the event loop the fake server runs on, so run async.
  import('node:child_process').then(({ spawn }) => {
    const p = spawn(process.execPath, ['bin/publish.mjs', '--live', ...extra], {
      cwd: work,
      env: { ...process.env, META_GRAPH_BASE: base, SOCIAL_SITE_URL: base, META_PAGE_TOKEN: 'TEST_SYSTEM_TOKEN', FB_PAGE_ID: 'PAGE1', IG_USER_ID: 'IG1' },
    });
    let out = '';
    p.stdout.on('data', (d) => { out += d; });
    p.stderr.on('data', (d) => { out += d; });
    p.on('close', (code) => resolve({ code, out }));
  });
});

try {
  const first = await run();
  assert.equal(first.code, 0, 'first live run should succeed:\n' + first.out);
  assert.ok(!first.out.includes('TEST_SYSTEM_TOKEN') && !first.out.includes('TEST_PAGE_TOKEN'), 'tokens must never be printed');

  const posts = calls.filter((c) => c.method === 'POST');
  const igChildren = posts.filter((c) => c.path === 'IG1/media' && c.params.is_carousel_item === 'true');
  const igCarousel = posts.filter((c) => c.path === 'IG1/media' && c.params.media_type === 'CAROUSEL');
  assert.equal(igChildren.length, 6, 'one Instagram child container per slide');
  assert.ok(igChildren.every((c, i) => c.params.image_url.endsWith(`/out/${SLUG}/${['01-hook', '02-tension', '03-value', '04-value', '05-value', '06-cta'][i]}.jpg`)), 'children in slide order');
  assert.equal(igCarousel.length, 1);
  assert.equal(igCarousel[0].params.children.split(',').length, 6);
  assert.ok(igCarousel[0].params.caption.includes('#contextengineering'), 'IG caption carries hashtags');
  assert.equal(posts.filter((c) => c.path === 'IG1/media_publish').length, 1);

  const photos = posts.filter((c) => c.path === 'PAGE1/photos');
  assert.equal(photos.length, 6);
  assert.ok(photos.every((c) => c.params.published === 'false' && c.params.access_token === 'TEST_PAGE_TOKEN'), 'FB photos unpublished, with the exchanged Page token');
  const feed = posts.find((c) => c.path === 'PAGE1/feed');
  assert.ok(feed && JSON.parse(feed.params['attached_media[5]']).media_fbid, 'feed post attaches all six photos');
  assert.ok(!feed.params.message.includes('#'), 'FB caption has no hashtag block');

  const ledger = JSON.parse(readFileSync(join(work, 'posted.json'), 'utf8'));
  assert.equal(ledger[SLUG].instagram.id, 'ig_media_999');
  assert.equal(ledger[SLUG].facebook.id, 'PAGE1_post_777');

  // A second run must not post again.
  const before = calls.length;
  const second = await run();
  assert.equal(second.code, 0);
  assert.match(second.out, /0 due now/);
  assert.equal(calls.filter((c, i) => i >= before && c.method === 'POST').length, 0, 'second run posts nothing');

  console.log('PASS: carousel to Instagram and Facebook, ledger written, rerun is a no-op, tokens never printed');
} catch (e) {
  console.error('FAIL:', e.message);
  process.exitCode = 1;
} finally {
  server.close();
}
