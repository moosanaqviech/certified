curriculum-index-aws-dea-c01.md
Curriculum Index: AWS Certified Data Engineer Associate (DEA-C01)

Status: Draft (authoritative source for unit and chapter placement once locked). Task
statement numbers and skill descriptions below were compiled by cross-checking the
official exam guide's domain weights and task statement titles across multiple
independent lookups this session; direct WebFetch access to docs.aws.amazon.com and
d1.awsstatic.com was blocked (403) for the primary PDF, so re-fetch and diff the
official exam guide PDF (linked below) against this file before authoring Chapter 1,
and again before launch, per the same rule the Professional index uses.

Exam version: DEA-C01, version 1.0. Source of truth: official AWS Certified Data
Engineer - Associate exam guide, linked from
https://aws.amazon.com/certification/certified-data-engineer-associate/ (PDF at
docs.aws.amazon.com/pdfs/aws-certification/latest/data-engineer-associate-01/data-engineer-associate-01.pdf).

Exam facts: 65 questions total (50 scored, 15 unscored, unidentified), 130 minutes,
USD 150, passing score 720 on a 100-1000 scaled range (compensatory scoring, no
per-domain minimum), multiple choice and multiple response, Pearson VUE testing
center or online proctored. Already published and sourced in
blog/aws-dea-c01-exam-guide-domains-weighting.html.

Structure: 4 units mirroring the 4 official content domains, 36 chapters. Each
chapter maps to official task statement numbers. Trade-off lessons are flagged (TO).

Unit 1: Data Ingestion and Transformation (34%)

Task statements: 1.1 Perform data ingestion, 1.2 Transform data, 1.3 Orchestrate
data pipelines, 1.4 Apply programming concepts.

    Streaming vs batch ingestion: choosing the right entry point (TO) (1.1)
    Kinesis Data Streams: shards, retention, replay (1.1)
    Kinesis Data Streams vs Amazon MSK for streaming ingestion (TO) (1.1)
    Amazon Data Firehose: no-code delivery to a destination (1.1)
    Amazon Managed Service for Apache Flink: stateful stream processing (1.1)
    Batch ingestion sources: S3, AWS DMS, Amazon AppFlow (1.1)
    AWS Glue for ETL: jobs, triggers, DynamicFrames (1.2)
    AWS Glue vs Amazon EMR for transformation (TO) (1.2)
    Transforming data in Amazon Redshift: ELT patterns (1.2)
    Orchestrating with Step Functions vs Amazon MWAA (TO) (1.3)
    Event-driven pipelines with Amazon EventBridge (1.3)
    Infrastructure as code and CI/CD for data pipelines (1.4)
    Lambda for data processing: concurrency and performance tuning (1.4)

Unit 2: Data Store Management (26%)

Task statements: 2.1 Choose a data store, 2.2 Understand data cataloging systems,
2.3 Manage the lifecycle of data.

    Choosing a data store: Redshift vs DynamoDB vs RDS (TO) (2.1)
    Data lakes on S3: structure and access patterns (2.1)
    AWS Glue Data Catalog and crawlers (2.2)
    Schema discovery and schema evolution (2.2)
    AWS Schema Conversion Tool: current status and use cases (2.2)
    Open table formats: Apache Iceberg on S3 (2.1, 2.2)
    S3 Lifecycle policies and storage class transitions (2.3)
    DynamoDB TTL, versioning, and lifecycle management (2.3)
    Redshift performance basics: distribution keys and sort keys (2.1)

Unit 3: Data Operations and Support (22%)

Task statements: 3.1 Automate data processing, 3.2 Analyze data, 3.3 Maintain and
monitor data pipelines, 3.4 Ensure data quality.

    Automating data processing with Glue workflows and Step Functions (3.1)
    Querying data with Amazon Athena (3.2)
    Federated and cross-service queries: Redshift Spectrum (3.2)
    Log analysis with Athena and Amazon OpenSearch Service (3.2)
    Monitoring pipelines with CloudWatch Logs and metrics (3.3)
    Auditing with CloudTrail (3.3)
    Data quality checks with AWS Glue DataBrew (3.4)
    Data skew and sampling techniques for quality checks (3.4)

Unit 4: Data Security and Governance (18%)

Task statements: 4.1 Apply authentication mechanisms, 4.2 Apply authorization
mechanisms, 4.3 Ensure data encryption and masking, 4.4 Prepare logs for audit,
4.5 Understand data privacy and governance.

    IAM authentication for data services (4.1)
    IAM policies vs Lake Formation permissions: RBAC vs ABAC (TO) (4.2)
    Encryption with AWS KMS (4.3)
    Data masking and PII detection with Amazon Macie (4.3)
    Audit logging with CloudTrail and CloudTrail Lake (4.4)
    Data privacy and governance frameworks (4.5)

Cross-reference notes (deliberate syllabus overlap)

    Orchestration (Step Functions, Amazon MWAA) appears in Units 1 and 3: building
    the pipeline (Ch 10-11) vs automating and monitoring it once running (Ch 23,
    27-28). Cross-link, do not repeat.
    Lake Formation appears in Units 2 and 4: as a data lake structure and cataloging
    concern (Ch 15) vs as a permissions and governance concern (Ch 32). Cross-link,
    do not repeat.
    Apache Iceberg (open table formats) touches both choosing a data store (2.1) and
    cataloging (2.2); one chapter covers both angles rather than splitting it.
    CloudTrail appears in Units 3 and 4: general pipeline auditing (Ch 28) vs the
    audit-log task statement itself (Ch 34). Cross-link, do not repeat.

Practice exam plan

    Question style: scenario-based, single best answer, 4 options, plausible
    distractors, one question per chapter in scope, 2 minutes per question.
    Pass bar: 72%, approximating the real exam's 720/1000 scaled passing score
    (confirm against the current exam guide before launch).
    Progressive coverage plan (5 exams):
        Unit 1 only (13 chapters, 26 min)
        Units 1-2 (22 chapters, 44 min)
        Units 1-3 (30 chapters, 60 min)
        Full coverage, Units 1-4 (36 chapters, 72 min)
        Full coverage, second pass with new scenarios (36 chapters, 72 min)

Terminology rules (must match published blog content)

    "Amazon Data Firehose," never "Kinesis Data Firehose" (renamed February 9,
    2024, per blog/amazon-data-firehose-managed-flink-renamed.html).
    "Amazon Managed Service for Apache Flink," never "Kinesis Data Analytics"
    (renamed August 30, 2023, same source).
    Apache Iceberg is the open table format example when the exam guide references
    open table formats; no other table format is named in the current guide.
    Both renames are cosmetic only: API operations, the CLI, IAM action names, and
    CloudWatch namespaces still use the pre-rename identifiers. Lessons that show
    IAM policies, CLI commands, or SDK calls should use the retained identifiers
    (firehose:*, aws firehose, kinesisanalyticsv2) even while prose uses the current
    service name, and should call out the split explicitly the first time it comes
    up (Chapter 4 is the natural place).
