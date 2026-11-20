Curriculum Index: AWS Certified Cloud Practitioner (CLF-C02)

Status: LOCKED on 20 Nov 2026 by the user. Built that day by downloading the official
exam guide PDF from docs.aws.amazon.com
(docs.aws.amazon.com/pdfs/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.pdf)
and extracting its text; every task statement and skill below is transcribed
from that PDF, not from third-party outlines. Nothing is authored until the
user locks this file (done 20 Nov 2026). Once locked, it is the authoritative source for unit and
chapter placement: a later request that conflicts with it gets flagged with a
proposed one-line fix rather than silently absorbed.

Exam guide version: CLF-C02 exam guide VERSION 1.3, published October 29, 2026
(change history: 1.0 June 24, 2026; 1.1 August 28, 2026; 1.2 September 24,
2026). The exam code is CLF-C02. Several third-party sites describe a
"CLF-C03"; the official guide names no such exam, so the course, its slug and
the blog cluster stay on CLF-C02. Re-verify against the PDF before each unit
ships: this guide was revised four times in five months, and it says updates
are published about one month before they reach the exam.

Source of truth: the official exam guide PDF above. The copy at
d1.awsstatic.com (AWS-Certified-Cloud-Practitioner_Exam-Guide.pdf) is the
older "Version 1.0 CLF-C02" layout with the CLF-C01 mapping appendix; it does
not carry the 2026 wording (AWS Business Support+, AWS Unified Operations,
Amazon Quick, Amazon SageMaker AI), so never author from it.

Exam facts (from the PDF unless noted):
    65 questions presented: 50 scored plus 15 unscored, unidentified.
    Question types: multiple choice (1 of 4) and multiple response (2 or more
      of 5 or more). No ordering or matching types, so the frozen exam engine
      covers every type this exam uses. Unanswered questions score as wrong;
      no penalty for guessing.
    Scaled score 100 to 1,000; minimum passing score 700. Compensatory
      scoring: no per-domain minimum.
    Time limit: 90 minutes. Cost: USD 100. (Both from the AWS cert page as
      already published in blog/aws-cloud-practitioner-exam-cost-format-questions.html;
      the PDF states neither. Re-check both at lock.)
    Target candidate: up to 6 months of exposure to AWS Cloud design,
      implementation, or operations, independent of a job role. Out of scope
      for the candidate: coding, designing cloud architecture,
      troubleshooting, implementation, load and performance testing. Lessons
      therefore teach recognition and selection, never implementation: no
      code blocks beyond a single CLI command or service name.

Domain weights (official, from the PDF):

    Domain 1  Cloud Concepts                      24%    4 tasks   12 skills
    Domain 2  Security and Compliance             30%    4 tasks   21 skills
    Domain 3  Cloud Technology and Services       34%    8 tasks   37 skills
    Domain 4  Billing, Pricing, and Support       12%    3 tasks   18 skills
                                                        19 tasks   88 skills

The guide does not number its skills. Skill ids below (1.1.1 = task statement
1.1, first "Skills in" bullet) are ours, in guide order, and are frozen once
this index locks. 88 skills map onto 50 scored questions, so the real exam
SAMPLES skills rather than covering each one.

Structure: 4 units mirroring the 4 official domains, continuous chapter
numbering 01 to 64 (12/16/27/9 chapters). Chapter count follows the amount of
material, not the weight alone: Domain 3 holds 37 of the 88 skills and nearly
every in-scope service, so it gets 27 chapters against a 34% weight. The full
mocks restore the official weighting (see the practice exam plan). Most
chapters cover one skill; merges are noted inline where two skills are the
same concept. Trade-off lessons are flagged (TO). Every skill is mapped.

===============================================================================
Unit 1: Cloud Concepts (24%, 12 skills)
===============================================================================

Task statements: 1.1 Define the benefits of the AWS Cloud. 1.2 Identify design
principles of the AWS Cloud. 1.3 Understand the benefits of and strategies for
migration to the AWS Cloud. 1.4 Understand concepts of cloud economics.

Official skills, mapped to chapters:

    1.1.1  Understanding the benefits of global infrastructure (speed of
           deployment, global reach) ................................ Ch 02
    1.1.2  Understanding the advantages of high availability, elasticity,
           and agility .............................................. Ch 03
    1.2.1  Understanding the pillars of the Well-Architected Framework
           (operational excellence, security, reliability, performance
           efficiency, cost optimization, sustainability) ........... Ch 04
    1.2.2  Identifying differences between the pillars .............. Ch 05
    1.3.1  Understanding the components of the AWS Cloud Adoption
           Framework (reduced business risk, improved ESG performance,
           increased revenue, increased operational efficiency) ..... Ch 06
    1.3.2  Identifying appropriate migration strategies (for example,
           database replication) ................................ Ch 07, 08
    1.4.1  Understanding the role of fixed costs compared with variable
           costs .................................................... Ch 09
    1.4.2  Understanding costs associated with on-premises environments  Ch 09
    1.4.3  Understanding the differences between licensing strategies
           (BYOL compared with included licenses) ................... Ch 10
    1.4.4  Understanding the concept of rightsizing ................. Ch 11
    1.4.5  Identifying benefits of automation ....................... Ch 12
    1.4.6  Understanding the economies of scale ..................... Ch 12

Chapters:

    01  The value proposition of the AWS Cloud
        The orientation chapter: on-demand delivery, pay as you go, and the
        advantages of cloud computing as AWS states them. (Knowledge item of
        1.1, "Value proposition of the AWS Cloud")
    02  Global infrastructure benefits: speed of deployment and global reach
        The benefit view only; Ch 32 to 34 teach the components. (1.1.1)
    03  High availability, elasticity, and agility
        Three terms the exam swaps as distractors; scalability named as the
        contrast to elasticity. (1.1.2)
    04  The six pillars of the Well-Architected Framework
        One line and one design principle per pillar; the AWS
        Well-Architected Tool named as where a review happens. (1.2.1)
    05  Telling the pillars apart: which pillar does this scenario belong to
        Scenario-to-pillar matching, with the look-alike pairs (reliability
        vs performance efficiency, cost optimization vs sustainability).
        (1.2.2)
    06  The AWS Cloud Adoption Framework: perspectives and outcomes
        Six perspectives (business, people, governance, platform, security,
        operations) and the four outcomes the guide lists. (1.3.1)
    07  Migration strategies: the 7 Rs
        Retire, retain, rehost, relocate, repurchase, replatform, refactor;
        the signal that picks each. (1.3.2)
    08  Tools for the migration journey
        Migration Evaluator, AWS Application Discovery Service, AWS
        Migration Hub, AWS Application Migration Service, and database
        replication with AWS DMS (detail in Ch 42). (1.3.2, knowledge item
        "Resources to support the cloud migration journey")
    09  Fixed vs variable costs, and what on-premises really costs (TO)
        Capital expense vs operating expense; the on-premises cost list
        (hardware, facilities, power, staff) behind a total cost comparison.
        (1.4.1, 1.4.2)
    10  Licensing: Bring Your Own License vs license included (TO)
        Which signal picks which; AWS License Manager and Dedicated Hosts
        named as where BYOL lands. (1.4.3)
    11  Rightsizing
        Matching instance size to demand; AWS Compute Optimizer and Cost
        Explorer as the recommendation sources. (1.4.4)
    12  Automation and economies of scale
        Why automation lowers cost and error; why AWS aggregate usage lowers
        pay-as-you-go prices. (1.4.5, 1.4.6)

===============================================================================
Unit 2: Security and Compliance (30%, 21 skills)
===============================================================================

Task statements: 2.1 Understand the AWS shared responsibility model. 2.2
Understand AWS Cloud security, governance, and compliance concepts. 2.3
Identify AWS access management capabilities. 2.4 Identify components and
resources for security.

Official skills, mapped to chapters:

    2.1.1  Recognizing the components of the shared responsibility model  Ch 13
    2.1.2  Describing the customer's responsibilities on AWS ........ Ch 14
    2.1.3  Describing AWS responsibilities .......................... Ch 13
    2.1.4  Describing responsibilities that the customer and AWS share  Ch 14
    2.1.5  Describing how responsibilities shift depending on the service
           used (Amazon RDS, AWS Lambda, Amazon EC2) ................ Ch 15
    2.2.1  Identifying where to find AWS compliance information (AWS
           Artifact) ................................................ Ch 16
    2.2.2  Understanding compliance needs among geographic locations or
           industries ............................................... Ch 16
    2.2.3  Describing how customers secure resources on AWS (Amazon
           Inspector, AWS Security Hub, Amazon GuardDuty, AWS Shield)  Ch 18
    2.2.4  Identifying encryption options (in transit, at rest) ..... Ch 19
    2.2.5  Recognizing services that aid in governance and compliance
           (monitoring with Amazon CloudWatch; auditing with AWS
           CloudTrail and AWS Config; reporting with access reports)  Ch 20
    2.2.6  Recognizing compliance requirements that vary among AWS
           services ................................................. Ch 16
    2.3.1  Understanding access keys, password policies, and credential
           storage (AWS Secrets Manager, AWS Systems Manager) ....... Ch 24
    2.3.2  Identifying authentication methods in AWS (MFA, IAM Identity
           Center, cross-account IAM roles) ......................... Ch 23
    2.3.3  Defining groups, users, custom policies, and managed policies
           in compliance with the principle of least privilege ...... Ch 21
    2.3.4  Identifying tasks that only the account root user can perform  Ch 22
    2.3.5  Understanding which methods can achieve root user protection  Ch 22
    2.3.6  Understanding the types of identity management (federated)  Ch 25
    2.4.1  Describing AWS security features and services (AWS WAF, AWS
           Firewall Manager, AWS Shield, Amazon GuardDuty) .......... Ch 26
    2.4.2  Understanding that third-party security products are available
           from AWS Marketplace ..................................... Ch 27
    2.4.3  Identifying where AWS security information is available (AWS
           Knowledge Center, AWS Security Center, AWS Security Blog)  Ch 27
    2.4.4  Understanding the use of AWS services for identifying security
           issues (AWS Trusted Advisor) ............................. Ch 28

Chapters:

    13  The shared responsibility model: security of the cloud
        The two halves of the model and what AWS owns: facilities, hardware,
        the global infrastructure, the managed service layers. (2.1.1, 2.1.3)
    14  Security in the cloud: customer and shared controls
        Customer data, identity, configuration; the shared controls (patch
        management, configuration management, awareness and training).
        (2.1.2, 2.1.4)
    15  How responsibility shifts: Amazon EC2 vs Amazon RDS vs AWS Lambda (TO)
        Three points on the managed spectrum; who patches the operating
        system is the signal. (2.1.5)
    16  Compliance: AWS Artifact, programs, and what varies by Region, industry
        and service
        Where reports and agreements live; that a service must be in scope
        for a given program. (2.2.1, 2.2.2, 2.2.6)
    17  Governance at scale: AWS Organizations and AWS Control Tower
        Accounts, organizational units, service control policies as
        guardrails; billing features are Ch 60. (Knowledge item of 2.2, "AWS
        compliance and governance concepts")
    18  Detecting threats and findings: GuardDuty, Inspector, Security Hub,
        Macie, Detective
        One job per service; the exam asks which one fits the sentence.
        (2.2.3)
    19  Encryption at rest and in transit
        AWS KMS and AWS CloudHSM at rest, TLS and AWS Certificate Manager in
        transit. (2.2.4)
    20  Monitoring vs auditing: CloudWatch vs CloudTrail vs AWS Config (TO)
        Metrics and alarms, who called which API, how a resource's
        configuration changed; where each log lives; IAM access reports.
        (2.2.5, knowledge item "Where to capture and locate logs")
    21  IAM users, groups, roles, and policies under least privilege
        Managed vs custom policies; the principle of least privilege as the
        rule that picks among them. (2.3.3)
    22  The root user: what only it can do and how to protect it
        Root-only tasks, MFA on root, no root access keys, daily work
        through other identities. (2.3.4, 2.3.5)
    23  Authentication methods: MFA, IAM Identity Center, cross-account roles
        (2.3.2)
    24  Access keys, password policies, and storing credentials
        AWS Secrets Manager vs AWS Systems Manager Parameter Store at the
        recognition level. (2.3.1)
    25  Identity management types: federation, workforce and customer identities
        IAM Identity Center for the workforce, Amazon Cognito for app users,
        AWS Directory Service for Microsoft Active Directory. (2.3.6)
    26  Protecting applications: AWS WAF, AWS Shield, AWS Firewall Manager
        Layer 7 filtering, DDoS protection (Standard vs Advanced), central
        rule management. GuardDuty is taught in Ch 18 and named here. (2.4.1)
    27  Where security help lives: AWS Marketplace and AWS security resources
        Third-party security products; AWS Knowledge Center, AWS Security
        Center, AWS Security Blog. (2.4.2, 2.4.3)
    28  AWS Trusted Advisor for security checks
        The security category of checks; cost and support-plan angles are
        Ch 62. (2.4.4)

===============================================================================
Unit 3: Cloud Technology and Services (34%, 37 skills)
===============================================================================

Task statements: 3.1 Define methods of deploying and operating in the AWS
Cloud. 3.2 Define the AWS global infrastructure. 3.3 Identify AWS compute
services. 3.4 Identify AWS database services. 3.5 Identify AWS network
services. 3.6 Identify AWS storage services. 3.7 Identify AWS AI/ML services
and analytics services. 3.8 Identify services from other in-scope AWS service
categories.

Official skills, mapped to chapters:

    3.1.1  Deciding between programmatic access (APIs, SDKs, CLI), the AWS
           Management Console, and infrastructure as code ....... Ch 29, 30
    3.1.2  Evaluating requirements to determine whether to use one-time
           operations or repeatable processes ....................... Ch 30
    3.1.3  Identifying deployment models (cloud, hybrid, on-premises)  Ch 31
    3.2.1  Describing relationships among Regions, Availability Zones,
           and edge locations ....................................... Ch 32
    3.2.2  Describing how to achieve high availability by using multiple
           Availability Zones ....................................... Ch 33
    3.2.3  Recognizing that Availability Zones do not share single points
           of failure ............................................... Ch 33
    3.2.4  Describing when to use multiple Regions (disaster recovery,
           business continuity, low latency, data sovereignty) ...... Ch 34
    3.3.1  Recognizing the appropriate use of EC2 instance types .... Ch 35
    3.3.2  Recognizing the appropriate use of container options (Amazon
           ECS, Amazon EKS) ......................................... Ch 36
    3.3.3  Recognizing the appropriate use of serverless compute options
           (AWS Fargate, Lambda) .................................... Ch 37
    3.3.4  Recognizing that auto scaling provides elasticity ........ Ch 38
    3.3.5  Identifying the purposes of load balancers ............... Ch 38
    3.4.1  Deciding when to use EC2 hosted databases or AWS managed
           databases ................................................ Ch 40
    3.4.2  Identifying relational databases (Amazon RDS, Amazon Aurora)  Ch 41
    3.4.3  Identifying NoSQL databases (DynamoDB) ................... Ch 42
    3.4.4  Identifying memory-based databases (Amazon ElastiCache) .. Ch 42
    3.4.5  Identifying database migration tools (AWS DMS, AWS SCT) .. Ch 43
    3.5.1  Identifying the components of a VPC (subnets, gateways) .. Ch 44
    3.5.2  Understanding security in a VPC (network ACLs, security
           groups, Amazon Inspector) ................................ Ch 45
    3.5.3  Understanding the purpose of Amazon Route 53 ............. Ch 46
    3.5.4  Identifying network connectivity options to AWS (AWS VPN, AWS
           Direct Connect) .......................................... Ch 47
    3.6.1  Identifying the uses for object storage .................. Ch 48
    3.6.2  Recognizing the differences in Amazon S3 storage classes . Ch 49
    3.6.3  Identifying block storage solutions (Amazon EBS, instance
           store) ................................................... Ch 50
    3.6.4  Identifying file services (Amazon EFS, Amazon FSx) ....... Ch 50
    3.6.5  Identifying cached file systems (AWS Storage Gateway) .... Ch 51
    3.6.6  Understanding use cases for lifecycle policies ........... Ch 49
    3.6.7  Understanding use cases for AWS Backup ................... Ch 51
    3.7.1  Understanding AI/ML services and the tasks they accomplish
           (Amazon SageMaker AI, Amazon Lex) ........................ Ch 52
    3.7.2  Identifying the services for data analytics (Amazon Athena,
           Amazon Kinesis, AWS Glue, Amazon Quick) .................. Ch 53
    3.8.1  Choosing the appropriate service to deliver messages and to
           send alerts and notifications ............................ Ch 54
    3.8.2  Choosing the appropriate service to meet business application
           needs .................................................... Ch 55
    3.8.3  Choosing the appropriate option for business support
           assistance ............................................... Ch 61
    3.8.4  Identifying the tools to develop, deploy, and troubleshoot
           applications ............................................. Ch 39
    3.8.5  Identifying the services that can present the output of
           virtual machines on end-user machines .................... Ch 55
    3.8.6  Identifying the services that can create and deploy frontend
           and mobile services ...................................... Ch 39
    3.8.7  Identifying the services that manage IoT devices ......... Ch 53

Chapters:

    29  Ways to reach AWS: the Console, the CLI, SDKs, and APIs
        Every path ends in an API call; which path suits which person or
        program. (3.1.1 part)
    30  Infrastructure as code and repeatable processes
        AWS CloudFormation; one-time operation vs repeatable process as the
        deciding question. (3.1.1 part, 3.1.2)
    31  Deployment models: cloud, hybrid, and on-premises (TO)
        AWS Outposts as the on-premises extension. (3.1.3)
    32  Regions, Availability Zones, and edge locations
        How the three nest; Amazon CloudFront and AWS Global Accelerator as
        what edge locations are for. (3.2.1, knowledge item "Benefits of
        edge locations")
    33  High availability across Availability Zones
        Multi-AZ design; AZs share no single point of failure. (3.2.2, 3.2.3)
    34  When to use multiple Regions
        Disaster recovery, business continuity, latency, data sovereignty;
        AWS Elastic Disaster Recovery named. (3.2.4)
    35  Amazon EC2 instance types
        General purpose, compute, memory, storage optimized, accelerated;
        the workload that picks each. Lightsail, Elastic Beanstalk and AWS
        Batch named as the simpler doors to compute. (3.3.1)
    36  Containers: Amazon ECS vs Amazon EKS (TO)
        Amazon ECR as the registry both share. (3.3.2)
    37  Serverless compute: AWS Lambda vs AWS Fargate (TO)
        Event-driven functions vs serverless containers. (3.3.3)
    38  Auto scaling and load balancers
        Amazon EC2 Auto Scaling gives elasticity; Elastic Load Balancing
        spreads traffic and checks health. (3.3.4, 3.3.5)
    39  Tools to build, deploy, and troubleshoot applications
        AWS CodeBuild, AWS CodePipeline, AWS X-Ray, AWS Amplify, Amazon API
        Gateway, AWS Step Functions at one line each. (3.8.4, 3.8.6)
    40  A database on EC2 vs a managed database (TO)
        Control vs operational burden; ties back to Ch 15. (3.4.1)
    41  Relational databases: Amazon RDS and Amazon Aurora
        Amazon Redshift named as the warehouse, taught in Ch 53. (3.4.2)
    42  NoSQL and in-memory databases: DynamoDB, ElastiCache, and the rest
        Amazon DocumentDB and Amazon Neptune at one line each. (3.4.3, 3.4.4)
    43  Database migration: AWS DMS and AWS SCT
        Same engine vs different engine as the signal for SCT. (3.4.5)
    44  The parts of a VPC: subnets, route tables, and gateways
        Public vs private subnet; internet gateway and NAT gateway. (3.5.1)
    45  Security in a VPC: security groups vs network ACLs (TO)
        Stateful vs stateless, instance vs subnet; Amazon Inspector named
        as the network reachability scanner. (3.5.2)
    46  Amazon Route 53
        DNS, domain registration, routing policies and health checks at the
        recognition level. (3.5.3)
    47  Connecting to AWS: AWS VPN vs AWS Direct Connect (TO)
        Site-to-Site VPN and Client VPN vs a dedicated line; AWS Transit
        Gateway and AWS PrivateLink at one line each. (3.5.4)
    48  Object storage with Amazon S3
        Buckets, objects, durability; what object storage is for. (3.6.1)
    49  Amazon S3 storage classes and lifecycle policies (TO)
        Access frequency and retrieval time pick the class, including the
        S3 Glacier classes; lifecycle rules move data down. Pricing angle is
        Ch 58. (3.6.2, 3.6.6)
    50  Block and file storage: Amazon EBS, instance store, Amazon EFS, Amazon
        FSx (TO)
        (3.6.3, 3.6.4)
    51  Hybrid storage and backup: AWS Storage Gateway and AWS Backup
        (3.6.5, 3.6.7)
    52  AI and ML services and the tasks they do
        Amazon SageMaker AI, Lex, Polly, Transcribe, Translate, Comprehend,
        Rekognition, Textract, Amazon Q: one task each. (3.7.1)
    53  Analytics and IoT services
        Amazon Athena, Amazon Kinesis, AWS Glue, Amazon Quick, Amazon
        Redshift, Amazon EMR, Amazon OpenSearch Service; AWS IoT Core for
        device fleets. (3.7.2, 3.8.7)
    54  Messaging: Amazon SNS vs Amazon SQS vs Amazon EventBridge (TO)
        Push fan-out, pull queue, event routing. (3.8.1)
    55  Business applications and end-user computing
        Amazon Connect and Amazon SES; Amazon WorkSpaces, Amazon AppStream
        2.0, Amazon WorkSpaces Secure Browser. (3.8.2, 3.8.5)

Note: Ch 39 sits with compute because developer tools follow naturally from
"where code runs", so play order inside Unit 3 does not follow task statement
order for 3.8. If strict guide order is preferred, move it to follow Ch 54 and
renumber before the lock.

===============================================================================
Unit 4: Billing, Pricing, and Support (12%, 18 skills)
===============================================================================

Task statements: 4.1 Compare AWS pricing models. 4.2 Understand resources for
billing, budget, and cost management. 4.3 Identify AWS technical resources and
AWS Support options.

Official skills, mapped to chapters:

    4.1.1  Identifying when to use various compute purchasing options  Ch 56
    4.1.2  Describing Reserved Instance flexibility ................. Ch 57
    4.1.3  Describing Reserved Instance behavior in AWS Organizations  Ch 57
    4.1.4  Understanding incoming and outgoing data transfer costs .. Ch 58
    4.1.5  Understanding pricing options for storage options and tiers  Ch 58
    4.2.1  Understanding the uses and capabilities of AWS Budgets and AWS
           Cost Explorer ............................................ Ch 59
    4.2.2  Understanding the uses and capabilities of AWS Pricing
           Calculator ............................................... Ch 59
    4.2.3  Understanding AWS Organizations consolidated billing and
           allocation of costs ...................................... Ch 60
    4.2.4  Understanding types of cost allocation tags and their relation
           to billing reports (AWS Cost and Usage Report) ........... Ch 60
    4.3.1  Locating AWS whitepapers, blogs, and documentation ....... Ch 63
    4.3.2  Identifying and locating AWS technical resources (AWS
           Prescriptive Guidance, AWS Knowledge Center, AWS re:Post)  Ch 63
    4.3.3  Identifying AWS Support options (customer service and
           communities, Basic Support, AWS Business Support+, AWS
           Enterprise Support, AWS Unified Operations) .............. Ch 61
    4.3.4  Identifying the role of Trusted Advisor, AWS Health Dashboard,
           and the AWS Health API ................................... Ch 62
    4.3.5  Identifying the role of the AWS Trust and Safety team .... Ch 63
    4.3.6  Understanding the role of AWS Partners (AWS Marketplace,
           independent software vendors, system integrators) ........ Ch 64
    4.3.7  Identifying the benefits of being an AWS Partner ......... Ch 64
    4.3.8  Identifying the key services that AWS Marketplace offers . Ch 64
    4.3.9  Identifying technical assistance options (AWS Professional
           Services, AWS solutions architects) ...................... Ch 63

Chapters:

    56  Compute purchasing options (TO)
        On-Demand, Reserved Instances, Savings Plans, Spot, Dedicated Hosts,
        Dedicated Instances, Capacity Reservations; the workload signal that
        picks each. (4.1.1)
    57  Reserved Instances: flexibility and sharing across an organization
        Standard vs Convertible, Regional vs zonal scope, how the discount
        applies across accounts under consolidated billing. (4.1.2, 4.1.3)
    58  Data transfer and storage pricing
        Data in vs data out, within a Region vs between Regions; storage
        class price trade-offs. (4.1.4, 4.1.5)
    59  AWS Budgets vs AWS Cost Explorer vs AWS Pricing Calculator (TO)
        Alert on a threshold, analyze past and forecast spend, estimate
        before you build. (4.2.1, 4.2.2)
    60  Consolidated billing, cost allocation tags, and the Cost and Usage
        Report
        One bill for an organization; AWS-generated vs user-defined tags.
        (4.2.3, 4.2.4)
    61  AWS Support plans (TO)
        The plan names exactly as guide version 1.3 lists them: Basic
        Support, AWS Business Support+, AWS Enterprise Support, AWS Unified
        Operations; AWS Support Center as where cases open. Verify every
        feature and response time against the current AWS Support page
        before authoring. (4.3.3, 3.8.3)
    62  Trusted Advisor, AWS Health Dashboard, and the AWS Health API
        Check categories, account-specific events, programmatic access.
        (4.3.4)
    63  Where to find help: documentation, guidance, and people
        Whitepapers, AWS Prescriptive Guidance, AWS Knowledge Center, AWS
        re:Post, AWS Professional Services, AWS solutions architects, and
        the AWS Trust and Safety team for abuse reports. (4.3.1, 4.3.2,
        4.3.5, 4.3.9)
    64  AWS Partners and AWS Marketplace
        Independent software vendors vs system integrators, partner
        benefits, what Marketplace offers buyers. (4.3.6, 4.3.7, 4.3.8)

===============================================================================
Cross-reference notes (deliberate syllabus overlap)
===============================================================================

    AWS Trusted Advisor is named in 2.4.4 and 4.3.4: Ch 28 teaches the
      security checks, Ch 62 the cost and service-limit checks and how the
      support plan changes which checks are available.
    AWS Organizations is governance in Ch 17 and billing in Ch 57 and 60.
    AWS Shield and Amazon GuardDuty are named in both 2.2.3 and 2.4.1: Ch 18
      owns GuardDuty, Ch 26 owns Shield, each names the other.
    Amazon Inspector is named in 2.2.3 and 3.5.2: Ch 18 teaches it, Ch 45
      names it.
    AWS Marketplace is security products in Ch 27 and the catalog itself in
      Ch 64.
    Business support (3.8.3) is taught with the support plans in Ch 61.
    High availability is a benefit in Ch 03 and a design in Ch 33.
    Rightsizing (Ch 11) and purchasing options (Ch 56) are the two halves of
      compute cost; each names the other.

===============================================================================
Practice exam plan
===============================================================================

Exam prefix: clf-practice-exam-NN.html.

    01  Unit 1   chapters 01 to 12   12 questions   24 minutes
    02  Unit 2   chapters 13 to 28   16 questions   32 minutes
    03  Unit 3   chapters 29 to 55   27 questions   54 minutes
    04  Unit 4   chapters 56 to 64    9 questions   18 minutes
                                     64 questions, one per chapter

    05 to 07  Sealed full mocks: 50 questions, 90 minutes, sampled at the
              official weights as 12/15/17/6 by domain, five select-two
              items each, their own scenarios, chapters sampled so the three
              together reach all 64. Never reused in the unit exams and
              never drawn into drills.

Unit exams carry two or three select-two items each. Question headers read
`/* QN · Ch NN · skill id */` and every question carries `ref: { chapter: N }`.
Practice target 70%, labelled as our guidance (the real exam reports a scaled
700 of 1,000). Each unit's last chapter (12, 28, 55, 64) points its NAV.next
at that unit's exam.

Later: practice hub practice/aws-clf-c02 (four bars at the official
24/30/34/12 weights, "% of exam") and a readiness quiz ready/aws-clf-c02 (12
new questions at 3/4/4/1).

===============================================================================
Terminology rules
===============================================================================

See cert-config-aws-clf-c02.md.
