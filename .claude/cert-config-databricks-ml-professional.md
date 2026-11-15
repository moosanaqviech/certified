Cert Config: Databricks Certified Machine Learning Professional

Per-certification settings so the frozen engine rules stay generic. Pairs with
curriculum-index-databricks-ml-professional.md (the chapter placement, LOCKED
15 Nov 2026 against the official exam guide).

## Identity

    Badge text: "Databricks ML Professional"
    Course folder: databricks-machine-learning-professional/
    Course id: ml-pro (not yet registered in gate.ts or _shared.mjs; decide
      the price and free unit before Unit 1 ships)
    Difficulty: Professional
    Standard blurb: Bite-sized, visual lessons for the Databricks Certified
      Machine Learning Professional exam, built to teach the production ML
      judgment the exam rewards: scaling training, serving custom models,
      testing and promoting code, and catching drift.
    Exam guide version: exam published 30 Sep 2025, guide updated 30 Sep 2025
      (PDF filed under 2026-10 with "august" in the filename; VERIFIED from the
      official PDF text, 15 Nov 2026)
    Questions: 59 scored, multiple-choice only (no multiple-selection items in
      this guide). Up to 10 unscored items may also appear, unidentified, with
      extra time factored in.
    Time: 120 minutes
    Pace: 2 minutes per question (59 x 2 = 118, so a full mock uses the real
      120-minute limit)
    Pass threshold: NOT PUBLISHED by Databricks. Never state an official cut
      score. Use 70% as our own practice target, labelled as our guidance;
      85% or more on full mocks is the recommended readiness bar.
    Cost: USD 200
    Delivery: Online proctored or test center. English only. Validity 2
      years; take the current live exam to recertify.
    Prerequisite: none required; one year of hands-on Databricks experience
      with the exam outline is recommended.
    Code language: the guide names none; objectives and sample questions are
      Python and Spark ML. Show Python (PySpark, MLflow, Feature Engineering
      Client, Databricks SDK) and YAML for bundles.

## File naming

    Lessons: lesson-NN-name.html, numbered 01-52 per the curriculum index.
    Practice exams: mlp-practice-exam-NN.html. 01 to 06 are the unit exams,
      07 to 09 the sealed full mocks.
    All files live in databricks-machine-learning-professional/.

## Terminology rules

Current official names only. Where the docs renamed something after the exam
guide was written, teach the current name and state the guide's old name once,
in the chapter noted. The guide itself tells candidates to study
non-deprecated features.

    Monitoring: "data profiling", part of Databricks "Data Quality
      Monitoring" (docs: data profiling was formerly known as Lakehouse
      Monitoring). Say "formerly Lakehouse Monitoring" once, in Ch 38. Profile
      types are "snapshot", "time series" and "inference"; output tables are
      the "profile metrics table" and "drift metrics table". Anomaly detection
      (freshness and completeness) is the other half of Data Quality
      Monitoring and is out of scope beyond one contrast line.
    Online features: "Databricks Online Feature Stores" (powered by
      Lakebase), created with FeatureEngineeringClient.create_online_store and
      fed with publish_table. Legacy online tables are deprecated and were no
      longer accessible after 15 Jan 2026; name them once, in Ch 22, as the
      predecessor the guide's objective still mentions. Never teach the
      online_tables SDK calls as current.
    Feature store: "Databricks Feature Store" with feature tables in Unity
      Catalog, "Feature Engineering Client" (FeatureEngineeringClient, package
      databricks-feature-engineering). The Workspace Feature Store is
      deprecated, contrast only.
    Bundles: "Declarative Automation Bundles" (repo-wide lock), never
      "Databricks Asset Bundles" or "DABs" as the primary term.
    Registry: "Models in Unity Catalog" with version aliases (champion,
      challenger). Workspace Model Registry stages (Staging, Production) only
      as a contrast case in Ch 28.
    Serving: "Model Serving" (Databricks Model Serving), as the guide and the
      current docs write it (checked 15 Nov 2026; older pages said "Mosaic
      AI Model Serving", which lessons do not use). Endpoints carry "served entities"; traffic is split
      across them. "Route optimization" for high-throughput endpoints.
    Tuning: "Optuna" with MlflowStorage and MlflowSparkStudy for distributed
      trials logged to MLflow; "Ray Tune" on "Ray on Databricks". Hyperopt is
      not in the guide and is deprecated in recent Databricks ML runtimes;
      contrast only, and verify that status before mentioning it.
    Spark ML: "Spark ML" in prose (the guide also writes "SparkML" and
      "MLlib"; treat them as the same library, say pyspark.ml in code).
    Pandas: "Pandas Function API" (applyInPandas, mapInPandas) and "pandas
      UDFs", as the guide writes them.
    Repo-wide carry-overs: "Lakeflow Spark Declarative Pipelines" (never DLT),
      "Liquid Clustering" over partitioning and Z-Order.

## Recommended-vs-contrast stances

The official sample questions settle several of these; cite the stance, never
the question.

    Scale: Spark ML transformers and estimators for data that outgrows one
      node; pandas, scikit-learn and similar single-node tools are contrast
      at that scale and the right call below it.
    Distributed Optuna: MlflowStorage plus MlflowSparkStudy. A plain
      MLflowCallback with async Python, or a Ray detour, is contrast.
    Experiment structure: a parent run for the search, child runs per
      configuration logging aggregated CV metrics, a separate final
      evaluation run. Flat runs with tags are contrast.
    Stable comparisons: a Unity Catalog alias on the production version.
      get_latest_version and shadow deployment answer different questions.
    Lifecycle: deploy code is the default strategy (the guide's own
      framing); deploy models is the contrast case.
    Integration tests: re-run only the stages a change touches (a
      hyperparameter change re-runs training, evaluation and deployment,
      not feature engineering).
    Threshold-driven actions: select models on log loss (calibration).
      F1, AUROC and accuracy are contrast for that decision.
    High-traffic rollout: horizontal scale-out, route optimization, and a
      second served entity with traffic raised in steps (canary). Cutting
      straight to 100% is contrast.
    Infrastructure as code: every ML resource (experiments, registered
      models, endpoints) in one bundle. MLflow Projects plus Jobs, Terraform
      plus CLI, or ad hoc job runs are contrast.
    Querying a served model from Python: the MLflow Deployments client
      predict call. ai_query (SQL), the Tracking client, and query-string
      tokens are contrast.

## Palette registry

Course home keeps the shared gold home theme; gold (#d9a441) stays reserved for
exams and course homes product-wide, and cerulean (#5aa9e6) stays clear.

Per-UNIT lesson accents, at least 40 degrees of hue apart. 146 accents already
ship, so every hue has a neighbour somewhere; none below matches a shipped
accent exactly, and the nearest shipped neighbour is noted. Before each unit's
first lesson, re-check against the lessons a learner meets next to it in THIS
course.

    Unit 1  Spark ML      ember     #f28969  (hue 14)   the spark that lights
            the pipeline. Nearest: #f4826a.
    Unit 2  Scaling       aqua      #51d6cd  (hue 176)  work fanned out across
            many nodes. Nearest: #3fc9d6.
    Unit 3  MLflow and    lilac     #b584f6  (hue 266)  the tracked, catalogued
            Features                 record. Nearest: #c084fc.
    Unit 4  MLOps         lime      #95da58  (hue 92)   growth through
            Foundations              environments, green-light gates.
                                     Nearest: #a0df49.
    Unit 5  Monitoring    rose      #f1748d  (hue 348)  the alarm, the drift
            warning. Nearest: #fb6f92.
    Unit 6  Deployment    mint      #5cd685  (hue 140)  go live. Nearest:
            #4ade80.

Full five-variable blocks, ready to paste into a lesson's :root:

    Unit 1  --bg: #110806;  --bg-tint: #371910;  --accent: #f28969;
            --accent-glow: rgba(242,137,105,0.12);  --accent-ink: #1e0b05;
    Unit 2  --bg: #061110;  --bg-tint: #103735;  --accent: #51d6cd;
            --accent-glow: rgba(81,214,205,0.12);   --accent-ink: #051e1d;
    Unit 3  --bg: #0b0611;  --bg-tint: #211037;  --accent: #b584f6;
            --accent-glow: rgba(181,132,246,0.12);  --accent-ink: #10051e;
    Unit 4  --bg: #0b1106;  --bg-tint: #223710;  --accent: #95da58;
            --accent-glow: rgba(149,218,88,0.12);   --accent-ink: #111e05;
    Unit 5  --bg: #110608;  --bg-tint: #371018;  --accent: #f1748d;
            --accent-glow: rgba(241,116,141,0.12);  --accent-ink: #1e050a;
    Unit 6  --bg: #06110a;  --bg-tint: #10371d;  --accent: #5cd685;
            --accent-glow: rgba(92,214,133,0.12);   --accent-ink: #051e0e;

Trade-off lessons use their unit accent; the (TO) structure, not a distinct
color, marks them.

## Case-study bookends

Company: Fernway Market, an online grocery delivery company across North
America (locked in the curriculum index). Every lesson opens with a case-file
card and closes with a decision card; teaching cards are unchanged. Keep the
recurring cast and systems consistent: hundreds of millions of order rows,
per-store demand forecasts, a real-time ETA model and a fraud model at
checkout, an MLOps platform team running dev, staging and prod, seasonal
demand shifts, and Black Friday traffic on the serving endpoints. Never reuse
another course's company.

## Source rules

Every card and question traces to the official 30 Sep 2025 exam guide (scope)
plus official Databricks, MLflow, Spark, Optuna and Ray documentation
(behaviour, defaults, limits). No braindump content, no third-party question
banks.

    Egress: WebFetch and WebSearch reached databricks.com and docs on 15 Nov
    2026; shell requests to databricks.com are blocked from the remote
    session, so fetch doc pages with WebFetch or have them supplied as
    uploads. Never substitute recalled knowledge for a fetched page on a
    versioned claim: Online Feature Stores, data profiling, bundles and
    Model Serving features have all changed since the guide was written.

    Section weights are the official ones (44/44/12). Objective numbers (1.1
    to 3.5) are Certify's own, since the guide's bullets are unnumbered;
    label them that way if they ever appear in learner-facing copy.
