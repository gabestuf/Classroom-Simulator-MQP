interface iConfig {
  seed: number;
  roomSizeX: number;
  roomSizeY: number;
  numStudents: number;
  numTeachers: number;
  numChairs: number;
  numTables: number;
  numRugs: number;
  numBookshelves: number;
}

class ClassroomConfig implements iConfig {
  seed: number;
  roomSizeX: number;
  roomSizeY: number;
  numStudents: number;
  numTeachers: number;
  numChairs: number;
  numTables: number;
  numRugs: number;
  numBookshelves: number;

  constructor(JSONConfig: iConfig) {
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

export default ClassroomConfig;
