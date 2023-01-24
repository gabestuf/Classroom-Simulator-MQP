import Coordinate from "../Navigation/Coordinate";

interface iTile {
    id: string
    pos: Coordinate
    toString: () => string 
}
export default iTile;