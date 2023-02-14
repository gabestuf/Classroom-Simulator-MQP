import seededRandom from "../Helper Functions/GenerateRandomNumber";
import ClassroomConfig from "./CONFIG";

function genRandomConfig(seed = Math.floor(Math.random() * 10000)) {
  const numS = Math.floor(seededRandom(seed * 6) * 4) + 2;

  return new ClassroomConfig({
    roomSizeX: Math.floor(seededRandom(seed * 2) * 10) + 2,
    roomSizeY: Math.floor(seededRandom(seed + 3) * 10) + 2,
    numStudents: numS,
    numTeachers: Math.floor(seededRandom(seed * 1.5) * 1) + 1,
    numChairs: numS + 1,
    numTables: Math.floor(seededRandom(seed * 7) * 3) + 1,
    numRugs: Math.floor(seededRandom(seed * 5) * 2) + 1,
    seed: seed,
  });

  // return new ClassroomConfig({
  //   roomSizeX: 6,
  //   roomSizeY: 7,
  //   numStudents: 2,
  //   numTeachers: 1,
  //   numChairs: 4,
  //   numTables: 1,
  //   numRugs: 1,
  //   seed: 1,
  // });
}

export default genRandomConfig;
