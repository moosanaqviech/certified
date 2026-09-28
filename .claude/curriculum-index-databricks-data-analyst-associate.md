curriculum-index-databricks-data-analyst-associate.md
Curriculum Index: Databricks Certified Data Analyst Associate

Status: LOCKED against the official exam guide PDF ("Databricks Certified Data
Analyst Associate", the edition whose cover text reads "This version covers the
current version as of Oct 30, 2025"), verified 28 Sep 2026 by downloading the
PDF from databricks.com and extracting its text directly. Every objective below
is transcribed from that PDF; all 39 objectives (3/3/2/9/6/7/4/2/3 across the nine
sections), every exam fact, and all ten sample-question answers (Q1 B / Q2 C /
Q3 D / Q4 B / Q5 A / Q6 B / Q7 A / Q8 C / Q9 B / Q10 B,D) are recorded here. This
file is the authoritative source for unit and chapter placement: a later request
that conflicts with it gets flagged with a proposed one-line fix rather than
silently absorbed. Re-verify if Databricks publishes a newer edition (the guide
asks candidates to check back two weeks before the exam).

Exam version: exam guide covering the live exam as of 30 Oct 2025.
Source of truth: the official exam guide PDF, linked from
https://www.databricks.com/learn/certification/data-analyst-associate
(PDF: databricks.com/sites/default/files/2025-10/databricks-certified-data-analyst-associate-oct-2025.pdf)

Exam facts (all confirmed from the PDF unless noted):
    45 scored multiple-choice questions. Unscored questions may also appear;
    they are not identified on the form and do not affect the score, and extra
    time is factored in for them. So 45 is the SCORED count, not the total
    presented.
    Time limit: 90 minutes.
    Registration fee: USD 200 (from the certification web page, not the PDF).
    Delivery: online proctored or test center proctored.
    Prerequisite: none required; related course attendance and six months of
    hands-on experience as a data analyst are highly recommended.
    Validity: 2 years. Recertification requires taking the full live exam again.
    PASSING SCORE: the PDF publishes NO cut score. Do not state one. Use 70% as
    our own practice target, labelled as our guidance.
    Recommended training: "Data Analysis with Databricks" (instructor-led and
    self-paced), being replaced by "AI/BI for Data Analysts" and "SQL Analytics
    on Databricks".

Multiple-selection warning: the guide calls the questions "multiple-choice", but
sample question 10 asks "Which two are features of the Query History" with the
answer B and D. Our exam engine supports multiple-response questions (an array
in `correct`, all-or-nothing scoring), so a few per exam are allowed, kept to
roughly a quarter at most, with the blurb "Most questions have one best answer;
a few ask you to select two."

Section weights: the PDF publishes NO percentages. The weights below are DERIVED
from objective counts, used for exam design and the practice hub bars only, and
always labelled "% of objectives", never "% of exam".

    Section 1  Databricks Data Intelligence Platform     3 objectives   7.7%
    Section 2  Managing Data                             3 objectives   7.7%
    Section 3  Importing Data                            2 objectives   5.1%
    Section 4  Executing Queries with Databricks SQL     9 objectives  23.1%
    Section 5  Analyzing Queries                         6 objectives  15.4%
    Section 6  Dashboards and Visualizations             7 objectives  17.9%
    Section 7  AI/BI Genie Spaces                        4 objectives  10.3%
    Section 8  Data Modeling with Databricks SQL         2 objectives   5.1%
    Section 9  Securing Data                             3 objectives   7.7%
                                                        39 objectives

39 objectives map onto 45 scored questions, so the real exam covers roughly one
question per objective with a few objectives asked twice. Practice exams below
follow that: one question per chapter, and the full mocks weight by objectives.

Structure: 9 units mirroring the 9 official sections, continuous chapter
numbering 01 to 43. One chapter per objective, except where an objective bundles
two decisions and is split (noted inline). Trade-off lessons are flagged (TO).

===============================================================================
Unit 1: Understanding the Databricks Data Intelligence Platform (3 objectives)
===============================================================================

Official objectives, mapped to chapters:

    Describe the core components of the Databricks Intelligence Platform,
      including Mosaic AI, DeltaLive tables, Lakeflow Jobs, Data Intelligence
      Engine, Delta Lake, Unity Catalog, and Databricks SQL ................ Ch 01
    Understand catalogs, schemas, managed and external tables, access
      controls, views, certified tables, and lineage within the Catalog
      Explorer interface ......................................... Ch 02, 03, 04
    Describe the role and features of Databricks Marketplace .............. Ch 05

Chapters:

    01  The Data Intelligence Platform: what each component is for
        Mosaic AI, Lakeflow Spark Declarative Pipelines (the guide's "DeltaLive
        tables"), Lakeflow Jobs, the Data Intelligence Engine, Delta Lake,
        Unity Catalog, Databricks SQL, and where an analyst spends their day.
    02  Catalog Explorer: catalogs, schemas, tables, and views
        The three-level namespace as the analyst sees it, what each tab of
        Catalog Explorer shows, and the kinds of views.
    03  Managed vs external tables (TO)
        Who owns the files, what DROP TABLE does in each case (sample Q9),
        why managed is the recommendation.
    04  Certified tables, lineage, and access controls in Catalog Explorer
        The Certified and Deprecated statuses, the lineage tab, the
        Permissions tab and the privilege model at a glance.
    05  Databricks Marketplace: role and features
        Public and private exchanges, free and paid listings, Delta Sharing
        underneath, what a consumer gets and needs.

===============================================================================
Unit 2: Managing Data (3 objectives)
===============================================================================

Official objectives, mapped to chapters:

    Use Unity Catalog to discover, query, and manage certified datasets ... Ch 06
    Use the Catalog Explorer to tag a data asset and view its lineage ..... Ch 07
    Perform data cleaning on Unity Catalog Tables in SQL, including
      removing invalid data or handling missing values ..................... Ch 08

Chapters:

    06  Discovering, querying, and managing certified datasets
        Search and browse, Insights, comments, certification as a trust
        signal, querying from Catalog Explorer, managing ownership and
        comments.
    07  Tagging assets and reading lineage
        Tags (key and value) on tables and columns via the UI and SQL, the
        information_schema tag views, table and column lineage and what
        captures it.
    08  Cleaning data in SQL: invalid rows and missing values
        NULL handling, DELETE and CREATE OR REPLACE TABLE AS SELECT, dedup
        with ROW_NUMBER, TRY_CAST, TRIM and REGEXP_REPLACE, constraints, and
        the notebook data profile (sample Q1).

===============================================================================
Unit 3: Importing Data (2 objectives)
===============================================================================

Official objectives, mapped to chapters:

    Explain the approaches for bringing data into Databricks, covering
      ingestion from S3, data sharing with external systems via Delta
      Sharing, API-driven data intake, the Auto Loader feature, and
      Marketplace ......................................................... Ch 09
    Use the Databricks Workspace UI to upload a data file to the platform  Ch 10

Chapters:

    09  Five ways in: S3, Delta Sharing, API-driven intake, Auto Loader,
        Marketplace (TO)
        Shared ground is "data lands in Unity Catalog"; one card per path;
        the decision signals (one-off file, cloud bucket, another company's
        live data, SaaS system, continuous file arrivals).
    10  Uploading a file through the workspace UI
        The create-table-from-upload flow, formats and limits, header and
        type options, the managed Delta table it produces, and the
        upload-to-volume alternative.

===============================================================================
Unit 4: Executing Queries with Databricks SQL and SQL Warehouses (9 objectives)
===============================================================================

Official objectives, mapped to chapters:

    Utilize Databricks Assistant within a Notebook or SQL Editor to
      facilitate query writing and debugging .............................. Ch 11
    Explain the role a SQL Warehouse plays in query execution ............. Ch 12
    Querying cross-system analytics by joining data from a Delta table and
      a federated data source ............................................. Ch 13
    Create a materialized view, including knowing when to use Streaming
      Tables and Materialized Views, and differentiate between dynamic and
      materialized views .............................................. Ch 14, 15
    Perform aggregate operations such as count, approximate count distinct,
      mean, and summary statistics ........................................ Ch 16
    Write queries to combine tables using various join operations (inner,
      left, right, and so on) with single or multiple keys, as well as set
      operations like union and union all, including the differences
      between the joins ............................................... Ch 17, 18
    Perform sorting and filtering operations on a table ................... Ch 19
    Create managed tables and external tables, including creating tables by
      joining data from multiple sources (e.g., CSV, Parquet, Delta tables)
      to create unified datasets, including Unity Catalog ................. Ch 20
    Use Delta Lake's time travel to access and query historical data
      versions ............................................................ Ch 21

Chapters:

    11  Databricks Assistant in the notebook and SQL editor
        Generate, /explain, /fix, /doc, /optimize (sample Q2), inline
        completion, diagnosing errors, and what it can and cannot see.
    12  SQL warehouses: the compute behind every query
        Serverless, pro, and classic; size, scaling, auto-stop; why the
        warehouse decides latency and cost, not the query text.
    13  Cross-system analytics with Lakehouse Federation
        Connections and foreign catalogs, joining a Delta table to a
        federated source, pushdown, and when to materialize instead.
    14  Streaming tables vs materialized views (TO)
        Continuous arrivals vs precomputed complex queries (sample Q3),
        refresh and pipeline mechanics, what each costs.
    15  Dynamic views vs materialized views
        A view that filters or masks per user vs a view that stores results;
        the guide's "differentiate" objective as its own chapter.
    16  Aggregates: count, approximate count distinct, mean, and summary
        statistics
        COUNT variants and NULLs, APPROX_COUNT_DISTINCT and when the
        approximation is fine, AVG and MEAN, DESCRIBE and SUMMARY.
    17  Joins: inner, left, right, full, on one key or several
        Row-count consequences of each join type, multi-key joins, anti and
        semi joins, the duplicate-key trap.
    18  Set operations: UNION, UNION ALL, INTERSECT, EXCEPT
        Column alignment rules, deduplication cost of UNION, when UNION ALL
        is the right default.
    19  Sorting and filtering
        WHERE vs HAVING, ORDER BY with NULLS FIRST/LAST, LIMIT, filtering on
        expressions and dates, QUALIFY.
    20  Creating managed and external tables, and unifying sources
        CREATE TABLE, CREATE OR REPLACE (sample Q6), CTAS over CSV, Parquet
        and Delta with read_files, LOCATION for external, the three-level
        name.
    21  Delta Lake time travel
        VERSION AS OF and TIMESTAMP AS OF, DESCRIBE HISTORY, RESTORE, and
        why VACUUM breaks old versions (sample Q4).

===============================================================================
Unit 5: Analyzing Queries (6 objectives)
===============================================================================

Official objectives, mapped to chapters:

    Understand the Features, Benefits, and Supported Workloads of Photon .. Ch 22
    Identify poorly performing queries in the Databricks Intelligence
      platform, such as Query Insights, Query Profiler log, etc. ........... Ch 23
    Utilize Delta Lake to audit and view history, validate results, and
      compare historical results or trends ................................ Ch 24
    Utilize query history and caching to reduce development time and
      query latency ....................................................... Ch 25
    Apply Liquid Clustering to improve query speed when filtering large
      tables on specific columns .......................................... Ch 26
    Fix a query to achieve the desired results ............................ Ch 27

Chapters:

    22  Photon: features, benefits, and supported workloads
        The vectorized engine, what it accelerates (SQL, DataFrame, Delta
        writes), what it does not, and where it is on by default.
    23  Finding slow queries: query history, Query Insights, and the query
        profile
        Reading the profile (time spent, rows, spilling, pruning), the
        symptoms of a bad query, and the fixes each symptom points at.
    24  Auditing with Delta history: validating and comparing results
        DESCRIBE HISTORY columns, operation metrics, comparing two versions
        with time travel, and reproducing a report.
    25  Query history and caching
        Filtering history by user, warehouse, status and date (sample Q10),
        duration and I/O metrics, query result cache, disk cache, and what
        invalidates a cached result.
    26  Liquid Clustering
        CLUSTER BY, choosing clustering keys, OPTIMIZE, automatic
        clustering; partitioning and Z-Order as the contrast case only.
    27  Fixing a query: the mistakes that produce the wrong result
        Missing GROUP BY (sample Q7), HAVING vs WHERE, NULL comparisons,
        join fan-out, DISTINCT misuse, integer division, timezone traps.

===============================================================================
Unit 6: Working with Dashboards and Visualizations in Databricks (7 objectives)
===============================================================================

Official objectives, mapped to chapters:

    Build dashboards using AI/BI Dashboards, including multi-tabs/page
      layouts, multiple data sources/datasets, and widgets (visualizations,
      text, images) ....................................................... Ch 28
    Create visualizations in notebooks and the SQL editor ................. Ch 29
    Work with parameters in SQL queries and dashboards, including
      defining, configuring, and testing parameters ....................... Ch 30
    Configure permissions through the UI to share dashboards with
      workspace users/groups, external users through shareable links, and
      embed dashboards in external apps ................................... Ch 31
    Schedule an automatic dashboard refresh ............................... Ch 32
    Configure an alert with a desired threshold and destination ........... Ch 33
    Identify the effective visualization type to communicate insights
      clearly ............................................................. Ch 34

Chapters:

    28  AI/BI Dashboards: datasets, pages, and widgets
        Draft vs published, the dataset layer, multiple pages, visualization,
        text and image widgets, filters, publishing with embedded credentials.
    29  Visualizations in notebooks and the SQL editor
        The visualization editor on a result set, chart types available,
        saving a visualization with the query, notebook display options.
    30  Parameters in queries and dashboards
        Named parameter markers, parameter widgets and their types, date
        range parameters in a WHERE clause (sample Q8), defaults and testing.
    31  Sharing dashboards: permissions, links, and embedding
        CAN VIEW, CAN RUN, CAN EDIT, CAN MANAGE; sharing with workspace
        users and groups; account-wide and public shareable links; embedding
        in external apps.
    32  Scheduling a dashboard refresh
        Schedules on a published dashboard, the warehouse they use,
        subscribers and email delivery, pausing.
    33  Alerts: threshold and destination
        A query, a condition on a result column, the schedule, notification
        destinations (email, Slack, webhook, Teams), and re-notify behavior
        (sample Q5).
    34  Choosing the visualization that communicates the insight (TO)
        Bar vs line vs pie vs scatter vs table vs counter vs map: the signal
        in the data that picks the chart, and the misleading choices.

===============================================================================
Unit 7: Developing, Sharing, and Maintaining AI/BI Genie Spaces (4 objectives)
===============================================================================

Official objectives, mapped to chapters:

    Describe the purpose, key features, and components of AI/BI Genie
      spaces .............................................................. Ch 35
    Create Genie spaces by defining reasonable sample questions and
      domain-specific instructions, choosing SQL warehouses, curating Unity
      Catalog datasets (tables, views...), and vetting queries as Trusted
      Assets .............................................................. Ch 36
    Assign permissions via the UI and distribute Genie spaces using
      embedded links and external app integrations ........................ Ch 37
    Optimize AI/BI Genie spaces by tracking user questions, response
      accuracy, and feedback; updating instructions and trusted assets
      based on stakeholder input; validating accuracy with benchmarks;
      refreshing Unity Catalog metadata ................................... Ch 38

Chapters:

    35  Genie spaces: purpose, features, and components
        Natural language to SQL over curated data, the space as the unit of
        curation, what it draws on (Unity Catalog metadata, instructions,
        trusted assets), and what it is not.
    36  Creating a Genie space
        Choosing the warehouse and datasets, sample questions, general and
        SQL instructions, trusted assets (example SQL queries and
        functions), and testing.
    37  Sharing Genie spaces
        Permissions (CAN VIEW, CAN EDIT, CAN MANAGE), sharing with users and
        groups, embedded links, and external app integrations.
    38  Optimizing Genie spaces
        Monitoring questions and feedback, benchmarks for accuracy,
        updating instructions and trusted assets, refreshing Unity Catalog
        metadata, and the improvement loop.

===============================================================================
Unit 8: Data Modeling with Databricks SQL (2 objectives)
===============================================================================

Official objectives, mapped to chapters:

    Apply industry-standard data modeling techniques, such as star,
      snowflake, and data vault schemas, to analytical workloads ........... Ch 39
    Understand how industry-standard models align with the Medallion
      Architecture ........................................................ Ch 40

Chapters:

    39  Star, snowflake, and data vault (TO)
        Facts and dimensions, normalization depth, hubs-links-satellites;
        the signal that picks each for an analytical workload.
    40  Where the models sit in the medallion architecture
        Bronze, silver, gold; where a vault, a normalized model and a star
        schema each belong; primary and foreign key constraints as
        informational metadata.

===============================================================================
Unit 9: Securing Data (3 objectives)
===============================================================================

Official objectives, mapped to chapters:

    Use Unity Catalog roles and sharing settings to ensure workspace
      objects are secure .................................................. Ch 41
    Understand how the 3-level namespace (Catalog / Schema / Tables or
      Volumes) works in the Unity Catalog ................................. Ch 42
    Apply best practices for storage and management to ensure data
      security, including table ownership and PII protection .............. Ch 43

Chapters:

    41  Unity Catalog roles and sharing settings
        Account and workspace admins, metastore admins, owners, groups;
        GRANT and REVOKE; sharing settings for dashboards, Genie spaces and
        Delta Sharing; least privilege.
    42  The three-level namespace: catalog, schema, tables and volumes
        Resolution of names, default catalog and schema, USE, privilege
        inheritance down the hierarchy, volumes for files.
    43  Storage and management best practices: ownership and PII
        Table ownership and transfer, managed storage over external paths,
        column masks and row filters, tagging PII, dynamic views, audit via
        system tables.

===============================================================================
Cross-reference notes (deliberate syllabus overlap)
===============================================================================

    Catalog Explorer appears in Units 1 and 2: Unit 1 teaches what it shows
    (Ch 02, 04); Unit 2 teaches doing things in it (tagging, certification,
    lineage, Ch 06, 07). Cross-link, do not repeat.
    Managed vs external tables: Ch 03 (the decision) and Ch 20 (the SQL that
    creates each). Ch 20 links back for the why.
    Views: Ch 02 names the kinds; Ch 15 is the dynamic vs materialized
    contrast; Ch 43 uses dynamic views for PII. Cross-link.
    Delta history: Ch 21 (time travel syntax) and Ch 24 (auditing and
    comparing with it). Ch 24 assumes Ch 21.
    Marketplace: Ch 05 (what it is) and Ch 09 (as an ingestion path). Ch 09
    links back rather than re-teaching.
    Unity Catalog permissions: Ch 04 (as seen in Catalog Explorer) and Ch 41
    (as a security model). Ch 41 goes deeper.
    Genie: Ch 35 to 38 own it; Ch 06 mentions certified assets as what Genie
    should be pointed at.

===============================================================================
Practice exam plan
===============================================================================

    Question style: scenario-based, single best answer, 4 options, plausible
    distractors, one question per chapter in scope, 2 minutes per question.
    A few multiple-response questions per exam are allowed (the real exam has
    them, see sample Q10), never more than a quarter.
    Pass bar: 70% as our practice target (no official cut score; say so).
    File prefix: da-practice-exam-NN.html in databricks-data-analyst-associate/.

    Section exams (wired as unit tests on the course home):
        Exam 1: Units 1-3, chapters 01-10 (10 questions, 20 min)
        Exam 2: Unit 4, chapters 11-21 (11 questions, 22 min)
        Exam 3: Units 5-6, chapters 22-34 (13 questions, 26 min)
        Exam 4: Units 7-9, chapters 35-43 (9 questions, 18 min)
    Full-length mocks (45 questions, 90 minutes, one per objective plus six
    repeats on the heaviest sections, new scenarios each):
        Exam 5, Exam 6, Exam 7
    The practice hub (practice/databricks-da-associate.html) drills from
    exams 1-4 tagged by chapter and uses 5-7 as its mock pool; it has no
    /ready diagnostic, so its readiness check draws from the section exams.
