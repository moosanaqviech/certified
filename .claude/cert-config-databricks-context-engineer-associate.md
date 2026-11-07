cert-config-databricks-context-engineer-associate.md
Cert Config: Databricks Certified Context Engineer Associate

Per-certification settings so the frozen engine rules stay generic. Pairs with
curriculum-index-databricks-context-engineer-associate.md (the chapter
placement, LOCKED 6 Nov 2026 against the official exam guide).

## Identity

    Badge text: "Databricks Context Engineer Associate"
    Course folder: databricks-context-engineer-associate/
    Difficulty: Associate
    Standard blurb: Bite-sized, visual lessons for the Databricks Certified
      Context Engineer Associate exam, built to teach how to design, govern
      and tune what an AI agent sees at inference time, not just facts to cram.
    Exam guide version: exam published 29 Jul 2026, guide updated 29 Jul 2026
      (PDF filename dated August 2026; VERIFIED by fetching the official PDF
      text, 6 Nov 2026)
    Questions: 45 scored, multiple-choice OR MULTIPLE-SELECTION. Up to 10
      unscored items may also appear, unidentified, with extra time factored in.
    Time: 90 minutes
    Pace: 2 minutes per question (45 x 2 = 90, matching the real exam limit,
      so a full mock needs no adjustment)
    Pass threshold: NOT PUBLISHED by Databricks. Never state an official cut
      score. Use 70% as our own practice target, labelled as our guidance;
      85% or more on full mocks is the recommended readiness bar.
    Cost: USD 200
    Delivery: Online proctored or test center. English only. Validity 2
      years; full re-exam to recertify.
    Prerequisite: none required; six months of hands-on experience with the
      exam outline is recommended.
    Code language: Python. Data manipulation code not specific to ML may be
      shown in SQL.

## File naming

    Lessons: lesson-NN-name.html, numbered 01-48 per the curriculum index.
    Practice exams: ctx-practice-exam-NN.html (slug prefix, per the convention
      that only the first course keeps the bare practice-exam-NN.html; DE
      Professional uses pro-, ML Associate ml-, GenAI genai-).
    All files live in databricks-context-engineer-associate/.

## Terminology rules

Current official names only. Where the docs renamed something after the exam
guide was written, keep the guide's name (that is what the exam says) and
state the new name once, in the chapter noted.

    Retrieval: "Databricks AI Search" (the guide's own name; renamed from
      Vector Search on 1 Jun 2026). Short form "AI Search". Never "Vector
      Search" as the product name, except once as "formerly Vector Search"
      in Ch 20. Index types are "Delta Sync" and "Direct Access"; sync modes
      are "triggered" and "continuous". SDK: databricks-ai-search (the
      databricks-vectorsearch package is a deprecated shim, contrast only).
    Conversational data surface: "Genie space" (the guide's wording). The
      docs renamed these "Genie Agents" on 8 Jul 2026; say the new name once,
      in Ch 12 only. Knowledge levers use the guide's terms: general
      instructions, sample questions, trusted SQL assets, SQL expressions.
    Durable state: "Lakebase" (managed Postgres). Checkpointing via
      LangGraph's AsyncPostgresSaver / PostgresSaver; never invent class
      names (the guide's sample Q7 uses a fake "AsyncCheckpointer" as a
      distractor).
    Tracing and evaluation: "MLflow 3", "MLflow Tracing", "traces",
      mlflow.genai.evaluate(), scorers and judges. Say "LLM-as-a-judge".
    Tools: "MCP" (Model Context Protocol), "MCP servers" qualified as
      managed, external or custom. "Agent Skills" as the guide capitalizes it.
      "Progressive disclosure" for staged tool discovery.
    Governance: "Unity Catalog" (UC after first mention per lesson); "Unity
      Catalog functions" for registered tools.
    Prebuilt agents, if they appear: "Agent Bricks".
    Gateway, if it appears: "AI Gateway"; the docs moved to "Unity Gateway"
      (GA 4 Aug 2026), say that once where first relevant.
    Context failure modes: exactly "context poisoning", "context
      distraction", "context confusion", "context clash" (lower case).
    Reasoning modes: "standard", "extended thinking", "reduced thinking".
    Repo-wide carry-overs: "Lakeflow Spark Declarative Pipelines" (never DLT),
      "Declarative Automation Bundles" (never DABs as the primary term).

## Recommended-vs-contrast stances

The official sample questions settle several of these; cite the stance, never
the question.

    Long sessions near capacity: compaction (high-fidelity summary plus the
      most recently used items) recommended. Bigger context window, sliding
      truncation, and disabling retrieval are contrast cases.
    Genie domain vocabulary: general instructions that define the terms
      recommended. Trusted SQL assets, SQL expressions and sample questions
      each fix a different problem and are contrast for vocabulary failures.
    Stale triggered index: a job that calls sync after the ingestion pipeline
      recommended. Continuous sync (ongoing cost), Direct Access rebuild, and
      drop-and-recreate are contrast unless the freshness signal demands them.
    Chunking for mixed documents and mixed queries: recursive splitting at
      roughly 512-1,024 tokens with 10-15% overlap as the default. Fixed size
      without overlap, whole-document and sentence-level are contrast.
    Picking a reliable configuration: compare all metrics together (parallel
      coordinates) so no metric lags. Averages, spread and single-best-metric
      are contrast.
    Tool access at scale: progressive disclosure with distinct capability
      descriptors, surfacing only the best-matching schema. Loading every
      schema then ranking is contrast.
    Compaction prompts: preserve user-stated constraints, exclusions and
      preferences; recall first, then precision. Keeping all tool outputs,
      full chain of thought, or every user message verbatim is contrast.
    Context generally: proactive management (minimal tool sets, just-in-time
      retrieval, scoped tool results) before reactive compaction.
    Measure before tuning: every context change is justified by MLflow
      traces or evaluation results, never by intuition.

## Palette registry

Course home keeps the shared gold home theme; gold (#d9a441) stays reserved for
exams and course homes product-wide, and cerulean (#5aa9e6) stays clear.

Per-UNIT lesson accents, separated by at least 35 degrees of hue from each
other. 141 accents already ship across ten courses, so every hue has a
neighbour somewhere; none below is an exact match to a shipped accent, and the
nearest shipped neighbour is noted. Before each unit's first lesson, re-check
against the lessons a learner meets next to it in THIS course.

    Unit 1  Foundations   sky      #79c0ec  (hue 203)  the focus lens; attention
            budget. Nearest: AWS SAA #6fcadc.
    Unit 2  Instructions  apricot  #f49d71  (hue 20)   ink on paper; the brief
            an agent is given. Nearest: #f4826a.
    Unit 3  Retrieval     jade     #42d7a5  (hue 160)  fetching from the stacks.
            Nearest: #34d3a6.
    Unit 4  Memory        violet   #8f72f2  (hue 252)  recall, things kept.
            Nearest: #8b5cf6. Lightened from a deeper indigo so accent-ink
            text keeps contrast.
    Unit 5  Tools         orchid   #ec79d9  (hue 310)  instruments, plug-ins.
            Nearest: AWS AIF #f06ee3.
    Unit 6  Compaction    lime     #a0df49  (hue 85)   pressed, condensed.
            Nearest: #a3e635.
    Unit 7  Multi-Agent   leaf     #64d86e  (hue 125)  a colony working
            together. Nearest: AWS AIF #64d65c.

Full five-variable blocks, ready to paste into a lesson's :root:

    Unit 1  --bg: #060d11;  --bg-tint: #102837;  --accent: #79c0ec;
            --accent-glow: rgba(121,192,236,0.12);  --accent-ink: #05151e;
    Unit 2  --bg: #110a06;  --bg-tint: #371d10;  --accent: #f49d71;
            --accent-glow: rgba(244,157,113,0.12);  --accent-ink: #1e0e05;
    Unit 3  --bg: #06110d;  --bg-tint: #10372a;  --accent: #42d7a5;
            --accent-glow: rgba(66,215,165,0.12);   --accent-ink: #051e16;
    Unit 4  --bg: #090611;  --bg-tint: #1a1037;  --accent: #8f72f2;
            --accent-glow: rgba(143,114,242,0.12);  --accent-ink: #0b051e;
    Unit 5  --bg: #11060f;  --bg-tint: #371031;  --accent: #ec79d9;
            --accent-glow: rgba(236,121,217,0.12);  --accent-ink: #1e051a;
    Unit 6  --bg: #0c1106;  --bg-tint: #273710;  --accent: #a0df49;
            --accent-glow: rgba(160,223,73,0.12);   --accent-ink: #141e05;
    Unit 7  --bg: #061107;  --bg-tint: #103713;  --accent: #64d86e;
            --accent-glow: rgba(100,216,110,0.12);  --accent-ink: #051e07;

Trade-off lessons use their unit accent; the (TO) structure, not a distinct
color, marks them.

## Case-study bookends

Company: Larkspur Mutual, a mid-size property and casualty insurer (locked in
the curriculum index). Every lesson opens with a case-file card and closes
with a decision card; teaching cards are unchanged. Keep recurring cast and
systems consistent: claims documents and policy wordings (RAG), a finance team
on a Genie space, a long-session customer-support agent, PII in every table,
and a multi-agent claims triage pipeline (Unit 7). Never reuse another
course's company.

## Exam engine note

The real exam mixes multiple-choice and multiple-selection items. Our exam
engine is single-best-answer with 4 options, a hard rule in CLAUDE.md. Until a
product decision says otherwise, author every practice question as single
best answer, and state on the course home that the live exam adds
multiple-selection items. Do not reshape a multi-answer concept into a
single-answer question unless it still tests the same judgement.

## Source rules

Every card and question traces to the official 29 Jul 2026 exam guide (scope)
plus official Databricks, MLflow and LangGraph documentation (behaviour,
defaults, limits). No braindump content, no third-party question banks.

    Egress: WebFetch and WebSearch (server side) reached databricks.com and
    the exam guide PDF on 6 Nov 2026. Shell-level requests from the remote
    session may still be blocked, so fetch doc pages with WebFetch, or have
    them supplied as uploads. Never substitute recalled knowledge for a
    fetched page on any versioned claim: Lakebase, AI Search, Agent Skills,
    MCP integration and Genie are all recent or recently renamed.

    Section weights in the index are the official ones from the guide
    (16/9/20/18/13/11/13). Objective numbers (1.1 to 7.6) are Certify's own,
    since the guide's bullets are unnumbered; label them that way if they
    ever appear in learner-facing copy.

    Known guide inconsistency: objective 7.2 and sample Q10 attribute a
    similar sub-agent symptom to different causes. Ch 44 teaches both and the
    evidence that separates them.
