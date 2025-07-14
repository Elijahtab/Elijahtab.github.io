---
title: Procedural Terrain + Foliage Generator
layout: single
permalink: /projects/terrain-generator/
author_profile: true

excerpt: "A Unity-based procedural terrain and foliage generator using layered Perlin noise. Designed for strategy games, it creates dynamic landscapes with forests."
header:
    teaser: /assets/images/Terrain6.png
---


Unity / C# | Procedural Generation | Game Development

## Overview  
This project explores procedural terrain generation for use in strategy game environments. Built in Unity using C#, it generates terrain height maps, textures, and clustered foliage using layered Perlin noise functions. The result is a dynamic, forested terrain that feels both randomized and organic.

## Key Features  
- **Procedural Height Map**: Generates natural elevation using Perlin noise  
- **Forest Clustering**: Uses a second noise layer to simulate tree clumping (i.e., forests), adjustable via a `treeChunkSize` parameter  
- **Foliage Density Scaling**: Supports up to 15,000 trees with minimal lag, using Unity's LOD system for optimization  
- **Terrain Texturing**: Zones (water, grass, mountain) are derived from elevation values for realistic transitions  
- **Grass Generation**: Broadly distributed for a natural look, separate from chunk-based tree logic

## Technical Breakdown  
The core logic is handled in the `ObjectGenerator` script. It overlays a secondary noise map onto the terrain’s height map to define forest boundaries. Only areas within suitable elevation zones receive foliage, ensuring no trees are placed underwater or on steep mountains.

The generation process is modular and parameterized, allowing control over terrain scale, forest density, chunk size, and foliage types. The result is a versatile tool for quickly prototyping game maps with biome-like qualities.

## Performance  
Thanks to Unity’s LOD system and efficient object placement, the generator handles large-scale terrains and high object counts with minimal performance overhead.

## Inspiration  
This tool was heavily inspired by Sebastian Lague’s procedural terrain tutorials, but expands the concept to incorporate clustered tree generation and more granular environmental control.

## Screenshots  
![Terrain Screenshot 1](/assets/images/Terrain4.png)  
![Terrain Screenshot 1](/assets/images/Terrain3.png)  
![Terrain Screenshot 2](/assets/images/Terrain5.png)

## Project Link  
👉 [View the project on GitHub](https://github.com/elijahtab/Real-Time-Strategy-Demo)
