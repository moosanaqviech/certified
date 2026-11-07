# Curriculum Index: Databricks Context Engineer Associate

**Status:** Locked November 6, 2026 (authoritative source for unit and chapter placement; conflicting requests get flagged with a one-line fix, not absorbed)
**Exam version:** Exam published July 29, 2026; exam guide updated July 29, 2026 (PDF filename dated August 2026)
**Source of truth:** Official Databricks exam guide PDF, linked from
https://www.databricks.com/learn/certification/context-engineer-associate
(Re-check the PDF filename with a targeted search before Unit 1 authoring and again before launch.)

**Exam facts:** 45 scored questions (multiple-choice and multiple-selection), up to 10 unscored items, 90 minutes, USD 200, English only, no test aides, 6+ months hands-on recommended. Code on the exam is Python; non-ML data manipulation may appear in SQL.

**Structure:** 7 units mirroring the 7 official exam sections, 48 chapters, continuous numbering. Trade-off lessons flagged (TO). Engine: v2.

**Objective numbering:** The official guide lists objectives as unnumbered bullets. Numbers below (e.g. 3.4) are Certify's own, assigned in the order the bullets appear in each section, so coverage can be audited 1:1. All 45 objectives are covered.

**Chapter allocation vs weight:**

| Unit | Section | Weight | Chapters | Share |
|---|---|---|---|---|
| 1 | Foundations of Context Engineering | 16% | 8 | 17% |
| 2 | System Prompt and Instruction Design | 9% | 5 | 10% |
| 3 | Knowledge Retrieval and Genie Configuration | 20% | 10 | 21% |
| 4 | Memory Architecture with Lakebase and MLflow | 18% | 8 | 17% |
| 5 | Tool Design, MCP, and Agent Context | 13% | 6 | 12.5% |
| 6 | Context Compression and Compaction | 11% | 5 | 10% |
| 7 | Multi-Agent and Long-Horizon Task Design | 13% | 6 | 12.5% |

---

## Case-study bookends (locked)

**Company:** Larkspur Mutual, a mid-size property and casualty insurer moving its claims, underwriting and customer-service work onto AI agents on Databricks. Standalone to this course (no shared universe).

Why it fits: the exam's own scenarios span legal documents, treasury analytics, customer support, regulated compliance review and multi-agent forecasting. An insurer naturally has all of them: policy and claims documents (RAG), a finance team on Genie, a support agent with long sessions, PII in every table, and a multi-agent claims triage pipeline for Unit 7.

Each chapter opens with a case-file card (the situation at Larkspur and the decision the chapter answers) and closes with a decision card. Teaching cards are unchanged.

---

## Unit 1: Foundations of Context Engineering (16%)

Eyebrow: `Unit 1 · Foundations`

1. **The Context Window as an Attention Budget** (1.5)
   What competes for attention in an agent's context, and how to spot the element consuming a disproportionate share.
2. **The Databricks Context Stack: Unity Catalog, Lakebase, MCP, MLflow 3** (1.4)
   Which product owns which context job (governance and metadata, durable state, tool access, tracing and evaluation).
3. **Context Poisoning and Context Clash** (1.3)
   Failure modes where wrong or contradictory content enters the window; reading them from a trace.
4. **Context Distraction and Context Confusion** (1.3)
   Failure modes where too much or irrelevant content degrades output; telling the two apart from a trace.
5. **From Failure to Fix: Matching Symptoms to Techniques** (1.1)
   Given a described agent failure, pick the context technique that most directly addresses it.
6. **Proactive Context Management: Minimal Tools, Just-in-Time Retrieval, Result Scoping** (1.2)
   Design choices that reduce context pressure before compaction is ever needed.
7. **Context Rot: Detecting Length-Driven Degradation** (1.7)
   Identifying the point where context length measurably hurts retrieval accuracy or reasoning, and the intervention that restores it.
8. **Reasoning Modes: Standard vs Extended vs Reduced Thinking (TO)** (1.6)
   Selecting a reasoning mode from task requirements, token budget and context window impact.

## Unit 2: System Prompt and Instruction Design (9%)

Eyebrow: `Unit 2 · Instructions`

9. **Calibrating a System Prompt: Targeted Revisions** (2.3)
   Fixing an observed failure pattern with the least added token cost and maintenance burden.
10. **Few-Shot Examples Under a Token Budget** (2.2)
    Including or excluding examples by marginal contribution (untested tool paths, output structure, ambiguous inputs).
11. **Is the Bigger Prompt Worth It? Cost vs Performance in MLflow** (2.4)
    Reading experiment results to judge a higher-token configuration and isolate the element driving the trade-off.
12. **Building a Production-Ready Genie Space** (2.1)
    Assembling and validating instructions, sample questions and trusted SQL assets for a business domain.
13. **Genie Knowledge Levers: Instructions vs SQL Expressions vs Sample Questions vs Trusted Assets (TO)** (2.1)
    Which lever fixes which failure (terminology misreads, metric logic, phrasing coverage, certified answers).

## Unit 3: Knowledge Retrieval and Genie Configuration (20%)

Eyebrow: `Unit 3 · Retrieval`

14. **Unity Catalog Metadata as Agent Context** (3.1)
    Finding the missing or weak metadata (comments, descriptions, tags) behind an accuracy gap and the highest-impact fix.
15. **Curating Unity Catalog Objects for a Genie Space** (3.2)
    Choosing among managed tables, views, parameterized queries and SQL functions for a domain.
16. **Scoping a Task: Selecting the Context Elements an Agent Needs** (3.6)
    Given a task and available sources, choosing what the agent must see to scope and execute correctly.
17. **Pre-Inference vs Just-in-Time Agentic Retrieval (TO)** (3.7)
    Up-front embedding retrieval vs tool calls and dynamic Delta table queries, and the signals that pick each.
18. **RAG over a Unity Catalog-Governed Document Corpus** (3.4)
    Pipeline design from governed documents to chunks to retrieval to context injection.
19. **Chunking Strategy (TO)** (3.5)
    Fixed, recursive, structural and whole-document chunking against document structure, embedding context length and query types.
20. **AI Search Index Types: Delta Sync vs Direct Access (TO)** (3.3)
    Managed sync from a source table vs programmatic upserts, and when each is worth it.
21. **AI Search Freshness and Signal Quality: Sync Modes, Hybrid Search, Reranking** (3.3)
    Diagnosing stale or noisy retrieval from index configuration (triggered vs continuous sync, keyword plus vector, reranking).
22. **Diagnosing Retrieval Failures with MLflow Eval Logs** (3.8)
    Identifying the retrieval failure mode from eval logs and UC metadata, and the governance action that resolves it.
23. **Restricting Retrieval to Authoritative Sources** (3.9)
    Governance design that limits an agent's retrieval space to authoritative assets, not derived copies, before deployment.

## Unit 4: Memory Architecture with Lakebase and MLflow (18%)

Eyebrow: `Unit 4 · Memory`

24. **Session Memory vs Cross-Session Memory (TO)** (4.1)
    Matching the memory source to the information need, and diagnosing the mismatch when it is wrong.
25. **In-Context Scratchpad vs Delta-Backed State (TO)** (4.2)
    When a multi-step task needs durable state rather than notes held in the window.
26. **Persistent Agent Memory with Lakebase** (4.7)
    Configuring a Lakebase-backed durable store for resumable sessions (LangGraph Postgres checkpointer, async setup).
27. **Retrieving Memories: AI Search vs Structured Queries (TO)** (4.3)
    Which retrieval mechanism fits which query type against memories persisted in Lakebase.
28. **Static vs Dynamic Retrieval from Lakebase (TO)** (4.5)
    Trade-offs of loading memory up front vs fetching it on demand for a given architecture.
29. **Over-Retrieval and Under-Retrieval** (4.6)
    Context pollution vs missing history: symptoms, risks and the controls that balance them.
30. **Resolve Intent Before You Retrieve** (4.8)
    Locating the pipeline stage where user intent must be resolved when responses are accurate but contextually mismatched.
31. **Picking the Most Reliable Context Configuration in MLflow 3** (4.4)
    Comparing runs across several metrics (e.g. parallel coordinates) to find the configuration with no lagging metric.

## Unit 5: Tool Design, MCP, and Agent Context (13%)

Eyebrow: `Unit 5 · Tools`

32. **Choosing a Tool from Unity Catalog Function Schemas** (5.5)
    Selecting the right registered tool by functional fit, input and output compatibility, and task requirements.
33. **Progressive Disclosure: Why Staged Tool Loading Saves Tokens** (5.3)
    How staged discovery controls tool information entering the window compared to loading full schemas up front.
34. **Applying Progressive Disclosure to MCP Tool Access** (5.1)
    Implementing staged discovery and context-efficient execution against a large MCP tool registry.
35. **Disambiguating Overlapping Tool Descriptions** (5.2)
    Finding the description overlap that causes inconsistent tool selection, and fixing it.
36. **Clearing Raw Tool Outputs** (5.4)
    Deciding which tool results can be cleared from a deep message history near capacity.
37. **Agent Skills: Moving Rare Capabilities Out of the System Prompt** (5.6)
    Identifying capabilities to package as Agent Skills and the loading strategy that cuts baseline context cost.

## Unit 6: Context Compression and Compaction (11%)

Eyebrow: `Unit 6 · Compaction`

38. **Trimming Heuristics vs Compaction (TO)** (6.3)
    When hard-coded trimming is enough for a task's information-relevance pattern and when it needs compaction.
39. **What Is Safe to Remove** (6.4)
    Reading a trace to separate removable content from content downstream steps depend on.
40. **Aggressive vs Conservative Compaction (TO)** (6.5)
    Lower token cost with risk of losing subtle context vs higher fidelity at higher cost.
41. **Tuning a Compaction Prompt: Recall First, Then Precision** (6.2)
    The iteration order for compaction prompts against a real agent trace.
42. **Repairing a Compaction Failure** (6.1)
    Identifying the category of information wrongly discarded and revising the prompt to keep it without bloating the summary.

## Unit 7: Multi-Agent and Long-Horizon Task Design (13%)

Eyebrow: `Unit 7 · Multi-Agent`

43. **Shared-Context Failures in Multi-Agent Systems** (7.1)
    Inconsistent outputs, conflicting decisions and degraded reliability caused by insufficient shared context.
44. **Dispatching Sub-Agents: Task Messages vs Agent Traces** (7.2)
    Diagnosing failures from under-informed sub-agents and fixing dispatch without growing each sub-agent's window.
45. **Context Propagation to Prevent Conflicts** (7.3)
    The propagation change most likely to stop sub-agents producing conflicting outputs.
46. **Sub-Agent Output Design for a Saturated Orchestrator** (7.4)
    Shaping sub-agent returns to cut orchestrator context load while keeping task coherence.
47. **Drawing Agent Boundaries** (7.5)
    Diagnosing boundary placement failures: excessive handoff compression vs runaway context growth inside one agent.
48. **Long-Horizon Strategies (TO)** (7.6)
    Matching compaction, structured note-taking and sub-agent delegation to a task's dependency structure.

---

## Authoring notes

- **Terminology:** "Databricks AI Search" (renamed from Vector Search on June 1, 2026). The SDK package is `databricks-ai-search`; the legacy `databricks-vectorsearch` package is a deprecated shim. Never use "Vector Search" as the product name, except once as "formerly Vector Search" in Ch 20. Carry over locked terms from other Databricks courses (e.g. "Declarative Automation Bundles").
- **Exam guide inconsistency to handle in Ch 44:** the objective names the root cause as sub-agents receiving task messages instead of full traces, but sample Question 10's answer key attributes a similar symptom to an unsynced AI Search index. Teach both causes and the evidence that separates them (coordinator log shows updated figures vs sub-agent retrieved context shows stale documents).
- **Reuse from GenAI Engineer Associate:** Ch 18 to 21 (RAG, chunking, AI Search) and parts of Ch 22 and 31 (MLflow evaluation) can adapt existing GenAI material. Rewrite all quiz and exam items; never reuse questions across courses.
- **Recommended training (for scope framing only, not wording):** Building RAG Agents with Agent Bricks; Building Agentic Applications on Databricks; Agent Evaluation on Databricks; Deploying and Monitoring Agent Applications on Databricks; Building Reliable Conversational Agents with Genie; Get Started with Databricks for Data Engineering; Get Started with Data Governance on Databricks; Data Governance at Scale.
- **Mocks:** 3 full-length mocks of 45 questions, sampled by section weight (approx. 7 / 4 / 9 / 8 / 6 / 5 / 6), independent from unit exam pools. Include multiple-selection items to mirror the real exam, if the test engine supports them (check `test-authoring-guide.md`; the current spec is single best answer).
