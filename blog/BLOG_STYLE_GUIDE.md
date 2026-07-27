# Certified Blog Style Guide

Read this in full before drafting any post. It exists so daily automated
posts read like they came from the same person who writes the lessons, not
like generic SEO filler.

## Where posts live

Published posts on this site are `.html` pages in the `blog/` folder (for
example `blog/databricks-data-engineer-associate-vs-professional.html`),
served at clean URLs like `/blog/databricks-data-engineer-associate-vs-professional`.
The automation writes that HTML directly: it copies `blog/POST_TEMPLATE.html`
to `blog/<slug>.html`, fills in every placeholder (content plus all SEO tags
and JSON-LD), and adds the page to `sitemap.xml`. The output is a finished,
publish-ready page, not a draft. The `blog/` folder also holds the config
files (this guide, `CONTENT_PLAN.md`) and `POST_TEMPLATE.html`, which are not
published posts.

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

1. **Post metadata** (see format below): the values that fill the template's
   head, SEO tags, and JSON-LD.
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

## Post metadata

Decide these values before writing; they map into the template's `<head>`,
SEO tags, and JSON-LD. This is not a YAML block in the output file (the
output is HTML), it is the set of fields the template placeholders consume.

```
title:        Exact page title, matches the target search intent
slug:         url-friendly-slug
description:  150-160 character meta description, intent-matched, no keyword stuffing
certification: databricks-data-engineer-associate | databricks-data-engineer-professional | aws-dea-c01
date:         YYYY-MM-DD            (datePublished)
updated:      YYYY-MM-DD            (optional, dateModified; defaults to date)
author:       Moosa                 (visible byline only, see note in SEO section)
canonical:    https://certify.courses/blog/<slug>
og_image:     (optional; current posts set none, leave unset to match)
faq:          (optional; a list of question/answer pairs, only if the post has an FAQ)
```

The `slug` is the output filename (`blog/<slug>.html`), the published page's
clean URL (`/blog/<slug>`), and drives the `canonical` value, so it must
be unique against the posts already listed in CONTENT_PLAN.md. The `faq`
list is the single source for both the visible FAQ section and the
`FAQPage` JSON-LD, so write each question and answer once and use it in both
places.

## SEO and structured data

The six existing cluster posts all ship a fixed set of SEO tags and two
JSON-LD blocks. `blog/POST_TEMPLATE.html` already contains this scaffolding,
so filling the template correctly produces it. New posts must match that
standard, so the generated `<slug>.html` must include all of the following.
Base URL: `https://certify.courses`.

**Required `<head>` elements (mirror the existing posts exactly):**

1. `<title>` = `title`.
2. `<meta name="description">` = `description`.
3. `<link rel="canonical">` = `canonical` (i.e. base URL + `/blog/<slug>`).
4. `<meta name="robots" content="index,follow,max-image-preview:large">`.
5. OpenGraph: `og:type=article`, `og:title` = title, `og:description`
   (may match the meta description or the OG-specific one), `og:url` =
   canonical, `og:site_name=Already Certified`. Add `og:image` only if
   `og_image` is set; current posts omit it.
6. `<meta name="twitter:card" content="summary_large_image">`.

**JSON-LD `Article`** (one script block, matching the existing shape):

```
{"@context":"https://schema.org","@type":"Article",
 "headline": <title>,
 "description": <description>,
 "author":{"@type":"Organization","name":"Already Certified"},
 "publisher":{"@type":"Organization","name":"Already Certified","url":"https://certify.courses/"},
 "datePublished": <date>,
 "dateModified": <updated or date>,
 "inLanguage":"en",
 "mainEntityOfPage":{"@type":"WebPage","@id": <canonical>}}
```

Note: the JSON-LD `author` and `publisher` are the Organization
"Already Certified," not "Moosa." The `author` frontmatter field is only the
human-visible byline. This matches every existing post, do not change it.

**JSON-LD `FAQPage`** (second script block, only when `faq` is present):

```
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
 {"@type":"Question","name": <faq[i].q>,
  "acceptedAnswer":{"@type":"Answer","text": <faq[i].a>}},
 ...
]}
```

The questions and answers in this block must be identical to the visible
FAQ section rendered from the same `faq` frontmatter. If the post has no
FAQ, omit this block entirely rather than emitting an empty one.

**Sitemap:** add a `<url>` entry to `sitemap.xml` with `loc` = canonical,
`lastmod` = `updated` (or `date`), and `priority` `0.9` (the value the other
cluster posts use; lessons use `0.6`).

**No leftover placeholders:** the finished `<slug>.html` must contain no
`{{PLACEHOLDER}}` tokens and none of the template's instructional HTML
comments. Delete any body component (comparison table, FAQ, pick cards) the
post does not use.

The no-em-dash rule applies here too: titles, descriptions, OG tags, and
every JSON-LD string must use colons, commas, parentheses, or periods.

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
  published lesson page in the course folder (for example
  `databricks-data-engineer-associate/lesson-28-liquid-clustering.html`)
  before writing.

## Hard formatting rules

- **No em dashes anywhere.** Use colons, commas, parentheses, or periods
  instead. This applies to headings, body text, metadata, and JSON-LD.
- No exclamation points in headings.
- No unverified superlatives ("the best," "the only") about Certified or
  competitors.
- Internal links point to other posts/pages in this repo by their relative
  file path, matching how the existing posts link, not full URLs. Posts live
  in `blog/`, so a link to a sibling post is a plain filename (another post's
  `<slug>.html`), while a link out of `blog/` needs a `../` prefix: the
  catalog is `../index.html` and a lesson is
  `../databricks-data-engineer-associate/lesson-01-lakehouse.html`.

## What NOT to do

- Don't write a post that could apply to any exam-prep platform, every post
  should read like it came from someone who actually built the course.
- Don't compare against named competitors by name in a way that reads as
  disparaging. Factual, neutral comparisons are fine; snark is not.
- Don't invent a customer quote, testimonial, or statistic.
- Don't restate the CONTENT_PLAN.md search intent phrase verbatim as the
  title, use it to inform the title, not as a copy-paste keyword string.
