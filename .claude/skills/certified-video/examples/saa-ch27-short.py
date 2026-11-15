"""Example: exam-question Short (9:16) for SAA-C03 Chapter 27.

The question is new, written from the chapter in the course's exam style, so no
practice-exam question leaks onto YouTube. Uses only the lesson palette (no art needed).
  python3 .claude/skills/certified-video/scripts/build.py .claude/skills/certified-video/examples/saa-ch27-short.py
"""

VIDEO = dict(
    slug="saa-ch27-short-eventbridge",
    format="short",
    theme="aws-solutions-architect-associate/lesson-27-loose-coupling-services.html",
    badge="SAA-C03 · 5-second challenge",
    course=dict(name="AWS Solutions Architect Associate (SAA-C03)", url="https://certify.courses/aws-solutions-architect-associate/"),
    voice=dict(speaker=0),
    music_seed=2,
    pronounce={"certify.courses": "certify dot courses"},
    youtube=dict(
        title="Can you answer this AWS SAA-C03 question in 5 seconds?",
        description="React to EC2 state changes with no code on the instances: which AWS service does it?",
        tags=["AWS SAA-C03", "EventBridge", "AWS certification", "Solutions Architect", "exam question"],
    ),
)

SCENES = [
    dict(type="quiz", label="SAA-C03 exam question", countdown=5, correct=2,
         question=("A Lambda function must run whenever any EC2 instance in the account stops. "
                   "The team wants no code on the instances and no polling. What should they use?"),
         options=["Have each instance publish to an SNS topic when it shuts down",
                  "A Lambda function that polls the EC2 API every minute",
                  "An EventBridge rule on the default bus matching EC2 state-change events",
                  "An Amazon MQ broker that receives EC2 events"],
         explain=("EC2 sends state changes to the default event bus on its own. "
                  "A rule matching the pattern triggers Lambda: no instance code, no polling.")),
    dict(type="cta", title="Chapter 27 covers all four messaging services", sub="Start the SAA-C03 course free",
         lines=[dict(text="Start the course free at certify.courses.")]),
]
