"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Moods_1 = __importDefault(require("./Emotions/Moods"));
class Student {
    constructor(id_, initPos_) {
        this.name = `Student${id_.toString()}`;
        this.pos = initPos_;
        this.heading = null;
        this.mood = new Moods_1.default("neutral");
        this.currentDescription = "";
    }
    moveTowardHeading(room) {
        // BFS ->
        /*
            this.pos = bfs(2dArray, startPosition, endPosition) -> Array of Coordinates
            */
    }
    updateHeadingByLocation(newLoc) {
        this.heading = newLoc.chooseRandomPosition();
    }
    toString() {
        return `S`;
    }
    toJSON() {
        const newjson = {
            name: this.name,
            pos: [this.pos.x, this.pos.y],
            mood: this.mood.name,
            description: this.currentDescription,
        };
        return newjson;
    }
}
exports.default = Student;
