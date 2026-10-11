# Cert Config: AWS Certified AI Practitioner (AIF-C01)

Per-certification settings so the frozen engine rules stay generic. Pairs with
curriculum-index-aws-aif-c01.md (chapter placement; DRAFT until the user locks
it, transcribed from the official exam guide PDF, version 1.1, dated April 30,
2026, downloaded from docs.aws.amazon.com on 27 Sep 2026).

## Identity

    Badge text: "AWS AI Practitioner (AIF-C01)"
    Course folder: aws-ai-practitioner/
    Difficulty: Foundational (the first Foundational-tier course on the site;
      the catalog and course home need a "Foundational" difficulty badge
      alongside the existing Associate and Professional ones)
    Standard blurb: Bite-sized, visual lessons for the AWS Certified AI
      Practitioner (AIF-C01) exam, built to teach the recognition and
      selection reasoning the test rewards across AI and ML basics,
      generative AI, foundation models, responsible AI, and security.
    Exam guide version: AIF-C01 version 1.1, published April 30, 2026
      (version 1.0 was March 26, 2026; 1.1 revised 18 objectives and added 7).
      Source: https://docs.aws.amazon.com/pdfs/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.pdf
    Questions: 65 presented (50 scored + 15 unscored, unidentified). Four
      types: multiple choice (1 of 4), multiple response (2+ of 5+), ordering
      (3 to 5 items), matching (3 to 7 prompts). No "case study" type in
      version 1.1.
    Time: 90 minutes (from the AWS cert page, as already published in
      blog/aif-c01-exam-cost-format-question-types.html; the PDF does not
      state it).
    Pace: 2 minutes per question in section exams. Full mocks are 50
      questions in 90 minutes (108 seconds each; the real exam averages 83
      seconds because it also presents 15 unscored items).
    Pass threshold: 700 on a 100 to 1,000 scaled score (published by AWS).
      Compensatory scoring: no per-domain minimum. Use 70% as the practice
      target and label it as our guidance, since the scaled score is not a
      percentage.
    Cost: USD 100 (foundational tier, from the AWS cert page via the blog).
    Domains: 1 Fundamentals of AI and ML 20%, 2 Fundamentals of GenAI 24%,
      3 Applications of Foundation Models 28%, 4 Guidelines for Responsible
      AI 14%, 5 Security, Compliance, and Governance for AI Solutions 14%.
    Target candidate: uses, does not build, AI/ML on AWS; up to 6 months of
      exposure. Coding, feature engineering, tuning, pipeline building, and
      implementing security or governance are OUT of scope for the
      candidate, so lessons stay at the concept and selection level.
    Code language: none by default. An illustrative prompt, a JSON snippet of
      inference parameters, or a single API or service name is the most code
      a card should carry.

## Course structure and eyebrows

    Two levels: Unit (exam domain) > Chapter, matching the DEA-C01 course.
    Cover eyebrow: "Unit N · Chapter NN" (middle dot separator).
    Practice exams: one per unit for Units 1 to 3, one combined exam for
      Units 4 and 5, then three sealed full mocks. Question comment headers
      cite the chapter and the objective number.

## File naming

    Lessons: lesson-NN-name.html, numbered 01-58 per the curriculum index.
    Practice exams: aif-practice-exam-NN.html (slug prefix, per the
      convention that only the first course keeps the bare
      practice-exam-NN.html; DEA-C01 uses aws-, MLA-C02 uses mla-c02-).
      Exams 01 to 04 are section exams; 05 to 07 are the sealed full mocks.
    Practice hub: practice/aws-aif-c01.html (served at /practice/aws-aif-c01).
    Readiness quiz: ready/aws-aif-c01.html (served at /ready/aws-aif-c01).
    All lessons and exams live in aws-ai-practitioner/.

## Terminology rules

Current official names only, taken from the version 1.1 exam guide's own
wording. Never use a deprecated name in prose, options, or explanations.
Names marked (verify) are new enough that the current docs page should be
fetched before the chapter that teaches them is written.

    ML platform: "Amazon SageMaker AI" for training, endpoints, Model Cards,
      Clarify, and Ground Truth. Never "Amazon SageMaker" alone as the
      platform name. "Amazon SageMaker JumpStart" for the model hub.
    Foundation models: "Amazon Bedrock" for FM access; "Amazon Bedrock
      Knowledge Bases" (RAG), "Amazon Bedrock Guardrails", "Amazon Bedrock
      Prompt Management", "Amazon Bedrock Model Evaluation", all as the guide
      writes them. "Amazon Nova" for the Amazon-built model family.
    Agents: "Amazon Bedrock AgentCore" for the agent runtime and its
      "AgentCore Identity" and "Policy in AgentCore" controls (verify);
      "Strands Agents" for the open-source agent SDK (verify); "Model Context
      Protocol (MCP)" on first mention, "MCP" after. The classic "Amazon
      Bedrock Agents" feature is no longer named in the guide (version 1.0
      named it; 1.1 replaced it with AgentCore); mention it only when the
      distinction itself is the point.
    Assistants and tooling: "Kiro" for the agentic IDE (verify); "Amazon Q"
      as the guide writes it (verify which Amazon Q surfaces the current docs
      still list under that name before Ch 27); "Amazon Quick" as the guide
      writes it (verify: this is the guide's name for the QuickSight-derived
      suite, so never write "Amazon QuickSight" unless the docs page for the
      feature still uses it); "AWS Transform" (verify).
    Managed AI services: "Amazon Transcribe", "Amazon Translate", "Amazon
      Comprehend", "Amazon Lex", "Amazon Polly", "Amazon Rekognition",
      "Amazon Textract", "Amazon Personalize".
    Vector stores: "Amazon OpenSearch Service", "Amazon Aurora" (PostgreSQL
      with pgvector), "Amazon RDS for PostgreSQL", "Amazon Neptune". Never
      "Elasticsearch Service". Amazon MemoryDB was REMOVED from the in-scope
      list in version 1.1; do not present it as an exam-relevant vector store.
    Governance and security: "AWS Config", "Amazon Inspector", "AWS
      Artifact", "AWS CloudTrail", "AWS Trusted Advisor", "Amazon Macie",
      "AWS PrivateLink", "AWS Key Management Service (AWS KMS)", "AWS Secrets
      Manager", "AWS Identity and Access Management (IAM)".
    Framework: "Generative AI Security Scoping Matrix" as the guide names it.
    Metrics: spell out "Recall-Oriented Understudy for Gisting Evaluation
      (ROUGE)" and "Bilingual Evaluation Understudy (BLEU)" on first mention,
      as the guide does; "BERTScore"; "LLM-as-a-judge".
    Learning types: "reinforcement learning from human feedback (RLHF)" on
      first mention.
    Repo-wide AWS rules apply if streaming comes up: "Amazon Data Firehose",
      never "Kinesis Data Firehose"; "Amazon Managed Service for Apache
      Flink", never "Kinesis Data Analytics". Neither is in scope for this
      exam, so this should be rare.

## Recommended-vs-contrast stances

    Customization: in-context learning and RAG are the first resort; fine
      tuning is the contrast when the task needs new behaviour rather than
      new knowledge; pre-training is the extreme case almost no candidate's
      organisation will do (Ch 33).
    Grounding: RAG grounding plus output validation is the recommended
      hallucination defence; "just prompt it not to hallucinate" is the
      contrast case (Ch 55).
    Model access: Amazon Bedrock (managed API) is the default for FM use;
      SageMaker JumpStart self-hosting is the contrast when the model, the
      customisation, or the hosting control is not available through Bedrock
      (Ch 26).
    Pricing: on-demand token pricing is the default; provisioned throughput
      is the contrast for steady high volume or guaranteed capacity (Ch 28).
    Traditional ML vs FM: a traditional model is the recommendation when the
      task is a structured prediction with explainability or regulatory
      demands; an FM when the input is unstructured language or the task is
      generative (Ch 10).
    Safety controls: Amazon Bedrock Guardrails as the managed control is the
      recommendation over hand-rolled output filtering (Ch 45).

## Palette registry

The course home page keeps the shared gold home theme; gold stays reserved
for exams and course homes product-wide. Lesson accents are assigned per
chapter, semantically, and collision-checked at authoring time against the
AWS DEA-C01 and MLA-C02 courses (same vendor, overlapping services) and the
Databricks GenAI course (overlapping concepts). Record the final --accent hex
here as each lesson ships.

    Unit 1  Fundamentals of AI and ML    sky and cyan (clear basics)
    Unit 2  Fundamentals of GenAI        magenta and fuchsia (generation);
                                         avoid the lavender the Databricks
                                         GenAI course leans on
    Unit 3  Applications of FMs          indigo and violet (composition,
                                         prompting, tuning)
    Unit 4  Responsible AI               greens (fairness, balance)
    Unit 5  Security and Governance      steel slate (security) and rose
                                         (threats and alarms), matching the
                                         MLA-C02 convention

    Shipped accents: none yet.

Trade-off lessons (TO in the index) rely on their own chapter accent; the TO
structure, not a distinct color, marks them.

## Source rules (reminder)

Every card and question traces to official AWS documentation
(docs.aws.amazon.com, aws.amazon.com product pages) plus the official
AIF-C01 version 1.1 exam guide for scope. No braindump content, no third-party
question banks as material. This exam is foundational, so the temptation to
write from memory is highest here: names like Amazon Quick, Kiro, Strands
Agents and AgentCore are newer than most training data, so fetch their docs
before writing any card that describes them.

## Site wiring still to do (outside this file's scope)

    catalog.json entry and a root index.html card (with a Foundational badge).
    A pricing.html row.
    blog/aif-c01-exam-cost-format-question-types.html: drop "case study" from
      the question-type list to match guide version 1.1.
    The six published AIF-C01 blog posts should link to the course home once
      it exists.
