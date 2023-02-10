import Room from "./../../Room/Room";
import { describe, expect, test } from "@jest/globals";
import ClassroomConfig from "../../Config/CONFIG";

// "Testing the functions of the class 'Room'"
describe("Testing the functions of the class 'Room'", () => {
  const testCFG = new ClassroomConfig({
    roomSizeX: 5,
    roomSizeY: 5,
    numStudents: 1,
    numTeachers: 1,
    numChairs: 0,
    numTables: 0,
    numRugs: 0,
    seed: 1,
  });

  test("generateRoomFloor(sizeX, sizeY): should return a 2d array (y,x) of a room with walls and floor", () => {
    const room = new Room(testCFG);
    room.generateRoomFloor(testCFG.roomSizeX, testCFG.roomSizeY);
    expect(room.toString()).toBe("\nwwwww\nwfffw\nwfffw\nwfffw\nwwwww\n");
  });

  test("testing generating a room of the correct size Y", function () {
    const room = new Room(testCFG);
    expect(room.RoomArray.length).toBe(5);
  });
});
