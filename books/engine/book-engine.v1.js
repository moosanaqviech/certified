/* Book engine v1 (milestones 1 and 2).
   Shared by every book lesson page. A page carries its lesson as JSON in
   <script type="application/json" id="lesson"> and a <main id="app"> mount.
   Payloads are data only: no script, no raw HTML outside a card's `art` SVG.

   Card types: cover, concept, case, compare, scene, video, dialogue,
   timeline, figure, choice (single or select-N), predict, sort, bucket,
   reflect, commit, done.
   A breaking change ships as book-engine.v2.js; fixes to this file reach
   every v1 lesson at once, so keep them backward compatible. */
(function () {
  'use strict';

  var dataEl = document.getElementById('lesson');
  var app = document.getElementById('app');
  if (!dataEl || !app) return;

  var L;
  try {
    L = JSON.parse(dataEl.textContent);
  } catch (e) {
    app.innerHTML = '<p class="be-error">This lesson could not be loaded.</p>';
    return;
  }
  var cards = L.cards || [];
  if (!cards.length) return;
  /* A dialogue shows one line per tap and a timeline one event per tap. */
  cards.forEach(function (c) {
    if (c.type === 'dialogue' && c.lines) c.steps = c.lines.length;
    if (c.type === 'timeline' && c.events) c.steps = c.events.length;
    if (c.type === 'evolve' && c.stages) c.steps = Math.max(0, c.stages.length - 1);
  });

  var PRODUCING = { choice: 1, predict: 1, sort: 1, bucket: 1, reflect: 1, commit: 1, estimate: 1, label: 1, spot: 1 };
  /* An explorable with a goal asks for something; one without is to play with. */
  function producing(c) { return !!PRODUCING[c.type] || (c.type === 'explorable' && !!c.goal); }
  var NO_SWIPE = { sort: 1, bucket: 1, explorable: 1, label: 1 };
  var TAG = {
    concept: 'The idea',
    'case': 'A case',
    compare: 'Side by side',
    dialogue: 'A conversation',
    timeline: 'How it unfolded',
    figure: 'One number',
    scene: 'Picture it',
    video: 'Watch',
    evolve: 'Watch it build',
    explorable: 'Try it',
    estimate: 'Estimate',
    simulate: 'Run it',
    label: 'Label it',
    spot: 'Spot the mistake',
    choice: 'Your turn',
    predict: 'What would you do?',
    sort: 'Put in order',
    bucket: 'Sort into groups',
    reflect: 'Apply it',
    commit: 'Your next step'
  };

  /* ---------- storage: every read and write may fail ---------- */
  var storageOk = true;
  function read(key, fallback) {
    try {
      var v = window.localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) {
      storageOk = false;
      return fallback;
    }
  }
  function write(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      storageOk = false;
    }
  }

  var PKEY = 'books.v1.progress.' + L.book;
  var NKEY = 'books.v1.notes.' + L.book;
  var RKEY = 'books.v1.review';
  var lessonKey = String(L.n);
  var progress = read(PKEY, {});
  var notes = read(NKEY, {});
  var me = progress[lessonKey] || null;

  /* ---------- review mode ----------
     The review page (books/review/) builds a session of due cards, keeps it
     in sessionStorage and opens the first card's lesson with ?review=1. In
     that mode this engine shows only the session's cards from this lesson,
     one at a time and unanswered, then hands on to the next lesson or back
     to the review page. Lesson progress is not touched. */
  var DAYS = { 1: 1, 2: 3, 3: 7, 4: 16, 5: 35 };
  var SKEY = 'books.v1.session';
  var CKEY = 'books.v1.commitments';
  function sread(key) {
    try {
      var v = window.sessionStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch (e) { return null; }
  }
  function swrite(key, value) {
    try { window.sessionStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  var selfName = window.location.pathname.split('/').pop();
  var selfFile = L.book + '/' + selfName;
  var wantsReview = false;
  try { wantsReview = !!new URLSearchParams(window.location.search).get('review'); } catch (e) {}
  var session = wantsReview ? sread(SKEY) : null;
  var reviewMode = !!(session && session.queue && session.queue.length);
  var homeHref = reviewMode ? '../review/' : './';
  var reviewCard = null;
  var reviewVariant = 0;
  var reviewAnswered = false;

  function now() { return new Date().toISOString(); }
  function fresh() { return { at: null, answers: {}, started: now(), completed: null }; }
  function save() {
    if (reviewMode) return;
    progress[lessonKey] = me;
    write(PKEY, progress);
  }

  /* ---------- analytics: ids, types and right or wrong only. Never the
     learner's written text. ---------- */
  function track(name, params) {
    try {
      if (typeof window.gtag !== 'function') return;
      var p = { book: L.book, lesson: L.n };
      for (var k in params) if (Object.prototype.hasOwnProperty.call(params, k)) p[k] = params[k];
      window.gtag('event', name, p);
    } catch (e) {}
  }

  /* ---------- small helpers ---------- */
  function h(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function btn(cls, html) {
    var b = h('button', cls, html);
    b.type = 'button';
    return b;
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  /* Inline subset: **bold**, *italic*, `code`, line breaks. Everything else is escaped. */
  function fmt(s) {
    return esc(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }
  function plain(s) { return String(s).replace(/[*`]/g, ''); }
  /* A fixed shuffle per card, so the order is the same on every visit and is
     never the solved order. */
  function shuffled(n, seed) {
    var a = [], s = 7, k;
    for (k = 0; k < n; k++) a.push(k);
    for (k = 0; k < seed.length; k++) s = (s * 31 + seed.charCodeAt(k)) >>> 0;
    for (k = n - 1; k > 0; k--) {
      s = (s * 1664525 + 1013904223) >>> 0;
      var r = s % (k + 1), t = a[k];
      a[k] = a[r];
      a[r] = t;
    }
    var solved = true;
    for (k = 0; k < n; k++) if (a[k] !== k) solved = false;
    if (solved && n > 1) a.push(a.shift());
    return a;
  }

  /* ---------- chrome ---------- */
  app.innerHTML = '';
  app.className = 'be';

  var top = h('div', 'be-top');
  var close = h('a', 'be-close', '&times;');
  close.href = homeHref;
  close.setAttribute('aria-label', reviewMode ? 'Back to review' : 'Back to the book');
  var bar = h('div', 'be-bar');
  bar.setAttribute('aria-hidden', 'true');
  var segs = (reviewMode ? session.queue : cards).map(function (c) {
    var s = h('span', 'be-seg' + (!reviewMode && producing(c) ? ' is-do' : ''));
    bar.appendChild(s);
    return s;
  });
  var count = h('span', 'be-count');
  top.appendChild(close);
  top.appendChild(bar);
  top.appendChild(count);

  var note = h('p', 'be-note', 'Progress cannot be saved in this browser. The lesson still works.');
  note.hidden = true;

  var stage = h('div', 'be-stage');
  var live = h('div', 'be-live');
  live.setAttribute('aria-live', 'polite');

  var foot = h('div', 'be-foot');
  var backBtn = btn('be-btn is-quiet be-back', 'Back');
  var nextBtn = btn('be-btn be-next', 'Continue');
  var keys = h('span', 'be-keys', 'or use the arrow keys');
  keys.setAttribute('aria-hidden', 'true');
  foot.appendChild(backBtn);
  foot.appendChild(nextBtn);
  foot.appendChild(keys);

  app.appendChild(top);
  /* "Back to where you were" bar, shown only with a same-site ?back= path. */
  (function () {
    var back = null;
    try { back = new URLSearchParams(window.location.search).get('back'); } catch (e) {}
    if (back && /^\/(?!\/)/.test(back) && back.indexOf('\\') < 0) {
      var a = h('a', 'be-return', 'Back to where you were');
      a.href = back;
      app.appendChild(a);
    }
  })();
  app.appendChild(note);
  app.appendChild(stage);
  app.appendChild(live);
  app.appendChild(foot);

  /* ---------- state ---------- */
  var i = 0;
  var stepState = {};
  var started = false;
  var nextLesson = null;

  function stepsLeft(c) { return (c.steps || 0) - (stepState[c.id] || 0); }
  function gated(c) { return producing(c) && !me.answers[c.id]; }

  function applySteps(c, card) {
    var n = stepState[c.id] || 0;
    var els = card.querySelectorAll('[data-step]');
    for (var k = 0; k < els.length; k++) {
      var at = parseInt(els[k].getAttribute('data-step'), 10);
      els[k].classList.toggle('be-on', at <= n);
    }
    var hint = card.querySelector('.be-hint');
    if (hint) hint.hidden = stepsLeft(c) <= 0;
    if (card.beEvolve) card.beEvolve(n);
  }

  function updateChrome() {
    if (reviewMode) {
      backBtn.hidden = true;
      keys.hidden = true;
      nextBtn.disabled = !reviewCard || gated(reviewCard);
      nextBtn.textContent = session.pos >= session.queue.length - 1 ? 'Finish' : 'Next';
      for (var r = 0; r < segs.length; r++) {
        segs[r].classList.toggle('is-seen', r < session.pos);
        segs[r].classList.toggle('is-now', r === session.pos);
      }
      count.textContent = (session.pos + 1) + ' / ' + session.queue.length;
      note.hidden = storageOk;
      return;
    }
    var c = cards[i];
    var last = i === cards.length - 1;
    backBtn.disabled = i === 0;
    nextBtn.hidden = last;
    keys.hidden = last;
    nextBtn.disabled = stepsLeft(c) <= 0 && gated(c);
    nextBtn.textContent = i === 0 ? 'Start' : 'Continue';
    for (var k = 0; k < segs.length; k++) {
      segs[k].classList.toggle('is-seen', k < i);
      segs[k].classList.toggle('is-now', k === i);
    }
    count.textContent = (i + 1) + ' / ' + cards.length;
    note.hidden = storageOk;
  }

  function announce(text) {
    live.textContent = '';
    window.setTimeout(function () { live.textContent = text; }, 50);
  }

  /* Store an answer. Answers are final for the visit. */
  function record(c, ans) {
    if (reviewMode) { reviewRecord(c, ans); return; }
    ans.t = now();
    me.answers[c.id] = ans;
    save();
    var p = { card_id: c.id, card_type: c.type };
    if (typeof ans.ok === 'boolean') p.correct = ans.ok;
    if (ans.skipped) p.skipped = true;
    track('answer', p);
    updateChrome();
  }

  /* ---------- shared card parts ---------- */
  function addArt(c, card) {
    if (!c.art) return;
    var art = h('div', 'be-art', c.art);
    var svg = art.querySelector('svg');
    if (svg) {
      if (c.alt) {
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', c.alt);
      } else {
        svg.setAttribute('aria-hidden', 'true');
      }
    }
    card.appendChild(art);
  }
  function addBody(c, card) {
    (c.body || []).forEach(function (b) {
      var p = h('p', 'be-p', fmt(typeof b === 'string' ? b : b.text));
      if (typeof b !== 'string' && b.step) p.setAttribute('data-step', b.step);
      card.appendChild(p);
    });
  }
  function addHead(card, tag, text, level) {
    if (tag) card.appendChild(h('p', 'be-tag', esc(tag)));
    var head = h(level || 'h2', '', fmt(text));
    head.setAttribute('data-head', '');
    card.appendChild(head);
  }
  function mark(el, cls, word) {
    el.classList.add(cls);
    el.insertBefore(h('span', 'be-mark', esc(word)), el.firstChild);
  }
  /* One feedback box per card, replaced on each check. */
  function feedback(card, parts) {
    var old = card.querySelector('.be-feedback');
    if (old) old.parentNode.removeChild(old);
    var fb = h('div', 'be-feedback');
    parts.forEach(function (html) { if (html) fb.appendChild(h('p', '', html)); });
    if (reviewMode && reviewAnswered) {
      var again = h('a', 'be-link', 'Open the lesson this comes from');
      again.href = selfName + '?back=' + encodeURIComponent(window.location.pathname + '?review=1');
      var line = h('p');
      line.appendChild(again);
      fb.appendChild(line);
    }
    (card.querySelector('.be-main') || card).appendChild(fb);
    /* Feedback can land below the fold on a phone: bring it into view. */
    if (fb.scrollIntoView && card.parentNode) fb.scrollIntoView({ block: 'nearest' });
    return fb;
  }
  function verdict(ok) { return '<strong>' + (ok ? 'Correct.' : 'Not quite.') + '</strong> '; }

  var BUILD = {};

  /* ---------- presenting cards ---------- */
  BUILD.cover = function (c, card) {
    if (c.eyebrow) card.appendChild(h('p', 'be-eyebrow', esc(c.eyebrow)));
    addHead(card, null, c.title, 'h1');
    addArt(c, card);
    if (c.lead) card.appendChild(h('p', 'be-lead', fmt(c.lead)));
  };

  BUILD.concept = BUILD['case'] = function (c, card) {
    addHead(card, TAG[c.type], c.title);
    addArt(c, card);
    addBody(c, card);
    if (c.steps) card.appendChild(h('p', 'be-hint', 'Tap to continue'));
  };

  /* A scene is an isometric SVG, built in steps like any other art. The
     `model` field is reserved for a true 3D scene in a later engine version;
     today a card without art shows its `fallback` image. */
  BUILD.scene = function (c, card) {
    addHead(card, TAG.scene, c.title);
    if (c.art) {
      addArt(c, card);
    } else if (c.fallback) {
      var box = h('div', 'be-art');
      var img = h('img');
      img.src = c.fallback;
      img.alt = c.alt || '';
      box.appendChild(img);
      card.appendChild(box);
    }
    addBody(c, card);
    if (c.steps) card.appendChild(h('p', 'be-hint', 'Tap to continue'));
  };

  /* A short scene. Optional in a lesson, never required to continue, and
     nothing loads until the learner taps the poster. `host` is "youtube" (the
     sources are YouTube video ids), "file" (the sources are video URLs,
     played here with a captions track) or "drive" (Google Drive file ids in
     Drive's own player: a stopgap). The transcript is always available. */
  BUILD.video = function (c, card) {
    var wide = !!(window.matchMedia && window.matchMedia('(min-width: 900px)').matches);
    var shape = wide ? 'landscape' : 'portrait';
    addHead(card, TAG.video, c.title);
    var box = h('div', 'be-art be-video is-' + shape);
    var poster = btn('be-poster');
    poster.setAttribute('aria-label', 'Play the video, ' + c.seconds + ' seconds');
    var still = h('img');
    still.src = c.poster[shape];
    still.alt = '';
    poster.appendChild(still);
    poster.appendChild(h('span', 'be-play', '&#9654;'));
    box.appendChild(poster);
    card.appendChild(box);
    if (c.lead) card.appendChild(h('p', 'be-lead', fmt(c.lead)));
    var script = h('details', 'be-transcript');
    script.appendChild(h('summary', '', 'Read the transcript'));
    script.appendChild(h('p', 'be-p', fmt(c.transcript)));
    card.appendChild(script);

    function fail() {
      script.open = true;
      box.hidden = true;
      announce('The video could not be played. The transcript is shown instead.');
    }
    poster.addEventListener('click', function () {
      if (window.navigator && window.navigator.onLine === false) { fail(); return; }
      track('video_play', { card_id: c.id, shape: shape, host: c.host });
      box.removeChild(poster);
      if (c.host === 'youtube' || c.host === 'drive') {
        var frame = h('iframe');
        frame.title = plain(c.title);
        frame.setAttribute('allowfullscreen', '');
        if (c.host === 'drive') {
          /* Drive's player is landscape on phones whatever the clip's shape:
             a stopgap only. Prefer youtube or file. */
          frame.src = 'https://drive.google.com/file/d/' + encodeURIComponent(c.sources[shape]) + '/preview';
          frame.setAttribute('allow', 'autoplay; fullscreen');
          box.appendChild(frame);
          return;
        }
        /* YouTube's player fills the frame it is given, so a vertical clip
           fills the portrait frame. The no-cookie domain sets nothing until
           the learner plays. No YouTube script is loaded: the end of playback
           is read from the player's own messages. */
        var YT = 'https://www.youtube-nocookie.com';
        var query = 'autoplay=1&playsinline=1&rel=0&modestbranding=1&cc_load_policy=1&enablejsapi=1';
        if (/^https?:$/.test(window.location.protocol)) {
          query += '&origin=' + encodeURIComponent(window.location.origin);
        }
        frame.src = YT + '/embed/' + encodeURIComponent(c.sources[shape]) + '?' + query;
        frame.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
        var ended = false;
        frame.addEventListener('load', function () {
          try {
            frame.contentWindow.postMessage(JSON.stringify({ event: 'listening', id: c.id, channel: 'widget' }), YT);
          } catch (e) {}
        });
        window.addEventListener('message', function (e) {
          if (ended || e.origin !== YT || e.source !== frame.contentWindow) return;
          var data = null;
          try { data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data; } catch (err) { return; }
          if (!data) return;
          var state = data.event === 'onStateChange' ? data.info
            : (data.event === 'infoDelivery' && data.info ? data.info.playerState : null);
          if (state === 0) {
            ended = true;
            track('video_complete', { card_id: c.id });
          }
        });
        box.appendChild(frame);
        return;
      }
      var v = h('video');
      v.controls = true;
      v.setAttribute('playsinline', '');
      v.poster = c.poster[shape];
      if (c.captions && c.captions !== 'burned-in') {
        var tr = h('track');
        tr.kind = 'captions';
        tr.src = c.captions;
        tr.srclang = 'en';
        tr.label = 'English';
        tr.default = true;
        v.appendChild(tr);
      }
      v.addEventListener('error', fail);
      v.addEventListener('ended', function () { track('video_complete', { card_id: c.id }); });
      v.src = c.sources[shape];
      box.appendChild(v);
      var playing = v.play();
      if (playing && playing.catch) playing.catch(function () {});
    });
  };

  /* Two or three characters talking. Each line is a speech bubble on its
     speaker's side, shown one per tap. A cast member's avatar is a small SVG
     (`art`) or, failing that, the first letter of the name. */
  BUILD.dialogue = function (c, card) {
    addHead(card, TAG.dialogue, c.title);
    var cast = {};
    (c.cast || []).forEach(function (m, k) {
      cast[m.id] = { name: m.name, art: m.art, side: m.side || (k % 2 ? 'right' : 'left'), tone: k % 3 };
    });
    var box = h('div', 'be-talk');
    (c.lines || []).forEach(function (ln, k) {
      var who = cast[ln.who] || { name: ln.who, side: 'left', tone: 0 };
      var row = h('div', 'be-line is-' + who.side + ' is-tone' + who.tone);
      row.setAttribute('data-step', k + 1);
      var face = h('span', 'be-face', who.art || esc(String(who.name).charAt(0)));
      face.setAttribute('aria-hidden', 'true');
      var bubble = h('div', 'be-bubble');
      bubble.appendChild(h('span', 'be-who', esc(who.name)));
      bubble.appendChild(h('span', 'be-said', fmt(ln.text)));
      row.appendChild(face);
      row.appendChild(bubble);
      box.appendChild(row);
    });
    card.appendChild(box);
    addBody(c, card);
    card.appendChild(h('p', 'be-hint', 'Tap to continue'));
  };

  /* Dated events on a vertical line, shown one per tap. */
  BUILD.timeline = function (c, card) {
    addHead(card, TAG.timeline, c.title);
    var list = h('ol', 'be-time');
    (c.events || []).forEach(function (ev, k) {
      var li = h('li', 'be-event');
      li.setAttribute('data-step', k + 1);
      li.appendChild(h('span', 'be-when', esc(ev.when)));
      li.appendChild(h('span', 'be-what', fmt(ev.label)));
      if (ev.detail) li.appendChild(h('span', 'be-detail', fmt(ev.detail)));
      list.appendChild(li);
    });
    card.appendChild(list);
    addBody(c, card);
    card.appendChild(h('p', 'be-hint', 'Tap to continue'));
  };

  /* ---------- evolve: one diagram that changes with each tap ----------
     Each stage is a short text and an optional static SVG; every stage
     shares one viewBox. The engine animates between neighbouring stages:
     a top-level shape with the same data-k in both moves and scales into
     its new place; data-into="k" on a leaving shape shrinks it into the
     next stage's k; data-from="k" on an arriving shape grows it out of the
     previous stage's k; data-draw draws an arriving line; anything else
     fades. A stage without art is a text-only beat. Optional narration per
     stage plays only after the learner turns sound on. */
  var SVGNS = 'http://www.w3.org/2000/svg';
  var SOUND_KEY = 'books.v1.sound';
  var evoAudio = null;
  function stopEvoAudio() {
    if (evoAudio) { try { evoAudio.pause(); } catch (e) {} evoAudio = null; }
  }
  function reducedMotion() {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; }
  }
  function evoParse(html) {
    if (!html) return null;
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    var svg = tmp.querySelector('svg');
    if (!svg) return null;
    Array.prototype.slice.call(svg.childNodes).forEach(function (n) {
      if (n.nodeType !== 1) return;
      var tag = n.tagName.toLowerCase();
      if (tag === 'defs' || tag === 'style' || tag === 'title' || tag === 'desc') return;
      var w = document.createElementNS(SVGNS, 'g');
      w.setAttribute('class', 'be-evo-w');
      ['data-k', 'data-from', 'data-into', 'data-draw'].forEach(function (a) {
        if (n.hasAttribute(a)) { w.setAttribute(a, n.getAttribute(a)); n.removeAttribute(a); }
      });
      svg.insertBefore(w, n);
      w.appendChild(n);
    });
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    return svg;
  }
  function evoParts(svg) {
    var out = { list: [], keys: {}, rects: [] };
    if (!svg) return out;
    for (var k = 0; k < svg.childNodes.length; k++) {
      var w = svg.childNodes[k];
      if (w.nodeType !== 1 || !w.classList.contains('be-evo-w')) continue;
      out.list.push(w);
      out.rects.push(w.getBoundingClientRect());
      if (w.getAttribute('data-k')) out.keys[w.getAttribute('data-k')] = out.list.length - 1;
    }
    return out;
  }
  function evoMid(r) { return [r.left + r.width / 2, r.top + r.height / 2]; }
  function evoMorph(prev, next) {
    var EASE = 'cubic-bezier(.65, 0, .25, 1)';
    /* A quick second tap can land mid-morph: settle every running animation
       first, so measurements are of where things really are. */
    [prev, next].forEach(function (svg) {
      if (svg && svg.getAnimations) svg.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
    });
    var P = evoParts(prev), N = evoParts(next);   /* measure everything before moving anything */
    var ctm = next ? next.getScreenCTM() : (prev ? prev.getScreenCTM() : null);
    var u = ctm && ctm.a ? ctm.a : 1;             /* screen pixels per SVG unit */
    var animate = function (el, frames, opts) { if (el.animate) el.animate(frames, opts); };
    N.list.forEach(function (w, k) {
      var r = N.rects[k], key = w.getAttribute('data-k'), from = w.getAttribute('data-from');
      if (key && P.keys[key] !== undefined && r.width && r.height) {
        var o = P.rects[P.keys[key]];
        w.style.transformBox = 'fill-box';
        w.style.transformOrigin = '0 0';
        animate(w, [{ transform: 'translate(' + (o.left - r.left) / u + 'px,' + (o.top - r.top) / u + 'px) scale(' +
          (o.width / r.width) + ',' + (o.height / r.height) + ')' }, { transform: 'none' }],
          { duration: 750, easing: EASE, fill: 'backwards' });
      } else if (from && P.keys[from] !== undefined) {
        var f = evoMid(P.rects[P.keys[from]]), m = evoMid(r);
        w.style.transformBox = 'fill-box';
        w.style.transformOrigin = 'center';
        animate(w, [{ transform: 'translate(' + (f[0] - m[0]) / u + 'px,' + (f[1] - m[1]) / u + 'px) scale(.2)', opacity: 0 },
          { transform: 'none', opacity: 1 }], { duration: 650, delay: 250, easing: EASE, fill: 'backwards' });
      } else if (w.hasAttribute('data-draw')) {
        Array.prototype.forEach.call(w.querySelectorAll('path, line, polyline'), function (g) {
          var len = g.getTotalLength ? g.getTotalLength() : 0;
          if (!len) return;
          g.style.strokeDasharray = len + ' ' + len;
          animate(g, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 700, delay: 350, easing: EASE, fill: 'backwards' });
        });
      } else {
        animate(w, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
          { duration: 500, delay: 250, easing: EASE, fill: 'backwards' });
      }
    });
    if (!prev) return;
    prev.classList.add('is-leaving');
    P.list.forEach(function (w, k) {
      var key = w.getAttribute('data-k'), into = w.getAttribute('data-into');
      if (key && N.keys[key] !== undefined) { w.style.opacity = '0'; return; }
      if (into && N.keys[into] !== undefined) {
        var t = evoMid(N.rects[N.keys[into]]), m = evoMid(P.rects[k]);
        w.style.transformBox = 'fill-box';
        w.style.transformOrigin = 'center';
        animate(w, [{ transform: 'none', opacity: 1 },
          { transform: 'translate(' + (t[0] - m[0]) / u + 'px,' + (t[1] - m[1]) / u + 'px) scale(.2)', opacity: 0 }],
          { duration: 600, easing: EASE, fill: 'forwards' });
      } else {
        animate(w, [{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
      }
    });
    window.setTimeout(function () { if (prev.parentNode) prev.parentNode.removeChild(prev); }, 800);
  }
  BUILD.evolve = function (c, card) {
    var stages = c.stages || [];
    addHead(card, TAG.evolve, c.title);
    var box = h('div', 'be-art be-evo');
    if (c.alt) { box.setAttribute('role', 'img'); box.setAttribute('aria-label', c.alt); }
    if (c.label) box.appendChild(h('p', 'be-evo-label', esc(c.label)));
    card.appendChild(box);
    var texts = h('div', 'be-evo-text');
    texts.setAttribute('aria-live', 'polite');
    var paras = stages.map(function (st) {
      var p = h('p', 'be-lead', fmt(st.text || ''));
      texts.appendChild(p);
      return p;
    });
    card.appendChild(texts);
    var hasAudio = stages.some(function (st) { return !!st.audio; });
    var soundOn = false;
    if (hasAudio) {
      try { soundOn = window.localStorage.getItem(SOUND_KEY) === '1'; } catch (e) {}
      var btn = h('button', 'be-sound');
      btn.type = 'button';
      var paint = function () {
        btn.textContent = soundOn ? 'Narration on' : 'Narration off';
        btn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
      };
      paint();
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        soundOn = !soundOn;
        try { window.localStorage.setItem(SOUND_KEY, soundOn ? '1' : '0'); } catch (err) {}
        paint();
        if (soundOn) speak(cur); else stopEvoAudio();
      });
      card.appendChild(btn);
    }
    card.appendChild(h('p', 'be-hint', 'Tap to continue'));
    var cur = -1;
    function speak(n) {
      stopEvoAudio();
      var src = stages[n] && stages[n].audio;
      if (!soundOn || !src) return;
      try {
        evoAudio = new Audio(src);
        var played = evoAudio.play();
        if (played && played.catch) played.catch(function () {});
      } catch (e) {}
    }
    card.beEvolve = function (n) {
      n = Math.max(0, Math.min(stages.length - 1, n));
      if (n === cur) return;
      var animated = cur >= 0 && !reducedMotion();
      cur = n;
      paras.forEach(function (p, k) { p.classList.toggle('is-on', k === n); });
      var prev = null;
      for (var k = box.childNodes.length - 1; k >= 0; k--) {
        var el = box.childNodes[k];
        if (el.tagName && el.tagName.toLowerCase() === 'svg' && !el.classList.contains('is-leaving')) { prev = el; break; }
      }
      var next = evoParse(stages[n].art);
      if (!next) {
        /* A text-only beat: hide the panel but keep the last picture, so
           the next stage with art grows out of it. */
        box.classList.add('is-empty');
      } else {
        box.classList.remove('is-empty');
        box.appendChild(next);
        if (animated) evoMorph(prev, next);
        else if (prev && prev.parentNode) prev.parentNode.removeChild(prev);
      }
      if (n > 0) track('evolve_stage', { card_id: c.id, stage: n + 1 });
      speak(n);
    };
  };

  /* ==========================================================================
     Interactive cards (24 Nov 2026): explorable, estimate, simulate, label,
     spot. Lessons stay data-only: curves are maths expressions parsed here
     (numbers, x, slider ids, + - * / ^, parentheses, a few functions), and
     simulations are built-in models. Nothing in a lesson is ever run as code.
     ========================================================================== */
  var MATH_FN = {
    sin: Math.sin, cos: Math.cos, tan: Math.tan, exp: Math.exp, ln: Math.log, log: Math.log10 || function (v) { return Math.log(v) / Math.LN10; },
    sqrt: Math.sqrt, abs: Math.abs, floor: Math.floor, round: Math.round, min: Math.min, max: Math.max, pow: Math.pow
  };
  var MATH_CONST = { pi: Math.PI, e: Math.E };
  /* Compile an expression to a function of an environment object, or throw. */
  function compileExpr(src) {
    var toks = [], re = /\s*(\d+\.?\d*(?:e[+-]?\d+)?|\.\d+|[A-Za-z_][A-Za-z_0-9]*|[-+*\/^(),])/gy, m, pos = 0;
    src = String(src);
    while (pos < src.length) {
      re.lastIndex = pos;
      m = re.exec(src);
      if (!m) { if (/^\s*$/.test(src.slice(pos))) break; throw new Error('bad expression: ' + src); }
      toks.push(m[1]);
      pos = re.lastIndex;
    }
    var i = 0;
    function peek() { return toks[i]; }
    function take(t) { if (toks[i] !== t) throw new Error('expected ' + t + ' in ' + src); i++; }
    function expr() {
      var a = term();
      while (peek() === '+' || peek() === '-') {
        var op = toks[i++], b = term(), l = a;
        a = op === '+' ? (function (l, b) { return function (v) { return l(v) + b(v); }; })(l, b)
                       : (function (l, b) { return function (v) { return l(v) - b(v); }; })(l, b);
      }
      return a;
    }
    function term() {
      var a = unary();
      while (peek() === '*' || peek() === '/') {
        var op = toks[i++], b = unary(), l = a;
        a = op === '*' ? (function (l, b) { return function (v) { return l(v) * b(v); }; })(l, b)
                       : (function (l, b) { return function (v) { return l(v) / b(v); }; })(l, b);
      }
      return a;
    }
    function unary() {
      if (peek() === '-') { i++; var u = unary(); return function (v) { return -u(v); }; }
      if (peek() === '+') { i++; return unary(); }
      return power();
    }
    function power() {
      var base = primary();
      if (peek() === '^') { i++; var ex = unary(); return function (v) { return Math.pow(base(v), ex(v)); }; }
      return base;
    }
    function primary() {
      var t = toks[i++];
      if (t === undefined) throw new Error('unexpected end in ' + src);
      if (t === '(') { var e = expr(); take(')'); return e; }
      if (/^[\d.]/.test(t)) { var n = parseFloat(t); return function () { return n; }; }
      if (/^[A-Za-z_]/.test(t)) {
        if (peek() === '(' && MATH_FN[t]) {
          i++;
          var args = [expr()];
          while (peek() === ',') { i++; args.push(expr()); }
          take(')');
          var fn = MATH_FN[t];
          return function (v) { return fn.apply(null, args.map(function (a) { return a(v); })); };
        }
        if (MATH_CONST[t] !== undefined) { var c = MATH_CONST[t]; return function () { return c; }; }
        return function (v) { return v[t]; };
      }
      throw new Error('unexpected ' + t + ' in ' + src);
    }
    var out = expr();
    if (i < toks.length) throw new Error('unexpected ' + toks[i] + ' in ' + src);
    return out;
  }
  function numFmt(v, digits) {
    if (!isFinite(v)) return '-';
    var d = digits == null ? 2 : digits;
    return Number(v).toLocaleString('en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  /* A chart: axes in a 320 x 200 box, with scale helpers. */
  var CW = 320, CH = 200, PAD = { l: 34, r: 12, t: 12, b: 26 };
  function chart(xr, yr, xLabel, yLabel, noXTick) {
    var sx = function (x) { return PAD.l + (x - xr[0]) / (xr[1] - xr[0]) * (CW - PAD.l - PAD.r); };
    var sy = function (y) { return CH - PAD.b - (y - yr[0]) / (yr[1] - yr[0]) * (CH - PAD.t - PAD.b); };
    var svg = '<svg viewBox="0 0 ' + CW + ' ' + CH + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<line x1="' + PAD.l + '" y1="' + (CH - PAD.b) + '" x2="' + (CW - PAD.r) + '" y2="' + (CH - PAD.b) + '" class="be-ax"/>' +
      '<line x1="' + PAD.l + '" y1="' + PAD.t + '" x2="' + PAD.l + '" y2="' + (CH - PAD.b) + '" class="be-ax"/>' +
      '<text x="' + (CW - PAD.r) + '" y="' + (CH - 6) + '" text-anchor="end" class="be-axt">' + esc(xLabel || '') + '</text>' +
      '<text x="' + (PAD.l + 6) + '" y="' + (PAD.t + 9) + '" class="be-axt">' + esc(yLabel || '') + '</text>' +
      (noXTick ? '' : '<text x="' + PAD.l + '" y="' + (CH - 8) + '" text-anchor="middle" class="be-axt">' + esc(String(+xr[0].toFixed(3))) + '</text>') +
      '<text x="' + (PAD.l - 4) + '" y="' + (CH - PAD.b) + '" text-anchor="end" class="be-axt">' + esc(String(+yr[0].toFixed(3))) + '</text>' +
      '<text x="' + (PAD.l - 4) + '" y="' + (PAD.t + 10) + '" text-anchor="end" class="be-axt">' + esc(String(+yr[1].toFixed(3))) + '</text>';
    return { sx: sx, sy: sy, head: svg, clamp: function (y) { return Math.max(yr[0] - (yr[1] - yr[0]) * 0.05, Math.min(yr[1] + (yr[1] - yr[0]) * 0.05, y)); } };
  }
  function pathOf(pts) {
    return pts.map(function (p, k) { return (k ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
  }

  /* ---------- explorable: drag a slider, watch the picture and the numbers ---------- */
  function exploreEnv(c, val) {
    var P = c.plot, env = {}, f = c._f;
    env[c.slider.id] = val;
    var at = function (x) { env.x = x; return f(env); };
    var x0 = P.x[0], x1 = P.x[1];
    if (P.view === 'riemann') {
      var n = Math.max(1, Math.round(val)), dx = (x1 - x0) / n, s = 0, k;
      for (k = 0; k < n; k++) s += at(x0 + k * dx) * dx;
      var N = 600, h = (x1 - x0) / N, ex = at(x0) + at(x1);
      for (k = 1; k < N; k++) ex += at(x0 + k * h) * (k % 2 ? 4 : 2);
      ex *= h / 3;
      env.n = n; env.dx = dx; env.area = s; env.exact = ex; env.error = Math.abs(s - ex) / Math.abs(ex) * 100;
    } else if (P.view === 'secant') {
      var a = P.at, hh = val;
      env.h = hh;
      env.slope = (at(a + hh) - at(a)) / hh;
      env.exact = (at(a + 1e-6) - at(a - 1e-6)) / 2e-6;
      env.error = Math.abs(env.slope - env.exact);
    } else {
      env.end = at(x1);
      env.start = at(x0);
    }
    env[c.slider.id] = val;
    return env;
  }
  function exploreSvg(c, val, env) {
    var P = c.plot, ch = chart(P.x, P.y, P.xLabel, P.yLabel), f = c._f, e2 = {}, k, pts = [];
    e2[c.slider.id] = val;
    var at = function (x) { e2.x = x; return f(e2); };
    var out = ch.head;
    if (P.view === 'riemann') {
      var n = env.n, dx = env.dx;
      for (k = 0; k < n; k++) {
        var xl = P.x[0] + k * dx, y = at(xl);
        out += '<rect x="' + ch.sx(xl).toFixed(1) + '" y="' + ch.sy(Math.max(0, y)).toFixed(1) + '" width="' + Math.max(0.6, ch.sx(xl + dx) - ch.sx(xl)).toFixed(1) +
          '" height="' + Math.abs(ch.sy(0) - ch.sy(y)).toFixed(1) + '" class="be-strip"' + (n > 40 ? ' style="stroke-width:0"' : '') + '/>';
      }
    }
    for (k = 0; k <= 160; k++) { var x = P.x[0] + (P.x[1] - P.x[0]) * k / 160; pts.push([ch.sx(x), ch.sy(ch.clamp(at(x)))]); }
    out += '<path d="' + pathOf(pts) + '" class="be-curve"/>';
    if (P.view === 'secant') {
      var a = P.at, b = a + env.h, ya = at(a), yb = at(b), m = env.slope;
      var xa = P.x[0], xb = P.x[1];
      out += '<line x1="' + ch.sx(xa).toFixed(1) + '" y1="' + ch.sy(ch.clamp(ya + m * (xa - a))).toFixed(1) + '" x2="' + ch.sx(xb).toFixed(1) + '" y2="' + ch.sy(ch.clamp(ya + m * (xb - a))).toFixed(1) + '" class="be-secant"/>';
      out += '<line x1="' + ch.sx(a).toFixed(1) + '" y1="' + ch.sy(ya).toFixed(1) + '" x2="' + ch.sx(b).toFixed(1) + '" y2="' + ch.sy(ya).toFixed(1) + '" class="be-run"/>';
      out += '<line x1="' + ch.sx(b).toFixed(1) + '" y1="' + ch.sy(ya).toFixed(1) + '" x2="' + ch.sx(b).toFixed(1) + '" y2="' + ch.sy(yb).toFixed(1) + '" class="be-rise"/>';
      out += '<circle cx="' + ch.sx(a).toFixed(1) + '" cy="' + ch.sy(ya).toFixed(1) + '" r="3.5" class="be-pt"/><circle cx="' + ch.sx(b).toFixed(1) + '" cy="' + ch.sy(yb).toFixed(1) + '" r="3" class="be-pt"/>';
    }
    if (P.view === 'curve') {
      /* mark: "slider" puts the point at x = the slider's value (a curve
         you read off, like chance against group size); otherwise the end. */
      var mx = P.mark === 'slider' ? val : P.x[1];
      out += '<circle cx="' + ch.sx(mx).toFixed(1) + '" cy="' + ch.sy(ch.clamp(at(mx))).toFixed(1) + '" r="4" class="be-pt"/>';
      if (P.mark === 'slider') out += '<line x1="' + ch.sx(mx).toFixed(1) + '" y1="' + ch.sy(P.y[0]).toFixed(1) + '" x2="' + ch.sx(mx).toFixed(1) + '" y2="' + ch.sy(ch.clamp(at(mx))).toFixed(1) + '" class="be-run"/>';
    }
    return out + '</svg>';
  }
  function goalMet(c, env) {
    var g = c.goal, r = c.readouts[g.readout], v = r._e(env);
    if (g.op === 'below') return v < g.value;
    if (g.op === 'above') return v > g.value;
    return Math.abs(v - g.value) <= (g.within || 0);
  }
  BUILD.explorable = function (c, card) {
    addHead(card, TAG.explorable, c.title);
    try {
      c._f = c._f || compileExpr(c.plot.f);
      (c.readouts || []).forEach(function (r) { r._e = r._e || compileExpr(r.expr); });
    } catch (e) {
      card.appendChild(h('p', 'be-error', 'This interactive could not be loaded.'));
      return;
    }
    var S = c.slider;
    var art = h('div', 'be-art be-explore');
    card.appendChild(art);
    (c.body || []).forEach(function (b) { card.appendChild(h('p', 'be-p', fmt(typeof b === 'string' ? b : b.text))); });
    var wrap = h('label', 'be-slider');
    var name = h('span', 'be-slider-name');
    var input = document.createElement('input');
    input.type = 'range';
    input.min = S.min; input.max = S.max; input.step = S.step || 1;
    input.value = me.answers[c.id] && me.answers[c.id].v != null ? me.answers[c.id].v : S.value;
    wrap.appendChild(name);
    wrap.appendChild(input);
    card.appendChild(wrap);
    var reads = h('div', 'be-readouts');
    reads.setAttribute('aria-live', 'polite');
    card.appendChild(reads);
    var hit = false;
    function paint() {
      var v = parseFloat(input.value), env = exploreEnv(c, v);
      art.innerHTML = exploreSvg(c, v, env);
      name.innerHTML = fmt(S.label) + ': <strong>' + esc(numFmt(v, S.digits == null ? (S.step && S.step < 1 ? 2 : 0) : S.digits)) + (S.unit ? ' ' + esc(S.unit) : '') + '</strong>';
      reads.innerHTML = (c.readouts || []).map(function (r) {
        return '<span class="be-read"><span>' + fmt(r.label) + '</span><strong>' + esc(numFmt(r._e(env), r.digits)) + (r.unit ? ' ' + esc(r.unit) : '') + '</strong></span>';
      }).join('');
      if (c.goal && !hit && goalMet(c, env)) {
        hit = true;
        if (!me.answers[c.id]) record(c, { ok: true, v: v });
        feedback(card, ['<strong>' + fmt(c.goal.text || 'Goal reached.') + '</strong> ' + fmt(c.why || '')]);
        announce(plain(c.goal.text || 'Goal reached.'));
      }
    }
    input.addEventListener('input', paint);
    if (c.goal) card.appendChild(h('p', 'be-how', fmt(c.goal.prompt || 'Move the slider to reach the goal.')));
    paint();
    if (me.answers[c.id] && !hit) { hit = true; feedback(card, ['<strong>' + fmt(c.goal ? c.goal.text || 'Goal reached.' : '') + '</strong> ' + fmt(c.why || '')]); }
    if (!c.goal && c.why) card.appendChild(h('p', 'be-p', fmt(c.why)));
  };

  /* ---------- estimate: type a number, credit within a tolerance ---------- */
  function showEstimate(c, card, ans, speak) {
    var ok = ans.ok;
    var parts = [verdict(ok) + 'Your estimate: <strong>' + esc(numFmt(ans.v, c.digits == null ? 0 : c.digits)) + '</strong>. ' +
      'The answer: <strong>' + esc(numFmt(c.answer, c.digits == null ? 0 : c.digits)) + (c.unit ? ' ' + esc(c.unit) : '') + '</strong>' +
      (ok ? '.' : ', and anything within ' + esc(numFmt(c.tolerance, c.digits == null ? 0 : c.digits)) + ' counts.'), fmt(c.why || '')];
    feedback(card, parts);
    if (speak) announce((ok ? 'Correct. ' : 'Not quite. ') + 'The answer is ' + c.answer + '.');
  }
  BUILD.estimate = function (c, card) {
    addHead(card, TAG.estimate, c.prompt);
    addArt(c, card);
    var row = h('div', 'be-est');
    var input = document.createElement('input');
    input.type = 'text';
    input.inputMode = 'decimal';
    input.className = 'be-text be-num';
    input.setAttribute('aria-label', 'Your estimate');
    input.placeholder = 'Your estimate';
    row.appendChild(input);
    if (c.unit) row.appendChild(h('span', 'be-unit', esc(c.unit)));
    card.appendChild(row);
    var check = btn('be-btn be-check', 'Check');
    check.disabled = true;
    card.appendChild(check);
    function value() { var t = input.value.replace(/[,\s]/g, ''); return t === '' ? NaN : parseFloat(t); }
    if (me.answers[c.id]) {
      input.value = me.answers[c.id].v; input.disabled = true; check.hidden = true;
      showEstimate(c, card, me.answers[c.id], false);
      return;
    }
    input.addEventListener('input', function () { check.disabled = !isFinite(value()); });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !check.disabled) { e.preventDefault(); check.click(); } });
    check.addEventListener('click', function () {
      var v = value();
      if (!isFinite(v) || me.answers[c.id]) return;
      input.disabled = true; check.hidden = true;
      record(c, { v: v, ok: Math.abs(v - c.answer) <= c.tolerance });
      showEstimate(c, card, me.answers[c.id], true);
    });
  };

  /* ---------- simulate: run a built-in model many times ---------- */
  var SIM = {
    coins: {
      init: function (p) { return { n: 0, heads: 0, trace: [] }; },
      step: function (s, p) { s.n++; if (Math.random() < (p.p == null ? 0.5 : p.p)) s.heads++; if (s.n <= 50 || s.n % Math.ceil(s.n / 200) === 0) s.trace.push([s.n, s.heads / s.n]); },
      cap: 10000,
      unit: 'flips',
      draw: function (s, p) {
        var ch = chart([0, Math.max(10, s.n)], [0, 1], p.unit || 'flips', p.label || 'share of heads'), target = p.p == null ? 0.5 : p.p;
        var out = ch.head + '<line x1="' + PAD.l + '" y1="' + ch.sy(target).toFixed(1) + '" x2="' + (CW - PAD.r) + '" y2="' + ch.sy(target).toFixed(1) + '" class="be-target"/>';
        if (s.trace.length) out += '<path d="' + pathOf(s.trace.map(function (t) { return [ch.sx(t[0]), ch.sy(t[1])]; })) + '" class="be-curve"/>';
        return out + '</svg>';
      },
      reads: function (s, p) {
        s.unitName = p.unit ? p.unit.charAt(0).toUpperCase() + p.unit.slice(1) : null;
        s.winName = p.win || null;
        s.labelName = p.label ? p.label.charAt(0).toUpperCase() + p.label.slice(1) : null;
        var u = s.unitName || 'Flips', l = s.labelName || 'Share of heads';
        return [[u, numFmt(s.n, 0)], [s.winName || 'Heads', numFmt(s.heads, 0)], [l, s.n ? numFmt(s.heads / s.n * 100, 1) + '%' : '-']];
      }
    },
    dice: {
      init: function (p) { var d = p.dice || 2, f = p.sides || 6, c = []; for (var k = 0; k <= d * f; k++) c.push(0); return { n: 0, counts: c }; },
      step: function (s, p) { var d = p.dice || 2, f = p.sides || 6, t = 0; for (var k = 0; k < d; k++) t += 1 + Math.floor(Math.random() * f); s.counts[t]++; s.n++; },
      cap: 20000,
      unit: 'rolls',
      draw: function (s, p) {
        var d = p.dice || 2, f = p.sides || 6, max = Math.max.apply(null, s.counts) || 1;
        var ch = chart([d - 0.5, d * f + 0.5], [0, max], 'total', 'times', true), out = ch.head, w = ch.sx(1) - ch.sx(0);
        for (var t = d; t <= d * f; t++) {
          out += '<rect x="' + (ch.sx(t) - w * 0.4).toFixed(1) + '" y="' + ch.sy(s.counts[t]).toFixed(1) + '" width="' + (w * 0.8).toFixed(1) + '" height="' + (ch.sy(0) - ch.sy(s.counts[t])).toFixed(1) + '" class="be-bar"/>';
          if (d * f - d <= 16) out += '<text x="' + ch.sx(t).toFixed(1) + '" y="' + (CH - 14) + '" text-anchor="middle" class="be-axt">' + t + '</text>';
        }
        return out + '</svg>';
      },
      reads: function (s, p) {
        var best = -1, bi = 0;
        s.counts.forEach(function (v, k) { if (v > best) { best = v; bi = k; } });
        return [['Rolls', numFmt(s.n, 0)], ['Most common total', s.n ? String(bi) : '-']];
      }
    },
    /* bets: a bettor's running profit, one unit staked per bet. p is the
       chance each bet wins, odds the fractional pay-out (1 = evens, 7/5 =
       1.4). "New season" keeps the last four seasons faint. */
    bets: {
      init: function (p, old) { var lines = old && old.n ? old.lines.concat([old.line]).slice(-4) : (old ? old.lines : []); return { n: 0, won: 0, profit: 0, line: [[0, 0]], lines: lines }; },
      step: function (s, p) {
        var o = p.odds == null ? 1 : p.odds;
        s.n++;
        if (Math.random() < (p.p == null ? 0.5 : p.p)) { s.won++; s.profit += o; } else s.profit -= 1;
        if (s.n <= 100 || s.n % Math.ceil(s.n / 300) === 0) s.line.push([s.n, s.profit]);
      },
      cap: 10000,
      unit: 'bets',
      draw: function (s, p) {
        var all = s.lines.concat([s.line]), span = 100, m = 10;
        all.forEach(function (l) { l.forEach(function (t) { span = Math.max(span, t[0]); m = Math.max(m, Math.abs(t[1])); }); });
        m = Math.ceil(m * 1.1);
        var ch = chart([0, span], [-m, m], p.unit || 'bets', p.label || 'profit'), out = ch.head;
        out += '<line x1="' + PAD.l + '" y1="' + ch.sy(0).toFixed(1) + '" x2="' + (CW - PAD.r) + '" y2="' + ch.sy(0).toFixed(1) + '" class="be-target"/>';
        s.lines.forEach(function (l) { out += '<path d="' + pathOf(l.map(function (t) { return [ch.sx(t[0]), ch.sy(t[1])]; })) + '" class="be-curve is-old"/>'; });
        out += '<path d="' + pathOf(s.line.map(function (t) { return [ch.sx(t[0]), ch.sy(t[1])]; })) + '" class="be-curve"/>';
        return out + '</svg>';
      },
      reads: function (s, p) {
        var u = p.unit ? p.unit.charAt(0).toUpperCase() + p.unit.slice(1) : 'Bets';
        var pr = (s.profit < 0 ? '-' : '') + numFmt(Math.abs(s.profit), Math.abs(s.profit) < 100 && s.profit % 1 ? 1 : 0);
        return [[u, numFmt(s.n, 0)], ['Won', s.n ? numFmt(s.won / s.n * 100, 1) + '%' : '-'], [p.label ? p.label.charAt(0).toUpperCase() + p.label.slice(1) : 'Profit', pr]];
      }
    },
    drift: {
      init: function (p, old) { var lines = old ? old.lines.concat([old.line]).slice(-4) : []; return { gen: 0, share: p.start == null ? 0.1 : p.start, line: [[0, p.start == null ? 0.1 : p.start]], lines: lines }; },
      step: function (s, p) {
        var sAdv = p.advantage || 0, N = p.size || 200, q = s.share * (1 + sAdv) / (1 + s.share * sAdv), k = 0;
        for (var i = 0; i < N; i++) if (Math.random() < q) k++;
        s.share = k / N; s.gen++; s.line.push([s.gen, s.share]);
      },
      cap: 500,
      unit: 'generations',
      draw: function (s, p) {
        var span = Math.max(20, s.gen, s.lines.reduce(function (m, l) { return Math.max(m, l.length - 1); }, 0));
        var ch = chart([0, span], [0, 1], 'generations', 'share with the trait'), out = ch.head;
        s.lines.forEach(function (l) { out += '<path d="' + pathOf(l.map(function (t) { return [ch.sx(t[0]), ch.sy(t[1])]; })) + '" class="be-curve is-old"/>'; });
        out += '<path d="' + pathOf(s.line.map(function (t) { return [ch.sx(t[0]), ch.sy(t[1])]; })) + '" class="be-curve"/>';
        return out + '</svg>';
      },
      reads: function (s) { return [['Generation', numFmt(s.gen, 0)], ['Share with the trait', numFmt(s.share * 100, 0) + '%']]; }
    }
  };
  BUILD.simulate = function (c, card) {
    addHead(card, TAG.simulate, c.title);
    var model = SIM[c.model];
    if (!model) { card.appendChild(h('p', 'be-error', 'This simulation could not be loaded.')); return; }
    var p = c.params || {};
    var art = h('div', 'be-art be-explore');
    card.appendChild(art);
    (c.body || []).forEach(function (b) { card.appendChild(h('p', 'be-p', fmt(typeof b === 'string' ? b : b.text))); });
    var reads = h('div', 'be-readouts');
    reads.setAttribute('aria-live', 'polite');
    var ctr = h('div', 'be-simctl');
    var state = model.init(p);
    function paint() {
      art.innerHTML = model.draw(state, p);
      reads.innerHTML = model.reads(state, p).map(function (r) { return '<span class="be-read"><span>' + esc(r[0]) + '</span><strong>' + esc(r[1]) + '</strong></span>'; }).join('');
    }
    (c.runs || [10, 100, 1000]).forEach(function (n) {
      var b = btn('be-btn is-quiet', 'Run ' + numFmt(n, 0));
      b.addEventListener('click', function () {
        var room = model.cap - (state.n != null ? state.n : state.gen);
        for (var k = 0; k < Math.min(n, room); k++) model.step(state, p);
        paint();
        track('simulate_run', { card_id: c.id, runs: n });
      });
      ctr.appendChild(b);
    });
    var keep = c.model === 'drift' || c.model === 'bets';
    var reset = btn('be-btn is-quiet', c.model === 'drift' ? 'New population' : c.model === 'bets' ? 'New season' : 'Reset');
    reset.addEventListener('click', function () { state = model.init(p, keep ? state : null); paint(); });
    ctr.appendChild(reset);
    card.appendChild(ctr);
    card.appendChild(reads);
    paint();
  };

  /* ---------- label: place each name on its part of a drawing ---------- */
  BUILD.label = function (c, card) {
    addHead(card, TAG.label, c.prompt);
    var targets = c.targets || [];
    var tmp = h('div', '', c.art || '');
    var svg = tmp.querySelector('svg');
    var vb = svg && svg.getAttribute('viewBox') ? svg.getAttribute('viewBox').split(/[\s,]+/).map(Number) : [0, 0, 320, 190];
    var box = h('div', 'be-art be-labelart');
    var stage = h('div', 'be-labelstage');
    stage.style.maxWidth = 'calc(38vh * ' + (vb[2] / vb[3]).toFixed(4) + ')';
    if (svg) {
      svg.setAttribute('role', 'img');
      if (c.alt) svg.setAttribute('aria-label', c.alt);
      stage.appendChild(svg);
    }
    box.appendChild(stage);
    card.appendChild(box);
    card.appendChild(h('p', 'be-how', 'Tap a name, then tap the spot it belongs to. Tap a filled spot to clear it.'));
    var chosen = null, placed = {}, spots = [], chips = [];
    targets.forEach(function (t, k) {
      var s = btn('be-spot', String(k + 1));
      s.style.left = ((t.x - vb[0]) / vb[2] * 100).toFixed(2) + '%';
      s.style.top = ((t.y - vb[1]) / vb[3] * 100).toFixed(2) + '%';
      s.setAttribute('aria-label', 'Spot ' + (k + 1) + ', empty');
      stage.appendChild(s);
      spots.push(s);
    });
    var names = targets.map(function (t) { return t.label; }).concat(c.distractors || []);
    var order = shuffled(names.length, c.id);
    var tray = h('div', 'be-chips');
    order.forEach(function (k) {
      var ch = btn('be-chip', fmt(names[k]));
      ch.dataset.k = k;
      ch.setAttribute('aria-pressed', 'false');
      tray.appendChild(ch);
      chips[k] = ch;
    });
    card.appendChild(tray);
    var check = btn('be-btn be-check', 'Check');
    check.disabled = true;
    card.appendChild(check);
    function refresh() {
      spots.forEach(function (s, k) {
        var at = placed[k];
        s.innerHTML = at == null ? String(k + 1) : fmt(names[at]);
        s.classList.toggle('is-filled', at != null);
        s.setAttribute('aria-label', 'Spot ' + (k + 1) + (at == null ? ', empty' : ', ' + plain(names[at])));
      });
      chips.forEach(function (ch, k) {
        var used = Object.keys(placed).some(function (s) { return placed[s] === k; });
        ch.disabled = used || !!me.answers[c.id];
        ch.classList.toggle('is-sel', chosen === k);
        ch.setAttribute('aria-pressed', chosen === k ? 'true' : 'false');
      });
      check.disabled = Object.keys(placed).length !== targets.length;
    }
    function show(ans, speak) {
      check.hidden = true;
      spots.forEach(function (s, k) {
        s.disabled = true;
        var right = ans.placed[k] === k;
        s.classList.add(right ? 'is-right' : 'is-wrong');
        if (!right) s.innerHTML = fmt(names[k]);
      });
      chips.forEach(function (ch) { ch.disabled = true; });
      var wrong = targets.filter(function (t, k) { return ans.placed[k] !== k; }).length;
      feedback(card, [verdict(ans.ok) + (ans.ok ? 'Every name is in its place.' : wrong + ' of ' + targets.length + ' were in the wrong place; the correct names are now shown.'), fmt(c.why || '')]);
      if (speak) announce(ans.ok ? 'Correct.' : 'Not quite. The correct names are shown.');
    }
    if (me.answers[c.id]) { placed = me.answers[c.id].placed; refresh(); show(me.answers[c.id], false); return; }
    chips.forEach(function (ch, k) {
      ch.addEventListener('click', function () { chosen = chosen === k ? null : k; refresh(); });
    });
    spots.forEach(function (s, k) {
      s.addEventListener('click', function () {
        if (me.answers[c.id]) return;
        if (placed[k] != null) { delete placed[k]; refresh(); return; }
        if (chosen == null) return;
        placed[k] = chosen; chosen = null; refresh();
      });
    });
    check.addEventListener('click', function () {
      var ok = targets.every(function (t, k) { return placed[k] === k; });
      var copy = {};
      Object.keys(placed).forEach(function (k) { copy[k] = placed[k]; });
      record(c, { placed: copy, ok: ok });
      show(me.answers[c.id], true);
    });
    refresh();
  };

  /* ---------- spot: tap the step where a worked solution goes wrong ---------- */
  BUILD.spot = function (c, card) {
    addHead(card, TAG.spot, c.prompt);
    addArt(c, card);
    var list = h('ol', 'be-steps');
    var btns = (c.working || []).map(function (st, k) {
      var li = h('li');
      var b = btn('be-option be-stepbtn', '<span class="be-stepn">' + (k + 1) + '</span> ' + fmt(st.text));
      li.appendChild(b);
      list.appendChild(li);
      return b;
    });
    card.appendChild(list);
    var bad = -1;
    (c.working || []).forEach(function (st, k) { if (st.wrong && bad < 0) bad = k; });
    function show(ans, speak) {
      lock(btns);
      if (ans.pick !== bad) mark(btns[ans.pick], 'is-picked', 'Your pick');
      mark(btns[bad], 'is-right', 'The mistake');
      feedback(card, [verdict(ans.ok) + fmt(c.working[bad].why || ''), fmt(c.why || '')]);
      if (speak) announce((ans.ok ? 'Correct. ' : 'Not quite. ') + 'The mistake is in step ' + (bad + 1) + '.');
    }
    if (me.answers[c.id]) { show(me.answers[c.id], false); return; }
    btns.forEach(function (b, k) {
      b.addEventListener('click', function () {
        if (me.answers[c.id]) return;
        record(c, { pick: k, ok: k === bad });
        show(me.answers[c.id], true);
      });
    });
  };

  /* One striking number or short statement, set large. */
  BUILD.figure = function (c, card) {
    addHead(card, TAG.figure, c.title);
    var big = h('p', 'be-big', fmt(c.value));
    card.appendChild(big);
    if (c.caption) card.appendChild(h('p', 'be-lead', fmt(c.caption)));
    addBody(c, card);
  };

  BUILD.compare = function (c, card) {
    addHead(card, TAG.compare, c.title);
    var wrap = h('div', 'be-tablewrap');
    var table = h('table', 'be-compare');
    var head = h('tr');
    c.columns.forEach(function (col, k) {
      var th = h('th', '', fmt(col));
      if (k > 0 || col) th.setAttribute('scope', 'col');
      head.appendChild(th);
    });
    var thead = h('thead');
    thead.appendChild(head);
    table.appendChild(thead);
    var tbody = h('tbody');
    c.rows.forEach(function (row) {
      var tr = h('tr');
      row.forEach(function (cell, k) {
        var td = h(k === 0 ? 'th' : 'td', '', fmt(cell));
        if (k === 0) td.setAttribute('scope', 'row');
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrap.appendChild(table);
    card.appendChild(wrap);
    addBody(c, card);
  };

  /* ---------- choice: one answer, or `select` answers ---------- */
  function optionList(c, card) {
    var list = h('div', 'be-options');
    list.setAttribute('role', 'group');
    list.setAttribute('aria-label', 'Answers');
    var btns = c.options.map(function (o) {
      var b = btn('be-option', fmt(o.text));
      list.appendChild(b);
      return b;
    });
    card.appendChild(list);
    return btns;
  }
  function lock(btns) {
    for (var k = 0; k < btns.length; k++) btns[k].disabled = true;
  }

  function showChoice(c, card, btns, ans, speak) {
    var picks = ans.picks || [ans.pick];
    lock(btns);
    var parts = [];
    c.options.forEach(function (o, k) {
      btns[k].classList.remove('is-sel');
      if (o.correct) mark(btns[k], 'is-right', 'Correct answer');
      else if (picks.indexOf(k) >= 0) mark(btns[k], 'is-wrong', 'Your answer');
    });
    if (picks.length === 1 && !c.select) {
      var picked = c.options[picks[0]];
      parts.push(verdict(ans.ok) + fmt(picked.why || ''));
      if (!ans.ok) {
        c.options.forEach(function (o) {
          if (o.correct) parts.push('<strong>Why the other answer holds:</strong> ' + fmt(o.why || ''));
        });
      }
      if (speak) announce((ans.ok ? 'Correct. ' : 'Not quite. ') + plain(picked.why || ''));
    } else {
      parts.push(verdict(ans.ok));
      c.options.forEach(function (o, k) {
        if (o.correct || picks.indexOf(k) >= 0) {
          parts.push('<strong>' + fmt(o.text) + '</strong> ' + fmt(o.why || ''));
        }
      });
      if (speak) announce(ans.ok ? 'Correct.' : 'Not quite. The correct answers are marked.');
    }
    feedback(card, parts);
  }
  BUILD.choice = function (c, card) {
    var many = c.select > 1;
    addHead(card, TAG.choice, c.prompt);
    addArt(c, card);
    if (many) card.appendChild(h('p', 'be-how', 'Choose ' + c.select + '.'));
    var btns = optionList(c, card);
    if (me.answers[c.id]) { showChoice(c, card, btns, me.answers[c.id], false); return; }

    if (!many) {
      btns.forEach(function (b, k) {
        b.addEventListener('click', function () {
          if (me.answers[c.id]) return;
          record(c, { pick: k, ok: !!c.options[k].correct });
          showChoice(c, card, btns, me.answers[c.id], true);
        });
      });
      return;
    }
    var chosen = [];
    var check = btn('be-btn be-check', 'Check');
    check.disabled = true;
    btns.forEach(function (b, k) {
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () {
        if (me.answers[c.id]) return;
        var at = chosen.indexOf(k);
        if (at >= 0) chosen.splice(at, 1);
        else if (chosen.length < c.select) chosen.push(k);
        else return;
        b.classList.toggle('is-sel', at < 0);
        b.setAttribute('aria-pressed', at < 0 ? 'true' : 'false');
        check.disabled = chosen.length !== c.select;
      });
    });
    check.addEventListener('click', function () {
      var ok = chosen.every(function (k) { return !!c.options[k].correct; });
      btns.forEach(function (b) { b.removeAttribute('aria-pressed'); });
      check.hidden = true;
      record(c, { picks: chosen.slice().sort(), ok: ok });
      showChoice(c, card, btns, me.answers[c.id], true);
    });
    card.appendChild(check);
  };

  /* ---------- predict: pick a move, see what follows ---------- */
  function showPredict(c, card, btns, ans, speak) {
    lock(btns);
    var best = -1;
    c.options.forEach(function (o, k) { if (o.best && best < 0) best = k; });
    mark(btns[ans.pick], 'is-picked', 'Your move');
    var picked = c.options[ans.pick];
    var parts = ['<strong>What happens:</strong> ' + fmt(picked.outcome || '')];
    if (!picked.best && best >= 0) {
      mark(btns[best], 'is-right', 'A stronger move');
      parts.push('<strong>The stronger move:</strong> ' + fmt(c.options[best].outcome || ''));
    }
    if (c.takeaway) parts.push('<strong>' + fmt(c.takeaway) + '</strong>');
    feedback(card, parts);
    if (speak) announce('What happens: ' + plain(picked.outcome || '') + ' ' + plain(c.takeaway || ''));
  }
  BUILD.predict = function (c, card) {
    addHead(card, TAG.predict, c.prompt);
    addArt(c, card);
    var btns = optionList(c, card);
    if (me.answers[c.id]) { showPredict(c, card, btns, me.answers[c.id], false); return; }
    btns.forEach(function (b, k) {
      b.addEventListener('click', function () {
        if (me.answers[c.id]) return;
        record(c, { pick: k, ok: !!c.options[k].best });
        showPredict(c, card, btns, me.answers[c.id], true);
      });
    });
  };

  /* ---------- sort: put items in order. Drag the handle, use the arrow
     buttons, or focus an item and press the up and down keys. One retry. ---------- */
  BUILD.sort = function (c, card) {
    addHead(card, TAG.sort, c.prompt);
    card.appendChild(h('p', 'be-how', 'Drag the handle, or use the arrows. Then check.'));
    var list = h('ol', 'be-sort');
    var done = !!me.answers[c.id];
    var tries = 0;
    var check = btn('be-btn be-check', 'Check');

    function clearMarks() {
      var m = list.querySelectorAll('.is-wrong');
      for (var k = 0; k < m.length; k++) m[k].classList.remove('is-wrong');
    }
    function move(li, dir) {
      if (done) return;
      var other = dir < 0 ? li.previousElementSibling : li.nextElementSibling;
      if (!other) return;
      list.insertBefore(li, dir < 0 ? other : other.nextSibling);
      clearMarks();
      announce(plain(c.items[+li.getAttribute('data-k')]) + ', position ' +
        (Array.prototype.indexOf.call(list.children, li) + 1) + ' of ' + c.items.length);
    }
    function finish(ok, speak) {
      done = true;
      for (var k = 0; k < c.items.length; k++) {
        list.appendChild(list.querySelector('[data-k="' + k + '"]'));
      }
      list.classList.add('is-locked');
      var ctl = list.querySelectorAll('button, .be-grip');
      for (var q = 0; q < ctl.length; q++) ctl[q].hidden = true;
      var lis = list.children;
      for (var j = 0; j < lis.length; j++) lis[j].removeAttribute('tabindex');
      check.hidden = true;
      feedback(card, [verdict(ok) + (ok ? '' : 'This is the order. ') + fmt(c.why || '')]);
      if (speak) announce((ok ? 'Correct. ' : 'Not quite. The correct order is shown. ') + plain(c.why || ''));
    }

    (done ? c.items.map(function (_, k) { return k; }) : shuffled(c.items.length, c.id)).forEach(function (k) {
      var li = h('li', 'be-item');
      li.setAttribute('data-k', k);
      li.tabIndex = 0;
      var grip = h('span', 'be-grip', '&#8942;&#8942;');
      grip.setAttribute('aria-hidden', 'true');
      var up = btn('be-move', '&#9650;');
      up.setAttribute('aria-label', 'Move up');
      var down = btn('be-move', '&#9660;');
      down.setAttribute('aria-label', 'Move down');
      li.appendChild(grip);
      li.appendChild(h('span', 'be-item-text', fmt(c.items[k])));
      li.appendChild(up);
      li.appendChild(down);
      up.addEventListener('click', function () { move(li, -1); up.focus(); });
      down.addEventListener('click', function () { move(li, 1); down.focus(); });
      li.addEventListener('keydown', function (e) {
        if (e.target !== li) return;
        if (e.key === 'ArrowUp') { move(li, -1); li.focus(); e.preventDefault(); }
        if (e.key === 'ArrowDown') { move(li, 1); li.focus(); e.preventDefault(); }
      });
      /* Listen on the document while dragging: moving the item in the DOM
         would drop a pointer capture held by its handle. */
      function drag(e) {
        var items = list.children;
        var mine = Array.prototype.indexOf.call(items, li);
        for (var q = 0; q < items.length; q++) {
          if (items[q] === li) continue;
          var r = items[q].getBoundingClientRect();
          var mid = r.top + r.height / 2;
          if (q < mine && e.clientY < mid) { list.insertBefore(li, items[q]); break; }
          if (q > mine && e.clientY > mid) { list.insertBefore(li, items[q].nextSibling); break; }
        }
      }
      function drop() {
        li.classList.remove('is-drag');
        document.removeEventListener('pointermove', drag);
        document.removeEventListener('pointerup', drop);
        document.removeEventListener('pointercancel', drop);
      }
      grip.addEventListener('pointerdown', function (e) {
        if (done) return;
        li.classList.add('is-drag');
        clearMarks();
        document.addEventListener('pointermove', drag);
        document.addEventListener('pointerup', drop);
        document.addEventListener('pointercancel', drop);
        e.preventDefault();
      });
      list.appendChild(li);
    });
    card.appendChild(list);
    card.appendChild(check);

    check.addEventListener('click', function () {
      var wrong = [];
      for (var k = 0; k < list.children.length; k++) {
        if (+list.children[k].getAttribute('data-k') !== k) wrong.push(list.children[k]);
      }
      if (!wrong.length || tries > 0) {
        record(c, { ok: !wrong.length, tries: tries + 1 });
        finish(!wrong.length, true);
        return;
      }
      tries = 1;
      wrong.forEach(function (li) { li.classList.add('is-wrong'); });
      var msg = wrong.length + ' of ' + c.items.length + ' are out of place. Move them and check once more.';
      feedback(card, ['<strong>Not yet.</strong> ' + msg]);
      announce('Not yet. ' + msg);
    });
    if (done) finish(me.answers[c.id].ok, false);
  };

  /* ---------- bucket: sort items into groups. Tap an item then a group,
     drag it, or focus it and press the group's number. One retry. ---------- */
  BUILD.bucket = function (c, card) {
    addHead(card, TAG.bucket, c.prompt);
    card.appendChild(h('p', 'be-how', 'Tap an item, then tap a group. You can also drag it, or press the group number.'));
    var pool = h('div', 'be-pool');
    var wrap = h('div', 'be-buckets');
    var done = !!me.answers[c.id];
    var place = {};
    var sel = -1;
    var tries = 0;
    var check = btn('be-btn be-check', 'Check');
    check.disabled = true;
    var zones = {};

    function select(k) {
      sel = k;
      chips.forEach(function (b, q) {
        b.classList.toggle('is-sel', q === k);
        b.setAttribute('aria-pressed', q === k ? 'true' : 'false');
      });
      wrap.classList.toggle('is-armed', k >= 0);
    }
    function put(k, id) {
      if (done) return;
      place[k] = id;
      zones[id].inner.appendChild(chips[k]);
      chips[k].classList.remove('is-wrong');
      select(-1);
      var placed = 0;
      for (var q = 0; q < chips.length; q++) if (place[q]) placed++;
      check.disabled = placed !== chips.length;
      pool.hidden = placed === chips.length;
      announce(plain(c.items[k].text) + ' placed in ' + zones[id].name);
    }
    function finish(ok, speak) {
      done = true;
      select(-1);
      chips.forEach(function (b, k) {
        zones[c.items[k].bucket].inner.appendChild(b);
        b.classList.remove('is-wrong');
        b.disabled = true;
      });
      for (var id in zones) {
        zones[id].el.removeAttribute('tabindex');
        zones[id].el.removeAttribute('role');
      }
      pool.hidden = true;
      check.hidden = true;
      feedback(card, [verdict(ok) + (ok ? '' : 'The groups now show the answer. ') + fmt(c.why || '')]);
      if (speak) announce((ok ? 'Correct. ' : 'Not quite. The groups now show the answer. ') + plain(c.why || ''));
    }

    var chips = c.items.map(function (it, k) {
      var b = btn('be-chip', fmt(it.text));
      b.setAttribute('aria-pressed', 'false');
      var start = null, dragging = false, swallow = false;
      b.addEventListener('click', function () {
        if (done) return;
        if (swallow) { swallow = false; return; }
        select(sel === k ? -1 : k);
      });
      b.addEventListener('keydown', function (e) {
        var n = parseInt(e.key, 10);
        if (!done && n >= 1 && n <= c.buckets.length) {
          put(k, c.buckets[n - 1].id);
          b.focus();
          e.preventDefault();
        }
      });
      b.addEventListener('pointerdown', function (e) {
        if (done) return;
        start = { x: e.clientX, y: e.clientY, id: e.pointerId };
      });
      b.addEventListener('pointermove', function (e) {
        if (!start) return;
        var dx = e.clientX - start.x, dy = e.clientY - start.y;
        if (!dragging && Math.abs(dx) + Math.abs(dy) > 8) {
          dragging = true;
          try { b.setPointerCapture(start.id); } catch (err) {}
          b.classList.add('is-drag');
          wrap.classList.add('is-armed');
        }
        if (dragging) b.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      });
      function end(e) {
        if (!start) return;
        var was = dragging;
        start = null;
        dragging = false;
        b.classList.remove('is-drag');
        b.style.transform = '';
        if (!was) return;
        swallow = true;
        window.setTimeout(function () { swallow = false; }, 0);
        wrap.classList.remove('is-armed');
        b.style.pointerEvents = 'none';
        var under = document.elementFromPoint(e.clientX, e.clientY);
        b.style.pointerEvents = '';
        var zone = under && under.closest ? under.closest('.be-bucket') : null;
        if (zone) put(k, zone.getAttribute('data-b'));
      }
      b.addEventListener('pointerup', end);
      b.addEventListener('pointercancel', end);
      return b;
    });

    c.buckets.forEach(function (bk, n) {
      var z = h('div', 'be-bucket');
      z.setAttribute('data-b', bk.id);
      z.setAttribute('role', 'button');
      z.setAttribute('aria-label', 'Place the selected item in ' + bk.name);
      z.tabIndex = 0;
      z.appendChild(h('p', 'be-bucket-name', '<span>' + (n + 1) + '</span>' + esc(bk.name)));
      var inner = h('div', 'be-bucket-items');
      z.appendChild(inner);
      zones[bk.id] = { el: z, inner: inner, name: bk.name };
      z.addEventListener('click', function (e) {
        if (e.target.closest('.be-chip')) return;
        if (sel >= 0) put(sel, bk.id);
      });
      z.addEventListener('keydown', function (e) {
        if (e.target !== z || (e.key !== 'Enter' && e.key !== ' ')) return;
        if (sel >= 0) put(sel, bk.id);
        e.preventDefault();
      });
      wrap.appendChild(z);
    });

    shuffled(chips.length, c.id).forEach(function (k) { pool.appendChild(chips[k]); });
    card.appendChild(pool);
    card.appendChild(wrap);
    card.appendChild(check);

    check.addEventListener('click', function () {
      var wrong = [];
      chips.forEach(function (b, k) { if (place[k] !== c.items[k].bucket) wrong.push(b); });
      if (!wrong.length || tries > 0) {
        record(c, { ok: !wrong.length, tries: tries + 1 });
        finish(!wrong.length, true);
        return;
      }
      tries = 1;
      wrong.forEach(function (b) { b.classList.add('is-wrong'); });
      var msg = wrong.length + ' of ' + chips.length + ' are in the wrong group. Move them and check once more.';
      feedback(card, ['<strong>Not yet.</strong> ' + msg]);
      announce('Not yet. ' + msg);
    });
    if (done) finish(me.answers[c.id].ok, false);
  };

  /* ---------- reflect and commit: the learner writes; nothing is graded
     and the text never leaves the device. ---------- */
  function textCard(c, card, o) {
    var noteKey = lessonKey + '/' + c.id;
    var min = c.minChars || 0;
    addHead(card, TAG[c.type], c.prompt);
    var ta = h('textarea', 'be-text');
    ta.setAttribute('aria-label', 'Your answer');
    ta.value = notes[noteKey] || '';
    if (c.suggestions && c.suggestions.length) {
      var ideas = h('div', 'be-ideas');
      ideas.setAttribute('role', 'group');
      ideas.setAttribute('aria-label', 'Suggestions');
      c.suggestions.forEach(function (s) {
        var b = btn('be-idea', fmt(s));
        b.addEventListener('click', function () {
          if (me.answers[c.id]) return;
          ta.value = plain(s);
          refresh();
          ta.focus();
        });
        ideas.appendChild(b);
      });
      card.appendChild(ideas);
    }
    card.appendChild(ta);
    var row = h('div', 'be-row');
    var counter = h('span', 'be-counter');
    var saveBtn = btn('be-btn', o.save);
    row.appendChild(counter);
    row.appendChild(saveBtn);
    card.appendChild(row);
    card.appendChild(h('p', 'be-private', 'Your answer stays on this device.'));
    var skip = btn('be-link', 'Skip for now');
    card.appendChild(skip);

    function refresh() {
      var n = ta.value.trim().length;
      counter.textContent = n < min ? (min - n) + ' more characters' : 'Ready to save';
      saveBtn.disabled = n < min;
    }
    function finish(speak) {
      var ans = me.answers[c.id];
      ta.disabled = true;
      row.hidden = true;
      skip.hidden = true;
      var ideasEl = card.querySelector('.be-ideas');
      if (ideasEl) ideasEl.hidden = true;
      if (ans.skipped) return;
      var said = o.after(c);
      if (said) {
        feedback(card, [said]);
        if (speak) announce('Saved. ' + plain(said.replace(/<[^>]+>/g, '')));
      }
    }
    ta.addEventListener('input', refresh);
    saveBtn.addEventListener('click', function () {
      notes[noteKey] = ta.value.trim();
      write(NKEY, notes);
      if (c.type === 'commit') {
        /* Kept so the review page can ask "Did you do it?" a week later. */
        var made = read(CKEY, {});
        made[L.book + '/' + L.n + '/' + c.id] = { text: notes[noteKey], t: now(), asked: null };
        write(CKEY, made);
      }
      record(c, { done: true, skipped: false });
      finish(true);
    });
    skip.addEventListener('click', function () {
      record(c, { done: true, skipped: true });
      finish(false);
      go(1);
    });
    refresh();
    if (me.answers[c.id]) finish(false);
  }
  BUILD.reflect = function (c, card) {
    textCard(c, card, {
      save: 'Save my answer',
      after: function (card_) {
        return card_.example ? '<strong>One way to answer:</strong> ' + fmt(card_.example) : '';
      }
    });
  };
  BUILD.commit = function (c, card) {
    textCard(c, card, {
      save: 'Commit to this',
      after: function () { return '<strong>Saved.</strong> It is kept with your notes for this book.'; }
    });
  };

  BUILD.done = function (c, card) {
    card.appendChild(h('div', 'be-badge', '&#10003;'));
    addHead(card, null, c.title || 'Lesson complete');
    if (c.can) card.appendChild(h('p', 'be-can', '<strong>You can now</strong>' + fmt(c.can)));
    var actions = h('div', 'be-actions');
    if (nextLesson) {
      var next = h('a', 'be-btn', 'Next: ' + esc(nextLesson.title));
      next.href = nextLesson.file;
      actions.appendChild(next);
    }
    var home = h('a', 'be-btn' + (nextLesson ? ' is-quiet' : ''), 'Back to the book');
    home.href = './';
    actions.appendChild(home);
    card.appendChild(actions);
  };

  /* ---------- render and navigation ---------- */
  function mount(c) {
    var card = h('section', 'be-card be-t-' + c.type);
    (BUILD[c.type] || BUILD.concept)(c, card);

    /* Art and text become two panes on wide screens. On a phone the wrapper
       is transparent to layout and the art sits under the heading. */
    var art = card.querySelector('.be-art');
    if (art) {
      var main = h('div', 'be-main');
      while (card.firstChild) main.appendChild(card.firstChild);
      main.removeChild(art);
      card.appendChild(art);
      card.appendChild(main);
      card.classList.add('has-art');
    }
    return card;
  }
  function focusHead(card) {
    var head = card.querySelector('[data-head]');
    if (!head) return;
    head.setAttribute('tabindex', '-1');
    try { head.focus({ preventScroll: true }); } catch (e) { head.focus(); }
  }

  function render(focus) {
    var c = cards[i];
    stopEvoAudio();
    stage.innerHTML = '';
    var card = mount(c);
    stage.appendChild(card);
    applySteps(c, card);
    stage.scrollTop = 0;

    if (me.at !== c.id) {
      me.at = c.id;
      track('card_view', { card_id: c.id, card_type: c.type, card_index: i + 1 });
      if (c.type === 'done' && !me.completed) complete();
      save();
    }
    updateChrome();
    if (focus) focusHead(card);
  }

  /* ---------- review mode: one due card at a time ---------- */
  function showReview() {
    var item;
    while ((item = session.queue[session.pos]) && item.done) session.pos++;
    swrite(SKEY, session);
    if (!item) { window.location.replace('../review/?done=1'); return; }
    if (item.file !== selfFile) { window.location.replace('../' + item.file + '?review=1'); return; }
    var base = null, k;
    for (k = 0; k < cards.length; k++) if (cards[k].id === item.card) base = cards[k];
    if (!base || !PRODUCING[base.type]) {
      /* The card was removed from the lesson: drop it from this session. */
      item.done = true;
      item.skipped = true;
      showReview();
      return;
    }
    /* Prefer a wording the learner has not seen, so review tests the idea
       and not the memory of one sentence. 0 is the lesson's own wording. */
    var entry = read(RKEY, {})[item.id] || {};
    var seen = entry.seen || [0];
    var variants = base.variants || [];
    reviewVariant = 0;
    for (k = 1; k <= variants.length; k++) {
      if (seen.indexOf(k) < 0) { reviewVariant = k; break; }
    }
    if (!reviewVariant && variants.length) {
      reviewVariant = (entry.history ? entry.history.length : 0) % (variants.length + 1);
    }
    reviewCard = {};
    var key;
    for (key in base) if (Object.prototype.hasOwnProperty.call(base, key)) reviewCard[key] = base[key];
    if (reviewVariant) {
      var alt = variants[reviewVariant - 1];
      for (key in alt) if (Object.prototype.hasOwnProperty.call(alt, key)) reviewCard[key] = alt[key];
    }
    reviewCard.id = base.id;
    reviewCard.type = base.type;
    me = { at: null, answers: {} };
    reviewAnswered = false;
    stage.innerHTML = '';
    var card = mount(reviewCard);
    stage.appendChild(card);
    stage.scrollTop = 0;
    updateChrome();
    focusHead(card);
  }
  /* A correct review moves the card up one box; a wrong one sends it back to
     box 1. A correct answer in the last box retires the card. */
  function reviewRecord(c, ans) {
    ans.t = now();
    me.answers[c.id] = ans;
    reviewAnswered = true;
    var item = session.queue[session.pos];
    var ok = !!ans.ok;
    var queue = read(RKEY, {});
    var e = queue[item.id];
    if (e) {
      e.history = e.history || [];
      e.history.push({ t: ans.t, ok: ok });
      if (!ok) e.box = 1;
      else if (e.box >= 5) e.retired = true;
      else e.box++;
      e.due = new Date(Date.now() + DAYS[e.box] * 24 * 60 * 60 * 1000).toISOString();
      e.seen = e.seen || [0];
      if (e.seen.indexOf(reviewVariant) < 0) e.seen.push(reviewVariant);
      write(RKEY, queue);
      item.box = e.retired ? 6 : e.box;
    }
    item.done = true;
    item.ok = ok;
    swrite(SKEY, session);
    track('answer', { card_id: c.id, card_type: c.type, correct: ok, review: true });
    updateChrome();
  }
  function reviewNext() {
    session.pos++;
    swrite(SKEY, session);
    showReview();
  }

  /* On completion, reviewable cards enter box 1, due tomorrow. The review
     session that reads this arrives in milestone 3; the data starts now. */
  function complete() {
    me.completed = now();
    var due = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    var queue = read(RKEY, {});
    var right = 0, asked = 0;
    cards.forEach(function (c) {
      var first = me.answers[c.id];
      if (first && typeof first.ok === 'boolean') {
        asked++;
        if (first.ok) right++;
      }
      if (!c.review) return;
      var id = L.book + '/' + L.n + '/' + c.id;
      if (queue[id]) {
        queue[id].file = selfFile;
        return;
      }
      queue[id] = {
        box: 1, due: due, file: selfFile, seen: [0],
        history: first ? [{ t: first.t, ok: !!first.ok }] : []
      };
    });
    write(RKEY, queue);
    track('lesson_complete', { questions: asked, correct: right });
  }

  function revealStep() {
    if (reviewMode) return false;
    var c = cards[i];
    if (stepsLeft(c) <= 0) return false;
    stepState[c.id] = (stepState[c.id] || 0) + 1;
    applySteps(c, stage.firstChild);
    /* On a long card the newly shown step can be below the fold. */
    var shown = stage.querySelectorAll('[data-step="' + stepState[c.id] + '"]');
    if (shown.length && shown[shown.length - 1].scrollIntoView) {
      shown[shown.length - 1].scrollIntoView({ block: 'nearest' });
    }
    updateChrome();
    return true;
  }
  function go(delta) {
    if (reviewMode) { if (delta > 0) reviewNext(); return; }
    var to = i + delta;
    if (to < 0 || to >= cards.length) return;
    if (delta > 0) stepState[cards[i].id] = cards[i].steps || 0;
    i = to;
    render(true);
  }
  function advance() {
    if (!started) return;
    if (reviewMode) { if (reviewCard && !gated(reviewCard)) reviewNext(); return; }
    if (revealStep()) return;
    if (gated(cards[i])) return;
    go(1);
  }

  nextBtn.addEventListener('click', advance);
  backBtn.addEventListener('click', function () { if (started) go(-1); });

  stage.addEventListener('click', function (e) {
    if (!started || e.target.closest('button, a, textarea, input, summary, video, [role="button"], .be-item')) return;
    revealStep();
  });

  document.addEventListener('keydown', function (e) {
    if (!started) return;
    var t = e.target;
    var typing = t && (t.tagName === 'TEXTAREA' || t.tagName === 'INPUT' || t.tagName === 'VIDEO');
    if (e.key === 'Escape') { window.location.href = homeHref; return; }
    if (typing) return;
    if (e.key === 'ArrowRight') { advance(); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { go(-1); e.preventDefault(); }
    else if (e.key === 'Enter' && !(t && t.closest && t.closest('button, a, summary, [role="button"]'))) { advance(); e.preventDefault(); }
  });

  /* Swipe to move between cards. Off on cards where the learner drags things. */
  var touch = null;
  stage.addEventListener('touchstart', function (e) {
    touch = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
  }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (!touch || !started) return;
    var dx = e.changedTouches[0].clientX - touch.x;
    var dy = e.changedTouches[0].clientY - touch.y;
    touch = null;
    if (reviewMode || NO_SWIPE[cards[i].type]) return;
    if (Math.abs(dx) < 60 || Math.abs(dy) > 40) return;
    if (dx > 0) { go(-1); return; }
    if (gated(cards[i])) return;
    go(1);
  }, { passive: true });

  /* ---------- next lesson: read from book.json, the one home of ordering ---------- */
  if (window.fetch && window.location.protocol !== 'file:') {
    window.fetch('book.json').then(function (r) {
      return r.ok ? r.json() : null;
    }).then(function (book) {
      if (!book || !book.lessons) return;
      for (var k = 0; k < book.lessons.length; k++) {
        if (book.lessons[k].n === L.n && book.lessons[k + 1]) nextLesson = book.lessons[k + 1];
      }
      if (started && nextLesson && cards[i].type === 'done') render(false);
    }).catch(function () {});
  }

  /* ---------- start, or offer to resume ---------- */
  function begin(index, reset, how) {
    if (reset || !me) me = fresh();
    i = index;
    /* Cards already passed, and every card of a finished lesson, open fully built. */
    for (var k = 0; k < cards.length; k++) {
      if (k < i || me.completed) stepState[cards[k].id] = cards[k].steps || 0;
    }
    started = true;
    foot.hidden = false;
    track('lesson_start', { mode: how, cards: cards.length });
    render(true);
  }
  function resumeIndex() {
    if (!me) return 0;
    for (var k = 0; k < cards.length; k++) if (cards[k].id === me.at) return k;
    /* The saved card no longer exists: fall back to the last answered card. */
    var lastAnswered = 0;
    for (var j = 0; j < cards.length; j++) if (me.answers[cards[j].id]) lastAnswered = j;
    return lastAnswered;
  }

  var at = reviewMode ? 0 : resumeIndex();
  if (reviewMode) {
    started = true;
    showReview();
  } else if (me && at > 0) {
    foot.hidden = true;
    var box = h('section', 'be-card be-resume');
    box.appendChild(h('p', 'be-tag', esc(L.title)));
    var finished = !!me.completed;
    box.appendChild(h('h2', '', finished ? 'You finished this lesson' : 'Welcome back'));
    box.appendChild(h('p', 'be-lead', finished
      ? 'Look through it again with your answers, or start fresh.'
      : 'You stopped at card ' + (at + 1) + ' of ' + cards.length + '.'));
    var actions = h('div', 'be-actions');
    var cont = btn('be-btn', finished ? 'Look through it' : 'Continue from card ' + (at + 1));
    cont.addEventListener('click', function () { begin(finished ? 0 : at, false, finished ? 'revisit' : 'resume'); });
    var again = btn('be-btn is-quiet', 'Start again');
    again.addEventListener('click', function () { begin(0, true, 'restart'); });
    actions.appendChild(cont);
    actions.appendChild(again);
    box.appendChild(actions);
    stage.appendChild(box);
    for (var s = 0; s < segs.length; s++) segs[s].classList.toggle('is-seen', s < at);
    count.textContent = '';
  } else {
    begin(0, false, 'new');
  }
})();
