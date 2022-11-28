**Classroom Simulator MQP 2022-2023**

This branch is for godotTesting.

Requirements:
 - Collision Handling?
 - Able to pause on certain frames?

**Members**

**Description**
The goal is to help teachers learn about interactions with students through a classroom simulation. We are creating the front end for a classroom simulation web app.


**Godot Notes and log**
- For 2d Pixel images, go to import & set preset to 2d pixel, then set as default for texture
- created a tileset folder 
- Created a new scene by creating the root node (2d scene) and renaming it to World. This adds World.tscn which I saved in the home directory (res://)
- You can now drag sprites (pngs) into the world and they will become children of World Node. Children aspects such as location are relative to World Node.
- We need to set a default view engine, press play btn & it says no main scene has been defined. Select World as main scene (linking camera to World)
- Now need to set project settings to work with pixel art game, using 32 pxl textures, Settings>Display>Window>Width=320, Height=180 (this will also make the window very small. Set Test Width & Height (1280x720) & Stretch>Mode to 2d to scale this.


_Changelog Nov 28_
Gabe
-Starting working on getting navigation to work with Navigation2D. Right now, clicking on a space in the map will get my character to move to that location, with a nice debug line. However, collisions and avoidance is not working because of something to do with there being 2 different tile maps. If I take the ground layer out, then the navigation can't see the ground and will not be able to walk on normal floor tiles, meaning it gets stuck a lot. With the ground in, it ignores the obstacle tilemap. 
-Edited my character so it lined up correctly, will probably have to do with other characters at some point. 
-Added ambiant classroom background (placeholder) noise playing in loop
-Experimented with an Animated2dSprite thing and animation trees, nothing implemented yet

Should still look generally the same, plus clicking for movement. In the future the clicking will be replaced by just giving the sprites coordinates.
