"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Moods_1 = __importDefault(require("./Emotions/Moods"));
class Teacher {
    constructor(id_, initPos_) {
        this.name = `Teacher${id_.toString()}`;
        this.pos = initPos_;
        this.heading = null;
        this.mood = new Moods_1.default("neutral");
        this.currentDescription = "";
    }
    updateHeadingByLocation(newLoc) {
        this.heading = newLoc.chooseRandomPosition();
    }
    toString() {
        return `T`;
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
exports.default = Teacher;
