import Coordinate from "../Navigation/Coordinate";
import classroomLocation from "../Navigation/Locations";
import Mood from "./Emotions/Moods";

class Student {
  name: string;
  pos: Coordinate;
  mood: Mood;
  heading: Coordinate | null;
  currentDescription: string;
  importance: number; 

  constructor(id_: number, initPos_: Coordinate) {
    this.name = `Student${id_.toString()}`;
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
    return `S`;
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

export default Student;