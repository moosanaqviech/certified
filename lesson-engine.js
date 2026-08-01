/* Certified lesson engine, shared by every lesson page.

   Loaded by each lesson as a classic script AFTER its inline payload, so the
   payload's top-level NAV / A / cards bindings are already in scope:

     <script>  ...payload...  </script>
     <script src="../lesson-engine.js?v=1"></script>

   Order matters and the tag must stay a classic script: type="module" would
   not load when a lesson is opened straight off disk (file://).

   NAV is required. A lesson without it renders nothing, which is why
   scripts/validate.py fails any lesson that references this file without one.

   Changing this file changes all lessons that reference it at once, so bump
   the ?v= on every lesson that loads it in the same commit; a stale cached
   copy paired with a new payload is the one way this can break in production.
*/

const vp = document.getElementById('viewport');
const topbar = document.getElementById('topbar');
const glow = document.getElementById('glow');
const nextBtn = document.getElementById('next');
const backBtn = document.getElementById('back');
const catalogBtn = document.getElementById('catalog');
const footerEl = document.getElementById('footer');
let i = 0;
const answered = {};

cards.forEach(() => { const s = document.createElement('div'); s.className = 'seg'; s.innerHTML = '<i></i>'; topbar.appendChild(s); });
const segs = [...topbar.children];

const els = cards.map((c) => { const d = document.createElement('div'); d.className = 'card'; d.innerHTML = c.html; vp.appendChild(d); return d; });

function render() {
  cards.forEach((c, idx) => {
    const el = els[idx];
    el.classList.remove('in','out-left');
    if (idx === i) el.classList.add('in');
    else if (idx < i) el.classList.add('out-left');
    segs[idx].classList.toggle('done', idx < i);
    segs[idx].classList.toggle('active', idx === i);
  });
  glow.style.background = cards[i].glow || 'transparent';
  const c = cards[i];
  const end = !!c.last;
  const twoUp = end && !!NAV.next;   // last chapter of a course shows one button
  backBtn.hidden = end;
  backBtn.disabled = (i === 0);
  catalogBtn.hidden = !twoUp;
  footerEl.classList.toggle('end', twoUp);
  if (c.quiz && !answered[i]) { nextBtn.disabled = true; nextBtn.textContent = 'Pick an answer'; }
  else if (end) { nextBtn.disabled = false; nextBtn.textContent = NAV.next ? NAV.nextLabel + ' →' : 'Back to catalog'; }
  else if (i === 0) { nextBtn.disabled = false; nextBtn.textContent = 'Begin lesson'; }
  else { nextBtn.disabled = false; nextBtn.textContent = 'Continue'; }
  if (c.quiz) wireQuiz(els[i], i);
}

function wireQuiz(cardEl, idx) {
  const choices = [...cardEl.querySelectorAll('.choice')];
  const fb = cardEl.querySelector('.feedback');
  choices.forEach(ch => {
    ch.onclick = () => {
      if (answered[idx]) return;
      answered[idx] = true;
      choices.forEach(o => {
        if (o.dataset.correct === 'true') o.classList.add('correct');
        else if (o === ch) o.classList.add('wrong');
        else o.classList.add('dim');
      });
      fb.classList.add('show');
      nextBtn.disabled = false; nextBtn.textContent = 'Continue';
    };
  });
}

function go(n) { if (n < 0 || n >= cards.length) return; i = n; render(); }

nextBtn.onclick = () => {
  if (cards[i].last) { location.href = NAV.next || NAV.catalog; return; }
  go(i + 1);
};
backBtn.onclick = () => go(i - 1);
catalogBtn.onclick = () => { location.href = NAV.catalog; };

/* Keys and swipes only move between cards. Leaving the lesson always takes
   a deliberate tap, so a stray swipe on the final card cannot navigate away. */
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' && !nextBtn.disabled && !cards[i].last) go(i + 1);
  if (e.key === 'ArrowLeft' && i > 0) go(i - 1);
});

let sx = 0;
vp.addEventListener('touchstart', e => sx = e.touches[0].clientX, {passive:true});
vp.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - sx;
  if (dx < -50 && !nextBtn.disabled && !cards[i].last) go(i + 1);
  if (dx > 50 && i > 0) go(i - 1);
});

render();
