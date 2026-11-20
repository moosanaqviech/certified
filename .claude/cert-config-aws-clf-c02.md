# Cert Config: AWS Certified Cloud Practitioner (CLF-C02)

Per-certification settings so the frozen engine rules stay generic. Pairs with
curriculum-index-aws-clf-c02.md (chapter placement; LOCKED 20 Nov 2026, transcribed from the
official exam guide PDF, version 1.3, dated October 29, 2026, downloaded from
docs.aws.amazon.com on 20 Nov 2026). The index was LOCKED on 20 Nov 2026.

## Identity

    Badge text: "AWS Cloud Practitioner (CLF-C02)"
    Course folder: aws-cloud-practitioner/
    Course id: aws-clf (gate.ts, _shared.mjs, exam CHAPTERS tables)
    Catalog id: aws-clf-c02 (catalog.json; never rename once shipped)
    Difficulty: Foundational (`difficulty-badge--foundational`, the second
      Foundational course after AIF-C01; it sits FIRST in the AWS block of
      every course list, before AIF-C01, by the vendor, track, level rule:
      confirm the slot at wiring time)
    Standard blurb: Bite-sized, visual lessons for the AWS Certified Cloud
      Practitioner (CLF-C02) exam, built to teach the recognition and
      selection reasoning the test rewards across cloud concepts, security,
      core AWS services, and billing.
    Exam guide version: CLF-C02 version 1.3, published October 29, 2026
      (1.0 June 24, 2026; 1.1 August 28, 2026; 1.2 September 24, 2026).
      Source: https://docs.aws.amazon.com/pdfs/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.pdf
      There is no CLF-C03 in the official guide; ignore third-party pages
      that use that code.
    Questions: 65 presented (50 scored + 15 unscored, unidentified). Two
      types: multiple choice (1 of 4) and multiple response (2+ of 5+).
    Time: 90 minutes (from the AWS cert page via
      blog/aws-cloud-practitioner-exam-cost-format-questions.html; the PDF
      does not state it).
    Pace: 2 minutes per question in unit exams. Full mocks are 50 questions
      in 90 minutes, the AIF-C01 mock shape.
    Pass threshold: 700 on a 100 to 1,000 scaled score. Compensatory
      scoring. Use 70% as the practice target and label it as our guidance.
    Cost: USD 100 (from the AWS cert page via the blog; re-check at lock).
    Domains: 1 Cloud Concepts 24%, 2 Security and Compliance 30%, 3 Cloud
      Technology and Services 34%, 4 Billing, Pricing, and Support 12%.
    Target candidate: up to 6 months of AWS exposure, no specific job role.
      Coding, architecture design, troubleshooting, implementation and load
      testing are OUT of scope, so lessons stay at recognition and selection.
    Code language: none by default. A single CLI command, a short IAM policy
      snippet, or a service name is the most code a card should carry.
    Pricing: paid from launch on the AIF-C01 model, $9.99, Unit 1 free
      through clf-practice-exam-01. Netlify env var STRIPE_PRICE_AWS_CLF.
      (Assumption approved with the onboarding plan; change here first if
      the price or free unit changes.)

## Course structure and eyebrows

    Two levels: Unit (exam domain) > Chapter, matching AIF-C01 and DEA-C01.
    Cover eyebrow: "Unit N · Chapter NN" (middle dot separator).
    Practice exams: one per unit (01 to 04), then three sealed full mocks
      (05 to 07). Question headers cite the chapter and our skill id.
    Template: v2 only (NAV, step builds, animated cover, "Back to quiz" bar).
      Every `data-step` element carries an inline `pointer-events:none`, the
      SAA-C03 rule, so a revealed step never covers a quiz choice.

## File naming

    Lessons: lesson-NN-name.html, numbered 01-64 per the curriculum index.
    Practice exams: clf-practice-exam-NN.html. 01 to 04 are unit exams; 05
      to 07 are the sealed full mocks.
    Practice hub: practice/aws-clf-c02.html (served at /practice/aws-clf-c02),
      a clone of practice/aws-aif-c01.html with four bars.
    Readiness quiz: ready/aws-clf-c02.html (served at /ready/aws-clf-c02).
    All lessons and exams live in aws-cloud-practitioner/.

## Terminology rules

Current official names only, taken from the version 1.3 exam guide's own
wording. Names marked (verify) changed recently enough that the current docs
page must be fetched before the chapter that teaches them is written.

    Support plans (verify, Ch 61): "Basic Support", "AWS Business Support+",
      "AWS Enterprise Support", "AWS Unified Operations", exactly as the
      guide lists them. The guide no longer lists Developer Support or
      Enterprise On-Ramp: do not teach either as a current plan, and confirm
      on the AWS Support page whether each should be named once as a former
      plan. The published CLF blog posts predate this wording and need a
      check (see site wiring).
    ML platform: "Amazon SageMaker AI", never "Amazon SageMaker" alone.
    BI: "Amazon Quick" as the guide writes it (verify; never "Amazon
      QuickSight" unless the docs page for the feature still uses it).
    Assistants: "Amazon Q" as the guide writes it (verify which surfaces the
      current docs still list under that name before Ch 52).
    End-user computing: "Amazon WorkSpaces Secure Browser" (formerly
      WorkSpaces Web, name the old one never); "Amazon AppStream 2.0" as the
      guide writes it. Checked 20 Nov 2026: its docs are now titled "Amazon
      WorkSpaces Applications"; Ch 55 and exam 03 name that once.
    BI: the docs title the suite "AWS Quick" with "Quick Sight" dashboards
      (formerly Amazon QuickSight); lessons use the guide's "Amazon Quick"
      and name the docs titles once (Ch 53).
    Amazon Q (checked 20 Nov 2026): Amazon Q Business is closed to new
      customers (AWS suggests Amazon Quick); the console chat is now the
      "AWS assistant"; Q Developer IDE plugins end support 30 Apr 2027.
      Ch 52 states this once; no question hinges on Amazon Q.
    Lambda: the quotas page now gives a maximum timeout of 30 minutes, not
      the 15 in older material; never quote a figure in a question.
    Identity: "AWS IAM Identity Center", never "AWS Single Sign-On" or "AWS
      SSO". "AWS Identity and Access Management (IAM)" on first mention.
    Billing: "AWS Cost and Usage Reports" (the guide's in-scope list) or
      "AWS Cost and Usage Report" in running prose as skill 4.2.4 writes it;
      "AWS Pricing Calculator"; "AWS Billing and Cost Management" for the
      console. "AWS Health Dashboard", never "Personal Health Dashboard" or
      "Service Health Dashboard".
    Storage: the "S3 Glacier storage classes" (S3 Glacier Instant Retrieval,
      S3 Glacier Flexible Retrieval, S3 Glacier Deep Archive). Vault-based
      Amazon Glacier is closed to new customers: never teach vaults.
    Data transfer devices: the Snow Family is not in the guide's in-scope
      list and Snowball Edge is closed to new customers, so no question
      hinges on it; name it at most once as a contrast in Ch 08.
    Migration: "AWS Application Migration Service" (never "CloudEndure" or
      "Server Migration Service"), "AWS Database Migration Service (AWS
      DMS)", "AWS Schema Conversion Tool (AWS SCT)", "Migration Evaluator".
      Checked 20 Nov 2026: the AWS docs now title Application Migration
      Service "AWS Transform MGN"; lessons keep the guide's name and name the
      docs title once (Ch 08). AWS Migration Hub (closed to new customers 7
      Nov 2025) and AWS Application Discovery Service (closed to new
      customers) are still in the guide's in-scope list: lessons teach what
      each does, state the status once, name AWS Transform as the similar
      current service, and no question hinges on either.
    Scaling: "Amazon EC2 Auto Scaling" for EC2 fleets, "AWS Auto Scaling"
      for the cross-service planner, "Elastic Load Balancing" for the
      service.
    Streaming: "Amazon Kinesis" as the guide writes it. Repo-wide AWS rules
      apply if delivery or Flink comes up: "Amazon Data Firehose", "Amazon
      Managed Service for Apache Flink".
    Well-Architected: six pillars, sustainability included; "AWS
      Well-Architected Tool". The framework was restructured on 16 Nov 2026
      (pillar whitepapers merged into one document, a new Cloud Foundations
      section); the six pillars are unchanged. Ch 04 names the change once.
    Security Hub (checked 20 Nov 2026): "AWS Security Hub" is now the
      unified service that correlates findings from GuardDuty, Inspector,
      Macie and posture checks; the standards checks (FSBP, CIS, PCI DSS)
      are documented as "AWS Security Hub CSPM". Ch 18 teaches both and
      names the split once.
    Root-only tasks (IAM docs, checked 20 Nov 2026): standalone accounts
      need root only to change the account email, root password and root
      access keys, plus closing or reopening the account, restoring IAM
      permissions, activating IAM billing access, S3 MFA delete, Reserved
      Instance Marketplace seller registration and GovCloud sign-up.
      Changing other account settings (and the support plan) is no
      longer listed: never test it as root-only.
    Purchasing (checked 20 Nov 2026): the EC2 docs recommend Savings Plans
      over Reserved Instances; RI and Savings Plans discount sharing is
      controlled by the management account (organization-wide, level
      sharing, or per account). Discount percentages are never quoted.
    Support plans: Developer Support and Business Support are
      discontinued on 1 Jan 2027 (Trusted Advisor docs); teach only the
      four guide 1.3 plans.
    Out-of-scope services (the guide's list, for example AWS Transfer
      Family, Amazon MSK, AWS Network Firewall, AWS CodeDeploy, AWS
      CloudShell, Amazon FSx for Lustre) never appear as a correct answer;
      they may appear only as a distractor when a learner would plausibly
      meet the name.

## Recommended-vs-contrast stances

    Root user: lock it away (MFA, no access keys) and work through IAM
      Identity Center or roles; daily root use is the contrast (Ch 22).
    Workforce access: IAM Identity Center with temporary credentials is the
      recommendation; long-lived IAM user access keys are the contrast
      (Ch 23, 24).
    Databases: a managed database is the default; a database on EC2 is the
      contrast for when the engine, version or operating system control is
      not offered (Ch 40).
    Provisioning: infrastructure as code for anything repeated; console
      clicks are the contrast for one-time work (Ch 30).
    Availability: multiple Availability Zones is the baseline; multiple
      Regions is the contrast, chosen for disaster recovery, latency or
      data sovereignty (Ch 33, 34).
    Commitment discounts: Savings Plans are the flexible recommendation for
      steady compute; Reserved Instances are taught because the guide tests
      their behavior specifically (Ch 56, 57).

## Palette registry

The course home keeps the shared gold home theme; gold stays reserved for
exams and course homes product-wide. Lesson accents are assigned per chapter
band, semantically, and collision-checked at authoring time against every
--accent on the site, the other AWS courses first (AIF-C01, SAA-C03, DEA-C01,
MLA-C02 share services with this one). Record the final --accent hex here as
each band ships.

    Unit 1  Cloud Concepts              sky and aqua (open sky, first
                                        principles); AIF-C01 Unit 1 also sits
                                        in sky, so pick hexes at least 30 RGB
                                        units from its #6cc4ff and #5be3f0
    Unit 2  Security and Compliance     steel slate (protection), with rose
                                        for the threat chapters (Ch 18, 26),
                                        the AWS-wide convention
    Unit 3  Cloud Technology            one family per task statement:
            3.1 to 3.2 access and infrastructure   teal
            3.3 compute and developer tools        coral orange
            3.4 databases                          violet
            3.5 networking                         cyan blue
            3.6 storage                            leaf green
            3.7 to 3.8 AI, analytics, integration  magenta
    Unit 4  Billing, Pricing, Support   mint and lime (money), kept clear of
                                        gold

    Shipped accents (assigned 20 Nov 2026, checked against every --accent on
    the site):
      Unit 1 Ch 01-06  cloud sky  #a0c4ec  (value and design principles; 36.8
                                           RGB units from the nearest, #9fabd1)
      Unit 1 Ch 07-12  aqua       #3cf2f2  (migration and economics; 34.5 from
                                           the nearest, AIF's #5be3f0)
      Unit 2 Ch 13-17, 19-25, 27-28  steel slate  #bcc8d8  (security and
                                           identity; 34.6 from the nearest,
                                           #a0c4ec; the steel band near
                                           AIF's #77b1c5 is crowded, so this
                                           is a paler steel)
      Unit 2 Ch 18, 26  rose  #fc447c  (threat detection and attack
                                           protection; 31.4 from the
                                           nearest, #f43f5e)
      Unit 3 (assigned 20 Nov 2026, 30 or more RGB units from every accent):
        Ch 29-34 teal    #74f8d8  (access and infrastructure)
        Ch 35-39 coral   #d87c5c  (compute and developer tools)
        Ch 40-43 violet  #bc3cf8  (databases)
        Ch 44-47 blue    #4a80d0  (networking)
        Ch 48-51 leaf    #74e834  (storage)
        Ch 52-55 magenta #f83cdc  (AI, analytics, integration, apps)
      Unit 4 (assigned 20 Nov 2026, kept clear of gold #d9a441 and AWS orange):
        Ch 56-60 lime  #acf868  (pricing and cost tools; 37.7 from the nearest)
        Ch 61-64 mint  #a4e8bc  (support and resources; 33.5 from the nearest)
    Every lesson in the course uses --bg #080d14 and the extra named colors --warm
    #ffb703, --rose #f4a3b4, --lav #c4b5fd, --mint #86efac.

Trade-off lessons (TO in the index) rely on their own chapter accent.

## Source rules (reminder)

Every card and question traces to official AWS documentation
(docs.aws.amazon.com, aws.amazon.com product and pricing pages) plus the
official CLF-C02 version 1.3 exam guide for scope. No braindump content, no
third-party question banks as material. This is the most-written-about AWS
exam, so stale third-party facts are everywhere: support plan names, service
renames and closed services must be checked against current AWS pages, never
recalled. Prices are never quoted as numbers in a question; teach the
relative order instead.

## Site wiring

Done with Unit 1 (20 Nov 2026): course home, root catalog row ("In
progress") with JSON-LD entry and AWS count, catalog.json, gate.ts and
_shared.mjs (aws-clf, STRIPE_PRICE_AWS_CLF), netlify.toml comment,
build_sitemap.py FREE_STEMS and sitemap.xml, pricing.html row, the footer
Courses column on every page carrying it, the CLF blog CTAs, and the
support plan names in blog/aws-pricing-billing-cloud-practitioner-exam.html.

Still to do:
    Each unit: lessons, its unit exam, the course home UNITS files and
      test row, every live exam's CHAPTERS.list, and the catalog row's
      question count (then scripts/build_catalog.py).
    After Unit 4: the three sealed mocks, the practice hub
      practice/aws-clf-c02 (then the Practice tab, the catalog Practice
      link, practice/index.html and the footer Practice column), the
      readiness quiz ready/aws-clf-c02, and the row's "Live now" badge.
    Owner, outside the repo: a $9.99 Stripe Price in STRIPE_PRICE_AWS_CLF.
