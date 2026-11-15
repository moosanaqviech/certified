# Curriculum Index: Databricks Machine Learning Professional

**Status:** LOCKED November 15, 2026 (authoritative source for unit and chapter placement; conflicting requests get flagged with a one-line fix, not absorbed). Verified line by line against the official exam guide PDF on November 15, 2026.
**Exam version:** Exam published September 30, 2025; exam guide updated September 30, 2025 (current PDF is filed under 2026-10 with "august" in the filename)
**Source of truth:** Official Databricks exam guide PDF:
https://www.databricks.com/sites/default/files/2026-10/databricks-certified-machine-learning-professional-exam-guide-august.pdf
(Re-check the PDF filename with a targeted search before launch.)

**Exam facts:** 59 scored multiple-choice questions, up to 10 unscored items (time already included), 120 minutes, USD 200, English only, no test aides, no prerequisites, one year of hands-on Databricks experience recommended, valid 2 years (recertify by taking the current live exam). The guide names no language; objectives and samples are Python and Spark ML.

**Structure:** 6 units across the 3 official sections, 52 chapters, continuous numbering. Section 1 and Section 2 are each split into units along their official sub-headings, because a single 22-objective unit would be unteachable. Trade-off lessons flagged (TO). Engine: v2 with case-study bookends.

**Objective numbering:** The official guide lists objectives as unnumbered bullets under sub-headings. Numbers below are Certify's own, assigned per section in the order the bullets appear, so coverage can be audited 1:1. All 47 objectives are covered (22 / 20 / 5, confirmed against the PDF).

- Section 1 (Model Development): Spark ML 1.1 to 1.7, Scaling and Tuning 1.8 to 1.14, Advanced MLflow 1.15 to 1.17, Advanced Feature Store 1.18 to 1.22
- Section 2 (MLOps): Lifecycle 2.1 to 2.2, Validation Testing 2.3 to 2.6, Environment Architectures 2.7 to 2.8, Automated Retraining 2.9 to 2.10, Drift Detection and Monitoring 2.11 to 2.20
- Section 3 (Model Deployment): Deployment Strategies 3.1 to 3.2, Custom Model Serving 3.3 to 3.5

**Chapter allocation vs weight:**

| Unit | Official section | Weight | Chapters | Share |
|---|---|---|---|---|
| 1 | Model Development: Spark ML | 44% (Section 1, shared) | 8 | 15.4% |
| 2 | Model Development: Scaling and Tuning | (Section 1) | 8 | 15.4% |
| 3 | Model Development: Advanced MLflow and Feature Store | (Section 1) | 8 | 15.4% |
| 4 | MLOps: Lifecycle, Testing, Environments | 44% (Section 2, shared) | 10 | 19.2% |
| 5 | MLOps: Retraining, Drift, Monitoring | (Section 2) | 12 | 23.1% |
| 6 | Model Deployment | 12% | 6 | 11.5% |

Section totals: Section 1 = 24 chapters (46%), Section 2 = 22 chapters (42%), Section 3 = 6 chapters (11.5%).

---

## Case-study bookends (locked)

**Company:** Fernway Market, an online grocery delivery company operating across North America. Standalone to this course (no shared universe).

Why it fits: every exam area has a natural home. Hundreds of millions of order rows (Spark ML at scale), per-store demand forecasts (group-specific training with the Pandas Function API), real-time ETA and fraud scoring (online features, on-demand features, custom PyFunc), a dev/staging/prod MLOps platform team (testing, bundles), seasonal demand shifts (drift, retraining), and Black Friday traffic spikes on serving endpoints (canary rollouts, scale-out).

Each chapter opens with a case-file card (the situation at Fernway and the decision the chapter answers) and closes with a decision card. Teaching cards are unchanged.

---

## Unit 1: Spark ML at Scale

Eyebrow: `Unit 1 · Spark ML`

1. **When Spark ML Fits: Data Size, Model Family, Use Case** (1.1)
   Signals that justify distributed Spark ML over single-node libraries, and the signals that do not.
2. **Building a Spark ML Pipeline: Stages, fit and transform** (1.2)
   Assembling transformers and estimators into a Pipeline and reusing the fitted PipelineModel.
3. **Feature Transformers: StringIndexer, OneHotEncoder, VectorAssembler** (1.3)
   Picking the transformer for each preparation job, and the order they must run in.
4. **Choosing an Estimator for the Problem** (1.3)
   Matching target type and problem shape to a Spark ML estimator (regression, classification, clustering, recommendation).
5. **Tuning Spark ML: CrossValidator vs TrainValidationSplit (TO)** (1.4)
   ParamGridBuilder with each tuner, and the cost vs reliability trade-off that picks one.
6. **Evaluating Spark ML Models: Evaluators and Metrics** (1.5)
   Choosing the evaluator and metric that fit the business decision (RMSE, AUC, F1, log loss).
7. **Batch and Streaming Scoring with a Fitted Pipeline** (1.6)
   Applying a PipelineModel to batch tables and Structured Streaming sources.
8. **Spark ML vs Single-Node Models for Inference (TO)** (1.7)
   Which model type fits batch, streaming and real-time inference, and why Spark ML is a poor fit for low-latency serving.

## Unit 2: Distributed Training and Tuning

Eyebrow: `Unit 2 · Scaling`

9. **Scaling Training with Spark ML and pandas UDFs** (1.8)
   When to train with native Spark ML vs distribute single-node libraries through pandas UDFs and Function APIs.
10. **Group-Specific Training with the Pandas Function API** (1.14)
    One model per group (e.g. per store) with applyInPandas, and logging each group's model.
11. **Group-Specific Inference at Scale** (1.14)
    Routing each group's rows to its own model in parallel, and the failure modes when groups are skewed.
12. **Distributed Optuna Tuning Integrated with MLflow** (1.9)
    Distributing trials across the cluster with MLflow-backed storage so every trial is tracked.
13. **Distributed Hyperparameter Tuning with Ray Tune** (1.10)
    Running Ray on Databricks for tuning, and logging results back to MLflow.
14. **Vertical vs Horizontal Scaling (TO)** (1.11)
    Bigger nodes vs more nodes: memory-bound vs compute-bound signals, cost and coordination overhead.
15. **Data Parallelism vs Model Parallelism (TO)** (1.12)
    Splitting the data vs splitting the model, and the model-size and dataset-size signals that pick each.
16. **Ray vs Spark for Distributed Training (TO)** (1.13)
    Data-heavy ETL-adjacent training vs compute-heavy, Python-native, iterative workloads.

## Unit 3: Advanced MLflow and Feature Store

Eyebrow: `Unit 3 · MLflow & Features`

17. **Nested Runs for Complex Experiments** (1.15)
    Parent run for the search, child runs per configuration, a separate final evaluation run.
18. **Logging Custom Metrics, Parameters and Artifacts Programmatically** (1.16)
    The MLflow logging calls for each kind of record, and when autologging is not enough.
19. **Custom PyFunc Models with Real-Time Feature Engineering** (1.17)
    Wrapping preprocessing and the model in one PyFunc so serving computes features at request time.
20. **Point-in-Time Correct Feature Lookups** (1.18)
    Time series feature tables and timestamp lookup keys, and the leakage they prevent in both training and inference.
21. **Automating Feature Computation with the Feature Engineering Client** (1.19)
    Scheduled feature pipelines that write to Unity Catalog feature tables.
22. **Online Feature Stores for Low-Latency Lookups** (1.20)
    Creating a Lakebase-backed online store and publishing feature tables (the guide's "online tables via Databricks SDK" objective, taught on the current product).
23. **Streaming Ingestion for Real-Time Features** (1.21)
    Designing streaming feature pipelines that keep online features fresh at scale.
24. **On-Demand Features and Feature Serving** (1.22)
    Defining a feature once so training and production compute it identically, and serving features through a feature serving endpoint.

## Unit 4: Lifecycle, Testing and Environments

Eyebrow: `Unit 4 · MLOps Foundations`

25. **The Deploy-Code Lifecycle Pipeline: Dev, Staging, Prod** (2.1)
    The architecture components that move code through environments under the deploy code strategy, and the gates between them.
26. **Deploy Code vs Deploy Models (TO)** (2.1)
    Contrast case: why the guide's pipeline assumes deploy code, and the narrow cases where promoting a trained artifact still fits.
27. **Mapping Databricks Features to Lifecycle Activities** (2.2)
    Which product owns which lifecycle step (Unity Catalog, MLflow, Jobs, Model Serving, monitoring).
28. **Model Versions and Aliases in Unity Catalog** (2.2)
    Using aliases such as champion for stable references that survive version changes.
29. **Unit Testing Notebook Functions** (2.3)
    Moving logic into testable functions and checking expected outputs for given inputs with pytest.
30. **Which Tests Run Where: Unit vs Integration Across Dev, Test, Prod** (2.4)
    Placing each test type at the stage where it catches the most for the least cost.
31. **Designing an End-to-End Integration Test** (2.5)
    Covering feature engineering, training, evaluation, deployment and inference, and re-running only the stages a change affects.
32. **Organizing Functions and Tests: Notebooks vs Python Modules (TO)** (2.6)
    In-notebook tests vs importable modules in a repo folder, and the maintainability trade-off.
33. **Designing Scalable ML Environments** (2.7)
    Workspace and Unity Catalog layout for separate dev, staging and prod environments.
34. **Defining ML Assets with Declarative Automation Bundles** (2.8)
    Serving endpoints, MLflow experiments, registered models and jobs as version-controlled bundle resources.

## Unit 5: Retraining, Drift and Monitoring

Eyebrow: `Unit 5 · Monitoring`

35. **Triggering Retraining from Drift and Performance Alerts** (2.9)
    Wiring monitor alerts to retraining jobs, and when scheduled retraining is enough.
36. **Selecting the Top Model During Retraining** (2.10)
    Champion vs challenger comparison, choosing the metric that matches the decision (e.g. log loss for threshold-based actions).
37. **Drift Tests for Numerical vs Categorical Features (TO)** (2.11)
    The statistical tests in the drift metrics table (KS, Wasserstein, chi-square, Jensen-Shannon, PSI): which fits which data type, and judging whether a change is significant.
38. **Monitor Profile Types: Snapshot vs Time Series vs Inference (TO)** (2.12)
    Matching the table and use case to the monitor profile, and explaining why.
39. **Building a Monitor** (2.13)
    Creating a data profiling monitor on a table: profile type, schedule, baseline, output schema.
40. **Anatomy of a Monitoring Pipeline** (2.14)
    The components the guide names (logging, drift detection, model performance, model health), and how metrics tables and the dashboard connect them.
41. **Baseline Drift vs Consecutive Drift (TO)** (2.16)
    Comparing against a fixed baseline table vs comparing successive time windows.
42. **Alerting When Drift Crosses a Threshold** (2.15)
    SQL alerts on metrics tables that notify stakeholders, and choosing thresholds that avoid alert fatigue.
43. **Model Performance Trends from Inference Tables** (2.17)
    Joining late-arriving ground truth labels and reading quality metrics over time.
44. **Custom Metrics: Aggregate, Derived and Drift** (2.18)
    Defining business metrics that land in the metrics tables.
45. **Slicing and Granularity** (2.19)
    Evaluating metrics by feature slice and time window to find where a model degrades.
46. **Endpoint Health Metrics** (2.20)
    Latency, request rate, error rate, CPU and memory: what each symptom points to.

## Unit 6: Model Deployment

Eyebrow: `Unit 6 · Deployment`

47. **Blue-Green vs Canary Deployment (TO)** (3.1)
    Instant switch with fast rollback vs gradual exposure, for high-traffic applications.
48. **Rolling Out a Model with Model Serving: Served Entities and Traffic Split** (3.2)
    Adding a second served entity and shifting traffic in steps.
49. **Scaling a High-Traffic Endpoint: Scale-Out and Route Optimization** (3.2)
    Compute scale-out, provisioned concurrency and route-optimized endpoints for heavy load.
50. **Registering Custom PyFunc Models and Artifacts in Unity Catalog** (3.3)
    Logging the model with its custom artifacts, signature and dependencies so it can be served.
51. **Deploying Custom Models: Deployments SDK vs REST API vs UI** (3.5)
    The three deployment routes and when each fits (automation, CI/CD, one-off).
52. **Querying Served Models: REST API vs MLflow Deployments SDK** (3.4)
    Request formats, authentication, and the SDK predict call from Python.

---

## Authoring notes

- **Terminology:** the full rules live in cert-config-databricks-ml-professional.md. In short: "data profiling" (formerly Lakehouse Monitoring, named once in Ch 38), "Databricks Online Feature Stores" (online tables named once as the deprecated predecessor in Ch 22), "Declarative Automation Bundles" (never DABs as the primary term), Unity Catalog aliases over Workspace Model Registry stages (contrast only, Ch 28). Confirm the serving product name before Unit 6.
- **Professional depth:** this is the hardest Databricks exam. Expect lessons near the 11 to 12 card ceiling in Units 2, 4 and 5; split rather than compress (one-line index fix).
- **Reuse from ML Associate:** Ch 2 to 4, 6, 17 and 20 can adapt existing Associate material, rewritten to Professional depth. Rewrite all quiz and exam items; never reuse questions across courses.
- **Sample-question echoes to cover (topics only, never wording):** Spark ML encoding at scale and estimator choice (Ch 3, 4), Optuna with MLflow storage (Ch 12), nested runs (Ch 17), aliases for stable comparison (Ch 28), selective integration test re-runs (Ch 31), log loss for threshold actions (Ch 36), safe high-traffic rollout (Ch 48 to 49), bundles for ML infrastructure (Ch 34), Deployments SDK predict (Ch 52).
- **Recommended training (for scope framing only, not wording):** Machine Learning at Scale; Advanced Machine Learning Operations.
- **Exams:** one unit exam per unit (`mlp-practice-exam-01` to `06`, one question per chapter, 52 in all; each unit's last chapter points at its exam), then 3 sealed full-length mocks (`mlp-practice-exam-07` to `09`: 59 questions, 120 minutes, sampled by unit at approx. 9 / 9 / 8 / 11 / 15 / 7, their own scenarios). The mocks are a sealed pool: never reuse their questions in the unit exams and never draw them into drills.
