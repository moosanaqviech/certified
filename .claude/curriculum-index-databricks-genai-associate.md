curriculum-index-databricks-genai-associate.md
Curriculum Index: Databricks Certified Generative AI Engineer Associate

Status: DRAFT, pending user confirmation to LOCK. Built by extracting the text of
the official exam guide PDF supplied by the user on 29 Jul 2026
("Databricks Certified Generative AI Engineer Associate Exam Guide", the edition
whose cover text reads "This version covers the currently live version as of
March 18, 2026"). Every objective below is transcribed from that PDF, not from
third-party reproductions. Once the user confirms, this file becomes the
authoritative source for unit and chapter placement: a later request that
conflicts with it gets flagged with a proposed one-line fix rather than silently
absorbed.

Exam version: exam guide covering the live exam as of 18 Mar 2026.
Source of truth: the official exam guide PDF, linked from
https://www.databricks.com/learn/certification/genai-engineer-associate

Exam facts (all confirmed verbatim from the PDF):
    45 scored questions, multiple-choice OR MULTIPLE-SELECTION.
    Unscored questions may also appear. They are not identified on the form and
    do not affect your score, and extra time is factored in for them. So 45 is
    the SCORED count, not the total presented.
    Time limit: 90 minutes. Registration fee: USD 200.
    Delivery: Online Proctored.
    Prerequisite: none required; related course attendance and six months of
    hands-on experience are highly recommended.
    Validity: 2 years. Recertification requires taking the full live exam again.
    PASSING SCORE: the PDF publishes NO cut score. Do not state one.

Multiple-selection warning: this exam is NOT purely single-answer. Sample
question 1 asks "Which TWO actions" (answer A, B) and sample question 9 asks for
two actions (answer D, E). Our exam engine is single-best-answer with 4 options.
See the "Engine conflict" note in the practice exam plan below; it needs a
product decision before exam authoring starts.

Section weights: the PDF publishes NO percentages. The 14/14/30/22/8/12 split
circulating on third-party study sites does NOT appear in this edition and does
not match its objective counts; treat it as unsourced and never quote it. The
weights below are DERIVED from objective counts and are used for exam design
only, never presented as official.

    Section 1  Design Applications                  6 objectives  10.7%
    Section 2  Data Preparation                     8 objectives  14.3%
    Section 3  Application Development             13 objectives  23.2%
    Section 4  Assembling and Deploying Apps       15 objectives  26.8%
    Section 5  Governance                           4 objectives   7.1%
    Section 6  Evaluation and Monitoring           10 objectives  17.9%
                                                   56 objectives

Note that 56 objectives map onto 45 scored questions, so the real exam SAMPLES
objectives rather than covering every one. This differs from the ML Associate
exam (48 objectives, 48 questions) and it changes how practice exams are built:
see the practice exam plan.

Structure: 6 units mirroring the 6 official sections, continuous chapter
numbering 01 to 55. One chapter per objective, except two merges noted inline
where a pair of objectives is the same concept. Trade-off lessons are flagged
(TO). Chapters marked (OFF) are supporting material that no official objective
covers: keep them, but never let them displace an objective.

===============================================================================
Unit 1: Design Applications (6 objectives, ~11%)
===============================================================================

Official objectives, mapped to chapters:

    Design a prompt that elicits a specifically formatted response ..... Ch 04
    Select model tasks to accomplish a given business requirement ..... Ch 03
    Select chain components for a desired model input and output ...... Ch 05
    Translate business use case goals into a description of the
      desired inputs and outputs for the AI pipeline .................. Ch 02
    Define and order tools that gather knowledge or take actions for
      multi-stage reasoning .......................................... Ch 06
    Determine how and when to use Agent Bricks (Knowledge Assistant,
      Multiagent Supervisor, Information Extraction) to solve problems  Ch 07

Chapters:

    01  The Databricks GenAI stack: Mosaic AI, Unity Catalog, and what
        goes where  (OFF)
        Orientation only; no objective covers it. The on-ramp that names
        every surface the rest of the course uses, matching Ch 01 in the
        DE Associate and ML Associate courses.
    02  From business goal to pipeline spec: naming the inputs and outputs
    03  Choosing the model task: summarization, extraction, classification,
        generation
        Sample question 5 in the guide tests exactly this (a paragraph to a
        one-sentence gist is Summarization, not text2text Generation).
    04  Prompts that return a specific format
    05  Chain components: choosing the pieces for a desired input and output
    06  Tools for multi-stage reasoning: defining them and ordering them
    07  Agent Bricks: Knowledge Assistant, Multiagent Supervisor, and
        Information Extraction (TO)
        Three options, so the trade-off pattern runs with three option cards.

===============================================================================
Unit 2: Data Preparation (8 objectives, ~14%)
===============================================================================

Official objectives, mapped to chapters:

    Apply a chunking strategy for a given document structure and model
      constraints .................................................... Ch 11
    Filter extraneous content in source documents that degrades quality
      of a RAG application ........................................... Ch 10
    Choose the appropriate Python package to extract document content
      from provided source data and format ........................... Ch 09
    Define operations and sequence to write given chunked text into
      Delta Lake tables in Unity Catalog ............................. Ch 13
    Identify needed source documents that provide necessary knowledge
      and quality for a given RAG application ........................ Ch 08
    Use tools and metrics to evaluate retrieval performance ........... Ch 14
    Design retrieval systems using advanced chunking strategies ....... Ch 12
    Explain the role of re-ranking in the information retrieval process  Ch 15

Chapters:

    08  Sourcing documents: what the corpus actually has to contain
        Guide sample question 2 lives here: the fix for unanswerable shipping
        questions is adding the right source data, not prompt trickery.
    09  Extracting content: choosing the Python package for the format
        Guide sample question 3 lives here (scanned images need pytesseract,
        not an HTML scraper).
    10  Filtering extraneous content that degrades retrieval
    11  Chunking strategy: size, overlap, and model constraints
        Guide sample question 1 lives here (raising chunk size and cutting
        overlap both reduce the embedding count).
    12  Advanced chunking and retrieval design: context-aware, hierarchical,
        and parent-document strategies
    13  Writing chunked text to Delta tables in Unity Catalog
    14  Measuring retrieval: recall, precision, and ranking metrics
    15  Re-ranking: the second pass that fixes first-pass retrieval

===============================================================================
Unit 3: Application Development (13 objectives, ~23%)
===============================================================================

Official objectives, mapped to chapters:

    Select Langchain/similar tools for use in a Generative AI application  Ch 16
    Qualitatively assess responses to identify common issues such as
      quality and safety ............................................. Ch 19
    Select chunking strategy based on model and retrieval evaluation .. Ch 24
    Augment a prompt with additional context from a user's input based
      on key fields, terms, and intents .............................. Ch 17
    Create a prompt that adjusts an LLM's response from a baseline to a
      desired output ................................................. Ch 18
    Implement LLM guardrails to prevent negative outcomes ............. Ch 20
    Select the best LLM based on the attributes of the application ..... Ch 21
    Select an embedding model context length based on source documents,
      expected queries, and optimization strategy .................... Ch 22
    Select a model from a model hub or marketplace for a task based on
      model metadata/model cards ..................................... Ch 23
    Select the best model for a given task based on common metrics
      generated in experiments ....................................... Ch 23
    Utilize MLflow and Agent Framework for developing agentic systems .. Ch 25
    Compare the evaluation and monitoring phases of the GenAI
      application life cycle ......................................... Ch 27
    Enable multi-agent systems to leverage Genie Spaces or the
      conversational API to retrieve data ............................ Ch 26

Chapters:

    16  LangChain and its alternatives: picking an orchestration framework (TO)
    17  Prompt augmentation: injecting user context by field, term, and intent
    18  Steering an LLM from a baseline response to the one you want
    19  Reading responses like a reviewer: quality and safety failure modes
    20  LLM guardrails inside the application
    21  Choosing the LLM for the application's attributes (TO)
    22  Embedding model context length: matching chunks, queries, and cost
        Guide sample question 4 lives here (cost and latency over quality
        picks the 512 context length at 0.13GB / 384 dimensions).
    23  Choosing a model: model cards, marketplace metadata, and your own
        experiment metrics
        MERGE of two objectives. Both are one decision (which model wins),
        differing only in the evidence available: a published card versus
        metrics you generated. Splitting them would give two thin lessons.
    24  Tuning chunking with retrieval evaluation in the loop
        Distinct from Ch 11: this is the iteration loop where eval results
        change the chunking, and it is a Section 3 objective, not Section 2.
    25  Building agents with MLflow and Mosaic AI Agent Framework
    26  Multi-agent systems with Genie Spaces and the conversational API
    27  Evaluation versus monitoring in the GenAI lifecycle (TO)
        The guide's verb is "compare", so this is a trade-off lesson even
        though both phases ship: the decision is which one answers a given
        question.

===============================================================================
Unit 4: Assembling and Deploying Applications (15 objectives, ~27%)
===============================================================================

Largest unit, and with Unit 3 it is half the exam. Official objectives:

    Code a chain using a pyfunc model with pre- and post-processing .... Ch 30
    Control access to resources from model serving endpoints .......... Ch 36
    Code a simple chain according to requirements ..................... Ch 29
    Choose the basic elements needed to create a RAG application:
      model flavor, embedding model, retriever, dependencies, input
      examples, model signature ...................................... Ch 28
    Register the model to Unity Catalog using MLflow ................... Ch 31
    Create and query a Vector Search index ............................ Ch 33
    Identify how to serve an LLM application that leverages Foundation
      Model APIs ..................................................... Ch 35
    Explain the key concepts and components of Mosaic AI Vector Search  Ch 32
    Identify batch inference workloads and apply ai_query()
      appropriately .................................................. Ch 37
    Configure vector search for a solution based on number of
      embeddings, update frequency, latency, and cost ................ Ch 34
    Configure a persistent datastore to store and retrieve intermediate
      memory or structured information ............................... Ch 38
    Apply CI/CD best practices such as updating a Vector Search index,
      promoting prompts across environments, and testing individual
      components of an agent ......................................... Ch 41
    Integrate managed, external, and custom MCP servers based on given
      application requirements ....................................... Ch 39
    Apply prompt version control and manage prompt lifecycle .......... Ch 40
    Develop an appropriate interactive user facing interface for an
      agent usage scenario (Apps, Slack, Teams, etc.) ................ Ch 42

Chapters:

    28  Anatomy of a RAG application: flavor, embedding model, retriever,
        dependencies, input example, signature
    29  Coding a simple chain to requirements
    30  pyfunc chains: pre-processing and post-processing around the model
    31  Registering the model to Unity Catalog with MLflow
    32  Mosaic AI Vector Search: key concepts and components
    33  Creating and querying a Vector Search index
    34  Sizing Vector Search: standard versus storage optimized (TO)
        Guide sample question 6 lives here (80 queries per second over 100
        million items, latency critical: standard endpoint, hybrid search
        and reranking off, custom fine-tuned embedding model).
    35  Serving an application on Foundation Model APIs
    36  Controlling access to resources from a serving endpoint
    37  Batch inference with ai_query()
    38  Persistent datastores for agent memory and structured state
    39  MCP servers: managed, external, and custom (TO)
        Guide sample question 9 lives here, and it is a two-answer item.
    40  Prompt version control and the prompt lifecycle
        Guide sample question 7 lives here (MLflow prompt versions promoted
        with aliases, not branch merges or overwritten files).
    41  CI/CD for agents: index updates, prompt promotion, component tests
    42  User-facing interfaces for agents: Databricks Apps, Slack, Teams
        Guide sample question 8 lives here (app backend calls the agent
        endpoint, never a token in browser JavaScript).

===============================================================================
Unit 5: Governance (4 objectives, ~7%)
===============================================================================

Smallest unit, and the most concrete. Official objectives:

    Use masking techniques as guard rails to meet a performance
      objective ...................................................... Ch 43
    Select guardrail techniques to protect against malicious user
      inputs to a GenAI application .................................. Ch 44
    Use legal/licensing requirements for data sources to avoid legal
      risk ........................................................... Ch 45
    Recommend an alternative for problematic text mitigation in a data
      source feeding a GenAI application ............................. Ch 46

Chapters:

    43  Masking as a guardrail
    44  Defending against malicious user input
        Overlaps Ch 20 (guardrails in the application). Split by intent:
        Ch 20 is preventing bad OUTPUT, Ch 44 is surviving hostile INPUT.
        Keep the split; cross-link both lessons.
    45  Legal and licensing constraints on data and models
    46  Problematic text in the corpus: mitigation alternatives

===============================================================================
Unit 6: Evaluation and Monitoring (10 objectives, ~18%)
===============================================================================

Official objectives, mapped to chapters:

    Select an LLM choice (size and architecture) based on a set of
      quantitative evaluation metrics ................................ Ch 47
    Select key metrics to monitor for a specific LLM deployment
      scenario ....................................................... Ch 52
    Evaluate agent performance using MLflow scoring and tracing ....... Ch 50
    Use inference logging to assess deployed RAG application
      performance .................................................... Ch 53
    Use Databricks features to control LLM costs ...................... Ch 55
    Use inference tables and Agent Monitoring to track a live LLM
      endpoint ....................................................... Ch 53
    Identify evaluation judges that require ground truth .............. Ch 48
    Use AI Gateway (Inference Tables, Usage Tables, and rate limiting)
      to track an LLM or agent deployed via Agent Framework .......... Ch 54
    Use Databricks custom Scorers for evaluating agents and LLMs ...... Ch 49
    Incorporate SME feedback to improve agent performance ............. Ch 51

Chapters:

    47  Quantitative metrics behind an LLM size and architecture choice
    48  Evaluation judges: which ones need ground truth
    49  Custom Scorers for evaluating agents and LLMs
    50  Agent evaluation with MLflow scoring and tracing
    51  SME feedback: turning expert disagreement into a reliable benchmark
        Guide sample question 10 lives here (define rubrics, calibrate the
        SMEs, feed aligned judgments to mlflow.genai.evaluate()).
    52  Choosing what to monitor for a deployment scenario
    53  Inference tables and Agent Monitoring: logging what a live endpoint does
        MERGE of two objectives. On Databricks, "inference logging" for a
        deployed RAG application IS the inference table plus Agent
        Monitoring surface; two lessons would teach the same mechanism twice.
    54  Mosaic AI Gateway: inference tables, usage tables, and rate limiting
        Distinct from Ch 53: the Gateway is the governance and traffic layer
        in front of endpoints, and rate limiting has no equivalent in Ch 53.
    55  Controlling LLM cost on Databricks

===============================================================================
Coverage summary
===============================================================================

    56 of 56 official objectives are covered by 55 chapters (54 objective
    chapters plus 1 orientation chapter, with 2 merges of paired objectives).
    Nothing is authored yet: all 55 chapters are outstanding.

Suggested authoring order: Unit 1 first (it is the mental model the rest
depends on), then Unit 2, then Unit 4 ahead of Unit 3. Unit 4 is the biggest
scoring block and its concrete surfaces (Vector Search, serving, registration)
make Unit 3's selection decisions easier to teach afterwards. Units 5 and 6 last.

===============================================================================
Practice exam plan (objective-based, not chapter-based)
===============================================================================

The real exam samples 45 questions from 56 objectives, so exams map to
OBJECTIVES and a single full mock cannot cover all of them.

    Question style: scenario-based, plausible distractors, 2 minutes per
    question. Each question carries a comment header naming the objective it
    tests, not just a chapter.
    Pass bar: do NOT publish a percentage as the official cut score. Use 70% as
    a practice target and label it as our own guidance, not Databricks'.

    Plan (6 exams):
        1  Sections 1-2 (14 objectives, 14 questions, 28 min)
        2  Section 3 (13 objectives, 13 questions, 26 min)
        3  Section 4 (15 objectives, 15 questions, 30 min)
        4  Sections 5-6 (14 objectives, 14 questions, 28 min)
        5  Full mock A (45 questions, 90 min, mirrors the real exam exactly)
        6  Full mock B (45 questions, 90 min), built to cover the 11
           objectives mock A sampled out, so mocks A and B together hit all 56

    Full mock section allocation (largest-remainder split of 45 questions
    across the 56 objectives, so the mock matches the real exam's shape):
        Section 1   5 questions
        Section 2   6 questions
        Section 3  11 questions
        Section 4  12 questions
        Section 5   3 questions
        Section 6   8 questions

    Exams 1-4 may be authored as soon as their unit's lessons ship. Exams 5
    and 6 require full coverage.

    ENGINE CONFLICT, needs a decision before exam authoring: the real exam
    includes multiple-selection items (2 of the guide's 10 sample questions
    are "choose TWO"). Our exam engine is single-best-answer with 4 options,
    and CLAUDE.md makes that a hard rule. Options: (a) keep single-answer and
    say plainly on the course home that the real exam adds multi-select items,
    (b) extend the exam engine to support multi-select, which breaks the
    frozen-engine rule and touches every existing course. Recommendation: (a)
    for now, with the caveat stated in the course blurb, since (b) is a
    product-wide engine change.

===============================================================================
Terminology rules (see cert-config-databricks-genai-associate.md for the list)
===============================================================================

    "Mosaic AI Vector Search" on first mention, "Vector Search" after.
    "Mosaic AI Agent Framework" / "Agent Framework"; "Agent Bricks" with its
    three named components (Knowledge Assistant, Multiagent Supervisor,
    Information Extraction).
    "Mosaic AI Gateway" / "AI Gateway" for inference tables, usage tables,
    and rate limiting.
    "Foundation Model APIs" for the hosted model endpoints.
    "Genie Spaces" for the conversational data surface.
    "Models in Unity Catalog", never the legacy workspace model registry.
    "Lakeflow Spark Declarative Pipelines", never "Delta Live Tables" or
    "DLT", matching the repo-wide rule, if pipelines come up at all.
    MLflow GenAI evaluation vocabulary as the guide uses it:
    mlflow.genai.evaluate(), scorers, judges, tracing, prompt versions and
    aliases.
