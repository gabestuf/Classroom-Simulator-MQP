"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const GenerateRandomNumber_1 = __importDefault(require("./Simulator/Helper Functions/GenerateRandomNumber"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
let cors = require("cors");
const path = require("path");
app.use(cors());
const bodyParser = require("express").json;
app.use(bodyParser());
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
// Classroom logic
const CONFIG_1 = __importDefault(require("./Simulator/Config/CONFIG"));
const Room_1 = __importDefault(require("./Simulator/Room/Room"));
const Simulator_1 = __importDefault(require("./Simulator/Simulator"));
app.get("/", (req, res) => {
    res.send("MQP API");
});
app.get("/render-room", (req, res) => {
    const config = genRandomConfig();
    const room = new Room_1.default(config);
    res.json({
        status: "SUCCESS",
        message: `rendered a room with seed ${config.seed}`,
        body: {
            room: room.toJSON(),
        },
    });
});
app.get("/render-room/:config", (req, res) => {
    // http://localhost:3001/renderRoom/{"roomSizeX": 9, "roomSizeY": 7, "numStudents": 2, "numTeachers": 1, "numChairs": 4, "numTables": 2, "numRugs": 1, "seed": 25}
    try {
        const cfg = JSON.parse(req.params.config);
        // create new ClassroomConfig, so we can check if the datatype matches
        const config = new CONFIG_1.default({
            seed: cfg.seed,
            roomSizeX: cfg.roomSizeX,
            roomSizeY: cfg.roomSizeY,
            numStudents: cfg.numStudents,
            numTeachers: cfg.numTeachers,
            numChairs: cfg.numChairs,
            numTables: cfg.numTables,
            numRugs: cfg.numRugs,
        });
        if (!config.isValid()) {
            res.json({
                status: "FAILED",
                message: "The config you entered is not valid. Please refer to the README",
            });
        }
        if (config instanceof CONFIG_1.default) {
            const room = new Room_1.default(config);
            res.json({
                status: "SUCCESS",
                message: `rendered a room with seed ${config.seed}`,
                body: {
                    room: room.toJSON(),
                },
            });
        }
        else {
            res.json({
                status: "FAILED",
                message: "Unable to read config, make sure it matches ClassroomConfig",
            });
        }
    }
    catch (e) {
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
          "roomSizeX": 9,
          "roomSizeY": 7,
          "numStudents": 2,
          "numTeachers": 1,
          "numChairs": 4,
          "numTables": 2,
          "numRugs": 1,
          "seed": 2
        }
      }
    }
    */
    const cfg = req.body.config;
    // create new ClassroomConfig, so we can check if the datatype matches
    const config = new CONFIG_1.default({
        seed: cfg.seed,
        roomSizeX: cfg.roomSizeX,
        roomSizeY: cfg.roomSizeY,
        numStudents: cfg.numStudents,
        numTeachers: cfg.numTeachers,
        numChairs: cfg.numChairs,
        numTables: cfg.numTables,
        numRugs: cfg.numRugs,
    });
    if (!config.isValid()) {
        res.json({
            status: "FAILED",
            message: "The config you entered is not valid. Please refer to the README",
        });
    }
    try {
        // if (config instanceof ClassroomConfig) {
        const room = new Room_1.default(config);
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
        // }
        // else {
        //   res.json({
        //     status: "FAILED",
        //     message: "Unable to read config, make sure it matches ClassroomConfig",
        //   });
        // }
    }
    catch (e) {
        res.json({
            status: "FAILED",
            message: `There was an error with your request ${e}`,
        });
    }
});
app.get("/classroom-simulation/random/singleEvent", (req, res) => {
    try {
        const numEvents = 1;
        const sim = new Simulator_1.default(genRandomConfig(), numEvents);
        sim.generateOneRandomEvent();
        res.json({
            status: "SUCCESS",
            message: "Successfully generated a random event",
            body: {
                classroomJSON: sim.finalJSON,
            },
        });
    }
    catch (e) {
        console.error(e);
        res.json({
            status: "FAILED",
            message: `There was an error with your request ${e}`,
        });
    }
});
app.get("/classroom-simulation/random/singleEvent/:seed", (req, res) => {
    const seed = parseInt(req.params.seed);
    try {
        const numEvents = 1;
        const sim = new Simulator_1.default(genRandomConfig(seed || undefined), numEvents);
        sim.generateOneRandomEvent();
        res.json({
            status: "SUCCESS",
            message: "Successfully generated a random event",
            body: {
                classroomJSON: sim.finalJSON,
            },
        });
    }
    catch (e) {
        console.error(e);
        res.json({
            status: "FAILED",
            message: `There was an error with your request ${e}`,
        });
    }
});
app.get("/classroom-simulation/random/:num", (req, res) => {
    try {
        const numEvents = parseInt(req.params.num);
        console.log(numEvents);
        if (Number.isNaN(numEvents) || numEvents > 20 || numEvents < 1) {
            res.json({
                status: "FAILED",
                message: "Request failed. There is a cap at 20 events currently. \n Need at least 1 event.\nIt is also possible that an invalid number/string was passed as an arguement",
            });
        }
        const sim = new Simulator_1.default(genRandomConfig(), numEvents);
        sim.generateRandomEvents(numEvents);
        res.json({
            status: "SUCCESS",
            message: "Successfully generated a random event",
            body: {
                classroomJSON: sim.finalJSON,
            },
        });
    }
    catch (e) {
        console.error(e);
        res.json({
            status: "FAILED",
            message: `There was an error with your request ${e}`,
        });
    }
});
function genRandomConfig(seed = Math.floor(Math.random() * 10000)) {
    const numS = Math.floor((0, GenerateRandomNumber_1.default)(seed * 6) * 4) + 2;
    return new CONFIG_1.default({
        roomSizeX: Math.floor((0, GenerateRandomNumber_1.default)(seed * 2) * 10) + 5,
        roomSizeY: Math.floor((0, GenerateRandomNumber_1.default)(seed + 3) * 10) + 5,
        numStudents: numS,
        numTeachers: Math.floor((0, GenerateRandomNumber_1.default)(seed * 1.5) * 1) + 1,
        numChairs: numS,
        numTables: Math.floor((0, GenerateRandomNumber_1.default)(seed * 7) * 3) + 1,
        numRugs: Math.floor((0, GenerateRandomNumber_1.default)(seed * 5) * 2) + 1,
        seed: seed,
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
