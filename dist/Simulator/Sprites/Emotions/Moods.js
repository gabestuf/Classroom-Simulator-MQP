"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// maybe add upset, bored
const moodList = ["happy", "sad", "neutral", "angry", "tired"];
class Mood {
    constructor(name_) {
        if (moodList.includes(name_)) {
            this.name = name_;
        }
        else {
            console.log("error");
            throw Error(`This mood cannot be created, unavailable name entered. Here is a list of the available mood names currently: ${moodList}`);
        }
    }
}
exports.default = Mood;
