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

  // ---- POST 21 ----
  {
    slug: 'mla-c02-now-complete',
    format: 'single',
    source: 'AWS ML Engineer Associate (MLA-C02) course, now content-complete',
    slides: [
      {
        layout: 'single',
        eyebrow: 'NOW COMPLETE',
        headlineLines: ['76 chapters.', '7 exams.', 'All live.'],
        bodyLines: [
          'The full MLA-C02 course is here: every',
          'task statement, four unit exams, and three',
          ['hands-on ', { t: 'full-length mocks', em: true }, '.'],
        ],
      },
    ],
    captionIg:
`The AWS Certified Machine Learning Engineer Associate (MLA-C02) course is now complete on Certify.

That means every task statement in the official exam guide is covered: 76 chapters across all four domains, from data preparation and feature engineering to model training, deployment, and monitoring on SageMaker.

Practice is built in the same way the exam is. Each of the four domains has its own timed practice exam, and three full-length 65-question mock exams run the real 130-minute clock at the exact 28/24/24/24 domain weighting, so a full mock feels like the real thing rather than a quiz.

No streaks, no XP, no mascot. Every chapter runs the same loop: a short visual lesson, a quiz before the forgetting starts, then scenario questions that make you reason the way the exam does.

Unit 1 is free to start. certify.courses`,
    hashtags:
'#awscertification #machinelearning #mlengineer #mlac02 #awsmachinelearning #sagemaker #awscertified #mlops #certificationprep #machinelearningengineer #aws #techcertification #studysmart #awscommunity',
    captionFb:
`The AWS Certified Machine Learning Engineer Associate (MLA-C02) course is now complete on Certify: 76 chapters across all four domains, four timed unit exams, and three full-length 65-question mocks that run the real 130-minute clock at the 28/24/24/24 weighting. Unit 1 is free to start: https://certify.courses`,
  },

  // ---- POST 22 ----
  {
    slug: 'mla-c02-pay-case',
    format: 'carousel',
    source: 'AWS ML Engineer Associate (MLA-C02) launch, salary framing',
    slides: [
      { layout: 'hook', lines: ['Does the AWS', 'ML cert', 'pay off?'] },
      {
        layout: 'tension',
        lines: ['A badge alone', 'earns nothing.'],
      },
      {
        layout: 'value',
        eyebrow: 'WHAT THE ROLE PAYS',
        headlineLines: ['ML engineering pays'],
        bodyLines: [
          'US machine learning engineer roles report',
          ['a median base near ', { t: '$150K', gold: true }, ', per public'],
          'salary aggregators. Seniority pushes higher.',
        ],
      },
      {
        layout: 'value',
        eyebrow: 'WHY THE CERT HELPS',
        headlineLines: ['Proof beats a resume line'],
        bodyLines: [
          'The badge shows a hiring manager you can',
          ['build, deploy, and monitor ML on ', { t: 'AWS', gold: true }, '.'],
          'It moves you past the screening filter.',
        ],
      },
      { layout: 'cta', lines: ['Study smart.', 'Earn the badge.'], url: 'certify.courses' },
    ],
    captionIg:
`Is an AWS machine learning certification worth the hours? Look at the two things it actually moves: the role you can compete for, and the confidence you walk into an interview with.

The role pays. Public salary aggregators put the median base for US machine learning engineers around 150,000 dollars, and higher with seniority or a metro premium. Numbers vary by location, company, and experience, and no certificate hands you a salary on its own.

What the cert does is close the credibility gap. The MLA-C02 validates that you can build, train, deploy, and monitor machine learning on AWS with SageMaker, not just talk about it. That is what gets a resume past the first screen and gives you specifics to point at when the offer is being negotiated.

We just finished the full MLA-C02 course: 76 chapters across all four domains, four timed unit exams, and three full-length mocks on the real clock. Study smart, earn the badge, then make the case. Unit 1 is free. certify.courses`,
    hashtags:
'#awscertification #machinelearning #mlengineer #mlac02 #techsalary #mlops #sagemaker #awscertified #machinelearningengineer #careerintech #certificationprep #aws #datacareers #techcertification',
    captionFb:
`Is the AWS ML cert worth it? Public salary aggregators put the median base for US machine learning engineers near 150,000 dollars, higher with seniority. A badge does not hand you that on its own, but the MLA-C02 proves you can build, deploy, and monitor ML on AWS, which is what gets you past the first screen. Our full MLA-C02 course is now live: https://certify.courses`,
  },
];
