# Certified Blog Style Guide

Read this in full before drafting any post. It exists so daily automated
posts read like they came from the same person who writes the lessons, not
like generic SEO filler.

## Where posts live

Published posts on this site are hand-built `.html` pages at the repository
root (for example `databricks-data-engineer-associate-vs-professional.html`),
served at clean URLs like `/databricks-data-engineer-associate-vs-professional`.
The automation does not write that HTML directly. It writes a markdown draft
into `blog/<slug>.md`, which a human then converts into the site's root-level
HTML template and adds to `sitemap.xml` before it goes live. So `blog/` is a
staging area: the markdown here is the raw draft, the root `.html` file is the
published page.

## Voice

Written as Moosa, a Technical Trainer at Jarvis, explaining something to a
working data professional who's actually preparing for the exam. Direct,
practical, no fluff intro paragraphs like "In today's fast-paced world of
data engineering...". Open with the actual question or problem.

Confident but not salesy. The credibility comes from being right and being
current, not from adjectives. Mention Certified naturally where it's the
genuine answer to the reader's need (e.g., a study-plan post can point to
the relevant course), never bolted on as an ad.

## Structure

1. **Frontmatter** (see format below).
2. **Opening (2-4 sentences):** state the question the post answers or the
   confusion it clears up. No throat-clearing.
3. **Body:** organized under H2/H3 headings that mirror how someone would
   search or skim, not a narrative essay. Use tables for comparisons,
   numbered lists for steps or sequences.
4. **One official-source anchor minimum:** at least one specific, verifiable
   fact (exam domain weighting, a product rename date, a documented default)
   sourced from official vendor material. This is what separates the post
   from the "top 10 tips" filler that ranks above it today.
5. **Closing:** a short, honest next step. If Certified's course genuinely
   helps with this exact question, link it. If not, don't force it.

## Length

600 to 1,000 words for a cluster post. Longer only if the topic is genuinely
a full guide (e.g., a complete exam-domain breakdown). Never pad to hit a
word count, a tight 650-word post beats a bloated 1,200-word one.

## Frontmatter format

```
---
title: "Exact page title, matches the target search intent"
slug: "url-friendly-slug"
description: "150-160 character meta description, intent-matched, no keyword stuffing"
certification: "databricks-data-engineer-associate" | "databricks-data-engineer-professional" | "aws-dea-c01"
date: "YYYY-MM-DD"
author: "Moosa"
---
```

The `slug` becomes both the draft filename (`blog/<slug>.md`) and the
published page's clean URL (`/<slug>`), so it must be unique against the
posts already listed in CONTENT_PLAN.md.

## Sourcing rules (same standard as lesson content)

- Every specific factual claim (exam format, domain weighting, a product
  name, a deprecation, a default behavior) must trace to official vendor
  documentation or the official exam guide. Fetch and check, don't rely on
  memory for anything that could have changed.
- No exam dumps, braindump sites, or third-party question banks, ever, not
  even for "here's what people say the exam covers" framing.
- If a specific number (pass rate, question count, time limit) isn't
  confirmed from an official source in hand, don't state it as fact. Either
  verify it or write around it.
- Unofficial blogs/forums can inspire an angle (e.g., "people keep asking
  X") but never supply the underlying fact.

## Terminology rules (must match current lesson terminology)

- "Lakeflow Spark Declarative Pipelines," never "Delta Live Tables" or "DLT"
  (except when a post is specifically explaining the rename, where the old
  name appears once for context, clearly marked as retired).
- "Amazon Data Firehose" (renamed Feb 2024) and "Amazon Managed Service for
  Apache Flink" (renamed Aug 2023), never the pre-rename names, with the
  same exception for rename-explainer posts.
- Liquid Clustering is presented as the current recommendation; partitioning
  and Z-Order appear only as contrast cases, never as the default advice.
- If a post touches a product/feature not covered by these rules, confirm the
  current official name against the vendor's documentation and the matching
  published lesson page at the repo root (for example
  `lesson-28-liquid-clustering.html`) before writing.

## Hard formatting rules

- **No em dashes anywhere.** Use colons, commas, parentheses, or periods
  instead. This applies to headings, body text, and frontmatter.
- No exclamation points in headings.
- No unverified superlatives ("the best," "the only") about Certified or
  competitors.
- Internal links point to other posts/pages in this repo by their clean
  path (e.g., `/lesson-01-lakehouse` or the target post's slug), not full
  URLs. Remember published pages live at the repo root, so a link from a
  draft is to the root-level page, not to another file inside `blog/`.

## What NOT to do

- Don't write a post that could apply to any exam-prep platform, every post
  should read like it came from someone who actually built the course.
- Don't compare against named competitors by name in a way that reads as
  disparaging. Factual, neutral comparisons are fine; snark is not.
- Don't invent a customer quote, testimonial, or statistic.
- Don't restate the CONTENT_PLAN.md search intent phrase verbatim as the
  title, use it to inform the title, not as a copy-paste keyword string.
