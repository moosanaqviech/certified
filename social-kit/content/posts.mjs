// Certify social kit — content.
// A post is data: an ordered list of slides (each names a layout + its copy),
// plus platform captions and hashtags. Nothing here is CSS or geometry.

export const posts = [
  // ---- POST 16 ----
  {
    slug: 'job-failed-which-log',
    format: 'carousel',
    source: 'Databricks DE Professional, Unit 9, Ch 32, obj 9.1 and 9.3',
    slides: [
      { layout: 'hook', lines: ['Your job failed.', 'Which log', 'do you open?'] },
      {
        layout: 'value',
        eyebrow: 'THE WRONG MOVE',
        headlineLines: ['Opening everything'],
        bodyLines: [
          'Driver logs, event log, Spark UI,',
          'system tables. Four sources, one failure.',
        ],
      },
      {
        layout: 'value',
        eyebrow: 'MATCH SOURCE TO SYMPTOM',
        headlineLines: ['Read the symptom first'],
        bodyLines: [
          'Exception thrown: driver logs.',
          'Task skipped or never ran: event log.',
          'Slow, not broken: Spark UI stages.',
        ],
      },
      {
        layout: 'value',
        eyebrow: 'THE ONE PEOPLE MISS',
        headlineLines: ['System tables'],
        goldHeadline: true,
        bodyLines: [
          'Failure patterns across runs and jobs',
          'live here, not in any single run of logs.',
        ],
      },
      { layout: 'cta', lines: ['A symptom.', 'Then the source.'], url: 'certify.courses' },
    ],
    captionIg:
`A failed job is a diagnosis question, and the exam writes it exactly that way: here is the symptom, pick the source you check first.

The mapping is smaller than it looks. Exceptions and stack traces live in the driver logs. Orchestration problems (a task skipped, a dependency never satisfied) live in the event log. Performance problems that finish eventually belong to the Spark UI. And anything that spans runs, jobs, or days belongs to system tables, which the current exam guide now names directly as a diagnostic source.

Most people lose time by opening the Spark UI for everything. It answers "why is this slow", not "why did this die".

Chapter 32 of our DE Professional course walks the full decision path with scenarios. certify.courses`,
    hashtags:
'#databricks #dataengineering #databrickscertification #dataengineer #sparksql #apachespark #certificationprep #dataengineercertification #deltalake #databricksdeprofessional #techcertification #studytips #dataplatform',
    captionFb:
`A failed job is a diagnosis question. Exceptions: driver logs. Orchestration: event log. Slowness: Spark UI. Patterns across runs: system tables, now named directly in the exam guide. Chapter 32 of the DE Professional course covers the full decision path: https://certify.courses`,
  },

  // ---- POST 17 ----
  {
    slug: 'kinesis-or-msk',
    format: 'carousel',
    source: 'AWS DEA-C01 official exam guide, ingestion domain',
    slides: [
      { layout: 'hook', lines: ['Kinesis', 'or MSK?'] },
      {
        layout: 'tension',
        lines: ['The question is', 'never about features.'],
      },
      {
        layout: 'value',
        eyebrow: 'READ FOR THIS SIGNAL',
        headlineLines: ['Existing Kafka'],
        bodyLines: [
          'Kafka producers, consumers, or connectors',
          ['already in play: the answer is ', { t: 'MSK', gold: true }, '.'],
        ],
      },
      {
        layout: 'value',
        eyebrow: 'AND THIS ONE',
        headlineLines: ['Least operations'],
        bodyLines: [
          'Serverless, minimal management,',
          'native AWS integration: Kinesis.',
        ],
      },
      { layout: 'cta', lines: ['Read the scenario.', 'We teach the signal.'], url: 'certify.courses' },
    ],
    captionIg:
`Kinesis or MSK is the classic DEA-C01 trap, because reading the feature tables gets you nowhere. Both are streaming. Both are managed. Both scale.

The exam decides it with one or two words buried in the scenario. "The team runs existing Kafka applications" or "must remain compatible with open-source Kafka tooling": that is MSK, full stop. "Minimal operational overhead" or "serverless" with native handoffs to Lambda, Firehose, or Data Streams consumers: that is Kinesis.

If the scenario mentions neither, look at who does the work. MSK gives you Kafka's control and asks for Kafka's care. Kinesis gives you less to configure and less to tune.

Our DEA-C01 ingestion unit builds this reasoning question by question, sourced from the official exam guide. certify.courses`,
    hashtags:
'#awscertification #dataengineering #deac01 #awsdataengineer #kinesis #apachekafka #msk #awscertified #dataengineer #certificationprep #cloudcomputing #awscommunity #streamingdata #techcertification',
    captionFb:
`Kinesis or MSK? The exam decides it with one phrase in the scenario. Existing Kafka apps or open-source compatibility: MSK. Serverless and minimal ops: Kinesis. Our DEA-C01 course teaches the signal, not the feature table: https://certify.courses`,
  },

  // ---- POST 18 ----
  {
    slug: 'deletion-vectors-rewrite',
    format: 'single',
    source: 'Databricks DE Professional, Unit 6, Ch 22, obj 6.2',
    slides: [
      {
        layout: 'single',
        eyebrow: 'DELTA LAKE INTERNALS',
        headlineLines: ['Deletion vectors', 'changed what a', 'rewrite means.'],
        bodyLines: [
          'Delete a row without them: the whole',
          ['file is rewritten. With them: the row is ', { t: 'marked', em: true }, ','],
          'and the data file survives untouched.',
        ],
      },
    ],
    captionIg:
`Before deletion vectors, a single-row DELETE was expensive in a way that surprised people. Delta could not edit a Parquet file in place, so it rewrote every file containing an affected row. Copy-on-write: one row changes, the whole file is copied.

Deletion vectors flip the model. The row is marked as deleted in a small sidecar file, readers skip it, and the original data file stays untouched. Merge-on-read: the cost moves from write time to read time, and the actual rewrite is deferred until you run OPTIMIZE or purge.

Why the exam cares: it changes how you reason about DML cost, about file sizes after deletes, and about what VACUUM can and cannot remove. If your mental model is still "delete means rewrite", a handful of Unit 6 questions will read as trick questions. They are not.

Chapter 22 of our DE Professional course builds the full picture. certify.courses`,
    hashtags:
'#databricks #deltalake #dataengineering #databrickscertification #dataengineer #apachespark #lakehouse #certificationprep #databricksdeprofessional #dataengineercertification #techcertification #bigdata #studysmart',
    captionFb:
`Deletion vectors changed what a rewrite means in Delta Lake. Delete a row without them and the whole Parquet file is rewritten. With them, the row is marked in a sidecar and the rewrite is deferred to OPTIMIZE. Chapter 22, DE Professional: https://certify.courses`,
  },

  // ---- POST 19 ----
  {
    slug: 'learn-recall-reason',
    format: 'carousel',
    source: 'Platform pedagogy: the Learn, Recall, Reason loop',
    slides: [
      { layout: 'hook', lines: ['You read', 'the lesson.', 'Will you', 'remember?'] },
      {
        layout: 'tension',
        lines: ['Reading feels', 'like studying.'],
      },
      {
        layout: 'value-shot',
        eyebrow: 'LEARN',
        headlineLines: ['One concept, one diagram'],
        shot: { src: 'assets/lesson-learn.png' },
        callout: { nx: 0.13, ny: 0.26, nw: 0.74, nh: 0.41, label: 'tap to build the diagram' },
        caption: 'A real lesson, built from official docs.',
      },
      {
        layout: 'value-shot',
        eyebrow: 'RECALL, THEN REASON',
        headlineLines: ['A quiz closes every lesson'],
        shot: { src: 'assets/lesson-recall.png' },
        caption: 'Then scenario questions make you reason.',
      },
      { layout: 'cta', lines: ['Learn. Recall.', 'Reason.'], url: 'certify.courses' },
    ],
    captionIg:
`The most common way to fail a certification is to study in a way that feels productive: read the docs, highlight, nod along, move on. Recognition builds fast and decays fast. On exam day you recognize every term in the question and still cannot produce the answer.

That is why every chapter on Certify runs the same loop. Learn: a short visual lesson, one concept at a time, sourced from the official exam guide and vendor docs. Recall: a quiz immediately after, before the forgetting starts. Reason: scenario questions that make you apply the trade-off the way the exam will.

No streaks, no XP, no mascot. You booked an exam. That is motivation enough. The loop just makes the hours count.

Unit 1 of every course is free. certify.courses`,
    hashtags:
'#certificationprep #studytips #dataengineering #databricks #awscertification #activerecall #dataengineer #examprep #databrickscertification #deac01 #techcertification #learningscience #studysmart',
    captionFb:
`Reading feels like studying, but recognition is not recall, and the exam only pays for recall. Every Certify chapter runs the same loop: a two-minute visual lesson, a quiz before the forgetting starts, then scenario questions that make you reason. Unit 1 of every course is free: https://certify.courses`,
  },
];
