"""Example: chapter explainer (landscape) for SAA-C03 Chapter 27, built from the lesson's own cards.

Prepare the art first (from the repo root):
  node .claude/skills/certified-video/scripts/extract.mjs lesson \
    aws-solutions-architect-associate/lesson-27-loose-coupling-services.html --out video-out/saa-ch27/src
Then:
  python3 .claude/skills/certified-video/scripts/build.py .claude/skills/certified-video/examples/saa-ch27-explainer.py --sheet
"""

VIDEO = dict(
    slug="saa-ch27-explainer",
    format="landscape",
    theme="aws-solutions-architect-associate/lesson-27-loose-coupling-services.html",  # palette from the lesson
    assets="video-out/saa-ch27/src/art",
    badge="SAA-C03 · Chapter 27",
    course=dict(name="AWS Solutions Architect Associate (SAA-C03)", url="https://certify.courses/aws-solutions-architect-associate/"),
    voice=dict(speaker=0),
    music_seed=1,
    pronounce={"certify.courses": "certify dot courses"},
    thumbnail=dict(text="SQS vs SNS vs EventBridge vs MQ", sub="Which one does the exam want?", kicker="AWS SAA-C03", art="fanout"),
    youtube=dict(
        title="SQS vs SNS vs EventBridge vs Amazon MQ (AWS SAA-C03)",
        description=("Four AWS services decouple your components, and the Solutions Architect Associate exam asks "
                     "which one a requirement calls for. Queue or topic, content routing or protocol support: "
                     "here is how to tell them apart, with an exam-style question at the end."),
        tags=["AWS SAA-C03", "Solutions Architect Associate", "SQS vs SNS", "EventBridge", "Amazon MQ",
              "AWS certification", "loose coupling", "fan-out"],
    ),
)

SCENES = [
    dict(type="title", chapter="Intro", eyebrow="SAA-C03 · Chapter 27", art="cover",
         title="SQS vs SNS vs EventBridge vs Amazon MQ", subtitle="Which messaging service does the question want?",
         lines=["Four AWS services pass messages between components, so neither side has to wait for the other.",
                "The exam asks which one a requirement calls for."]),

    dict(type="bullets", chapter="Shared ground", heading="What all four give you",
         items=[("The producer never calls the consumer", "It hands a message to a managed service and moves on."),
                ("Managed and durable", "AWS runs the infrastructure and stores messages redundantly."),
                ("Where they differ", "Who gets each message, push or pull, content routing, and protocols.")],
         lines=["All four share one idea.",
                "The producer never calls the consumer. It hands a message to a managed service and moves on.",
                "They are managed and durable, so a lost server does not lose work.",
                "They differ in who gets each message, push or pull, routing by content, and protocol support."]),

    dict(type="bullets", chapter="SQS and SNS", heading="Amazon SQS: a queue, one consumer per message",
         items=[("Pull, buffer, absorb spikes", "Producers send; consumers poll at their own pace."),
                ("One worker per message", "Add workers to drain faster. FIFO queues add order and exactly-once processing."),
                ("The limit", "A queue is point to point.")],
         lines=["Amazon SQS is a queue.",
                "Producers send, and consumers poll at their own pace, so a spike of orders waits safely.",
                "Each message is processed by one worker. FIFO queues add order and exactly-once processing.",
                "The limit: a queue is point to point. One message, one consumer."]),

    dict(type="art", heading="Amazon SNS: publish once, push to every subscriber", art="fanout",
         lines=["Amazon SNS is a topic. A publisher sends one message, and SNS pushes a copy to every subscriber.",
                "Subscribe three SQS queues, and billing, shipping and analytics each get their own durable copy. That is fan-out.",
                "A filter policy on a subscription delivers only the messages that match."]),

    dict(type="art", chapter="EventBridge and Amazon MQ", heading="Amazon EventBridge: route events by their content", art="bus",
         lines=["Amazon EventBridge is an event bus.",
                "On the default bus, AWS services send events on their own, like an EC2 state change, with no code.",
                "Rules match a pattern on any field of the event, so routing is by content, with up to five targets per rule."]),

    dict(type="bullets", heading="Amazon MQ: a managed broker",
         items=[("Managed ActiveMQ or RabbitMQ", "AWS handles setup, patching and maintenance windows."),
                ("Standard protocols", "JMS, AMQP, STOMP, MQTT and WebSocket."),
                ("The migration answer", "For a new cloud-native design, SQS, SNS and EventBridge are serverless.")],
         lines=["Amazon MQ is a managed message broker.",
                "It runs Apache ActiveMQ or RabbitMQ, and AWS handles setup and patching.",
                "Existing apps keep their JMS, AMQP or MQTT code, so they move without a rewrite.",
                "That makes it the migration answer, not the default for new designs."]),

    dict(type="compare", chapter="Compared", heading="The four, compared",
         columns=["Service", "Model", "Who receives", "Best signal"],
         rows=[["SQS", "Queue, pull", "One worker per message", "Buffer work, absorb spikes"],
               ["SNS", "Topic, push", "Every subscriber", "Fan-out, notifications"],
               ["EventBridge", "Bus, rules", "Targets whose pattern matches", "AWS or SaaS events, content routing"],
               ["Amazon MQ", "Broker", "Queues and topics, per protocol", "Existing JMS, AMQP or MQTT apps"]],
         lines=["Side by side.",
                "SQS: a queue you pull, one worker per message.",
                "SNS: a topic that pushes to every subscriber.",
                "EventBridge: a bus whose rules match on content.",
                "Amazon MQ: a broker for apps already on standard protocols."]),

    dict(type="quiz", chapter="Practice question", label="Exam-style question", countdown=5, correct=3,
         question=("When an order is placed, the billing, shipping and analytics services must each process it "
                   "independently, at their own pace, without losing messages if one service is down for an hour. "
                   "What should the order service do?"),
         options=["Call each service's API directly and retry on failure",
                  "Send to one SQS queue that all three services poll",
                  "Write the order to an S3 bucket the services list hourly",
                  "Publish to an SNS topic with one SQS queue per service subscribed"],
         explain=("SNS fan-out gives every service its own copy, and each queue holds it until that service is back. "
                  "One shared queue would split the orders between the three services.")),

    dict(type="cta", title="Study the full course", sub="AWS Solutions Architect Associate (SAA-C03). The first unit is free.",
         lines=[dict(text="The full course is at certify.courses, and the first unit is free.")]),
]
