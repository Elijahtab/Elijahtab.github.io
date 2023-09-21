---
layout: post
title: "Revolutionizing NPC Interactions: The AI Frontier in Gaming"
date: 2023-09-19 16:00:00 -0000
categories: AI
---
Have you ever wanted to have a real conversation with a non-playable character, to truly feel a part of the world you experience through your computer screen. That isn’t far away, with the renaissance of AI we are currently living in, it’s only a matter of time before the likes of Rockstar and Ubisoft implement modern Language Model Models(LLMs) into their NPC structures. Instead of small prebuilt interactions with random passersby in Red Dead Redemption or Grand Theft Auto, the player could have hundreds or thousands of unique individualized interactions in a game world. Instead of being limited to the couple dozen base one liners the designers thought up, prompts describing the basics of an individual will be used to create limitless distinct conversations that will never happen again. Imagine riding around, finding a woman: Sophia, and exploring her lens on the game world you are inhabiting, her struggles with the industrialization and the cowboys turned bandits that you represent. That conversation can be as real as anything but a true human interaction. This would of course tamper with the pre-existing modes of storytelling in the video game industry, which revolves largely around pre-scripted events and dialogue. The designer who manages to create true interesting storylines based around AI would truly be groundbreaking.

But forget about storytelling, what about giving AI agency. Meta has already shown that AI can have the [Meta][faculty] to combine communication with strategic planning. Diplomacy, a strategically simplistic game, becomes highly complex when human interaction is added. Players can talk to, banter, work together and betray each other. Meta has managed to combine objective strategic planning and subjective interaction, in an AI that outperforms the vast majority of human players.

This is fascinating for many reasons, but to a strategy nerd, Meta’s AI opens a world of possibilities. What happens when beloved Strategy games can be played single player with truly self-determined opponents that communicate and make decisions based on your input? A game where your advisors can dissect your strategy and that of your opponent and give you advice based on in-game happenings. But even more interesting is that these intelligences can be added in historical context. Many strategy games attempt to immerse the player in a historical period. The player could have AI imitating historical figures interacting with, advising and opposing the player. You could be interacting with Suleiman the Magnificent outside the gates of Vienna, or with Napoleon as he marches into Moscow. That's where my interest lies, can we make characters that attempt the emulation of historical figures. Some strategy games could implement this with a mod, Civilization V’s advisors, for example, could easily be turned into historical figures. Napoleon as a military advisor, Keynes as an economic advisor, Oppenheimer helping gleam which research is most important and Bismarck counseling your foreign diplomacy.

<img src="/assets/civ1.png" height="384" width="512"> 

I wanted to explore this realm of Artificial Intelligence myself, with the eventual goal being fully integrating an LLM into a game. The first part of this process was to create an account with OpenAI and set up per-token billing.

<img src="/assets/openAI1.png" height="134" width="512"> 

 You’re provided with an API key which gives you access to the API itself and is billed based on usage. This is actually an issue for creating marketable games with the API as your key both needs to be hidden, so as not to be the victim of theft, but also accessible for each user. However, I didn’t have to worry about that for this test run so I just used an environmental variable stored on my personal computer

 {% highlight ruby %}

api = new OpenAIAPI(Environment.GetEnvironmentVariable("OPENAI_API_KEY", EnvironmentVariableTarget.User));

{% endhighlight %}

 Then I had to find an API wrapper that would do the heavy lifting of actually connecting OpenAI’s API to Unity in a usable way, I used OkGoDoIt’s repository to get a start.  I Imported the API and figured out how to actually communicate with OpenAI, a relatively easy process that at its base level requires you to submit a message and receive one back.


{% highlight ruby %}

messages = new List<ChatMessage> {
            new ChatMessage(ChatMessageRole.System, "")

{% endhighlight %}
The Input
{% highlight ruby %}

var chatResult = await api.Chat.CreateChatCompletionAsync(new ChatRequest()
        {
            Model = Model.ChatGPTTurbo,
            Temperature = .5,
            MaxTokens = 300,
            Messages = messages
        });


        ChatMessage responseMessage = new ChatMessage();


{% endhighlight %}
The Output

You can find the full code in my Github [Github][Repository]. After finishing up the technical aspects I went about my task: emulating Julius Caesar in conversation. I did this by adding in context to tha AI, or the basis for which the AI should construct its responses. My first attempt to achieve this was to add excerpts from Julius Caesar’s writings, however I quickly discovered an issue; OpenAI has a context limit of 4096 bytes, or about a paragraph of text, a far cry from my goal of 200 pages of Caesar's writings in De Bello Gallico and De Bello Civili. While in the future AI will certainly have the ability to process larger amounts of data, for now we are stuck with short and sweet. I did try doing some research and while I found some promising [Ideas][ideas] nothing really worked for my goals. However, as an LLM ChatGPT has access to Julius Caesar's writings, and even though it wouldn't be as precise as creating a personality around them, I could just create context that called upon the models inherent knowledge. My first attempt was promising however, 'Julius Caesar' kept rambling to such a degree that the token limit was reached and the so the bot stopped mid-sentence.

<img src="/assets/Notlong.png" height="512" width="1093"> 

After tweaking the prompt:

{% highlight ruby %}

 new ChatMessage(ChatMessageRole.System, "You are Julius Caesar, you will attempt to emulate him as best as possible using his writings in De Bello and De bello civili. You will never break character and always pretend you are Julius Caesar. Reply with relatively short but informative answers up to 6 sentences long.")

{% endhighlight %}

It ended up working fairly well, as you can see in the following images.
<img src="/assets/Caesar1.png" height="512" width="1093"> 
<img src="/assets/Ariovistus.png" height="512" width="1093"> 

The intersection of artificial intelligence and gaming holds the promise of revolutionizing our gaming experiences in profound ways. The potential to engage in real, meaningful conversations with non-playable characters, thanks to modern LLMs, opens up new avenues for immersive storytelling and player interaction. The ability to create personalized interactions within game worlds, shaped by the unique characteristics of each AI-driven NPC, could redefine how we experience gaming narratives. 

Beyond NPCs, LLMs can be used to power AI opponents in various game genres, including strategy games. These AI opponents can adapt to the player's strategies, making the single-player experience more challenging and satisfying. As players hone their skills, AI opponents can also evolve, ensuring that the gaming experience remains engaging and competitive. The recent developments in AI, exemplified by Meta's AI in diplomacy games, highlight the exciting possibilities of giving AI agency and strategic prowess. Gamers can look forward to challenging single-player experiences where AI opponents communicate, adapt, and strategize based on player input, enhancing the depth of gameplay. The integration of historical figures as AI advisors in strategy games offers a fascinating opportunity to immerse players in historical contexts, allowing them to interact with and learn from iconic figures of the past. 

Furthermore, LLMs can assist in generating vast amounts of in-game content, from dialogues and quest narratives to item descriptions and world lore. This not only reduces the workload on game developers but also ensures that games are rich in content, offering players hours of exploration and discovery.I personally look forward to exploring this topic further and integrating Artificial Intelligence more fully into my Games.

[Ideas]: https://fortelabs.com/blog/how-to-summarize-books-using-chatgpt/
[Meta]: https://www.science.org/content/article/ai-learns-art-diplomacy-game
[Github]:https://github.com/Elijahtab/OpenAI-API-With-Caesar