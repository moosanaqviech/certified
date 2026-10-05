curriculum-index-databricks-spark-developer-associate.md
Curriculum Index: Databricks Certified Associate Developer for Apache Spark

Status: LOCKED against the official exam guide PDF ("Databricks Certified
Associate Developer for Apache Spark", the edition whose cover text reads "This
version covers the currently live version as of Oct 30, 2025"), verified 5 Oct
2026 by downloading the PDF from databricks.com and extracting its text
directly. Every objective below is transcribed from that PDF; all 32 objectives
(7/4/10/3/4/2/2 across the seven sections), every exam fact, the seven official
section weights, and all ten sample-question answers (Q1 D / Q2 C / Q3 A / Q4 C
/ Q5 A / Q6 C / Q7 B / Q8 B / Q9 D / Q10 C) are recorded here. This file is the
authoritative source for unit and chapter placement: a later request that
conflicts with it gets flagged with a proposed one-line fix rather than silently
absorbed. Re-verify if Databricks publishes a newer edition (the guide asks
candidates to check back two weeks before the exam).

Exam version: exam guide covering the live exam as of 30 Oct 2025.
Source of truth: the official exam guide PDF, linked from
https://www.databricks.com/learn/certification/apache-spark-developer-associate
(PDF: databricks.com/sites/default/files/2025-10/databricks-certified-associate-developer-apache-spark-exam-guide-oct-2025.pdf)

Exam facts (all confirmed from the PDF unless noted):
    45 scored multiple-choice questions. Unscored questions may also appear;
    they are not identified on the form and do not affect the score, and extra
    time is factored in for them. So 45 is the SCORED count, not the total
    presented.
    Time limit: 90 minutes.
    Registration fee: USD 200 (from the certification web page, not the PDF).
    Delivery: online proctored or test center proctored.
    Test aides: none, including API documentation (the PDF says so explicitly,
    so questions test recall of method names and defaults).
    Prerequisite: none required; related course attendance and six months of
    hands-on Apache Spark experience are highly recommended.
    Validity: 2 years. Recertification requires taking the full live exam again.
    Language of code: ALL code snippets on the exam are Python (PySpark). The
    certification page says so; the PDF's audience line says candidates
    "complete basic Spark DataFrame tasks using Python". Scala appears nowhere
    in this course except as the one-line note that Datasets are a Scala and
    Java concept.
    PASSING SCORE: the PDF publishes NO cut score. Do not state one. Use 70% as
    our own practice target, labelled as our guidance.
    Recommended training: instructor-led "Apache Spark Programming with
    Databricks"; self-paced "Introduction to Apache Spark", "Developing
    Applications with Apache Spark", "Stream Processing and Analysis with
    Apache Spark", "Monitoring and Optimizing Apache Spark Workloads on
    Databricks".

Question format: the PDF says "multiple-choice" and all ten sample questions
are single best answer with four options. No sample is multiple-selection. Our
exams therefore use single best answer throughout; select-two items are NOT
used in this course (unlike Data Analyst Associate, whose guide has a
two-answer sample). Many questions are code-reading: a scenario plus four
code blocks, where distractors are real PySpark methods with the wrong
argument, wrong order, wrong mode, or a method that does not exist. Exam
questions in this course follow that style (see the test authoring guide's
codeblock rules).

Section weights: OFFICIAL, published on the certification page (the PDF lists
the sections without percentages; the page carries the weights). They are used
for mock design and the practice hub bars, labelled "% of exam".

    Section 1  Apache Spark Architecture and Components       7 objectives   20%
    Section 2  Using Spark SQL                                 4 objectives   20%
    Section 3  Developing Apache Spark DataFrame/DataSet API
               Applications                                   10 objectives   30%
    Section 4  Troubleshooting and Tuning Apache Spark
               DataFrame API Applications                      3 objectives   10%
    Section 5  Structured Streaming                            4 objectives   10%
    Section 6  Using Spark Connect to deploy applications      2 objectives    5%
    Section 7  Using Pandas API on Spark                       2 objectives    5%
                                                              32 objectives  100%

32 objectives map onto 45 scored questions, so the real exam asks most
objectives once and the heavy sections' objectives twice. A full mock samples
the sections at the official weights: 9 / 9 / 13 / 5 / 5 / 2 / 2 = 45.

Spark version: the guide names no version. On 30 Oct 2025 the current Apache
Spark release was 4.0 (released 28 May 2025; Databricks Runtime 17.x runs it),
and the objectives name 4.0-era features (Spark Connect, state stores, Pandas
API on Spark). Spark 4.1 shipped in 2026 (4.1.2 on 16 May 2026). Teach Spark
4.0 behaviour as current and mention a 4.1 change only where a name moved; see
the cert config.

Structure: 7 units mirroring the 7 official sections, continuous chapter
numbering 01 to 40. One chapter per objective, except where an objective
bundles two decisions and is split (noted inline). Trade-off lessons are
flagged (TO). Eyebrow label format: "Unit N · Chapter NN".

===============================================================================
Unit 1: Apache Spark Architecture and Components (7 objectives, 20%)
===============================================================================

Official objectives, mapped to chapters:

    Identify the advantages and challenges of implementing Spark ........... Ch 01
    Identify the role of core components of Apache Spark's Architecture,
      including cluster, driver node, worker nodes/executors, CPU cores,
      and memory ........................................................... Ch 02
    Describe the architecture of Apache Spark, including DataFrame and
      Dataset concepts, SparkSession lifecycle, caching, storage levels,
      and garbage collection ..................................... Ch 03, 04, 05
    Explain the Apache Spark Architecture execution hierarchy .............. Ch 06
    Configure Spark partitioning in distributed data processing,
      including shuffles and partitions .................................... Ch 07
    Describe the execution patterns of the Apache Spark engine,
      including actions, transformations, and lazy evaluation ............. Ch 08
    Identify the features of the Apache Spark Modules, including Core,
      Spark SQL, DataFrames, Pandas API on Spark, Structured Streaming,
      and MLlib ............................................................ Ch 09

Chapters:

    Ch 01  Why Spark: advantages and challenges
           Unit 1 · Chapter 01. In-memory distributed processing, one engine
           for batch, SQL, streaming and ML, scaling out versus the costs:
           cluster overhead for small data, shuffle cost, JVM tuning, the
           learning curve of lazy evaluation. Objective 1.1.
    Ch 02  Cluster anatomy: driver, executors, cores and memory
           Unit 1 · Chapter 02. The driver (SparkSession, DAG scheduler, task
           scheduler), the cluster manager, worker nodes hosting executors,
           executor cores as task slots, executor memory and its regions.
           Objective 1.2.
    Ch 03  DataFrames, Datasets and the SparkSession lifecycle
           Unit 1 · Chapter 03. DataFrame as a distributed table with a schema,
           Dataset as the typed Scala/Java form (Python has only DataFrame,
           a Dataset of Row), SparkSession.builder.getOrCreate(), one session
           per application, spark.stop(). Objective 1.3, first part.
    Ch 04  Caching and storage levels (TO)
           Unit 1 · Chapter 04. cache() versus persist(StorageLevel), the
           level grid (MEMORY_ONLY, MEMORY_AND_DISK, DISK_ONLY, serialized
           and replicated forms), when caching pays and when it hurts,
           unpersist(). Objective 1.3, second part.
    Ch 05  Executor memory and garbage collection
           Unit 1 · Chapter 05. Unified memory (execution versus storage),
           on-heap versus off-heap, why long GC pauses appear in the Spark UI,
           symptoms of GC pressure, the levers (fewer cached objects, memory
           fraction, executor sizing). Objective 1.3, third part.
    Ch 06  The execution hierarchy: application, job, stage, task
           Unit 1 · Chapter 06. One action = one job, stages split at shuffle
           boundaries, one task per partition, how the Spark UI shows the
           tree. Objective 1.4.
    Ch 07  Partitions and shuffles
           Unit 1 · Chapter 07. What a partition is, input partitions from
           files, spark.sql.shuffle.partitions (200 by default, sample Q5),
           narrow versus wide transformations, what a shuffle moves and why
           it costs. Objective 1.5.
    Ch 08  Transformations, actions and lazy evaluation
           Unit 1 · Chapter 08. Transformations build a plan, actions run it
           (show, count, collect, write), why nothing happens until an action,
           the logical plan to physical plan path, explain(). Objective 1.6.
    Ch 09  The Spark modules
           Unit 1 · Chapter 09. Spark Core and RDDs, Spark SQL and DataFrames,
           Pandas API on Spark, Structured Streaming, MLlib: what each is for
           and which API a given task should use. Objective 1.7.

===============================================================================
Unit 2: Using Spark SQL (4 objectives, 20%)
===============================================================================

Official objectives, mapped to chapters:

    Utilize common data sources such as JDBC, files, etc., to efficiently
      read from and write to Spark DataFrames using Spark SQL, including
      overwriting and partitioning by column ............................ Ch 10, 11
    Execute SQL queries directly on files, including ORC Files, JSON
      Files, CSV Files, Text Files, and Delta Files, and understand the
      different save modes for outputting data in Spark SQL ............. Ch 12, 13
    Save data to persistent tables while applying sorting and
      partitioning to optimize data retrieval ............................... Ch 14
    Register DataFrames as temporary views in Spark SQL, allowing them
      to be queried with SQL syntax ......................................... Ch 15

Chapters:

    Ch 10  Reading data sources: files and JDBC
           Unit 2 · Chapter 10. spark.read.format(...).option(...).load(),
           the format shortcuts (csv, json, parquet, orc, text, delta), header
           and inferSchema options, JDBC reads with url, dbtable, user and
           password, and partitioned JDBC reads. Objective 2.1, read side.
    Ch 11  Writing: partitionBy and overwrite
           Unit 2 · Chapter 11. df.write.mode("overwrite").partitionBy(
           "country").parquet(path) (sample Q1), the partition directory
           layout, when partitionBy helps reads and when it creates small
           files, JDBC writes. Objective 2.1, write side.
    Ch 12  Querying files directly with SQL
           Unit 2 · Chapter 12. SELECT * FROM parquet.`/path`, the same for
           csv, json, orc, text and delta, when a direct file query beats
           creating a table, and its limits (no schema options). Objective
           2.2, first part.
    Ch 13  Save modes (TO)
           Unit 2 · Chapter 13. append, overwrite, ignore and errorifexists
           (the default), what each does when the target exists, the
           partition-overwrite distinction, choosing by idempotence
           requirement. Objective 2.2, second part.
    Ch 14  Persistent tables: saveAsTable, partitioning, bucketing and sorting
           Unit 2 · Chapter 14. saveAsTable versus save-to-path, managed
           versus external tables, partitionBy, bucketBy and sortBy on a
           persistent table, how each speeds a later read. Objective 2.3.
    Ch 15  Temporary and global temporary views
           Unit 2 · Chapter 15. createOrReplaceTempView, session scope,
           createGlobalTempView and the global_temp database, spark.sql()
           against a view, when a view beats a table. Objective 2.4.

===============================================================================
Unit 3: Developing Apache Spark DataFrame/DataSet API Applications
        (10 objectives, 30%)
===============================================================================

Official objectives, mapped to chapters:

    Manipulate columns, rows, and table structures by adding, dropping,
      splitting, renaming column names, applying filters, and exploding
      arrays ............................................................ Ch 16, 17
    Perform data deduplication and validation operations on DataFrames .... Ch 18
    Perform aggregate operations on DataFrames such as count, approximate
      count distinct, and mean, summary ..................................... Ch 19
    Manipulate and utilize Date data type, such as Unix epoch to date
      string, and extract date component .................................... Ch 20
    Combine DataFrames with operations such as Inner join, left join,
      broadcast join, multiple keys, cross join, union, and union all ... Ch 21, 22
    Manage input and output operations by writing, overwriting, and
      reading DataFrames with schemas ....................................... Ch 23
    Perform operations on DataFrames such as sorting, iterating, printing
      schema, and conversion between DataFrame and sequence/list formats .. Ch 24
    Create and invoke user-defined functions with or without stateful
      operators, including StateStores .................................. Ch 25, 26
    Describe different types of variables in Spark, including broadcast
      variables and accumulators ............................................ Ch 27
    Describe the purpose and implementation of broadcast joins ............. Ch 28

Chapters:

    Ch 16  Columns: select, withColumn, withColumnRenamed, drop
           Unit 3 · Chapter 16. col() and expr(), adding a derived column,
           renaming (sample Q3), dropping, withColumns for several at once,
           lit() for constants, cast(). Objective 3.1, column side.
    Ch 17  Rows: filter, split and explode
           Unit 3 · Chapter 17. filter and where with column expressions and
           SQL strings, split() a string column into an array, explode() and
           explode_outer() one row per element, posexplode. Objective 3.1,
           row side.
    Ch 18  Deduplication and missing data
           Unit 3 · Chapter 18. distinct(), dropDuplicates(subset),
           na.drop(how, thresh, subset) and dropna (sample Q6), na.fill and
           na.replace, isNull / isNotNull checks as validation. Objective 3.2.
    Ch 19  Aggregations: groupBy, agg, approx_count_distinct and summary
           Unit 3 · Chapter 19. count, countDistinct, approx_count_distinct
           and its HyperLogLog trade (sample Q10), mean / avg, min, max, sum,
           describe() versus summary(), agg with several functions.
           Objective 3.3.
    Ch 20  Dates and timestamps
           Unit 3 · Chapter 20. Unix epoch to timestamp and date string
           (from_unixtime, timestamp_seconds, date_format), to_date and
           to_timestamp with patterns, year / month / dayofweek extraction,
           date arithmetic (date_add, datediff, months_between). Objective 3.4.
    Ch 21  Joins: inner, left, multiple keys and cross
           Unit 3 · Chapter 21. join(other, on, how) with a column name, a
           list of names, or an expression, the how strings (inner, left,
           right, full, left_semi, left_anti), crossJoin, duplicate-column
           pitfalls after a join. Objective 3.5, join side. Broadcast joins
           are Ch 28.
    Ch 22  Unions: union, unionAll and unionByName
           Unit 3 · Chapter 22. union is by position and keeps duplicates,
           unionAll is the same (kept as an alias), unionByName matches on
           names with allowMissingColumns, distinct() after a union for set
           semantics. Objective 3.5, union side.
    Ch 23  Reading with explicit schemas
           Unit 3 · Chapter 23. StructType and StructField, DDL schema
           strings, schema(...) on the reader versus inferSchema, why an
           explicit schema is faster and safer, round-tripping a schema
           between write and read. Objective 3.6 (the write and overwrite
           half is Ch 11; this chapter owns the schema half).
    Ch 24  Sorting, iterating and converting
           Unit 3 · Chapter 24. sort / orderBy with asc and desc (sample Q4),
           printSchema versus schema, collect() to a list of Row, Row.asDict,
           toLocalIterator, toPandas, take and first and head. Objective 3.7.
    Ch 25  Python UDFs
           Unit 3 · Chapter 25. udf() with a return type, the decorator form,
           spark.udf.register for SQL, why built-in functions beat a
           row-at-a-time UDF, when a UDF is still the right call (sample Q9,
           stateless logic). Objective 3.8, stateless side.
    Ch 26  Stateful operators and state stores
           Unit 3 · Chapter 26. What a state store is, keyed state across
           micro-batches, transformWithStateInPandas (ValueState, ListState,
           timers) as the current arbitrary stateful API, when stateless
           UDF logic is enough instead (sample Q9). Objective 3.8, stateful
           side; pairs with Unit 5.
    Ch 27  Broadcast variables and accumulators
           Unit 3 · Chapter 27. sc.broadcast(value) for read-only lookup data
           shipped once per executor, .value, accumulators for counters
           updated by tasks and read on the driver, the task-retry caveat.
           Objective 3.9.
    Ch 28  Broadcast joins (TO)
           Unit 3 · Chapter 28. Broadcast hash join versus sort-merge join,
           broadcast() hint, spark.sql.autoBroadcastJoinThreshold (10 MB
           default), AQE's runtime switch, when a broadcast blows up the
           driver. Objective 3.10.

===============================================================================
Unit 4: Troubleshooting and Tuning Apache Spark DataFrame API Applications
        (3 objectives, 10%)
===============================================================================

Official objectives, mapped to chapters:

    Implement performance tuning strategies & optimize cluster
      utilization, including partitioning, repartitioning, coalescing,
      identifying data skew, and reducing shuffling ..................... Ch 29, 30
    Describe Adaptive Query Execution (AQE) and its benefits ............... Ch 31
    Perform logging and monitoring of Spark applications - publish,
      customize, and analyze Driver logs and Executor logs to diagnose
      out-of-memory errors, cluster underutilization, etc. ................. Ch 32

Chapters:

    Ch 29  repartition versus coalesce (TO)
           Unit 4 · Chapter 29. repartition(n) and repartition(col) shuffle
           to rebalance or raise the count, coalesce(n) merges without a
           shuffle and can only reduce, partition count versus core count
           for utilization, small-files on write. Objective 4.1, first part.
    Ch 30  Data skew and reducing shuffles
           Unit 4 · Chapter 30. Spotting skew in the Spark UI (one long
           task), salting keys, broadcasting the small side, AQE skew join,
           filtering and projecting before a shuffle, avoiding repeated
           shuffles with caching. Objective 4.1, second part.
    Ch 31  Adaptive Query Execution
           Unit 4 · Chapter 31. spark.sql.adaptive.enabled, coalescing
           shuffle partitions at runtime, switching to a broadcast join
           when a side turns out small, skew join handling, what AQE cannot
           fix. Objective 4.2.
    Ch 32  Logs and the Spark UI: diagnosing OOM and underutilization
           Unit 4 · Chapter 32. Driver logs versus executor logs and where
           each lives, the Spark UI tabs (Jobs, Stages, Storage, Executors,
           SQL), reading an executor log for OOM (sample Q2), spotting idle
           executors, log4j customization. Objective 4.3.

===============================================================================
Unit 5: Structured Streaming (4 objectives, 10%)
===============================================================================

Official objectives, mapped to chapters:

    Explain the Structured Streaming engine in Spark, including its
      functions, programming model, micro-batch processing, exactly-once
      semantics, and fault tolerance mechanisms ............................. Ch 33
    Create and write Streaming DataFrames and Streaming Datasets,
      including the basic output modes and output sinks ..................... Ch 34
    Perform basic operations on Streaming DataFrames and Streaming
      Datasets, such as selection, projection, window and aggregation ....... Ch 35
    Perform Streaming Deduplication in Structured Streaming, both with
      and without watermark usage ........................................... Ch 36

Chapters:

    Ch 33  The Structured Streaming model
           Unit 5 · Chapter 33. The unbounded-table model, micro-batch
           processing and triggers, checkpoints and write-ahead logs,
           replayable sources plus idempotent sinks for exactly-once, why a
           stream beats rerunning a batch (sample Q8). Objective 5.1.
    Ch 34  readStream, writeStream, output modes and sinks (TO)
           Unit 5 · Chapter 34. spark.readStream on files, Kafka and rate,
           writeStream.format / outputMode / option("checkpointLocation") /
           trigger / start, append versus update versus complete, file,
           Kafka, console, memory and foreachBatch sinks. Objective 5.2.
    Ch 35  Streaming operations: select, filter, window and aggregation
           Unit 5 · Chapter 35. Stateless operations that work unchanged,
           window(col, "10 minutes") tumbling and sliding windows,
           groupBy on an event-time window, withWatermark to bound state,
           which operations are unsupported on a stream. Objective 5.3.
    Ch 36  Streaming deduplication
           Unit 5 · Chapter 36. dropDuplicates on a stream keeps all keys
           in state forever, dropDuplicates with withWatermark to expire
           state, dropDuplicatesWithinWatermark for late duplicates,
           choosing by how long duplicates can arrive apart. Objective 5.4.

===============================================================================
Unit 6: Using Spark Connect to deploy applications (2 objectives, 5%)
===============================================================================

Official objectives, mapped to chapters:

    Describe the features of Spark Connect ................................. Ch 37
    Describe the different deployment mode types (Client, Cluster, Local)
      in the Apache Spark environment ....................................... Ch 38

Chapters:

    Ch 37  Spark Connect
           Unit 6 · Chapter 37. The decoupled client-server architecture over
           gRPC, unresolved logical plans sent to the server, the thin
           pyspark-client, SparkSession.builder.remote("sc://host"),
           spark.api.mode, benefits (stability, upgrades, any language or
           IDE) and what the client cannot do (RDD and SparkContext APIs).
           Objective 6.1.
    Ch 38  Deployment modes: local, client, cluster (TO)
           Unit 6 · Chapter 38. Local mode runs driver and executors in one
           JVM on one machine (sample Q7), client mode keeps the driver on
           the submitting machine, cluster mode puts the driver on a worker,
           spark-submit --deploy-mode, choosing by where the driver should
           live. Objective 6.2.

===============================================================================
Unit 7: Using Pandas API on Spark (2 objectives, 5%)
===============================================================================

Official objectives, mapped to chapters:

    Explain the advantages of using Pandas API on Spark .................... Ch 39
    Create and invoke Pandas UDF ........................................... Ch 40

Chapters:

    Ch 39  Pandas API on Spark
           Unit 7 · Chapter 39. import pyspark.pandas as ps, pandas syntax
           running distributed, converting with to_spark and
           pandas_api, the index and ordering cost, when to use it over the
           DataFrame API and over plain pandas. Objective 7.1.
    Ch 40  Pandas UDFs
           Unit 7 · Chapter 40. @pandas_udf with a return type, Series to
           Series, Iterator forms, applyInPandas for grouped map, the Arrow
           batch transfer that makes them faster than row-at-a-time UDFs.
           Objective 7.2. Last chapter: NAV next is null.

===============================================================================
Exam design
===============================================================================

    Question style: scenario-based, single best answer, 4 options, plausible
    distractors, one question per chapter in scope, 2 minutes per question.
    No select-two items in this course (the guide and all ten samples are
    single answer). Code-reading questions follow the official sample style:
    four PySpark snippets where the wrong ones use a real method with the
    wrong argument, order, or mode, or a method that does not exist.
    Pass bar: 70% as our practice target (no official cut score; say so).
    File prefix: spark-practice-exam-NN.html in
    databricks-apache-spark-developer-associate/.

    Section exams (wired as unit tests on the course home):
        Exam 1: Unit 1, chapters 01-09 (9 questions, 18 min)
        Exam 2: Units 2-3, chapters 10-28 (19 questions, 38 min)
        Exam 3: Units 4-7, chapters 29-40 (12 questions, 24 min)
    Full-length mocks (45 questions, 90 minutes, sampled at the official
    section weights 9 / 9 / 13 / 5 / 5 / 2 / 2, new scenarios each, listed in
    the course home's "Full-length mock exams" section):
        Exam 4, Exam 5, Exam 6
    The practice hub (practice/databricks-spark-associate.html) drills from
    exams 1-3 tagged by chapter and uses 4-6 as its mock pool; it has no
    /ready diagnostic, so its readiness check draws from the section exams.
    Its seven bars carry the official weights, so they read "% of exam".
