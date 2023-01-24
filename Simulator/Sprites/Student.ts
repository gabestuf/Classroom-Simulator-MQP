import Coordinate from "../Navigation/Coordinate";
import classroomLocation from "../Navigation/Locations";
import Room from "../Room/Room";
import Mood from "./Emotions/Moods";

class Student {
  name: string;
  pos: Coordinate;
  mood: Mood;
  heading: Coordinate | null;
  currentDescription: string;

  constructor(id_: number, initPos_: Coordinate) {
    this.name = `Student${id_.toString()}`;
    this.pos = initPos_;
    this.heading = null;
    this.mood = new Mood("neutral");
    this.currentDescription = "";
  }

  moveTowardHeading(room: Room) {
    // BFS ->
    /* 
        this.pos = bfs(2dArray, startPosition, endPosition) -> Array of Coordinates
        */
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
