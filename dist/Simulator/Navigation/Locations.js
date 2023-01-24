"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ShuffleArray_1 = __importDefault(require("../Helper Functions/ShuffleArray"));
const Coordinate_1 = __importDefault(require("./Coordinate"));
// locations include the following:
// current location also exists, but will be handled before this function because need access to Student's location
const locList = ["corner", "table", "wall", "chair", "rug"];
class ClassroomLocation {
    constructor(locationName_, classroom) {
        if (locList.includes(locationName_)) {
            this.name = locationName_;
        }
        else {
            console.log(locationName_);
            const errStr = `This location cannot be found. Here is a list of the available location names currently: ${locList}`;
            throw new Error(errStr);
        }
        this.positions = this.getPositions(locationName_, classroom);
    }
    getPositions(name, classroom) {
        switch (name) {
            case "corner":
                return [new Coordinate_1.default(1, 1), new Coordinate_1.default(1, classroom.config.roomSizeY - 2), new Coordinate_1.default(classroom.config.roomSizeX - 2, 1), new Coordinate_1.default(classroom.config.roomSizeX - 2, classroom.config.roomSizeY - 2)];
            case "wall":
                let coordinateList = [];
                for (let y = 0; y < classroom.config.roomSizeY; y++) {
                    for (let x = 0; x < classroom.config.roomSizeX; x++) {
                        if (x === 1 || y === 1 || x === classroom.config.roomSizeX - 2 || y === classroom.config.roomSizeY - 2) {
                            coordinateList.push(new Coordinate_1.default(x, y));
                        }
                    }
                }
                return coordinateList;
            case "table":
                return classroom.room.findAllTables();
            case "chair":
                return classroom.room.findAllChairs();
            case "rug":
                return classroom.room.findAllRugs();
            default:
                throw new Error("There is no location with that name");
        }
        // table, chair, rug
    }
    chooseRandomPosition() {
        return (0, ShuffleArray_1.default)(this.positions).pop();
    }
}
exports.default = ClassroomLocation;
