test-authoring-guide.md
# Practice Exam Authoring Guide
 
How to build a new practice exam from `test-template.html` without regenerating the whole file. Same principle as the lesson workflow: the engine is frozen, only the payload changes.
 
---
 
## 1. The frozen engine
 
`test-template.html` contains the complete exam experience:
 
- Intro screen with badge, title, blurb, coverage line, and facts row (question count, timer, pass bar)
- Timed test screen: one question at a time, A-F options, flag toggle, numbered nav dots, Prev / Next, progress bar tied to answered count
- Single-answer and multiple-response questions in the same exam, decided per question by the shape of `correct` (see section 4)
- Timer turns gold in the last 2 minutes and auto-submits at 0:00
- Submit confirmation if questions are unanswered
- Results screen with animated score ring, pass / fail verdict against the pass bar
- Full answer review: correct option in green, your wrong pick in red, "Why:" explanation per question, retake button
Never edit the `<style>` block or anything below the `ENGINE - do not edit below this line` marker. The intro facts, header label, page title, and timer all derive from the payload automatically.
 
## 2. The single injection zone
 
Everything per-exam lives between these markers in the script section:
 
```
/* ===== EXAM PAYLOAD - BEGIN ===== */
...E config object + QUESTIONS array...
/* ===== EXAM PAYLOAD - END ===== */
```
 
To build a new exam: copy `test-template.html`, rename it (`practice-exam-NN.html`), and replace the payload block.
 
## 3. The `E` config object
 
| Field      | What it does                                                          | Example                                                       |
| ---------- | --------------------------------------------------------------------- | ------------------------------------------------------------- |
| `name`     | Header label, intro h1, browser tab title                             | `"Practice Exam 3"`                                           |
| `badge`    | Gold uppercase eyebrow on the intro                                    | `"Databricks DE Associate"`                                   |
| `blurb`    | One-sentence pitch under the title                                     | Keep the standard "scenario-based... single best answer" line |
| `coverage` | Faint line stating scope                                               | `"Covers all 17 chapters: Units 1-3."`                        |
| `minutes`  | Timer length. Rule: 2 minutes per question (matches real exam pace)    | 17 questions → `34`                                           |
| `pass`     | Pass threshold percent. DE Associate is approximately 70               | `70`                                                          |
 
## 4. The question object
 
```js
{
  q:`Scenario text. Inline HTML allowed: <code>COPY INTO</code>, <em>emphasis</em>.`,
  opts:[ "A", "B", "C", "D" ],   // exactly 4, plain text or inline <code>
  correct:2,                      // 0-based index into opts
  explain:`Teaches the why. Rendered after submit, prefixed with "Why:".`
}
```
 
Backtick template literals are required for `q` and `explain` (they often contain quotes). Avoid raw backticks and `${` inside the text.

### Multiple-response questions

Give `correct` an **array** of indexes instead of a scalar, and the engine switches that one question to multi-select:

```js
{
  q:`Scenario. Say the count in the text too: "Which TWO actions reduce the record count?"`,
  opts:[ "A", "B", "C", "D", "E" ],   // 4 to 6 options allowed on multi
  correct:[0,1],                       // at least 2, and never all of them
  explain:`Why both keys are right, and why the most tempting distractor is wrong.`
}
```

What the engine does with it, all derived from the payload, nothing to configure:

- The question label reads `QUESTION 3 · SELECT TWO`, so the learner is told how many to pick.
- Options toggle: clicking a selected option deselects it. Single-answer questions in the same exam still replace their selection, because the behavior is decided per question, not per exam.
- Scoring is **all or nothing**. A partial or superset answer scores zero, which is how the vendors grade these.
- The review screen greens every option in the key and reds any wrong pick.

Constraints the validator enforces: single-answer questions stay at exactly 4 options; multi questions carry 4 to 6; `correct` needs at least 2 indexes, no duplicates, all in range, and never every option. Keep multi questions to roughly a quarter of an exam at most (the validator warns above that), since the real exams are mostly single answer. Readiness quizzes do not support multi at all.
 
## 5. Question writing rules
 
- **Scenario-based, single best answer by default.** Open with a concrete situation (a team, a job, a symptom), then ask what is true, what fixes it, or which choice fits. Never bare definition recall. Use a multiple-response question only where the real exam has them and the concept genuinely needs two answers (see section 4); never to dodge the work of picking one best distractor.
- **Match `E.blurb` to the format.** The standard line ends "Pick the single best answer." An exam containing multi questions must not say that: use "Most questions have one best answer; a few ask you to select two." instead.
- **Coverage plan first.** Default pattern is one question per chapter in scope, in chapter order. State the plan in the payload as a comment header per question (`/* Ch 12 - Joins */`).
- **Distractors must be plausible**: true statements applied to the wrong situation, common misconceptions, or the right tool for a different signal. No joke options.
- **`explain` does two jobs**: why the correct answer is right, and why the most tempting distractor is wrong. 2-4 sentences.
- **Spread the correct letters.** Across the exam, A/B/C/D should each be correct roughly a quarter of the time. Never three of the same letter in a row.
- **Combine concepts where natural.** The strongest questions touch two chapters at once (for example, ingestion choice plus medallion placement), mirroring the real exam.
- **No em dashes** anywhere in question, option, or explanation text. Use colons, commas, parentheses, or periods.
- Trade-off chapters get a "which signal picks which option" style question, consistent with how those lessons teach.
## 6. Low-token workflow
 
1. Start a **fresh chat** for each new exam.
2. Ask only for the **payload** (the `E` object and `QUESTIONS` array), stating the scope: which units and chapters, how many questions.
3. Paste the payload between the BEGIN / END markers in a copy of `test-template.html`.
4. Wire it into `index.html`: add or update the quicklink and the practice exam card `href`.
5. Sanity check: open the file, confirm the facts row shows the right counts, answer one question, submit, confirm review renders.
## 7. Conventions
 
- File naming: `practice-exam-01.html`, `practice-exam-02.html`, ...
- The exam shell keeps the dark gold palette in all exams. Unlike lessons, exams do not get per-file palettes: gold is the exam identity color across the product.
- Exams are standalone files, no shared JS imports, so they work on Netlify and when opened locally.
 
