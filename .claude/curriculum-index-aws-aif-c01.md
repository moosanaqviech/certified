Curriculum Index: AWS Certified AI Practitioner (AIF-C01)

Status: DRAFT, awaiting the user's confirmation to LOCK. Built on 27 Sep 2026 by
downloading the official exam guide PDF from docs.aws.amazon.com
(docs.aws.amazon.com/pdfs/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.pdf)
and extracting its text; every objective below is transcribed from that PDF, not
from third-party outlines. Once locked, this file is the authoritative source for
unit and chapter placement: a later request that conflicts with it gets flagged
with a proposed one-line fix rather than silently absorbed.

Exam guide version: AIF-C01 exam guide VERSION 1.1, published April 30, 2026
(version 1.0 was published March 26, 2026). Version 1.1 revised 18 objectives and
ADDED 7 (1.2.6, 2.1.4, 2.1.5, 2.1.6, 3.2.5, 3.4.5, 5.1.5), which is why this
index carries agentic AI, MCP, context engineering, token pricing, Prompt
Management, model distillation, and hallucination grounding as first-class
chapters. Any older AIF-C01 outline (including third-party study guides written
for version 1.0) is missing these. Re-verify against the PDF if AWS publishes a
newer version; the guide says updates are published about one month before they
reach the exam.

Source of truth: the official exam guide PDF above, linked from
https://aws.amazon.com/certification/certified-ai-practitioner/ (the HTML cert
page and d1.awsstatic.com were blocked (403) from this environment; the
docs.aws.amazon.com PDF was not).

Exam facts (from the PDF unless noted):
    65 questions presented: 50 scored plus 15 unscored, unidentified.
    Question types: multiple choice (1 of 4), multiple response (2 or more of 5
      or more), ordering (3 to 5 items), matching (3 to 7 prompts). Unanswered
      questions score as wrong; no penalty for guessing.
      NOTE: version 1.1 lists exactly these FOUR types. It does not list
      "case study". blog/aif-c01-exam-cost-format-question-types.html currently
      says five types including case study; that post needs a one-line fix.
    Scaled score 100 to 1,000; minimum passing score 700. Compensatory scoring:
      no per-domain minimum.
    Time limit: 90 minutes. Cost: USD 100. (Both from the AWS cert page as
      already published in the two blog posts above; the PDF states neither.)
    Target candidate: up to 6 months of exposure to AI/ML on AWS; USES but does
      not necessarily BUILD AI/ML solutions. Out of scope for the candidate:
      coding models, feature engineering, hyperparameter tuning, building
      pipelines, statistical analysis, implementing security protocols, and
      writing governance frameworks. Lessons therefore teach recognition and
      selection, never implementation: no code blocks beyond an illustrative
      prompt or a one-line API name.

Domain weights (official, from the PDF):

    Domain 1  Fundamentals of AI and ML                        20%   17 objectives
    Domain 2  Fundamentals of GenAI                            24%   14 objectives
    Domain 3  Applications of Foundation Models                28%   19 objectives
    Domain 4  Guidelines for Responsible AI                    14%   11 objectives
    Domain 5  Security, Compliance, and Governance for AI      14%    8 objectives
                                                                     69 objectives

69 objectives map onto 50 scored questions, so the real exam SAMPLES objectives
rather than covering each one. Practice exams therefore map to objectives and
sample them (see the practice exam plan), the same model the GenAI Engineer
Associate course uses.

Structure: 5 units mirroring the 5 official domains, continuous chapter
numbering 01 to 58. The chapter count per unit tracks the domain weight
(14/14/15/8/7 chapters against 20/24/28/14/14 percent). Most chapters cover one
objective; merges are noted inline where two objectives are the same concept,
and objective 1.1.1 and 2.1.1 are split because each bundles two chapters'
worth of vocabulary. Trade-off lessons are flagged (TO). Every objective is
mapped; there are no (OFF) chapters.

===============================================================================
Unit 1: Fundamentals of AI and ML (20%, 17 objectives)
===============================================================================

Task statements: 1.1 Explain basic AI concepts and terminologies. 1.2 Identify
practical use cases for AI. 1.3 Describe the AI/ML development lifecycle.

Official objectives, mapped to chapters:

    1.1.1  Define basic AI terms (AI, ML, deep learning, neural networks,
           computer vision, NLP, model, algorithm, training and inferencing,
           bias, fairness, fit, LLM, GenAI, agentic AI) ............ Ch 01, 02
    1.1.2  Describe the similarities and differences between AI, ML, GenAI,
           deep learning, and agentic AI ............................. Ch 01
    1.1.3  Describe various types of inferencing (batch, real-time,
           asynchronous, serverless) ................................. Ch 03
    1.1.4  Describe the different types of data in AI models (labeled and
           unlabeled, tabular, time-series, image, text, structured and
           unstructured) ............................................. Ch 04
    1.1.5  Describe different types of AI/ML learning (supervised,
           unsupervised, reinforcement learning methods) ............. Ch 05
    1.2.1  Recognize applications where AI/ML can provide value (assist
           human decision making, solution scalability, automation) .. Ch 06
    1.2.2  Determine when AI/ML solutions are not appropriate (cost-benefit
           analyses, when a specific outcome is needed instead of a
           prediction) ............................................... Ch 06
    1.2.3  Select the appropriate AI/ML techniques for specific use cases
           (regression, classification, clustering) .................. Ch 07
    1.2.4  Identify examples of real-world AI applications (computer
           vision, NLP, speech recognition, recommendation systems, fraud
           detection, forecasting, knowledge bases, agentic AI) ...... Ch 08
    1.2.5  Explain the capabilities of AWS managed AI/ML services
           (SageMaker AI, Transcribe, Translate, Comprehend, Lex, Polly)  Ch 09
    1.2.6  Identify when traditional ML models or FMs are appropriate for
           a specific use case (regulatory concerns, explainability
           requirements, operational constraints) .................... Ch 10
    1.3.1  Describe and differentiate components of an AI/ML pipeline ... Ch 11
    1.3.2  Describe sources of FM models (open source pre-trained models,
           training custom models) ................................... Ch 12
    1.3.3  Describe methods to use a model in production (managed API
           service, self-hosted API) ................................. Ch 12
    1.3.4  Identify relevant AWS services and features for each stage of
           an AI/ML pipeline (Amazon Bedrock, Amazon Quick, Kiro,
           SageMaker AI) ............................................. Ch 11
    1.3.5  Describe fundamental concepts of MLOps (experimentation,
           repeatable processes, scalable systems, managing technical
           debt, production readiness, model monitoring, re-training)  Ch 13
    1.3.6  Describe model performance metrics (accuracy, precision, recall,
           F1) and business metrics (cost per user, development costs,
           customer feedback, ROI) to evaluate ML models ............. Ch 14

Chapters:

    01  AI, ML, deep learning, GenAI, and agentic AI: how the circles nest
        The orientation chapter. Neural networks, computer vision and NLP
        land here as the deep-learning examples. (1.1.1 part, 1.1.2)
    02  Models, algorithms, training, and inference: the working vocabulary
        Model vs algorithm, training vs inferencing, fit (under and over),
        bias and fairness as terms; Ch 47 returns to bias in depth. (1.1.1)
    03  Inference types: batch, real-time, asynchronous, serverless (TO)
        Four options; the signal is latency need, payload size, and traffic
        shape. (1.1.3)
    04  Data types in AI models: labeled and unlabeled, structured and
        unstructured, tabular, time-series, image, text (1.1.4)
    05  Supervised, unsupervised, and reinforcement learning (1.1.5)
    06  When AI/ML adds value, and when it is the wrong tool (TO)
        Two-direction trade-off: assist, scale, automate vs cost-benefit
        fails or a deterministic outcome is required. (1.2.1, 1.2.2)
    07  Regression, classification, or clustering: matching the technique
        to the question being asked (TO) (1.2.3)
    08  Real-world AI applications: computer vision, NLP, speech,
        recommendations, fraud, forecasting, knowledge bases, agents (1.2.4)
    09  AWS managed AI services: Transcribe, Translate, Comprehend, Lex,
        Polly, Rekognition, Textract, Personalize, and where SageMaker AI
        begins
        The pre-trained API tier vs the build-your-own tier. Rekognition,
        Textract and Personalize are in the in-scope list even though the
        objective's example list omits them. (1.2.5)
    10  Traditional ML vs foundation models: regulatory, explainability, and
        operational signals (TO)
        New in guide version 1.1. Cross-links Ch 48 (explainability). (1.2.6)
    11  The AI/ML pipeline, and the AWS service at each stage
        Collection, EDA, pre-processing, feature engineering, training,
        tuning, evaluation, deployment, monitoring; then SageMaker AI,
        Amazon Bedrock, Amazon Quick, and Kiro placed on it. (1.3.1, 1.3.4)
    12  Where models come from and how they reach production: pre-trained
        open source vs custom training, managed API vs self-hosted (TO)
        Two paired trade-offs in one chapter because the second follows
        from the first. (1.3.2, 1.3.3)
    13  MLOps fundamentals: experimentation, repeatability, technical debt,
        production readiness, monitoring, and re-training (1.3.5)
    14  Model metrics vs business metrics: accuracy, precision, recall, F1
        against cost per user, development cost, feedback, and ROI
        FM-specific metrics (ROUGE, BLEU) wait for Ch 41. (1.3.6)

===============================================================================
Unit 2: Fundamentals of GenAI (24%, 14 objectives)
===============================================================================

Task statements: 2.1 Explain the basic concepts of generative AI. 2.2 Understand
the capabilities and limitations of GenAI for solving business problems. 2.3
Describe AWS infrastructure and technologies for building GenAI applications.

Official objectives, mapped to chapters:

    2.1.1  Define foundational GenAI concepts (tokens, chunking, embeddings,
           vectors, prompt engineering, transformer-based LLMs, FMs,
           multi-modal models, diffusion models) ..................... Ch 15, 16
    2.1.2  Identify potential use cases for GenAI models (image, video, and
           audio generation; summarization; AI assistants; translation;
           code generation; customer service agents; search;
           recommendation engines) ................................... Ch 17
    2.1.3  Describe the FM lifecycle (data selection, model selection,
           pre-training, fine-tuning, evaluation, deployment, feedback)  Ch 19
    2.1.4  Describe the token-based pricing model and its effect on cost
           and performance for inference ............................. Ch 20
    2.1.5  Describe the role of context engineering in FM applications .. Ch 21
    2.1.6  Define foundational agentic AI concepts (multi-agent system
           patterns, MCP and its role in connecting agents to external
           systems, multi-agent communication patterns, memory
           management, tool usage, workflow orchestration) ........... Ch 22, 23
    2.2.1  Describe the advantages of GenAI (adaptability, responsiveness,
           conversational capabilities, ability to generate content) .. Ch 18
    2.2.2  Identify disadvantages of GenAI solutions (hallucinations,
           interpretability, inaccuracy, nondeterminism) .............. Ch 18
    2.2.3  Identify factors to consider when selecting GenAI models
           (model types, performance requirements, capabilities,
           constraints, compliance, cost, latency, model complexity) .. Ch 29
    2.2.4  Determine business value and metrics for GenAI applications
           (cross-domain performance, ROI, efficiency, conversion rate,
           average revenue per user, accuracy, customer lifetime value)  Ch 24
    2.3.1  Identify AWS services and features to develop GenAI
           applications (Amazon Bedrock, SageMaker AI, SageMaker
           JumpStart, Amazon Quick, Kiro, Strands Agents, Amazon Bedrock
           AgentCore) ................................................ Ch 25, 26, 27
    2.3.2  Describe the advantages of using AWS GenAI services
           (accessibility, lower barrier to entry, efficiency,
           cost-effectiveness, speed to market, meeting objectives) ... Ch 25
    2.3.3  Describe the benefits of AWS infrastructure for GenAI
           applications (security, compliance, responsibility, safety)  Ch 25
    2.3.4  Describe cost tradeoffs of AWS GenAI services (responsiveness,
           availability, redundancy, performance, regional coverage,
           token-based pricing, provisioned throughput, custom models)  Ch 28

Chapters:

    15  Tokens, chunking, embeddings, and vectors: how text becomes numbers
        (2.1.1 part)
    16  Foundation models: transformer LLMs, multi-modal models, and
        diffusion models
        Prompt engineering is named here and taught in Ch 34 to 36. (2.1.1)
    17  GenAI use cases: generation, summarization, assistants, translation,
        code, customer service agents, search, recommendations (2.1.2)
    18  What GenAI is good at and where it fails: adaptability and content
        generation vs hallucination, nondeterminism, and opacity
        Balanced chapter, not a trade-off lesson. (2.2.1, 2.2.2)
    19  The FM lifecycle: data selection, model selection, pre-training,
        fine-tuning, evaluation, deployment, feedback
        The lifecycle overview; Ch 38 goes inside the training stages. (2.1.3)
    20  Token-based pricing: how input and output tokens drive cost and
        performance
        New in version 1.1. Cross-links Ch 28 (provisioned throughput). (2.1.4)
    21  Context engineering: what goes into the window and why it matters
        New in version 1.1. (2.1.5)
    22  Anatomy of an AI agent: tool use, memory, workflow orchestration,
        and the business roles agents fill
        Absorbs objective 3.1.6 (the role of AI agents and their business
        applications) since it is the same concept at the same depth. (2.1.6
        part, 3.1.6)
    23  Connecting and coordinating agents: Model Context Protocol and
        multi-agent patterns
        New in version 1.1. (2.1.6 part)
    24  Business value and metrics for GenAI: ROI, efficiency, conversion
        rate, ARPU, customer lifetime value (2.2.4)
    25  The AWS GenAI stack, and why build on it: Bedrock, SageMaker AI,
        JumpStart, Amazon Quick, Kiro, Strands Agents, AgentCore on one map,
        plus the accessibility, speed-to-market, security, and compliance
        arguments (2.3.1, 2.3.2, 2.3.3)
    26  Amazon Bedrock vs Amazon SageMaker JumpStart: managed FM access vs
        deploy-it-yourself (TO) (2.3.1)
    27  Agent and assistant tooling on AWS: Amazon Bedrock AgentCore, Strands
        Agents, Kiro, Amazon Q, and Amazon Quick (2.3.1)
    28  Cost trade-offs of AWS GenAI services: on-demand vs provisioned
        throughput, regional coverage, redundancy, and custom models (TO)
        (2.3.4)

===============================================================================
Unit 3: Applications of Foundation Models (28%, 19 objectives)
===============================================================================

Task statements: 3.1 Describe design considerations for applications that use
FMs. 3.2 Choose effective prompt engineering techniques. 3.3 Describe the
training and fine-tuning process for FMs. 3.4 Describe methods to evaluate FM
performance.

Official objectives, mapped to chapters:

    3.1.1  Identify selection criteria to choose FMs (cost, modality,
           latency, multi-lingual, model size, model complexity,
           customization, input/output length, prompt caching) ....... Ch 29
    3.1.2  Describe the effect of inference parameters on model responses
           (temperature, input/output length) ........................ Ch 30
    3.1.3  Define RAG and describe its business applications (Amazon
           Bedrock Knowledge Bases) .................................. Ch 31
    3.1.4  Identify AWS services that help store embeddings within vector
           databases (OpenSearch Service, Aurora, Neptune, RDS for
           PostgreSQL) ............................................... Ch 32
    3.1.5  Explain the cost tradeoffs of various approaches to FM
           customization (pre-training, fine-tuning, in-context
           learning, RAG, model distillation) ........................ Ch 33
    3.1.6  Define the role of AI agents and describe AI agents' business
           applications .............................................. Ch 22
    3.2.1  Define the concepts and constructs of prompt engineering
           (context, instruction, negative prompts) .................. Ch 34
    3.2.2  Define techniques for prompt engineering (chain-of-thought,
           zero-shot, single-shot, few-shot, prompt templates) ....... Ch 35
    3.2.3  Identify and describe the benefits and best practices for
           prompt engineering (response quality, experimentation,
           guardrails, discovery, specificity and concision, using
           multiple comments) ........................................ Ch 34
    3.2.4  Define potential risks and limitations of prompt engineering
           (exposure, poisoning, hijacking, jailbreaking) ............ Ch 36
    3.2.5  Describe prompt versioning and management strategies that use
           Amazon Bedrock Prompt Management .......................... Ch 37
    3.3.1  Describe the key elements of training an FM (pre-training,
           fine-tuning, continuous pre-training, distillation) ....... Ch 38
    3.3.2  Define methods for fine-tuning an FM (instruction tuning,
           adapting models for specific domains, transfer learning,
           continuous pre-training) .................................. Ch 38
    3.3.3  Describe how to prepare data to fine-tune an FM (data curation,
           governance, size, labeling, representativeness, RLHF) ..... Ch 39
    3.4.1  Determine approaches to evaluate FM performance
           (human-in-the-loop evaluation, benchmark datasets, Amazon
           Bedrock Model Evaluation) ................................. Ch 40
    3.4.2  Identify relevant metrics to assess FM performance (ROUGE,
           BLEU, BERTScore, LLM-as-a-judge) .......................... Ch 41
    3.4.3  Determine whether an FM effectively meets business objectives
           (productivity, user engagement, task engineering) ......... Ch 43
    3.4.4  Identify approaches to evaluate the performance of applications
           built with FMs (RAG, agents, workflows) ................... Ch 42
    3.4.5  Identify business objective alignment metrics for AI
           applications (task completion rate, user satisfaction, cost
           per interaction) .......................................... Ch 43

Chapters:

    29  Choosing a foundation model: cost, modality, latency, languages,
        size and complexity, customization, context length, prompt caching,
        compliance (TO)
        One chapter for objectives 2.2.3 and 3.1.1, which list the same
        factors from the business and the design side. (2.2.3, 3.1.1)
    30  Inference parameters: temperature, top-p, top-k, output length, and
        stop sequences (3.1.2)
    31  Retrieval Augmented Generation and Amazon Bedrock Knowledge Bases
        Cross-links Ch 55 (RAG as grounding against hallucination). (3.1.3)
    32  Vector stores on AWS: OpenSearch Service, Aurora and RDS for
        PostgreSQL with pgvector, Neptune (TO) (3.1.4)
    33  The customization cost ladder: in-context learning, RAG,
        fine-tuning, distillation, pre-training (TO)
        Model distillation is new in version 1.1. (3.1.5)
    34  Prompt anatomy and best practices: context, instruction, negative
        prompts, specificity, concision, experimentation, guardrails
        Two objectives, one concept: what a prompt is made of and how to
        write a good one. (3.2.1, 3.2.3)
    35  Prompting techniques: zero-shot, single-shot, few-shot,
        chain-of-thought, and prompt templates (3.2.2)
    36  Prompt risks: exposure, poisoning, hijacking, and jailbreaking
        Cross-links Ch 54 (prompt injection as a security threat). (3.2.4)
    37  Prompt versioning and management with Amazon Bedrock Prompt
        Management
        New in version 1.1. (3.2.5)
    38  How FMs are trained and adapted: pre-training, continuous
        pre-training, instruction tuning, domain adaptation, transfer
        learning, distillation
        Objectives 3.3.1 and 3.3.2 overlap heavily (continuous pre-training
        appears in both), so one chapter carries both; split if the card
        count exceeds 12. (3.3.1, 3.3.2)
    39  Preparing data for fine-tuning: curation, governance, size,
        labeling, representativeness, and RLHF (3.3.3)
    40  Evaluating a foundation model: human-in-the-loop, benchmark
        datasets, and Amazon Bedrock Model Evaluation (3.4.1)
    41  FM metrics: ROUGE, BLEU, BERTScore, and LLM-as-a-judge
        LLM-as-a-judge is new in version 1.1. (3.4.2)
    42  Evaluating FM applications, not just models: RAG, agents, and
        workflows (3.4.4)
    43  Does it meet the business objective: productivity, engagement, task
        completion rate, user satisfaction, cost per interaction
        3.4.5 is new in version 1.1. (3.4.3, 3.4.5)

===============================================================================
Unit 4: Guidelines for Responsible AI (14%, 11 objectives)
===============================================================================

Task statements: 4.1 Explain the development of AI systems that are
responsible. 4.2 Recognize the importance of transparent and explainable models.

Official objectives, mapped to chapters:

    4.1.1  Identify features of responsible AI (bias, fairness, inclusivity,
           robustness, safety, veracity) ............................. Ch 44
    4.1.2  Explain how to use tools to identify features of responsible AI
           (Amazon Bedrock Guardrails) ............................... Ch 45
    4.1.3  Define responsible practices to select a model (environmental
           considerations, sustainability) ........................... Ch 44
    4.1.4  Identify legal risks of working with GenAI (IP infringement
           claims, biased model outputs, loss of customer trust, end user
           risk, hallucinations) ..................................... Ch 46
    4.1.5  Identify characteristics of datasets (inclusivity, diversity,
           curated data sources, balanced datasets) .................. Ch 47
    4.1.6  Describe effects of bias and variance (effects on demographic
           groups, inaccuracy, overfitting, underfitting) ............ Ch 48
    4.1.7  Describe tools to detect and monitor bias, trustworthiness, and
           truthfulness (analyzing label quality, human audits, subgroup
           analysis) ................................................. Ch 48
    4.2.1  Describe the differences between models that are transparent
           and explainable and models that are not ................... Ch 49
    4.2.2  Describe tools to identify transparent and explainable models
           (SageMaker Model Cards, Amazon Bedrock Model Evaluations, open
           source models, data, licensing) ........................... Ch 50
    4.2.3  Identify tradeoffs between model safety and transparency
           (measure interpretability and performance) ................ Ch 49
    4.2.4  Describe principles of human-centered design for explainable AI
           (user-feedback mechanisms, AI decision transparency) ...... Ch 51

Chapters:

    44  Features of responsible AI: bias, fairness, inclusivity, robustness,
        safety, veracity, and sustainable model choice
        4.1.3 (environmental cost of model choice) is one card here, not a
        chapter. (4.1.1, 4.1.3)
    45  Amazon Bedrock Guardrails: content filters, denied topics, word
        filters, sensitive information, and grounding checks
        Cross-links Ch 52 (Guardrails as a security control). (4.1.2)
    46  Legal risks of GenAI: intellectual property, biased outputs, loss of
        trust, end-user harm, hallucinations (4.1.4)
    47  What a good dataset looks like: inclusivity, diversity, curated
        sources, balance (4.1.5)
    48  Bias and variance: demographic effects, overfitting and
        underfitting, and how to detect and monitor bias
        Effects and detection are one story: label quality, human audits,
        subgroup analysis are the tools that reveal the effects. (4.1.6,
        4.1.7)
    49  Transparent and explainable vs opaque models, and the
        safety-transparency trade-off (TO) (4.2.1, 4.2.3)
    50  Tools for transparency: Amazon SageMaker Model Cards, Amazon Bedrock
        Model Evaluations, open-source models, data, and licensing
        The PDF's change log says version 1.1 added SageMaker Clarify to this
        objective, but the objective text in the body omits it. Teach Model
        Cards and Bedrock Model Evaluations as primary; mention Clarify as a
        supporting tool only. (4.2.2)
    51  Human-centered design for explainable AI: user feedback mechanisms
        and decision transparency (4.2.4)

===============================================================================
Unit 5: Security, Compliance, and Governance for AI Solutions (14%, 8 objectives)
===============================================================================

Task statements: 5.1 Explain methods to secure AI systems. 5.2 Recognize
governance and compliance regulations for AI systems.

Official objectives, mapped to chapters:

    5.1.1  Identify AWS services and features to secure AI systems (IAM
           roles, policies, and permissions; encryption; Amazon Macie; AWS
           PrivateLink; shared responsibility model; Amazon Bedrock
           AgentCore Identity; Policy in AgentCore; Amazon Bedrock
           Guardrails) ............................................... Ch 52
    5.1.2  Describe the concept of source citation and documenting data
           origins (data lineage, data cataloging, SageMaker Model Cards)  Ch 53
    5.1.3  Describe best practices for secure data engineering (assessing
           data quality, privacy-enhancing technologies, data access
           control, data integrity) .................................. Ch 53
    5.1.4  Describe security and privacy considerations for AI systems
           (application security, threat detection, vulnerability
           management, infrastructure protection, prompt injection,
           encryption at rest and in transit, data leakage prevention,
           output filtering and validation, audit trail and logging
           requirements for AI interactions, toxicity) ............... Ch 54
    5.1.5  Describe hallucination detection methods and grounding
           techniques to improve output accuracy (RAG grounding, output
           validation, confidence scoring) ........................... Ch 55
    5.2.1  Identify AWS services and features to assist with governance
           and regulation compliance (AWS Config, Amazon Inspector, AWS
           Artifact, AWS CloudTrail, AWS Trusted Advisor) ............ Ch 56
    5.2.2  Describe data governance strategies (data lifecycles, logging,
           residency, monitoring, observation, retention) ............ Ch 57
    5.2.3  Describe processes to follow governance protocols (policies,
           review cadence, review strategies, governance frameworks such
           as the Generative AI Security Scoping Matrix, transparency
           standards, team training requirements) .................... Ch 58

Chapters:

    52  Securing AI systems on AWS: IAM, encryption, Amazon Macie, AWS
        PrivateLink, the shared responsibility model, Amazon Bedrock
        AgentCore Identity and Policy, and Guardrails
        AgentCore Identity and Policy are new in version 1.1. Survey chapter;
        if it exceeds 12 cards, split the agent controls into their own
        chapter. (5.1.1)
    53  Data provenance and secure data engineering: lineage, cataloging,
        Model Cards, data quality, privacy-enhancing technologies, access
        control, integrity
        Two objectives, one theme: knowing where data came from and handling
        it safely. (5.1.2, 5.1.3)
    54  Threats to AI systems: prompt injection, data leakage, toxicity,
        output filtering and validation, audit trails for AI interactions
        Data leakage, output filtering, audit logging and toxicity are new in
        version 1.1. (5.1.4)
    55  Hallucination detection and grounding: RAG grounding, output
        validation, confidence scoring
        New in version 1.1. (5.1.5)
    56  Governance and compliance services: AWS Config, Amazon Inspector,
        AWS Artifact, AWS CloudTrail, AWS Trusted Advisor (5.2.1)
    57  Data governance strategies: lifecycle, logging, residency,
        monitoring, retention (5.2.2)
    58  Governance processes and the Generative AI Security Scoping Matrix:
        policies, review cadence, transparency standards, team training
        (5.2.3)

===============================================================================
Cross-reference notes (deliberate syllabus overlap)
===============================================================================

    Agents appear in Units 2 and 3: Ch 22 to 23 define them (2.1.6, 3.1.6),
    Ch 27 names the AWS tooling (2.3.1), Ch 42 evaluates them (3.4.4), Ch 52
    secures them (5.1.1). Cross-link, do not repeat.
    Amazon Bedrock Guardrails appears three times: Ch 34 as a prompting best
    practice, Ch 45 as a responsible-AI tool (its home chapter), Ch 52 as a
    security control. Ch 45 teaches the feature; the others reference it.
    RAG appears in Ch 31 (what it is, Knowledge Bases), Ch 33 (its place on
    the customization cost ladder), Ch 42 (evaluating it), Ch 55 (grounding).
    Model selection spans two domains: Ch 29 carries both 2.2.3 and 3.1.1
    because the two objectives list the same factors.
    Metrics come in three layers: Ch 14 (classic ML metrics vs business
    metrics), Ch 41 (FM text metrics), Ch 43 (business alignment metrics).
    SageMaker Model Cards appear in Ch 50 (transparency) and Ch 53 (data
    provenance). Ch 50 teaches the feature.
    Prompt injection is Ch 36 (a prompting risk) and Ch 54 (a system threat).
    Bias is Ch 02 (as a term), Ch 44 (as a responsible-AI feature), Ch 48
    (effects and detection, the home chapter).
    Token pricing is Ch 20 (the model) and Ch 28 (provisioned throughput as
    the alternative).

===============================================================================
Practice exam plan (objective-based, sampled)
===============================================================================

The real exam draws 50 scored questions from 69 objectives at the published
domain weights, so exams map to OBJECTIVES and sample them; one full mock
cannot cover every objective.

    Question style: scenario-based, plausible distractors, 2 minutes per
    question in the section exams. Each question carries a comment header
    naming the chapter and the objective it tests.
    Pass bar: the real cut score is 700 on a 100 to 1,000 scale, which is not
    a percentage. Use 70% as the practice target and say so.

    Plan (7 exams):
        1  Unit 1 (14 chapters, 14 questions, 28 min)
        2  Unit 2 (14 chapters, 14 questions, 28 min)
        3  Unit 3 (15 chapters, 15 questions, 30 min)
        4  Units 4 and 5 (15 chapters, 15 questions, 30 min)
        5  Full mock A (50 questions, 90 min)
        6  Full mock B (50 questions, 90 min)
        7  Full mock C (50 questions, 90 min), so that A, B and C together
           reach every objective at least once

    Full mock domain allocation (the official weights applied to 50):
        Domain 1  10 questions
        Domain 2  12 questions
        Domain 3  14 questions
        Domain 4   7 questions
        Domain 5   7 questions

    Full mock pace: the real exam is 65 questions in 90 minutes, about 83
    seconds each. A 50-question mock in 90 minutes (108 seconds each) keeps
    the real clock and the real scored count while our engine presents no
    unscored filler, so the mock feels slightly slower than the real sitting;
    the course home should say so.

    Exams 1 to 4 may be authored as soon as their unit's lessons ship. Mocks
    5 to 7 require full coverage and are a sealed pool, never drawn into the
    Practice hub's drills.

    ENGINE CONFLICT, same decision as the GenAI Engineer Associate course:
    the real exam has multiple-response, ordering and matching items, and
    our engine is single-best-answer with 4 options (a CLAUDE.md hard rule).
    Recommendation: keep single-answer and say plainly on the course home
    that the real exam adds those formats, matching what the GenAI course
    does.

===============================================================================
Terminology rules (see cert-config-aws-aif-c01.md for the full list)
===============================================================================

    "Amazon SageMaker AI" for the ML platform, never "Amazon SageMaker" alone.
    "Amazon Bedrock AgentCore" for the agent runtime, identity, and policy
    surfaces the guide names; "Strands Agents" for the open-source agent SDK;
    "Kiro" for the agentic IDE; "Amazon Quick" as the guide writes it.
    "Amazon Bedrock Knowledge Bases", "Amazon Bedrock Guardrails", "Amazon
    Bedrock Prompt Management", "Amazon Bedrock Model Evaluation" as the
    guide writes them.
    "Model Context Protocol (MCP)" on first mention, "MCP" after.
    "Foundation model (FM)" and "large language model (LLM)" on first mention
    in each lesson.
    Repo-wide AWS rules still apply if streaming comes up: "Amazon Data
    Firehose", "Amazon Managed Service for Apache Flink".
