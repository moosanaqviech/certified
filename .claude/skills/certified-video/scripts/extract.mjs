// Pull video source material out of a Certified lesson or exam.
//
//   node extract.mjs lesson <lesson.html> --out <dir> [--frozen-art]
//     -> <dir>/lesson.json (palette, course, every card's text, quiz cards, tables)
//     -> <dir>/art/<key>.png for every SVG in the lesson's A object (transparent, 1600 px wide)
//   node extract.mjs exam <exam.html> --out <dir>
//     -> <dir>/exam.json (E config, questions with plain-text stem, options, correct, explain, ref, header)
//
// Sealed full-length mocks are refused: their questions must never leave the exam page.
// Needs Playwright with Chromium (`npm i playwright && npx playwright install chromium` on a new machine).
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); }
catch { ({ chromium } = await import("playwright")); }

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FONTS = path.join(HERE, "..", "assets", "fonts");

const SEALED = [
  /(^|\/)mock-exam-\d+\.html$/,
  /databricks-data-analyst-associate\/da-practice-exam-0[5-7]\.html$/,
  /databricks-machine-learning-associate\/ml-practice-exam-0[45]\.html$/,
  /databricks-generative-ai-engineer-associate\/genai-practice-exam-0[5-7]\.html$/,
  /databricks-apache-spark-developer-associate\/spark-practice-exam-0[4-6]\.html$/,
  /aws-machine-learning-engineer-associate-mla-c02\/mla-c02-practice-exam-0[5-7]\.html$/,
  /aws-ai-practitioner\/aif-practice-exam-0[5-7]\.html$/,
  /aws-solutions-architect-associate\/saa-practice-exam-0[5-7]\.html$/,
];

const [, , mode, file, ...rest] = process.argv;
const outIdx = rest.indexOf("--out");
const out = outIdx >= 0 ? rest[outIdx + 1] : null;
if (!["lesson", "exam"].includes(mode) || !file || !out) {
  console.error("usage: node extract.mjs lesson|exam <file.html> --out <dir> [--frozen-art]");
  process.exit(2);
}
const abs = path.resolve(file);
const rel = abs.split(path.sep).join("/");
fs.mkdirSync(out, { recursive: true });

function courseInfo(htmlPath) {
  const dir = path.dirname(htmlPath);
  const folder = path.basename(dir);
  let name = folder;
  const idx = path.join(dir, "index.html");
  if (fs.existsSync(idx)) {
    const m = fs.readFileSync(idx, "utf8").match(/<title>([^<]+)<\/title>/i);
    if (m) name = m[1].split(/\s+Course\b|\s+[|·]\s+/)[0].trim();
  }
  return { folder, name, url: `https://certify.courses/${folder}/` };
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("file://" + abs, { waitUntil: "load" });

if (mode === "exam") {
  if (SEALED.some((re) => re.test(rel))) {
    console.error(`refused: ${path.basename(abs)} is a sealed full-length mock. Its questions must not be published or reused.`);
    await browser.close(); process.exit(3);
  }
  const data = await page.evaluate(() => {
    const strip = (s) => { const d = document.createElement("div"); d.innerHTML = String(s); return d.textContent.replace(/\s+/g, " ").trim(); };
    // eslint-disable-next-line no-undef
    const qs = QUESTIONS.map((q, i) => ({
      index: i, ref: q.ref || null, question: strip(q.q), options: q.opts.map(strip),
      correct: q.correct, multi: Array.isArray(q.correct), explain: strip(q.explain || ""),
    }));
    // eslint-disable-next-line no-undef
    return { E: typeof E !== "undefined" ? E : null, questions: qs };
  });
  const src = fs.readFileSync(abs, "utf8");
  const block = src.slice(src.indexOf("const QUESTIONS"));
  const headers = [...block.matchAll(/\/\*\s*(Ch\s*\d+[^*]*?)\s*\*\//g)].map((m) => m[1].trim());
  if (headers.length === data.questions.length) data.questions.forEach((q, i) => (q.header = headers[i]));
  data.source = path.relative(process.cwd(), abs);
  data.course = courseInfo(abs);
  fs.writeFileSync(path.join(out, "exam.json"), JSON.stringify(data, null, 2));
  console.log(`exam.json: ${data.questions.length} questions`);
  await browser.close();
  process.exit(0);
}

// ---------------------------------------------------------------- lesson
const lesson = await page.evaluate(() => {
  const vars = {};
  for (const sheet of document.styleSheets) {
    let rules = [];
    try { rules = sheet.cssRules; } catch { continue; }
    for (const r of rules) if (r.selectorText === ":root") for (const n of r.style) if (n.startsWith("--")) vars[n] = r.style.getPropertyValue(n).trim();
  }
  const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
  const tmp = document.createElement("div");
  // eslint-disable-next-line no-undef
  const artKeys = typeof A !== "undefined" ? Object.keys(A) : [];
  // eslint-disable-next-line no-undef
  const cardsOut = cards.map((c, i) => {
    tmp.innerHTML = c.html;
    const fb = tmp.querySelector(".feedback");
    const choices = [...tmp.querySelectorAll("[data-correct]")];
    const pills = [...tmp.querySelectorAll(".pill")].map((p) => {
      const b = p.querySelector("b"); const title = b ? clean(b.textContent) : "";
      return { title, text: clean(p.textContent).slice(title.length).trim() };
    });
    const tables = [...tmp.querySelectorAll("table")].map((t) => [...t.querySelectorAll("tr")].map((tr) => [...tr.children].map((td) => clean(td.textContent))));
    // Comparison tables in v2 lessons are rows of inline display:grid divs under one parent.
    const groups = new Map();
    for (const g of tmp.querySelectorAll('[style*="display:grid"], [style*="display: grid"]')) {
      if (g.children.length < 2) continue;
      if (!groups.has(g.parentElement)) groups.set(g.parentElement, []);
      groups.get(g.parentElement).push([...g.children].map((c) => clean(c.textContent)));
    }
    for (const rows of groups.values()) if (rows.length >= 2) tables.push(rows);
    const feedback = fb ? clean(fb.textContent) : "";
    if (fb) fb.remove();
    return {
      index: i,
      kind: choices.length ? "quiz" : i === 0 ? "cover" : "content",
      last: !!c.last, steps: c.steps || 0,
      eyebrow: clean(tmp.querySelector(".eyebrow")?.textContent),
      heading: clean(tmp.querySelector("h1, h2")?.textContent),
      lead: clean(tmp.querySelector(".lead")?.textContent),
      pills, tables,
      choices: choices.map((ch) => {
        const c2 = ch.cloneNode(true); c2.querySelectorAll(".key").forEach((k) => k.remove());
        return { text: clean(c2.textContent).replace(/^[A-D]\s+/, ""), correct: ch.dataset.correct === "true" };
      }),
      feedback,
      // eslint-disable-next-line no-undef
      art: artKeys.filter((k) => c.html.includes(A[k])),
      text: clean(tmp.textContent),
    };
  });
  // eslint-disable-next-line no-undef
  return { title: document.title, vars, nav: typeof NAV !== "undefined" ? NAV : null, artKeys, cards: cardsOut };
});
lesson.source = path.relative(process.cwd(), abs);
lesson.course = courseInfo(abs);
lesson.theme = { bg: lesson.vars["--bg"], bg_tint: lesson.vars["--bg-tint"], accent: lesson.vars["--accent"], accent_ink: lesson.vars["--accent-ink"] };

// Render each SVG on a clean transparent page that carries the lesson's CSS variables and fonts.
const artDir = path.join(out, "art");
fs.mkdirSync(artDir, { recursive: true });
const frozen = rest.includes("--frozen-art");
const rootCss = Object.entries(lesson.vars).map(([k, v]) => `${k}:${v};`).join("");
const face = (fam, file, w) => `@font-face{font-family:"${fam}";src:url("file://${path.join(FONTS, file)}");font-weight:${w}}`;
const fontCss = [face("Fraunces", "Fraunces-SemiBold.ttf", 600), face("Fraunces", "Fraunces-Bold.ttf", 700),
  face("Hanken Grotesk", "HankenGrotesk-Medium.ttf", 500), face("Hanken Grotesk", "HankenGrotesk-SemiBold.ttf", 600),
  face("Hanken Grotesk", "HankenGrotesk-ExtraBold.ttf", 800)].join("");
const artPage = await browser.newPage({ viewport: { width: 1700, height: 1200 } });
if (frozen) await artPage.emulateMedia({ reducedMotion: "reduce" });
const svgs = await page.evaluate(() => (typeof A !== "undefined" ? A : {})); // eslint-disable-line no-undef
for (const [key, svg] of Object.entries(svgs)) {
  if (typeof svg !== "string" || !svg.includes("<svg")) continue;
  await artPage.setContent(`<html><head><style>:root{${rootCss}}${fontCss}html,body{margin:0;background:transparent;font-family:"Hanken Grotesk"}#w svg{width:1600px;height:auto;display:block}</style></head><body><div id="w">${svg}</div></body></html>`);
  await artPage.waitForTimeout(frozen ? 200 : 1500);
  const el = artPage.locator("#w svg").first();
  if (await el.count()) await el.screenshot({ path: path.join(artDir, `${key}.png`), omitBackground: true });
}
fs.writeFileSync(path.join(out, "lesson.json"), JSON.stringify(lesson, null, 2));
console.log(`lesson.json: ${lesson.cards.length} cards; art: ${fs.readdirSync(artDir).join(", ")}`);
await browser.close();
