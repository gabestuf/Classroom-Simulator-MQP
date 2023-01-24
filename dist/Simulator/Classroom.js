"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Room_1 = __importDefault(require("./Room/Room"));
const Coordinate_1 = __importDefault(require("./Navigation/Coordinate"));
const Student_1 = __importDefault(require("./Sprites/Student"));
const Teacher_1 = __importDefault(require("./Sprites/Teacher"));
const BFS_1 = __importDefault(require("./Navigation/BFS"));
class Classroom {
    constructor(config_) {
        this.spriteList = [];
        this.config = config_;
        this.room = new Room_1.default(config_);
        this.spriteList = this.initSpriteList(config_.numStudents, config_.numTeachers);
    }
    getStudentList() {
        let studentList = [];
        for (const sprite of this.spriteList) {
            if (sprite instanceof Student_1.default) {
                studentList.push(sprite);
            }
        }
        return studentList;
    }
    getTeacherList() {
        let studentList = [];
        for (const sprite of this.spriteList) {
            if (sprite instanceof Teacher_1.default) {
                studentList.push(sprite);
            }
        }
        return studentList;
    }
    applyEvent(event) {
        // This is the money function
        let classroomList = [];
        // Update sprites from Event Spritelist
        /*
            An event has a list of sprites
            For each sprite of the eventSpriteList,
                find the sprite of classroom.spriteList where the ID's match.
                update classroom sprite with the new data
            */
        for (const eventSprite of event.spriteList) {
            for (const sprite of this.spriteList) {
                if (eventSprite.name === sprite.name) {
                    // If there's a match, set sprite data to eventSprite data
                    sprite.currentDescription = eventSprite.currentDescription;
                    sprite.heading = eventSprite.heading;
                    sprite.mood = eventSprite.mood;
                }
                // else {
                //     // there is no match,
                //     throw new Error(`No Sprite with same ID in event and classroom. Event sprite ID: ${eventSprite.name}, classroom sprite ID: ${sprite.name} `)
                // }
            }
        }
        // Save initial classroom
        classroomList.push(this.clone());
        // run the event
        classroomList = [...classroomList, ...this.runEvent()];
        return classroomList;
    }
    runEvent() {
        let classroomList = [];
        // This function will loop until all sprites heading = null
        const checkStillMoving = () => {
            for (const sprite of this.spriteList) {
                if (sprite.heading !== null) {
                    return true;
                }
            }
            return false;
        };
        let stillMoving = checkStillMoving();
        while (stillMoving) {
            stillMoving = false;
            // for each sprite, update position toward sprite.heading
            for (const sprite of this.spriteList) {
                if (sprite.heading instanceof Coordinate_1.default) {
                    const path = (0, BFS_1.default)(this.room, sprite.pos, sprite.heading);
                    if (path.length === 0) {
                        throw new Error("There was no viable path for the sprite to get to its destination");
                    }
                    // path is a list of coordinates.
                    // UPDATE SPRITE LOCATION
                    // first check if sprite has arrived
                    if (path.length === 1) {
                        if (sprite.heading.x === path[0].x && sprite.heading.y === path[0].y) {
                            // He has arrived
                            sprite.heading = null;
                        }
                    }
                    else if (path.length > 1) {
                        // a path is an array of coords, path[0] is sprite.pos and path[path.length - 1 is dest]
                        sprite.pos = path[1];
                        stillMoving = true;
                    }
                }
            }
            // save this instance of the classroom as a json
            classroomList.push(this.clone());
        }
        return classroomList;
    }
    initSpriteList(numStudents, numTeachers) {
        let openChairCoords = this.room.findAllChairs();
        // add new Students to spriteList
        let newSpriteList = [];
        // add new Teachers
        for (let t = 1; t <= numTeachers; t++) {
            const randomCoordinate = this.room.findRandomEmptySpaceForSprite(newSpriteList);
            newSpriteList.push(new Teacher_1.default(t, randomCoordinate));
        }
        // Add new students
        for (let s = 1; s <= numStudents; s++) {
            // try to place student on chair first
            if (openChairCoords.length > 0) {
                const coord = openChairCoords.pop();
                if (coord !== undefined) {
                    const student = new Student_1.default(s, coord);
                    newSpriteList.push(student);
                }
            }
            // if no chair available, place randomly
            else {
                const randomCoordinate = this.room.findRandomEmptySpaceForSprite(newSpriteList);
                newSpriteList.push(new Student_1.default(s, randomCoordinate));
            }
        }
        return newSpriteList;
    }
    toJSON(eventName) {
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
        const classroomjson = {
            currentEvent: eventName,
            spriteList: [...this.spriteList],
        };
        return classroomjson;
    }
    clone() {
        const clone = new Classroom(this.config);
        clone.room = this.room;
        clone.spriteList = this.spriteList;
        return clone;
    }
    toStringArray() {
        let strArr = [...this.room.toJSON()];
        //TODO add sprites on top
        for (const sprite of this.spriteList) {
            strArr[sprite.pos.y][sprite.pos.x] = sprite.toString();
        }
        return strArr;
    }
    toString() {
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
    render() {
        // prints classroom to console
        console.log(this.toString());
    }
}
exports.default = Classroom;
