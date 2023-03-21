---
layout: post
title:  "AI as the Future of Game Design"
date:   2023-03-07 17:44:32 -0800
categories: First Game
---
It's a quiet saturday and I'm studying for an upcoming test. As I survey the study lounge that is my home until the clock strikes eleven, I note the usual types -- anxious procrastinators making up for lost time, socializers pretending to study and every other combination that can be found at such a place -- but something feels off, a foreboding feeling saturates the room. My worries are actualized with a slight ping-- a text from my girlfriend professing her excitement at the gift she's gotten me for Valentines day. Horror engulfs me. How could I have forgotten, Valentine's is only four days away and I have no gift at the ready. 

While I know this sounds like the start to a poorly made sitcom filled with wacky antics, misplaced girlfriends and overdone tropes, it was actually the beginning of an interesting, and in my opinion astounding, journey. As I was mulling over the various cliche gifts I would have enough time to procure before that tuesday, a small, yet bright, lightbulb went off in my head. What of I made her a game? This is something I had wanted to do for a while, both to profess my love and to further my skills as a Game Designer. But I had been putting it off for a while. So I started. However, as anyone with a mild inclination towards making games knows it is can be a painstaking and long process, especially if you are inexperienced and need to constantly utilize Stack Exchange and whatever else google can provide you. This however was a high-stakes mission and I had limited time at my disposal. So I turned to ChatGPT which I had used successfully for advice in everything from coding, to debugging, to making gameobjects. This was the truely start of my foray into the world of Artificial Intelligence aided Game Design.

I had decided to make an infinite 'flyer.' First and foremost I had to make my protaganist move. Of course ChatGPT was my very first source.

Now, I didn't just use AI to help code my game, no I went further than that. The main antagonist, of course coded with the help of ChatGPT, was a brand new image sourced from [Scenario.gg][Scenario.gg]. Scenario is a stable diffusion model that allows the user to create a generator, which is filled with similar images chosen by the user that are synthesized into a personal image creator which accepts prompts and images. I used the little robots generator: 

<img src="/assets/robotgen.png" height="226" width="219"> 

The prompt I used was `Little Robots, Evil robot, Flying, wings`, which generated the little guy that serves as the enemy. 

<img src="/assets/enemy.png" height="225" width="225"> 

After playing around with transparency and alpha channels in gimp, my antagonist was born.

With some limited coding experience and an OpenAI account almost anyone could replicate my creation.

Jekyll also offers powerful support for code snippets:

{% highlight ruby %}
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT. 
{% endhighlight %}


You can find Cupids Rocket on my github, or right [here][Cupid-Repo].


This was the response given by ChatGPT when asked, `How would I limit the player to the boundaries of the screen?` 
<img src="/assets/bounds1.png">
Go try this out yourself, you won't get the same answer as me, but I garantuee it will be one that can be implemented in a Unity game.




[Cupid-Repo]: https://github.com/Elijahtab/Cupids-Rocket
[Scenario.gg]: https://www.scenario.com/


