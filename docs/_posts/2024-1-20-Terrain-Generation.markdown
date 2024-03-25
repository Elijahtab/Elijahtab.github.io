---
layout: post
title: "Procedural Terrain and Foliage Generation in Unity"
date: 2024-01-20 8:00:00 -0000
categories: AI, NPC, Games, Game Design 
---
Lately I’ve been exploring the use of terrain generation for strategy game implementations. Specifically I’ve worked off of tutorials online about terrain generation to create a procedural terrain+foliage generator using perlin noise. You can find the project [here][here]. The basic setup is to create a noise map using perlin noise and then convert it into whatever you need from there, so a height map and a texture map. For this first part I used parts of Sebastian Lague’s tutorial on the subject [linked here][linked here]. And from there I added an additional noise map for the tree chunks, so that the trees weren’t random but followed a forest-like configuration.The code itself doesn’t really make too much sense out of context so I’ll explain the important part and if you’re curious to explore more you can find the ‘ObjectGenerator’ script that does most of the heavy lifting.

This is the most important part of the script: what it does is take in another noise map that was created and superimposes it on top of the height requirements of the original noisemap(which basically delineates where the water, grass and mountains start/end). So the superimposed noise map creates chunks of forest which can be manipulated by the treeChunkSize variable.

You can see the chunks are variable and can be completely randomized, like the rest of the generation.
<img src="/assets/Terrain1.png" height="966" width="1912"> 
You can make them larger
<img src="/assets/Terrain2.png" height="966" width="1912"> 
And you can even increase the density of the trees, with up to 15,000 trees before you start noticing and lag, at least on my rig. I was able to achieve this by combining Unity’s built-in tree generation software with the LOD to create a fairly seamless transition. 
<img src="/assets/Terrain3.png" height="966" width="1912"> 
<img src="/assets/Terrain4.png" height="966" width="1912">  
There's also grass, although it is not based around chunks because grass is kind of everywhere, foliage is less chunkable, let's put it that way.
<img src="/assets/Terrain5.png" height="966" width="1912"> 




[here]: https://www.youtube.com/watch?v=wbpMiKiSKm8&list=PLFt_AvWsXl0eBW2EiBtl_sxmDtSgZBxB3


