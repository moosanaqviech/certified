cert-config-databricks-data-analyst-associate.md
Cert Config: Databricks Certified Data Analyst Associate

Per-certification settings so the frozen engine rules stay generic. Pairs with
curriculum-index-databricks-data-analyst-associate.md (the locked chapter
placement).

## Identity

    Badge text: "Databricks Data Analyst Associate"
    Course folder: databricks-data-analyst-associate/
    Hub slug: databricks-da-associate (practice/databricks-da-associate.html,
      localStorage key certify.practice.databricks-da-associate)
    Completion namespace: done:databricks-da-associate:
    Difficulty: Associate
    Standard blurb: Bite-sized, visual lessons for the Databricks Certified
      Data Analyst Associate exam, built to teach the judgment the test
      rewards (which table, which view, which chart, which share), not facts
      to cram.
    Exam guide version: 30 Oct 2025 (VERIFIED against the official PDF,
      28 Sep 2026; see the curriculum index)
    Questions: 45 scored, multiple-choice with a few multiple-selection items
      (sample Q10). Unscored items may also appear, unidentified, with extra
      time factored in.
    Time: 90 minutes
    Pace: 2 minutes per question (45 x 2 = 90, the real exam's length)
    Pass threshold: NOT PUBLISHED by Databricks. Never state an official cut
      score. Use 70% as our own practice target, labelled as our guidance.
    Cost: USD 200 (certification web page)
    Delivery: online proctored or test center. Validity 2 years.
    Code language: SQL throughout. Python appears only where the guide names
      a notebook feature (data profile, visualizations) and never as the
      primary skill.
    Price on this site: $9.99 one-time unlock (course id da-assoc). Units 1
      to 3 are free through da-practice-exam-01; Units 4 to 9 and the three
      mocks are gated by netlify/edge-functions/gate.ts. The Stripe Price id
      lives in the STRIPE_PRICE_DA_ASSOC env var on Netlify.

## File naming

    Lessons: lesson-NN-name.html, numbered 01-43 per the locked curriculum index.
    Practice exams: da-practice-exam-NN.html (slug prefix, per the convention
      that only the first course keeps the bare practice-exam-NN.html; DE
      Professional uses pro-, ML uses ml-, GenAI uses genai-, AWS uses aws-).
    All Data Analyst Associate files live in databricks-data-analyst-associate/.

## Terminology rules

The exam tests the names in the 30 Oct 2025 exam guide, and the docs have
renamed several products since (verified 28 Sep 2026 against docs.databricks.com).
Rule: teach the EXAM GUIDE name as the primary term, and say the current docs
name once, in the chapter that introduces the product, as "now called X in the
Databricks docs". Never use a name that is deprecated in BOTH the guide and the
docs (Delta Live Tables, DLT, Workflows, SQL endpoint, Data Explorer).

    2026 renames to mention once and then drop:
      Delta Sharing -> "OpenSharing" (docs-wide from Jun 2026; the open-source
        connector is still delta-sharing). Exam term: Delta Sharing (Ch 09).
      Genie space -> "Genie Agent"; Genie -> "Genie One" (Jun and Jul 2026).
        Exam term: AI/BI Genie space (Ch 35).
      Mosaic AI -> "Databricks AI capabilities" on the docs overview. Exam
        term: Mosaic AI (Ch 01).
      Data Intelligence Platform -> "Databricks Data + AI Platform" on product
        pages. Exam term: Data Intelligence Platform (Ch 01).
      Data Intelligence Engine / DatabricksIQ -> the docs page is now "AI
        assistive features". Exam term: Data Intelligence Engine (Ch 01).
      Databricks Assistant -> "Genie Code" (11 Mar 2026; runs only in Agent
        mode since Jun 2026; the /settings and /rename commands were
        removed May 2026). Exam term: Databricks Assistant (Ch 11).
      Salesforce Data Cloud -> "Salesforce Data 360" (a federation source).

    Pipelines: say "Lakeflow Spark Declarative Pipelines", never "Delta Live
      Tables" or "DLT". The Oct 2025 exam guide text still says "DeltaLive
      tables"; Chapter 01 says "formerly Delta Live Tables" once and then uses
      the current name (the rename shipped 11 Jun 2025, before the guide, so
      the guide is simply stale here). Streaming tables and materialized views
      in Databricks SQL are backed by these pipelines.
    Orchestration: say "Lakeflow Jobs" (formerly Workflows / Databricks Jobs).
    Ingestion connectors: "Lakeflow Connect".
    Dashboards: say "AI/BI Dashboards" (formerly Lakeview). The older
      "legacy dashboards" are the contrast case only and are being retired.
    Genie: say "AI/BI Genie" and "Genie space" (a space is the unit of
      curation). Not "Genie room", not "Genie bot".
    Federation: say "Lakehouse Federation", with "connection" and "foreign
      catalog" as its objects.
    Compute: say "SQL warehouse" (serverless, pro, classic). Never "SQL
      endpoint" (the old name).
    Assistant: "Databricks Assistant" with its slash commands (/explain, /fix,
      /doc, /optimize, /generate as documented at authoring time).
    Layout: "Liquid Clustering" is the recommended layout; partitioning and
      Z-Order appear only as the contrast case (repo-wide rule).
    Catalog UI: "Catalog Explorer" (formerly Data Explorer).
    Engine: "Photon". Intelligence layer: "Data Intelligence Engine", also
      called DatabricksIQ where the docs do.
    Sharing: "Delta Sharing"; "provider" and "recipient"; "share" is the
      object. "Databricks Marketplace" for the listings surface.
    Storage: "Unity Catalog volume" for files; "managed table" and "external
      table"; the "three-level namespace" catalog.schema.object.
    Tags and trust: "tag" (key and value), "certified" and "deprecated" data
      asset status. Say "certify a table", not "verify a table".

## Recommended-vs-contrast stances

    Tables: managed tables recommended; external tables for data that other
      systems own or that must live at a fixed path.
    Compute: serverless SQL warehouses recommended; pro and classic as the
      contrast (and where a scenario needs a feature only they have).
    Layout: Liquid Clustering recommended; partitioning and Z-Order contrast.
    Dashboards: AI/BI Dashboards recommended; legacy dashboards contrast only.
    Views for security: dynamic views and column masks / row filters
      recommended over copying filtered tables per audience.
    Ingestion: Auto Loader (as a streaming table) for continuous file
      arrivals; COPY INTO for a bounded set of files; UI upload for a one-off
      file; Lakeflow Connect for SaaS and databases; Delta Sharing and
      Marketplace when the data is another organization's.
    Time travel: for auditing and recovery, with the caveat that VACUUM
      removes old versions; not a substitute for retention design.

## Palette registry

The course home keeps the shared gold home theme, like every other course home;
gold stays reserved for exams and course homes product-wide. The accents below
are per-UNIT lesson palettes, assigned semantically. Collision-check each one
against the specific neighboring lessons at the moment its first lesson is
written and record the final --accent hex in each lesson as it ships. Trade-off
lessons use the same unit accent as their siblings; the (TO) structure, not a
distinct color, marks them.

    Unit 1  Platform            coral red      #f87171   the Databricks brand,
                                                          platform overview
    Unit 2  Managing Data       emerald        #34d399   curation, trust
    Unit 3  Importing Data      orange         #fb923c   things arriving
    Unit 4  Executing Queries   Databricks SQL blue #60a5fa   the SQL editor
    Unit 5  Analyzing Queries   violet         #a78bfa   profiling, tuning
    Unit 6  Dashboards          cyan           #22d3ee   charts and light
    Unit 7  Genie Spaces        fuchsia        #e879f9   AI conversation
    Unit 8  Data Modeling       teal           #2dd4bf   structure
    Unit 9  Securing Data       indigo         #818cf8   locks and grants

## Source rules (reminder)

Every card and question traces to official Databricks docs (docs.databricks.com)
plus the official exam guide for scope. No third-party study guides as factual
sources, no braindump content. Where a UI flow is described (upload, share,
schedule), confirm the current menu names against the docs at authoring time,
since the UI is renamed often.
