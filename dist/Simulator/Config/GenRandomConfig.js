"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GenerateRandomNumber_1 = __importDefault(require("../Helper Functions/GenerateRandomNumber"));
const CONFIG_1 = __importDefault(require("./CONFIG"));
function genRandomConfig(seed = Math.floor(Math.random() * 10000)) {
    const numS = Math.floor((0, GenerateRandomNumber_1.default)(seed * 6) * 4) + 2;
    return new CONFIG_1.default({
        roomSizeX: Math.floor((0, GenerateRandomNumber_1.default)(seed * 2) * 10) + 7,
        roomSizeY: Math.floor((0, GenerateRandomNumber_1.default)(seed + 3) * 10) + 7,
        numStudents: numS,
        numTeachers: Math.floor((0, GenerateRandomNumber_1.default)(seed * 1.5) + 1),
        numChairs: numS + 1,
        numTables: Math.floor((0, GenerateRandomNumber_1.default)(seed * 7) * 3) + 1,
        numRugs: Math.floor((0, GenerateRandomNumber_1.default)(seed * 5) * 2) + 1,
        numBookshelves: Math.floor((0, GenerateRandomNumber_1.default)(seed * 12) + 1),
        seed: seed,
    });
}
exports.default = genRandomConfig;
