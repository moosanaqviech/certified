# Curriculum index: AWS Certified Machine Learning Engineer Associate (MLA-C01)

Status: DRAFT (not yet locked). Confirm placement before authoring lessons.
Source: Mirrors the MLA-C01 exam guide as published at docs.aws.amazon.com (in use until September 28, 2026).
Exam guide: https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-01/machine-learning-engineer-associate-01.html

Course folder: `aws-machine-learning-engineer-associate-mla-c01/`. Lessons: `lesson-NN-name.html`. Exams: `mla-c01-practice-exam-NN.html`.

Exam facts (from the guide): 65 questions (50 scored, 15 unscored), 130 minutes, scaled score 100 to 1,000, pass at 720, compensatory scoring. Pace: 2 minutes per question.
Question types: multiple choice, multiple response, ordering, matching. MLA-C01 is offered in English until September 28, 2026; MLA-C02 replaces it from September 29, 2026.

Structure note: when this index is next revised, group each unit's chapters into modules that mirror the MLA-C01 guide's task statements, the way curriculum-index-aws-mla-c02.md does (Unit > Module N.M > Chapter), and nest `modules:[...]` in the course index.html the same way.

Chapters marked (removed in MLA-C02) are still in scope for MLA-C01 but have no counterpart in the MLA-C02 index; do not port them across.

Terminology: say "Amazon SageMaker AI" (the platform) and "Amazon Bedrock". Say "Amazon Data Firehose" and "Amazon Managed Service for Apache Flink", never the old Kinesis names (see the DEA-C01 rule in CLAUDE.md). IAM, CLI, and SDK identifiers keep the pre-rename names.

Units mirror the four content domains. Chapter numbering is continuous across the course. TO marks a trade-off chapter (fixed trade-off lesson pattern).

## Unit 1: Data Preparation for Machine Learning (28% of scored content)

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 01 | Choosing ML Data Formats: Parquet, ORC, Avro, JSON, CSV, and RecordIO | TO | `lesson-01-ml-data-formats.html` | Task 1.1: validated vs non-validated formats and picking a format from the access pattern |
| 02 | Storage for ML Data: S3 vs EFS vs FSx for NetApp ONTAP | TO | `lesson-02-storage-s3-efs-fsx.html` | Task 1.1: core AWS data sources, storage trade-offs, and initial storage decisions by cost, performance, and structure |
| 03 | Streaming Ingestion for ML: Kinesis, Managed Service for Apache Flink, and MSK |  | `lesson-03-streaming-ingestion.html` | Tasks 1.1 and 1.2: streaming sources plus transforming streaming data with Lambda and Spark |
| 04 | Extracting and Merging Data with AWS Glue and Spark |  | `lesson-04-extracting-merging-glue-spark.html` | Task 1.1: pulling from S3, EBS, EFS, RDS, and DynamoDB, merging sources, and debugging capacity and scalability issues |
| 05 | Cleaning Data: Outliers, Missing Values, and Deduplication |  | `lesson-05-cleaning-data.html` | Task 1.2: detecting and treating outliers, imputation, combining, deduplication |
| 06 | Feature Engineering: Scaling, Binning, and Log Transforms |  | `lesson-06-feature-engineering.html` | Task 1.2: standardization, normalization, feature splitting, binning, log transformation |
| 07 | Encoding Features: One-Hot, Binary, Label, and Tokenization |  | `lesson-07-encoding-features.html` | Task 1.2: encoding techniques for categorical and text inputs |
| 08 | Transformation Tools: Data Wrangler vs Glue DataBrew vs Spark on EMR | TO | `lesson-08-transformation-tools.html` | Task 1.2: which tool to explore, visualize, or transform data with, and when Glue or EMR takes over |
| 09 | SageMaker Feature Store: Online and Offline Stores |  | `lesson-09-sagemaker-feature-store.html` | Tasks 1.1 and 1.2: ingesting into Feature Store and creating and managing features |
| 10 | Labeling Data with SageMaker Ground Truth and Mechanical Turk |  | `lesson-10-labeling-ground-truth.html` | Task 1.2: annotation and labeling services that create high-quality labeled datasets |
| 11 | Pre-Training Bias and Class Imbalance with SageMaker Clarify |  | `lesson-11-pre-training-bias-clarify.html` | Task 1.3: CI and DPL metrics, selection and measurement bias, resampling and synthetic data |
| 12 | Data Quality Checks with AWS Glue Data Quality and DataBrew |  | `lesson-12-data-quality-checks.html` | Task 1.3: validating data quality before training |
| 13 | Splitting, Shuffling, and Augmenting Training Data |  | `lesson-13-splitting-shuffling-augmentation.html` | Task 1.3: preparing data to reduce prediction bias |
| 14 | Protecting Sensitive Data: Encryption, Masking, PII, and PHI |  | `lesson-14-protecting-sensitive-data.html` | Task 1.3: encryption techniques, classification, anonymization, masking, data residency |
| 15 | Loading Training Data: S3 Input Modes vs EFS vs FSx for Lustre | TO | `lesson-15-loading-training-data.html` | Task 1.3: configuring data to load into the training resource (removed in MLA-C02) |

Eyebrow label for Unit 1 lessons: "Data Preparation for Machine Learning".

## Unit 2: ML Model Development (26% of scored content)

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 16 | Choosing an ML Approach: Feasibility, Algorithm Family, and Interpretability | TO | `lesson-16-choosing-ml-approach.html` | Task 2.1: assessing feasibility, comparing algorithms, and weighing interpretability during selection |
| 17 | SageMaker AI Built-In Algorithms and When to Apply Them |  | `lesson-17-sagemaker-built-in-algorithms.html` | Task 2.1: the built-in algorithm catalog and matching problems to it |
| 18 | Built-In Algorithms vs JumpStart vs Bedrock vs Custom Script Mode | TO | `lesson-18-built-in-vs-jumpstart-vs-bedrock-vs-custom.html` | Tasks 2.1 and 2.2: choosing built-ins, foundation models, and solution templates; script mode; integrating outside models; selecting on cost |
| 19 | AWS AI Services for Business Problems: Rekognition, Transcribe, Translate, and Comprehend |  | `lesson-19-aws-ai-services.html` | Task 2.1: solving common business needs without training a model |
| 20 | Training Mechanics: Epochs, Batch Size, Early Stopping, and Distributed Training |  | `lesson-20-training-mechanics.html` | Task 2.2: elements of the training process and methods to reduce training time |
| 21 | Hyperparameter Tuning with SageMaker AI Automatic Model Tuning |  | `lesson-21-hyperparameter-tuning-amt.html` | Task 2.2: random search vs Bayesian optimization, hyperparameter effects, integrating automated HPO |
| 22 | Overfitting, Underfitting, and Regularization |  | `lesson-22-overfitting-underfitting-regularization.html` | Tasks 2.2 and 2.3: dropout, weight decay, L1 and L2, feature selection, catastrophic forgetting, spotting each from curves |
| 23 | Fine-Tuning Pre-Trained Models with JumpStart and Bedrock |  | `lesson-23-fine-tuning-pretrained-models.html` | Task 2.2: using custom datasets to fine-tune pre-trained models |
| 24 | Ensembles: Bagging, Boosting, and Stacking |  | `lesson-24-ensembles.html` | Task 2.2: combining multiple models to improve performance |
| 25 | Reducing Model Size: Data Types, Pruning, and Compression |  | `lesson-25-reducing-model-size.html` | Task 2.2: factors that influence model size and how to shrink it (removed in MLA-C02) |
| 26 | SageMaker Model Registry: Versions, Approval, and Audit Trails |  | `lesson-26-sagemaker-model-registry.html` | Task 2.2: managing model versions for repeatability and audits |
| 27 | Classification Metrics: Confusion Matrix, Precision, Recall, F1, and ROC AUC |  | `lesson-27-classification-metrics.html` | Task 2.3: selecting and interpreting classification metrics |
| 28 | Regression Metrics, Baselines, and Reproducible Experiments |  | `lesson-28-regression-metrics-baselines-experiments.html` | Task 2.3: RMSE and friends, creating performance baselines, reproducible experiments on AWS, performance vs training time vs cost |
| 29 | Debugging Convergence with SageMaker Model Debugger |  | `lesson-29-debugging-convergence.html` | Task 2.3: convergence issues and Debugger rules |
| 30 | SageMaker Clarify: Explainability and Post-Training Bias |  | `lesson-30-clarify-explainability.html` | Task 2.3: Clarify metrics on training data and models, interpreting outputs |
| 31 | Shadow Variants vs Production Variants | TO | `lesson-31-shadow-vs-production-variants.html` | Task 2.3: comparing a shadow variant against production before promoting it |

Eyebrow label for Unit 2 lessons: "ML Model Development".

## Unit 3: Deployment and Orchestration of ML Workflows (22% of scored content)

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 32 | Inference Options: Real-Time, Batch, Asynchronous, and Serverless | TO | `lesson-32-inference-options.html` | Task 3.1: endpoint types and batch inference, choosing by latency, payload, and traffic shape |
| 33 | Choosing Compute: CPU vs GPU, Instance Families, and Networking | TO | `lesson-33-choosing-compute.html` | Task 3.1: provisioning compute for training and inference in production and test environments |
| 34 | Deployment Targets: SageMaker AI Endpoints vs ECS, EKS, and Lambda | TO | `lesson-34-deployment-targets.html` | Task 3.1: picking the deployment target for an existing architecture |
| 35 | Multi-Model and Multi-Container Endpoints |  | `lesson-35-multi-model-multi-container.html` | Task 3.1: when many models share one endpoint |
| 36 | Containers: Provided Images vs Bring Your Own Container |  | `lesson-36-containers-byoc.html` | Tasks 3.1 and 3.2: choosing containers and building and maintaining them with ECR, ECS, and EKS (BYOC removed in MLA-C02) |
| 37 | Edge Optimization with SageMaker Neo |  | `lesson-37-edge-optimization-neo.html` | Task 3.1: compiling models for edge devices (removed in MLA-C02) |
| 38 | Deployment Strategies: Blue/Green, Canary, Linear, and Rollback |  | `lesson-38-deployment-strategies.html` | Tasks 3.1 and 3.3: versioning, rollback, and traffic-shifting strategies |
| 39 | Endpoint Auto Scaling: Policies, Metrics, and Provisioned vs On-Demand |  | `lesson-39-endpoint-auto-scaling.html` | Task 3.2: scaling policies, choosing scaling metrics, Spot, Lambda behind endpoints |
| 40 | Infrastructure as Code: CloudFormation vs AWS CDK | TO | `lesson-40-iac-cloudformation-vs-cdk.html` | Task 3.2: IaC trade-offs and automating provisioning with communication between stacks |
| 41 | Deploying with the SageMaker AI SDK inside a VPC |  | `lesson-41-deploying-sdk-vpc.html` | Task 3.2: hosting models from the SDK and configuring endpoints within the VPC network |
| 42 | Orchestrators: SageMaker Pipelines vs Apache Airflow | TO | `lesson-42-orchestrators-pipelines-vs-airflow.html` | Tasks 3.1 and 3.3: selecting the deployment orchestrator and automating model building |
| 43 | CI/CD for ML with CodePipeline, CodeBuild, and CodeDeploy |  | `lesson-43-cicd-codepipeline.html` | Task 3.3: capabilities and quotas, stages, Git, Gitflow vs GitHub Flow |
| 44 | Automated Tests and Event-Driven Retraining with EventBridge |  | `lesson-44-automated-tests-retraining.html` | Task 3.3: unit, integration, and end-to-end tests in pipelines; configuring jobs with EventBridge rules; retraining mechanisms |

Eyebrow label for Unit 3 lessons: "Deployment and Orchestration of ML Workflows".

## Unit 4: ML Solution Monitoring, Maintenance, and Security (24% of scored content)

| Ch | Title | TO | Planned file | Scope |
| --- | --- | --- | --- | --- |
| 45 | Model Drift: Data Drift, Concept Drift, and Why Models Decay |  | `lesson-45-model-drift.html` | Task 4.1: drift in ML models and the ML Lens monitoring principles |
| 46 | SageMaker Model Monitor: Data Quality and Model Quality Schedules |  | `lesson-46-sagemaker-model-monitor.html` | Task 4.1: monitoring models in production and catching anomalies in processing and inference |
| 47 | Bias Drift and Feature Attribution Drift with SageMaker Clarify |  | `lesson-47-bias-drift-clarify.html` | Task 4.1: detecting distribution changes that affect model performance |
| 48 | A/B Testing in Production with Production Variants |  | `lesson-48-ab-testing-production-variants.html` | Task 4.1: monitoring model performance in production by using A/B testing |
| 49 | Observability for ML Systems: CloudWatch Logs Insights, Lambda Insights, and X-Ray |  | `lesson-49-observability-cloudwatch-xray.html` | Task 4.2: troubleshooting latency and performance with observability tools |
| 50 | CloudWatch Alarms, Dashboards, and EventBridge Events |  | `lesson-50-cloudwatch-alarms-dashboards.html` | Task 4.2: alarms, dashboards (CloudWatch, Quick Sight), and infrastructure monitoring with EventBridge |
| 51 | CloudTrail for ML: Auditing and Triggering Retraining |  | `lesson-51-cloudtrail-for-ml.html` | Task 4.2: creating trails and using CloudTrail to log, monitor, and invoke retraining |
| 52 | Rightsizing: Instance Families, Inference Recommender, and Compute Optimizer | TO | `lesson-52-rightsizing.html` | Task 4.2: memory, compute, general purpose, and inference optimized families and the tools that pick one |
| 53 | Troubleshooting Capacity: Quotas, Provisioned Concurrency, and Scaling Issues |  | `lesson-53-troubleshooting-capacity.html` | Task 4.2: resolving latency, scaling, and capacity concerns (removed in MLA-C02) |
| 54 | Purchasing Options: Spot, On-Demand, Reserved, and SageMaker AI Savings Plans | TO | `lesson-54-purchasing-options.html` | Task 4.2: optimizing infrastructure cost by purchasing option |
| 55 | Cost Control: Cost Explorer, Budgets, Trusted Advisor, and Tagging |  | `lesson-55-cost-control.html` | Task 4.2: cost analysis tools, cost quotas, and tagging strategies for allocation |
| 56 | IAM for ML: Least Privilege, Roles, and SageMaker Role Manager |  | `lesson-56-iam-for-ml.html` | Task 4.3: roles, policies, groups, bucket policies, least privilege on ML artifacts |
| 57 | SageMaker AI Security and Compliance: Encryption and KMS |  | `lesson-57-sagemaker-security-compliance.html` | Task 4.3: SageMaker AI security and compliance features, encryption at rest and in transit |
| 58 | Network Isolation: VPCs, Subnets, Security Groups, and VPC Endpoints |  | `lesson-58-network-isolation.html` | Task 4.3: controls for network access and building isolated ML environments |
| 59 | Securing CI/CD Pipelines and Auditing ML Systems |  | `lesson-59-securing-cicd-auditing.html` | Task 4.3: pipeline security best practices, monitoring and logging for compliance, debugging security issues |

Eyebrow label for Unit 4 lessons: "ML Solution Monitoring, Maintenance, and Security".

Total: 59 chapters. Practice exams are planned one per unit plus a full-length mock (65 questions, 130 minutes) once the unit lessons ship; none exist yet, so the course index lists no `test` entries.
