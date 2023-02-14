"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ClassroomEvent_1 = __importDefault(require("./Events/ClassroomEvent"));
const Classroom_1 = __importDefault(require("./Classroom"));
const STORYEVENTS_1 = __importDefault(require("./Config/STORYEVENTS"));
const GenerateRandomNumber_1 = __importDefault(require("./Helper Functions/GenerateRandomNumber"));
class Simulator {
    constructor(config_, numEvents_) {
        this.config = config_;
        this.numEvents = numEvents_;
        this.classroom = new Classroom_1.default(config_);
        this.finalJSON = this.initFinalJSON();
    }
    initFinalJSON() {
        const initclassJSON = JSON.parse(JSON.stringify(this.classroom.toJSON("idle")));
        const fJSON = {
            config: this.config,
            room: this.classroom.room.toJSON(),
            initClassroom: this.classroom.toStringArray(),
            frames: [initclassJSON],
        };
        return fJSON;
    }
    generateOneRandomEvent(seedMult) {
        // TODO 2. Generate events at random intervals
        // to view just the room
        // classroom.room.render()
        // to view classroom, ie room w/ sprites
        // classroom.render()
        // 3. Create an event
        const eventNameList = new STORYEVENTS_1.default().getEventNames();
        let eventName = eventNameList[Math.floor((0, GenerateRandomNumber_1.default)(this.config.seed * seedMult) * eventNameList.length)];
        // this.classroom.render();
        // TODO Make sure to comment out next line, it is for testing specific events
        // eventName = "studentMakesMess";
        const randomEvent = new ClassroomEvent_1.default(eventName, this.classroom);
        // this.classroom.render();
        // 4. Apply event to classroom
        const classroomFrames = this.classroom.applyEvent(randomEvent);
        // 5. Turn classroom List into final json
        let classroomFramesJSON = classroomFrames.map((cl) => JSON.parse(JSON.stringify(cl.toJSON(eventName))));
        // console.log(util.inspect(this.finalJSON?.frames, false, null, true /* enable colors */));
        if (this.finalJSON !== null) {
            //   console.log("___________________");
            //   console.log(util.inspect(classroomFrames, false, null, true /* enable colors */));
            this.finalJSON.frames = [
                ...this.finalJSON.frames,
                ...classroomFramesJSON,
            ];
        }
    }
    generateEvents(eventName) {
        const eventNameList = new STORYEVENTS_1.default().getEventNames();
        if (eventNameList.indexOf(eventName) > -1) {
            const event = new ClassroomEvent_1.default(eventName, this.classroom);
            const classroomFrames = this.classroom.applyEvent(event);
            let classroomFramesJSON = classroomFrames.map((cl) => JSON.parse(JSON.stringify(cl.toJSON(eventName))));
            if (this.finalJSON !== null) {
                this.finalJSON.frames = [
                    ...this.finalJSON.frames,
                    ...classroomFramesJSON,
                ];
            }
        }
        else {
            const str = `event: '${eventName}' is not in StoryEvents`;
            throw new Error(str);
        }
    }
    generateRandomEvents(numEvents) {
        for (let i = 0; i < numEvents; i++) {
            this.generateOneRandomEvent(i);
        }
    }
}
exports.default = Simulator;
