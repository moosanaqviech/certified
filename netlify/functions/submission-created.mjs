// Emails each "Report a question" submission to the site owner.
//
// Netlify runs a function named submission-created automatically after every
// verified Netlify Forms submission (spam-flagged ones never reach it), so no
// path or wiring is needed: the filename is the trigger. It must stay free of a
// `config.path`, which would turn it into a plain HTTP endpoint instead.
//
// Mail goes out through the Resend HTTP API (plain fetch, no dependency):
//   RESEND_API_KEY     -> Resend API key (SECRET, server only). If unset the
//                         function no-ops; the submission is still stored in
//                         the Netlify Forms dashboard either way.
//   REPORT_EMAIL_TO    -> where reports are sent (your inbox). Required.
//   REPORT_EMAIL_FROM  -> sender, on a domain verified in Resend, e.g.
//                         "Certify reports <reports@certify.courses>".
//                         Defaults to Resend's onboarding sender, which can
//                         only deliver to the Resend account owner's address.
// When the reporter left an email it becomes Reply-To, so replying from your
// inbox answers them directly.

const FORM = "report-question";

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function validEmail(v) {
  const s = String(v || "").trim();
  return s.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

// Single-line, bounded text for the subject (defence against odd payloads).
function oneLine(v, max) {
  return String(v || "").replace(/\s+/g, " ").trim().slice(0, max);
}

export const handler = async (event) => {
  let payload;
  try {
    payload = JSON.parse(event.body || "{}").payload || {};
  } catch (_e) {
    return { statusCode: 400, body: "Bad payload" };
  }

  // Other forms on the site (if any are added later) are not reports.
  if (payload.form_name !== FORM) return { statusCode: 200, body: "Ignored" };

  const key = process.env.RESEND_API_KEY;
  const to = process.env.REPORT_EMAIL_TO;
  if (!key || !to) {
    console.warn("submission-created: RESEND_API_KEY or REPORT_EMAIL_TO unset, skipping email");
    return { statusCode: 200, body: "Not configured" };
  }
  const from = process.env.REPORT_EMAIL_FROM || "Certify reports <onboarding@resend.dev>";

  const d = payload.data || {};
  const course = String(d.course || "(none)");
  const reporter = String(d.email || "").trim();
  const question = String(d.question || "");
  const issue = String(d.issue || "");
  const when = payload.created_at || new Date().toISOString();

  const subject = `Question report: ${oneLine(course, 60)}: ${oneLine(question, 70)}`;

  const text = [
    `Course: ${course}`,
    `Reporter: ${reporter || "(no email left)"}`,
    `Submitted: ${when}`,
    "",
    "Question text or ID:",
    question,
    "",
    "What's wrong:",
    issue,
    "",
    "All submissions: Netlify dashboard > Forms > report-question",
  ].join("\n");

  const html = `
<p><b>Course:</b> ${escapeHtml(course)}<br>
<b>Reporter:</b> ${reporter ? escapeHtml(reporter) : "(no email left)"}<br>
<b>Submitted:</b> ${escapeHtml(when)}</p>
<p><b>Question text or ID:</b></p>
<pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(question)}</pre>
<p><b>What's wrong:</b></p>
<pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(issue)}</pre>
<p style="color:#888">All submissions: Netlify dashboard, Forms, report-question.</p>`;

  const body = { from, to: to.split(",").map((s) => s.trim()).filter(Boolean), subject, text, html };
  if (validEmail(reporter)) body.reply_to = reporter;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      const t = await r.text();
      console.error(`submission-created: resend ${r.status}: ${t.slice(0, 200)}`);
      return { statusCode: 502, body: "Email failed" };
    }
  } catch (e) {
    console.error("submission-created: resend_error", e && e.message ? e.message : e);
    return { statusCode: 502, body: "Email failed" };
  }

  return { statusCode: 200, body: "Sent" };
};
