import { Wall, Floor, Table, Rug, Chair, Window, Door, Bookshelf } from "./Tiles";
import iTile from "./iTile";
import Coordinate from "../Navigation/Coordinate";
import iSprite from "../Sprites/iSprite";
import ClassroomConfig from "../Config/CONFIG";
import seededRandom from "../Helper Functions/GenerateRandomNumber";

class Room {
  RoomArray: Array<Array<iTile>>;
  RoomCfg: ClassroomConfig;

  constructor(cfg: ClassroomConfig) {
    this.RoomCfg = cfg;
    this.RoomArray = this.generateRoomFloor(cfg.roomSizeX, cfg.roomSizeY);
    this.generateRoomElements();
  }

  generateRoomFloor(sizeX: number, sizeY: number): Array<Array<iTile>> {
    let newRoom = new Array<Array<iTile>>();
    // Generate Walls & Floors
    for (let y: number = 0; y < sizeY; y++) {
      let row: iTile[] = new Array<iTile>();

      for (let x: number = 0; x < sizeX; x++) {
        const newCoord: Coordinate = new Coordinate(x, y);
        // check for wall space
        if (x === 0 || y === 0 || x === sizeX - 1 || y === sizeY - 1) {
          // Add windows to top wall
          // Right now every 3rd window idk why
          if (y === 0 && x > 1 && x < newRoom.length - 1 && x % 3 === 1) {
            row.push(new Window(newCoord));
          } else {
            // add Walls if not window
            row.push(new Wall(newCoord));
          }
        }
        // else place floor
        else {
          row.push(new Floor(newCoord));
        }
      }
      newRoom.push(row);
    }

    // and a door in a random location on one of the lower walls
    const wallRNG = seededRandom(this.RoomCfg.seed + 1);
    if (wallRNG > 0.6666) {
      // Left wall
      const pos = Math.floor(seededRandom(this.RoomCfg.seed * 1.45) * (newRoom.length - 2) + 1); // Should get a random number from 1 to newRoom.length - 1
      newRoom[newRoom[0].length - 1][pos];
    } else if (wallRNG <= 0.6666 && wallRNG > 0.3333) {
      // Right wall
      const pos = Math.floor(seededRandom(this.RoomCfg.seed * 1.45) * (newRoom.length - 2) + 1); // Should get a random number from 1 to newRoom.length - 1
      newRoom[newRoom[0].length - 1][pos];
    } else {
      // Bottom wall
      const pos = Math.floor(seededRandom(this.RoomCfg.seed * 1.45) * (newRoom[0].length - 2) + 1);
      newRoom[pos][newRoom.length - 1];
    }

    return newRoom;
  }

  generateRoomElements() {
    // add tables
    for (let i = 0; i < this.RoomCfg.numTables; i++) {
      const newCoord: Coordinate = this.findRandomEmptySpaceNoEdges();
      this.RoomArray[newCoord.y][newCoord.x] = new Table(newCoord);
    }
    // add rug
    for (let i = 0; i < this.RoomCfg.numRugs; i++) {
      const newCoord: Coordinate = this.findRandomEmptySpace();
      this.RoomArray[newCoord.y][newCoord.x] = new Rug(newCoord);
    }
    // add chairs
    for (let i = 0; i < this.RoomCfg.numChairs; i++) {
      // first, try to add chair next to a table
      const tableLocArr = this.findAllTables();
      // choose a random table to add a chair next to
      const tableLoc = tableLocArr[Math.floor(seededRandom(this.RoomCfg.seed * this.RoomCfg.roomSizeY * 3 + 5) * tableLocArr.length)];

      if (tableLoc !== null) {
        const newCoord = this.findRandomEmptyAdjacentSpace(tableLoc);
        if (newCoord !== null) {
          this.RoomArray[newCoord.y][newCoord.x] = new Chair(newCoord);
        } else {
          // there's a table but no available spaces around it, have to copy some logic here
          const newCoord: Coordinate = this.findRandomEmptySpaceNoEdges();
          this.RoomArray[newCoord.y][newCoord.x] = new Chair(newCoord);
        }
      } else {
        // if there are no tables or spaces by tables available, add a chair in a random location
        const newCoord: Coordinate = this.findRandomEmptySpaceNoEdges();
        this.RoomArray[newCoord.y][newCoord.x] = new Chair(newCoord);
      }
    }
  }

  getTileAtCoordinate(x: number, y: number): iTile | null {
    try {
      return this.RoomArray[x][y];
    } catch (e) {
      console.error(`Error in function getTileAtCoordinate: ${e}`);
    }
    return null;
  }

  findRandomEmptyAdjacentSpace(coord: Coordinate): Coordinate | null {
    let emptyAdjacentCoordinateList: Coordinate[] = [];

    for (let x = coord.x - 1; x <= coord.x + 1; x++) {
      for (let y = coord.y - 1; y <= coord.y + 1; y++) {
        // check if coord is within bounds
        if (y >= 0 && y < this.RoomArray.length && x >= 0 && x < this.RoomArray[0].length) {
          if (this.RoomArray[y][x] instanceof Floor) {
            emptyAdjacentCoordinateList.push(new Coordinate(x, y));
          }
        }
      }
    }

    if (emptyAdjacentCoordinateList.length === 0) {
      return null;
    }

    return emptyAdjacentCoordinateList[Math.floor(seededRandom(this.RoomCfg.seed + this.RoomCfg.numStudents * 2) * emptyAdjacentCoordinateList.length)];
  }

  findTable(): Coordinate | null {
    for (let y = 0; y < this.RoomArray.length; y++) {
      for (let x = 0; x < this.RoomArray[0].length; x++) {
        if (this.RoomArray[y][x] instanceof Table) {
          return new Coordinate(x, y);
        }
      }
    }
    return null;
  }

  findAllTables(): Coordinate[] {
    let tableCoordList: Coordinate[] = [];
    for (let y = 0; y < this.RoomArray.length; y++) {
      for (let x = 0; x < this.RoomArray[0].length; x++) {
        if (this.RoomArray[y][x] instanceof Table) {
          tableCoordList.push(new Coordinate(x, y));
        }
      }
    }
    return tableCoordList;
  }

  findChair(): Coordinate | null {
    for (let y = 0; y < this.RoomArray.length; y++) {
      for (let x = 0; x < this.RoomArray[0].length; x++) {
        if (this.RoomArray[y][x] instanceof Chair) {
          return new Coordinate(x, y);
        }
      }
    }
    return null;
  }

  findAllChairs(): Coordinate[] {
    let chairCoordList: Coordinate[] = [];
    for (let y = 0; y < this.RoomArray.length; y++) {
      for (let x = 0; x < this.RoomArray[0].length; x++) {
        if (this.RoomArray[y][x] instanceof Chair) {
          chairCoordList.push(new Coordinate(x, y));
        }
      }
    }
    return chairCoordList;
  }

  findRug(): Coordinate | null {
    for (let y = 0; y < this.RoomArray.length; y++) {
      for (let x = 0; x < this.RoomArray[0].length; x++) {
        if (this.RoomArray[y][x] instanceof Rug) {
          return new Coordinate(x, y);
        }
      }
    }
    return null;
  }

  findAllRugs(): Coordinate[] {
    let rugCoordList: Coordinate[] = [];
    for (let y = 0; y < this.RoomArray.length; y++) {
      for (let x = 0; x < this.RoomArray[0].length; x++) {
        if (this.RoomArray[y][x] instanceof Rug) {
          rugCoordList.push(new Coordinate(x, y));
        }
      }
    }
    return rugCoordList;
  }

  findRandomEmptySpace(): Coordinate {
    // Looks for empty floor spaces and gets their coordinates
    // a random coordinate is picked from this list of coordinates
    let coordinateList: Coordinate[] = [];
    // we want to get all positions where there is floor
    for (const row of this.RoomArray) {
      for (const tile of row) {
        if (tile instanceof Floor) {
          coordinateList.push(tile.pos);
        }
      }
    }
    if (coordinateList.length === 0) {
      // There were no empty spaces found
      throw new Error("Error, findRandomEmptySpace returned null, most likely room is too small to accomodate all sprites.");
    }

    return coordinateList[Math.floor(seededRandom(this.RoomCfg.seed) * coordinateList.length)];
  }

  findRandomEmptySpaceNoEdges(): Coordinate {
    // same as findRandomEmptySpace but no coordinates against the wall
    let coordinateList: Coordinate[] = [];
    // we want to get all positions where there is floor
    for (const row of this.RoomArray) {
      for (const tile of row) {
        if (tile instanceof Floor) {
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

    return coordinateList[Math.floor(seededRandom(this.RoomCfg.seed) * coordinateList.length)];
  }

  findRandomEmptySpaceForSprite(spriteList: iSprite[]): Coordinate {
    // spriteList contains sprites and their positions in the room, so
    // the room doesn't count these spaces as empty

    let coordinateList: Coordinate[] = [];
    // we want to get all positions where there is floor
    for (const row of this.RoomArray) {
      for (const tile of row) {
        if (tile instanceof Floor) {
          let isEmpty: boolean = true;
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

    return coordinateList[Math.floor(seededRandom(this.RoomCfg.seed * this.RoomCfg.roomSizeX + 1) * coordinateList.length)];
  }

  toString(): string {
    let str: string = "\n";

    for (let y = 0; y < this.RoomArray.length; y++) {
      for (let x = 0; x < this.RoomArray[0].length; x++) {
        str += this.RoomArray[y][x];
      }
      str += "\n";
    }

    return str;
  }

  toStringArray() {
    let strArr: string[] = [];

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
    let roomArr: string[][] = [];

    for (let y = 0; y < this.RoomArray.length; y++) {
      let row: string[] = [];
      for (let x = 0; x < this.RoomArray[0].length; x++) {
        row.push(this.RoomArray[y][x].toString());
      }
      roomArr.push(row);
    }

    return roomArr;
  }

  render(): void {
    // Prints room to console
    console.log(this.toString());
  }
}

export default Room;

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
