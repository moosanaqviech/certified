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
`The most common way to fail a certification is to study for the feeling of productivity: read the docs, highlight, nod along, move on. Recognition builds fast and decays fast. On exam day you recognize every term in the question and still cannot produce the answer.

That is why every chapter on Certify runs the same loop. Learn: a short visual lesson, one concept at a time, sourced from the official exam guide and vendor docs. Recall: a quiz immediately after, before the forgetting starts. Reason: scenario questions that make you apply the trade-off exactly as the exam will.

No streaks, no XP, no mascot. You booked an exam. That is motivation enough. The loop just makes the hours count.

Unit 1 of every course is free. certify.courses`,
    hashtags:
'#certificationprep #studytips #dataengineering #databricks #awscertification #activerecall #dataengineer #examprep #databrickscertification #deac01 #techcertification #learningscience #studysmart',
    captionFb:
`Reading feels like studying, but recognition is not recall, and the exam only pays for recall. Every Certify chapter runs the same loop: a two-minute visual lesson, a quiz before the forgetting starts, then scenario questions that make you reason. Unit 1 of every course is free: https://certify.courses`,
  },

  // ---- POST 20 ----
  {
    slug: 'stride-sets-the-bill',
    format: 'carousel',
    source: 'Databricks GenAI Engineer Associate, Unit 2, Ch 11, guide sample question 1',
    slides: [
      { layout: 'hook', lines: ['100,000 tokens.', 'How many', 'chunks?'] },
      {
        layout: 'tension',
        lines: ['Chunk size alone', 'cannot tell you.'],
      },
      {
        layout: 'value',
        eyebrow: 'THE FORMULA',
        headlineLines: ['Stride sets the count'],
        bodyLines: [
          'A new chunk starts every',
          ['(size minus overlap) tokens: the ', { t: 'stride', gold: true }, '.'],
          'The chunk count is your embedding bill.',
        ],
      },
      {
        layout: 'value',
        eyebrow: 'RUN THE NUMBERS',
        headlineLines: ['One corpus, three ways'],
        bodyLines: [
          'Size 250, overlap 50: 500 chunks.',
          'Size 500, overlap 50: 222 chunks.',
          'Size 500, overlap 0: 200 chunks.',
        ],
      },
      {
        layout: 'value',
        eyebrow: 'WHY IT MATTERS',
        headlineLines: ['Official sample question 1'],
        goldHeadline: true,
        bodyLines: [
          'To cut embedding cost, raise chunk size',
          'AND reduce overlap. Both stretch the stride.',
        ],
      },
      { layout: 'cta', lines: ['Count strides,', 'not chunks.'], url: 'certify.courses' },
    ],
    captionIg:
`The first sample question in the official GenAI Engineer Associate guide is a cost question in disguise: your embedding bill is too high, what do you change about chunking?

Most people reason about chunk size alone, and chunk size alone cannot answer it. With overlap, a new chunk starts every (size minus overlap) tokens. That gap is the stride, and the stride, not the size, sets how many chunks a corpus produces, which sets how many embeddings you compute, store, and pay for.

Work a 100,000-token corpus. Size 250 with overlap 50: a chunk every 200 tokens, so 500 chunks. Double the size, same overlap: stride 450, about 222 chunks. Drop the overlap too: stride 500, 200 chunks. Raising size and cutting overlap BOTH stretch the stride, which is exactly the pairing the official answer wants. Cutting overlap alone is the tempting near miss: it helps, but nowhere near as much.

Chapter 11 of our GenAI Engineer Associate course lets you work that corpus interactively, then quizzes you on it. Units 1 and 2 are live now. certify.courses`,
    hashtags:
'#databricks #genai #generativeai #rag #llm #embeddings #vectorsearch #databrickscertification #certificationprep #aiengineer #dataengineering #machinelearning #promptengineering #techcertification',
    captionFb:
`The official GenAI Engineer Associate guide opens its sample questions with a chunking cost problem. The key: a new chunk starts every (size minus overlap) tokens, so the stride sets the embedding bill. Raising chunk size AND reducing overlap both stretch it. Chapter 11 of our GenAI course works the numbers interactively: https://certify.courses`,
  },

  // ---- POST 21 (A) ----
  // Cert: Databricks DE Associate. Pillar: teaching (study planning).
  // Values pulled from blog/how-long-to-prepare-databricks-data-engineer-associate.html
  // Profile labels + timelines are the blog's (given in weeks, not hours).
  {
    slug: 'how-long-de-associate',
    format: 'carousel',
    source: 'Databricks DE Associate study planning, blog/how-long-to-prepare-databricks-data-engineer-associate.html',
    slides: [
      { layout: 'hook', lines: ['How long', 'to prepare?', 'An honest number.'] },
      {
        layout: 'value',
        headlineLines: ['It depends on one thing.'],
        bodyLines: [
          'How much time you already spend',
          'in a Databricks workspace each week.',
        ],
      },
      {
        layout: 'value',
        headlineLines: ['Three starting points,', 'three timelines.'],
        bodyLines: [
          'Experienced: 1 to 2 weeks',
          [{ t: 'Some exposure: 2 to 4 weeks', gold: true }],
          'New to Databricks: 4 to 6 weeks',
        ],
      },
      {
        layout: 'value',
        headlineLines: ['Where the hours actually go.'],
        bodyLines: [
          'Platform and ingestion fill week one.',
          'Budget for them first.',
        ],
      },
      {
        layout: 'cta',
        lines: [
          'The full breakdown is on the site.',
          'Week by week, by experience level,',
          'sourced from the exam guide.',
        ],
        url: 'certify.courses',
      },
    ],
    captionIg:
`How long does it take to prepare for the Databricks Data Engineer Associate exam? The honest answer is a range, not a number, and the range depends on how much of your week already happens inside a Databricks workspace.

A daily user is mostly filling gaps. An experienced data engineer who is new to the platform is learning Databricks-specific behaviour on top of concepts they already hold. A career changer is doing both.

The full post on certify.courses breaks it down by profile, gives a week-by-week plan mapped to the exam domains, and names the parts that make it take longer than people expect. Every exam fact in it comes from the official exam guide, version May 2026.`,
    hashtags:
'#databricks #databrickscertification #dataengineer #dataengineering #certification #examprep #lakehouse #deltalake #apachespark #studyplan #datacareers #cloudcertification #certify',
    captionFb:
`How long does it take to prepare for the Databricks Data Engineer Associate exam? It depends on how much of your week already happens inside Databricks. Full breakdown by experience level, with a week-by-week plan mapped to the exam domains: https://certify.courses/blog/how-long-to-prepare-databricks-data-engineer-associate

#Databricks #DataEngineering #Certification`,
  },

  // ---- POST 22 (B) ----
  // Cert: Databricks GenAI Engineer Associate. Pillar: product (new course).
  // Built only because Phase 0 confirmed all 55 lessons publish (each UNITS entry
  // has a file) and 7 practice exams exist. Counts from the GenAI course folder.
  {
    slug: 'genai-track-complete',
    format: 'single',
    source: 'Databricks GenAI Engineer Associate, databricks-generative-ai-engineer-associate/ (55 lessons, 7 practice exams, all live)',
    slides: [
      {
        layout: 'single',
        headlineLines: ['Generative AI Engineer', 'Associate is finished.'],
        bodyLines: [
          '55 of 55 lessons. 7 practice exams.',
          'Unit 1 is free.',
          'certify.courses',
        ],
      },
    ],
    captionIg:
`The Databricks Generative AI Engineer Associate track is complete on certify.courses. 55 lessons, 7 practice exams, built from the official exam guide and the current Databricks documentation, nothing else.

Same structure as every other track: one concept per card, a recall check inside each lesson, cross-domain practice exams at the end of each unit. The first unit is free with no account. Try it, then decide.`,
    hashtags:
'#databricks #generativeai #genai #llm #rag #vectorsearch #mlops #databrickscertification #certification #examprep #aiengineer #datacareers #certify',
    captionFb:
`The Databricks Generative AI Engineer Associate track is complete: 55 lessons and 7 practice exams, built only from the official exam guide and current Databricks docs. Unit 1 is free, no account needed. https://certify.courses

#Databricks #GenerativeAI #Certification`,
  },

  // ---- POST 23 (C) ----
  // Cert: Databricks DE Professional. Pillar: teaching (trade-off).
  // Copy verified against lesson-06-streaming-tables-vs-materialized-views.html
  // (Unit 1, Ch 6, obj 1.6). Terminology: Lakeflow Spark Declarative Pipelines.
  {
    slug: 'streaming-table-or-mv',
    format: 'carousel',
    source: 'Databricks DE Professional, Unit 1, Ch 6, obj 1.6 (streaming tables vs materialized views)',
    slides: [
      { layout: 'hook', lines: ['Streaming table or', 'materialized view?'] },
      {
        layout: 'value',
        headlineLines: ['Same pipeline.', 'Two very different promises.'],
        bodyLines: [
          'Both are declarative.',
          'Only one processes each source row exactly once.',
        ],
      },
      {
        layout: 'value',
        bodyLines: [
          [{ t: 'Streaming table', gold: true }],
          'Append-only source. Each row seen once.',
          'State kept between runs.',
          [{ t: 'Materialized view', em: true }],
          'Result recomputed from current source.',
          'Upstream updates and deletes are fine.',
        ],
      },
      {
        layout: 'value',
        headlineLines: ['The signal that picks one.'],
        bodyLines: [
          'Can source rows change after they land?',
          'Yes: materialized view. No: streaming table.',
        ],
      },
      {
        layout: 'cta',
        lines: [
          'Your source is a Kafka topic.',
          'Which one?',
          'Answer is in the caption.',
        ],
        url: 'certify.courses',
      },
    ],
    captionIg:
`In Lakeflow Spark Declarative Pipelines, a streaming table and a materialized view can be defined with almost identical syntax, and they behave nothing alike.

A streaming table treats its source as append-only. Each row is processed once and the pipeline keeps state between runs, which is what makes it cheap for high-volume ingestion. A materialized view recomputes its result from the current state of its sources, so it tolerates updates and deletes upstream, and it is the right shape for aggregations and joins over data that can change.

The Kafka question: a topic is append-only, so a streaming table. The exam likes to hide the answer in whether the source can mutate, not in what the output looks like.

Chapter 6 of the Professional track covers this with the failure modes on both sides. Unit 1 is free on certify.courses.`,
    hashtags:
'#databricks #lakeflow #streaming #dataengineering #databrickscertification #dataengineer #deltalake #apachespark #kafka #materializedview #certification #examprep #certify',
    captionFb:
`Streaming table or materialized view? The deciding question is whether rows in the source can change after they land. Append-only source (a Kafka topic, for example): streaming table. Anything else: materialized view. Chapter 6 of the Databricks Data Engineer Professional track covers both, and Unit 1 is free: https://certify.courses

#Databricks #DataEngineering #Certification`,
  },
];
