cert-config-databricks-ml-associate.md
Cert Config: Databricks Certified Machine Learning Associate

Per-certification settings so the frozen engine rules stay generic. Pairs with
curriculum-index-databricks-ml-associate.md (the locked chapter placement).

## Identity

    Badge text: "Databricks Machine Learning Associate"
    Course folder: databricks-machine-learning-associate/
    Difficulty: Associate
    Standard blurb: Bite-sized, visual lessons for the Databricks Certified
      Machine Learning Associate exam, built to teach the trade-off reasoning
      the test rewards, not just facts to cram.
    Exam guide version: 1 Mar 2025
    Questions: 45 scored (confirm; some sources report 48 total)
    Time: 90 minutes
    Pace: 2 minutes per question
    Pass threshold: 70% (community-reported; Databricks scores pass/fail on a
      scaled score and does not publish a fixed cut line, confirm before launch)
    Cost: USD 200
    Code language: Python for all ML code; SQL may appear for non-ML data
      manipulation only

## File naming

    Lessons: lesson-NN-name.html, numbered 01-30 per the locked curriculum index.
    Practice exams: ml-practice-exam-NN.html (slug prefix, per the convention
      that only the first course keeps the bare practice-exam-NN.html; DE
      Professional uses pro-, AWS uses aws-).
    All ML Associate files live in databricks-machine-learning-associate/.

## Terminology rules

Current official names only. Never use the deprecated name in prose, options,
or explanations.

    Streaming pipelines / streaming inference: say "Lakeflow Spark Declarative
      Pipelines", never "Delta Live Tables" or "DLT". This matches the repo-wide
      DE Professional rule. Note: the Mar 2025 exam guide text itself still says
      "Delta Live Tables"; teach the current name and mention the former name
      once (Chapter 29 is the natural place).
    Model registry: say "Models in Unity Catalog" / "the Unity Catalog model
      registry", using versions and aliases. The legacy "Workspace Model
      Registry" with Staging/Production/Archived stages is the contrast case
      only. Do not present stage transitions as the recommended path.
    Feature store: say "Feature Engineering in Unity Catalog". The legacy
      "Workspace Feature Store" is the contrast case only.
    Runtime: "Databricks Runtime for Machine Learning" (Databricks Runtime ML),
      not "ML runtime" as a proper noun.
    Tuning library: "Hyperopt" (fmin, SparkTrials) is the tested tool and what
      lessons teach hands-on. Mention once that Databricks now recommends Optuna
      for new work and that Hyperopt is in maintenance mode (Chapter 20).
    MLflow surfaces: "MLflow Tracking", "MLflow Models", "MLflow Model Registry".
      Say "run" and "experiment", not "job", for tracking artifacts.

## Recommended-vs-contrast stances

    Model registry: Models in Unity Catalog (aliases) recommended; Workspace
      Model Registry (stages) contrast only.
    Feature store: Feature Engineering in Unity Catalog recommended; Workspace
      Feature Store contrast only.
    Tuning: Hyperopt taught for the exam; Optuna named as the current production
      recommendation.
    Governance: Unity Catalog is the default namespace for data, features, and
      models; workspace-local objects are the legacy contrast.

## Palette registry (provisional)

The course home page (databricks-machine-learning-associate/index.html) keeps
the shared gold home theme, like every other course home; gold stays reserved
for exams and course homes product-wide. The accents below are per-UNIT lesson
palettes, assigned semantically. They are PROVISIONAL: collision-check each one
against the specific neighboring lessons already authored in the DE Associate,
DE Professional, and AWS courses at the moment its first lesson is written, and
adjust if it clashes. Record the final --accent hex in each lesson as it ships.

    Unit 1  Databricks Machine Learning   warm coral/red    evokes the Databricks
                                          brand and MLflow; platform-tooling unit
    Unit 2  ML Workflows                  teal/green        data exploration and
                                          preparation
    Unit 3  Model Development             indigo/violet     computation, tuning,
                                          scale
    Unit 4  Model Deployment             ocean blue/cyan   production, serving,
                                          endpoints

Trade-off lessons rely on the same unit accent as their siblings; the (TO)
structure, not a distinct color, marks them.

## Source rules (reminder)

Every card and question traces to official Databricks docs (docs.databricks.com,
mlflow.org, spark.apache.org) plus the official exam guide for scope. Third-party
study guides were used only to reconstruct the WAF-blocked exam outline for
scoping and must never be a factual source for a card. No braindump content.
