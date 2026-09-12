# Curriculum index: AWS Certified Machine Learning Engineer Associate (MLA-C02)

Status: DRAFT (not yet locked). Confirm placement before authoring lessons.
Source: Mirrors the MLA-C02 exam guide as published at docs.aws.amazon.com (in use from September 29, 2026; beta exam code ME1-C02).
Exam guide: https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-02/machine-learning-engineer-associate-02.html

Course folder: `aws-machine-learning-engineer-associate-mla-c02/`. Lessons: `lesson-NN-name.html`. Exams: `mla-c02-practice-exam-NN.html`.

Exam facts (from the guide): 65 questions (50 scored, 15 unscored), 130 minutes, scaled score 100 to 1,000, pass at 720, compensatory scoring. Pace: 2 minutes per question.
Question types: multiple choice and multiple response only (ordering and matching are not listed in the MLA-C02 guide). Beta exam code ME1-C02, English only, delivery from September 29, 2026; the standard exam is expected in all four exam languages in early 2027.

Every chapter cites the skill statements it covers (Skill N.M.K numbering from the guide). All 107 skills are mapped; a skill that appears in two chapters is taught once and referenced in the other. Skill 1.2.3 (streaming transforms) is taught in Chapter 03 under Module 1.1, and Skill 1.2.2 (managing features) in Chapter 07 under Module 1.1, so Module 1.2 references both rather than repeating them.

Terminology: say "Amazon SageMaker AI" (the platform) and "Amazon Bedrock". Say "Amazon Data Firehose" and "Amazon Managed Service for Apache Flink", never the old Kinesis names (see the DEA-C01 rule in CLAUDE.md). IAM, CLI, and SDK identifiers keep the pre-rename names.

Units mirror the four content domains, and each unit is divided into modules that mirror the guide's task statements (Module 1.1 is Task Statement 1.1, and so on). Chapters are grouped by their primary module and, within a module, keep the order they were drafted in; a chapter that covers skills from two modules lives in the module that owns most of its skills and is cross-referenced from the other. Chapter numbering is continuous across the course. TO marks a trade-off chapter (fixed trade-off lesson pattern).

Course page and lesson conventions: the course index.html nests `modules:[...]` inside each unit and renders a "Module N.M · title" sub-header; lesson cover eyebrows read "Unit N · Module N.M · Chapter NN". Practice exams stay one per unit (the unit is the checkpoint); exam question comment headers cite the chapter and its skill numbers.

## Unit 1: Data Preparation for ML and AI (28% of scored content)

### Module 1.1: Collect and store data

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 01 | Choosing Data Formats: Parquet, ORC, JSON, and CSV by Access Pattern | TO | `lesson-01-data-formats.html` | Skill 1.1.5: ingesting from and writing with the right format |
| 02 | Storage Decisions: S3, EBS, EFS, RDS, DynamoDB, and OpenSearch by Cost and Structure | TO | `lesson-02-storage-decisions.html` | Skills 1.1.1 and 1.1.2: extracting from data sources and configuring storage by cost, performance, structure, and compliance |
| 03 | Streaming Ingestion and Transformation: Kinesis, Managed Service for Apache Flink, Kafka, Lambda, and Spark |  | `lesson-03-streaming-ingestion-transformation.html` | Skills 1.1.4 and 1.2.3: streaming sources and transforming streaming data |
| 04 | Merging Sources and Troubleshooting Ingestion with AWS Glue and Spark |  | `lesson-04-merging-sources-troubleshooting.html` | Skills 1.1.3 and 1.1.6: merging data and debugging capacity and scalability issues |
| 05 | Vector Databases for AI: OpenSearch Service, RDS with pgvector, and Amazon S3 | TO | `lesson-05-vector-databases.html` | Skill 1.1.7: configuring scalable vector databases to a specification |
| 06 | Ingesting Multimodal Data: Text, Images, and Audio |  | `lesson-06-ingesting-multimodal-data.html` | Skill 1.1.8: storing diverse data types for AI and ML applications |
| 07 | SageMaker Feature Store: Ingesting and Managing Features |  | `lesson-07-sagemaker-feature-store.html` | Skills 1.1.9 and 1.2.2: ingesting into Feature Store and managing features |

### Module 1.2: Perform data transformation, feature engineering, and pre-processing

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 08 | Feature Engineering: Scaling, Binning, and Log Transforms |  | `lesson-08-feature-engineering.html` | Skill 1.2.4: standardization, normalization, feature splitting, binning, log transformation |
| 09 | Encoding Features: One-Hot, Binary, Label, and Tokenization |  | `lesson-09-encoding-features.html` | Skill 1.2.4: encoding categorical and text inputs (the ML-side half of pre-processing) |
| 10 | Transformation Tools: Data Wrangler vs Glue DataBrew vs Spark on EMR | TO | `lesson-10-transformation-tools.html` | Skill 1.2.1: choosing the transformation tool |
| 11 | Embedding Models: Turning Text and Images into Vectors |  | `lesson-11-embedding-models.html` | Skill 1.2.5: configuring and using embedding models for numerical representations |
| 12 | Text Pre-Processing: Tokenization and Domain-Specific Augmentation |  | `lesson-12-text-pre-processing.html` | Skill 1.2.6: advanced text pre-processing techniques |
| 13 | Preparing Documents for RAG: Chunking Strategies and Metadata Extraction | TO | `lesson-13-preparing-documents-for-rag.html` | Skill 1.2.7: chunking strategies (fixed, semantic, hierarchical) and metadata for retrieval |
| 14 | Masking, Redaction, and Anonymization |  | `lesson-14-masking-redaction-anonymization.html` | Skill 1.2.8: protecting sensitive data before it reaches a model |
| 15 | Preparing Data for FM Fine-Tuning, Continued Pre-Training, and Distillation | TO | `lesson-15-preparing-data-for-fm-customization.html` | Skill 1.2.9: dataset shapes for each customization path |

### Module 1.3: Validate data quality and manage bias

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 16 | Cleaning Data: Outliers, Missing Values, and Deduplication |  | `lesson-16-cleaning-data.html` | Skill 1.3.7: detecting outliers, imputing missing data, deduplication |
| 17 | Data Quality Validation with Glue Data Quality and DataBrew |  | `lesson-17-data-quality-validation.html` | Skill 1.3.1: validating data quality before training |
| 18 | Labeling and Annotation with SageMaker Ground Truth |  | `lesson-18-labeling-annotation.html` | Skill 1.3.2: labeling and annotating data |
| 19 | Bias Metrics and Class Imbalance Across Numeric, Text, and Image Data |  | `lesson-19-bias-metrics-class-imbalance.html` | Skills 1.3.3 to 1.3.5: identifying and mitigating bias, multimodal bias metrics, resolving class imbalance |
| 20 | Validating AI Training Data: Prompt-Response Pairs and Content Safety Screening |  | `lesson-20-validating-ai-training-data.html` | Skill 1.3.6: integrity checks for FM training data |

Eyebrow label for Unit 1 lessons: "Data Preparation for ML and AI".

## Unit 2: ML Model and Foundation Model (FM) Development (24% of scored content)

### Module 2.1: Choose appropriate modeling approaches for ML and AI solutions

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 21 | Choosing an ML Approach: Feasibility, Algorithm Family, and Interpretability | TO | `lesson-21-choosing-ml-approach.html` | Skill 2.1.3: comparing ML models, GenAI models, algorithms, and templates by interpretability, domain performance, and latency |
| 22 | Selecting a Foundation Model from Amazon Bedrock: Task Fit, Latency, and Cost | TO | `lesson-22-selecting-fm-bedrock.html` | Skills 2.1.1 and 2.1.7: evaluating FMs against task requirements and the performance, latency, cost triangle |
| 23 | Custom Models vs Managed Services vs Pre-Trained Models vs FMs | TO | `lesson-23-custom-vs-managed-vs-pretrained-vs-fm.html` | Skills 2.1.4 and 2.1.6: build-or-buy trade-offs including performance, training time, and cost |
| 24 | Fine-Tuning Strategies for Pre-Trained FMs | TO | `lesson-24-fine-tuning-strategies.html` | Skill 2.1.2: fine-tuning, continued pre-training, and distillation as business-need choices |
| 25 | RAG Architecture Patterns and Retrieval Optimization | TO | `lesson-25-rag-architecture-patterns.html` | Skills 2.1.5 and 2.2.9: selecting a RAG pattern and optimizing retrieval components and embedding models |
| 26 | AWS AI Services for Business Problems: Textract, Rekognition, Comprehend, and Transcribe |  | `lesson-26-aws-ai-services.html` | Skill 2.1.8: applying AI services to specific business problems |

### Module 2.2: Train, fine-tune, and customize models for ML and AI solutions

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 27 | SageMaker AI Built-In Algorithms and Script Mode |  | `lesson-27-built-in-algorithms-script-mode.html` | Skills 2.2.1 and 2.2.2: built-ins, common ML libraries, and script mode with supported frameworks |
| 28 | Training Mechanics: Epochs, Batch Size, Early Stopping, and Distributed Training |  | `lesson-28-training-mechanics.html` | Skills 2.2.4 and 2.2.7: fundamental hyperparameters and training time reduction |
| 29 | Hyperparameter Optimization with SageMaker AI Automatic Model Tuning |  | `lesson-29-hyperparameter-optimization-amt.html` | Skill 2.2.3: AMT strategies and configuration |
| 30 | Overfitting, Underfitting, and Catastrophic Forgetting |  | `lesson-30-overfitting-underfitting-forgetting.html` | Skill 2.2.5: regularization and the forgetting problem in fine-tuning |
| 31 | Ensembles: Combining Models for Accuracy or Cost |  | `lesson-31-ensembles.html` | Skill 2.2.6: bagging, boosting, stacking, and cheaper model cascades |
| 32 | Prompt Engineering vs Fine-Tuning for AI Customization | TO | `lesson-32-prompt-engineering-vs-fine-tuning.html` | Skill 2.2.8: task-specific prompt engineering against fine-tuning |

### Module 2.3: Analyze and evaluate the performance of ML and AI systems

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 33 | Reproducible Experiments: MLflow on SageMaker AI, Bedrock Evaluations, and Prompt Management |  | `lesson-33-reproducible-experiments.html` | Skill 2.3.1: tracking runs, evaluations, and prompt versions |
| 34 | Baselines, Drift Detection, and Shadow vs Production Variants | TO | `lesson-34-baselines-shadow-variants.html` | Skills 2.3.2 and 2.3.3: performance baselines, drift detection, and shadow testing before promotion |
| 35 | Classification and Regression Metrics: Confusion Matrix, F1, ROC AUC, and RMSE |  | `lesson-35-classification-regression-metrics.html` | Skill 2.3.6: comprehensive evaluation for traditional ML models |
| 36 | Explaining Outputs and Debugging Convergence: Clarify and Debugger |  | `lesson-36-explaining-outputs-debugging-convergence.html` | Skills 2.3.4 and 2.3.5: model explainability and convergence debugging |
| 37 | NLP Evaluation Metrics: BLEU, ROUGE, BERTScore, and Semantic Similarity |  | `lesson-37-nlp-evaluation-metrics.html` | Skill 2.3.8: scoring generated text |
| 38 | Human-in-the-Loop Evaluation and LLM-as-a-Judge | TO | `lesson-38-human-evaluation-llm-as-a-judge.html` | Skills 2.3.7 and 2.3.9: human evaluation frameworks, AI evaluation, content quality, bias detection |
| 39 | RAG System Monitoring: Retrieval Accuracy Assessment |  | `lesson-39-rag-system-monitoring.html` | Skill 2.3.10: monitoring retrieval quality |

Eyebrow label for Unit 2 lessons: "ML Model and Foundation Model (FM) Development".

## Unit 3: Deployment and Orchestration of ML and AI Workflows (24% of scored content)

### Module 3.1: Manage deployment infrastructure for ML and AI model types

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 40 | Inference Strategies: Real-Time, Batch, Asynchronous, and Serverless | TO | `lesson-40-inference-strategies.html` | Skill 3.1.3: selecting the inference strategy |
| 41 | Compute Environments and Deployment Targets: SageMaker AI vs ECS, EKS, and Lambda | TO | `lesson-41-compute-deployment-targets.html` | Skill 3.1.1: choosing compute and the deployment target |
| 42 | Orchestrators and Multi-Model or Multi-Container Deployments | TO | `lesson-42-orchestrators-multi-model.html` | Skill 3.1.2: deployment orchestrators and shared-endpoint strategies |
| 43 | FM Deployment Options: Bedrock On-Demand, Provisioned Throughput, and SageMaker AI Hosting | TO | `lesson-43-fm-deployment-options.html` | Skills 3.1.4 and 3.1.7: FM deployment options, model hosting, and resource allocation |
| 44 | Importing Outside Models: SageMaker AI and Bedrock Custom Model Import |  | `lesson-44-importing-outside-models.html` | Skill 3.1.5: deploying models built outside AWS |
| 45 | Deploying Agents: Tasks, Tool Integration, and Communication Protocols |  | `lesson-45-deploying-agents.html` | Skill 3.1.6: configuring agents for tasks, service and tool integration, agent protocols |

### Module 3.2: Provision and configure resources for ML and AI workloads based on existing architecture and requirements

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 46 | On-Demand vs Provisioned Resources for Performance and Cost | TO | `lesson-46-on-demand-vs-provisioned.html` | Skill 3.2.1: provisioning trade-offs |
| 47 | Automating Provisioning with CloudFormation and AWS CDK |  | `lesson-47-automating-provisioning-iac.html` | Skill 3.2.2: IaC with communication between stacks and orchestration services |
| 48 | Containers for ML and AI Workloads: ECR, ECS, and EKS |  | `lesson-48-containers-for-ml-ai.html` | Skill 3.2.3: building and maintaining containers |
| 49 | Programmatic Deployment: SageMaker AI SDK, CLI, and Boto3 inside a VPC |  | `lesson-49-programmatic-deployment-vpc.html` | Skills 3.2.4 and 3.2.5: hosting models from code and configuring endpoints within VPC networks |
| 50 | Auto Scaling: Endpoint Metrics and GPU Workloads |  | `lesson-50-auto-scaling-endpoints-gpu.html` | Skills 3.2.6 and 3.2.10: scaling metrics and AI-specific GPU scaling |
| 51 | Amazon Bedrock Knowledge Bases: Vector Stores, Indexing, Retrieval Strategies, and Reranking |  | `lesson-51-bedrock-knowledge-bases.html` | Skills 3.1.8, 3.2.7, and 3.2.8: knowledge base configuration, retrieval pipelines, retrieval strategies, reranking |
| 52 | Agent State Management and Agentic Workflow Infrastructure |  | `lesson-52-agent-state-agentic-infrastructure.html` | Skills 3.2.9 and 3.2.11: agent state systems and deploying agentic workflow infrastructure |

### Module 3.3: Implement automated orchestration and CI/CD pipelines for MLOps and AI workloads

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 53 | Deployment Strategies and Rollback: Blue/Green, Canary, and Linear |  | `lesson-53-deployment-strategies-rollback.html` | Skill 3.3.1: automated deployment strategies and rollback actions |
| 54 | CI/CD with CodePipeline, CodeBuild, CodeDeploy, and CodeConnections |  | `lesson-54-cicd-code-services.html` | Skills 3.3.2 and 3.3.3: configuring and troubleshooting the Code services and training and inference jobs in pipelines |
| 55 | Automated Testing for ML and AI Pipelines, Including Prompt Testing |  | `lesson-55-automated-testing-prompt-testing.html` | Skills 3.3.4 and 3.3.9: testing strategies for traditional ML and AI workloads |
| 56 | Retraining and Model Versioning: SageMaker Model Registry, MLflow, and Fine-Tuned FMs |  | `lesson-56-retraining-model-versioning.html` | Skills 3.3.5, 3.3.6, and 3.3.10: retraining mechanisms, model versions for audits, FM deployment automation with fine-tuned versioning |
| 57 | Prompt Management with Amazon Bedrock |  | `lesson-57-prompt-management.html` | Skill 3.3.7: managing prompt versions |
| 58 | Agent Deployment Pipelines and Agent Version Management |  | `lesson-58-agent-deployment-pipelines.html` | Skill 3.3.8: automated agent deployment and versioning |
| 59 | Orchestrating RAG Updates and Knowledge Base Refresh Cycles |  | `lesson-59-rag-updates-knowledge-base-refresh.html` | Skill 3.3.11: AI-specific pipeline orchestration |

Eyebrow label for Unit 3 lessons: "Deployment and Orchestration of ML and AI Workflows".

## Unit 4: Operating, Monitoring, and Securing ML and AI Solutions (24% of scored content)

### Module 4.1: Monitor ML and AI model inference and performance

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 60 | Monitoring Model Performance: CloudWatch Generative AI Observability, Bedrock Model Evaluation, and Drift Pipelines |  | `lesson-60-monitoring-model-performance.html` | Skills 4.1.1 and 4.1.6: production monitoring for traditional and FM workloads |
| 61 | Detecting Data Distribution Change and Workflow Anomalies |  | `lesson-61-distribution-change-workflow-anomalies.html` | Skills 4.1.2 and 4.1.3: anomalies in processing and inference, distribution shift |
| 62 | A/B Testing in Production |  | `lesson-62-ab-testing-production.html` | Skill 4.1.4: monitoring model performance with A/B tests |
| 63 | Monitoring Agents: Coordination Failures, Truncated Streaming, and Tool Failures |  | `lesson-63-monitoring-agents.html` | Skill 4.1.5: agent performance and coordination management |

### Module 4.2: Optimize and manage ML and AI infrastructure costs and performance

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 64 | Inference Instance Families for Performance and Cost | TO | `lesson-64-inference-instance-families.html` | Skill 4.2.1: selecting instance families for inference |
| 65 | Troubleshooting Tools: CloudWatch, Bedrock AgentCore Observability, and X-Ray |  | `lesson-65-troubleshooting-tools.html` | Skill 4.2.2: analyzing resources and tracing requests |
| 66 | Dashboards and Capacity Optimization for Cost, Performance, and Reliability |  | `lesson-66-dashboards-capacity-optimization.html` | Skills 4.2.3 and 4.2.4: dashboards and capacity tuning |
| 67 | Cost Management Tools and Purchasing Options | TO | `lesson-67-cost-tools-purchasing-options.html` | Skills 4.2.5 and 4.2.6: cost quotas and tools, Spot, On-Demand, Reserved, Savings Plans |
| 68 | FM Inference Costs: Token Usage, Provisioned Throughput, and Usage Optimization |  | `lesson-68-fm-inference-costs.html` | Skills 4.2.7 and 4.2.9: cost implications of FM inference and usage optimization |
| 69 | AI Cost Patterns: Agent Consumption, Embedding Compute, and Vector Storage |  | `lesson-69-ai-cost-patterns.html` | Skills 4.2.8 and 4.2.10: monitoring agent resource consumption and AI-specific cost patterns |

### Module 4.3: Secure ML and AI workloads and model endpoints

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 70 | Securing CI/CD Pipelines: Amazon CodeGuru and Amazon Inspector |  | `lesson-70-securing-cicd-pipelines.html` | Skill 4.3.1: code and image vulnerability checks |
| 71 | Least Privilege and IAM for ML and AI Systems |  | `lesson-71-least-privilege-iam.html` | Skills 4.3.2 and 4.3.3: least privilege on artifacts, IAM policies and roles for users and applications |
| 72 | Auditing and Compliance: AWS CloudTrail and AWS Config |  | `lesson-72-auditing-compliance.html` | Skill 4.3.4: comprehensive monitoring, auditing, compliance, and logging |
| 73 | Network Isolation: VPCs, Subnets, and Security Groups |  | `lesson-73-network-isolation.html` | Skill 4.3.6: isolating ML and AI systems |
| 74 | Troubleshooting Security and Mitigating AI Risks |  | `lesson-74-troubleshooting-security-ai-risks.html` | Skills 4.3.5 and 4.3.7: debugging security issues and mitigating risks and vulnerabilities in ML and AI systems |
| 75 | Bedrock API Keys vs IAM Credentials | TO | `lesson-75-bedrock-api-keys-vs-iam.html` | Skill 4.3.8: selecting the credential type to access FMs |
| 76 | Amazon Bedrock Guardrails and Sensitive Data Protection |  | `lesson-76-bedrock-guardrails.html` | Skill 4.3.9: safeguards for application requirements and responsible AI policies |

Eyebrow label for Unit 4 lessons: "Operating, Monitoring, and Securing ML and AI Solutions".

Total: 76 chapters. Practice exams are planned one per unit plus a full-length mock (65 questions, 130 minutes) once the unit lessons ship; none exist yet, so the course index lists no `test` entries.
