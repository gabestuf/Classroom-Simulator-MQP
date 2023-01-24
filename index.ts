import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;
let cors = require("cors");
const path = require("path");
app.use(cors());

const bodyParser = require("express").json;
app.use(bodyParser());
app.use(express.static("public"));
app.use(express.json());

// Classroom logic
import ClassroomConfig from "./Simulator/Config/CONFIG";
import Room from "./Simulator/Room/Room";
import Simulator from "./Simulator/Simulator";

// const sim = new Simulator(config)
// sim.generate()

app.get("/", (req: Request, res: Response) => {
  res.send("MQP API");
});

app.get("/render-room", (req: Request, res: Response) => {
  const config = genRandomConfig();
  const room = new Room(config);

  res.json({
    status: "SUCCESS",
    message: `rendered a room with seed ${config.seed}`,
    body: {
      room: room.toJSON(),
    },
  });
});

app.get("/render-room/:config", (req: Request, res: Response) => {
  // http://localhost:3001/renderRoom/{"roomSizeX": 9, "roomSizeY": 7, "numStudents": 2, "numTeachers": 1, "numChairs": 4, "numTables": 2, "numRugs": 1, "seed": 25}
  try {
    const config = JSON.parse(req.params.config);
    if (config instanceof ClassroomConfig) {
      const room = new Room(config);
      res.json({
        status: "SUCCESS",
        message: `rendered a room with seed ${config.seed}`,
        body: {
          room: room.toJSON(),
        },
      });
    } else {
      res.json({
        status: "FAILED",
        message: "Unable to read config, make sure it matches ClassroomConfig",
      });
    }
  } catch (e) {
    res.json({
      status: "FAILED",
      message: `There was an error with your request: ${e}`,
    });
  }
});

app.post("/render-room", (req, res) => {
  // request would look something like: (fetch api as example)
  /* 
  {
    method: "POST",
    headers: {
      Content-Type: 'application/json'
    },
    body: {
      config: {
        roomSizeX: 9,
        roomSizeY: 7,
        numStudents: 2,
        numTeachers: 1,
        numChairs: 4,
        numTables: 2,
        numRugs: 1,
        seed: 2 
      }
    }
  }
  */
  const config = req.body.config;
  try {
    if (config instanceof ClassroomConfig) {
      const room = new Room(config);
      // room.render();
      // const p = shortestPath(room, new Coordinate(1, 1), new Coordinate(1, 1));
      // console.log(p);

      res.json({
        status: "SUCCESS",
        message: `rendered a room with seed ${config.seed}`,
        body: {
          room: room.toJSON(),
        },
      });
    } else {
      res.json({
        status: "FAILED",
        message: "Unable to read config, make sure it matches ClassroomConfig",
      });
    }
  } catch (e) {
    res.json({
      status: "FAILED",
      message: `There was an error with your request ${e}`,
    });
  }
});

app.get("/classroom-simulation/random/singleEvent", (req, res) => {
  try {
    const numEvents = 1;
    const sim = new Simulator(genRandomConfig(), numEvents);
    sim.generateOneRandomEvent();

    res.json({
      status: "SUCCESS",
      message: "Successfully generated a random event",
      body: {
        classroomJSON: sim.finalJSON,
      },
    });
  } catch (e) {
    console.error(e);
    res.json({
      status: "FAILED",
      message: `There was an error with your request ${e}`,
    });
  }
});

function genRandomConfig() {
  const numS = Math.floor(Math.random() * 4) + 2;

  return new ClassroomConfig({
    roomSizeX: Math.floor(Math.random() * 10) + 5,
    roomSizeY: Math.floor(Math.random() * 10) + 5,
    numStudents: numS,
    numTeachers: Math.floor(Math.random() * 1) + 1,
    numChairs: numS,
    numTables: Math.floor(Math.random() * 3) + 1,
    numRugs: Math.floor(Math.random() * 2) + 1,
    seed: Math.floor(Math.random() * 10000),
  });

  // return new ClassroomConfig({
  //   roomSizeX: 6,
  //   roomSizeY: 7,
  //   numStudents: 2,
  //   numTeachers: 1,
  //   numChairs: 4,
  //   numTables: 1,
  //   numRugs: 1,
  //   seed: 1,
  // });
}

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

module.exports = app;
