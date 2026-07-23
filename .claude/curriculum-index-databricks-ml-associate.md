curriculum-index-databricks-ml-associate.md
Curriculum Index: Databricks Certified Machine Learning Associate

Status: Draft (authoritative source for unit and chapter placement once locked).
Direct WebFetch of databricks.com and community.databricks.com is blocked (HTTP
403 bot protection) in this environment, so the section list, weightings, and
sub-objectives below were reconstructed by cross-checking multiple independent
public reproductions of the official exam guide this session (the current guide
is the "1 Mar 2025" edition). Re-fetch and diff the official exam guide PDF
against this file before authoring Chapter 1, and again before launch, per the
same rule the AWS and DE Professional indexes use.

Exam version: Databricks Certified Machine Learning Associate, exam guide dated
1 Mar 2025. Source of truth: official exam guide PDF linked from
https://www.databricks.com/learn/certification/machine-learning-associate
(PDF at
https://www.databricks.com/sites/default/files/2025-02/databricks-certified-machine-learning-associate-exam-guide-1-mar-2025.pdf).

Exam facts (confirm against the current guide before launch, several are
community-reported rather than PDF-confirmed here): 45 scored questions (some
sources report 48 total including unscored), 90 minutes, USD 200, passing score
commonly cited at 70% (Databricks reports pass/fail with scaled scoring and does
not publish a fixed cut line), Python for all ML code (SQL may appear for
non-ML data manipulation), Pearson VUE online-proctored. Recommended experience:
6+ months hands-on ML on Databricks.

Structure: 4 units mirroring the 4 official content sections, 30 chapters.
Chapter counts are sized roughly to section weight. Trade-off lessons flagged (TO).

Note on the prior guide: an earlier edition split the exam into Databricks ML
(29%), ML Workflows (29%), Spark ML (33%), Scaling ML Models (9%). That edition
is superseded. This index mirrors the current 1 Mar 2025 four-section structure
(Databricks Machine Learning, ML Workflows, Model Development, Model Deployment).

Unit 1: Databricks Machine Learning (38%)

Scope: the Databricks ML platform surface: clusters/Repos/Jobs, Databricks
Runtime for ML, AutoML, Feature Engineering in Unity Catalog, and MLflow
(Tracking, Models, Model Registry in Unity Catalog).

    01  The Databricks ML workspace: compute, Git folders, and Lakeflow Jobs for ML
        (formerly clusters, Repos, and Workflows; teach the current names)
    02  Databricks Runtime for Machine Learning: what it preinstalls and when to use it
    03  AutoML: automated model and feature selection
    04  Reading AutoML output: the generated notebooks and the best trial
    05  Unity Catalog for ML: governing data, features, and models in one namespace
    06  Feature Engineering in Unity Catalog: creating and consuming feature tables
    07  Online vs offline feature tables (TO)
    08  MLflow Tracking: experiments, runs, metrics, and artifacts
    09  MLflow Models: flavors and packaging a model
    10  MLflow Model Registry in Unity Catalog: versions and aliases
    11  Finding the best run with the MLflow Client API

Unit 2: ML Workflows (19%)

Scope: the decisions inside a modeling workflow before scaling: EDA, feature
engineering, splitting, and evaluation/selection.

    12  Exploratory data analysis: summary statistics and data profiling
    13  Detecting and removing outliers
    14  Handling missing values: imputation strategies
    15  Encoding categorical features: one-hot encoding and its alternatives
    16  Train, validation, and test splits done right
    17  Evaluation metrics: choosing the right one for the task

Unit 3: Model Development (31%)

Scope: building and tuning models at scale with Spark ML, Hyperopt, cross-
validation, and the Pandas API on Spark.

    18  Spark ML building blocks: transformers, estimators, and pipelines
    19  Building a Spark ML pipeline: assembling features to a fitted model
    20  Hyperparameter tuning with Hyperopt: fmin and the search space
    21  Search strategies: grid vs random vs Bayesian (TO)
    22  Distributing tuning with SparkTrials
    23  Cross-validation vs a single train-validation split (TO)
    24  Counting models: grid search times cross-validation folds
    25  Pandas API on Spark: scaling pandas code to a cluster
    26  Pandas UDFs and the Pandas Function APIs

Unit 4: Model Deployment (12%)

Scope: getting a trained model into production: choosing a serving paradigm and
implementing batch, streaming, and real-time inference.

    27  Deployment paradigms: batch vs streaming vs real-time (TO)
    28  Batch inference with Spark and pandas UDFs
    29  Streaming inference with Lakeflow Spark Declarative Pipelines
    30  Real-time serving: Model Serving endpoints

Cross-reference notes (deliberate syllabus overlap)

    MLflow appears across Units 1 and 3: Unit 1 teaches the tracking/registry
    surface (Ch 8-11), Unit 3 uses MLflow to log and select tuned models
    (Ch 20-24). Cross-link, do not repeat.
    Feature tables (Ch 06-07) are consumed again at scoring time in Unit 4
    batch/real-time inference (Ch 28, 30). Cross-link.
    Hyperparameter tuning is introduced as a workflow decision in Unit 2
    (evaluation and selection, Ch 16-17) and implemented at scale in Unit 3
    (Hyperopt, SparkTrials, Ch 20-24). Unit 2 stays conceptual; Unit 3 is the
    hands-on tuning mechanics.

Practice exam plan

    Question style: scenario-based, single best answer, 4 options, plausible
    distractors, one question per chapter in scope, 2 minutes per question.
    Pass bar: 70%, approximating the commonly cited passing threshold (confirm
    against the current exam guide before launch).
    Progressive coverage plan (5 exams):
        Unit 1 only (11 chapters, 22 min)
        Units 1-2 (17 chapters, 34 min)
        Units 1-3 (26 chapters, 52 min)
        Full coverage, Units 1-4 (30 chapters, 60 min)
        Full coverage, second pass with new scenarios (30 chapters, 60 min)

Terminology rules (see cert-config-databricks-ml-associate.md for the full list)

    "Lakeflow Spark Declarative Pipelines," never "Delta Live Tables" or "DLT,"
    matching the repo-wide DE Professional rule, even though the Mar 2025 exam
    guide text still says Delta Live Tables for streaming inference.
    "Models in Unity Catalog" (registry in Unity Catalog, versions plus aliases)
    is the recommended model-registry approach; the legacy Workspace Model
    Registry with stages appears only as the contrast case.
    "Feature Engineering in Unity Catalog" is the current feature-store surface;
    the legacy Workspace Feature Store appears only as the contrast case.
    Hyperopt (fmin, SparkTrials) is still the tuning tool the exam tests and the
    one lessons teach; note once that Databricks now recommends Optuna for new
    work (Hyperopt is in maintenance mode).
