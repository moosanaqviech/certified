curriculum-index-aws-dea-c01.md
Curriculum Index: AWS Certified Data Engineer Associate (DEA-C01)

Status: LOCKED against the official exam guide PDF, version 1.1 (published
12 December 2025), verified 27 Sep 2026 by downloading the PDF from
docs.aws.amazon.com and extracting its text directly. This file is now the
authoritative source for unit and chapter placement: if a later request conflicts
with it, flag the conflict and propose a one-line fix rather than silently
complying. Re-verify if AWS publishes version 1.2 or later (the guide says
updates are published about a month before they reach the exam).

Exam version: DEA-C01, exam guide version 1.1. Source of truth: the official AWS
Certified Data Engineer - Associate exam guide, linked from
https://aws.amazon.com/certification/certified-data-engineer-associate/ (PDF at
docs.aws.amazon.com/pdfs/aws-certification/latest/data-engineer-associate-01/data-engineer-associate-01.pdf).

Exam facts (confirmed from the version 1.1 PDF): 65 questions total (50 scored,
15 unscored, unidentified), 130 minutes, passing score 720 on a 100 to 1000 scaled
range (compensatory scoring, no per-domain minimum), multiple choice and multiple
response, Pearson VUE testing center or online proctored. Domain weights are
unchanged from version 1.0: 34 / 26 / 22 / 18. Already published and sourced in
blog/aws-dea-c01-exam-guide-domains-weighting.html.

What version 1.1 changed (and what this lock did about it)

    The separate "Knowledge of" and "Skills in" lists were consolidated into one
    numbered skill list per task (Skill 1.1.1 and so on). Task 1.2 is now titled
    "Transform and process data" (was "Transform data"). Task 2.4 "Design data
    models and schema evolution" was always in the guide; the draft index had
    folded it into 2.2, so Chapters 17 and 18 are retagged to 2.4 below.
    Eight skills were added. Four gap chapters (37 to 40) and three targeted card
    edits cover them:
        1.2.10 Integrate LLMs for data processing            -> Chapter 37
        2.1.7  Manage open table formats (Apache Iceberg)   -> Chapter 19 (already covered)
        2.1.8  Describe vector index types (HNSW, IVF)      -> Chapter 38
        2.2.6  Business data catalogs (SageMaker Catalog)   -> Chapter 39
        2.4.6  Vectorization concepts (Bedrock knowledge base) -> Chapter 38
        4.1.7  Domain, domain units, projects (SageMaker Unified Studio) -> Chapter 39
        4.5.6  Data access through SageMaker Catalog projects -> Chapter 39
        4.5.7  Governance data framework and data sharing patterns -> Chapter 40
    Reworded skills that also need coverage: 2.1.3 (HNSW with Aurora PostgreSQL,
    MemoryDB for fast key/value access) -> Chapter 38; 2.4.4 (lineage via
    SageMaker Catalog) -> Chapter 39; 3.1.6 (prepare data in SageMaker Unified
    Studio) -> Chapter 39; 3.2.4 (Athena notebooks using Apache Spark) -> new card
    in Chapter 24; 3.2.3 (SQL in Redshift and Athena) -> Chapters 9, 24, 25.
    In-scope services added: Amazon Aurora, Amazon Q, Amazon Bedrock, Amazon
    Kendra, AWS Data Exchange, Amazon S3 Tables. S3 Tables gets a new card in
    Chapter 19; Bedrock is Chapter 37; Data Exchange is in Chapter 40; Amazon Q
    is a one-pill mention in Chapter 40; Kendra is named only as a contrast case.
    In-scope services removed: AWS Cloud9, AWS CodeCommit, AWS Schema Conversion
    Tool (AWS SCT). Chapter 12 no longer names CodeCommit as the source stage;
    Chapter 18 stays (Skill 2.4.3 still says "AWS SCT and AWS DMS Schema
    Conversion") but its "Where it lives today" card now says the standalone tool
    left the in-scope list and DMS Schema Conversion is the name to expect.
    The in-scope list still says "Amazon Kinesis Data Firehose" even though the
    service is Amazon Data Firehose; the terminology rule below stands.

Structure: 4 units mirroring the 4 official content domains, 40 chapters. Chapters
1 to 36 are the original syllabus in play order; the gap chapters 37 to 40 keep
their numbers (file names never change) and are placed at the end of the unit they
belong to, so play order inside a unit is not strictly numeric. Each chapter maps
to official task statement numbers. Trade-off lessons are flagged (TO).

Unit 1: Data Ingestion and Transformation (34%)

Task statements: 1.1 Perform data ingestion, 1.2 Transform and process data,
1.3 Orchestrate data pipelines, 1.4 Apply programming concepts.

    01  Streaming vs batch ingestion: choosing the right entry point (TO) (1.1)
    02  Kinesis Data Streams: shards, retention, replay (1.1)
    03  Kinesis Data Streams vs Amazon MSK for streaming ingestion (TO) (1.1)
    04  Amazon Data Firehose: no-code delivery to a destination (1.1)
    05  Amazon Managed Service for Apache Flink: stateful stream processing (1.1)
    06  Batch ingestion sources: S3, AWS DMS, Amazon AppFlow (1.1)
    07  AWS Glue for ETL: jobs, triggers, DynamicFrames (1.2)
    08  AWS Glue vs Amazon EMR for transformation (TO) (1.2)
    09  Transforming data in Amazon Redshift: ELT patterns (1.2, 3.2)
    10  Orchestrating with Step Functions vs Amazon MWAA (TO) (1.3)
    11  Event-driven pipelines with Amazon EventBridge (1.3)
    12  Infrastructure as code and CI/CD for data pipelines (1.4)
    13  Lambda for data processing: concurrency and performance tuning (1.4)
    37  Integrating LLMs into data processing with Amazon Bedrock (1.2)
        Skill 1.2.10. Bedrock as a pipeline step: Converse and InvokeModel from
        Glue or Lambda, batch inference over JSONL in S3, extraction,
        classification and enrichment jobs, guardrails, and when a model call
        is the wrong tool. Plays after Chapter 13 and closes the unit.

Unit 2: Data Store Management (26%)

Task statements: 2.1 Choose a data store, 2.2 Understand data cataloging systems,
2.3 Manage the lifecycle of data, 2.4 Design data models and schema evolution.

    14  Choosing a data store: Redshift vs DynamoDB vs RDS (TO) (2.1)
    15  Data lakes on S3: structure and access patterns (2.1)
    16  AWS Glue Data Catalog and crawlers (2.2)
    17  Schema discovery and schema evolution (2.2, 2.4)
    18  AWS Schema Conversion Tool and DMS Schema Conversion (2.4)
    19  Open table formats: Apache Iceberg on S3, and S3 Tables (2.1, 2.2)
    20  S3 Lifecycle policies and storage class transitions (2.3)
    21  DynamoDB TTL, versioning, and lifecycle management (2.3)
    22  Redshift performance basics: distribution keys and sort keys (2.1, 2.4)
    38  Vector data stores: embeddings, HNSW vs IVF, Bedrock Knowledge Bases (TO) (2.1, 2.4)
        Skills 2.1.3, 2.1.8, 2.4.6. Shared ground is vectorization (embedding
        models, chunking, Bedrock Knowledge Bases as the managed ingest path);
        the two options are HNSW and IVF indexes; the store cards cover Aurora
        PostgreSQL with pgvector, OpenSearch, and MemoryDB as the fast
        key/value and vector option. Plays after Chapter 22.
    39  SageMaker Unified Studio and SageMaker Catalog: domains, projects, lineage (2.2, 2.4)
        Skills 2.2.6, 2.4.4, 3.1.6, 4.1.7, 4.5.6. Domain, domain units and
        projects; the business catalog (built on Amazon DataZone) versus the
        technical Glue Data Catalog; publish, subscribe and approve; lineage;
        preparing data inside Unified Studio. Plays after Chapter 38 and closes
        the unit.

Unit 3: Data Operations and Support (22%)

Task statements: 3.1 Automate data processing, 3.2 Analyze data, 3.3 Maintain and
monitor data pipelines, 3.4 Ensure data quality.

    23  Automating data processing with Glue workflows and Step Functions (3.1)
    24  Querying data with Amazon Athena: SQL and Spark notebooks (3.2)
    25  Federated and cross-service queries: Redshift Spectrum (3.2)
    26  Log analysis with Athena and Amazon OpenSearch Service (3.2, 3.3)
    27  Monitoring pipelines with CloudWatch Logs and metrics (3.3)
    28  Auditing with CloudTrail (3.3)
    29  Data quality checks with AWS Glue DataBrew (3.4)
    30  Data skew and sampling techniques for quality checks (3.4)

Unit 4: Data Security and Governance (18%)

Task statements: 4.1 Apply authentication mechanisms, 4.2 Apply authorization
mechanisms, 4.3 Ensure data encryption and masking, 4.4 Prepare logs for audit,
4.5 Understand data privacy and governance.

    31  IAM authentication for data services (4.1)
    32  IAM policies vs Lake Formation permissions: RBAC vs ABAC (TO) (4.2)
    33  Encryption with AWS KMS (4.3)
    34  Data masking and PII detection with Amazon Macie (4.3, 4.5)
    35  Audit logging with CloudTrail and CloudTrail Lake (4.4)
    36  Data privacy and governance frameworks (4.5)
    40  Data sharing patterns: Redshift datashares, Lake Formation, AWS Data Exchange (4.5)
        Skills 4.5.1, 4.5.7. Share in place versus copy; Redshift datashares
        (producer, consumer, cross-account authorization); Lake Formation
        cross-account grants and resource links; AWS Data Exchange for
        third-party data; the data mesh producer/consumer pattern with a
        central catalog. Plays after Chapter 36 and closes the course.

Cross-reference notes (deliberate syllabus overlap)

    Orchestration (Step Functions, Amazon MWAA) appears in Units 1 and 3: building
    the pipeline (Ch 10-11) vs automating and monitoring it once running (Ch 23,
    27-28). Cross-link, do not repeat.
    Lake Formation appears in Units 2 and 4: as a data lake structure and cataloging
    concern (Ch 15) vs as a permissions concern (Ch 32) and a sharing mechanism
    (Ch 40). Cross-link, do not repeat.
    Apache Iceberg (open table formats) touches both choosing a data store (2.1) and
    cataloging (2.2); one chapter covers both angles rather than splitting it, and
    S3 Tables lives there as the managed Iceberg option.
    CloudTrail appears in Units 3 and 4: general pipeline auditing (Ch 28) vs the
    audit-log task statement itself (Ch 35). Cross-link, do not repeat.
    Catalogs: the Glue Data Catalog (technical, Ch 16) and SageMaker Catalog
    (business, Ch 39) are different products with different jobs; Ch 39 draws the
    line and Ch 16 is not edited.
    Bedrock appears in Ch 37 (calling a model inside a pipeline) and Ch 38
    (Knowledge Bases as the managed vectorization path). Ch 38 links back rather
    than re-teaching the API.
    Governance: Ch 36 covers the privacy and retention side of 4.5; Ch 40 covers
    the sharing side (4.5.1, 4.5.7). Neither repeats the other.

Practice exam plan

    Question style: scenario-based, single best answer, 4 options, plausible
    distractors, one question per chapter in scope, 2 minutes per question. A few
    multiple-response questions per exam are allowed (the real exam has them).
    Pass bar: 72%, approximating the real exam's 720/1000 scaled passing score.
    Progressive coverage plan (5 exams, updated for the gap chapters):
        Exam 1: Unit 1 only (14 chapters: 1-13, 37; 28 min)
        Exam 2: Units 1-2 (25 chapters: 1-22, 37-39; 50 min)
        Exam 3: Units 1-3 (33 chapters: 1-30, 37-39; 66 min)
        Exam 4: Full coverage, Units 1-4 (40 chapters; 80 min)
        Exam 5: Full coverage, second pass with new scenarios (40 chapters; 80 min)
    Sealed full-length mocks (65 questions, 130 minutes, sampled at the official
    weights) are not yet authored; the Practice hub shows Full mock as coming soon
    until they ship.

Terminology rules (must match published blog content)

    "Amazon Data Firehose," never "Kinesis Data Firehose" (renamed February 9,
    2024, per blog/amazon-data-firehose-managed-flink-renamed.html). The version
    1.1 in-scope list still prints the old name; the rule stands regardless.
    "Amazon Managed Service for Apache Flink," never "Kinesis Data Analytics"
    (renamed August 30, 2023, same source).
    Apache Iceberg is the open table format the exam guide names (Skill 2.1.7);
    no other table format is named in the current guide.
    "Amazon SageMaker Unified Studio" and "Amazon SageMaker Catalog" are the
    guide's names for the next generation of SageMaker; say "built on Amazon
    DataZone" once when introducing the catalog and then use the SageMaker name.
    "Amazon Bedrock Knowledge Bases" (plural product name); "knowledge base" in
    lower case for an instance of one.
    "AWS DMS Schema Conversion" for the managed feature; "AWS Schema Conversion
    Tool (AWS SCT)" only when naming the standalone tool that left the in-scope
    list.
    Both streaming renames are cosmetic only: API operations, the CLI, IAM action
    names, and CloudWatch namespaces still use the pre-rename identifiers. Lessons
    that show IAM policies, CLI commands, or SDK calls should use the retained
    identifiers (firehose:*, aws firehose, kinesisanalyticsv2) even while prose
    uses the current service name, and should call out the split explicitly the
    first time it comes up (Chapter 4 is the natural place).
