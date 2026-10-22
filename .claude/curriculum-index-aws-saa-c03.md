# Curriculum index: AWS Certified Solutions Architect Associate (SAA-C03)

Status: LOCKED on 21 Oct 2026 by the user (89 chapters, skill-based 1:1).
Settings live in cert-config-aws-saa-c03.md.
Built on 21 Oct 2026 by downloading the official exam guide PDF from
docs.aws.amazon.com
(docs.aws.amazon.com/pdfs/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.pdf)
and extracting its text; every task statement, knowledge item and skill below is
transcribed from that PDF, not from third-party outlines. Reworked the same day
from a 76-chapter service-based draft to the skill-based 1:1 mapping below, at
the user's request. Once locked, this file is the authoritative source for
unit, module and chapter placement: a later request that conflicts with it gets
flagged with a proposed one-line fix rather than silently absorbed.

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

===============================================================================
Mapping model: one chapter per skill, plus 10 K-anchored chapters
===============================================================================

Structure: 4 units mirroring the 4 domains, each split into modules that
mirror the guide's task statements (Module 1.1 is Task 1.1), the same
three-level model as MLA-C02. Continuous chapter numbering 01 to 89. Lesson
cover eyebrows read "Unit N · Module N.M · Chapter NN"; the course index.html
nests `modules:[...]` inside each unit. TO marks a trade-off chapter (fixed
trade-off lesson pattern). Within a module, skill chapters follow the guide's
skill order and each K-anchored chapter sits next to the skill it supports.

Objective numbering: the guide lists knowledge items and skills as unnumbered
bullets. This index numbers them in guide order, K for knowledge and S for
skill (S1.2.3 is the third "Skills in" bullet under Task 1.2). The numbers are
ours, not AWS's; exam question headers cite them, so never renumber after
lock. The guide has 189 bullets (107 knowledge items, 82 skills), and every
one is mapped below.

Why skills are the objective unit: AWS's newer guides (AIF-C01 v1.1,
MLA-C02) drop the knowledge lists and number only the skills, so a skill is
AWS's own unit of "what is tested". SAA-C03 still uses the older two-list
format, where knowledge items are the background a skill draws on; many
repeat across tasks (the two cost-tool items appear in all four Domain 4
tasks).

How 82 skills become 79 skill chapters:

    82  skills in the guide
    -3  cross-domain repeats share one chapter, cited by both ids:
          S2.1.7 = S2.2.8 (purpose-built services) ........... Ch 32
          S3.3.3 = S4.3.2 (MySQL vs PostgreSQL) .............. Ch 49
          S3.4.4 = S4.2.1 (load balancing strategy) .......... Ch 55
    -1  S2.1.6 ("recommending compute, storage, networking, and database
          technologies") is a catch-all for all of Unit 3; it has no chapter
          of its own and maps to Ch 42, 45, 50 and 55
    +2  bundled skills split (the Spark course rule):
          S1.2.1 into routing and egress (Ch 09) and security groups vs
            NACLs (Ch 10)
          S1.2.3 into perimeter protection (Ch 12) and application secrets
            (Ch 13); its IAM Identity Center example cites Ch 07
    -1  S4.1.5 (managing S3 object lifecycles) and S4.1.9 (selecting the
          correct data lifecycle) are one decision and share Ch 68
    ---
    79  skill chapters

The 10 K-anchored chapters: knowledge items with no matching skill that are
central to the exam and too large to fold into a skill chapter without
pushing it past 12 cards. Each is tagged K in the tables below.

    Ch 01  AWS global infrastructure and the shared responsibility model
    Ch 11  VPC endpoints
    Ch 14  Amazon Cognito
    Ch 15  Threat detection services
    Ch 26  Amazon SQS
    Ch 30  Amazon API Gateway
    Ch 31  AWS Step Functions
    Ch 35  Amazon Route 53
    Ch 63  Cost visibility tools
    Ch 73  EC2 purchasing options

Knowledge-only topics folded into a skill chapter instead (small enough to
fit as scope):

    Service quotas and throttling (K2.2.10) ........ DR strategy, Ch 39
    RDS Proxy (K2.2.9, K3.3.5) ..................... legacy reliability,
                                                     Ch 40, and Ch 48
    AWS Batch vs Amazon EMR (K3.2.1) ............... data processing
                                                     compute, Ch 60
    DynamoDB capacity planning (K3.3.4) ............ database cost, Ch 80
    AWS Storage Gateway (K3.1.1) ................... hybrid storage and
                                                     migration, Ch 70
    CloudFront vs Global Accelerator (K3.4.1) ...... CDN and edge, Ch 86

Totals: 79 skill chapters plus 10 K-anchored chapters = 89 chapters.

Chapter counts by unit (23/17/22/27) do not track the domain weights
(30/26/24/20) because Domain 4 has the most skills (27 of 82) while Domain 2
has the fewest per point of weight. Practice exams sample at the official
weights regardless (see the plan).

Heavy chapters to watch at authoring (expected at or near 12 cards):
Ch 41 (storage performance spans block, object and file), Ch 50 (seven
database types in the trade-off pattern: shared ground, seven option cards,
table, signal, two quizzes = 12). If either needs more, propose a split as a
one-line index fix.

In the mapping tables, a chapter in parentheses is the home chapter in
another module: the objective is cited there, not retaught.

===============================================================================
Unit 1: Design Secure Architectures (30%) · Chapters 01 to 23
===============================================================================

Eyebrow label for Unit 1 lessons: "Design Secure Architectures".

### Module 1.1: Design secure access to AWS resources

| Id | Objective (from the guide) | Ch |
| --- | --- | --- |
| K1.1.1 | Access controls and management across multiple accounts | 05 |
| K1.1.2 | AWS federated access and identity services (IAM, IAM Identity Center) | 03, 07 |
| K1.1.3 | AWS global infrastructure (Availability Zones, Regions) | 01 |
| K1.1.4 | AWS security best practices (principle of least privilege) | 02 |
| K1.1.5 | The AWS shared responsibility model | 01 |
| S1.1.1 | Applying security best practices to IAM users and root users (MFA) | 02 |
| S1.1.2 | Designing a flexible authorization model (IAM users, groups, roles, policies) | 03 |
| S1.1.3 | Designing a role-based access control strategy (AWS STS, role switching, cross-account access) | 04 |
| S1.1.4 | Designing a security strategy for multiple accounts (AWS Control Tower, SCPs) | 05 |
| S1.1.5 | Determining the appropriate use of resource policies for AWS services | 06 |
| S1.1.6 | Determining when to federate a directory service with IAM roles | 07 |

| Ch | Title | Anchor | TO | Planned file | Scope |
| --- | --- | --- | --- | --- | --- |
| 01 | AWS Global Infrastructure and the Shared Responsibility Model | K1.1.3, K1.1.5 |  | `lesson-01-global-infrastructure.html` | Regions, AZs, edge locations; what AWS secures vs what the customer secures by service type (EC2 vs managed vs serverless). The orientation chapter |
| 02 | Locking Down the Root User and IAM Users: MFA, Access Keys, Least Privilege | S1.1.1 |  | `lesson-02-root-and-iam-users.html` | K1.1.4: root-only tasks, MFA everywhere, no long-term keys, least privilege as the default |
| 03 | A Flexible Authorization Model: Users, Groups, Roles, Policies, and How AWS Evaluates Them | S1.1.2 |  | `lesson-03-authorization-model.html` | K1.1.2: managed vs inline policies, explicit deny wins, permissions boundaries, groups for people and roles for workloads |
| 04 | Role-Based Access with AWS STS: Role Switching and Cross-Account Access | S1.1.3 |  | `lesson-04-roles-sts-cross-account.html` | Trust policy vs permissions policy, AssumeRole, instance profiles, external IDs |
| 05 | Multi-Account Security Strategy: AWS Organizations, SCPs, and AWS Control Tower | S1.1.4 |  | `lesson-05-multi-account-strategy.html` | K1.1.1: OUs, SCPs as guardrails that never grant, Control Tower landing zone and controls |
| 06 | Resource-Based Policies vs Identity-Based Policies | S1.1.5 | TO | `lesson-06-resource-vs-identity-policies.html` | S3 bucket, KMS key, Lambda and SQS resource policies; when cross-account needs a resource policy and when a role is cleaner |
| 07 | Federating a Directory: IAM Identity Center vs IAM SAML Federation vs AWS Directory Service | S1.1.6 | TO | `lesson-07-directory-federation.html` | K1.1.2: IAM Identity Center is the recommended path; SAML 2.0 to IAM roles and AD Connector or AWS Managed Microsoft AD as the cases that still call for them |

### Module 1.2: Design secure workloads and applications

| Id | Objective (from the guide) | Ch |
| --- | --- | --- |
| K1.2.1 | Application configuration and credentials security | 13 |
| K1.2.2 | AWS service endpoints | 11 |
| K1.2.3 | Control ports, protocols, and network traffic on AWS | 10 |
| K1.2.4 | Secure application access | 14 |
| K1.2.5 | Security services with appropriate use cases (Cognito, GuardDuty, Macie) | 14, 15 |
| K1.2.6 | Threat vectors external to AWS (DDoS, SQL injection) | 12 |
| S1.2.1 | Designing VPC architectures with security components (security groups, route tables, NACLs, NAT gateways) | 09, 10 |
| S1.2.2 | Determining network segmentation strategies (public and private subnets) | 08 |
| S1.2.3 | Integrating AWS services to secure applications (Shield, WAF, IAM Identity Center, Secrets Manager) | 12, 13 (07) |
| S1.2.4 | Securing external network connections to and from the AWS Cloud (VPN, Direct Connect) | 16 |

| Ch | Title | Anchor | TO | Planned file | Scope |
| --- | --- | --- | --- | --- | --- |
| 08 | Network Segmentation: Public Subnets, Private Subnets, and Subnet Tiers | S1.2.2 |  | `lesson-08-network-segmentation.html` | VPC and CIDR basics, what makes a subnet public, web, app and data tiers. CIDR planning at scale is Ch 53 |
| 09 | Routing and Egress: Route Tables, Internet Gateways, and NAT Gateways | S1.2.1 (part) |  | `lesson-09-routing-and-egress.html` | Route table targets, private-subnet egress through a NAT gateway, egress-only internet gateways for IPv6. NAT cost is Ch 83 |
| 10 | Security Groups vs Network ACLs | S1.2.1 (part) | TO | `lesson-10-security-groups-vs-nacls.html` | K1.2.3: stateful vs stateless, allow-only vs allow and deny, instance vs subnet scope, ephemeral ports |
| 11 | VPC Endpoints: Gateway Endpoints vs Interface Endpoints (AWS PrivateLink) | K1.2.2 | TO | `lesson-11-vpc-endpoints.html` | Reaching AWS services without the internet, endpoint policies. The cost angle returns in Ch 85 |
| 12 | Perimeter Protection: AWS WAF, AWS Shield, AWS Firewall Manager, and AWS Network Firewall | S1.2.3 (part) |  | `lesson-12-perimeter-protection.html` | K1.2.6: layer 7 rules (SQL injection, rate limits) vs DDoS protection vs VPC traffic inspection, central policy across accounts |
| 13 | Application Secrets: AWS Secrets Manager vs Systems Manager Parameter Store | S1.2.3 (part) | TO | `lesson-13-secrets-manager-vs-parameter-store.html` | K1.2.1: rotation, cross-account access, cost; never in code, AMIs or environment files |
| 14 | Securing Application Sign-In with Amazon Cognito: User Pools and Identity Pools | K1.2.4, K1.2.5 |  | `lesson-14-amazon-cognito.html` | Authentication vs AWS credentials for app users, integration with ALB and API Gateway |
| 15 | Threat Detection and Posture: GuardDuty, Macie, Inspector, Security Hub, Detective | K1.2.5 |  | `lesson-15-threat-detection.html` | Which service answers which question: threats, sensitive data, vulnerabilities, aggregation, investigation |
| 16 | Securing External Connections: Site-to-Site VPN, Client VPN, and Direct Connect | S1.2.4 | TO | `lesson-16-secure-external-connections.html` | Encrypted over the internet vs private dedicated line, MACsec and VPN over Direct Connect. Topology is Ch 52; cost is Ch 84; bandwidth is Ch 89 |

### Module 1.3: Determine appropriate data security controls

| Id | Objective (from the guide) | Ch |
| --- | --- | --- |
| K1.3.1 | Data access and governance | 17 |
| K1.3.2 | Data recovery | 21 |
| K1.3.3 | Data retention and classification | 17, 22 |
| K1.3.4 | Encryption and appropriate key management | 18 |
| S1.3.1 | Aligning AWS technologies to meet compliance requirements | 17 |
| S1.3.2 | Encrypting data at rest (AWS KMS) | 18 |
| S1.3.3 | Encrypting data in transit (ACM using TLS) | 19 |
| S1.3.4 | Implementing access policies for encryption keys | 20 |
| S1.3.5 | Implementing data backups and replications | 21 |
| S1.3.6 | Implementing policies for data access, lifecycle, and protection | 22 |
| S1.3.7 | Rotating encryption keys and renewing certificates | 23 |

| Ch | Title | Anchor | TO | Planned file | Scope |
| --- | --- | --- | --- | --- | --- |
| 17 | Meeting Compliance Requirements: AWS Config, CloudTrail, AWS Artifact, and Macie | S1.3.1 |  | `lesson-17-compliance-requirements.html` | K1.3.1, K1.3.3: recording changes and API calls, conformance packs, compliance reports, data classification |
| 18 | Encrypting Data at Rest with AWS KMS | S1.3.2 |  | `lesson-18-kms-encryption-at-rest.html` | K1.3.4: envelope encryption, AWS owned vs AWS managed vs customer managed keys, SSE-S3 vs SSE-KMS; AWS CloudHSM as the contrast case for single-tenant key custody |
| 19 | Encrypting Data in Transit: AWS Certificate Manager and TLS | S1.3.3 |  | `lesson-19-encryption-in-transit.html` | Where TLS terminates (ALB, CloudFront, NLB passthrough), enforcing HTTPS, end-to-end encryption |
| 20 | Access Policies for Encryption Keys: KMS Key Policies and Grants | S1.3.4 |  | `lesson-20-kms-key-policies.html` | Who can use vs administer a key, cross-account key use, why a key policy must name the account |
| 21 | Implementing Backups and Replication: AWS Backup, Cross-Region and Cross-Account Copies, S3 Replication | S1.3.5 |  | `lesson-21-backups-and-replication.html` | K1.3.2: backup plans and vaults, Vault Lock, copies to another account against ransomware. Durability characteristics are Ch 38; cost is Ch 69 and 79 |
| 22 | Data Access, Lifecycle, and Protection Policies: Block Public Access, Object Ownership, Versioning, Object Lock | S1.3.6 |  | `lesson-22-s3-data-protection-policies.html` | K1.3.3: bucket policies that deny non-TLS or unencrypted writes, MFA delete, Object Lock retention modes. Lifecycle rules are Ch 68 |
| 23 | Rotating Encryption Keys and Renewing Certificates | S1.3.7 |  | `lesson-23-key-rotation-cert-renewal.html` | Automatic and on-demand KMS rotation, imported key material, ACM managed renewal vs imported certificates that expire |

===============================================================================
Unit 2: Design Resilient Architectures (26%) · Chapters 24 to 40
===============================================================================

Eyebrow label for Unit 2 lessons: "Design Resilient Architectures".

### Module 2.1: Design scalable and loosely coupled architectures

| Id | Objective (from the guide) | Ch |
| --- | --- | --- |
| K2.1.1 | API creation and management (Amazon API Gateway, REST API) | 30 |
| K2.1.2 | AWS managed services with use cases (Transfer Family, SQS, Secrets Manager) | 26 (13, 58) |
| K2.1.3 | Caching strategies | (51) |
| K2.1.4 | Design principles for microservices (stateless vs stateful workloads) | 24, 25 |
| K2.1.5 | Event-driven architectures | 24 |
| K2.1.6 | Horizontal scaling and vertical scaling | 25 |
| K2.1.7 | How to appropriately use edge accelerators (CDN) | (86) |
| K2.1.8 | How to migrate applications into containers | 28 |
| K2.1.9 | Load balancing concepts (ALB) | 24 |
| K2.1.10 | Multi-tier architectures | 24 |
| K2.1.11 | Queuing and messaging concepts (publish/subscribe) | 26, 27 |
| K2.1.12 | Serverless technologies and patterns (Fargate, Lambda) | 28, 29 |
| K2.1.13 | Storage types with associated characteristics (object, file, block) | (42) |
| K2.1.14 | The orchestration of containers (ECS, EKS) | 28 |
| K2.1.15 | When to use read replicas | (47) |
| K2.1.16 | Workflow orchestration (Step Functions) | 31 |
| S2.1.1 | Designing event-driven, microservice, and/or multi-tier architectures based on requirements | 24 |
| S2.1.2 | Determining scaling strategies for components used in an architecture design | 25 |
| S2.1.3 | Determining the AWS services required to achieve loose coupling based on requirements | 27 |
| S2.1.4 | Determining when to use containers | 28 |
| S2.1.5 | Determining when to use serverless technologies and patterns | 29 |
| S2.1.6 | Recommending compute, storage, networking, and database technologies based on requirements | (42, 45, 50, 55) |
| S2.1.7 | Using purpose-built AWS services for workloads | 32 |

| Ch | Title | Anchor | TO | Planned file | Scope |
| --- | --- | --- | --- | --- | --- |
| 24 | Architecture Styles: Multi-Tier vs Microservices vs Event-Driven | S2.1.1 | TO | `lesson-24-architecture-styles.html` | K2.1.4, K2.1.5, K2.1.9, K2.1.10: tiers behind an ALB, services that deploy independently, producers and consumers that never call each other; the requirement that picks each |
| 25 | Scaling Strategies: Out vs Up, and Designing Stateless Components | S2.1.2 | TO | `lesson-25-scaling-strategies.html` | K2.1.4, K2.1.6: moving session state off the instance (ElastiCache, DynamoDB), which components scale out and which can only scale up |
| 26 | Decoupling with Amazon SQS: Standard vs FIFO, Visibility Timeout, Dead-Letter Queues | K2.1.2, K2.1.11 |  | `lesson-26-amazon-sqs.html` | Buffering spikes, at-least-once vs exactly-once processing, long polling, delay queues |
| 27 | Services for Loose Coupling: SQS vs SNS vs EventBridge vs Amazon MQ | S2.1.3 | TO | `lesson-27-loose-coupling-services.html` | K2.1.11: SNS to SQS fan-out, EventBridge buses, rules and filtering, Amazon MQ only when existing apps speak JMS, AMQP or MQTT |
| 28 | When to Use Containers: ECS vs EKS, EC2 Launch Type vs Fargate | S2.1.4 | TO | `lesson-28-when-to-use-containers.html` | K2.1.8, K2.1.12, K2.1.14: two paired choices (orchestrator, then capacity), Amazon ECR, moving an app into containers; ECS Anywhere and EKS Anywhere for on-premises |
| 29 | When to Use Serverless: AWS Lambda Patterns and Limits | S2.1.5 |  | `lesson-29-when-to-use-serverless.html` | K2.1.12: event sources, synchronous vs asynchronous invocation, reserved and provisioned concurrency, the 15-minute limit as a design signal. Memory sizing is Ch 46 |
| 30 | Amazon API Gateway: REST vs HTTP vs WebSocket APIs | K2.1.1 |  | `lesson-30-api-gateway.html` | API types, stages, authorizers, caching, throttling and usage plans. Throttling for cost returns in Ch 88 |
| 31 | Workflow Orchestration with AWS Step Functions | K2.1.16 |  | `lesson-31-step-functions.html` | Standard vs Express workflows, retries and catch, waiting for a callback, instead of chaining Lambdas |
| 32 | Purpose-Built Services: Managed AI Services as Architecture Components | S2.1.7 = S2.2.8 |  | `lesson-32-purpose-built-services.html` | K2.2.2: Comprehend, Polly, Rekognition, Textract, Transcribe, Translate, Lex, and where SageMaker AI begins; buy the managed capability before building one. Purpose-built databases are Ch 50 |

### Module 2.2: Design highly available and/or fault-tolerant architectures

Note on K2.2.2: the guide writes "AWS Managed Services (AMS)" but its examples
(Comprehend, Polly) are AI services, not the AMS operations offering. Ch 32
teaches the examples; the AMS operations service is not in the guide's
in-scope list and is not taught.

| Id | Objective (from the guide) | Ch |
| --- | --- | --- |
| K2.2.1 | AWS global infrastructure (AZs, Regions, Amazon Route 53) | 34, 35 |
| K2.2.2 | AWS Managed Services with use cases (Comprehend, Polly) | (32) |
| K2.2.3 | Basic networking concepts (route tables) | 37 (09) |
| K2.2.4 | DR strategies (backup and restore, pilot light, warm standby, active-active failover, RPO, RTO) | 39 |
| K2.2.5 | Distributed design patterns | 37 |
| K2.2.6 | Failover strategies | 34, 35 |
| K2.2.7 | Immutable infrastructure | 33 |
| K2.2.8 | Load balancing concepts (ALB) | 34 (55) |
| K2.2.9 | Proxy concepts (Amazon RDS Proxy) | 40 |
| K2.2.10 | Service quotas and throttling (quotas for a workload in a standby environment) | 39 |
| K2.2.11 | Storage options and characteristics (durability, replication) | 38 |
| K2.2.12 | Workload visibility (AWS X-Ray) | 36 |
| S2.2.1 | Determining automation strategies to ensure infrastructure integrity | 33 |
| S2.2.2 | Determining the AWS services required for HA or fault tolerance across Regions or AZs | 34 |
| S2.2.3 | Identifying metrics based on business requirements to deliver a highly available solution | 36 |
| S2.2.4 | Implementing designs to mitigate single points of failure | 37 |
| S2.2.5 | Implementing strategies to ensure the durability and availability of data (backups) | 38 |
| S2.2.6 | Selecting an appropriate DR strategy to meet business requirements | 39 |
| S2.2.7 | Using AWS services that improve the reliability of legacy applications (when application changes are not possible) | 40 |
| S2.2.8 | Using purpose-built AWS services for workloads | (32) |

| Ch | Title | Anchor | TO | Planned file | Scope |
| --- | --- | --- | --- | --- | --- |
| 33 | Automating for Infrastructure Integrity: Immutable Infrastructure with AWS CloudFormation | S2.2.1 |  | `lesson-33-automation-immutable-infrastructure.html` | K2.2.7: replace, never patch in place; golden AMIs, stacks and StackSets, drift detection, blue/green; Systems Manager for patching what must stay |
| 34 | Services for High Availability Across AZs and Regions | S2.2.2 |  | `lesson-34-ha-across-azs-and-regions.html` | K2.2.1, K2.2.6, K2.2.8: ELB across AZs, RDS Multi-AZ (instance and cluster), Aurora Global Database, DynamoDB global tables, S3 Cross-Region Replication; which are AZ-resilient and which are Region-resilient |
| 35 | Amazon Route 53: Routing Policies and Health Checks for Failover | K2.2.1, K2.2.6 |  | `lesson-35-route-53.html` | Simple, weighted, latency, failover, geolocation, geoproximity, multivalue; alias records; Route 53 Resolver for hybrid DNS (K4.4.7) |
| 36 | Metrics That Match the Business: CloudWatch Alarms and AWS X-Ray | S2.2.3 |  | `lesson-36-availability-metrics.html` | K2.2.12: choosing the metric the business cares about, composite alarms, tracing a request across services, AWS Health Dashboard events |
| 37 | Mitigating Single Points of Failure | S2.2.4 |  | `lesson-37-single-points-of-failure.html` | K2.2.3, K2.2.5: static stability, a NAT gateway or instance per AZ, redundant routes, distributed patterns (retries, idempotency, circuit breaking) |
| 38 | Data Durability and Availability: Storage Characteristics and Backup Strategy | S2.2.5 |  | `lesson-38-data-durability.html` | K2.2.11: S3 durability and its storage classes, EBS replicated in one AZ, EFS Regional vs One Zone, snapshots as the durability layer. Implementing backups is Ch 21 |
| 39 | Selecting a Disaster Recovery Strategy Against RPO and RTO | S2.2.6 | TO | `lesson-39-disaster-recovery.html` | K2.2.4, K2.2.10: backup and restore, pilot light, warm standby, multi-site active-active; raising service quotas in the standby Region before you need them |
| 40 | Making Legacy Applications Reliable Without Code Changes | S2.2.7 |  | `lesson-40-legacy-reliability.html` | K2.2.9: Auto Scaling group of one for self-healing, ALB in front, RDS Proxy for connection storms and faster failover, AWS Application Migration Service for rehosting |

===============================================================================
Unit 3: Design High-Performing Architectures (24%) · Chapters 41 to 62
===============================================================================

Eyebrow label for Unit 3 lessons: "Design High-Performing Architectures".

### Module 3.1: Determine high-performing and/or scalable storage solutions

| Id | Objective (from the guide) | Ch |
| --- | --- | --- |
| K3.1.1 | Hybrid storage solutions to meet business requirements | (70) |
| K3.1.2 | Storage services with appropriate use cases (S3, EFS, EBS) | 42 |
| K3.1.3 | Storage types with associated characteristics (object, file, block) | 42 |
| S3.1.1 | Determining storage services and configurations that meet performance demands | 41 |
| S3.1.2 | Determining storage services that can scale to accommodate future needs | 42 |

| Ch | Title | Anchor | TO | Planned file | Scope |
| --- | --- | --- | --- | --- | --- |
| 41 | Storage Configurations for Performance: EBS Volume Types, Instance Store, S3 Throughput, FSx for Lustre | S3.1.1 |  | `lesson-41-storage-performance.html` | gp3 vs io2 vs st1 vs sc1 (IOPS vs throughput), instance store as ephemeral, S3 multipart upload, Transfer Acceleration and request rates per prefix, Lustre for HPC. Heavy chapter, see the note above |
| 42 | Storage That Scales: Object vs File vs Block | S3.1.2 | TO | `lesson-42-object-file-block.html` | K3.1.2, K3.1.3, K2.1.13: S3 vs EFS vs EBS by access pattern, sharing across instances, AZ scope, scale ceiling |

### Module 3.2: Design high-performing and elastic compute solutions

| Id | Objective (from the guide) | Ch |
| --- | --- | --- |
| K3.2.1 | AWS compute services with use cases (AWS Batch, Amazon EMR, Fargate) | (60, 28) |
| K3.2.2 | Distributed computing concepts supported by global infrastructure and edge services | (54) |
| K3.2.3 | Queuing and messaging concepts (publish/subscribe) | 43 |
| K3.2.4 | Scalability capabilities (EC2 Auto Scaling, AWS Auto Scaling) | 44 |
| K3.2.5 | Serverless technologies and patterns (Lambda, Fargate) | 46 |
| K3.2.6 | The orchestration of containers (ECS, EKS) | (28) |
| S3.2.1 | Decoupling workloads so that components can scale independently | 43 |
| S3.2.2 | Identifying metrics and conditions to perform scaling actions | 44 |
| S3.2.3 | Selecting the appropriate compute options and features (EC2 instance types) | 45 |
| S3.2.4 | Selecting the appropriate resource type and size (amount of Lambda memory) | 46 |

| Ch | Title | Anchor | TO | Planned file | Scope |
| --- | --- | --- | --- | --- | --- |
| 43 | Decoupling So Components Scale Independently | S3.2.1 |  | `lesson-43-decoupling-for-scale.html` | K3.2.3: a queue between tiers, workers scaled on backlog per instance, fan-out so each consumer scales on its own |
| 44 | Scaling Metrics and Conditions: EC2 Auto Scaling Policies | S3.2.2 |  | `lesson-44-ec2-auto-scaling.html` | K3.2.4: target tracking, step, scheduled and predictive scaling, cooldowns and warm pools, AWS Auto Scaling for multiple services |
| 45 | Compute Options and Features: EC2 Instance Types for Performance | S3.2.3 |  | `lesson-45-ec2-instance-types.html` | General, compute, memory, storage and accelerated families, Graviton, enhanced networking, burstable credits as a performance trap. Family for cost is Ch 77 |
| 46 | Resource Type and Size: Lambda Memory and Fargate Task Size | S3.2.4 |  | `lesson-46-lambda-fargate-sizing.html` | K3.2.5: Lambda memory buys CPU, timeouts and ephemeral storage, Fargate vCPU and memory combinations |

### Module 3.3: Determine high-performing database solutions

| Id | Objective (from the guide) | Ch |
| --- | --- | --- |
| K3.3.1 | AWS global infrastructure (AZs, Regions) | 47 (34) |
| K3.3.2 | Caching strategies and services (Amazon ElastiCache) | 51 |
| K3.3.3 | Data access patterns (read-intensive vs write-intensive) | 47, 50 |
| K3.3.4 | Database capacity planning (capacity units, instance types, Provisioned IOPS) | 49 (80) |
| K3.3.5 | Database connections and proxies | 48 (40) |
| K3.3.6 | Database engines with use cases (heterogeneous and homogeneous migrations) | 49 (82) |
| K3.3.7 | Database replication (read replicas) | 47 |
| K3.3.8 | Database types and services (serverless, relational vs non-relational, in-memory) | 50 |
| S3.3.1 | Configuring read replicas to meet business requirements | 47 |
| S3.3.2 | Designing database architectures | 48 |
| S3.3.3 | Determining an appropriate database engine (MySQL vs PostgreSQL) | 49 |
| S3.3.4 | Determining an appropriate database type (Aurora, DynamoDB) | 50 |
| S3.3.5 | Integrating caching to meet business requirements | 51 |

| Ch | Title | Anchor | TO | Planned file | Scope |
| --- | --- | --- | --- | --- | --- |
| 47 | Configuring Read Replicas | S3.3.1 |  | `lesson-47-read-replicas.html` | K3.3.1, K3.3.3, K3.3.7: asynchronous replication and lag, reader endpoints, cross-Region replicas, promoting a replica, read replica vs Multi-AZ standby |
| 48 | Designing Database Architectures | S3.3.2 |  | `lesson-48-database-architectures.html` | K3.3.5: one database per access pattern, offloading reads, connection pooling with RDS Proxy, Aurora Serverless v2 for variable load |
| 49 | Choosing an Engine: MySQL vs PostgreSQL, Amazon RDS vs Amazon Aurora | S3.3.3 = S4.3.2 | TO | `lesson-49-choosing-database-engine.html` | K3.3.4, K3.3.6: engine compatibility drives the choice, shared cluster storage vs per-instance EBS, Provisioned IOPS, cost of each engine |
| 50 | Choosing a Database Type: Relational, Key-Value, Document, Graph, Wide-Column, In-Memory, Warehouse | S3.3.4 | TO | `lesson-50-choosing-database-type.html` | K3.3.3, K3.3.8: Aurora and RDS, DynamoDB, DocumentDB, Neptune, Keyspaces, ElastiCache, Redshift; the access pattern is the signal. Heavy chapter, see the note above |
| 51 | Integrating Caching: ElastiCache Lazy Loading vs Write-Through, and DAX | S3.3.5 | TO | `lesson-51-integrating-caching.html` | K3.3.2, K2.1.3: TTLs and stale data, engine choice (verify current engine names at authoring: Valkey, Redis OSS, Memcached), DAX for DynamoDB |

### Module 3.4: Determine high-performing and/or scalable network architectures

| Id | Objective (from the guide) | Ch |
| --- | --- | --- |
| K3.4.1 | Edge networking services (CloudFront, Global Accelerator) | (86) |
| K3.4.2 | How to design network architecture (subnet tiers, routing, IP addressing) | 53 (08) |
| K3.4.3 | Load balancing concepts (ALB) | 55 |
| K3.4.4 | Network connection options (AWS VPN, Direct Connect, PrivateLink) | 52 (11, 16) |
| S3.4.1 | Creating a network topology for various architectures (global, hybrid, multi-tier) | 52 |
| S3.4.2 | Determining network configurations that can scale to accommodate future needs | 53 |
| S3.4.3 | Determining the appropriate placement of resources to meet business requirements | 54 |
| S3.4.4 | Selecting the appropriate load balancing strategy | 55 |

| Ch | Title | Anchor | TO | Planned file | Scope |
| --- | --- | --- | --- | --- | --- |
| 52 | Network Topology: VPC Peering vs Transit Gateway vs PrivateLink | S3.4.1 | TO | `lesson-52-network-topology.html` | K3.4.4: transitive routing, hub-and-spoke with VPN and Direct Connect attachments, exposing one service vs joining whole networks, AWS RAM for sharing |
| 53 | Network Configurations That Scale: CIDR Planning, IPv6, and Subnet Sizing | S3.4.2 |  | `lesson-53-scalable-network-config.html` | K3.4.2: non-overlapping ranges for future peering, secondary CIDRs, IP exhaustion as the failure symptom, dual-stack |
| 54 | Placing Resources: Placement Groups, Local Zones, AWS Wavelength, AWS Outposts | S3.4.3 |  | `lesson-54-resource-placement.html` | K3.2.2, K4.2.5, K4.2.6: cluster vs spread vs partition, putting compute near users, on 5G networks or on premises |
| 55 | Load Balancing Strategy: ALB vs NLB vs GWLB | S3.4.4 = S4.2.1 | TO | `lesson-55-load-balancing-strategy.html` | K3.4.3, K2.2.8, K4.4.3: layer 7 routing vs layer 4 static IPs and extreme throughput vs inline appliances, cross-zone load balancing and its cost |

### Module 3.5: Determine high-performing data ingestion and transformation solutions

| Id | Objective (from the guide) | Ch |
| --- | --- | --- |
| K3.5.1 | Data analytics and visualization services (Athena, Lake Formation, Amazon Quick) | 56, 59 |
| K3.5.2 | Data ingestion patterns (frequency) | 61 |
| K3.5.3 | Data transfer services (DataSync, Storage Gateway) | 58 (70) |
| K3.5.4 | Data transformation services (AWS Glue) | 62 |
| K3.5.5 | Secure access to ingestion access points | 56, 61 |
| K3.5.6 | Sizes and speeds needed to meet business requirements | 58 |
| K3.5.7 | Streaming data services (Amazon Kinesis) | 57 |
| S3.5.1 | Building and securing data lakes | 56 |
| S3.5.2 | Designing data streaming architectures | 57 |
| S3.5.3 | Designing data transfer solutions | 58 |
| S3.5.4 | Implementing visualization strategies | 59 |
| S3.5.5 | Selecting appropriate compute options for data processing (Amazon EMR) | 60 |
| S3.5.6 | Selecting appropriate configurations for ingestion | 61 |
| S3.5.7 | Transforming data between formats (.csv to .parquet) | 62 |

| Ch | Title | Anchor | TO | Planned file | Scope |
| --- | --- | --- | --- | --- | --- |
| 56 | Building and Securing a Data Lake: S3, the AWS Glue Data Catalog, and AWS Lake Formation | S3.5.1 |  | `lesson-56-data-lake.html` | K3.5.1, K3.5.5: zones on S3, crawlers, fine-grained table and column permissions, encryption and access points |
| 57 | Streaming Architectures: Kinesis Data Streams vs Amazon Data Firehose vs Amazon MSK | S3.5.2 | TO | `lesson-57-streaming-architectures.html` | K3.5.7: shards and custom consumers vs managed delivery vs Kafka compatibility |
| 58 | Data Transfer Solutions: DataSync vs Transfer Family vs Physical Transfer | S3.5.3 | TO | `lesson-58-data-transfer-solutions.html` | K3.5.3, K3.5.6, K2.1.2: online sync vs SFTP endpoints vs shipping data; size, link speed and deadline as the signal. Snowball Edge is closed to new customers (see terminology), so the physical option is AWS Data Transfer Terminal |
| 59 | Visualization Strategies: Amazon Quick on Athena, Redshift, and OpenSearch Service | S3.5.4 |  | `lesson-59-visualization.html` | K3.5.1: which query layer feeds a dashboard (ad hoc SQL on S3 vs warehouse vs search and logs), SPICE vs direct query, OpenSearch Dashboards for logs |
| 60 | Compute for Data Processing: AWS Glue vs Amazon EMR vs AWS Batch | S3.5.5 | TO | `lesson-60-data-processing-compute.html` | K3.2.1: serverless Spark ETL vs managed clusters for heavy or custom frameworks vs containerized job queues; Spot capacity in EMR and Batch |
| 61 | Ingestion Configurations: Frequency, Buffering, and Secure Entry Points | S3.5.6 |  | `lesson-61-ingestion-configurations.html` | K3.5.2, K3.5.5: batch vs micro-batch vs streaming, Firehose buffer size and interval, shard and partition counts, VPC endpoints and IAM on ingestion endpoints |
| 62 | Transforming Data Between Formats: CSV to Parquet with AWS Glue | S3.5.7 |  | `lesson-62-format-transformation.html` | K3.5.4: why columnar formats cut scan cost and time, partitioning for Athena, Firehose record format conversion |

===============================================================================
Unit 4: Design Cost-Optimized Architectures (20%) · Chapters 63 to 89
===============================================================================

Eyebrow label for Unit 4 lessons: "Design Cost-Optimized Architectures".

The two cost-tool knowledge items repeat word for word in all four task
statements (K4.1.2, K4.1.3, K4.2.1, K4.2.2, K4.3.1, K4.3.2, K4.4.1, K4.4.2).
Ch 63 teaches them once, at the start of the unit; every other Unit 4 chapter
applies them.

### Module 4.1: Design cost-optimized storage solutions

| Id | Objective (from the guide) | Ch |
| --- | --- | --- |
| K4.1.1 | Access options (S3 bucket with Requester Pays) | 64 |
| K4.1.2 | Cost management service features (cost allocation tags, multi-account billing) | 63 |
| K4.1.3 | Cost management tools (Cost Explorer, Budgets, Cost and Usage Report) | 63 |
| K4.1.4 | Storage services with use cases (FSx, EFS, S3, EBS) | 72 |
| K4.1.5 | Backup strategies | 69 |
| K4.1.6 | Block storage options (HDD and SSD volume types) | 72 (41) |
| K4.1.7 | Data lifecycles | 68 |
| K4.1.8 | Hybrid storage options (DataSync, Transfer Family, Storage Gateway) | 70 |
| K4.1.9 | Storage access patterns | 68 |
| K4.1.10 | Storage tiering (cold tiering for object storage) | 71 |
| K4.1.11 | Storage types with associated characteristics (object, file, block) | (42) |
| S4.1.1 | Designing appropriate storage strategies (batch uploads vs individual uploads to S3) | 64 |
| S4.1.2 | Determining the correct storage size for a workload | 65 |
| S4.1.3 | Determining the lowest cost method of transferring data for a workload to AWS storage | 66 |
| S4.1.4 | Determining when storage auto scaling is required | 67 |
| S4.1.5 | Managing S3 object lifecycles | 68 |
| S4.1.6 | Selecting the appropriate backup and/or archival solution | 69 |
| S4.1.7 | Selecting the appropriate service for data migration to storage services | 70 |
| S4.1.8 | Selecting the appropriate storage tier | 71 |
| S4.1.9 | Selecting the correct data lifecycle for storage | 68 |
| S4.1.10 | Selecting the most cost-effective storage service for a workload | 72 |

| Ch | Title | Anchor | TO | Planned file | Scope |
| --- | --- | --- | --- | --- | --- |
| 63 | Cost Visibility: Cost Explorer, AWS Budgets, the Cost and Usage Report, and Cost Allocation Tags | K4.1.2, K4.1.3 (and repeats) |  | `lesson-63-cost-visibility.html` | Consolidated billing in Organizations, tags that must be activated, forecasting vs alerting vs line-item detail |
| 64 | Storage Strategies: Batch vs Individual Uploads, and Requester Pays | S4.1.1 |  | `lesson-64-storage-strategies.html` | K4.1.1: request charges on many small objects, bundling before upload, who pays for downloads |
| 65 | The Correct Storage Size for a Workload | S4.1.2 |  | `lesson-65-storage-sizing.html` | Provisioned (EBS, FSx) vs elastic (S3, EFS) capacity, gp2 to gp3, over-provisioned volumes as the waste symptom |
| 66 | The Lowest Cost Method of Transferring Data to AWS Storage | S4.1.3 |  | `lesson-66-lowest-cost-transfer.html` | Free inbound transfer, online vs physical by data size and deadline, Direct Connect for recurring bulk loads. The performance design is Ch 58 |
| 67 | When Storage Auto Scaling Is Required | S4.1.4 |  | `lesson-67-storage-auto-scaling.html` | RDS storage autoscaling, EBS Elastic Volumes, FSx capacity increases vs inherently elastic S3 and EFS |
| 68 | S3 Object Lifecycles and Data Lifecycles | S4.1.5, S4.1.9 |  | `lesson-68-s3-lifecycles.html` | K4.1.7, K4.1.9: transition and expiration rules, noncurrent versions, incomplete multipart uploads, lifecycle by access pattern |
| 69 | Selecting a Backup and Archival Solution | S4.1.6 |  | `lesson-69-backup-and-archival.html` | K4.1.5: AWS Backup lifecycle to cold storage, S3 Glacier Deep Archive for compliance retention, Tape Gateway for tape-based workflows |
| 70 | Hybrid Storage and Migration: AWS Storage Gateway vs DataSync vs Transfer Family | S4.1.7 | TO | `lesson-70-hybrid-storage-migration.html` | K4.1.8, K3.1.1: ongoing local access with cloud backing (S3 File, FSx File, Volume, Tape gateways) vs one-time or scheduled copy vs partner file exchange (verify which gateway types are still open to new customers at authoring) |
| 71 | Selecting a Storage Tier: S3 Storage Classes | S4.1.8 | TO | `lesson-71-s3-storage-classes.html` | K4.1.10: Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, the three S3 Glacier classes; minimum durations and retrieval fees as the trap |
| 72 | The Most Cost-Effective Storage Service: S3 vs EFS vs FSx vs EBS | S4.1.10 | TO | `lesson-72-cost-effective-storage-service.html` | K4.1.4, K4.1.6: the FSx family (Windows File Server, Lustre, NetApp ONTAP, OpenZFS) as its home chapter, EFS storage classes, HDD volumes for throughput-bound cold data |

### Module 4.2: Design cost-optimized compute solutions

| Id | Objective (from the guide) | Ch |
| --- | --- | --- |
| K4.2.1 | Cost management service features | (63) |
| K4.2.2 | Cost management tools | (63) |
| K4.2.3 | AWS global infrastructure (AZs, Regions) | 75 |
| K4.2.4 | AWS purchasing options (Spot Instances, Reserved Instances, Savings Plans) | 73 |
| K4.2.5 | Distributed compute strategies (edge processing) | 75 (54) |
| K4.2.6 | Hybrid compute options (AWS Outposts) | (54) |
| K4.2.7 | Instance types, families, and sizes (memory optimized, compute optimized, virtualization) | 77 |
| K4.2.8 | Optimization of compute utilization (containers, serverless computing, microservices) | 75 |
| K4.2.9 | Scaling strategies (auto scaling, hibernation) | 74 |
| S4.2.1 | Determining an appropriate load balancing strategy (ALB vs NLB vs GWLB) | (55) |
| S4.2.2 | Determining scaling methods and strategies for elastic workloads (horizontal vs vertical, EC2 hibernation) | 74 |
| S4.2.3 | Determining cost-effective compute services (Lambda, EC2, Fargate) | 75 |
| S4.2.4 | Determining the required availability for classes of workloads (production vs non-production) | 76 |
| S4.2.5 | Selecting the appropriate instance family for a workload | 77 |
| S4.2.6 | Selecting the appropriate instance size for a workload | 78 |

| Ch | Title | Anchor | TO | Planned file | Scope |
| --- | --- | --- | --- | --- | --- |
| 73 | EC2 Purchasing Options: On-Demand, Savings Plans, Reserved Instances, and Spot | K4.2.4 | TO | `lesson-73-purchasing-options.html` | Compute vs EC2 Instance Savings Plans, Spot interruption tolerance, Dedicated Hosts for licensing, mixing options in one Auto Scaling group |
| 74 | Scaling Methods for Elastic Workloads: Horizontal vs Vertical, and EC2 Hibernation | S4.2.2 |  | `lesson-74-scaling-for-cost.html` | K4.2.9: scaling in to save, hibernation for slow-starting instances, scheduled scaling to zero |
| 75 | Cost-Effective Compute Services: Lambda vs Fargate vs EC2 | S4.2.3 | TO | `lesson-75-cost-effective-compute.html` | K4.2.3, K4.2.5, K4.2.8: utilization and traffic shape as the signal, Graviton price-performance, Regional price differences, edge processing to cut transfer |
| 76 | Availability by Workload Class: Production vs Non-Production | S4.2.4 |  | `lesson-76-availability-by-workload-class.html` | Multi-AZ where the business needs it, single-AZ and Spot for dev and test, stopping non-production outside working hours |
| 77 | Selecting an Instance Family for Cost | S4.2.5 |  | `lesson-77-instance-family-for-cost.html` | K4.2.7: matching the bottleneck (CPU, memory, storage) to the family, Graviton, burstable T instances for spiky low use, Nitro virtualization. Performance features are Ch 45 |
| 78 | Selecting an Instance Size: Right-Sizing with AWS Compute Optimizer | S4.2.6 |  | `lesson-78-instance-size.html` | Utilization metrics, the CloudWatch agent for memory, downsizing within a family vs switching families |

### Module 4.3: Design cost-optimized database solutions

| Id | Objective (from the guide) | Ch |
| --- | --- | --- |
| K4.3.1 | Cost management service features | (63) |
| K4.3.2 | Cost management tools | (63) |
| K4.3.3 | Caching strategies | 80 (51) |
| K4.3.4 | Data retention policies | 79 |
| K4.3.5 | Database capacity planning (capacity units) | 80 |
| K4.3.6 | Database connections and proxies | (48) |
| K4.3.7 | Database engines with use cases (heterogeneous and homogeneous migrations) | 82 |
| K4.3.8 | Database replication (read replicas) | 80 |
| K4.3.9 | Database types and services (relational vs non-relational, Aurora, DynamoDB) | 80 |
| S4.3.1 | Designing appropriate backup and retention policies (snapshot frequency) | 79 |
| S4.3.2 | Determining an appropriate database engine (MySQL vs PostgreSQL) | (49) |
| S4.3.3 | Determining cost-effective database services (DynamoDB vs RDS, serverless) | 80 |
| S4.3.4 | Determining cost-effective database types (time series format, columnar format) | 81 |
| S4.3.5 | Migrating database schemas and data to different locations and/or engines | 82 |

| Ch | Title | Anchor | TO | Planned file | Scope |
| --- | --- | --- | --- | --- | --- |
| 79 | Database Backup and Retention Policies: Snapshot Frequency vs RPO | S4.3.1 |  | `lesson-79-database-backup-retention.html` | K4.3.4: automated backups vs manual snapshots, retention windows, exporting snapshots to S3, the cost of keeping too much |
| 80 | Cost-Effective Database Services: DynamoDB vs RDS, Serverless vs Provisioned | S4.3.3 | TO | `lesson-80-cost-effective-database-services.html` | K4.3.3, K4.3.5, K4.3.8, K4.3.9, K3.3.4: DynamoDB on-demand vs provisioned with auto scaling (home of capacity units), Aurora Serverless v2, Reserved DB instances, a cache or replica instead of a bigger instance |
| 81 | Cost-Effective Database Types: Columnar and Time-Series Data | S4.3.4 |  | `lesson-81-cost-effective-database-types.html` | Row vs columnar storage, Redshift for analytics instead of an oversized OLTP database, time-series access patterns (verify which time-series service to name: none is in the guide's in-scope list) |
| 82 | Migrating Database Schemas and Data with AWS DMS: Homogeneous vs Heterogeneous | S4.3.5 | TO | `lesson-82-database-migration-dms.html` | K4.3.7, K3.3.6: full load plus change data capture, schema conversion for engine changes (verify at authoring whether to name DMS Schema Conversion, AWS SCT, or both) |

### Module 4.4: Design cost-optimized network architectures

| Id | Objective (from the guide) | Ch |
| --- | --- | --- |
| K4.4.1 | Cost management service features | (63) |
| K4.4.2 | Cost management tools | (63) |
| K4.4.3 | Load balancing concepts (ALB) | (55) |
| K4.4.4 | NAT gateways (NAT instance costs vs NAT gateway costs) | 83 |
| K4.4.5 | Network connectivity (private lines, dedicated lines, VPNs) | 84 |
| K4.4.6 | Network routing, topology, and peering (Transit Gateway, VPC peering) | 85 (52) |
| K4.4.7 | Network services with use cases (DNS) | 87 (35) |
| S4.4.1 | Configuring appropriate NAT gateway types (single shared vs one per AZ) | 83 |
| S4.4.2 | Configuring appropriate network connections (Direct Connect vs VPN vs internet) | 84 |
| S4.4.3 | Configuring network routes to minimize transfer costs (Region to Region, AZ to AZ, private to public, Global Accelerator, VPC endpoints) | 85 |
| S4.4.4 | Determining strategic needs for CDNs and edge caching | 86 |
| S4.4.5 | Reviewing existing workloads for network optimizations | 87 |
| S4.4.6 | Selecting an appropriate throttling strategy | 88 |
| S4.4.7 | Selecting the appropriate bandwidth allocation for a network device (single vs multiple VPNs, Direct Connect speed) | 89 |

| Ch | Title | Anchor | TO | Planned file | Scope |
| --- | --- | --- | --- | --- | --- |
| 83 | NAT for Cost: One Shared NAT Gateway vs One per AZ vs a NAT Instance | S4.4.1 | TO | `lesson-83-nat-for-cost.html` | K4.4.4: hourly plus per-GB processing, cross-AZ traffic to a shared gateway, availability given up for savings (Ch 37 is the resilience side) |
| 84 | Network Connections for Cost: Direct Connect vs VPN vs Internet | S4.4.2 | TO | `lesson-84-network-connections-cost.html` | K4.4.5: lower egress rates on Direct Connect, port hours and lead time, VPN as the cheap start or backup |
| 85 | Routing to Minimize Transfer Costs | S4.4.3 |  | `lesson-85-routing-transfer-costs.html` | K4.4.6: what is free, what crosses AZs and Regions, gateway endpoints to bypass NAT processing, peering vs Transit Gateway per-GB charges, keeping chatty tiers in one AZ |
| 86 | CDNs and Edge Caching: Amazon CloudFront vs AWS Global Accelerator | S4.4.4 | TO | `lesson-86-cdn-and-edge.html` | K3.4.1, K2.1.7: caching HTTP content vs anycast IPs for TCP and UDP, cache hit ratio and origin egress, price classes, origin failover, Lambda@Edge and CloudFront Functions |
| 87 | Reviewing Existing Workloads for Network Optimizations | S4.4.5 |  | `lesson-87-network-optimization-review.html` | K4.4.7: finding data transfer line items in Cost Explorer and the CUR, VPC Flow Logs, Route 53 Resolver and DNS costs, the Well-Architected Tool review |
| 88 | Selecting a Throttling Strategy | S4.4.6 |  | `lesson-88-throttling-strategy.html` | API Gateway usage plans and stage throttles, WAF rate-based rules, SQS as a buffer instead of scaling for peaks, Lambda reserved concurrency as a cost cap |
| 89 | Bandwidth Allocation: Multiple VPN Tunnels and Direct Connect Speeds | S4.4.7 |  | `lesson-89-bandwidth-allocation.html` | VPN tunnel throughput limits, ECMP across tunnels on Transit Gateway, dedicated vs hosted connections and their speeds, LAG |

Chapter 89 is the last chapter of the course, so its NAV.next is the Unit 4
practice exam (saa-practice-exam-04, "Practice test"). Chapters 23, 40 and 62
close Units 1 to 3, so their NAV.next is that unit's practice exam.

===============================================================================
Cross-reference notes (deliberate syllabus overlap)
===============================================================================

    Backups: Ch 21 (implementing them, the security control), Ch 38
    (durability characteristics), Ch 69 (backup and archive choice for
    cost), Ch 79 (database snapshot frequency and retention).
    Load balancers: Ch 24 (multi-tier role), Ch 55 (which type, home for
    S3.4.4 and S4.2.1), Ch 34 (across AZs).
    NAT gateways: Ch 09 (function), Ch 37 (one per AZ for resilience),
    Ch 83 (shared vs per-AZ for cost).
    VPC endpoints: Ch 11 (security, home), Ch 85 (cost).
    Direct Connect and VPN: Ch 16 (secure connection, home), Ch 52
    (topology), Ch 84 (cost), Ch 89 (bandwidth).
    Read replicas: Ch 47 (home), Ch 34 (contrast with Multi-AZ standby),
    Ch 80 (replica instead of a bigger instance).
    Caching: Ch 51 (ElastiCache and DAX, home), Ch 86 (CloudFront), Ch 30
    (API Gateway cache), Ch 25 (session state), Ch 80 (cost).
    Storage: Ch 42 (types, home), Ch 41 (performance), Ch 65 to 72 (cost).
    The FSx family's home is Ch 72; Ch 41 covers only FSx for Lustre
    performance.
    Data transfer: Ch 58 (performance design, home), Ch 66 (cheapest
    method), Ch 70 (hybrid and ongoing).
    Lambda: Ch 29 (patterns, home), Ch 46 (memory sizing), Ch 75 (cost),
    Ch 88 (reserved concurrency as a cap).
    Containers: Ch 28 (home), Ch 46 (Fargate task size), Ch 75 (cost).
    Instance types: Ch 45 (performance features), Ch 77 (family for cost),
    Ch 78 (size).
    Throttling: Ch 39 (service quotas in the standby Region), Ch 30 (API
    Gateway limits), Ch 88 (throttling strategy).
    Scaling: Ch 25 (strategy), Ch 43 (decoupling), Ch 44 (policies and
    metrics), Ch 74 (scaling for cost).
    Edge and hybrid placement: Ch 54 (home for Local Zones, Wavelength,
    Outposts), cited by 3.2 and 4.2.

===============================================================================
Practice exam plan
===============================================================================

Exams map to CHAPTERS, one question per chapter in scope, which with this
index means one question per skill plus one per K-anchored chapter. The
mocks sample at the domain weights. Question headers read
`/* Ch NN - name (S or K id) */` and every question carries
`ref: { chapter: NN }`.

    Question style: scenario-based, plausible distractors, the "which option
    is MOST cost-effective / has the LEAST operational overhead" framing the
    real exam uses. 2 minutes per question (130 minutes / 65 questions).
    Pass target: the real cut score is 720 on a 100 to 1,000 scale; use 72%
    as the practice target, matching MLA-C02.
    Multiple response: the engine already supports select-two items (array
    `correct`); use them where the scenario genuinely needs two answers,
    within the validator's share. No other formats are needed.

    Plan (7 exams):
        01  Unit 1 (Ch 01 to 23): 23 questions, 46 min
        02  Unit 2 (Ch 24 to 40): 17 questions, 34 min
        03  Unit 3 (Ch 41 to 62): 22 questions, 44 min
        04  Unit 4 (Ch 63 to 89): 27 questions, 54 min
            (89 section-exam questions in all, one per chapter)
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
    1-23, 24-40, 41-62, 63-89, four bars at the official 30/26/24/20 weights
    ("% of exam"), mocks 05 to 07 as the Full mock pool, pass target 72.

===============================================================================
Terminology and freshness rules (summary; cert-config-aws-saa-c03.md is authoritative)
===============================================================================

    Names as the guide writes them: "AWS IAM Identity Center" (never "AWS
    SSO"), "Amazon SageMaker AI", "Amazon Quick" (formerly Amazon
    QuickSight; mention the old name once in Ch 59), "AWS Health Dashboard",
    "AWS Application Migration Service".
    Repo-wide AWS rules: "Amazon Data Firehose", never "Kinesis Data
    Firehose"; "Amazon Managed Service for Apache Flink", never "Kinesis
    Data Analytics". IAM, CLI and SDK identifiers keep their old names.
    In-scope services that are closed or ended (checked 21 Oct 2026; teach
    the replacement, never hinge a question on the closed service):
      AWS Snowball Edge: "no longer available to new customers" per its
        developer guide; AWS names DataSync, AWS Data Transfer Terminal and
        AWS Outposts as the alternatives. Ch 58 says so once.
      Amazon Glacier (the original vault-based service): "no longer
        accepting new customers"; AWS recommends the S3 Glacier storage
        classes, which is what Ch 69 and 71 teach. "Glacier" in lessons
        always means the S3 Glacier storage classes.
      Amazon Elastic Transcoder: support ended 13 Nov 2025 (AWS docs); AWS
        Elemental MediaConvert is the replacement but is out of scope for
        this exam. No chapter teaches either.
    To verify at authoring (likely renamed or changed since the guide's
    examples were written): ElastiCache engine names (Ch 51), S3 Express One
    Zone (Ch 41), Storage Gateway types still open to new customers (Ch 70),
    DMS Schema Conversion vs AWS SCT (Ch 82), a time-series service for
    Ch 81, VMware Cloud on AWS status (in-scope list, not taught).
    Recommended-vs-contrast stances: IAM Identity Center over IAM users for
    people; roles over access keys; gp3 over gp2; Savings Plans over
    Reserved Instances for new commitments; CloudFormation over manual
    changes. The older option appears only as the contrast case.
