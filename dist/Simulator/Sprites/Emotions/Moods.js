"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// maybe add upset, bored
const moodList = ["happy", "sad", "neutral", "angry", "tired", "sick", "sleepy", "curious", "thirsty", "focused", "studious", "reader"];
class Mood {
    constructor(name_) {
        if (moodList.includes(name_)) {
            this.name = name_;
        }
        else {
            const errstr = `This mood cannot be created, unavailable name entered. Here is a list of the available mood names currently: ${moodList}`;
            throw Error(errstr);
        }
    }
}
exports.default = Mood;
