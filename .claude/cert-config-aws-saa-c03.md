# Cert Config: AWS Certified Solutions Architect Associate (SAA-C03)

Per-certification settings so the frozen engine rules stay generic. Pairs with
curriculum-index-aws-saa-c03.md (chapter placement; LOCKED 21 Oct 2026,
transcribed from the official SAA-C03 exam guide PDF, docs edition, downloaded
from docs.aws.amazon.com on 21 Oct 2026).

## Identity

    Badge text: "AWS Solutions Architect Associate (SAA-C03)"
    Course folder: aws-solutions-architect-associate/
    Difficulty: Associate (difficulty-badge, the existing Associate tier)
    Standard blurb: Bite-sized, visual lessons for the AWS Certified
      Solutions Architect Associate (SAA-C03) exam, built to teach the design
      trade-offs the test rewards across secure, resilient, high-performing,
      and cost-optimized architectures.
    Exam guide version: SAA-C03, docs edition (copyright 2026; the guide
      carries no version number or date of its own). No successor version is
      published (the -04 PDF path returns 404, checked 21 Oct 2026).
      Source: https://docs.aws.amazon.com/pdfs/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.pdf
    Questions: 65 presented (50 scored + 15 unscored, unidentified).
      Multiple choice (1 of 4) and multiple response (2+ of 5+) only.
    Time: 130 minutes. Not in the PDF; confirmed on the AWS cert page
      (https://aws.amazon.com/certification/certified-solutions-architect-associate/,
      "Exam duration, 130 minutes", checked 22 Oct 2026).
    Cost: USD 150 (same page, "Cost, 150 USD", checked 22 Oct 2026).
    Pace: 2 minutes per question (65 x 2 = 130, the real limit).
    Pass threshold: 720 on a 100 to 1,000 scaled score (published in the
      PDF). Compensatory scoring: no per-domain minimum. Use 72% as the
      practice target and label it as our guidance, since the scaled score
      is not a percentage.
    Domains: 1 Design Secure Architectures 30%, 2 Design Resilient
      Architectures 26%, 3 Design High-Performing Architectures 24%,
      4 Design Cost-Optimized Architectures 20%.
    Target candidate: at least 1 year of hands-on experience designing
      cloud solutions on AWS. Lessons teach the design decision, not the
      console clicks.
    Code language: none by default. Short IAM, bucket or key policy JSON, a
      one-line AWS CLI command, or a CloudFormation fragment only where the
      decision turns on it (policy evaluation, a condition key, a lifecycle
      rule). Multi-line code blocks carry an inline white-space:pre, as in
      the Spark course.

## Course structure and eyebrows

    Three levels, the MLA-C02 model: Unit (exam domain) > Module (the
      guide's task statement, numbered N.M to match it) > Chapter (one
      skill, or one K-anchored knowledge topic). The course index.html nests
      modules:[...] inside each unit and renders a "Module N.M · title"
      sub-header.
    Cover eyebrow: "Unit N · Module N.M · Chapter NN" (middle dot).
    Objective ids: K and S ids as numbered in the index (ours, in guide
      order, frozen at lock). Lesson scope and exam headers cite them.
    Unit closers: Ch 23, 40, 62 and 89 close Units 1 to 4, so each one's
      NAV.next is that unit's practice exam ("Practice test"); Ch 89 is the
      last chapter of the course.

## File naming

    Lessons: lesson-NN-name.html, numbered 01-89, file names as planned in
      the curriculum index.
    Practice exams: saa-practice-exam-NN.html. 01 to 04 are the unit exams
      (23, 17, 22 and 27 questions, one per chapter); 05 to 07 are the
      sealed full mocks (65 questions, 130 minutes, 20/17/15/13 by domain,
      five select-two items each).
    Practice hub: practice/aws-saa-c03.html (served at /practice/aws-saa-c03).
    Readiness quiz: ready/aws-saa-c03.html if one is built (served at
      /ready/aws-saa-c03).
    All lessons and exams live in aws-solutions-architect-associate/.

## Gating and pricing

    Course id: aws-saa (COURSE_ID in the course home; still to register in
      gate.ts, _shared.mjs and build_sitemap.py).
    Price: $14.99, "was" $45 (decided 22 Oct 2026, matching MLA-C02, the
      other large AWS Associate course). Unit 1 free through
      saa-practice-exam-01. Checkout needs a Netlify env var
      STRIPE_PRICE_AWS_SAA set to a $14.99 Stripe Price.
    Progress key: done:aws-saa-c03:<chapter id> in localStorage.

## Terminology rules

Current official names only, as the exam guide writes them. Never use a
deprecated name in prose, options, or explanations. The exam itself uses
the official short names (Amazon SNS, not Amazon Simple Notification
Service); lessons spell a name out once and then use the short form.

    Identity: "AWS IAM Identity Center", never "AWS Single Sign-On" or "AWS
      SSO". "IAM" for AWS Identity and Access Management. "AWS STS".
      "AWS Directory Service" with "AWS Managed Microsoft AD" and "AD
      Connector" as its options.
    Organizations: "AWS Organizations", "service control policies (SCPs)",
      "AWS Control Tower" with "controls" (never "guardrails": the Control
      Tower docs say the term is being replaced and the two are synonyms).
    Security: "AWS WAF", "AWS Shield" (Standard and Advanced), "AWS Firewall
      Manager", "AWS Network Firewall", "AWS Secrets Manager", "AWS Systems
      Manager Parameter Store", "AWS KMS", "AWS CloudHSM", "AWS Certificate
      Manager (ACM)", "Amazon GuardDuty", "Amazon Macie", "Amazon Inspector",
      "AWS Security Hub", "Amazon Detective", "AWS Artifact", "AWS Config",
      "AWS CloudTrail". Security Hub was split (checked 22 Oct 2026 on its
      docs pages): the original posture service with control checks and
      standards is now "AWS Security Hub CSPM", and "AWS Security Hub" names
      the newer service that correlates findings from Security Hub CSPM,
      Inspector and others into exposures. The guide says "Security Hub";
      Ch 15 explains the split once and uses both names.
    KMS keys: "AWS owned keys", "AWS managed keys", "customer managed keys";
      never "CMK" or "customer master key" (retired terms).
    Load balancing: "Elastic Load Balancing (ELB)" for the service,
      "Application Load Balancer", "Network Load Balancer", "Gateway Load
      Balancer". Never "Classic Load Balancer" except as a retired contrast.
    Messaging: "Amazon SQS", "Amazon SNS", "Amazon EventBridge" (never
      "CloudWatch Events"), "Amazon MQ", "AWS Step Functions".
    Containers: "Amazon ECS", "Amazon EKS", "AWS Fargate", "Amazon ECR",
      "Amazon ECS Anywhere", "Amazon EKS Anywhere".
    Databases: "Amazon RDS", "Amazon Aurora", "Amazon DynamoDB", "DynamoDB Accelerator
      (DAX)", "Amazon ElastiCache" (verify the current engine names at Ch 51:
      Valkey, Redis OSS, Memcached), "Amazon DocumentDB", "Amazon Neptune",
      "Amazon Keyspaces", "Amazon Redshift", "Amazon RDS Proxy". Teach
      "Aurora Serverless v2" only (see the closed-services note on v1).
    Migration: "AWS DMS", "DMS Schema Conversion" (managed default) and
      "AWS SCT" (installed alternative), see the Module 4.3 notes, "AWS Application Migration
      Service" (never "CloudEndure Migration" or "Server Migration
      Service").
    Analytics: "Amazon Athena", "AWS Glue", "AWS Glue Data Catalog", "AWS
      Lake Formation", "Amazon EMR", "Amazon Kinesis Data Streams", "Amazon
      Managed Streaming for Apache Kafka (Amazon MSK)", "Amazon OpenSearch
      Service" (never "Elasticsearch Service"), "Amazon Quick" as the guide
      writes it (formerly Amazon QuickSight; say so once in Ch 59, then only
      "Amazon Quick").
    Repo-wide AWS rules: "Amazon Data Firehose", never "Kinesis Data
      Firehose"; "Amazon Managed Service for Apache Flink", never "Kinesis
      Data Analytics". IAM, CLI, SDK and CloudWatch identifiers keep the
      pre-rename names (firehose:PutRecord), so policy and CLI examples use
      them while prose uses the current service name.
    ML: "Amazon SageMaker AI" for the platform, never "Amazon SageMaker"
      alone. "Amazon Comprehend", "Amazon Lex", "Amazon Polly", "Amazon
      Rekognition", "Amazon Textract", "Amazon Transcribe", "Amazon
      Translate".
    Management: "AWS Health Dashboard" (never "Personal Health Dashboard" or
      "Service Health Dashboard"), "AWS Compute Optimizer", "AWS Trusted
      Advisor", "AWS Well-Architected Tool", "Service Quotas", "AWS Cost and
      Usage Report" as the guide writes it (verify at Ch 63 whether the docs
      now lead with "Data Exports" and mention it once).
    Storage: "Amazon S3", "S3 Glacier Instant Retrieval", "S3 Glacier
      Flexible Retrieval", "S3 Glacier Deep Archive", "S3 Intelligent-
      Tiering", "Amazon EBS", "Amazon EFS", "Amazon FSx for Windows File
      Server", "Amazon FSx for Lustre", "Amazon FSx for NetApp ONTAP",
      "Amazon FSx for OpenZFS", "AWS Storage Gateway", "AWS Backup".
    Networking: "Amazon VPC", "AWS Transit Gateway", "AWS PrivateLink",
      "AWS Direct Connect", "AWS Site-to-Site VPN", "AWS Client VPN",
      "Amazon CloudFront", "AWS Global Accelerator", "Amazon Route 53",
      "AWS Resource Access Manager (AWS RAM)".

## Closed, ended, and out-of-scope services

Checked 21 Oct 2026 against each service's AWS docs page. Teach the
replacement; never let a question hinge on the closed service.

    AWS Snowball Edge: "no longer available to new customers" (Snowball
      Edge developer guide). AWS names AWS DataSync, AWS Data Transfer
      Terminal and AWS Outposts as the alternatives. Ch 58 states the status
      once; Ch 58 and 66 teach Data Transfer Terminal as the physical
      option. Snowcone (discontinued 12 Nov 2024) and Snowmobile (retired
      2024) are gone, per AWS's announcements as reported in the press;
      never name them.
    Amazon Glacier (the original vault-based service): "no longer accepting
      new customers" (Amazon Glacier developer guide). "Glacier" in this
      course always means the S3 Glacier storage classes (Ch 69, 71).
    Amazon Elastic Transcoder: support ended 13 Nov 2025 (Elastic
      Transcoder docs). Listed in the guide's in-scope list, but no chapter
      teaches it and no question names it.
    Aurora Serverless v1: AWS announced end of support (believed 31 Mar
      2025; the Aurora docs did not load from the build environment, so
      VERIFY before Ch 48). Either way Ch 48 and 80 teach v2 only.
    To verify at authoring: Storage Gateway types still open to new
      customers (Ch 70), S3 Express One Zone (Ch 41), a time-series service
      for Ch 81 (none is in the guide's in-scope list; Amazon Timestream is
      out of the list, so teach the access pattern and name a service only
      if its docs show it open), VMware Cloud on AWS (in-scope list, not
      taught).
    Out of scope per the guide (never the correct answer): AWS CDK,
      CodeBuild, CodeCommit, CodeDeploy, AWS FIS, Amazon Lightsail, Amazon
      MWAA, AWS Cloud Map, all IoT services, Amazon Personalize, AWS
      Elemental services. They may appear as distractors only where a
      candidate could plausibly confuse them.

Changed behavior the lessons teach (checked 23 Oct 2026 on the AWS docs):

    S3 SSE-C: since April 2026 server-side encryption with customer-provided
      keys is disabled by default on new buckets (and on existing buckets in
      accounts with no SSE-C objects) until deliberately enabled. Ch 18
      presents SSE-C as a niche choice.
    ACM exportable public certificates: ACM can now issue public
      certificates exportable to EC2, containers and on-premises servers
      (extra cost, 198-day validity, renewed 45 days before expiry, each
      renewal deployed by the customer). "ACM certificates only work on
      integrated services" is no longer true; Ch 19 teaches the export
      option. ACME-issued certificates exist too and are not eligible for
      managed renewal (not taught).
    S3 Object Lock can be enabled on existing buckets (Ch 22); KMS automatic
      rotation runs every 90 to 2,560 days, default 365, plus on-demand
      rotation, which also covers imported key material (Ch 23).

Module 2.1 changes (checked 23 Oct 2026 on the AWS docs):

    SQS maximum message size is now 1 MiB (was 256 KiB); FIFO throughput is
      300 API calls per second per action, 3,000 messages per second
      batched, up to 30,000 TPS in high-throughput mode (Ch 26).
    AWS App2Container is closed to new customers: never name it; Ch 28
      teaches containerizing with a Dockerfile and Amazon ECR.
    Amazon ECS Managed Instances is a third ECS capacity type (AWS-managed
      EC2 instances) alongside EC2 and Fargate (Ch 28).
    Lambda: the docs now say "Event Functions" and add Lambda Managed
      Instances (some invocations up to 90 minutes); lessons keep "Lambda
      function" as the guide does and teach the 15-minute limit with the
      exception mentioned once. Async payloads are 1 MB (Ch 29).
    API Gateway REST integrations default to a 29-second timeout, raisable
      for Regional and private REST APIs; HTTP APIs top out at 30 seconds
      (Ch 30).

Module 2.2 changes (checked 25 Oct 2026 on the AWS docs):

    AWS Application Migration Service: its docs now title it "AWS Transform
      MGN". Lessons use the guide's name and mention the new title once
      (Ch 40).
    Route 53 Resolver is now "Route 53 VPC Resolver" in the docs; Ch 35
      mentions the rename once.
    AWS X-Ray's service map is now the "trace map"; CloudWatch Application
      Signals builds on X-Ray traces (Ch 36).
    The DR whitepaper publishes no per-strategy RPO or RTO figures in its
      text, only "near-zero" for multi-site active/active. Ch 39 ranks the
      four strategies by cost and recovery speed; never state invented
      minute or hour ranges in questions.

Module 3.1 changes (checked 26 Oct 2026 on the AWS docs):

    gp3 now reaches 80,000 IOPS and 2,000 MiB/s on volumes up to 64 TiB
      (was 16,000 IOPS, 1,000 MiB/s and 16 TiB); baseline stays 3,000 IOPS
      and 125 MiB/s at any size. io2 Block Express is the pick only above
      80,000 IOPS or 2,000 MiB/s, or for sub-millisecond latency, 99.999%
      durability or Multi-Attach (Ch 41). Older study material that says
      "over 16,000 IOPS means io1 or io2" is out of date.
    S3 maximum object size is 48.8 TiB (was 5 TB); multipart parts stay
      5 MiB to 5 GiB, up to 10,000 parts (Ch 41, 42).
    S3 request rates stay at least 3,500 writes and 5,500 reads per second
      per partitioned prefix (Ch 41).

Module 3.2 changes (checked 26 Oct 2026 on the AWS docs):

    Lambda docs now title standard functions "Lambda Event Functions" and
      add Lambda Managed Instances (some invocations up to 90 minutes);
      Ch 46 teaches the 900-second timeout and the 128 MB to 10,240 MB
      memory range, one vCPU at 1,769 MB, /tmp 512 MB to 10,240 MB.
    The SQS scaling page now recommends metric math for backlog per
      instance instead of publishing a custom metric (Ch 43).
    AWS recommends target tracking over step scaling and against simple
      scaling; predictive scaling and warm pools are the answers for slow
      boots and daily ramps (Ch 44).
    Fargate task storage defaults to 20 GiB, up to 200 GiB (Ch 46).

Module 3.3 changes (checked 26 Oct 2026 on the AWS docs):

    Aurora Serverless v2 is now titled "Aurora serverless" in the docs; it
      scales in 0.5 ACU steps and can scale to 0 ACUs with automatic pause
      and resume. Lessons use the guide-era name "Aurora Serverless v2"
      and mention the docs title once (Ch 48).
    RDS magnetic storage is deprecated and existing volumes were migrated
      to gp3; RDS storage is gp2/gp3 or Provisioned IOPS (io1, io2 Block
      Express) (Ch 49).
    Aurora cluster volumes grow up to 256 TiB on specific engine versions;
      Aurora I/O-Optimized pays off when I/O is 25% or more of the bill
      (Ch 49).
    RDS allows 15 read replicas per primary; Aurora 15 Aurora Replicas;
      Aurora Global Database up to 10 secondary Regions (Ch 47).
    ElastiCache engines are Valkey, Memcached and Redis OSS; MemoryDB is
      "Amazon MemoryDB" (Valkey and Redis OSS compatible) (Ch 50, 51).

Module 3.4 changes (checked 26 Oct 2026 on the AWS docs):

    Transit Gateway attachments now also include Connect (SD-WAN), VPN
      Concentrator, Client VPN and network function attachments; Ch 52
      teaches the VPC, VPN, Direct Connect gateway and peering ones.
    PrivateLink also offers resource endpoints (a database or other
      resource, not only an NLB-fronted service); Ch 52 teaches endpoint
      services behind an NLB.
    Network Load Balancers now support QUIC alongside TCP, UDP and TLS;
      ALB cross-zone is always on at the load balancer level, NLB and
      GWLB default off, and NLB cross-zone adds EC2 inter-AZ data charges
      (Ch 55).
    The Outposts docs are split into first- and second-generation racks
      plus Outposts servers; Ch 54 stays generic.

Module 3.5 changes (checked 26 Oct 2026 on the AWS docs):

    Amazon Quick: the docs say Quick "evolved from Amazon QuickSight", and
      the BI feature is now "Amazon Quick Sight" inside Quick (alongside
      Flows, Automate, Index, Research). Ch 59 says so once and uses
      "Amazon Quick" after that; SPICE keeps its name.
    AWS Data Transfer Terminal is currently available only to Enterprise
      Support customers (others contact AWS Support); Ch 58 says so.
      Snowball Edge's own guide confirms it is closed to new customers.
    Storage Gateway's docs list S3 File Gateway, FSx File Gateway and Tape
      Gateway; re-check which are open to new customers at Ch 70.
    AWS Glue for Ray has reached end of support: never teach it.
    Kinesis Data Streams: enhanced fan-out allows 20 consumers per stream
      (50 in the new On-demand Advantage mode); Ch 57 teaches 2 MB per
      second per shard per consumer and leaves the counts out.
    Firehose S3 buffering: 1 to 128 MiB and 60 to 900 s, with a zero-second
      option for no buffering (Ch 61).
- Module 4.1 changes (checked 26 Oct 2026 on the AWS docs):
    Amazon FSx File Gateway is no longer available to new customers, so Ch 70
      teaches the three remaining Storage Gateway types (S3 File, Volume,
      Tape) and never recommends FSx File Gateway.
    gp3 is 20 percent cheaper per GiB than gp2 and decouples IOPS from size
      (Ch 65).
    RDS storage autoscaling fires at 10 percent free space for 5 minutes;
      the maximum threshold must be at least 10 percent above current size
      (Ch 67).
    The Cost and Usage Report is taught as built through AWS Data Exports
      (Ch 63).
    AWS Backup cold storage has a 90-day minimum and only some resource
      types support it (Ch 69).
    EFS lifecycle defaults: IA after 30 days, Archive after 90 days without
      access (Ch 72).
- Module 4.2 changes (checked 26 Oct 2026 on the AWS docs):
    Savings Plans: Compute up to 66 percent off (any family, Region, OS,
      tenancy, plus Fargate and Lambda), EC2 Instance up to 72 percent (one
      family in one Region). AWS also offers Database and SageMaker AI
      Savings Plans; lessons name only the compute plans (Ch 73).
    Spot discounts are taught as "steep" without a percentage; the
      two-minute interruption notice is the fact to test (Ch 73).
    Hibernation: enabled at launch, encrypted EBS root volume big enough
      for RAM, Linux RAM under 150 GiB (Ch 74).
    Fargate bills per second with a one-minute minimum; Fargate Spot is up
      to 70 percent off with a two-minute warning (Ch 75).
    The Lambda pricing page now lists several function pricing models;
      lessons keep to requests plus GB-seconds of duration (Ch 75).
    A stopped RDS instance restarts automatically after 7 days, and its
      storage still bills while stopped (Ch 76).
    Compute Optimizer: 14-day lookback, up to 93 days with the paid
      enhanced infrastructure metrics; memory only with the CloudWatch
      agent (Ch 78).
- Module 4.3 changes (checked 26 Oct 2026 on the AWS docs):
    Schema conversion: teach "DMS Schema Conversion" (fully managed,
      web-based, built on the AWS SCT engine) as the default and "AWS SCT"
      as the installed alternative; DMS homogeneous data migrations use
      native tools and are serverless (Ch 82).
    Time series: Amazon Timestream for LiveAnalytics carries an end of
      support notice pointing to Amazon Timestream for InfluxDB. Ch 81
      teaches the access pattern (DynamoDB keys plus TTL, Parquet on S3)
      and names Timestream for InfluxDB once, never as a quiz answer.
    The Aurora docs now title the feature "Aurora serverless"; the course
      keeps "Aurora Serverless v2" as in Ch 48. Recent engine versions
      scale to 0 ACUs with auto-pause (Ch 80).
    Database Savings Plans (up to 35 percent across RDS, Aurora, DynamoDB,
      ElastiCache and more) sit beside reserved DB instances (Ch 80).
    RDS automated backup retention is 0 to 35 days; transaction logs ship
      every five minutes; snapshot export writes Parquet to S3 (Ch 79).
- Module 4.4 changes (checked 26 Oct 2026 on the AWS docs):
    Regional NAT gateways now exist (automatic multi-AZ expansion, no
      public subnet, billed one NAT gateway-hour per AZ, no private NAT).
      They postdate the guide: Ch 83 names them once, never as a quiz
      answer; zonal "one per AZ" stays the taught production answer.
    Site-to-Site VPN: 1.25 Gbps and 140,000 pps per standard tunnel; large
      bandwidth tunnels up to 5 Gbps exist on Transit Gateway or Cloud WAN
      only, not on a virtual private gateway (Ch 89).
    Direct Connect: dedicated 1, 10, 100 and 400 Gbps; hosted 50 Mbps to
      25 Gbps; port hours bill even when idle; data in is free (Ch 84, 89).
    CloudFront now offers flat-rate monthly plans beside pay-as-you-go;
      transfer from AWS origins to CloudFront is waived (Ch 86).
    Route 53 alias queries to load balancers, CloudFront, API Gateway, VPC
      endpoints, S3 website endpoints and others are free (Ch 87).
    Every public IPv4 address, in use or idle, bills hourly (Ch 87).

## Recommended-vs-contrast stances

    People: IAM Identity Center with temporary credentials is the
      recommendation; long-lived IAM users with access keys are the contrast
      (Ch 02, 07).
    Workloads: IAM roles (instance profiles, task roles, execution roles)
      are the recommendation; embedded access keys are the anti-pattern
      (Ch 04).
    Secrets: Secrets Manager (with rotation) or Parameter Store; secrets in
      code, AMIs or user data are the anti-pattern (Ch 13).
    Block storage: gp3 is the default general purpose volume; gp2 appears
      only as the migration source (Ch 41, 65).
    Commitments: Savings Plans are the recommendation for new compute
      commitments; Reserved Instances are the contrast where a capacity
      reservation or a specific RI-only service (RDS, ElastiCache,
      Redshift, OpenSearch) is the point (Ch 73, 80).
    Infrastructure: CloudFormation stacks and immutable replacement are the
      recommendation; manual changes and in-place patching are the contrast
      (Ch 33).
    Multi-account: AWS Control Tower over hand-built Organizations setups
      for a new landing zone (Ch 05).
    Archive: S3 Glacier storage classes and lifecycle rules over the
      vault-based Amazon Glacier service (Ch 69, 71).
    Answer framing: where the real exam asks for the "least operational
      overhead" option, the managed or serverless service is usually right;
      lessons teach the signal, not the shortcut, and explanations say which
      requirement rules out the self-managed option.

## Palette registry

The course home keeps the shared gold home theme; gold (#d9a441) stays
reserved for exams and course homes product-wide, and cerulean (#5aa9e6) is
the AWS practice hub accent. Lesson accents are assigned per MODULE band,
semantically: Unit 1 security in cool violets and teal, Unit 2 resilience in
blues, Unit 3 performance in warm hues (heat, speed), Unit 4 cost in greens
(money). Assigned 21 Oct 2026 by a search over each band's hue range; every
accent is 30 or more RGB units (Euclidean) from all 125 --accent values in
the shipped lessons, from gold, from cerulean, and from every other band.

    Unit 1  Design Secure Architectures
      Module 1.1  Ch 01-07  identity and access   periwinkle #6982d3  (min 41)
      Module 1.2  Ch 08-16  workload and network  ice teal   #90dfd8  (min 42)
      Module 1.3  Ch 17-23  data security, keys   violet     #9569d3  (min 30)
    Unit 2  Design Resilient Architectures
      Module 2.1  Ch 24-32  loose coupling        lagoon     #6fcadc  (min 35)
      Module 2.2  Ch 33-40  HA and DR             azure      #7ba9e5  (min 33)
    Unit 3  Design High-Performing Architectures
      Module 3.1  Ch 41-42  storage               clay       #d89579  (min 37)
      Module 3.2  Ch 43-46  compute               vermilion  #f16237  (min 31)
      Module 3.3  Ch 47-51  database              raspberry  #d36975  (min 32)
      Module 3.4  Ch 52-55  network               lime       #caf07f  (min 55)
      Module 3.5  Ch 56-62  ingestion             orchid     #de8ccb  (min 40)
    Unit 4  Design Cost-Optimized Architectures
      Module 4.1  Ch 63-72  storage cost          mint       #50f1a1  (min 39)
      Module 4.2  Ch 73-78  compute cost          green      #6df378  (min 41)
      Module 4.3  Ch 79-82  database cost         aquamarine #4cf0ca  (min 40)
      Module 4.4  Ch 83-89  network cost          sage       #a7de8c  (min 41)

Full five-var sets (bg and bg-tint derived from the accent hue at 4.5% and
15% lightness, the same dark-tinted pattern as the AIF-C01 and MLA-C02
lessons; --accent-ink equals --bg):

    Module  --bg      --bg-tint --accent  --accent-glow
    1.1     #060911   #131c39   #6982d3   rgba(105,130,211,0.12)
    1.2     #061110   #133936   #90dfd8   rgba(144,223,216,0.12)
    1.3     #0b0611   #231339   #9569d3   rgba(149,105,211,0.12)
    2.1     #060f11   #133339   #6fcadc   rgba(111,202,220,0.12)
    2.2     #060b11   #132439   #7ba9e5   rgba(123,169,229,0.12)
    3.1     #110906   #391e13   #d89579   rgba(216,149,121,0.12)
    3.2     #110906   #391c13   #f16237   rgba(241,98,55,0.12)
    3.3     #110607   #391317   #d36975   rgba(211,105,117,0.12)
    3.4     #0d1106   #2d3913   #caf07f   rgba(202,240,127,0.12)
    3.5     #11060e   #391331   #de8ccb   rgba(222,140,203,0.12)
    4.1     #06110c   #133926   #50f1a1   rgba(80,241,161,0.12)
    4.2     #061107   #133916   #6df378   rgba(109,243,120,0.12)
    4.3     #06110e   #133931   #4cf0ca   rgba(76,240,202,0.12)
    4.4     #0a1106   #203913   #a7de8c   rgba(167,222,140,0.12)

Extra named colors: a --warn for threats, costs and failure states where an
SVG needs one (#f87171 as in AIF-C01; on the warm Unit 3 bands, where red
sits close to the accent, use a cool warn such as the module 2.2 azure
instead). Before shipping a lesson, re-run the distance check if accents
have been added elsewhere on the site since 21 Oct 2026. Trade-off lessons
(TO in the index) keep their module accent; the TO structure, not a distinct
color, marks them.

## Source rules (reminder)

Every card and question traces to official AWS documentation
(docs.aws.amazon.com, aws.amazon.com product and pricing pages, the AWS
Well-Architected Framework whitepapers) plus the official SAA-C03 exam guide
for scope. No braindump content, no third-party question banks as material.
SAA-C03 is the most braindumped AWS exam, so this rule matters most here:
never fetch "SAA-C03 dump" or "real exam questions" pages, even to check
coverage. Limits, prices and defaults (Lambda timeout, SQS retention, S3
request rates, Direct Connect speeds, data transfer rates) change: fetch the
current docs or pricing page before a card states a number, and note the
URL in the commit.

## Site wiring still to do (outside this file's scope)

    Course home: DONE 22 Oct 2026 (aws-solutions-architect-associate/
      index.html, cloned from MLA-C02 with the AIF-C01 footer; all 89
      chapters, four unit exams and three mocks show "Coming soon"; the
      Practice tab reads "Soon" until the hub ships). Set a chapter's
      file:"..." in UNITS as it ships, and an exam's file to turn it into a
      link (the mocks are static HTML: swap the div for an <a>).
    gate.ts, _shared.mjs and build_sitemap.py registration for aws-saa.
    catalog.json entry, root index.html card, pricing.html row, footer links.
    Practice hub practice/aws-saa-c03.html once exams 01 to 04 exist.
