import Coordinate from "../Navigation/Coordinate";
import iTile from "./iTile";

class Floor implements iTile {
  id: string;
  pos: Coordinate;
  constructor(pos_: Coordinate) {
    this.id = "f";
    this.pos = pos_;
  }

  toString(): string {
    return this.id;
  }
}

class Rug implements iTile {
  id: string;
  pos: Coordinate;

  constructor(pos_: Coordinate) {
    this.id = "r";
    this.pos = pos_;
  }

  toString(): string {
    return this.id;
  }
}

class Wall implements iTile {
  id: string;
  pos: Coordinate;

  constructor(pos_: Coordinate) {
    this.id = "w";
    this.pos = pos_;
  }

  toString(): string {
    return this.id;
  }
}

class Table implements iTile {
  id: string;
  pos: Coordinate;

  constructor(pos_: Coordinate) {
    this.id = "t";
    this.pos = pos_;
  }

  toString(): string {
    return this.id;
  }
}

class Chair implements iTile {
  id: string;
  pos: Coordinate;

  constructor(pos_: Coordinate) {
    this.id = "c";
    this.pos = pos_;
  }

  toString(): string {
    return this.id;
  }
}

class Door implements iTile {
  id: string;
  pos: Coordinate;

  constructor(pos_: Coordinate) {
    this.id = "d";
    this.pos = pos_;
  }

  toString(): string {
    return this.id;
  }
}

class Window implements iTile {
  id: string;
  pos: Coordinate;

  constructor(pos_: Coordinate) {
    this.id = "i";
    this.pos = pos_;
  }

  toString(): string {
    return this.id;
  }
}

class Bookshelf implements iTile {
  id: string;
  pos: Coordinate;

  constructor(pos_: Coordinate) {
    this.id = "b";
    this.pos = pos_;
  }

  toString(): string {
    return this.id;
  }
}

export { Wall, Rug, Floor, Table, Chair, Door, Window, Bookshelf };
