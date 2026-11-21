/* Book review page v1 (books/review/).
   Reads the review queue the lesson engine writes (books.v1.review), builds a
   session of due cards and hands it to the lessons, which show each card in
   review mode (see book-engine.v1.js). Also shows the result of the session
   just finished, and asks about commitments made a week ago. */
(function () {
  'use strict';

  var mount = document.getElementById('review');
  if (!mount) return;

  var RKEY = 'books.v1.review';
  var SKEY = 'books.v1.session';
  var CKEY = 'books.v1.commitments';
  var MAX = 8;
  var DAY = 24 * 60 * 60 * 1000;
  var WEEK = 7 * DAY;

  function read(store, key, fallback) {
    try {
      var v = store.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) { return fallback; }
  }
  function write(store, key, value) {
    try { store.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  function h(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function track(name, params) {
    try { if (typeof window.gtag === 'function') window.gtag('event', name, params); } catch (e) {}
  }
  function lessonOf(id) { return id.split('/').slice(0, 2).join('/'); }

  var queue = read(window.localStorage, RKEY, {});
  var now = Date.now();
  var live = Object.keys(queue).filter(function (id) {
    return queue[id] && queue[id].file && !queue[id].retired;
  }).sort(function (a, b) {
    return Date.parse(queue[a].due) - Date.parse(queue[b].due);
  });
  var due = live.filter(function (id) { return Date.parse(queue[id].due) <= now; });

  /* Oldest first, at most MAX, and never two in a row from the same lesson
     when another lesson has a card waiting. */
  function build(ids) {
    var pool = ids.slice(0, MAX), out = [], last = null;
    while (pool.length) {
      var pick = 0;
      for (var k = 0; k < pool.length; k++) {
        if (lessonOf(pool[k]) !== last) { pick = k; break; }
      }
      var id = pool.splice(pick, 1)[0];
      last = lessonOf(id);
      out.push({ id: id, file: queue[id].file, card: id.split('/').slice(2).join('/') });
    }
    return out;
  }
  function start(ids) {
    var items = build(ids);
    if (!items.length) return;
    write(window.sessionStorage, SKEY, { queue: items, pos: 0, started: new Date().toISOString() });
    window.location.href = '../' + items[0].file + '?review=1';
  }
  function button(label, quiet, onClick) {
    var b = h('button', 'be-btn' + (quiet ? ' is-quiet' : ''), label);
    b.type = 'button';
    b.addEventListener('click', onClick);
    return b;
  }

  /* ---------- the session just finished ---------- */
  var finished = false;
  try { finished = !!new URLSearchParams(window.location.search).get('done'); } catch (e) {}
  var session = read(window.sessionStorage, SKEY, null);
  if (finished && session && session.queue) {
    var asked = session.queue.filter(function (it) { return it.done && !it.skipped; });
    var right = asked.filter(function (it) { return it.ok; }).length;
    var box = h('section', 'bh-panel');
    box.appendChild(h('p', 'be-eyebrow', 'Session complete'));
    box.appendChild(h('h1', '', right + ' of ' + asked.length + ' correct'));
    var up = asked.filter(function (it) { return it.ok && it.box <= 5; }).length;
    var retired = asked.filter(function (it) { return it.box === 6; }).length;
    var back = asked.length - right;
    var lines = [];
    if (up) lines.push(up + ' moved up and will come back later than before.');
    if (retired) lines.push(retired + ' answered right at the longest gap: retired.');
    if (back) lines.push(back + ' will come back tomorrow.');
    lines.forEach(function (t) { box.appendChild(h('p', 'bh-line', t)); });
    mount.appendChild(box);
    track('review_session', { cards: asked.length, correct: right });
    try { window.sessionStorage.removeItem(SKEY); } catch (e) {}
    try { window.history.replaceState(null, '', window.location.pathname); } catch (e) {}
  }

  /* ---------- what is due ---------- */
  var panel = h('section', 'bh-panel');
  if (due.length) {
    panel.appendChild(h('p', 'be-eyebrow', 'Review'));
    panel.appendChild(h('h1', '', due.length === 1 ? '1 card is due' : due.length + ' cards are due'));
    panel.appendChild(h('p', 'bh-line', due.length > MAX
      ? 'A session is ' + MAX + ' cards. Start with the oldest.'
      : 'A few minutes. Questions return just as they are about to fade.'));
    panel.appendChild(button('Start review', false, function () { start(due); }));
  } else if (live.length) {
    var next = Date.parse(queue[live[0]].due);
    var days = Math.max(1, Math.ceil((next - now) / DAY));
    panel.appendChild(h('p', 'be-eyebrow', 'Review'));
    panel.appendChild(h('h1', '', 'Nothing is due today'));
    panel.appendChild(h('p', 'bh-line', 'Your next card comes back ' + (days === 1 ? 'tomorrow' : 'in ' + days + ' days') +
      '. Waiting is part of the method: recalling something after a gap is what makes it stick.'));
    panel.appendChild(button('Practise early anyway', true, function () { start(live); }));
  } else {
    panel.appendChild(h('p', 'be-eyebrow', 'Review'));
    panel.appendChild(h('h1', '', 'Nothing to review yet'));
    panel.appendChild(h('p', 'bh-line', 'Finish a lesson and its questions come back here, starting the next day.'));
  }
  mount.appendChild(panel);

  /* ---------- commitments made a week ago ---------- */
  var made = read(window.localStorage, CKEY, {});
  Object.keys(made).forEach(function (id) {
    var c = made[id];
    if (!c || c.asked || now - Date.parse(c.t) < WEEK) return;
    var box = h('section', 'bh-panel');
    box.appendChild(h('p', 'be-eyebrow', 'A week ago you said'));
    box.appendChild(h('p', 'bh-quote', c.text));
    box.appendChild(h('p', 'bh-line', 'Did you do it?'));
    var row = h('div', 'bh-row');
    function answer(did) {
      c.asked = { t: new Date().toISOString(), did: did };
      write(window.localStorage, CKEY, made);
      track('commitment_checkin', { did: did });
      row.hidden = true;
      box.appendChild(h('p', 'bh-line', did
        ? 'Good. Doing it once is what turns an idea into a habit.'
        : 'Noted. The plan still stands: pick the next moment it could apply.'));
    }
    row.appendChild(button('Yes', false, function () { answer(true); }));
    row.appendChild(button('Not yet', true, function () { answer(false); }));
    box.appendChild(row);
    mount.appendChild(box);
  });
})();
