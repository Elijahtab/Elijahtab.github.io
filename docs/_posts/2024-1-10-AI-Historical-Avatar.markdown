---
layout: post
title: "Reviving History: The Integration of AI in Recreating Iconic Personalities"
date: 2024-01-20 8:00:00 -0000
categories: AI, NPC, Games, Game Design 
---
Reviving History: The Integration of AI in Recreating Iconic Personalities

The world is surely going to be changed by Artificial Intelligence, that’s clear to anyone in or outside of the computer related fields. As with any technology it’s going to get better and better but even what we have is quite amazing. I think at this stage like the .com era there’s going to be a rush to combine various AI-fueled technologies in order to create new products and synthesize what's quickly advancing in LLM’s, and really anything related to AI. And that's something that I have long been wanting to get into. Specifically the fusion of various forms of Artificial Intelligences and tools surrounding them to create something related to history, my favorite non-tech academic field. I was given the opportunity to work with some of my peers this quarter on just such a project. Our goal was to produce a very rough draft of what a talking, emoting, intelligent character could look like through a historic lens. We chose to focus on JFK due to the reservoir of audio and video images of him as well as his unique style of dictation; additionally, this wealth of digital information is coupled with the fact that he is very much a historic character in our shared imagination, at least in the United States, which makes him a good starting point. You can check out our demo [here][here], note that there is no speech recognition in this demonstration there are preloaded questions. You can also find our pitch [right here][right here].

Now to get into the more technical aspects, around how I actually made the demo and the way that it is surrounded by AI:

 1. OpenAI Integration for Personality Emulation: 

The centerpiece of the project was the integration of an OpenAI assistant, tailored to reflect JFK's intellectual and speech patterns. To achieve this, we immersed the AI in a wealth of JFK’s writings, speeches, and public records. The AI, trained on this extensive dataset, was able to generate responses that were in JFK's style of speech but also in our opinion represented roughly his ideological and political views, obviously with heavy caveats.

 2. Speech Synthesis and Visual Representation: 

ElevenLabs’ speech synthesis technology played a pivotal role in this project. It analyzed JFK’s speech patterns to create a realistic vocal model. This model could articulate any given text in JFK’s distinctive voice, adding a layer of authenticity to the AI. Complementing the voice, I created a digital video portrait of JFK. This was meant to provide a responsive face that could articulate and express in sync with the AI’s responses, creating a relatively lifelike avatar of JFK.

 3. Speech Recognition and AI Interaction:

While this step remains theoretical it is a necessary precondition to creating a real interactable historical avatar and any future project would entail the creation of such a system.

Challenges and Innovations:

 One of the significant challenges was ensuring the AI’s responses remained true to JFK’s character and historical context. At this point in AI development I think getting to a perfect or even near perfect level is hard, especially because there's a lot of information about any historical figure that we simply don’t know. Then there's the fact that even OpenAI isn’t perfect itself, there's hallucinations and just blatantly false information, but you can get a solid amount of accuracy and believability. I implemented this through the use of texts, so autobiographies, historical documents, magazines and books about the period of JFK’s presidency and the man himself. I put these into the OpenAI assistants API and had the model adhere as strictly as possible to these documents when generating responses. 

Another challenge was Integrating different AI technologies to work harmoniously. The project demands a seamless fusion of speech recognition, AI processing, voice synthesis, and video animation. I started the process but it would definitely take much more work to get a workable prototype.

 Impact on Education and Historical Engagement: 

AI opens new avenues in educational methodologies and historical engagement. It presents an innovative way to interact with history, transforming the learning experience from passive absorption to active engagement. That’s really what this project was about. Trying to get Students and history enthusiasts to be able to have a simulated conversation with JFK, a conversation that could help engagement and feeling like this is something that really happened. This is of course why I’m so interested in this project. I think that history can be very academic and cold, which is good in some ways but in others it's limiting. History is our collective past and it defines the way we live our lives and it’s super relevant and anything that can make it more accessible and real is beautiful I think. While I’m sure I haven’t achieved that here it’s a start and I hope that I can explore this further in the future.


[here]: https://drive.google.com/file/d/1zJehpogrUMb-EsLDKMKmc5iFWNlGiftH/view?usp=sharing 
[right here]: https://drive.google.com/file/d/1t2uB2HAs40cONk249_zMvTMVLZGMU1tx/view?usp=sharing
