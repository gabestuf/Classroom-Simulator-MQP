import Room from "./Room/Room";
import ClassroomConfig from "./Config/CONFIG";
import iSprite from "./Sprites/iSprite";
import Coordinate from "./Navigation/Coordinate";
import Student from "./Sprites/Student";
import Teacher from "./Sprites/Teacher";
import ClassroomEvent from "./Events/ClassroomEvent";
import shortestPath from "./Navigation/BFS";
class Classroom {
  room: Room;
  spriteList: iSprite[] = [];
  config: ClassroomConfig;

  constructor(config_: ClassroomConfig) {
    this.config = config_;
    this.room = new Room(config_);
    this.spriteList = this.initSpriteList(config_.numStudents, config_.numTeachers);
  }

  getStudentList(): Student[] {
    let studentList: Student[] = [];
    for (const sprite of this.spriteList) {
      if (sprite instanceof Student) {
        studentList.push(sprite);
      }
    }
    return studentList;
  }

  getTeacherList(): Teacher[] {
    let studentList: Teacher[] = [];
    for (const sprite of this.spriteList) {
      if (sprite instanceof Teacher) {
        studentList.push(sprite);
      }
    }
    return studentList;
  }

  applyEvent(event: ClassroomEvent): Classroom[] {
    // This is the money function

    let classroomList: Classroom[] = [];

    // Update sprites from Event Spritelist
    /* 
        An event has a list of sprites
        For each sprite of the eventSpriteList, 
            find the sprite of classroom.spriteList where the ID's match. 
            update classroom sprite with the new data
        */
    for (const eventSprite of event.spriteList) {
      let hasMatch: boolean = false;
      for (const sprite of this.spriteList) {
        if (eventSprite.name === sprite.name) {
          // If there's a match, set sprite data to eventSprite data
          sprite.currentDescription = eventSprite.currentDescription;
          // This line is for BFS, comment out if not using BFS
          sprite.heading = eventSprite.heading;
          // This if statement is for no BFS, comment out if BFS
          // if (eventSprite.heading instanceof Coordinate) {
          //   sprite.pos = eventSprite.heading;
          // }
          sprite.mood = eventSprite.mood;
          hasMatch = true;
        }
      }
      if (!hasMatch) {
        // there is no match,
        throw new Error(`No Sprite with same ID in event and classroom. Event sprite ID: ${eventSprite.name}`);
      }
    }

    // run the event
    classroomList = [...classroomList, ...this.runEventWPathfinding()];

    return classroomList;
  }

  runEvent(): Classroom[] {
    for (const sprite of this.spriteList) {
      if (sprite.heading instanceof Coordinate) {
        // First check if sprite is already at its destination. If so, set heading === null
        if (sprite.heading.x === sprite.pos.x && sprite.heading.y === sprite.pos.y) {
          sprite.heading === null;
        }
        sprite.pos = sprite.heading;
        sprite.heading = null;
      }
    }

    return [this.clone()];
  }

  runEventWPathfinding(): Classroom[] {
    let classroomList: Classroom[] = [];
    // This function will loop until all sprites heading = null
    const checkStillMoving = (): boolean => {
      for (const sprite of this.spriteList) {
        if (sprite.heading !== null) {
          return true;
        }
      }
      return false;
    };

    let stillMoving: boolean = checkStillMoving();

    while (stillMoving) {
      stillMoving = false;
      // for each sprite, update position toward sprite.heading
      for (const sprite of this.spriteList) {
        if (sprite.heading instanceof Coordinate) {
          // First check if sprite is already at its destination. If so, set heading === null
          if (sprite.heading.x === sprite.pos.x && sprite.heading.y === sprite.pos.y) {
            sprite.heading === null;
          }
          const path = shortestPath(this.room, sprite.pos, sprite.heading);
          if (path.length === 0) {
            const errString = `There was no viable path for the sprite to get to its destination: Here is some info about what might have caused the error: \n This sprite: ${sprite}\n This room: ${this.room.toString()}`;
            throw new Error(errString);
          }
          // path is a list of coordinates.

          // UPDATE SPRITE LOCATION
          // first check if sprite has arrived
          if (path.length <= 1) {
            if (sprite.heading.x === path[0].x && sprite.heading.y === path[0].y) {
              // Sprite has arrived
              sprite.heading = null;
            }
          } else if (path.length > 1) {
            // a path is an array of coords, path[0] is sprite.pos and path[path.length - 1 is dest]
            sprite.pos = path[1];
            console.log(path[1]);
            stillMoving = true;
          }
        }
      }

      // save this instance of the classroom as a json
      classroomList.push(this.clone());
    }
    return classroomList;
  }

  initSpriteList(numStudents: number, numTeachers: number): iSprite[] {
    let openChairCoords: Coordinate[] = this.room.findAllChairs();
    // add new Students to spriteList

    let newSpriteList: iSprite[] = [];

    // add new Teachers
    for (let t = 1; t <= numTeachers; t++) {
      const randomCoordinate: Coordinate = this.room.findRandomEmptySpaceForSprite(newSpriteList);
      newSpriteList.push(new Teacher(t, randomCoordinate));
    }

    // Add new students
    for (let s = 1; s <= numStudents; s++) {
      // try to place student on chair first
      if (openChairCoords.length > 0) {
        const coord: Coordinate | undefined = openChairCoords.pop();
        if (coord !== undefined) {
          const student = new Student(s, coord);
          newSpriteList.push(student);
        }
      }
      // if no chair available, place randomly
      else {
        const randomCoordinate: Coordinate = this.room.findRandomEmptySpaceForSprite(newSpriteList);
        newSpriteList.push(new Student(s, randomCoordinate));
      }
    }

    return newSpriteList;
  }

  toJSON(eventName: string): ClassroomJSON {
    /* This is going to create a json object 
        example:
        {   
            room: [['w','w','w'], ['w','f','w'], ['w','w','w']],
            spriteList: [
                {
                    id: 4,
                    name: Student4,
                    pos: [3,4],
                    mood: 'happy',
                    description: 'drawing'
                }
            ]
        }
        */
    const classroomjson: ClassroomJSON = {
      currentEvent: eventName,
      spriteList: [...this.spriteList],
    };
    return classroomjson;
  }

  clone(): Classroom {
    const clone = new Classroom(this.config);
    clone.room = this.room;
    clone.spriteList = this.spriteList;
    return clone;
  }

  toStringArray(): string[][] {
    let strArr: string[][] = [...this.room.toJSON()];
    //TODO add sprites on top
    for (const sprite of this.spriteList) {
      strArr[sprite.pos.y][sprite.pos.x] = sprite.toString();
    }

    return strArr;
  }

  toString(): string {
    let str = "\n";
    let strArr = [...this.room.toStringArray()];
    //TODO add sprites on top
    for (const sprite of this.spriteList) {
      const rowStr = strArr[sprite.pos.y];
      strArr[sprite.pos.y] = rowStr.substring(0, sprite.pos.x) + sprite.toString() + rowStr.substring(sprite.pos.x + 1);
    }
    for (const string of strArr) {
      str += string + "\n";
    }
    return str;
  }

  render(): void {
    // prints classroom to console
    console.log(this.toString());
  }
}

export interface ClassroomJSON {
  currentEvent: string;
  spriteList: iSprite[];
}

export default Classroom;
