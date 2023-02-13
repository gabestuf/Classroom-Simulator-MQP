"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bookshelf = exports.Window = exports.Door = exports.Chair = exports.Table = exports.Floor = exports.Rug = exports.Wall = void 0;
class Floor {
    constructor(pos_) {
        this.id = "f";
        this.pos = pos_;
    }
    toString() {
        return this.id;
    }
}
exports.Floor = Floor;
class Rug {
    constructor(pos_) {
        this.id = "r";
        this.pos = pos_;
    }
    toString() {
        return this.id;
    }
}
exports.Rug = Rug;
class Wall {
    constructor(pos_) {
        this.id = "w";
        this.pos = pos_;
    }
    toString() {
        return this.id;
    }
}
exports.Wall = Wall;
class Table {
    constructor(pos_) {
        this.id = "t";
        this.pos = pos_;
    }
    toString() {
        return this.id;
    }
}
exports.Table = Table;
class Chair {
    constructor(pos_) {
        this.id = "c";
        this.pos = pos_;
    }
    toString() {
        return this.id;
    }
}
exports.Chair = Chair;
class Door {
    constructor(pos_) {
        this.id = "d";
        this.pos = pos_;
    }
    toString() {
        return this.id;
    }
}
exports.Door = Door;
class Window {
    constructor(pos_) {
        this.id = "i";
        this.pos = pos_;
    }
    toString() {
        return this.id;
    }
}
exports.Window = Window;
class Bookshelf {
    constructor(pos_) {
        this.id = "b";
        this.pos = pos_;
    }
    toString() {
        return this.id;
    }
}
exports.Bookshelf = Bookshelf;
