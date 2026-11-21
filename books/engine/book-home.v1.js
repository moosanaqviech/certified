/* Book home v1 (books/<book-id>/index.html).
   The page lists its lessons as static HTML. This script reads the learner's
   saved state and marks each idea unseen, in progress, settling or mastered,
   shows how many review cards are due, and offers the notes export and the
   clear-data control. It fetches nothing, so the page works from a local file.

   Expected markup:
     <main data-book="<book-id>">
       <a data-lesson="N" data-can="capability statement"> ... <span data-status></span></a>
       <div data-review></div>  <div data-tools></div> */
(function () {
  'use strict';

  var root = document.querySelector('[data-book]');
  if (!root) return;
  var book = root.getAttribute('data-book');
  var PKEY = 'books.v1.progress.' + book;
  var NKEY = 'books.v1.notes.' + book;
  var RKEY = 'books.v1.review';
  var CKEY = 'books.v1.commitments';
  var MASTERED_BOX = 3;

  function read(key, fallback) {
    try {
      var v = window.localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) { return fallback; }
  }
  function h(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  var progress = read(PKEY, {});
  var notes = read(NKEY, {});
  var queue = read(RKEY, {});
  var now = Date.now();
  var mine = Object.keys(queue).filter(function (id) { return id.indexOf(book + '/') === 0; });

  /* ---------- capability map: one state per lesson's idea ---------- */
  var links = root.querySelectorAll('[data-lesson]');
  var mastered = 0;
  for (var i = 0; i < links.length; i++) {
    var n = links[i].getAttribute('data-lesson');
    var me = progress[n];
    var status = links[i].querySelector('[data-status]');
    var state = 'unseen', label = 'Not started';
    if (me && !me.completed) {
      state = 'progress';
      label = 'In progress';
    } else if (me) {
      var cards = mine.filter(function (id) { return id.indexOf(book + '/' + n + '/') === 0; });
      var settled = cards.filter(function (id) {
        return queue[id].retired || queue[id].box >= MASTERED_BOX;
      }).length;
      if (cards.length && settled === cards.length) {
        state = 'mastered';
        label = 'Mastered';
        mastered++;
      } else {
        state = 'settling';
        label = 'Learned, still settling: ' + settled + ' of ' + cards.length + ' review cards held';
      }
    }
    links[i].setAttribute('data-state', state);
    if (status) status.textContent = label;
    var can = links[i].getAttribute('data-can');
    if (can && (state === 'settling' || state === 'mastered')) {
      links[i].appendChild(h('span', 'bh-can', 'You can now: ' + can));
    }
  }

  /* ---------- review entry ---------- */
  var slot = root.querySelector('[data-review]');
  if (slot && mine.length) {
    var due = mine.filter(function (id) {
      return queue[id].file && !queue[id].retired && Date.parse(queue[id].due) <= now;
    }).length;
    var a = h('a', 'bh-review' + (due ? ' is-due' : ''),
      due ? (due === 1 ? '1 card is due for review' : due + ' cards are due for review') : 'Review: nothing due today');
    a.href = '../review/';
    slot.appendChild(a);
  }

  /* ---------- notes export and clear data ---------- */
  var tools = root.querySelector('[data-tools]');
  if (tools && (Object.keys(progress).length || Object.keys(notes).length)) {
    if (Object.keys(notes).length) {
      var exp = h('button', 'be-link', 'Export my notes');
      exp.type = 'button';
      exp.addEventListener('click', function () {
        var title = (document.querySelector('h1') || {}).textContent || book;
        var out = [title + ': my notes', ''];
        Object.keys(notes).sort().forEach(function (key) {
          var lesson = key.split('/')[0];
          var link = root.querySelector('[data-lesson="' + lesson + '"] [data-title]');
          out.push('Lesson ' + lesson + (link ? ': ' + link.textContent : ''));
          out.push(notes[key]);
          out.push('');
        });
        var blob = new Blob([out.join('\n')], { type: 'text/plain' });
        var url = URL.createObjectURL(blob);
        var dl = h('a');
        dl.href = url;
        dl.download = book + '-notes.txt';
        document.body.appendChild(dl);
        dl.click();
        document.body.removeChild(dl);
        window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      });
      tools.appendChild(exp);
    }
    var clear = h('button', 'be-link', 'Clear my data for this book');
    clear.type = 'button';
    clear.addEventListener('click', function () {
      if (!window.confirm('Remove your progress, notes and review history for this book from this device? This cannot be undone.')) return;
      try {
        window.localStorage.removeItem(PKEY);
        window.localStorage.removeItem(NKEY);
        [RKEY, CKEY].forEach(function (key) {
          var all = read(key, {});
          Object.keys(all).forEach(function (id) {
            if (id.indexOf(book + '/') === 0) delete all[id];
          });
          window.localStorage.setItem(key, JSON.stringify(all));
        });
      } catch (e) {}
      window.location.reload();
    });
    tools.appendChild(clear);
  }
})();
