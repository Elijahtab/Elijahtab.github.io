---
layout: post
title: "AI-Powered NPCs: Shaping the Future of Gaming"
date: 2023-09-27 8:00:00 -0000
categories: AI, NPC, Games, Game Design
---


The world of gaming has always been a breeding ground for innovation, and one of the most exciting frontiers in game development is the integration of artificial intelligence (AI) to create more immersive and dynamic experiences. In this blog, I'll take you on a journey through the creation of a platformer game set in space, where the non-player characters (NPCs) are powered by OpenAI. This project not only serves as a captivating demo but also provides valuable insights into harnessing AI in gaming. So, let's embark on this cosmic adventure!

Before we get started, the game I have been working on and is the subject of this article can be found [here][here].As I posited in my previous [article][article] on the topic, artificial intelligence has the potential to burst into every facet of Video Game design, NPC interactions, logic engines, storytelling etc. For this article my goal was to showcase my further explorations with this concept. This article will serve as both a showcase of the possibilities, my work and as a rough guide for getting a jumpstart in the subject. The first step for this process was setting up a unity game that had the potential to be brought to life with AI: 


Setting Up Unity:
Begin by creating a new Unity project and setting up the necessary assets like character models, level designs, and textures. You can use ChatGPT to help with the basics, of coding and putting together the games assets. I already had the base husk of a game I had been working on at the ready, a platformer that utilized the parallax effect to create the illusion of a never star-filled space. "Starlight Parallax" used another mechanic, a dual world setup where-in there were to sets of platforms that the player could only access one at a time. Using this base I decided to add in the AI part.


Create a way to Acess LLMs through Unity:
I used [GoDoIt's][GoDoIt's] wrapper and the instructions present in his repository to help me get started.

Creating NPCs:
Design and model the NPCs, making them visually distinct and suited to their respective roles in the game--I used free assets available on the Unity store as this was more of a demo than a fully fledged game.
<img src="/assets/platformer2.png" height="150" width="109"> 

Then create animations for idle. This is something that youtube can help you with, Brackey's [video][video] on the subject is a good starting point. After that you are ready to create the actual process for sending and receiving messages with OpenAI. I personally used an inputfield for sending messages to OpenAI, a textbox with a background for recieving, as well as a button to catalyze the process.

<img src="/assets/platformer1.png" height="411" width="472"> 


Dialogue System:

Develop a dialogue system that allows the NPCs to respond to player input using natural language. Utilize OpenAI's language generation capabilities to make the interactions feel more dynamic and engaging. 

Behavior Patterns:
Define the NPCs' behavior patterns. For example, some might provide crucial information about the level, while others could offer side quests or challenges. Implement decision-making logic using AI to determine NPC responses. As an example, the first character the player meets is Ralph, who's basic purpose is to let the player know that in order to access the mechanic that switches world's they have to press space. In order to achieve this I had to play with various prompts finally settling on {% highlight ruby %} prompt = "You are Ralph talking to the main character. Your goal is to help him understand in a subtle way that the world switches between two modes that help him do the parkour necessary to complete the levels. The player has to press space to engage this mode. Keep your responses relatively short while conveying the necessary information.";{% endhighlight %}. 

This prompt led to successful interactions that let the player know what they should do next:
<img src="/assets/platformer3.png" height="520" width="769"> 


And another one, just to prove I don't have a secret script feeding responses:

<img src="/assets/platformer4.png" height="512" width="724"> 

After tweaking Ralph's prompt and AI settings, I decided to add another character that could provide a more interesting lens into the world the player inhabits. I decided to focus on a more melancholic disposition. Sally's prompt {% highlight ruby %} prompt = "You are Ralph talking to the main character. Your goal is to help him understand in a subtle way that the world switches between two modes that help him do the parkour necessary to complete the levels. The player has to press space to engage this mode. Keep your responses relatively short while conveying the necessary information.";{% endhighlight %} led to more fun responses...

<img src="/assets/platformer5.png" height="498" width="538"> 

<img src="/assets/platformer6.png" height="515" width="639"> 

Finally, if you want to make this game work on your machine, you will need to add your own OpenAI key. This can be achieved by typing in, "Edit Environmental Variables" in your windows search bar and then, after reaching the variable menu, clicking new, the title should be "OPENAI_API_KEY" and the value your API key. I discuss this in greater detail in my previous [article][article].

In this exploration of AI-powered NPCs in our space platformer, we've ventured into the exciting frontier where gaming and artificial intelligence converge. This project has illuminated the immense potential for AI to transform the gaming landscape.As we've witnessed, AI can bring NPCs to life in ways previously unimaginable. These characters aren't just static entities; they're storytellers, guides, and companions. They adapt, learn, and engage players in dynamic conversations, blurring the line between scripted content and player agency.What's truly fascinating is the glimpse this project offers into the future of gaming. As AI technology continues to advance, we can expect even more sophisticated and realistic NPC interactions. Games will become living, breathing worlds where AI-driven characters play pivotal roles in shaping narratives and adapting to player choices.

Imagine a gaming experience where every playthrough is unique, where NPCs remember your decisions, and where the story unfolds in response to your actions. This is the promise of AI in gaming—a future where immersion, storytelling, and player engagement reach unprecedented heights.In conclusion, our space platformer serves as a testament to the transformative power of AI in gaming. It's a journey that hints at the limitless possibilities awaiting both developers and players. As we look ahead, the fusion of AI and gaming promises to redefine how we experience and interact with virtual worlds, and we can't wait to see where this cosmic adventure takes us next. The future of gaming is poised to be nothing short of extraordinary.

[article]: https://elijahtab.github.io/ai,/npc,/games,/game/design/2023/09/19/Revolutionizing-NPC's-AI.html
[video]: https://www.youtube.com/watch?v=hkaysu1Z-N8
[GoDoIt's]: https://github.com/OkGoDoIt/OpenAI-API-dotnet
[here]: https://github.com/Elijahtab/Parallaxer
