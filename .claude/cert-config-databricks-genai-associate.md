cert-config-databricks-genai-associate.md
Cert Config: Databricks Certified Generative AI Engineer Associate

Per-certification settings so the frozen engine rules stay generic. Pairs with
curriculum-index-databricks-genai-associate.md (the chapter placement, DRAFT
until the user confirms the lock).

## Identity

    Badge text: "Databricks GenAI Engineer Associate"
    Course folder: databricks-generative-ai-engineer-associate/
    Difficulty: Associate
    Standard blurb: Bite-sized, visual lessons for the Databricks Certified
      Generative AI Engineer Associate exam, built to teach the design and
      trade-off reasoning the test rewards, not just facts to cram.
    Exam guide version: covers the live exam as of 18 Mar 2026 (VERIFIED by
      extracting the text of the official PDF supplied by the user, 29 Jul 2026)
    Questions: 45 scored, multiple-choice OR MULTIPLE-SELECTION. Unscored items
      may also appear, unidentified, with extra time factored in.
    Time: 90 minutes
    Pace: 2 minutes per question (45 x 2 = 90, which lands exactly on the real
      exam's limit, so a full mock needs no adjustment)
    Pass threshold: NOT PUBLISHED by Databricks. Never state an official cut
      score. Use 70% as our own practice target, labelled as our guidance.
    Cost: USD 200
    Delivery: Online Proctored. Validity 2 years; full re-exam to recertify.
    Prerequisite: none required; six months of hands-on experience and the
      Databricks Academy "Generative AI Engineering with Databricks" path are
      recommended by the guide.
    Code language: Python throughout. SQL appears only for Unity Catalog and
      Delta work and for ai_query() batch inference.

## File naming

    Lessons: lesson-NN-name.html, numbered 01-55 per the curriculum index.
    Practice exams: genai-practice-exam-NN.html (slug prefix, per the
      convention that only the first course keeps the bare
      practice-exam-NN.html; DE Professional uses pro-, AWS uses aws-, ML
      Associate uses ml-).
    All files live in databricks-generative-ai-engineer-associate/.

## Terminology rules

Current official names only, taken from the 18 Mar 2026 exam guide's own
wording. Never use a deprecated name in prose, options, or explanations.

    Vector database: "Mosaic AI Vector Search" on first mention in a lesson,
      "Vector Search" afterwards. Never "Databricks Vector DB".
    Agent authoring: "Mosaic AI Agent Framework", short form "Agent Framework".
    Prebuilt agents: "Agent Bricks", and name its components exactly as the
      guide does: Knowledge Assistant, Multiagent Supervisor, Information
      Extraction.
    Gateway: "Mosaic AI AI Gateway" is awkward, so use "Mosaic AI Gateway" on
      first mention and "AI Gateway" afterwards, which is the guide's own short
      form. Its three tracked surfaces are Inference Tables, Usage Tables, and
      rate limiting.
    Serving: "Mosaic AI Model Serving", short form "Model Serving". Hosted
      models are served through "Foundation Model APIs".
    Conversational data surface: "Genie Spaces".
    Monitoring: "Agent Monitoring" and "inference tables" (lower case for the
      table concept, title case when naming the AI Gateway feature).
    Evaluation: MLflow GenAI vocabulary as the guide uses it:
      mlflow.genai.evaluate(), scorers (including custom Scorers), judges,
      MLflow Tracing. Say "LLM-as-a-judge", not "AI grader".
    Prompts: "MLflow prompt versions" promoted with "aliases". Never describe
      git branch merges as the recommended prompt promotion path.
    Model registry: "Models in Unity Catalog". The legacy workspace model
      registry with Staging/Production stages is contrast only.
    Tool servers: "MCP servers", qualified as managed, external, or custom,
      matching the guide's three categories.
    User interfaces: "Databricks Apps" (the product), not "Databricks App
      Framework".
    Pipelines, if they come up at all: "Lakeflow Spark Declarative Pipelines",
      never "Delta Live Tables" or "DLT", matching the repo-wide rule.

## Recommended-vs-contrast stances

Where Databricks now recommends one approach, teach it as the recommendation
and present the older or weaker approach only as the contrast case.

    Prompt lifecycle: MLflow prompt versions plus aliases recommended; prompt
      files promoted by branch merge, JSON on a CI runner, or a Delta table
      overwritten each deploy are all contrast cases. The guide's own sample
      question 7 settles this.
    Agent authoring: MLflow plus Agent Framework recommended for agentic
      systems. Hand-rolled pyfunc chains remain explicitly examinable
      (Chapter 30), so teach both and be clear which is which: pyfunc is how
      you wrap pre- and post-processing, not the default way to build an agent.
    Endpoint auth: an application backend calling the endpoint with the app's
      credentials, enforcing user identity through the authenticated context.
      Tokens or API keys in browser JavaScript are the contrast case and are
      always wrong. Sample question 8 settles this.
    Model governance: Unity Catalog is the default namespace for data, chunk
      tables, indexes, and models. Workspace-local objects are legacy contrast.
    Evaluation quality: rubrics plus calibrated SME judgments feeding
      mlflow.genai.evaluate() recommended; blind score averaging, dropping
      disputed cases, or treating an LLM judge as the sole source of truth are
      the contrast cases. Sample question 10 settles this.
    Retrieval quality: measure before tuning. Chunk size, overlap, hybrid
      search, and re-ranking are all changes justified by retrieval metrics,
      never by intuition.
    Vector Search sizing: choose standard versus storage optimized from the
      real constraints (embedding count, update frequency, latency budget,
      cost), not by defaulting to one. Sample question 6 shows latency-critical
      workloads picking standard with reranking off.

## Palette registry (provisional)

The course home page (databricks-generative-ai-engineer-associate/index.html)
keeps the shared gold home theme, like every other course home; gold stays
reserved for exams and course homes product-wide.

The accents below are per-UNIT lesson palettes, assigned semantically and
separated by at least 35 degrees of hue from each other so no two units in this
course read alike. Four courses already ship, so the hue wheel is crowded: each
accent below is a hex that appears in NO existing lesson, but some have a near
neighbour in another course, noted per row. That is acceptable, because a
learner never sees two courses' lessons side by side. What matters is the check
the ML Associate config already mandates: before writing a unit's first lesson,
collision-check its accent against the lessons a learner actually meets next to
it (the neighbouring chapters in THIS course), and adjust if it clashes. Record
the final --accent hex in each lesson as it ships.

    Unit 1  Design Applications        #c9a0ff  orchid-violet
            Ideation and blueprint: the unit where you decide what the app is.
            Near neighbour: AWS #c084fc.
    Unit 2  Data Preparation           #4ade80  spring green
            Raw material being harvested, cleaned, and cut. No close neighbour
            in any existing course.
    Unit 3  Application Development    #31c8e8  cyan-teal
            Construction: chains, prompts, and agents being wired together.
            Near neighbour: DE Professional #3fc9d6.
    Unit 4  Assembling and Deploying   #ff8552  coral-orange
            Shipping and serving live traffic. Near neighbour: DE Associate
            #f57e4b. Distinct from the AWS course orange (#ff9900) and from
            the reserved exam gold.
    Unit 5  Governance                 #e8618c  rose
            Boundaries, masking, and legal limits. Near neighbour: DE
            Associate #ea5f9c.
    Unit 6  Evaluation and Monitoring  #8fa9ff  periwinkle
            Telemetry and dashboards: the signal-reading unit. Near
            neighbour: DE Professional #9fabd1.

Full five-variable palette blocks, ready to paste into a lesson's :root:

    Unit 1  --bg: #0c0913;  --bg-tint: #251a3a;  --accent: #c9a0ff;
            --accent-glow: rgba(201,160,255,0.12);  --accent-ink: #150a24;
    Unit 2  --bg: #060f09;  --bg-tint: #0f2c1a;  --accent: #4ade80;
            --accent-glow: rgba(74,222,128,0.12);   --accent-ink: #04170b;
    Unit 3  --bg: #051014;  --bg-tint: #0c2b36;  --accent: #31c8e8;
            --accent-glow: rgba(49,200,232,0.12);   --accent-ink: #03151c;
    Unit 4  --bg: #120a06;  --bg-tint: #331708;  --accent: #ff8552;
            --accent-glow: rgba(255,133,82,0.12);   --accent-ink: #1d0a04;
    Unit 5  --bg: #120711;  --bg-tint: #35122a;  --accent: #e8618c;
            --accent-glow: rgba(232,97,140,0.12);   --accent-ink: #1f0713;
    Unit 6  --bg: #08090f;  --bg-tint: #1a2040;  --accent: #8fa9ff;
            --accent-glow: rgba(143,169,255,0.12);  --accent-ink: #0a0d1f;

Trade-off lessons rely on the same unit accent as their siblings; the (TO)
structure, not a distinct color, marks them.

## Exam engine note

The real exam mixes multiple-choice and multiple-selection items: 2 of the 10
sample questions in the official guide ask for TWO answers. Our exam engine is
single-best-answer with 4 options and CLAUDE.md makes that a hard rule. Until a
product decision says otherwise, author every practice question as single best
answer, and state plainly on the course home that the live exam adds
multiple-selection items so the format difference never surprises a learner.
Do not quietly reshape a multi-answer concept into a single-answer question
without checking that the single-answer version still tests the same judgement.

## Source rules

Every card and question traces to the official 18 Mar 2026 exam guide (scope)
plus official Databricks and MLflow documentation (behaviour, defaults, limits).
No braindump content, no third-party question banks as material.

    BLOCKED EGRESS WARNING: in the current remote session, the network policy
    denies every Databricks host (www.databricks.com, docs.databricks.com) and
    mlflow.org at the proxy, and denies almost every third-party host too. Only
    GitHub is reachable, and WebSearch (which runs server side) still works.
    That means the per-chapter documentation research the authoring skill
    requires CANNOT be done from this environment. Before authoring lessons,
    either run in an environment whose egress policy allows docs.databricks.com
    and mlflow.org, or have the relevant doc pages supplied as file uploads the
    way the exam guide PDF was. Do not substitute recalled knowledge for a
    fetched doc page on any versioned claim (product name, default, limit, or
    recommendation): this exam's surface area is the fastest-moving in the whole
    product, and Agent Bricks, MCP integration, custom Scorers, and AI Gateway
    are all recent enough that training data cannot be trusted on them.

    The 14/14/30/22/8/12 section weighting circulating on third-party study
    sites does not appear in the 18 Mar 2026 guide and does not match its
    objective counts. Never quote it. Use the derived weights in the curriculum
    index, and label them derived.
