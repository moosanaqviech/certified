# Cert Config: AWS Certified Machine Learning Engineer Associate (MLA-C02)

Per-certification settings so the frozen engine rules stay generic. Pairs with
curriculum-index-aws-mla-c02.md (chapter placement; DRAFT, derived from the
official MLA-C02 exam guide at docs.aws.amazon.com).

## Identity

    Badge text: "AWS ML Engineer Associate (MLA-C02)"
    Course folder: aws-machine-learning-engineer-associate-mla-c02/
    Difficulty: Associate
    Standard blurb: Bite-sized, visual lessons for the AWS Certified Machine
      Learning Engineer Associate (MLA-C02) exam, built to teach the trade-off
      reasoning the test rewards across traditional ML, foundation models,
      RAG, and agents.
    Exam guide version: MLA-C02, in use from 29 Sep 2026 (beta code ME1-C02).
      Source: https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-02/machine-learning-engineer-associate-02.html
    Questions: 65 (50 scored + 15 unscored, unidentified). Multiple choice
      (1 of 4) and multiple response (2+ of 5+) only.
    Time: 130 minutes
    Pace: 2 minutes per question (65 x 2 = 130, exactly the real limit)
    Pass threshold: 720 on a 100 to 1,000 scaled score (published by AWS).
      Compensatory scoring: no per-domain minimum.
    Domains: 1 Data Preparation for ML and AI 28%, 2 ML Model and FM
      Development 24%, 3 Deployment and Orchestration 24%, 4 Operating,
      Monitoring, and Securing 24%.
    Code language: Python (SageMaker Python SDK, boto3). SQL only for Athena,
      Redshift, and pgvector examples.

## Course structure and eyebrows

    Three levels: Unit (exam domain) > Module (the guide's task statement,
      numbered N.M to match it) > Chapter (one or two skills). The course
      index.html nests modules:[...] inside each unit and renders a
      "Module N.M · title" sub-header; scripts/validate.py only reads the
      file:"..." entries in order, so the nesting does not affect the NAV
      check.
    Cover eyebrow: "Unit N · Module N.M · Chapter NN" (the dot separator is
      the middle dot character used across the product).
    Practice exams: one per unit plus a full mock; the unit is the
      checkpoint. Question comment headers cite chapter and skill numbers.

## File naming

    Lessons: lesson-NN-name.html, numbered 01-76 per the curriculum index.
    Practice exams: mla-c02-practice-exam-NN.html (slug prefix, per the
      convention that only the first course keeps the bare
      practice-exam-NN.html; the sibling MLA-C01 course uses mla-c01-).
    All files live in aws-machine-learning-engineer-associate-mla-c02/.

## Terminology rules

Current official names only. Never use a deprecated name in prose, options,
or explanations.

    Platform: "Amazon SageMaker AI" for the ML platform (training, endpoints,
      Feature Store, Model Registry, Data Wrangler, Ground Truth). "Amazon
      SageMaker Unified Studio" only when the unified experience itself is
      the topic. Never "Amazon SageMaker" alone as the platform name.
    Foundation models: "Amazon Bedrock" for FM access, Knowledge Bases,
      Guardrails, Agents; "Amazon Bedrock AgentCore" for the agent runtime and
      observability surfaces named in the exam guide.
    Streaming: "Amazon Data Firehose", never "Kinesis Data Firehose"; "Amazon
      Managed Service for Apache Flink", never "Kinesis Data Analytics"
      (repo-wide DEA-C01 rule). Both renames are cosmetic: IAM actions, CLI
      commands, SDK clients, and CloudWatch namespaces keep the pre-rename
      identifiers (firehose:, kinesisanalytics:), so code samples use those.
    Kinesis: "Amazon Kinesis Data Streams" (the stream service keeps its name).
    Kafka: "Amazon MSK" (Amazon Managed Streaming for Apache Kafka).
    Search and vectors: "Amazon OpenSearch Service" (managed domains) and
      "Amazon OpenSearch Serverless" (collections). Never "Elasticsearch
      Service".
    Vector storage on S3: "Amazon S3 Vectors" (vector buckets, vector indexes).
    Glue: "AWS Glue" for ETL and the Data Catalog; "AWS Glue DataBrew" for the
      visual prep tool; "AWS Glue Data Quality" for rules.
    Training data access: "File mode", "Fast File mode", "Pipe mode" as the
      three S3 input modes; "Amazon FSx for Lustre" and "Amazon EFS" as the
      mounted file-system inputs.

## Recommended-vs-contrast stances

    Streaming input mode: Fast File mode is the recommended streaming input;
      Pipe mode is the legacy contrast (docs: "largely replaced by the newer
      and simpler-to-use fast file mode").
    Columnar formats: Parquet is the default lake format; ORC is the contrast
      when a Hive/EMR estate already standardizes on it or file size wins.
    Glue reads: DynamicFrames are the recommended read path (grouping, 1,000
      row JDBC fetch size, choice types); raw Spark DataFrames are the
      contrast when a Spark-only API is needed (outer joins, broadcast hints).
    Vector store for RAG on Bedrock: OpenSearch Serverless (NextGen vector
      collections) for high QPS and hybrid search; Amazon S3 Vectors for
      infrequent queries and lowest cost; Aurora PostgreSQL with pgvector when
      the data already lives in PostgreSQL and needs relational joins.
    Kafka vs Kinesis: teach Kinesis Data Streams as the AWS-native default;
      Amazon MSK when the producers or consumers already speak Kafka.

## Palette registry

The course home page keeps the shared gold home theme; gold stays reserved
for exams and course homes product-wide. Lesson accents are assigned per
chapter, semantically, and collision-checked against the AWS DEA course
(which shares many of the same services) at authoring time. Record the final
--accent hex here as each lesson ships.

    Unit 1  Data Preparation          blues, greens, and cyans (data at rest
                                      and in motion), with Glue orchid and a
                                      vector pink for the AI-specific chapters
    Unit 2  Model and FM Development  violet / indigo (computation, tuning)
    Unit 3  Deployment and Orch.      amber / orange (pipelines, delivery)
    Unit 4  Operate, Monitor, Secure  rose (alarms) and steel slate (security)

    Shipped accents:
      Ch01 data formats            #34d399 emerald (columnar files)
      Ch02 storage decisions       #60a5fa blue (S3 and storage tiers)
      Ch03 streaming               #22d3ee cyan (streams in motion; same
                                   streaming cyan the DEA course uses)
      Ch04 merging / Glue          #c084fc orchid (AWS Glue, matching DEA Ch7)
      Ch05 vector databases        #f472b6 pink (embedding space)

Trade-off lessons (TO in the index) rely on their own chapter accent; the TO
structure, not a distinct color, marks them.

## Source rules (reminder)

Every card and question traces to official AWS documentation
(docs.aws.amazon.com) plus the official MLA-C02 exam guide for scope. No
braindump content, no third-party question banks as material.
