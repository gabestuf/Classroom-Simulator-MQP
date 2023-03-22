"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClassroomConfig {
    constructor(JSONConfig) {
        this.roomSizeX = JSONConfig.roomSizeX;
        this.roomSizeY = JSONConfig.roomSizeY;
        this.numStudents = JSONConfig.numStudents;
        this.numTeachers = JSONConfig.numTeachers;
        this.numChairs = JSONConfig.numChairs;
        this.numRugs = JSONConfig.numRugs;
        this.numTables = JSONConfig.numRugs;
        this.seed = JSONConfig.seed;
        this.numBookshelves = JSONConfig.numBookshelves;
    }
    isValid() {
        for (const property of Object.values(this)) {
            if (property === null || property === undefined) {
                return false;
            }
        }
        return true;
    }
}
exports.default = ClassroomConfig;
