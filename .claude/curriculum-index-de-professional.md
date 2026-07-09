curriculum-index-de-professional.md
Curriculum Index: Databricks Data Engineer Professional

Status: Locked (authoritative source for unit and chapter placement) Exam version: November 30, 2025 Source of truth: Official Databricks exam guide PDF, linked from https://www.databricks.com/learn/certification/data-engineer-professional (Re-check the PDF when starting Unit 1 authoring and again before launch; Databricks updates it whenever the exam changes.)

Exam facts: 59 scored multiple-choice questions, 120 minutes, USD 200, no test aides, pass style consistent with Associate (single best answer).

Structure: 10 units mirroring the 10 official exam sections, 37 chapters, continuous numbering. Each chapter maps to official objective numbers. Trade-off lessons are flagged (TO). Official sub-group headers noted per unit.
Unit 1: Developing Code with Python and SQL (22%)

Sub-groups: "Using Python and Tools for development" (Ch 1-3), "Building and Testing an ETL pipeline" (Ch 4-10)

    DABs Project Structure for Scalable Python (1.1)
    Libraries and Dependencies: PyPI, Wheels, Source Archives (1.2)
    Python and Pandas UDFs (1.3)
    Production Pipelines: Lakeflow Declarative Pipelines + Auto Loader (1.4)
    Automating Jobs: UI, API, and CLI (1.5)
    Streaming Tables vs Materialized Views (TO) (1.6)
    CDC with the APPLY CHANGES API (1.7)
    Structured Streaming vs Lakeflow Pipelines (TO) (1.8)
    Control Flow and Task Configuration in Jobs (1.9, 1.10)
    Testing Pipelines: assertDataFrameEqual, transform, Debugger (1.11)

Unit 2: Data Ingestion and Acquisition (7%)

    Multi-Format Ingestion: Files, Message Buses, Cloud Storage (2.1)
    Append-Only Pipelines: Batch and Streaming on Delta (2.2)

Unit 3: Transformation, Cleansing, and Quality (10%)

    Advanced Transformations: Window Functions, Joins, Aggregations (3.1)
    Quarantining Bad Data with Expectations (3.2)

Unit 4: Data Sharing and Federation (5%)

    Delta Sharing: D2D vs Open Protocol (TO) (4.1, 4.3)
    Lakehouse Federation (4.2)

Unit 5: Monitoring and Alerting (10%)

Sub-groups: "Monitoring" (Ch 17-19), "Alerting" (Ch 20)

    System Tables: Cost, Audit, Utilization (5.1)
    Query Profiler and Spark UI (5.2)
    Monitoring Jobs and Pipelines: Event Logs, REST API, CLI (5.3, 5.4)
    Alerting: SQL Alerts and Job Notifications (5.5, 5.6)

Unit 6: Cost and Performance Optimisation (13%)

    UC Managed Tables and Reduced Ops Overhead (6.1)
    Delta Optimization: Deletion Vectors and Liquid Clustering (6.2)
    Data Skipping and File Pruning (6.3)
    CDF for Streaming Limitations and Latency (6.4)
    Diagnosing Bottlenecks with Query Profile (6.5)

Unit 7: Security and Compliance (10%)

Sub-groups: "Applying Data Security mechanisms" (Ch 26-28), "Ensuring Compliance" (Ch 28-29)

    ACLs and Least Privilege (7.1)
    Row Filters and Column Masks (7.2)
    Anonymization and PII Masking Pipelines (7.3, 7.4)
    Purging and Retention: VACUUM and Right to Be Forgotten (7.5)

Unit 8: Data Governance (7%)

    Metadata, Tags, and Discoverability (8.1)
    The UC Permission Inheritance Model (8.2)

Unit 9: Debugging and Deploying (10%)

Sub-groups: "Debugging and Troubleshooting" (Ch 32-33), "Deploying CI/CD" (Ch 34)

    Troubleshooting: Spark UI, Cluster Logs, Event Logs (9.1, 9.3)
    Job Repair and Parameter Overrides (9.2)
    Deploying with DABs and Git-Based CI/CD (9.4, 9.5)

Unit 10: Data Modelling (6%)

    Scalable Data Models with Delta (10.1)
    Liquid Clustering vs Partitioning vs Z-Order (TO) (10.2, 10.3)
    Dimensional Modelling for Analytics (10.4)

Cross-reference notes (deliberate syllabus overlap)

    Query Profiler appears in Units 5, 6, and 9. Angle per unit: learning the tool (Ch 18), diagnosing cost and performance (Ch 25), troubleshooting failures (Ch 32). Cross-link, do not repeat.
    DABs appears in Units 1 and 9: project structure (Ch 1) vs deployment workflow (Ch 34).
    Liquid clustering appears in Units 6 and 10: as an optimization technique (Ch 22) vs as a data layout decision (Ch 36).
    Event logs appear in Units 5 and 9: monitoring healthy pipelines (Ch 19) vs debugging failed ones (Ch 32).

Practice exam plan

    Question style: scenario-based, single best answer, 4 options, matching the 9 retired sample questions in the official PDF. Combining two objectives per question mirrors the real exam.
    One question per chapter in scope, 2 minutes per question, 70% pass bar (confirm pass threshold when registering; official guide does not state it).
    Progressive coverage plan (6 exams):
        Units 1-2 (12 chapters, 24 min)
        Units 1-4 (16 chapters, 32 min)
        Units 1-6 (25 chapters, 50 min)
        Units 1-8 (31 chapters, 62 min)
        Full coverage, Units 1-10 (37 chapters, 74 min)
        Full coverage, second pass with new scenarios (37 chapters, 74 min)

Terminology rules (November 2025 syllabus)

    Say "Lakeflow Spark Declarative Pipelines" (or "Lakeflow Declarative Pipelines"), not "Delta Live Tables" or "DLT".
    Liquid Clustering is the recommended layout approach; partitioning and Z-Order are taught as the contrast case (Ch 36), not as best practice.
    Reduced or removed from this exam version: partition hints, bloom filters, manual part-file sizing, Z-Order as a primary technique.

