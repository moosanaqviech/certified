cert-config-aws-mla-c02.md
Cert Config: AWS Certified Machine Learning Engineer Associate (MLA-C02)

Per-certification settings so the frozen engine rules stay generic. Pairs with
curriculum-index-aws-mla-c02.md (the chapter placement, LOCKED 12 Sep 2026
against the official exam guide at docs.aws.amazon.com).

## Identity

    Badge text: "AWS ML Engineer Associate (MLA-C02)"
    Course folder: aws-machine-learning-engineer-associate-mla-c02/
    Difficulty: Associate
    Standard blurb: Bite-sized, visual lessons for the updated MLA-C02 exam,
      which puts foundation models, RAG, and agents alongside traditional ML
      engineering. Built to teach the trade-off reasoning the test rewards,
      not facts to cram.
    Exam guide version: MLA-C02, in use from 29 Sep 2026 (VERIFIED against
      the guide and its "Comparison of MLA-C01 and MLA-C02" page at
      docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-02/,
      fetched 12 Sep 2026). Beta exam code ME1-C02, English only; the standard
      exam is expected in all four exam languages in early 2027.
    Domains and weights: 1 Data Preparation for ML and AI 28%; 2 ML Model and
      Foundation Model (FM) Development 24%; 3 Deployment and Orchestration of
      ML and AI Workflows 24%; 4 Operating, Monitoring, and Securing ML and AI
      Solutions 24%.
    Questions: 65 (50 scored, 15 unscored and unidentified). Multiple choice
      (one of four) and multiple response (two or more of five or more). The
      MLA-C02 guide no longer lists ordering or matching items.
    Time: 130 minutes
    Pace: 2 minutes per question (65 x 2 = 130, so a full mock lands exactly
      on the real limit)
    Pass threshold: scaled score 720 on a 100 to 1,000 scale, compensatory
      (overall score only, no per-domain minimum). Scaled scores do not map to
      a fixed percentage, so exams use pass: 72 as our practice target and
      label it as our approximation of the 720 cut score, never as official.
    Cost: USD 150 (standard exam; beta pricing per the AWS beta policy)
    Delivery: Pearson VUE test center or online proctored. Validity 3 years.
    Target candidate (from the guide): 1+ year with Amazon SageMaker AI,
      Amazon Bedrock, and other AWS services for ML engineering, plus 1+ year
      in a related role, with experience in both traditional ML and GenAI.
    Code language: Python throughout (SageMaker AI SDK for Python, Boto3).
      AWS CLI appears where the guide names it (Skill 3.2.5). SQL only for
      Athena, Redshift, or pgvector examples.

## File naming

    Lessons: lesson-NN-name.html, numbered 01-76 per the curriculum index,
      which also fixes each planned slug.
    Practice exams: mla-c02-practice-exam-NN.html (slug prefix, per the
      convention that only the first course keeps the bare
      practice-exam-NN.html). The mla-c01- prefix is reserved and unused.
    Plan: one exam per unit (01 to 04, one question per chapter in scope, in
      chapter order) plus a full-length mock (05: 65 questions, 130 minutes,
      spread by domain weight, 14/12/12/12 scored-equivalent).
    All files live in aws-machine-learning-engineer-associate-mla-c02/.

## Terminology rules

Current official names only, taken from the MLA-C02 guide's own wording.
Never use a deprecated name in prose, options, or explanations. IAM actions,
CLI commands, SDK calls, and CloudWatch namespaces keep their pre-rename
identifiers (sagemaker:, kinesisanalytics, firehose, and so on), so code
samples use the retained identifier while prose uses the current name.

    Platform: "Amazon SageMaker AI" on first mention, "SageMaker AI"
      afterwards. Feature names keep the bare SageMaker prefix as the guide
      writes them: SageMaker Feature Store, SageMaker Data Wrangler, SageMaker
      Ground Truth, SageMaker Model Registry, SageMaker Clarify, SageMaker
      Model Monitor, SageMaker Pipelines, SageMaker JumpStart, SageMaker AI
      automatic model tuning (AMT), SageMaker AI Inference Recommender,
      SageMaker Model Debugger, MLflow on SageMaker AI. Never "SageMaker
      Experiments" as the tracking recommendation (MLflow on SageMaker AI is
      the guide's example, Skill 2.3.1).
    Foundation models: "Amazon Bedrock" on first mention, "Bedrock"
      afterwards. Features as the guide names them: Amazon Bedrock Knowledge
      Bases, Amazon Bedrock Guardrails, Amazon Bedrock Prompt Management,
      Amazon Bedrock Custom Model Import, Amazon Bedrock Model Evaluation
      ("Bedrock evaluations" in running text), Amazon Bedrock API keys, Amazon
      Bedrock AgentCore Observability. Say "foundation model" then "FM".
    Agents: the guide says "agents" generically (deploying, state management,
      version management, coordination failures, communication protocols).
      Name the Bedrock agent surface exactly as the fetched doc page names it
      at authoring time (Amazon Bedrock Agents vs Amazon Bedrock AgentCore
      are different products); never guess which one a skill statement means.
    Observability: "Amazon CloudWatch generative AI observability" (Skill
      4.1.1), "AWS X-Ray", "CloudWatch Logs Insights", "CloudWatch dashboards".
    Streaming: "Amazon Kinesis Data Streams", "Amazon Data Firehose" (never
      "Kinesis Data Firehose"), "Amazon Managed Service for Apache Flink"
      (never "Kinesis Data Analytics"), "Amazon MSK". Same rule as DEA-C01.
    Vector stores: "Amazon OpenSearch Service", "Amazon RDS with pgvector"
      (Aurora PostgreSQL counts as the same family), and Amazon S3. Confirm
      the current S3 vector feature name against docs before naming it in a
      card; the guide only says "Amazon S3".
    Data tooling: "AWS Glue", "AWS Glue DataBrew", "AWS Glue Data Quality",
      "Amazon EMR", "Amazon Athena", "Amazon Quick Sight" (two words, the
      current spelling).
    AI services: "Amazon Textract", "Amazon Rekognition", "Amazon Comprehend",
      "Amazon Transcribe" (the four the guide lists in Skill 2.1.8).
    CI/CD: "AWS CodePipeline", "AWS CodeBuild", "AWS CodeDeploy", "AWS
      CodeConnections" (for GitHub, GitLab, Bitbucket sources). "AWS
      CodeCommit" is named in Skill 3.3.2 and remains examinable, but it is
      closed to new customers, so present CodeConnections plus an external
      repository as the path for new pipelines and CodeCommit as the existing
      repository case.
    Security: "AWS Identity and Access Management (IAM)" then "IAM", "AWS
      Key Management Service (AWS KMS)" then "KMS", "Amazon Inspector",
      "Amazon CodeGuru", "AWS CloudTrail", "AWS Config", "Amazon Macie" only
      if a fetched doc ties it to the skill at hand.
    Evaluation vocabulary: BLEU, ROUGE, BERTScore, semantic similarity,
      human-in-the-loop, "LLM-as-a-judge" (this spelling), retrieval accuracy.
    Never use MLA-C01-only content as recommended material: SageMaker Neo,
      bring your own container (BYOC), model size reduction (pruning,
      quantization, compression), Amazon EFS or FSx as training input modes,
      EventBridge as the infrastructure monitor, and the capacity
      troubleshooting statement were all removed for MLA-C02. They may appear
      as a contrast option in a question only when the fetched doc still
      documents the behaviour, never as the answer.

## Recommended-vs-contrast stances

Where AWS now recommends one approach, teach it as the recommendation and
present the older or weaker approach only as the contrast case.

    Knowledge vs behaviour: RAG for injecting current or proprietary
      knowledge; fine-tuning for changing style, format, or task behaviour;
      continued pre-training for domain vocabulary; distillation for a
      cheaper student model. Prompt engineering comes before any of them.
      Never present fine-tuning as the fix for stale facts.
    Retrieval: a managed Bedrock knowledge base (with a supported vector
      store, chunking strategy, and metadata filtering) is the recommendation;
      a hand-built embed-and-search loop is the contrast case. Measure
      retrieval accuracy before changing chunk size, overlap, or reranking.
    FM hosting: Bedrock on-demand for variable traffic, Bedrock provisioned
      throughput for steady high volume with latency guarantees, SageMaker AI
      hosting or Custom Model Import for models Bedrock does not serve.
    Credentials: IAM roles (temporary credentials) for production workloads;
      Bedrock API keys for short-lived experimentation or tooling that cannot
      assume a role. Long-lived keys in application code are always wrong.
    Safeguards: Bedrock Guardrails for content and PII policy across models;
      prompt-only "please do not" instructions are the contrast case.
    Experiment tracking: MLflow on SageMaker AI for runs, metrics, and model
      versions; Bedrock evaluations and Prompt Management for FM and prompt
      versions. Ad hoc spreadsheets or notebook variables are contrast only.
    Inference options: real-time for low latency and steady traffic,
      serverless for spiky or intermittent traffic without instance
      management, asynchronous for large payloads or long-running requests,
      batch transform for offline scoring. Pick from the traffic shape, never
      default to real-time.
    Scaling: SageMaker AI endpoint auto scaling on a target metric
      (InvocationsPerInstance, model latency, GPU utilization) is the
      recommendation; fixed oversized instance counts are the contrast case.
    Purchasing: SageMaker AI Savings Plans and Spot training for steady or
      interruptible workloads; On-Demand for unpredictable or short jobs.
    Storage layout: Parquet or ORC for analytical access patterns, JSON or CSV
      only when the consumer requires it, formats chosen from the access
      pattern rather than from habit.
    Bias: detect with SageMaker Clarify before training (CI, DPL) and during
      monitoring (bias drift); resampling, augmentation, and reweighting are
      the mitigation set; deleting the sensitive column is the contrast case.

## Palette registry (provisional)

The course home page (aws-machine-learning-engineer-associate-mla-c02/index.html)
keeps the shared gold home theme with the AWS orange (#ff9900) that the DEA-C01
home also uses; gold stays reserved for exams and course homes product-wide.

The accents below are per-UNIT lesson palettes, assigned semantically and
separated by at least 60 degrees of hue from each other so no two units in this
course read alike. Five courses already ship, so every hue has a near neighbour
somewhere: each accent below is a hex that appears in NO existing lesson, with
its nearest neighbour noted. That is acceptable because a learner never sees two
courses' lessons side by side. Before writing a unit's first lesson,
collision-check its accent against the neighbouring chapters in THIS course and
adjust if it clashes. Record the final --accent hex in each lesson as it ships.

    Unit 1  Data Preparation for ML and AI       #4cd38a  leaf green
            Raw material being gathered, cleaned, chunked, and embedded.
            Nearest neighbours: GenAI #4ade80, AWS DEA #34d399.
    Unit 2  ML Model and FM Development          #a68cff  electric violet
            Computation, tuning, and evaluation. Nearest neighbours: ML
            Associate #a78bfa, GenAI #c9a0ff.
    Unit 3  Deployment and Orchestration         #3fb6ff  sky blue
            Shipping, endpoints, pipelines, and agents in motion. Nearest
            neighbours: ML Associate #38a8f0, AWS DEA #38bdf8.
    Unit 4  Operating, Monitoring, and Securing  #ff6b6b  alarm coral
            Alarms, drift, cost, guardrails, and locks. Nearest neighbours:
            AWS DEA #f87171 (Professional) and #ef4444. Distinct from the AWS
            orange (#ff9900) and from the reserved exam gold.

Full five-variable palette blocks, ready to paste into a lesson's :root:

    Unit 1  --bg: #06100a;  --bg-tint: #0f2d1b;  --accent: #4cd38a;
            --accent-glow: rgba(76,211,138,0.12);   --accent-ink: #04170c;
    Unit 2  --bg: #0b0914;  --bg-tint: #221a3d;  --accent: #a68cff;
            --accent-glow: rgba(166,140,255,0.12);  --accent-ink: #120a26;
    Unit 3  --bg: #050e16;  --bg-tint: #0b2740;  --accent: #3fb6ff;
            --accent-glow: rgba(63,182,255,0.12);   --accent-ink: #03131f;
    Unit 4  --bg: #130707;  --bg-tint: #3a1414;  --accent: #ff6b6b;
            --accent-glow: rgba(255,107,107,0.12);  --accent-ink: #200606;

Trade-off lessons rely on the same unit accent as their siblings; the (TO)
structure, not a distinct color, marks them.

## Exam engine note

The real exam mixes multiple-choice and multiple-response items, and the exam
engine supports both: give `correct` an array of indexes to switch one question
to multi-select (4 to 6 options, at least 2 correct, never all). Keep
multi-response questions to roughly a quarter of an exam at most, use them only
where the concept genuinely needs two answers, and set `E.blurb` to "Most
questions have one best answer; a few ask you to select two." on any exam that
contains one. Ordering and matching items are not in the MLA-C02 guide and the
engine does not support them, so never emulate them.

## Source rules

Every card and question traces to the official MLA-C02 exam guide (scope) plus
official AWS documentation at docs.aws.amazon.com and aws.amazon.com (behaviour,
defaults, limits, current names). No braindump content, no third-party question
banks as material. The exam guide domain pages and comparison page were
reachable from the remote session on 12 Sep 2026, so per-chapter documentation
research can be done from this environment; fetch the 1 to 3 doc pages a chapter
covers before writing it and note their URLs in the commit message. Do not
substitute recalled knowledge for a fetched page on any versioned claim: the
Bedrock agent surface, S3 vector storage, CloudWatch generative AI
observability, and AgentCore are all recent enough that training data cannot be
trusted on their names or defaults.
