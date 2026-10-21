# Curriculum index: AWS Certified Solutions Architect Associate (SAA-C03)

Status: DRAFT (not yet locked). Confirm placement before authoring lessons.
Built on 21 Oct 2026 by downloading the official exam guide PDF from
docs.aws.amazon.com
(docs.aws.amazon.com/pdfs/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.pdf)
and extracting its text; every task statement, knowledge item and skill below is
transcribed from that PDF, not from third-party outlines. Once locked, this file
is the authoritative source for unit, module and chapter placement: a later
request that conflicts with it gets flagged with a proposed one-line fix rather
than silently absorbed.

Exam guide version: SAA-C03, docs edition (copyright 2026, PDF regenerated 21
Oct 2026). The guide carries no version number or publish date of its own. No
successor exam is published: the same URL pattern for `-04` returns 404 on
docs.aws.amazon.com (checked 21 Oct 2026). Third-party pages that mention an
"SAA-C04" are not official and were ignored. Re-verify against the PDF before
locking and whenever AWS announces a new version.

Source of truth: the official exam guide PDF above. The HTML cert page
(aws.amazon.com/certification/certified-solutions-architect-associate/) does
not resolve from this environment, the same as when AIF-C01 was onboarded.

Course folder: `aws-solutions-architect-associate/`. Lessons:
`lesson-NN-name.html`. Exams: `saa-practice-exam-NN.html`. Proposed course id
for gate.ts and _shared.mjs: `aws-saa`.

Exam facts (from the PDF unless noted):
    65 questions presented: 50 scored plus 15 unscored, unidentified.
    Question types: multiple choice (1 of 4) and multiple response (2 or more
      of 5 or more) only. No ordering, matching or case study items, so the
      current exam engine covers every format.
    Scaled score 100 to 1,000; minimum passing score 720. Compensatory
      scoring: no per-domain minimum.
    Time limit: 130 minutes. Cost: USD 150. Neither is in the PDF; both are
      the long-standing AWS Associate figures and MUST be confirmed on the
      AWS cert page before any lesson or blog post states them.
    Target candidate: at least 1 year of hands-on experience designing cloud
      solutions on AWS. Lessons teach design decisions (which service, which
      configuration, why), not implementation: code is limited to short
      policy JSON, a CLI line, or a config fragment where the decision turns
      on it.
    Framing: the guide anchors the exam to the AWS Well-Architected
      Framework, and its four domains are four of the six pillars (security,
      reliability, performance efficiency, cost optimization).

Domain weights (official, from the PDF):

    Domain 1  Design Secure Architectures            30%   3 task statements
    Domain 2  Design Resilient Architectures         26%   2 task statements
    Domain 3  Design High-Performing Architectures   24%   5 task statements
    Domain 4  Design Cost-Optimized Architectures    20%   4 task statements
                                                           14 task statements

Structure: 4 units mirroring the 4 domains, each split into modules that
mirror the guide's task statements (Module 1.1 is Task 1.1), the same
three-level model as MLA-C02. Continuous chapter numbering 01 to 76. Lesson
cover eyebrows read "Unit N · Module N.M · Chapter NN"; the course index.html
nests `modules:[...]` inside each unit. TO marks a trade-off chapter (fixed
trade-off lesson pattern).

Objective numbering: the guide lists knowledge items and skills as unnumbered
bullets. This index numbers them in guide order, K for knowledge and S for
skill (K1.1.3 is the third "Knowledge of" bullet under Task 1.1). The numbers
are ours, not AWS's; exam question headers cite them, so never renumber after
lock. All 189 bullets are mapped below (107 knowledge items, 82 skills);
none is left unmapped.

Chapter weighting: the guide repeats the same services across domains (S3,
EBS, load balancers, read replicas, NAT gateways and Direct Connect each show
up in two to four task statements, once for security or resilience, once for
performance, once for cost). Each service gets ONE home chapter, placed in the
task statement that asks for the deepest decision about it, and later
statements cite that chapter rather than reteach it. As a result the chapter
counts (20/19/23/14) do not track the domain weights (30/26/24/20): Unit 3
hosts most service home chapters and Unit 4 adds the cost decision on top.
Practice exams sample at the official weights regardless (see the plan).

===============================================================================
Unit 1: Design Secure Architectures (30%)
===============================================================================

Eyebrow label for Unit 1 lessons: "Design Secure Architectures".

### Module 1.1: Design secure access to AWS resources

Objectives, mapped to chapters:

    K1.1.1  Access controls and management across multiple accounts ... Ch 06
    K1.1.2  AWS federated access and identity services (IAM, IAM
            Identity Center) ...................................... Ch 03, 07
    K1.1.3  AWS global infrastructure (Availability Zones, Regions) ... Ch 01
    K1.1.4  AWS security best practices (least privilege) ............. Ch 02
    K1.1.5  The AWS shared responsibility model ....................... Ch 01
    S1.1.1  Applying security best practices to IAM users and root
            users (MFA) ............................................... Ch 02
    S1.1.2  Designing a flexible authorization model (IAM users, groups,
            roles, policies) .......................................... Ch 03
    S1.1.3  Designing a role-based access control strategy (AWS STS,
            role switching, cross-account access) ..................... Ch 04
    S1.1.4  Designing a security strategy for multiple accounts (AWS
            Control Tower, SCPs) ...................................... Ch 06
    S1.1.5  Determining the appropriate use of resource policies ...... Ch 05
    S1.1.6  Determining when to federate a directory service with IAM
            roles ..................................................... Ch 07

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 01 | AWS Global Infrastructure and the Shared Responsibility Model |  | `lesson-01-global-infrastructure.html` | K1.1.3, K1.1.5: Regions, AZs, edge locations; what AWS secures vs what the customer secures, by service type (EC2 vs managed vs serverless) |
| 02 | Locking Down the Root User and IAM Users: MFA, Access Keys, Least Privilege |  | `lesson-02-root-and-iam-users.html` | K1.1.4, S1.1.1: root user tasks only, MFA everywhere, no long-term keys, least privilege as the default |
| 03 | IAM Policies and How AWS Evaluates Them |  | `lesson-03-iam-policy-evaluation.html` | K1.1.2, S1.1.2: users, groups, roles, managed vs inline policies, explicit deny wins, permissions boundaries |
| 04 | IAM Roles and AWS STS: Temporary Credentials and Cross-Account Access |  | `lesson-04-roles-sts-cross-account.html` | S1.1.3: trust policy vs permissions policy, AssumeRole, role switching, instance profiles |
| 05 | Resource-Based Policies vs Identity-Based Policies | TO | `lesson-05-resource-vs-identity-policies.html` | S1.1.5: S3 bucket policies, KMS key policies, Lambda and SQS resource policies; when cross-account needs a resource policy and when a role is cleaner |
| 06 | Multi-Account Strategy: AWS Organizations, SCPs, and AWS Control Tower |  | `lesson-06-multi-account-strategy.html` | K1.1.1, S1.1.4: OUs, SCPs as guardrails that never grant, Control Tower landing zone and controls |
| 07 | Workforce Federation: IAM Identity Center vs IAM SAML Federation vs AWS Directory Service | TO | `lesson-07-workforce-federation.html` | K1.1.2, S1.1.6: the recommended path is IAM Identity Center; SAML 2.0 to IAM roles and AD Connector or AWS Managed Microsoft AD as the cases that still call for them |

### Module 1.2: Design secure workloads and applications

Objectives, mapped to chapters:

    K1.2.1  Application configuration and credentials security ........ Ch 12
    K1.2.2  AWS service endpoints ..................................... Ch 10
    K1.2.3  Control ports, protocols, and network traffic on AWS ...... Ch 09
    K1.2.4  Secure application access ................................. Ch 13
    K1.2.5  Security services with use cases (Cognito, GuardDuty,
            Macie) ............................................... Ch 13, 14
    K1.2.6  Threat vectors external to AWS (DDoS, SQL injection) ...... Ch 11
    S1.2.1  Designing VPC architectures with security components
            (security groups, route tables, NACLs, NAT gateways) .. Ch 08, 09
    S1.2.2  Determining network segmentation strategies (public and
            private subnets) .......................................... Ch 08
    S1.2.3  Integrating AWS services to secure applications (Shield,
            WAF, IAM Identity Center, Secrets Manager) ....... Ch 11, 12 (07)
    S1.2.4  Securing external network connections (VPN, Direct
            Connect) .................................................. Ch 15

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 08 | VPC Fundamentals: CIDR Blocks, Subnets, Route Tables, Internet and NAT Gateways |  | `lesson-08-vpc-fundamentals.html` | S1.2.1, S1.2.2: what makes a subnet public, private-subnet egress through a NAT gateway, tiered segmentation. NAT cost is Ch 74; CIDR planning at scale is Ch 56 |
| 09 | Security Groups vs Network ACLs | TO | `lesson-09-security-groups-vs-nacls.html` | K1.2.3, S1.2.1: stateful vs stateless, allow-only vs allow and deny, instance vs subnet scope, ephemeral ports |
| 10 | VPC Endpoints: Gateway Endpoints vs Interface Endpoints (AWS PrivateLink) | TO | `lesson-10-vpc-endpoints.html` | K1.2.2: reaching AWS services without the internet; endpoint policies. The cost angle returns in Ch 73 |
| 11 | Perimeter Protection: AWS WAF, AWS Shield, AWS Firewall Manager, and AWS Network Firewall |  | `lesson-11-perimeter-protection.html` | K1.2.6, S1.2.3: layer 7 rules (SQL injection, rate limits) vs DDoS protection vs VPC traffic inspection, and central policy across accounts |
| 12 | Application Secrets: AWS Secrets Manager vs Systems Manager Parameter Store | TO | `lesson-12-secrets-manager-vs-parameter-store.html` | K1.2.1, S1.2.3: rotation, cross-account, cost; never in code or AMIs |
| 13 | Securing Application Sign-In with Amazon Cognito: User Pools and Identity Pools |  | `lesson-13-amazon-cognito.html` | K1.2.4, K1.2.5: authentication vs AWS credentials for app users, integration with ALB and API Gateway |
| 14 | Threat Detection and Posture: GuardDuty, Macie, Inspector, Security Hub, Detective |  | `lesson-14-threat-detection.html` | K1.2.5: which service answers which question (threats, sensitive data, vulnerabilities, aggregation, investigation) |
| 15 | Secure Hybrid Connections: Site-to-Site VPN, Client VPN, and Direct Connect | TO | `lesson-15-secure-hybrid-connections.html` | S1.2.4: encrypted over the internet vs private dedicated line, MACsec and VPN over Direct Connect. Topology is Ch 56; cost and bandwidth are Ch 75 |

### Module 1.3: Determine appropriate data security controls

Objectives, mapped to chapters:

    K1.3.1  Data access and governance ................................ Ch 20
    K1.3.2  Data recovery ...................................... Ch 19 (34)
    K1.3.3  Data retention and classification ..................... Ch 19, 20
    K1.3.4  Encryption and appropriate key management ................. Ch 16
    S1.3.1  Aligning AWS technologies to meet compliance requirements .. Ch 20
    S1.3.2  Encrypting data at rest (AWS KMS) ......................... Ch 16
    S1.3.3  Encrypting data in transit (ACM using TLS) ................ Ch 18
    S1.3.4  Implementing access policies for encryption keys .......... Ch 17
    S1.3.5  Implementing data backups and replications ......... Ch 34 (19)
    S1.3.6  Implementing policies for data access, lifecycle, and
            protection ........................................... Ch 19 (64)
    S1.3.7  Rotating encryption keys and renewing certificates .... Ch 17, 18

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 16 | Encryption at Rest with AWS KMS |  | `lesson-16-kms-encryption-at-rest.html` | K1.3.4, S1.3.2: envelope encryption, AWS owned vs AWS managed vs customer managed keys, SSE-S3 vs SSE-KMS; AWS CloudHSM as the contrast case for single-tenant key custody |
| 17 | KMS Key Policies, Grants, and Key Rotation |  | `lesson-17-kms-key-policies-rotation.html` | S1.3.4, S1.3.7: who can use vs administer a key, cross-account key use, automatic rotation |
| 18 | Encryption in Transit: AWS Certificate Manager, TLS, and Certificate Renewal |  | `lesson-18-encryption-in-transit.html` | S1.3.3, S1.3.7: where TLS terminates (ALB, CloudFront, NLB passthrough), managed renewal, enforcing HTTPS |
| 19 | Protecting S3 Data: Block Public Access, Object Ownership, Versioning, and Object Lock |  | `lesson-19-protecting-s3-data.html` | K1.3.2, K1.3.3, S1.3.6: bucket policies that deny non-TLS or unencrypted writes, versioning and MFA delete, Object Lock retention modes. Lifecycle rules are Ch 64 |
| 20 | Compliance and Data Governance: AWS Config, CloudTrail, AWS Artifact, and Macie |  | `lesson-20-compliance-governance.html` | K1.3.1, K1.3.3, S1.3.1: recording changes and API calls, compliance reports, data classification, retention requirements |

S1.3.5 (backups and replications) is taught once, in Ch 34, which Unit 2 owns
because Task 2.2 asks for the deeper design decision; Ch 19 covers the S3
versioning half of data recovery.

===============================================================================
Unit 2: Design Resilient Architectures (26%)
===============================================================================

Eyebrow label for Unit 2 lessons: "Design Resilient Architectures".

### Module 2.1: Design scalable and loosely coupled architectures

Objectives, mapped to chapters:

    K2.1.1   API creation and management (API Gateway, REST API) ...... Ch 27
    K2.1.2   AWS managed services with use cases (Transfer Family, SQS,
             Secrets Manager) ...................................... Ch 23 (12, 59)
    K2.1.3   Caching strategies .................................. Ch 52 (55)
    K2.1.4   Design principles for microservices (stateless vs
             stateful) ................................................ Ch 21
    K2.1.5   Event-driven architectures ............................... Ch 24
    K2.1.6   Horizontal scaling and vertical scaling .................. Ch 21
    K2.1.7   Edge accelerators (CDN) ............................... Ch (55)
    K2.1.8   How to migrate applications into containers .............. Ch 29
    K2.1.9   Load balancing concepts (ALB) ............................ Ch 22
    K2.1.10  Multi-tier architectures ................................. Ch 22
    K2.1.11  Queuing and messaging concepts (publish/subscribe) .... Ch 23, 24
    K2.1.12  Serverless technologies and patterns (Fargate, Lambda) Ch 26, 29
    K2.1.13  Storage types (object, file, block) ................... Ch (40)
    K2.1.14  The orchestration of containers (ECS, EKS) ............... Ch 29
    K2.1.15  When to use read replicas ............................. Ch (50)
    K2.1.16  Workflow orchestration (Step Functions) .................. Ch 28
    S2.1.1   Designing event-driven, microservice, and multi-tier
             architectures ......................................... Ch 22, 24
    S2.1.2   Determining scaling strategies for components ............ Ch 21
    S2.1.3   Determining the AWS services required for loose coupling . Ch 25
    S2.1.4   Determining when to use containers ....................... Ch 29
    S2.1.5   Determining when to use serverless technologies .......... Ch 26
    S2.1.6   Recommending compute, storage, networking, and database
             technologies ................................. Ch (40, 45, 48, 54)
    S2.1.7   Using purpose-built AWS services for workloads ...... Ch 25 (48)

A chapter number in parentheses is the home chapter in a later module; this
module cites it and does not reteach it.

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 21 | Scaling Out vs Scaling Up, and Designing Stateless Tiers |  | `lesson-21-scaling-and-statelessness.html` | K2.1.4, K2.1.6, S2.1.2: moving session state off the instance (ElastiCache, DynamoDB), why horizontal scaling needs statelessness |
| 22 | Multi-Tier Architectures Behind Elastic Load Balancing |  | `lesson-22-multi-tier-elb.html` | K2.1.9, K2.1.10, S2.1.1: web, app and data tiers, ALB across AZs, target groups and health checks. Choosing ALB vs NLB vs GWLB is Ch 54 |
| 23 | Decoupling with Amazon SQS: Standard vs FIFO, Visibility Timeout, Dead-Letter Queues |  | `lesson-23-amazon-sqs.html` | K2.1.2, K2.1.11: buffering spikes, at-least-once vs exactly-once processing, long polling |
| 24 | Publish/Subscribe and Events: Amazon SNS Fan-Out and Amazon EventBridge Rules |  | `lesson-24-sns-and-eventbridge.html` | K2.1.5, K2.1.11, S2.1.1: SNS to SQS fan-out, EventBridge event buses, rules and targets, filtering |
| 25 | Choosing a Messaging Service: SQS vs SNS vs EventBridge vs Amazon MQ | TO | `lesson-25-choosing-messaging.html` | S2.1.3, S2.1.7: four options; Amazon MQ wins only when existing apps speak JMS, AMQP or MQTT and cannot be rewritten |
| 26 | Serverless with AWS Lambda: Event Sources, Concurrency, and When Serverless Fits |  | `lesson-26-aws-lambda.html` | K2.1.12, S2.1.5: synchronous vs asynchronous invocation, reserved and provisioned concurrency, the 15-minute limit as a design signal. Memory sizing is Ch 45 |
| 27 | Amazon API Gateway: REST vs HTTP vs WebSocket APIs |  | `lesson-27-api-gateway.html` | K2.1.1: API types, stages, throttling and usage plans, caching, authorizers. Throttling for cost returns in Ch 76 |
| 28 | Workflow Orchestration with AWS Step Functions |  | `lesson-28-step-functions.html` | K2.1.16: Standard vs Express workflows, retries and catch, human approval steps, instead of chaining Lambdas |
| 29 | Containers on AWS: ECS vs EKS, EC2 Launch Type vs Fargate | TO | `lesson-29-containers-ecs-eks-fargate.html` | K2.1.8, K2.1.12, K2.1.14, S2.1.4: two paired choices (orchestrator, then capacity), Amazon ECR, moving an app into containers; ECS Anywhere and EKS Anywhere for on-premises |

### Module 2.2: Design highly available and/or fault-tolerant architectures

Objectives, mapped to chapters:

    K2.2.1   AWS global infrastructure (AZs, Regions, Route 53) .... Ch 30, 31
    K2.2.2   AWS Managed Services with use cases (Comprehend, Polly) .. Ch 39
    K2.2.3   Basic networking concepts (route tables) ............ Ch 30 (08)
    K2.2.4   DR strategies (backup and restore, pilot light, warm
             standby, active-active, RPO, RTO) ........................ Ch 32
    K2.2.5   Distributed design patterns .............................. Ch 30
    K2.2.6   Failover strategies ................................... Ch 31, 33
    K2.2.7   Immutable infrastructure ................................. Ch 36
    K2.2.8   Load balancing concepts (ALB) ....................... Ch 30 (22)
    K2.2.9   Proxy concepts (RDS Proxy) ......................... Ch 38 (53)
    K2.2.10  Service quotas and throttling (standby environment quotas) Ch 35
    K2.2.11  Storage options and characteristics (durability,
             replication) ............................................. Ch 34
    K2.2.12  Workload visibility (X-Ray) .............................. Ch 37
    S2.2.1   Determining automation strategies for infrastructure
             integrity ................................................ Ch 36
    S2.2.2   Determining the services for HA across Regions or AZs .. Ch 30, 33
    S2.2.3   Identifying metrics based on business requirements ....... Ch 37
    S2.2.4   Implementing designs to mitigate single points of failure  Ch 30
    S2.2.5   Implementing strategies for data durability and
             availability (backups) ................................... Ch 34
    S2.2.6   Selecting an appropriate DR strategy ..................... Ch 32
    S2.2.7   Improving reliability of legacy applications when
             application changes are not possible ..................... Ch 38
    S2.2.8   Using purpose-built AWS services for workloads ........... Ch 39

Note on K2.2.2: the guide writes "AWS Managed Services (AMS)" but its examples
(Comprehend, Polly) are AI services, not the AMS operations offering. Ch 39
teaches the examples (purpose-built managed AI services as building blocks);
the AMS operations service is not in the guide's in-scope list and is not
taught.

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 30 | Eliminating Single Points of Failure: Multi-AZ vs Multi-Region Design |  | `lesson-30-multi-az-multi-region.html` | K2.2.1, K2.2.5, S2.2.2, S2.2.4: static stability, spreading tiers across AZs, what changes when the blast radius is a Region |
| 31 | Amazon Route 53 Routing Policies and Health Checks for Failover |  | `lesson-31-route-53-failover.html` | K2.2.1, K2.2.6: simple, weighted, latency, failover, geolocation, geoproximity, multivalue; alias records |
| 32 | Disaster Recovery Strategies Against RPO and RTO | TO | `lesson-32-disaster-recovery.html` | K2.2.4, S2.2.6: backup and restore, pilot light, warm standby, multi-site active-active; the RPO and RTO numbers are the signal |
| 33 | Database High Availability: RDS Multi-AZ, Aurora Replicas and Global Database, DynamoDB Global Tables |  | `lesson-33-database-high-availability.html` | K2.2.6, S2.2.2: standby vs readable standby, failover times, cross-Region replicas. Read scaling is Ch 50 |
| 34 | Data Durability: AWS Backup, Snapshots, and Cross-Region Replication |  | `lesson-34-data-durability-backup.html` | K2.2.11, S2.2.5, S1.3.5: backup plans and vaults, cross-Region and cross-account copies, S3 Replication, EBS snapshots, EFS replication |
| 35 | Service Quotas and Throttling, Including the Standby Environment |  | `lesson-35-service-quotas-throttling.html` | K2.2.10: quotas per Region and account, raising quotas in the DR Region before you need them, retries with backoff |
| 36 | Immutable Infrastructure and Automation with AWS CloudFormation |  | `lesson-36-immutable-infrastructure.html` | K2.2.7, S2.2.1: replace, never patch in place; golden AMIs, stacks and StackSets, blue/green; Systems Manager for drift and patching |
| 37 | Workload Visibility: CloudWatch Alarms, AWS X-Ray, and Availability Metrics |  | `lesson-37-workload-visibility.html` | K2.2.12, S2.2.3: choosing the metric the business cares about, composite alarms, tracing a request across services |
| 38 | Making Legacy Applications Reliable Without Code Changes |  | `lesson-38-legacy-reliability.html` | K2.2.9, S2.2.7: Auto Scaling group of one for self-healing, ALB in front, RDS Proxy for connection storms, AWS Application Migration Service for rehosting |
| 39 | Purpose-Built AI Services as Architecture Components |  | `lesson-39-purpose-built-ai-services.html` | K2.2.2, S2.2.8: Comprehend, Polly, Rekognition, Textract, Transcribe, Translate, Lex, and where SageMaker AI begins; buy the managed capability before building one |

===============================================================================
Unit 3: Design High-Performing Architectures (24%)
===============================================================================

Eyebrow label for Unit 3 lessons: "Design High-Performing Architectures".

### Module 3.1: Determine high-performing and/or scalable storage solutions

Objectives, mapped to chapters:

    K3.1.1  Hybrid storage solutions .................................. Ch 44
    K3.1.2  Storage services with use cases (S3, EFS, EBS) ............ Ch 40
    K3.1.3  Storage types (object, file, block) ....................... Ch 40
    S3.1.1  Determining storage services and configurations that meet
            performance demands ............................... Ch 41, 42, 43
    S3.1.2  Determining storage services that scale for future needs  Ch 40, 42

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 40 | Object, File, or Block: Amazon S3 vs Amazon EFS vs Amazon EBS | TO | `lesson-40-object-file-block.html` | K3.1.2, K3.1.3, S3.1.2: access pattern, sharing across instances, AZ scope, scale ceiling |
| 41 | Amazon EBS Volume Types and Performance: gp3, io2, st1, sc1 |  | `lesson-41-ebs-volume-types.html` | S3.1.1: IOPS vs throughput, provisioning gp3 independently, instance store as the ephemeral contrast. Cost sizing is Ch 65 |
| 42 | Amazon S3 Performance: Multipart Upload, Transfer Acceleration, Prefixes, Byte-Range Fetches |  | `lesson-42-s3-performance.html` | S3.1.1, S3.1.2: request rates per prefix, parallelism, S3 Express One Zone for single-digit millisecond access (verify current name at authoring) |
| 43 | Amazon FSx: Windows File Server, Lustre, NetApp ONTAP, OpenZFS | TO | `lesson-43-amazon-fsx.html` | S3.1.1: SMB and Active Directory vs HPC scratch with S3 linking vs multiprotocol lift-and-shift |
| 44 | Hybrid Storage with AWS Storage Gateway |  | `lesson-44-storage-gateway.html` | K3.1.1: S3 File Gateway, FSx File Gateway, Volume Gateway, Tape Gateway; local cache with cloud backing (verify which gateway types are still open to new customers at authoring) |

### Module 3.2: Design high-performing and elastic compute solutions

Objectives, mapped to chapters:

    K3.2.1  AWS compute services with use cases (Batch, EMR, Fargate) Ch 47 (29)
    K3.2.2  Distributed computing concepts supported by global
            infrastructure and edge services ...................... Ch (57)
    K3.2.3  Queuing and messaging concepts (publish/subscribe) . Ch 46 (23)
    K3.2.4  Scalability capabilities (EC2 Auto Scaling, AWS Auto
            Scaling) .................................................. Ch 46
    K3.2.5  Serverless technologies and patterns (Lambda, Fargate) Ch 45 (26)
    K3.2.6  The orchestration of containers (ECS, EKS) ............. Ch (29)
    S3.2.1  Decoupling workloads so components scale independently .... Ch 46
    S3.2.2  Identifying metrics and conditions to perform scaling ..... Ch 46
    S3.2.3  Selecting compute options and features (EC2 instance
            types) .................................................... Ch 45
    S3.2.4  Selecting resource type and size (Lambda memory) .......... Ch 45

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 45 | Right-Sizing Compute for Performance: EC2 Instance Families, Lambda Memory, Fargate Task Size |  | `lesson-45-right-sizing-compute.html` | K3.2.5, S3.2.3, S3.2.4: general, compute, memory, storage and accelerated families, Graviton, Lambda memory buys CPU |
| 46 | EC2 Auto Scaling: Scaling Policies, Metrics, and Scaling Workers from a Queue |  | `lesson-46-ec2-auto-scaling.html` | K3.2.3, K3.2.4, S3.2.1, S3.2.2: target tracking, step, scheduled and predictive scaling, backlog per instance, warm pools, AWS Auto Scaling plans |
| 47 | Batch and Big Data Compute: AWS Batch vs Amazon EMR | TO | `lesson-47-batch-vs-emr.html` | K3.2.1: containerized job queues vs Spark and Hadoop clusters, Spot capacity in both |

### Module 3.3: Determine high-performing database solutions

Objectives, mapped to chapters:

    K3.3.1  AWS global infrastructure (AZs, Regions) .......... Ch 50 (33)
    K3.3.2  Caching strategies and services (ElastiCache) ............. Ch 52
    K3.3.3  Data access patterns (read-intensive vs write-intensive) Ch 48, 50
    K3.3.4  Database capacity planning (capacity units, instance types,
            Provisioned IOPS) ..................................... Ch 49, 51
    K3.3.5  Database connections and proxies .......................... Ch 53
    K3.3.6  Database engines with use cases (heterogeneous and
            homogeneous migrations) ......................... Ch 49 (72)
    K3.3.7  Database replication (read replicas) ...................... Ch 50
    K3.3.8  Database types and services (serverless, relational vs
            non-relational, in-memory) ................................ Ch 48
    S3.3.1  Configuring read replicas to meet business requirements ... Ch 50
    S3.3.2  Designing database architectures ...................... Ch 48, 49
    S3.3.3  Determining an appropriate engine (MySQL vs PostgreSQL) ... Ch 49
    S3.3.4  Determining an appropriate database type (Aurora,
            DynamoDB) ................................................. Ch 48
    S3.3.5  Integrating caching to meet business requirements ......... Ch 52

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 48 | Choosing a Database Type: Relational, Key-Value, Document, Graph, Wide-Column, In-Memory, Warehouse | TO | `lesson-48-choosing-database-type.html` | K3.3.3, K3.3.8, S3.3.2, S3.3.4: RDS and Aurora, DynamoDB, DocumentDB, Neptune, Keyspaces, ElastiCache, Redshift; the access pattern is the signal |
| 49 | Amazon RDS vs Amazon Aurora, and Choosing an Engine | TO | `lesson-49-rds-vs-aurora.html` | K3.3.4, K3.3.6, S3.3.2, S3.3.3: shared cluster storage vs per-instance EBS, MySQL vs PostgreSQL compatibility, Provisioned IOPS, Aurora Serverless v2 |
| 50 | Read Replicas for Read-Heavy Workloads |  | `lesson-50-read-replicas.html` | K3.3.1, K3.3.3, K3.3.7, S3.3.1: asynchronous replication and lag, reader endpoints, cross-Region replicas, read replica vs Multi-AZ standby |
| 51 | Amazon DynamoDB Performance: Partition Keys, Capacity Modes, and DAX |  | `lesson-51-dynamodb-performance.html` | K3.3.4: hot partitions, on-demand vs provisioned with auto scaling, GSIs, DAX for microsecond reads |
| 52 | Caching with Amazon ElastiCache: Lazy Loading vs Write-Through | TO | `lesson-52-elasticache-caching.html` | K2.1.3, K3.3.2, S3.3.5: TTLs and stale data, engine choice (verify current engine names at authoring: Valkey, Redis OSS, Memcached), serverless option |
| 53 | Database Connections and Amazon RDS Proxy |  | `lesson-53-rds-proxy.html` | K3.3.5: connection pooling for Lambda bursts, faster failover, IAM auth and Secrets Manager integration |

### Module 3.4: Determine high-performing and/or scalable network architectures

Objectives, mapped to chapters:

    K3.4.1  Edge networking services (CloudFront, Global Accelerator) . Ch 55
    K3.4.2  How to design network architecture (subnet tiers, routing,
            IP addressing) ................................... Ch 56 (08)
    K3.4.3  Load balancing concepts (ALB) ............................. Ch 54
    K3.4.4  Network connection options (VPN, Direct Connect,
            PrivateLink) ................................ Ch 56 (10, 15)
    S3.4.1  Creating a network topology (global, hybrid, multi-tier) .. Ch 56
    S3.4.2  Determining network configurations that scale for future
            needs ..................................................... Ch 56
    S3.4.3  Determining placement of resources ........................ Ch 57
    S3.4.4  Selecting the appropriate load balancing strategy ......... Ch 54

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 54 | Choosing a Load Balancer: ALB vs NLB vs GWLB | TO | `lesson-54-choosing-load-balancer.html` | K3.4.3, S3.4.4, S4.2.1: layer 7 routing vs layer 4 static IPs and extreme throughput vs inline appliances; cross-zone load balancing |
| 55 | Edge Networking: Amazon CloudFront vs AWS Global Accelerator | TO | `lesson-55-cloudfront-vs-global-accelerator.html` | K2.1.7, K3.4.1: caching HTTP content vs anycast IPs for TCP and UDP, origin failover, Lambda@Edge and CloudFront Functions |
| 56 | Connecting VPCs at Scale: Peering vs Transit Gateway vs PrivateLink | TO | `lesson-56-connecting-vpcs.html` | K3.4.2, K3.4.4, S3.4.1, S3.4.2: non-overlapping CIDR planning, transitive routing, hub-and-spoke with hybrid attachments, AWS RAM for sharing subnets |
| 57 | Resource Placement: Placement Groups, Local Zones, AWS Wavelength, AWS Outposts |  | `lesson-57-resource-placement.html` | K3.2.2, S3.4.3, K4.2.5, K4.2.6: cluster vs spread vs partition, putting compute near users or on premises |

### Module 3.5: Determine high-performing data ingestion and transformation solutions

Objectives, mapped to chapters:

    K3.5.1  Data analytics and visualization services (Athena, Lake
            Formation, Amazon Quick) .............................. Ch 60, 62
    K3.5.2  Data ingestion patterns (frequency) ....................... Ch 58
    K3.5.3  Data transfer services (DataSync, Storage Gateway) ... Ch 59 (44)
    K3.5.4  Data transformation services (Glue) ....................... Ch 61
    K3.5.5  Secure access to ingestion access points ............... Ch 58, 60
    K3.5.6  Sizes and speeds needed to meet business requirements ..... Ch 59
    K3.5.7  Streaming data services (Kinesis) ......................... Ch 58
    S3.5.1  Building and securing data lakes .......................... Ch 60
    S3.5.2  Designing data streaming architectures .................... Ch 58
    S3.5.3  Designing data transfer solutions ......................... Ch 59
    S3.5.4  Implementing visualization strategies ..................... Ch 62
    S3.5.5  Selecting compute options for data processing (EMR) . Ch 61 (47)
    S3.5.6  Selecting appropriate configurations for ingestion ........ Ch 58
    S3.5.7  Transforming data between formats (.csv to .parquet) ...... Ch 61

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 58 | Streaming Ingestion: Kinesis Data Streams vs Amazon Data Firehose vs Amazon MSK | TO | `lesson-58-streaming-ingestion.html` | K3.5.2, K3.5.5, K3.5.7, S3.5.2, S3.5.6: shards and consumers vs managed delivery with buffering vs Kafka compatibility |
| 59 | Moving Data into AWS: DataSync vs Transfer Family vs Physical Transfer | TO | `lesson-59-moving-data-into-aws.html` | K3.5.3, K3.5.6, S3.5.3: online sync vs SFTP endpoints vs shipping data; size and link speed as the signal. Snowball Edge is closed to new customers (see terminology), so the physical option is AWS Data Transfer Terminal |
| 60 | Building and Securing a Data Lake: S3, the AWS Glue Data Catalog, and AWS Lake Formation |  | `lesson-60-data-lake.html` | K3.5.1, K3.5.5, S3.5.1: zones on S3, crawlers, fine-grained table and column permissions |
| 61 | Transforming Data with AWS Glue and Amazon EMR: CSV to Parquet |  | `lesson-61-transforming-data.html` | K3.5.4, S3.5.5, S3.5.7: serverless Glue ETL vs EMR for heavy or custom processing, columnar formats and partitioning for Athena |
| 62 | Querying and Visualizing: Athena vs Redshift vs OpenSearch Service, and Amazon Quick | TO | `lesson-62-querying-visualizing.html` | K3.5.1, S3.5.4: ad hoc SQL on S3 vs warehouse vs search and log analytics, then dashboards |

===============================================================================
Unit 4: Design Cost-Optimized Architectures (20%)
===============================================================================

Eyebrow label for Unit 4 lessons: "Design Cost-Optimized Architectures".

The two cost-tool knowledge items (cost management features, cost management
tools) repeat verbatim in all four task statements (K4.1.2, K4.1.3, K4.2.1,
K4.2.2, K4.3.1, K4.3.2, K4.4.1, K4.4.2). Ch 63 teaches them once, at the start
of the unit; every other Unit 4 chapter applies them.

### Module 4.1: Design cost-optimized storage solutions

Objectives, mapped to chapters:

    K4.1.1   Access options (S3 Requester Pays) ....................... Ch 66
    K4.1.2   Cost management features (cost allocation tags,
             multi-account billing) ................................... Ch 63
    K4.1.3   Cost management tools (Cost Explorer, Budgets, CUR) ...... Ch 63
    K4.1.4   Storage services with use cases (FSx, EFS, S3, EBS) ...... Ch 65
    K4.1.5   Backup strategies ........................................ Ch 67
    K4.1.6   Block storage options (HDD and SSD volume types) .... Ch 65 (41)
    K4.1.7   Data lifecycles .......................................... Ch 64
    K4.1.8   Hybrid storage options (DataSync, Transfer Family,
             Storage Gateway) ............................ Ch 66 (44, 59)
    K4.1.9   Storage access patterns .................................. Ch 64
    K4.1.10  Storage tiering (cold tiering for object storage) ......... Ch 64
    K4.1.11  Storage types (object, file, block) ................... Ch (40)
    S4.1.1   Designing storage strategies (batch vs individual uploads)  Ch 66
    S4.1.2   Determining the correct storage size for a workload ...... Ch 65
    S4.1.3   Determining the lowest cost method of transferring data .. Ch 66
    S4.1.4   Determining when storage auto scaling is required ........ Ch 65
    S4.1.5   Managing S3 object lifecycles ............................ Ch 64
    S4.1.6   Selecting the appropriate backup and/or archival solution  Ch 67
    S4.1.7   Selecting the service for data migration to storage ...... Ch 66
    S4.1.8   Selecting the appropriate storage tier ................... Ch 64
    S4.1.9   Selecting the correct data lifecycle for storage ......... Ch 64
    S4.1.10  Selecting the most cost-effective storage service ........ Ch 65

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 63 | Cost Visibility: Cost Explorer, AWS Budgets, the Cost and Usage Report, and Cost Allocation Tags |  | `lesson-63-cost-visibility.html` | K4.1.2, K4.1.3 (and their repeats in 4.2 to 4.4): consolidated billing in Organizations, tags that must be activated, forecasting vs alerting vs line-item detail |
| 64 | S3 Storage Classes and Lifecycle Rules | TO | `lesson-64-s3-storage-classes-lifecycle.html` | K4.1.7, K4.1.9, K4.1.10, S4.1.5, S4.1.8, S4.1.9: Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, the three S3 Glacier classes; minimum durations and retrieval fees as the trap |
| 65 | Right-Sizing Storage: EBS gp3, EFS and FSx Tiers, and Storage Auto Scaling |  | `lesson-65-right-sizing-storage.html` | K4.1.4, K4.1.6, S4.1.2, S4.1.4, S4.1.10: gp2 to gp3, HDD for throughput-bound cold data, EFS Infrequent Access and Archive, RDS storage autoscaling |
| 66 | The Cheapest Path into Storage: Upload Strategy, Requester Pays, and Transfer Method |  | `lesson-66-cheapest-path-into-storage.html` | K4.1.1, K4.1.8, S4.1.1, S4.1.3, S4.1.7: batching small objects, who pays for egress, online vs offline transfer by size and deadline |
| 67 | Backup, Retention, and Archive Policies at the Lowest Cost |  | `lesson-67-backup-retention-cost.html` | K4.1.5, S4.1.6, K4.3.4, S4.3.1: snapshot frequency vs RPO, AWS Backup lifecycle to cold storage, S3 Glacier Deep Archive for compliance retention |

### Module 4.2: Design cost-optimized compute solutions

Objectives, mapped to chapters:

    K4.2.1  Cost management features ............................... Ch (63)
    K4.2.2  Cost management tools .................................. Ch (63)
    K4.2.3  AWS global infrastructure (AZs, Regions) .................. Ch 69
    K4.2.4  Purchasing options (Spot, Reserved Instances, Savings Plans) Ch 68
    K4.2.5  Distributed compute strategies (edge processing) ...... Ch 69 (57)
    K4.2.6  Hybrid compute options (Outposts) ...................... Ch (57)
    K4.2.7  Instance types, families, and sizes (memory optimized,
            compute optimized, virtualization) ............... Ch 70 (45)
    K4.2.8  Optimization of compute utilization (containers,
            serverless, microservices) ................................ Ch 69
    K4.2.9  Scaling strategies (auto scaling, hibernation) ............ Ch 70
    S4.2.1  Determining a load balancing strategy (ALB vs NLB vs GWLB) Ch (54)
    S4.2.2  Determining scaling methods for elastic workloads
            (horizontal vs vertical, EC2 hibernation) ................. Ch 70
    S4.2.3  Determining cost-effective compute services (Lambda, EC2,
            Fargate) .................................................. Ch 69
    S4.2.4  Determining required availability for workload classes
            (production vs non-production) ............................ Ch 70
    S4.2.5  Selecting the appropriate instance family ................. Ch 70
    S4.2.6  Selecting the appropriate instance size ................... Ch 70

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 68 | EC2 Purchasing Options: On-Demand, Savings Plans, Reserved Instances, and Spot | TO | `lesson-68-purchasing-options.html` | K4.2.4: Compute vs EC2 Instance Savings Plans, Spot interruption tolerance, Dedicated Hosts for licensing, mixing options in one Auto Scaling group |
| 69 | Cost-Effective Compute Services: Lambda vs Fargate vs EC2 | TO | `lesson-69-cost-effective-compute.html` | K4.2.3, K4.2.5, K4.2.8, S4.2.3: utilization and traffic shape as the signal, Graviton price-performance, Regional price differences |
| 70 | Right-Sizing Compute for Cost: Compute Optimizer, Hibernation, and Non-Production Schedules |  | `lesson-70-right-sizing-for-cost.html` | K4.2.7, K4.2.9, S4.2.2, S4.2.4, S4.2.5, S4.2.6: picking family then size from metrics, stopping or hibernating non-production, single-AZ where availability is not required |

### Module 4.3: Design cost-optimized database solutions

Objectives, mapped to chapters:

    K4.3.1  Cost management features ............................... Ch (63)
    K4.3.2  Cost management tools .................................. Ch (63)
    K4.3.3  Caching strategies ................................... Ch 71 (52)
    K4.3.4  Data retention policies ................................... Ch 67
    K4.3.5  Database capacity planning (capacity units) ............... Ch 71
    K4.3.6  Database connections and proxies ....................... Ch (53)
    K4.3.7  Database engines (heterogeneous and homogeneous
            migrations) ............................................... Ch 72
    K4.3.8  Database replication (read replicas) ...................... Ch 71
    K4.3.9  Database types and services (relational vs non-relational,
            Aurora, DynamoDB) ......................................... Ch 71
    S4.3.1  Designing backup and retention policies (snapshot
            frequency) ................................................ Ch 67
    S4.3.2  Determining an appropriate engine (MySQL vs PostgreSQL) . Ch (49)
    S4.3.3  Determining cost-effective database services (DynamoDB vs
            RDS, serverless) .......................................... Ch 71
    S4.3.4  Determining cost-effective database types (time series,
            columnar) ................................................. Ch 71
    S4.3.5  Migrating database schemas and data to different locations
            or engines ................................................ Ch 72

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 71 | Cost-Effective Databases: DynamoDB vs RDS, Serverless vs Provisioned, Caching vs Scaling Up | TO | `lesson-71-cost-effective-databases.html` | K4.3.3, K4.3.5, K4.3.8, K4.3.9, S4.3.3, S4.3.4: on-demand vs provisioned capacity, Aurora Serverless v2 for spiky load, Reserved DB instances, a cache or replica instead of a bigger instance, columnar Redshift for analytics |
| 72 | Database Migration with AWS DMS: Homogeneous vs Heterogeneous | TO | `lesson-72-database-migration-dms.html` | K3.3.6, K4.3.7, S4.3.5: full load plus change data capture, schema conversion for engine changes (verify at authoring whether to name DMS Schema Conversion, AWS SCT, or both) |

### Module 4.4: Design cost-optimized network architectures

Objectives, mapped to chapters:

    K4.4.1  Cost management features ............................... Ch (63)
    K4.4.2  Cost management tools .................................. Ch (63)
    K4.4.3  Load balancing concepts (ALB) ......................... Ch (54)
    K4.4.4  NAT gateways (NAT instance vs NAT gateway costs) .......... Ch 74
    K4.4.5  Network connectivity (private lines, dedicated lines,
            VPNs) ..................................................... Ch 75
    K4.4.6  Network routing, topology, and peering (Transit Gateway,
            VPC peering) ..................................... Ch 73 (56)
    K4.4.7  Network services with use cases (DNS) ............ Ch 73 (31)
    S4.4.1  Configuring NAT gateway types (one shared vs one per AZ) .. Ch 74
    S4.4.2  Configuring network connections (Direct Connect vs VPN vs
            internet) ................................................. Ch 75
    S4.4.3  Configuring routes to minimize transfer costs (Region to
            Region, AZ to AZ, private to public, Global Accelerator,
            VPC endpoints) ............................................ Ch 73
    S4.4.4  Determining strategic needs for CDNs and edge caching ..... Ch 76
    S4.4.5  Reviewing existing workloads for network optimizations .... Ch 73
    S4.4.6  Selecting an appropriate throttling strategy .............. Ch 76
    S4.4.7  Selecting bandwidth allocation (single vs multiple VPNs,
            Direct Connect speed) ..................................... Ch 75

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 73 | Data Transfer Pricing and Cost-Aware Routing |  | `lesson-73-data-transfer-pricing.html` | K4.4.6, K4.4.7, S4.4.3, S4.4.5: what is free, what crosses AZs and Regions, gateway endpoints to bypass NAT processing, peering vs Transit Gateway per-GB charges |
| 74 | NAT for Cost: One Shared NAT Gateway vs One per AZ vs a NAT Instance | TO | `lesson-74-nat-for-cost.html` | K4.4.4, S4.4.1: hourly plus per-GB processing, cross-AZ traffic to a shared gateway, availability given up for savings |
| 75 | Hybrid Connectivity Cost and Bandwidth: Direct Connect vs VPN vs Internet | TO | `lesson-75-hybrid-connectivity-cost.html` | K4.4.5, S4.4.2, S4.4.7: port speeds and hosted connections, lower egress rates on Direct Connect, ECMP across multiple VPN tunnels, lead time |
| 76 | CDN Offload and Throttling to Control Cost |  | `lesson-76-cdn-offload-throttling.html` | S4.4.4, S4.4.6: cache hit ratio and origin egress, CloudFront price classes, API Gateway usage plans and WAF rate limits as cost controls |

Chapter 76 is the last chapter of the course, so its NAV.next is the Unit 4
practice exam (saa-practice-exam-04, "Practice test").

===============================================================================
Cross-reference notes (deliberate syllabus overlap)
===============================================================================

    Load balancers: Ch 22 (multi-tier role), Ch 54 (which type, the home
    chapter), Ch 30 (spreading across AZs). The guide's 4.2 and 4.4 load
    balancing items point to Ch 54.
    NAT gateways: Ch 08 (function), Ch 74 (cost, the home chapter for the
    shared vs per-AZ decision).
    VPC endpoints: Ch 10 (security, the home chapter), Ch 73 (cost).
    Direct Connect and VPN: Ch 15 (secure connection, the home chapter),
    Ch 56 (topology), Ch 75 (cost and bandwidth).
    Read replicas: Ch 50 (home), Ch 33 (contrast with Multi-AZ standby),
    Ch 71 (replica instead of a bigger instance).
    Caching: Ch 52 (ElastiCache, home), Ch 55 (CloudFront), Ch 27 (API
    Gateway cache), Ch 21 (session state), Ch 71 and 76 (cost).
    Backups: Ch 34 (home, AWS Backup and replication), Ch 19 (S3 versioning
    and Object Lock), Ch 67 (retention cost).
    Storage types: Ch 40 (home), cited by 2.1 and 4.1.
    Lambda: Ch 26 (patterns, home), Ch 45 (memory sizing), Ch 69 (cost).
    Containers: Ch 29 (home), Ch 45 (Fargate task size), Ch 69 (cost).
    Data transfer services: Ch 59 (home), Ch 44 (Storage Gateway), Ch 66
    (cheapest method).
    Throttling: Ch 35 (quotas and retries), Ch 27 (API Gateway limits),
    Ch 76 (throttling as a cost control).
    Edge and hybrid placement: Ch 57 (home for Local Zones, Wavelength,
    Outposts), cited by 3.2 and 4.2.

===============================================================================
Practice exam plan
===============================================================================

The guide gives no per-skill weights and 189 bullets cannot map one to one
onto 50 scored questions, so exams map to CHAPTERS (one question per chapter
in scope, as in DEA-C01 and MLA-C02) and the mocks sample at the domain
weights. Question headers read `/* Ch NN - name (K/S ids) */` and every
question carries `ref: { chapter: NN }`.

    Question style: scenario-based, plausible distractors, the "which
    option is MOST cost-effective / LEAST operational overhead" framing the
    real exam uses. 2 minutes per question (130 minutes / 65 questions).
    Pass target: the real cut score is 720 on a 100 to 1,000 scale; use 72%
    as the practice target, matching MLA-C02.
    Multiple response: the engine already supports select-two items (array
    `correct`); use them where the scenario genuinely needs two answers,
    within the validator's share. No other formats are needed.

    Plan (7 exams):
        01  Unit 1 (Ch 01 to 20): 20 questions, 40 min
        02  Unit 2 (Ch 21 to 39): 19 questions, 38 min
        03  Unit 3 (Ch 40 to 62): 23 questions, 46 min
        04  Unit 4 (Ch 63 to 76): 14 questions, 28 min
            (76 section-exam questions in all, one per chapter)
        05  Full mock A: 65 questions, 130 min
        06  Full mock B: 65 questions, 130 min
        07  Full mock C: 65 questions, 130 min

    Full mock domain allocation (the official weights applied to 65):
        Domain 1  20 questions (30%)
        Domain 2  17 questions (26%)
        Domain 3  15 questions (24%, rounded down to keep 65)
        Domain 4  13 questions (20%)
    Five select-two items per mock. Each mock gets its own scenarios
    (proposed: A retail and media, B finance and healthcare, C SaaS,
    gaming and public sector). Mocks are a sealed pool: never reused in the
    section exams and never drawn into the Practice hub's drills.

    Practice hub (later): practice/aws-saa-c03, the MLA-C02 clone in the
    AWS cerulean palette, drilling from exams 01 to 04 by the chapter ranges
    1-20, 21-39, 40-62, 63-76, four bars at the official 30/26/24/20 weights
    ("% of exam"), mocks 05 to 07 as the Full mock pool, pass target 72.

===============================================================================
Terminology and freshness rules (move into cert-config-aws-saa-c03.md)
===============================================================================

    Names as the guide writes them: "AWS IAM Identity Center" (never "AWS
    SSO"), "Amazon SageMaker AI", "Amazon Quick" (formerly Amazon
    QuickSight; mention the old name once in Ch 62), "AWS Health Dashboard",
    "AWS Application Migration Service".
    Repo-wide AWS rules: "Amazon Data Firehose", never "Kinesis Data
    Firehose"; "Amazon Managed Service for Apache Flink", never "Kinesis
    Data Analytics". IAM, CLI and SDK identifiers keep their old names.
    In-scope services that are closed or ended (checked 21 Oct 2026; teach
    the replacement, never hinge a question on the closed service):
      AWS Snowball Edge: "no longer available to new customers" per its
        developer guide; AWS names DataSync, AWS Data Transfer Terminal and
        AWS Outposts as the alternatives. Ch 59 says so once.
      Amazon Glacier (the original vault-based service): "no longer
        accepting new customers"; AWS recommends the S3 Glacier storage
        classes, which is what Ch 64 and 67 teach. "Glacier" in lessons
        always means the S3 Glacier storage classes.
      Amazon Elastic Transcoder: support ended 13 Nov 2025 (AWS docs); AWS
        Elemental MediaConvert is the replacement but is out of scope for
        this exam. No chapter teaches either.
    To verify at authoring (likely renamed or changed since the guide's
    examples were written): ElastiCache engine names (Ch 52), S3 Express One
    Zone (Ch 42), Storage Gateway types still open to new customers (Ch 44),
    DMS Schema Conversion vs AWS SCT (Ch 72), VMware Cloud on AWS status
    (in-scope list, not taught).
    Recommended-vs-contrast stances: IAM Identity Center over IAM users for
    people; roles over access keys; gp3 over gp2; Savings Plans over
    Reserved Instances for new commitments; CloudFormation over manual
    changes. The older option appears only as the contrast case.
