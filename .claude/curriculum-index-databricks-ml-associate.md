curriculum-index-databricks-ml-associate.md
Curriculum Index: Databricks Certified Machine Learning Associate

Status: LOCKED against the official exam guide PDF (1 Mar 2025 edition), verified
23 Jul 2026 by extracting the text of the official PDF directly. This file is now
the authoritative source for unit and chapter placement: if a later request
conflicts with it, flag the conflict and propose a one-line fix rather than
silently complying. Re-verify if Databricks publishes a newer edition.

Exam version: Databricks Certified Machine Learning Associate, exam guide dated
1 Mar 2025 ("This version covers the currently live version as of Mar 1, 2025").
Source of truth: the official exam guide PDF linked from
https://www.databricks.com/learn/certification/machine-learning-associate

Exam facts (all confirmed verbatim from the PDF):
    48 scored multiple-choice or multiple-selection questions.
    Unscored items may also appear; they are not identified and do not affect
    your score, and extra time is factored in for them. So 48 is the SCORED
    count, not the total presented.
    Time limit: 90 minutes. Registration fee: USD 200.
    Delivery: Online Proctored. Test aides: none allowed.
    Validity: 2 years; full re-exam required to recertify.
    Prerequisite: none required; six months of hands-on experience is highly
    recommended.
    PASSING SCORE: the PDF publishes NO cut score. Do not state one. Any "70%"
    figure circulating online is unsourced.

Section weights: the PDF publishes NO percentages. However it lists exactly 48
objectives and the exam has exactly 48 scored questions, so coverage is
approximately one question per objective and the weights below are DERIVED from
objective counts. They are used for exam design, not quoted as official.

    Section 1  Databricks Machine Learning  18 objectives  37.5%
    Section 2  Data Processing               9 objectives  18.75%
    Section 3  Model Development            15 objectives  31.25%
    Section 4  Model Deployment              6 objectives  12.5%

Note on a prior error: this index previously named Section 2 "ML Workflows" and
claimed 45 scored questions and a 70% pass bar. All three were wrong, inherited
from third-party reproductions that blended guide editions. Corrected here.

Structure: 4 units mirroring the 4 official sections. 30 chapters are authored
and live; the gap chapters listed at the end are outstanding. Trade-off lessons
are flagged (TO). Chapters marked (OFF) are supporting material that no official
objective covers: keep them, but never let them displace an objective.

===============================================================================
Unit 1: Databricks Machine Learning (18 objectives, ~38%)
===============================================================================

Official objectives, mapped to chapters:

    Identify the best practices of an MLOps strategy ................. Ch 31
    Identify the advantages of using ML runtimes ..................... Ch 02
    Identify how AutoML facilitates model/feature selection .......... Ch 03
    Identify the advantages AutoML brings to model development ....... Ch 03, 04
    Benefits of feature store tables at the account level in Unity
      Catalog vs at the workspace level .............................. Ch 05, 06
    Create a feature store table in Unity Catalog .................... Ch 06
    Write data to a feature store table .............................. Ch 06
    Train a model with features from a feature store table ........... Ch 06
    Score a model using features from a feature store table .......... Ch 06
    Describe the differences between online and offline feature tables  Ch 07
    Identify the best run using the MLflow Client API ................ Ch 11
    Manually log metrics, artifacts, and models in an MLflow Run ..... Ch 08
    Identify information available in the MLflow UI .................. Ch 08
    Register a model using the MLflow Client API in the UC registry .. Ch 10
    Benefits of registering models in the UC registry over the
      workspace registry ............................................. Ch 10
    Scenarios where promoting code is preferred over promoting
      models and vice versa .......................................... Ch 32
    Set or remove a tag for a model .................................. Ch 10
    Promote a challenger model to a champion model using aliases ..... Ch 10

Authored chapters:

    01  The Databricks ML workspace: compute, Git folders, Lakeflow Jobs  (OFF)
        Orientation only; no objective covers it. Keep as the on-ramp.
    02  Databricks Runtime for Machine Learning
    03  AutoML: automated model and feature selection
    04  Reading AutoML output: the generated notebooks and the best trial
    05  Unity Catalog for ML: governing data, features, and models
    06  Feature Engineering in Unity Catalog: creating and consuming tables
    07  Online vs offline feature tables (TO)
    08  MLflow Tracking: experiments, runs, metrics, and artifacts
    09  MLflow Models: flavors and packaging a model  (OFF)
        Supporting material for logging/serving; no objective names flavors.
    10  MLflow Model Registry in Unity Catalog: versions and aliases
    11  Finding the best run with the MLflow Client API

===============================================================================
Unit 2: Data Processing (9 objectives, ~19%)
===============================================================================

Official name is "Data Processing", NOT "ML Workflows" (that was the previous
guide edition). Note that evaluation metrics belong to Section 3, not here.

Official objectives, mapped to chapters:

    Compute summary statistics on a Spark DataFrame using .summary()
      or dbutils data summaries ...................................... Ch 12
    Remove outliers from a Spark DataFrame based on standard
      deviation or IQR ............................................... Ch 13
    Create visualizations for categorical or continuous features ..... Ch 33
    Compare two categorical or two continuous features using the
      appropriate method ............................................. Ch 34
    Compare and contrast imputing missing values with the mean or
      median or mode value ........................................... Ch 14
    Impute missing values with the mode, mean, or median value ....... Ch 14
    Use one-hot encoding for categorical features .................... Ch 15
    Identify the model types or data sets for which one-hot encoding
      is or is not appropriate ....................................... Ch 15
    Identify scenarios where log scale transformation is appropriate .. Ch 35

Authored chapters:

    12  Exploratory data analysis: summary statistics and data profiling
    13  Detecting and removing outliers
    14  Handling missing values: imputation strategies
    15  Encoding categorical features: one-hot encoding and alternatives
    16  Train, validation, and test splits done right  (OFF)
        No objective names splitting on its own; Section 3 covers CV vs
        train-validation split. Keep: it is the prerequisite for Ch 23.
    17  Evaluation metrics: choosing the right one for the task
        MISPLACED: this serves three Section 3 objectives. Content is correct;
        only its unit label is wrong. Treat it as Section 3 for exam coverage.

===============================================================================
Unit 3: Model Development (15 objectives, ~31%)
===============================================================================

Official objectives, mapped to chapters:

    Use ML foundations to select the appropriate algorithm for a
      given model scenario ........................................... Ch 36
    Identify methods to mitigate data imbalance in training data ..... Ch 37
    Compare estimators and transformers .............................. Ch 18
    Develop a training pipeline ...................................... Ch 19
    Use Hyperopt's fmin operation to tune hyperparameters ............ Ch 20
    Perform random or grid or Bayesian search for tuning ............. Ch 21
    Parallelize single node models for hyperparameter tuning ......... Ch 22
    Benefits and downsides of cross-validation over a
      train-validation split ......................................... Ch 23
    Perform cross-validation as part of model fitting ................ Ch 23
    Identify the number of models trained with grid-search and
      cross-validation ............................................... Ch 24
    Use common classification metrics: F1, Log Loss, ROC/AUC ......... Ch 17
    Use common regression metrics: RMSE, MAE, R-squared .............. Ch 17
    Choose the most appropriate metric for a scenario objective ...... Ch 17
    Identify the need to exponentiate log-transformed variables
      before calculating metrics or interpreting predictions ......... Ch 35
    Assess the impact of model complexity and the bias-variance
      tradeoff on model performance .................................. Ch 38

Authored chapters:

    18  Spark ML building blocks: transformers, estimators, and pipelines
    19  Building a Spark ML pipeline: features to a fitted model
    20  Hyperparameter tuning with Hyperopt: fmin and the search space
    21  Search strategies: grid vs random vs Bayesian (TO)
    22  Distributing tuning with SparkTrials
    23  Cross-validation vs a single train-validation split (TO)
    24  Counting models: grid search times cross-validation folds
    25  Pandas API on Spark: scaling pandas code to a cluster  (OFF)
    26  Pandas UDFs and the Pandas Function APIs  (OFF)
        25 and 26 appear in NO objective of the 1 Mar 2025 guide; they came
        from third-party guides describing an older edition. Keep as bonus
        material, clearly secondary to the objectives above.

===============================================================================
Unit 4: Model Deployment (6 objectives, ~12%)
===============================================================================

Fully covered: 6 of 6 objectives.

Official objectives, mapped to chapters:

    Identify the differences and advantages of model serving
      approaches: batch, realtime, and streaming ..................... Ch 27
    Deploy a custom model to a model endpoint ........................ Ch 30
    Use pandas to perform batch inference ............................ Ch 28
    Identify how streaming inference is performed with Delta Live
      Tables (taught as Lakeflow Spark Declarative Pipelines) ........ Ch 29
    Deploy and query a model for realtime inference .................. Ch 30
    Split data between endpoints for realtime inference .............. Ch 30

Authored chapters:

    27  Deployment paradigms: batch vs streaming vs real-time (TO)
    28  Batch inference with Spark and pandas UDFs
    29  Streaming inference with Lakeflow Spark Declarative Pipelines
    30  Real-time serving: Model Serving endpoints

===============================================================================
Gap chapters to author (10 uncovered objectives, 8 lessons)
===============================================================================

Numbered from 31 so existing files and links are untouched. Two pairs merge
naturally, so 10 objectives become 8 lessons.

    31  MLOps strategy and best practices              Unit 1   SHIPPED
    32  Promoting code vs promoting models (TO)        Unit 1   SHIPPED
        (tags objective folded into Ch 10 as a card, rather than a thin
        standalone lesson: tags belong with versions and aliases)  SHIPPED
    33  Visualizing features: categorical and continuous  Unit 2  SHIPPED
    34  Comparing two features: choosing the right method Unit 2  SHIPPED
    35  Log-scale transformation, and exponentiating      Unit 2  SHIPPED
        interpreting metrics (covers both related objectives)
    36  Choosing an algorithm for the scenario            Unit 3  SHIPPED
    37  Handling class imbalance in training data         Unit 3  SHIPPED
    38  Model complexity and the bias-variance tradeoff   Unit 3  SHIPPED

Coverage after these ship: 48 of 48 objectives.
Current coverage: 48 of 48. All gap chapters shipped.

===============================================================================
Practice exam plan (objective-based, not chapter-based)
===============================================================================

The real exam is ~one question per objective, so exams map to OBJECTIVES.

    Question style: scenario-based, single best answer, 4 options, plausible
    distractors, 2 minutes per question. Each question carries a comment header
    naming the objective it tests, not just a chapter.
    Pass bar: do NOT publish a percentage as the official cut score. Use 70% as
    a practice target and label it as our own guidance, not Databricks'.
    Plan (5 exams):
        1  Section 1 only (18 objectives, 36 min)
        2  Sections 1-2 (27 objectives, 54 min)
        3  Sections 1-3 (42 objectives, 84 min)
        4  Full mock, all 48 objectives, 90 min (mirrors the real exam exactly)
        5  Full mock, second pass with new scenarios (48 objectives, 90 min)
    Exams 1-3 may be authored before the gap chapters ship, restricted to
    objectives that already have a lesson. Exam 4 requires full coverage.

===============================================================================
Terminology rules (see cert-config-databricks-ml-associate.md for the full list)
===============================================================================

    "Lakeflow Spark Declarative Pipelines," never "Delta Live Tables" or "DLT,"
    matching the repo-wide DE Professional rule. The 1 Mar 2025 guide text does
    say "Delta Live Tables" in the Section 4 objective and in Recommended
    Preparation; teach the current name and note the former one once (Ch 29).
    "Models in Unity Catalog" (versions plus aliases) is the recommended model
    registry; the legacy Workspace Model Registry with stages is contrast only.
    The guide's own wording backs this: it asks for benefits of the UC registry
    over the workspace registry, and for champion/challenger promotion via
    aliases.
    "Feature Engineering in Unity Catalog" is the current feature-store surface;
    the legacy Workspace Feature Store is contrast only. The guide asks for the
    benefits of account-level (UC) feature tables over workspace-level ones.
    Hyperopt (fmin, SparkTrials) is named in the guide and is what lessons
    teach; note once that Databricks now recommends Optuna for new work.
