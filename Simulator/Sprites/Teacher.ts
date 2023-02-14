import Coordinate from "../Navigation/Coordinate";
import classroomLocation from "../Navigation/Locations";
import Room from "../Room/Room";
import Mood from "./Emotions/Moods";

class Teacher {
  name: string;
  pos: Coordinate;
  mood: Mood;
  currentDescription: string;
  heading: Coordinate | null;
  importance: number; 

  constructor(id_: number, initPos_: Coordinate) {
    this.name = `Teacher${id_.toString()}`;
    this.pos = initPos_;
    this.heading = null;
    this.mood = new Mood("neutral");
    this.currentDescription = "";
    this.importance = 0; 
  }

  updateHeadingByLocation(newLoc: classroomLocation) {
    this.heading = newLoc.chooseRandomPosition();
  }

  toString() {
    return `T`;
  }

  toJSON() {
    const newjson = {
      name: this.name,
      pos: [this.pos.x, this.pos.y],
      mood: this.mood.name,
      description: this.currentDescription,
    };
    return newjson;
  }
}

export default Teacher;
