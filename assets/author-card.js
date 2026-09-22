/* Author partial. The site has no include mechanism (plain static files), so
   this script renders the author block into every element carrying
   data-author-card. Two variants:
     data-variant="strip"  (default) photo, name, title line, one-line note,
                           link to /about. Used on course homes, the catalog,
                           and practice result screens.
     data-variant="byline" smaller, single line. Used under blog post titles.
   Styles are injected once and use the brand tokens directly, because host
   pages name their CSS variables differently. Paths are root-relative, so
   the block works from any folder depth on the deployed site. */
(function () {
  "use strict";
  var AUTHOR = {
    name: "Moosa",
    title: "Technical Trainer",
    photo: "/assets/moosa.jpg",
    about: "/about",
    note: "Runs certification cohorts through these exams and writes every lesson from the official guides."
  };
  var CSS =
    ".cc-author{display:flex;align-items:center;gap:14px;font-family:'Hanken Grotesk',system-ui,-apple-system,sans-serif;color:#e9e6dd;font-size:13.5px;line-height:1.45;text-align:left}" +
    ".cc-author img{width:44px;height:44px;border-radius:50%;object-fit:cover;flex:none;border:1px solid rgba(233,230,221,.14);display:block}" +
    ".cc-author b{font-weight:600;color:#e9e6dd}" +
    ".cc-author .cc-author__t{color:#8b90a0}" +
    ".cc-author .cc-author__n{display:block;color:#8b90a0;font-size:12.5px;margin-top:1px}" +
    ".cc-author a{color:#e5c988;text-decoration:none;border-bottom:1px solid rgba(217,164,65,.35);padding-bottom:1px}" +
    ".cc-author a:hover{color:#d9a441}" +
    ".cc-author--byline{gap:10px;font-size:13px}" +
    ".cc-author--byline img{width:32px;height:32px}" +
    ".cc-author--byline .cc-author__n{display:inline;margin:0 0 0 6px;font-size:13px}" +
    ".cc-author--card{padding:16px 18px;border:1px solid #272b36;border-radius:14px;background:#1b1e26}";

  function inject() {
    if (document.getElementById("cc-author-css")) return;
    var s = document.createElement("style");
    s.id = "cc-author-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function render(el) {
    var v = el.getAttribute("data-variant") || "strip";
    var note = el.getAttribute("data-note") || AUTHOR.note;
    var html =
      '<img src="' + AUTHOR.photo + '" alt="' + AUTHOR.name + '" width="44" height="44" loading="lazy">' +
      '<div><b>' + AUTHOR.name + '</b><span class="cc-author__t">, ' + AUTHOR.title + '</span>' +
      '<span class="cc-author__n">' + (v === "byline" ? "" : note + " ") +
      '<a href="' + AUTHOR.about + '">About the author</a></span></div>';
    el.className = (el.className ? el.className + " " : "") + "cc-author cc-author--" + v;
    el.innerHTML = html;
    el.removeAttribute("data-author-card");
  }

  function run() {
    var els = document.querySelectorAll("[data-author-card]");
    if (!els.length) return;
    inject();
    for (var i = 0; i < els.length; i++) render(els[i]);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
  /* Result screens are rendered later by the page's own script; expose a hook. */
  window.ccAuthorRender = run;
})();
