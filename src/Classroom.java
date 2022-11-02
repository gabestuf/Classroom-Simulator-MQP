import org.json.JSONObject;
import java.util.ArrayList;
import java.util.LinkedList;

public class Classroom {

    Room room;
    int roomSizeX;
    int roomSizeY;
    JSONObject config;
    ArrayList<Sprite> spriteList;

    public Classroom (JSONObject config)  {
        this.config = config;

        this.roomSizeX = config.getInt("RoomSizeX");
        this.roomSizeY = config.getInt("RoomSizeY");

        this.spriteList = initSprites(config.getInt("numTeachers"), config.getInt("numStudents"));

        init();
    }

    public ArrayList<Sprite> initSprites(int numTeachers, int numStudents) {
        ArrayList<Sprite> s = new ArrayList<>();
        // INIT TEACHERS
        for (int i = 0; i < numTeachers; i++) {
            JSONObject c = new JSONObject();
            c.put("role", 1); // 1 for teacher
            String id = "Teacher" + (i+1);
            c.put("id", id);
            s.add(new Sprite(c));
        }
        // INIT STUDENTS
        for (int i = 0; i < numStudents; i++) {
            JSONObject c = new JSONObject();
            c.put("role", 0); // 0 for student
            String id = "Student" + (i+1);
            c.put("id", id);
            s.add(new Sprite(c));
        }
        return s;
    }

    public void addSprite (JSONObject config) {
        this.spriteList.add(new Sprite(config));
    }

    public void init() {
        // creates a new room for the classroom
        this.room = new Room(this.config);

    }

    public void renderRoom() {
        // Might want to return this as a String if we need to print it as part of a log
        System.out.println("Render of Room: ");
        for(int i = 0; i < this.room.sizeX; i++) {
            String row = "";
            for(int j = 0; j < this.room.sizeY; j++) {
                row = row + this.room.getLayout()[i][j] + " ";
            }
            System.out.println(row);
        }
    }

    public void addTable() {
        LinkedList<Integer> availSpaces = new LinkedList<>();
        Integer counter = 0;
        for (int x = 0; x < this.roomSizeX; x++) {
            for (int y = 0; y < this.roomSizeY; y++) {
                boolean spaceAvailable = true;
                if (x >= 2 && x < this.roomSizeX - 2 && y >= 2 && y < this.roomSizeY - 2) { // out of bounds detection, also -2 because of walls and it's a 3x3 thing. If a 1x1, do -1 instead of 2 and no need for inner loops
                    // checks surrounding tiles
                    for (int x0 = x - 1; x0 <= x+1; x0++) {
                        for (int y0 = y - 1; y0 <= y+1; y0++) {

                            if (this.room.getLayout()[x0][y0] != 'x') {spaceAvailable = false;}
                        }
                    }
                } else {
                    spaceAvailable = false;
                }
                if (spaceAvailable) {
                    availSpaces.add(counter);
                }
                counter++;
            }
        }
        // pick a space from the indexes available

        if (availSpaces.size() == 0) {
            System.out.println("NO locations for table");
            return;
        }

        int xCoord = availSpaces.get((int) Math.floor(Math.random() * availSpaces.size())) % this.roomSizeX;
        int yCoord = availSpaces.get((int) Math.floor(Math.random() * availSpaces.size())) / this.roomSizeY; // integer division!! floors naturally
        this.room.addTable(xCoord, yCoord);
    }

    public void addTable(int x, int y) {
        this.room.addTable(x,y);
    }

    public void addChair(int x,int y) { // TODO <- this for the other add functions
        this.room.addChair(x,y);
    }


    /*
    *  Look at addTable() if wondering about collision handling
    *
    * */

}