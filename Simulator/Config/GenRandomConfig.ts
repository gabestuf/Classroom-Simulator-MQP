import seededRandom from "../Helper Functions/GenerateRandomNumber";
import ClassroomConfig from "./CONFIG";

function genRandomConfig(seed = Math.floor(Math.random() * 10000)) {
  const numS = Math.floor(seededRandom(seed * 6) * 4) + 2;

  return new ClassroomConfig({
    roomSizeX: Math.floor(seededRandom(seed * 2) * 10) + 7,
    roomSizeY: Math.floor(seededRandom(seed + 3) * 10) + 7,
    numStudents: numS,
    numTeachers: Math.floor(seededRandom(seed * 1.5) + 1), // change to 2 if we want max 2 teachers
    numChairs: numS + 1,
    numTables: Math.floor(seededRandom(seed * 7) * 3) + 1,
    numRugs: Math.floor(seededRandom(seed * 5) * 2) + 1,
    seed: seed,
  });
}

export default genRandomConfig;
