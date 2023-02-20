# MQP API

[Currently Hosted Here](https://classroom-simulator-server.vercel.app/)

## Description

The goal of this server is to be able to generate the initial scenarios from an API and eventually generate frames that can be sent as a JSON body to a client. This should function as a REST API that provides useful JSON that can be used by the Classroom Simulator MQP. The JSON should be able to be read by our front-end, which will render the information. The information will be acquired through http requests and can be semi random based on parameters.

## How to Use

### Getting Branch to local machine:

_Make sure changes are saved on current branch_

Switch to branch server:

> git checkout server

If this is your first time pulling the branch `git checkout server` might not work:

1. Fetch all remote branches
   > git fetch origin
2. List branches available for checkout
   > git branch -a
3. Pull changes from a remote branch
   > git checkout -b server origin/server

For more information, visit [here](https://www.freecodecamp.org/news/git-checkout-remote-branch-tutorial/)

### Locally

Make sure [Node](https://nodejs.org/en/) v18 is installed. You can check with

> `node --version`

Install the dependencies with

> `npm install`

Run the app with the 'dev' script (see scripts in package.json)

> `npm run dev`

This will run two terminals concurrently. One compiles the typescript code into javascript and builds it in the /dist folder. The other is node running the compiled index.js, which is the express app. The typescript is compiled on save. Default port is 3000, or you can make a .env with PORT=number. Send requests to http://localhost:port/ on your local machine.

---

### Here is the current API:

| Method | Route                                                 | Description                                                                                                          | Return Type   |
| ------ | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------- |
| GET    | /render-room                                          | will render a random room with random parameters                                                                     | Room          |
| GET    | /render-room/:seed                                    | will render a random room based on the seed you give it                                                              | Room          |
| POST   | /render-room                                          | will render a semi random room with parameters in config.[^1] Config is sent in the request body as {config: config} | Room          |
| GET    | /classroom-simulation/random/singleEvent              | runs a single random event with random config, mostly for testing. Right now there are only 2 available events.      | classroomJSON |
| GET    | /classroom-simulation/random/:numEvents               | will render a number of events with a random config.                                                                 | classroomJSON |
| GET    | /classroom-simulation/random/singleEvent/:seed        | will render a single event with a set seed                                                                           | classroomJSON |
| GET    | /classroom-simulation/singleEvent/:eventName          | will render a specified single event                                                                                 | classroomJSON |
| GET    | /classroom-simulation/singleEvent/:eventName/:seed    | will render a specified single event and also a given seed                                                           | classroomJSON |
| GET    | /classroom-simulation/generateEvents/:numEvents/:seed | will render random events given the number of events and a seed.                                                     | classroomJSON |

[^1]:
    The config is a JSON Object that looks like this: `
{
"roomSizeX": number,
"roomSizeY": number,
"numStudents": number,
"numTeachers": number,
"numChairs": number,
"numTables": number,
"numRugs": number,
"seed": number}`

### How to use the data

### _Room_

> ### Will return a parameter "room" in the body: `{room: string[][]}`
>
> - This will be a 2d array of size [roomSizeY][roomsizex]. _Note that it is y,x and not x,y_

### _classroomJSON_

> ### Will return a parameter "classroomJSON" in the body. `{classroomJSON: JSON}`
>
> It will have the following structure:
>
> ```
> {
>   config: config;
>   room: string[];
>   initClassroom: string[];
>   frames: [
>     {
>       currentEvent: string,
>       spriteList: Sprite[]
>     }
>   ]
> }
> ```
>
> A Sprite has the following attributes:
>
> ```
> {
>   name: string
>   pos: Coordinate
>   mood: Mood
>   heading: Coordinate | null
>   currentDescription: string
> }
> ```
>
> This will be the main format for data
> .

---

## BUGs / Testing :

- [ ] Figure out why multiple of the same frames are being printed
- [x] Make sure BFS works
- [ ] Make sure all Routes work

### How to write tests:

- Make a new file with the .test.ts extension
- We are using the library 'jest'
- run `npm run test -- --coverage` to run the tests with code coverage
- or just `npm run test` to run the tests

## //TODO

- [ ] Complete TODO
- [ ] create more routes depending on client needs
- [ ] test http requests in Godot


---

## Changelog:

_v0.3_

- Simulation now occurs for events that are input manually
- StoryEvents JSON needs to be reconfigured.
- BFS pathing works
- Simulation now updates sprites positions each frame for an event
- Sprites are allowed to be in the same tile, they are allowed to navigate over chairs, rugs, and other sprites
- Simulation returns a json object which can be sent to the front end (godot)
  //TODO Seems to repeat some frames, more debugging needed
- Room generation is now seeded, seed added to config
- Added Routes:

  - Get "/renderRoom" will render a random room with random parameters
  - Get "/renderRoom/:config", where config is a ClassroomConfig
  - Post "/renderRoom", with config in the body of the request
  - Get "/classroom-simulation/random/singleEvent", runs a single random event with random config, mostly for testing. Right now there are only 2 available events

_v0.2_

- tested api deploy on vercel. It reads from dist folder. package.json & vercel.json shouldn't update on npm run build, but make sure to test dist folder before pushing...
  - if new packages are added, make sure to add the dependencies to package.json in dist folder
  - cd /dist
  - npm run start
  - see if it works

_v0.1_

- index.ts is the entry point for the express server
- Interfaces for Tiles and Sprites created
  - Tiles include Floor, Wall, Rug, Chair, and Table
  - Sprites include Teacher and Student
- CONFIG.ts controls room size, and number of objects (sprites and special tiles)
- Chairs try to be placed around tables when possible, will be placed at first possible table, but random location around table
- Students initial positions will be in chairs if possible, otherwise random floor position
