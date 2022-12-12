import java.util.List;

public class Location {
    Room room;
    String locationName;
    List<int[]> coordinates;

    public Location(Room room) {
        this.room = room;
    }

    public void setLocation(String name) {
        this.locationName = name;
        // takes a string location and sets a list of x y coordinates that satisfy that location
        switch (name) {
            case "corner":
                int[] topLeft = {1, 1};
                int[] topRight = {room.sizeX - 2, 1};
                int[] bottomLeft = {1, room.sizeY - 2};
                int[] bottomRight = {room.sizeX - 2, room.sizeY - 2};

                coordinates.add(topLeft);
                coordinates.add(topRight);
                coordinates.add(bottomLeft);
                coordinates.add(bottomRight);
                break;
            case "wall":
                for (int x = 1; x < this.room.sizeX - 1; x++) {
                    for (int y = 1; y < this.room.sizeY - 1; y++) {
                        if (x == 1 || x == this.room.sizeX - 2) {
                            if (room.getLayout()[x][y] == 'f') {
                                int[] coordinate = {x, y};
                                coordinates.add(coordinate);
                            }
                        } else if (y == 1 || y == this.room.sizeY - 2) {
                            if (room.getLayout()[x][y] == 'f') {
                                int[] coordinate = {x,y};
                                coordinates.add(coordinate);
                            }
                        }
                    }
                }
            default:
                System.out.println("This thing does not have a location");
                break;
        }
    }

}
