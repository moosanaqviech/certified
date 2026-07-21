# Certified Blog Content Plan

This file is the source of truth the daily automation reads before writing
anything. It answers two questions: what's already published, and what's
next.

**Setup state:** the "Published" column below has been reconciled against the
actual site. Published posts are the `.html` pages in the `blog/` folder;
the Filename column records the published page for each covered topic. The
automation keeps this column updated after each run.

## How the automation uses this file

1. Reads the target topic list below.
2. Cross-checks against what's actually published (`.html` posts in `blog/`).
3. Picks the highest-priority row where Published = No.
4. Writes that post as a publish-ready `blog/<slug>.html` (from
   `blog/POST_TEMPLATE.html`), adds it to `sitemap.xml`, then flips Published
   to Yes and fills in the filename.

Priority order is top-to-bottom within each certification block. Between
certifications, prefer whichever certification currently has fewer published
posts (keeps coverage balanced rather than exhausting one cert's list
first).

Note on the Filename column: published posts are `.html` files in the
`blog/` folder, so filenames here point to those `blog/`-prefixed pages.

---

## Databricks Data Engineer Associate

| Priority | Topic | Search Intent | Published | Filename |
|---|---|---|---|---|
| 1 | Databricks Data Engineer Associate exam cost, format and question types | "what's on the databricks data engineer associate exam" | Yes | blog/databricks-data-engineer-associate-exam-cost-format-registration.html |
| 2 | Complete Databricks Data Engineer Associate certification guide (pillar) | "databricks data engineer associate certification guide" | Yes | blog/databricks-data-engineer-associate-certification-guide.html |
| 3 | Lakeflow Spark Declarative Pipelines vs the old Delta Live Tables name | "delta live tables renamed" / "what happened to DLT" | Yes | blog/lakeflow-declarative-pipelines-vs-delta-live-tables.html |
| 4 | Databricks Data Engineer Associate vs Professional: which to take first | "associate vs professional databricks data engineer" | Yes | blog/databricks-data-engineer-associate-vs-professional.html |
| 5 | Study plan and prep time for the Databricks Data Engineer Associate exam | "databricks data engineer associate study plan" / "how long to prepare" | Yes | blog/how-long-to-prepare-databricks-data-engineer-associate.html |
| 6 | Medallion architecture explained: bronze, silver and gold layers | "medallion architecture bronze silver gold" | Yes | blog/medallion-architecture-explained-bronze-silver-gold.html |
| 7 | Liquid Clustering vs partitioning and Z-Order: what Databricks recommends now | "liquid clustering vs partitioning" | Yes | blog/liquid-clustering-vs-partitioning-z-order.html |
| 8 | Common mistakes on the Databricks Data Engineer Associate exam | "databricks data engineer exam tips" | Yes | blog/common-mistakes-databricks-data-engineer-associate-exam.html |
| 9 | Is the Databricks Data Engineer Associate certification worth it in 2026 | "is databricks certification worth it" | Yes | blog/is-databricks-data-engineer-associate-worth-it-2026.html |

## Databricks Data Engineer Professional

| Priority | Topic | Search Intent | Published | Filename |
|---|---|---|---|---|
| 1 | What's new on the Databricks Data Engineer Professional exam vs Associate | "databricks professional exam difficulty" | Yes | blog/databricks-data-engineer-professional-exam-topics.html |
| 2 | Complete Databricks Data Engineer Professional certification guide (pillar) | "databricks data engineer professional certification guide" | Yes | blog/databricks-data-engineer-professional-certification-guide.html |
| 3 | Databricks Professional exam: performance tuning and optimization topics explained | "databricks professional performance tuning exam" | Yes | blog/databricks-professional-performance-tuning-optimization-exam.html |
| 4 | How long to prepare for the Databricks Data Engineer Professional exam | "databricks professional study time" | Yes | blog/how-long-to-prepare-databricks-data-engineer-professional.html |

## AWS Certified Data Engineer Associate (DEA-C01)

| Priority | Topic | Search Intent | Published | Filename |
|---|---|---|---|---|
| 1 | AWS Data Engineer Associate (DEA-C01) exam guide breakdown: domains and weighting | "DEA-C01 exam domains" | Yes | blog/aws-dea-c01-exam-guide-domains-weighting.html |
| 2 | Amazon Data Firehose and Managed Service for Apache Flink: the renames AWS made | "kinesis firehose renamed" / "kinesis data analytics renamed" | Yes | blog/amazon-data-firehose-managed-flink-renamed.html |
| 3 | Kinesis Data Streams vs Amazon Data Firehose vs Managed Flink: which to use when | "kinesis vs firehose vs flink" | Yes | blog/kinesis-data-streams-vs-firehose-vs-managed-flink.html |
| 4 | AWS Schema Conversion Tool (SCT): current status and what replaced it | "is aws sct deprecated" | Yes | blog/aws-schema-conversion-tool-sct-status.html |
| 5 | DEA-C01 vs Databricks Data Engineer certifications: how they compare | "aws vs databricks data engineer certification" | Yes | blog/aws-vs-databricks-data-engineer-certification.html |
| 6 | How to study for the AWS Data Engineer Associate exam as a Databricks-certified engineer | "AWS data engineer cert for databricks users" | Yes | blog/study-aws-data-engineer-associate-as-databricks-engineer.html |

---

## Adding new topics

When you spot a new gap (new exam guide revision, a competitor ranking for
a term you're not covering, a question you keep getting asked), add a row
with the next priority number in the right certification's table rather
than editing the automation prompt itself.

## Sourcing reminder

Every claim in a post follows the same rule as lesson content: official
vendor docs and the official exam guide only. No exam dumps, no
third-party question banks, no unverified "I heard the pass rate is X."
If a fact can't be traced to an official source, the sentence gets
reworded to avoid the unverified specific rather than dropped from
consideration entirely.
