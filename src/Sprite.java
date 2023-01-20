import org.json.JSONObject;

import java.util.ArrayList;

class Sprite {
    int role; //0 for student , 1 for teacher

    // TODO posX & poxY will eventually need to be initiated somewhere with collision checks
    int posX = 0;
    int posY = 0;
    String id;
    String mood;
    String description;
    JSONObject config;
    boolean isBusy;
    Classroom classroom;
    ArrayList<Integer> heading =  new ArrayList<Integer>(2);

    public Sprite(JSONObject config, Classroom c) {
        this.config = config;
        this.role = config.getInt("role");
        this.id = config.getString("id");
        this.mood = "content";
        this.description = "idle";
        this.posX = config.getInt("posX");
        this.posY = config.getInt("posY");
    }

    public boolean setHeading(int x, int y) {
        // boolean returned is true if player has arrived, false if still moving

        if (x == this.posX && y == this.posY) {
            this.heading = null;
            return true;
        }
        this.heading = new ArrayList<Integer>();
        this.heading.add(x);
        this.heading.add(y);
        return false;
    }

    public boolean setPosition(int x, int y) {
        try {
            if (x > 0 && x < config.getInt("RoomSizeX") && y > 0 && y < config.getInt("RoomSizeY")) {
                // TODO collision detection, maybe needs to be done at a higher level
                this.posX = x;
                this.posY = y;
                return true;
            }
        } catch (
                Exception e) {
            System.out.println(e);
        }
        return false;
    }


    public boolean moveToward(int x, int y) {
        // s is a sprite. posX and posY are it's current position
        
        int[] startPosition = {this.posX, this.posY};
        int[] endPosition = {x, y};
        // If the current position == final position, sprite has arrived
        if (this.posX == x && this.posY == y) {
            this.heading = null;
            return true;
        }

        BFS bfs = new BFS();

        // get updated coordinates
        int[] nextCoordinates = bfs.shortestPath(this.classroom.room.getLayout(), startPosition, endPosition).get(0);

        this.setPosition(nextCoordinates[0], nextCoordinates[1]);

        return false;
    }

    // I think it overrides by default but just in case
    @Override
    public String toString() {
        return "" + this.id + " | location: (" + this.posX + "," + this.posY + ") | mood: " + this.mood + " | description: " + this.description;
    }

}


