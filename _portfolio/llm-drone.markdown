---
title: Agentic LLM Autonomous Drone
date: 2025-09-01
layout: single
permalink: /projects/llm-drone/
author_profile: true

excerpt: "An AI-powered drone control system that interprets natural language voice commands using an LLM and executes either discrete flight instructions or continuous object tracking."
header:
    teaser: /assets/images/drone-demo.png
---

Python / OpenAI API / Whisper / YOLOv8 / OpenCV / Robotics

## Overview
This project is an **agentic LLM-powered pipeline** for controlling a DJI Tello drone through natural language. It uses voice transcription, LLM-based command parsing, and computer vision to execute either discrete movement commands or a continuous real-time object tracking mode.

The system is completely conversationally controlled — I can issue voice commands like *"take off"*, *"turn around 180°"*, or *"follow the man in the gray shirt"*, and the drone responds in real time. The follow mode uses YOLOv8 and OpenCV to lock onto and maintain visual tracking of the target, even through occlusion.

## Key Features
- **Conversational Voice Control**: Whisper model transcribes spoken commands.
- **Agentic LLM Parsing**: OpenAI agent decides between discrete or continuous action modes.
- **Discrete Commands**: Altitude changes, rotations, and other direct movement instructions.
- **Continuous Tracking Mode**: YOLOv8 + OpenCV vision pipeline for smooth, occlusion-resilient object following.
- **Hardware Agnostic**: Built for Tello but adaptable to other drones.

## Technical Breakdown
The pipeline flows through four main scripts:

1. **`voice_transcriber.py`** — Uses Whisper to convert speech to text.
2. **`openapi.py`** — An OpenAI-powered agent with custom Python function tools to parse intent.
3. **`drone_controller.py`** — Executes discrete flight commands (e.g., move up, rotate).
4. **`skytrack.py`** — Runs YOLOv8 + OpenCV tracking for continuous follow mode.

**Workflow**:  
Voice input → Whisper transcription → LLM parsing → Action routing → Direct control or vision-based tracking.

The vision system provides bounding boxes around the target and calculates movement adjustments in real time, ensuring smooth and stable tracking without overshooting.

## Technical Challenges
1. **Multi-threading** — Managing five simultaneous threads for tasks like sending heartbeat signals to prevent auto-shutdown, maintaining video feed, and issuing continuous movement commands during follow mode.
2. **Smooth Follow** — Tuning acceleration, speed, and update intervals to avoid jerky motion and target overshooting.
3. **Vision Model Choice** — Balancing OpenCV tracker speed with YOLOv8’s robustness for re-acquiring targets after occlusion.
4. **Voice Isolation** — Reducing background noise and false triggers through microphone settings and noise suppression.

## Next Steps
Future iterations will integrate GPS and other onboard sensors for expanded autonomous capabilities and more complex tasks.

## Demo Video
[![Watch the Demo](/assets/images/drone-demo.png)](https://www.youtube.com/watch?v=iRPw58BgnR8)

## Project Link
👉 [View the code on GitHub](https://github.com/elijahtab/SkyPilot)
