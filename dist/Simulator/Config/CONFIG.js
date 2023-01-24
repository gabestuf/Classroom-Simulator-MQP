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
    }
}
exports.default = ClassroomConfig;
