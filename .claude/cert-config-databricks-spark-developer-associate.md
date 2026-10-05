cert-config-databricks-spark-developer-associate.md
Cert Config: Databricks Certified Associate Developer for Apache Spark

Per-certification settings so the frozen engine rules stay generic. Pairs with
curriculum-index-databricks-spark-developer-associate.md (the locked chapter
placement).

## Identity

    Badge text: "Databricks Spark Developer Associate"
    Full name (course home title, schema, blog): "Databricks Certified
      Associate Developer for Apache Spark"
    Course folder: databricks-apache-spark-developer-associate/
    Hub slug: databricks-spark-associate (practice/databricks-spark-associate.html,
      localStorage key certify.practice.databricks-spark-associate)
    Completion namespace: done:databricks-spark-associate:
    Catalog id (catalog.json): databricks-spark
    Difficulty: Associate
    Standard blurb: Bite-sized, visual lessons for the Databricks Certified
      Associate Developer for Apache Spark exam, built to teach the judgment
      the test rewards (which method, which mode, which join, which
      partition count), not facts to cram.
    Exam guide version: 30 Oct 2025 (VERIFIED against the official PDF,
      5 Oct 2026; see the curriculum index)
    Questions: 45 scored, multiple choice, single best answer (all ten
      official samples are single answer; no select-two items in this
      course). Unscored items may also appear, unidentified, with extra time
      factored in.
    Time: 90 minutes
    Pace: 2 minutes per question (45 x 2 = 90, the real exam's length)
    Pass threshold: NOT PUBLISHED by Databricks. Never state an official cut
      score. Use 70% as our own practice target, labelled as our guidance.
      Hub pass target: 70.
    Cost: USD 200 (certification web page)
    Delivery: online proctored or test center. Validity 2 years. No test
      aides, including API documentation.
    Code language: Python (PySpark) throughout; the exam says every snippet
      is Python. SQL appears inside spark.sql("...") strings and in Unit 2's
      direct file queries. Scala is never shown; Datasets are mentioned once
      as the Scala and Java typed form.
    Spark version taught: Apache Spark 4.0 (current at the guide date;
      Databricks Runtime 17.x). Spark 4.1 (2026) is mentioned only where a
      name or default moved. Never pin a lesson to a Databricks Runtime
      number as the primary fact; the exam is about Apache Spark.
    Price on this site: $9.99 one-time unlock (course id spark-assoc). Unit 1
      is free through spark-practice-exam-01; Units 2 to 7 and the three
      mocks are gated by netlify/edge-functions/gate.ts. The Stripe Price id
      lives in the STRIPE_PRICE_SPARK_ASSOC env var on Netlify.

## File naming

    Lessons: lesson-NN-name.html, numbered 01-40 per the locked curriculum
      index, built on lesson-template-v2.html (NAV, step builds, animated
      cover).
    Practice exams: spark-practice-exam-NN.html (slug prefix, per the
      convention that only the first course keeps the bare
      practice-exam-NN.html; DE Professional uses pro-, ML uses ml-, GenAI
      uses genai-, Data Analyst uses da-, AWS uses aws- and mla-c02-).
      01-03 are section exams, 04-06 are full mocks.
    All Spark Developer Associate files live in
      databricks-apache-spark-developer-associate/.

## Terminology rules

The exam tests the names in the 30 Oct 2025 exam guide, which match the
Apache Spark 4.0 docs. Verified 5 Oct 2026 against databricks.com (the Spark
4.0 announcement and the stateful-applications docs).

    Product: "Apache Spark" on first mention in a lesson, then "Spark". Never
      the trademark symbol in lesson or exam text (the guide's "Apache
      Spark™" is a legal form, not a name).
    Entry point: "SparkSession" (variable spark). "SparkContext" (variable
      sc, reached as spark.sparkContext) appears only for RDD-level features
      the guide names: broadcast variables and accumulators. Never teach
      SQLContext or HiveContext.
    DataFrame: "DataFrame" in Python. "Dataset" is the typed Scala and Java
      form; say once (Ch 03) that a Python DataFrame is a Dataset of Row and
      do not use "Dataset" for Python code afterwards. The guide's section
      title "DataFrame/DataSet API" is reproduced verbatim only where the
      official section name is quoted.
    Modules: "Spark Core", "Spark SQL", "Structured Streaming", "MLlib" (the
      guide's "MLib" is a typo; always write MLlib), "Pandas API on Spark"
      (never "Koalas", its pre-3.2 name; the import is pyspark.pandas as
      ps). "Spark Connect" (two words, capitalized).
    Streaming: "Structured Streaming" and "streaming DataFrame". "DStreams"
      (the legacy RDD streaming API) may appear once as a contrast and must
      be called deprecated. "micro-batch", "trigger", "checkpoint location",
      "watermark", "output mode" (append, update, complete), "sink".
    Stateful: "state store" (two words) for the keyed state kept between
      micro-batches; "RocksDB state store provider" where a provider is
      named. "transformWithStateInPandas" is the current arbitrary stateful
      API in Python (Spark 4.0; its Scala form is transformWithState), with
      "ValueState", "ListState", "MapState" and timers. The older
      "applyInPandasWithState" is the contrast case only. Never
      "mapGroupsWithState" in a Python lesson (Scala only).
    Deduplication: "dropDuplicates" and "dropDuplicatesWithinWatermark"
      (exact method names, camelCase).
    UDFs: "Python UDF" or "user-defined function (UDF)" for the
      row-at-a-time form (pyspark.sql.functions.udf); "Pandas UDF" for the
      vectorized form (pandas_udf), matching the guide's capitalization.
      "Arrow" for the transfer format. Say "applyInPandas" for grouped map.
    Unions: "union" (by position, keeps duplicates), "unionAll" (an alias
      for union, kept for compatibility, not deprecated-and-removed),
      "unionByName". Never describe union as removing duplicates.
    Save modes: the string values "append", "overwrite", "ignore",
      "errorifexists" (default; "error" is the same mode). Write them as
      the lowercase strings passed to .mode().
    Joins: the how strings as Spark spells them: "inner", "left" (same as
      "left_outer"), "right", "full" (same as "outer"), "left_semi",
      "left_anti", "cross" via crossJoin. "broadcast hash join" and
      "sort-merge join" for the physical strategies; "broadcast() hint" and
      "spark.sql.autoBroadcastJoinThreshold" (10 MB default).
    Partitioning: "partition" for a DataFrame slice, "partitionBy" for the
      writer's directory layout, "repartition" and "coalesce" as methods,
      "spark.sql.shuffle.partitions" (default 200). "narrow" and "wide"
      transformations. "shuffle" as the noun.
    Tuning: "Adaptive Query Execution (AQE)" on first mention, then "AQE";
      "data skew"; "salting". "Spark UI" (never "Spark Web UI" or "History
      Server" except when the history server is the subject).
    Memory: "unified memory", "execution memory", "storage memory",
      "on-heap" and "off-heap", "garbage collection (GC)".
    Storage levels: the constant names as written: MEMORY_ONLY,
      MEMORY_AND_DISK (the DataFrame default for cache()), DISK_ONLY,
      MEMORY_ONLY_SER (JVM only; Python always serializes), the _2 replicated
      forms.
    Deployment: "local mode", "client mode", "cluster mode"; "spark-submit"
      with "--deploy-mode" and "--master". "cluster manager" (Standalone,
      YARN, Kubernetes; Mesos is removed in Spark 4.0 and must not appear).
    Spark Connect: "Spark Connect server", "Spark Connect client",
      "pyspark-client" for the thin package, "sc://" for the remote URL,
      "spark.api.mode" (classic or connect, Spark 4.0), "unresolved logical
      plan" for what the client sends.
    Files and formats: "Parquet", "ORC", "JSON", "CSV", "text", "Delta Lake"
      (format string "delta"). "JDBC" for database sources.
    Views: "temporary view" (createOrReplaceTempView) and "global temporary
      view" (createGlobalTempView, in the global_temp database). Never
      "registerTempTable" (removed).
    Repo-wide: say "Lakeflow Spark Declarative Pipelines", never "Delta Live
      Tables" or "DLT", on the rare occasion pipelines come up; say "Lakeflow
      Jobs" for orchestration. Liquid Clustering is the recommended Delta
      layout; partitioning and Z-Order are the contrast case.
    Spark 4.0 defaults worth a one-line note where relevant: ANSI SQL mode
      is on by default (casts and arithmetic raise errors instead of
      returning null), and VARIANT exists for semi-structured data. Neither
      is an objective; mention only where a chapter's example would behave
      differently.

## Recommended-vs-contrast stances

    API: the DataFrame API and Spark SQL recommended; RDDs are the contrast
      (shown only for broadcast variables and accumulators, which live on
      SparkContext).
    Functions: built-in pyspark.sql.functions recommended; a Python UDF only
      when no built-in exists; a Pandas UDF over a row-at-a-time UDF when a
      UDF is unavoidable.
    Schemas: an explicit schema on read recommended; inferSchema is the
      contrast (an extra pass over the data, type drift).
    Joins: let AQE and the broadcast threshold pick; a broadcast() hint
      when the small side is known; sort-merge join as the default for two
      large sides.
    Partition count: coalesce to reduce, repartition to increase or
      rebalance; never coalesce(1) on large data except for a deliberate
      single output file.
    Caching: cache only a DataFrame reused by several actions; unpersist
      when done; the default MEMORY_AND_DISK level unless there is a reason.
    Tuning: AQE on (the default) recommended; manual
      spark.sql.shuffle.partitions tuning is the contrast case, mentioned
      because the exam asks what the setting does.
    Streaming: Structured Streaming recommended; DStreams deprecated
      contrast. Checkpoint location always set. Watermarks on any stateful
      operation so state is bounded.
    Stateful: transformWithStateInPandas recommended for custom state;
      applyInPandasWithState is the previous API, contrast only.
    Deduplication on streams: dropDuplicates with a watermark (or
      dropDuplicatesWithinWatermark) recommended; dropDuplicates with no
      watermark is the contrast (unbounded state).
    Deployment: cluster mode for production jobs, client mode for
      interactive work, local mode for development and tests.
    Spark Connect: recommended as the client architecture for applications
      and IDEs; classic mode is the contrast, needed only for RDD and
      SparkContext APIs.
    Pandas: Pandas API on Spark when a pandas user needs scale; the
      DataFrame API when writing Spark-native code; plain pandas only for
      data that fits on the driver.
    Tables: saveAsTable (managed) recommended when other sessions or SQL
      users need the data; a temporary view for session-scoped reuse; a
      path write for data another system owns.

## Palette registry

The course home keeps the shared gold home theme, like every other course home;
gold stays reserved for exams and course homes product-wide. The accents below
are per-UNIT lesson palettes, assigned semantically and checked on 5 Oct 2026
against every --accent value shipped in any lesson site-wide (none of the seven
is in use). Collision-check each one against the specific neighboring lessons
at the moment its first lesson is written and record the final --accent hex in
each lesson as it ships. Trade-off lessons use the same unit accent as their
siblings; the (TO) structure, not a distinct color, marks them.

    Unit 1  Architecture        Spark ember    #ff6f1f   the Spark logo's
                                                          orange, the engine
    Unit 2  Spark SQL           sky            #7dd3fc   files, tables, SQL
    Unit 3  DataFrame API       mint           #6ee7b7   building, the bulk
                                                          of the course
    Unit 4  Tuning              amber          #ffb703   dials, warnings
    Unit 5  Structured Streaming aqua          #67e8f9   flowing water
    Unit 6  Spark Connect       lavender       #c4b5fd   links, remote
    Unit 7  Pandas API          blush          #f9a8d4   pandas, friendly

    Nearby accents to keep distance from when deriving --accent-ink and
    --bg-tint: #f97316 and #fb923c (AWS oranges) near Unit 1, #22d3ee and
    #31c8e8 (DE cyan lessons) near Unit 5, #c9a0ff and #a78bfa (DE violets)
    near Unit 6, #fda4af (a DE rose) near Unit 7.

## Source rules (reminder)

Every card and question traces to official sources only: the Apache Spark
documentation (spark.apache.org, including the PySpark API reference and the
Structured Streaming programming guide), docs.databricks.com where the guide
names a Databricks-hosted feature, and the official exam guide for scope. The
ten official sample questions set the question style but are never reused.
No third-party study guides as factual sources, no braindump content. Method
signatures, defaults (200 shuffle partitions, 10 MB broadcast threshold,
MEMORY_AND_DISK) and mode strings must be confirmed against the current
PySpark reference at authoring time, since the exam allows no documentation.
