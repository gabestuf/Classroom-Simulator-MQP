import iTile from "../Room/iTile";
import Room from "../Room/Room";
import { Chair, Floor, Rug } from "../Room/Tiles";
import Coordinate from "./Coordinate";

const shortestPath = (room: Room, startPos: Coordinate, endPos: Coordinate): Coordinate[] => {
  // check if start and end path are the same
  if (startPos.x === endPos.x && startPos.y === endPos.y) {
    return [new Coordinate(endPos.x, endPos.y)];
  }

  let path: Coordinate[] = [];

  // check if startPos is valid
  if (!(room.RoomArray[startPos.y][startPos.x] instanceof Floor) && !(room.RoomArray[startPos.y][startPos.x] instanceof Rug) && !(room.RoomArray[startPos.y][startPos.x] instanceof Chair)) {
    console.error("No available path, start position invalid");
    return [];
  }
  // check if endPos is valid
  if (!(room.RoomArray[endPos.y][endPos.x] instanceof Floor || room.RoomArray[endPos.y][endPos.x] instanceof Rug || room.RoomArray[endPos.y][endPos.x] instanceof Chair)) {
    console.error("No available path, end position is not valid");
    return [];
  }

  const p = bfs(room, startPos, endPos);

  if (p.length === 0) {
    console.error("No available path");
  }

  // convert path into array of Coordinates
  for (const numberArr of p) {
    path.push(new Coordinate(numberArr[0], numberArr[1]));
  }
  return path;
};

function bfs(room: Room, startPos: Coordinate, endPos: Coordinate) {
  /* 
    Init 2d array 
    simplify roomArray into navigatable tiles and non-navigatable tiles
    floor & rug are navigatable, everything else is not

    convert it to a number array
    0 is walkable
    1 is not
    */

  const start = [startPos.x, startPos.y];
  const end = [endPos.x, endPos.y];

  const grid: number[][] = convertRoomArray(room.RoomArray);

  // // TODO COMMENT OUT, THIS IS FOR TESTING
  // // LOGGING grid
  // room.render()
  // let str = ""
  // for (const row of grid) {
  //     str += row + "\n"
  // }
  // console.log(str)
  // y,x
  // console.log(grid[5][2])

  // Simulate a queue by an array of coordinates
  // add to queue by doing queue = [...newCoord, ...queue]
  // or queue.unshift(newCoord)
  // remove from queue with queue.pop()

  let queue: number[][] = [];
  let visited = new Set<number[]>();
  let prev = new Map<number[], number[]>();

  queue.push(start);
  visited.add(start);

  // While the queue is not empty
  while (queue.length > 0) {
    // get the next node
    let node = queue.pop();
    // Typescript type check
    if (node === undefined) {
      throw new Error("node is undefined");
    }

    // Check if end position is reached, if so, we can reconstruct the path and return it
    if (node[0] === end[0] && node[1] === end[1]) {
      let path: number[][] = [];
      while (node !== null && node !== undefined) {
        path.unshift(node);
        node = prev.get(node);
      }
      return path;
    }

    // Otherwise, visit the node's neighbors
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        // Directly adjacent to current node
        // Not diagonnaly, remove this if you want diagonally
        if (Math.abs(i) === Math.abs(j)) {
          continue;
        }

        // Calc coordinates of neighbor
        let x = node[0] + i;
        let y = node[1] + j;

        // Make sure coordinates are in bounds
        if (x < 0 || y < 0 || x >= grid.length || y >= grid[0].length) {
          continue;
        }

        // make sure only visiting viable nodes (0)
        if (grid[x][y] === 1) {
          continue;
        }

        // Create an array to represent the coordinates of the neighbor
        let neighbor: number[] = [x, y];
        // Make sure we haven't already visited this node
        if (visited.has(neighbor)) {
          continue;
        }

        // Add neighbor to queue, mark it as visited, record current node
        queue.unshift(neighbor);
        visited.add(neighbor);
        prev.set(neighbor, node);
      }
    }
  }
  // If we reach this point, unable to find path
  return [];
}

function convertRoomArray(roomArr: Array<Array<iTile>>): number[][] {
  let arr: number[][] = [];
  if (roomArr.length === 0) {
    throw new Error("This room is empty.");
  }

  for (let y = 0; y < roomArr.length; y++) {
    const row: number[] = [];
    for (let x = 0; x < roomArr[0].length; x++) {
      // TODO For now, sprites can walk through chairs
      if (roomArr[y][x] instanceof Floor || roomArr[y][x] instanceof Rug || roomArr[y][x] instanceof Chair) {
        row.push(0);
      } else {
        row.push(1);
      }
    }
    arr.push(row);
  }
  const newArr = transpose(arr);

  return newArr;
}

function transpose(matrix: number[][]) {
  const rows = matrix.length,
    cols = matrix[0].length;
  const grid = [];
  for (let j = 0; j < cols; j++) {
    grid[j] = Array(rows);
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[j][i] = matrix[i][j];
    }
  }
  return grid;
}

export default shortestPath;
