# Classroom Simulator Refactor

I've been refactoring the godot project, it's missing some features from the current version, but it can somewhat run events from the json. It's also a lot less code!! (23 .gd files, ~ 1600 lines, to 4 .gd files, 4 .gd files, 361 lines)

*NOTE: we definitely do not have to keep all of this if y'all already had alternatives, especially for the animations. However I hope at least some of this was helpful.*

## Description

The big things were dynamically loading the sprites and textures based on the JSON, getting navigation to work, simplifying and removing copy & pasted code, and setting up a new way to do the animations (which I'm not sure about, would like your opinion).

This is on it's own repo until we agree on what to keep or change because I didn't want to create a new branch because I'm lazy: https://github.com/gabestuf/Classroom_Sim_Refactor

## Here's most of what I've been working on:

Creating the rooms: 
- generates floors and walls
- generates tables, rugs, and chairs as sprites which can have collisions attached to them (they currently don't but that's more of a design choice)
- other room objects such as doors, windows, bookshelves etc generation is going to be moved to the backend generation for consistency

Navigation:
- Using built in Navigation2DServer API to calculate paths
- New "Navigation" node which basically just acts as a wrapper and spreads out some of the logic, tilemaps and sprites are children of this node

Sprites:
- Sprites are now there own scenes
- There is only one sprite script
- Sprites are instantiated based on how many sprites are needed specified in the JSON, this includes textures, mood, position. 
- Sprites are KinematicBody2D's which have the following children: 
- - Sprite (Where the texture is set)
- - NavigationAgent2D (Handles navigation)
- - CollisionShape2D (Handles collisions)
- - AnimationPlayer (Used to create animations - more info below)
- - AnimationTree (Handles switching animations)
- - EmotionLabel (Displays current emotion)

Animations: 
- Cropped texture maps to all be the same size (So every frame starts at the same x,y location). This allows keyframing based on a position of an image instead of a part of the image itself. This allows me to set different sprite textures for each sprite while using the same animations.
- Set up animations for walking in the different directions and Idle in the cardinal directions. 
- Began setting up animation tree for cardinal directions
- Goal: store a normalized vector in Sprite.gd which will switch the animation tree based on vector direction
- Emotion label displays emotion of sprites based on the current event in the json. 
- Goal: the emotion label switches as soon as the animation starts, it would make more sense in some cases for the label to switch once the sprite has reached it's location, for instance, in twoStudentsFight, the students are shown angry before they actually move toward each other. 

Random:
- A tick occurs 4x a second, if the current frame is finished, a new one occurs at the next tick
- Pathfinding in back-end is pretty much useless. Godot does a much better job. This will also allow us to use less frames. One idea is to break up movement by setting new positions in different frames (backend) or in the same frame if sprites move at the same time. Right now, when a new event triggers, all sprites begin responding immediately. 
