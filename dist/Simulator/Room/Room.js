"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Tiles_1 = require("./Tiles");
const Coordinate_1 = __importDefault(require("../Navigation/Coordinate"));
const GenerateRandomNumber_1 = __importDefault(require("../Helper Functions/GenerateRandomNumber"));
class Room {
    constructor(cfg) {
        this.RoomCfg = cfg;
        this.RoomArray = this.generateRoomFloor(cfg.roomSizeX, cfg.roomSizeY);
        this.generateRoomElements();
    }
    // Generates floor, windows, and a door
    generateRoomFloor(sizeX, sizeY) {
        let newRoom = new Array();
        // Generate Walls & Floors
        for (let y = 0; y < sizeY; y++) {
            let row = new Array();
            for (let x = 0; x < sizeX; x++) {
                const newCoord = new Coordinate_1.default(x, y);
                // check for wall space
                if (x === 0 || y === 0 || x === sizeX - 1 || y === sizeY - 1) {
                    // Add windows to top wall randomly, 30% change
                    if (y === 0 && x > 1 && x < this.RoomCfg.roomSizeX - 1 && (0, GenerateRandomNumber_1.default)(x * 2) < 0.3) {
                        console.log("etert");
                        row.push(new Tiles_1.Window(newCoord));
                    }
                    else {
                        // add Walls if not window
                        row.push(new Tiles_1.Wall(newCoord));
                    }
                }
                // else place floor
                else {
                    row.push(new Tiles_1.Floor(newCoord));
                }
            }
            newRoom.push(row);
        }
        // and a door in a random location on one of the lower walls
        const wallRNG = (0, GenerateRandomNumber_1.default)(this.RoomCfg.seed + 1);
        if (wallRNG > 0.6666) {
            // Left wall
            const pos = Math.floor((0, GenerateRandomNumber_1.default)(this.RoomCfg.seed * 1.45) * (newRoom.length - 2) + 1); // Should get a random number from 1 to newRoom.length - 1
            newRoom[pos][newRoom[0].length - 1] = new Tiles_1.Door(new Coordinate_1.default(newRoom[0].length - 1, pos));
        }
        else if (wallRNG <= 0.6666 && wallRNG > 0.3333) {
            // Right wall
            const pos = Math.floor((0, GenerateRandomNumber_1.default)(this.RoomCfg.seed * 1.45) * (newRoom.length - 2) + 1); // Should get a random number from 1 to newRoom.length - 1
            newRoom[pos][newRoom[0].length - 1] = new Tiles_1.Door(new Coordinate_1.default(newRoom[0].length - 1, pos));
        }
        else {
            // Bottom wall
            const pos = Math.floor((0, GenerateRandomNumber_1.default)(this.RoomCfg.seed * 1.45) * (newRoom[0].length - 2) + 1);
            newRoom[newRoom.length - 1][pos] = new Tiles_1.Door(new Coordinate_1.default(pos, newRoom.length - 1));
        }
        return newRoom;
    }
    generateRoomElements() {
        // add tables
        for (let i = 0; i < this.RoomCfg.numTables; i++) {
            const newCoord = this.findRandomEmptySpaceNoEdges();
            this.RoomArray[newCoord.y][newCoord.x] = new Tiles_1.Table(newCoord);
        }
        // add rug
        for (let i = 0; i < this.RoomCfg.numRugs; i++) {
            const newCoord = this.findRandomEmptySpace();
            this.RoomArray[newCoord.y][newCoord.x] = new Tiles_1.Rug(newCoord);
        }
        // add chairs
        for (let i = 0; i < this.RoomCfg.numChairs; i++) {
            // first, try to add chair next to a table
            const tableLocArr = this.findAllTables();
            // choose a random table to add a chair next to
            const tableLoc = tableLocArr[Math.floor((0, GenerateRandomNumber_1.default)(this.RoomCfg.seed * this.RoomCfg.roomSizeY * 3 + 5) * tableLocArr.length)];
            if (tableLoc !== null) {
                const newCoord = this.findRandomEmptyAdjacentSpace(tableLoc);
                if (newCoord !== null) {
                    this.RoomArray[newCoord.y][newCoord.x] = new Tiles_1.Chair(newCoord);
                }
                else {
                    // there's a table but no available spaces around it, have to copy some logic here
                    const newCoord = this.findRandomEmptySpaceNoEdges();
                    this.RoomArray[newCoord.y][newCoord.x] = new Tiles_1.Chair(newCoord);
                }
            }
            else {
                // if there are no tables or spaces by tables available, add a chair in a random location
                const newCoord = this.findRandomEmptySpaceNoEdges();
                this.RoomArray[newCoord.y][newCoord.x] = new Tiles_1.Chair(newCoord);
            }
        }
    }
    getTileAtCoordinate(x, y) {
        try {
            return this.RoomArray[x][y];
        }
        catch (e) {
            console.error(`Error in function getTileAtCoordinate: ${e}`);
        }
        return null;
    }
    findRandomEmptyAdjacentSpace(coord) {
        let emptyAdjacentCoordinateList = [];
        for (let x = coord.x - 1; x <= coord.x + 1; x++) {
            for (let y = coord.y - 1; y <= coord.y + 1; y++) {
                // check if coord is within bounds
                if (y >= 0 && y < this.RoomArray.length && x >= 0 && x < this.RoomArray[0].length) {
                    if (this.RoomArray[y][x] instanceof Tiles_1.Floor) {
                        emptyAdjacentCoordinateList.push(new Coordinate_1.default(x, y));
                    }
                }
            }
        }
        if (emptyAdjacentCoordinateList.length === 0) {
            return null;
        }
        return emptyAdjacentCoordinateList[Math.floor((0, GenerateRandomNumber_1.default)(this.RoomCfg.seed + this.RoomCfg.numStudents * 2) * emptyAdjacentCoordinateList.length)];
    }
    findTable() {
        for (let y = 0; y < this.RoomArray.length; y++) {
            for (let x = 0; x < this.RoomArray[0].length; x++) {
                if (this.RoomArray[y][x] instanceof Tiles_1.Table) {
                    return new Coordinate_1.default(x, y);
                }
            }
        }
        return null;
    }
    findAllTables() {
        let tableCoordList = [];
        for (let y = 0; y < this.RoomArray.length; y++) {
            for (let x = 0; x < this.RoomArray[0].length; x++) {
                if (this.RoomArray[y][x] instanceof Tiles_1.Table) {
                    tableCoordList.push(new Coordinate_1.default(x, y));
                }
            }
        }
        return tableCoordList;
    }
    findChair() {
        for (let y = 0; y < this.RoomArray.length; y++) {
            for (let x = 0; x < this.RoomArray[0].length; x++) {
                if (this.RoomArray[y][x] instanceof Tiles_1.Chair) {
                    return new Coordinate_1.default(x, y);
                }
            }
        }
        return null;
    }
    findAllChairs() {
        let chairCoordList = [];
        for (let y = 0; y < this.RoomArray.length; y++) {
            for (let x = 0; x < this.RoomArray[0].length; x++) {
                if (this.RoomArray[y][x] instanceof Tiles_1.Chair) {
                    chairCoordList.push(new Coordinate_1.default(x, y));
                }
            }
        }
        return chairCoordList;
    }
    findRug() {
        for (let y = 0; y < this.RoomArray.length; y++) {
            for (let x = 0; x < this.RoomArray[0].length; x++) {
                if (this.RoomArray[y][x] instanceof Tiles_1.Rug) {
                    return new Coordinate_1.default(x, y);
                }
            }
        }
        return null;
    }
    findAllRugs() {
        let rugCoordList = [];
        for (let y = 0; y < this.RoomArray.length; y++) {
            for (let x = 0; x < this.RoomArray[0].length; x++) {
                if (this.RoomArray[y][x] instanceof Tiles_1.Rug) {
                    rugCoordList.push(new Coordinate_1.default(x, y));
                }
            }
        }
        return rugCoordList;
    }
    findRandomEmptySpace() {
        // Looks for empty floor spaces and gets their coordinates
        // a random coordinate is picked from this list of coordinates
        let coordinateList = [];
        // we want to get all positions where there is floor
        for (const row of this.RoomArray) {
            for (const tile of row) {
                if (tile instanceof Tiles_1.Floor) {
                    coordinateList.push(tile.pos);
                }
            }
        }
        if (coordinateList.length === 0) {
            // There were no empty spaces found
            throw new Error("Error, findRandomEmptySpace returned null, most likely room is too small to accomodate all sprites.");
        }
        return coordinateList[Math.floor((0, GenerateRandomNumber_1.default)(this.RoomCfg.seed) * coordinateList.length)];
    }
    findRandomEmptySpaceNoEdges() {
        // same as findRandomEmptySpace but no coordinates against the wall
        let coordinateList = [];
        // we want to get all positions where there is floor
        for (const row of this.RoomArray) {
            for (const tile of row) {
                if (tile instanceof Tiles_1.Floor) {
                    // additional check if tile.pos is close to a wall
                    if (tile.pos.x > 2 && tile.pos.x < this.RoomArray.length - 2 && tile.pos.y > 2 && this.RoomArray.length - 2) {
                        coordinateList.push(tile.pos);
                    }
                }
            }
        }
        if (coordinateList.length === 0) {
            throw new Error("Error, findRandomEmptySpace returned null, most likely room is too small to accomodate all sprites.");
        }
        return coordinateList[Math.floor((0, GenerateRandomNumber_1.default)(this.RoomCfg.seed) * coordinateList.length)];
    }
    findRandomEmptySpaceForSprite(spriteList) {
        // spriteList contains sprites and their positions in the room, so
        // the room doesn't count these spaces as empty
        let coordinateList = [];
        // we want to get all positions where there is floor
        for (const row of this.RoomArray) {
            for (const tile of row) {
                if (tile instanceof Tiles_1.Floor) {
                    let isEmpty = true;
                    // check if any sprite is already on that tile
                    for (const sprite of spriteList) {
                        if (sprite.pos.x === tile.pos.x && sprite.pos.y === tile.pos.y) {
                            isEmpty = false;
                        }
                    }
                    // if the tile is clear, add sprite to tile
                    if (isEmpty) {
                        coordinateList.push(tile.pos);
                    }
                }
            }
        }
        if (coordinateList.length === 0) {
            throw new Error("Error, findRandomEmptySpace returned null, most likely room is too small to accomodate all sprites.");
        }
        return coordinateList[Math.floor((0, GenerateRandomNumber_1.default)(this.RoomCfg.seed * this.RoomCfg.roomSizeX + 1) * coordinateList.length)];
    }
    toString() {
        let str = "\n";
        for (let y = 0; y < this.RoomArray.length; y++) {
            for (let x = 0; x < this.RoomArray[0].length; x++) {
                str += this.RoomArray[y][x];
            }
            str += "\n";
        }
        return str;
    }
    toStringArray() {
        let strArr = [];
        for (let y = 0; y < this.RoomArray.length; y++) {
            let str = "";
            for (let x = 0; x < this.RoomArray[0].length; x++) {
                str += this.RoomArray[y][x];
            }
            strArr.push(str);
        }
        return strArr;
    }
    toJSON() {
        let roomArr = [];
        for (let y = 0; y < this.RoomArray.length; y++) {
            let row = [];
            for (let x = 0; x < this.RoomArray[0].length; x++) {
                row.push(this.RoomArray[y][x].toString());
            }
            roomArr.push(row);
        }
        return roomArr;
    }
    render() {
        // Prints room to console
        console.log(this.toString());
    }
}
exports.default = Room;
/*
Test Room

const room: Room = new Room(config)
room.RoomArray = [
  [new Wall(new Coordinate(0,0)), new Wall(new Coordinate(1,0)), new Wall(new Coordinate(2,0)), new Wall(new Coordinate(3,0)), new Wall(new Coordinate(4,0))],
  [new Wall(new Coordinate(0,1)), new Floor(new Coordinate(1,1)), new Floor(new Coordinate(2,1)), new Floor(new Coordinate(3,1)), new Wall(new Coordinate(4,1))],
  [new Wall(new Coordinate(0,2)), new Floor(new Coordinate(1,2)), new Floor(new Coordinate(2,2)), new Floor(new Coordinate(3,2)), new Wall(new Coordinate(4,2))],
  [new Wall(new Coordinate(0,3)), new Floor(new Coordinate(1,3)), new Floor(new Coordinate(2,3)), new Floor(new Coordinate(3,3)), new Wall(new Coordinate(4,3))],
  [new Wall(new Coordinate(0,4)), new Floor(new Coordinate(1,4)), new Floor(new Coordinate(2,4)), new Floor(new Coordinate(3,4)), new Wall(new Coordinate(4,4))],
  [new Wall(new Coordinate(0,5)), new Floor(new Coordinate(1,5)), new Table(new Coordinate(2,5)), new Floor(new Coordinate(3,5)), new Wall(new Coordinate(4,5))],
  [new Wall(new Coordinate(0,6)), new Wall(new Coordinate(1,6)), new Wall(new Coordinate(2,6)), new Wall(new Coordinate(3,6)), new Wall(new Coordinate(4,6))]
]

*/
