/* Book engine v1 (milestone 1).
   Shared by every book lesson page. A page carries its lesson as JSON in
   <script type="application/json" id="lesson"> and a <main id="app"> mount.
   Payloads are data only: no script, no raw HTML outside a card's `art` SVG.

   Card types in this milestone: cover, concept, case, choice, predict,
   reflect, done. A breaking change ships as book-engine.v2.js; fixes to this
   file reach every v1 lesson at once, so keep them backward compatible. */
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

  var PRODUCING = { choice: 1, predict: 1, reflect: 1 };
  var TAG = {
    concept: 'The idea',
    'case': 'A case',
    choice: 'Your turn',
    predict: 'What would you do?',
    reflect: 'Apply it'
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

  function now() { return new Date().toISOString(); }
  function fresh() { return { at: null, answers: {}, started: now(), completed: null }; }
  function save() {
    progress[lessonKey] = me;
    write(PKEY, progress);
  }

  /* ---------- small helpers ---------- */
  function h(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
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

  /* ---------- chrome ---------- */
  app.innerHTML = '';
  app.className = 'be';

  var top = h('div', 'be-top');
  var close = h('a', 'be-close', '&times;');
  close.href = './';
  close.setAttribute('aria-label', 'Back to the book');
  var bar = h('div', 'be-bar');
  bar.setAttribute('aria-hidden', 'true');
  var segs = cards.map(function (c) {
    var s = h('span', 'be-seg' + (PRODUCING[c.type] ? ' is-do' : ''));
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
  var backBtn = h('button', 'be-btn is-quiet be-back', 'Back');
  backBtn.type = 'button';
  var nextBtn = h('button', 'be-btn be-next', 'Continue');
  nextBtn.type = 'button';
  foot.appendChild(backBtn);
  foot.appendChild(nextBtn);

  app.appendChild(top);
  /* "Back to review" bar, shown only with a same-site ?back= path. */
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
  function gated(c) { return !!PRODUCING[c.type] && !me.answers[c.id]; }

  function applySteps(c, card) {
    var n = stepState[c.id] || 0;
    var els = card.querySelectorAll('[data-step]');
    for (var k = 0; k < els.length; k++) {
      var at = parseInt(els[k].getAttribute('data-step'), 10);
      els[k].classList.toggle('be-on', at <= n);
    }
    var hint = card.querySelector('.be-hint');
    if (hint) hint.hidden = stepsLeft(c) <= 0;
  }

  function updateChrome() {
    var c = cards[i];
    var last = i === cards.length - 1;
    backBtn.disabled = i === 0;
    nextBtn.hidden = last;
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

  /* ---------- card builders ---------- */
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
  function addOptions(c, card, onPick) {
    var list = h('div', 'be-options');
    list.setAttribute('role', 'group');
    list.setAttribute('aria-label', 'Answers');
    c.options.forEach(function (o, k) {
      var b = h('button', 'be-option', fmt(o.text));
      b.type = 'button';
      b.addEventListener('click', function () {
        if (!me.answers[c.id]) onPick(k);
      });
      list.appendChild(b);
    });
    card.appendChild(list);
    return list;
  }
  function mark(btn, cls, word) {
    btn.classList.add(cls);
    btn.insertBefore(h('span', 'be-mark', esc(word)), btn.firstChild);
  }
  function lockOptions(card) {
    var btns = card.querySelectorAll('.be-option');
    for (var k = 0; k < btns.length; k++) btns[k].disabled = true;
    return btns;
  }

  var BUILD = {};

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

  function showChoice(c, card, ans, speak) {
    var btns = lockOptions(card);
    var right = -1;
    c.options.forEach(function (o, k) {
      if (o.correct) {
        right = k;
        mark(btns[k], 'is-right', 'Correct answer');
      }
    });
    if (!ans.ok) mark(btns[ans.pick], 'is-wrong', 'Your answer');
    var fb = h('div', 'be-feedback');
    var picked = c.options[ans.pick];
    fb.appendChild(h('p', '', '<strong>' + (ans.ok ? 'Correct.' : 'Not quite.') + '</strong> ' + fmt(picked.why || '')));
    if (!ans.ok && right >= 0) {
      fb.appendChild(h('p', '', '<strong>Why the other answer holds:</strong> ' + fmt(c.options[right].why || '')));
    }
    card.appendChild(fb);
    if (speak) announce((ans.ok ? 'Correct. ' : 'Not quite. ') + plain(picked.why || ''));
  }
  BUILD.choice = function (c, card) {
    addHead(card, TAG.choice, c.prompt);
    addArt(c, card);
    addOptions(c, card, function (k) {
      me.answers[c.id] = { pick: k, ok: !!c.options[k].correct, t: now() };
      save();
      showChoice(c, card, me.answers[c.id], true);
      updateChrome();
    });
    if (me.answers[c.id]) showChoice(c, card, me.answers[c.id], false);
  };

  function showPredict(c, card, ans, speak) {
    var btns = lockOptions(card);
    var best = -1;
    c.options.forEach(function (o, k) { if (o.best && best < 0) best = k; });
    mark(btns[ans.pick], 'is-picked', 'Your move');
    var picked = c.options[ans.pick];
    var fb = h('div', 'be-feedback');
    fb.appendChild(h('p', '', '<strong>What happens:</strong> ' + fmt(picked.outcome || '')));
    if (!picked.best && best >= 0) {
      mark(btns[best], 'is-right', 'A stronger move');
      fb.appendChild(h('p', '', '<strong>The stronger move:</strong> ' + fmt(c.options[best].outcome || '')));
    }
    if (c.takeaway) fb.appendChild(h('p', '', '<strong>' + fmt(c.takeaway) + '</strong>'));
    card.appendChild(fb);
    if (speak) announce('What happens: ' + plain(picked.outcome || '') + ' ' + plain(c.takeaway || ''));
  }
  BUILD.predict = function (c, card) {
    addHead(card, TAG.predict, c.prompt);
    addArt(c, card);
    addOptions(c, card, function (k) {
      me.answers[c.id] = { pick: k, ok: !!c.options[k].best, t: now() };
      save();
      showPredict(c, card, me.answers[c.id], true);
      updateChrome();
    });
    if (me.answers[c.id]) showPredict(c, card, me.answers[c.id], false);
  };

  BUILD.reflect = function (c, card) {
    var noteKey = lessonKey + '/' + c.id;
    var min = c.minChars || 0;
    addHead(card, TAG.reflect, c.prompt);
    var ta = h('textarea', 'be-text');
    ta.setAttribute('aria-label', 'Your answer');
    ta.value = notes[noteKey] || '';
    card.appendChild(ta);
    var row = h('div', 'be-row');
    var counter = h('span', 'be-counter');
    var saveBtn = h('button', 'be-btn', 'Save my answer');
    saveBtn.type = 'button';
    row.appendChild(counter);
    row.appendChild(saveBtn);
    card.appendChild(row);
    card.appendChild(h('p', 'be-private', 'Your answer stays on this device.'));
    var skip = h('button', 'be-link', 'Skip for now');
    skip.type = 'button';
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
      if (c.example && !ans.skipped) {
        var fb = h('div', 'be-feedback');
        fb.appendChild(h('p', '', '<strong>One way to answer:</strong> ' + fmt(c.example)));
        card.appendChild(fb);
        if (speak) announce('Saved. One way to answer: ' + plain(c.example));
      }
    }
    ta.addEventListener('input', refresh);
    saveBtn.addEventListener('click', function () {
      notes[noteKey] = ta.value.trim();
      write(NKEY, notes);
      me.answers[c.id] = { done: true, skipped: false, t: now() };
      save();
      finish(true);
      updateChrome();
    });
    skip.addEventListener('click', function () {
      me.answers[c.id] = { done: true, skipped: true, t: now() };
      save();
      finish(false);
      updateChrome();
      go(1);
    });
    refresh();
    if (me.answers[c.id]) finish(false);
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
  function render(focus) {
    var c = cards[i];
    stage.innerHTML = '';
    var card = h('section', 'be-card be-' + c.type);
    (BUILD[c.type] || BUILD.concept)(c, card);
    stage.appendChild(card);
    applySteps(c, card);
    stage.scrollTop = 0;

    if (me.at !== c.id) {
      me.at = c.id;
      if (c.type === 'done' && !me.completed) complete();
      save();
    }
    updateChrome();
    if (focus) {
      var head = card.querySelector('[data-head]');
      if (head) {
        head.setAttribute('tabindex', '-1');
        try { head.focus({ preventScroll: true }); } catch (e) { head.focus(); }
      }
    }
  }

  /* On completion, reviewable cards enter box 1, due tomorrow. The review
     session that reads this arrives in milestone 3; the data starts now. */
  function complete() {
    me.completed = now();
    var due = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    var queue = read(RKEY, {});
    cards.forEach(function (c) {
      if (!c.review) return;
      var id = L.book + '/' + L.n + '/' + c.id;
      if (queue[id]) return;
      var first = me.answers[c.id];
      queue[id] = { box: 1, due: due, history: first ? [{ t: first.t, ok: !!first.ok }] : [] };
    });
    write(RKEY, queue);
  }

  function revealStep() {
    var c = cards[i];
    if (stepsLeft(c) <= 0) return false;
    stepState[c.id] = (stepState[c.id] || 0) + 1;
    applySteps(c, stage.firstChild);
    updateChrome();
    return true;
  }
  function go(delta) {
    var to = i + delta;
    if (to < 0 || to >= cards.length) return;
    if (delta > 0) stepState[cards[i].id] = cards[i].steps || 0;
    i = to;
    render(true);
  }
  function advance() {
    if (!started) return;
    if (revealStep()) return;
    if (gated(cards[i])) return;
    go(1);
  }

  nextBtn.addEventListener('click', advance);
  backBtn.addEventListener('click', function () { if (started) go(-1); });

  stage.addEventListener('click', function (e) {
    if (!started || e.target.closest('button, a, textarea, input')) return;
    revealStep();
  });

  document.addEventListener('keydown', function (e) {
    if (!started) return;
    var t = e.target;
    var typing = t && (t.tagName === 'TEXTAREA' || t.tagName === 'INPUT');
    if (e.key === 'Escape') { window.location.href = './'; return; }
    if (typing) return;
    if (e.key === 'ArrowRight') { advance(); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { go(-1); e.preventDefault(); }
    else if (e.key === 'Enter' && !(t && t.closest && t.closest('button, a'))) { advance(); e.preventDefault(); }
  });

  var touch = null;
  stage.addEventListener('touchstart', function (e) {
    touch = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
  }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (!touch || !started) return;
    var dx = e.changedTouches[0].clientX - touch.x;
    var dy = e.changedTouches[0].clientY - touch.y;
    touch = null;
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
  function begin(index, reset) {
    if (reset || !me) me = fresh();
    i = index;
    for (var k = 0; k < i; k++) stepState[cards[k].id] = cards[k].steps || 0;
    started = true;
    foot.hidden = false;
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

  var at = resumeIndex();
  if (me && at > 0) {
    foot.hidden = true;
    var box = h('section', 'be-card be-resume');
    box.appendChild(h('p', 'be-tag', esc(L.title)));
    var finished = !!me.completed;
    box.appendChild(h('h2', '', finished ? 'You finished this lesson' : 'Welcome back'));
    box.appendChild(h('p', 'be-lead', finished
      ? 'Look through it again with your answers, or start fresh.'
      : 'You stopped at card ' + (at + 1) + ' of ' + cards.length + '.'));
    var actions = h('div', 'be-actions');
    var cont = h('button', 'be-btn', finished ? 'Look through it' : 'Continue from card ' + (at + 1));
    cont.type = 'button';
    cont.addEventListener('click', function () { begin(finished ? 0 : at, false); });
    var again = h('button', 'be-btn is-quiet', 'Start again');
    again.type = 'button';
    again.addEventListener('click', function () { begin(0, true); });
    actions.appendChild(cont);
    actions.appendChild(again);
    box.appendChild(actions);
    stage.appendChild(box);
    for (var s = 0; s < segs.length; s++) segs[s].classList.toggle('is-seen', s < at);
    count.textContent = '';
  } else {
    begin(0, false);
  }
})();
