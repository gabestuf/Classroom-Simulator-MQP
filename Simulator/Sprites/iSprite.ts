import Coordinate from "../Navigation/Coordinate";
import classroomLocation from "../Navigation/Locations";
import Mood from "./Emotions/Moods";

interface iSprite {
  name: string;
  pos: Coordinate;
  mood: Mood;
  heading: Coordinate | null;
  currentDescription: string;
  toString: () => string;
  toJSON: () => {
    name: string;
    pos: number[];
    mood: string;
    description: string;
  };
  updateHeadingByLocation: (newLoc: classroomLocation) => void;
}

export default iSprite;
