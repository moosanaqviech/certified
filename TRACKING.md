# Tracking + email capture

This documents the analytics foundation (GA4, Meta Pixel, Meta Conversions
API) and the readiness-quiz email capture, plus how to verify each event.

## What fires where

| Event | Client (browser) | Server (CAPI, source of truth) | Dedup key (`event_id`) |
| --- | --- | --- | --- |
| `PageView` | pixel snippet on every page | n/a | n/a |
| `Purchase` | `unlock/index.html` success branch | `stripe-webhook.mjs` -> `_meta.mjs` | `pur_<stripe_session_id>` |
| `Lead` | readiness engine `submitEmail` | `subscribe.mjs` -> `_meta.mjs` | `lead_<uuid>` minted in the browser |

- GA4 (`G-GBFP6K89Q6`) and the Meta Pixel (`4477591755892377`) base snippets
  are already inlined in every page. This work adds the conversion events on
  top; it does not re-install the base tags.
- The Meta access token is never sent to the browser. Email is hashed
  (SHA-256) server-side in `netlify/functions/_meta.mjs` before it reaches
  Meta.
- Both sides of each conversion use the same `event_id` and event name, so
  Meta deduplicates the browser/server pair and keeps the richer record.

## Files

- `netlify/functions/_meta.mjs` - shared CAPI helper (hashing, fbp/fbc, send).
- `netlify/functions/meta-capi.mjs` - `/api/meta-capi` HTTP endpoint (browser
  events + isolated testing). The Purchase/Lead paths call `_meta.mjs`
  directly instead, so no token round-trip and no extra hop.
- `netlify/functions/subscribe.mjs` - `/api/subscribe`, the email sink:
  Buttondown subscribe (tag `ready-<slug>`) + server-side `Lead`.
- `netlify/functions/stripe-webhook.mjs` - now also fires the server `Purchase`.
- `unlock/index.html` - client `Purchase` on confirmed unlock.
- `ready/*.html` + `.claude/readiness-template.html` - engine wired for the
  Lead (see "Frozen engine" below).

## Env vars to set in Netlify (UI -> Site settings -> Environment variables)

| Var | Required | Notes |
| --- | --- | --- |
| `META_CAPI_TOKEN` | yes (for CAPI) | Meta Conversions API access token. Secret. Rotate the one shared in chat. |
| `BUTTONDOWN_API_KEY` | yes (for email) | Buttondown API key. Secret. |
| `META_PIXEL_ID` | no | Defaults to `4477591755892377`. |
| `META_TEST_EVENT_CODE` | no | Set only while verifying; unset in production. |

GA4 needs no env var (client-only). If any secret is unset the code fails
soft: the client pixel still fires and signups are accepted, so a missing key
never breaks checkout or the quiz.

## Verification checklist (A5)

Definition of done: each event is visible in GA4 DebugView and Meta Test
Events, and the Purchase/Lead pairs show as **deduplicated** in Meta.

### GA4 (DebugView)
1. Open the site with the GA Debug extension on, or append `?debug_mode=1`.
2. GA4 -> Admin -> DebugView.
3. Complete a test purchase -> expect a `purchase` event with `value: 9.99`,
   `currency: USD`, `transaction_id: pur_<session>`.
4. Submit an email on a `/ready/<slug>` result -> expect `generate_lead` with
   `cert` and `quiz_slug`.

### Meta Pixel (Test Events, browser side)
1. Meta Events Manager -> Data sources -> your pixel -> Test Events.
2. Load a page with the Meta Pixel Helper extension: confirm `PageView`.
3. Purchase -> confirm a browser `Purchase` with the value and `content_ids`.
4. Quiz email submit -> confirm a browser `Lead`.

### Meta CAPI (Test Events, server side)
1. Set `META_TEST_EVENT_CODE` to the code shown in Test Events and redeploy
   (or set it on a branch deploy).
2. Repeat purchase + signup.
3. Confirm the **server** `Purchase` and `Lead` appear.
4. Unset `META_TEST_EVENT_CODE` when done.

### Dedup
- In Test Events, the browser and server events for the same action should
  collapse into one row tagged as deduplicated (same `event_id` + event name).
- If you see two separate rows, confirm `pur_<session_id>` matches on both
  sides (Purchase) and that the quiz forwarded its `event_id` (Lead).

## Decisions on record

- **Free-start event: skipped.** There is no distinct "Start free Unit 1"
  action today (free lessons are ungated navigation). Add a `Lead`/`StartTrial`
  when a real CTA exists.
- **Consent: minimal.** Tags load globally, matching existing behaviour. This
  is a known GDPR/UK exposure to revisit (a consent gate for EU/UK visitors)
  if paid traffic from those regions grows. No consent banner was added.
- **Capacitor / app double-fire: flagged, web-only for now.** The mobile app
  is a separate repo not present here, and `app.html` is only a store-badge
  landing page. There is no signal today to tell app WebView sessions from web.
  The fired events route through an `isApp()` stub (currently always `false`)
  so app sessions can be suppressed or tagged once the mobile project supplies
  a signal (custom UA token, query param, or an injected JS flag). Until then,
  if the WebView loads the remote site, its pixel/GA hits count as web.

## Frozen engine note

The readiness template is a frozen engine (like the lesson/exam engines). Two
edits were unavoidable and were applied identically to
`.claude/readiness-template.html` and all four `ready/*.html` files to keep
engine parity:

1. `submitEmail` extended to fire the deduped `Lead` (pixel + GA4 + server
   CAPI) and to send `slug`, `cert`, `event_id`, and `fbp`/`fbc`.
2. The capture form label made cert-specific via `R.cert`.

`EMAIL_ENDPOINT` was set to `/api/subscribe` in the four live files only; the
template keeps the empty reference stub. `scripts/validate.py` still passes on
all four quizzes.
