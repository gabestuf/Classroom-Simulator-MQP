import org.json.JSONObject;
import java.util.ArrayList;
import java.util.LinkedList;

public class Classroom {

    Room room; // Holds static room object data
    int roomSizeX;
    int roomSizeY;
    JSONObject config;
    ArrayList<Sprite> spriteList;
    ArrayList<Event> allEvents;

    public Classroom (JSONObject config)  {
        this.config = config;

        this.roomSizeX = config.getInt("RoomSizeX");
        this.roomSizeY = config.getInt("RoomSizeY");
        initRoom();
        this.spriteList = initSprites(config.getInt("numTeachers"), config.getInt("numStudents"));
    }

    public ArrayList<Sprite> initSprites(int numTeachers, int numStudents) {
        ArrayList<Sprite> s = new ArrayList<>();
        // INIT TEACHERS
        for (int i = 0; i < numTeachers; i++) {
            LinkedList<Integer> coords = this.room.findRandomEmptySpace(); // TODO Not sure how we want to init teacher and students

            int x = coords.get(0);
            int y = coords.get(1);
            JSONObject c = new JSONObject();
            c.put("role", 1); // 1 for teacher
            String id = "Teacher" + (i+1);
            c.put("id", id);
            c.put("posX", x);
            c.put("posY", y);
            s.add(new Sprite(c));
        }
        // INIT STUDENTS
        for (int i = 0; i < numStudents; i++) {
            LinkedList<Integer> coords = this.room.findRandomEmptySpace();
            int x = coords.get(0);
            int y = coords.get(1);
            JSONObject c = new JSONObject();
            c.put("role", 0); // 0 for student
            String id = "Student" + (i+1);
            c.put("id", id);
            c.put("posX", x);
            c.put("posY", y);
            s.add(new Sprite(c));
        }
        return s;
    }

    public void addSprite (JSONObject config) {
        this.spriteList.add(new Sprite(config));
    }

    public void initRoom() {
        // creates a new room for the classroom
        this.room = new Room(this.config);
        // Adds tables, then rugs, then chairs
        for (int i = 0; i < config.getInt("numTables"); i++) {
            // if it fails to add a table, don't add more tables
            if(!this.addTable()) break;
        }
        // rugs
        for (int i = 0; i < config.getInt("numRugs"); i++) {
            if(!this.addRug()) break;
        }
        // chairs
        for (int i = 0; i < config.getInt("numChairs"); i++) {
            if (!this.addChair()) break;
        }

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

    public boolean addTable() {
        LinkedList<LinkedList<Integer>> availSpaces = new LinkedList<>();

        Integer counter = 0;
        for (int x = 0; x < this.roomSizeX; x++) {
            for (int y = 0; y < this.roomSizeY; y++) {
                LinkedList<Integer> coords = new LinkedList<>();
                boolean spaceAvailable = true;
                if (x >= 2 && x < this.roomSizeX - 2 && y >= 2 && y < this.roomSizeY - 2) { // out of bounds detection, also -2 because of walls and it's a 3x3 thing. If a 1x1, do -1 instead of 2 and no need for inner loops
                    // checks surrounding tiles
                    for (int x0 = x - 1; x0 <= x+1; x0++) {
                        for (int y0 = y - 1; y0 <= y+1; y0++) {
                            if (this.room.getLayout()[x0][y0] != 'x') {spaceAvailable = false;}
                            coords.add(0, x);
                            coords.add(1, y);
                        }
                    }
                } else {
                    spaceAvailable = false;
                }
                if (spaceAvailable) {
                    availSpaces.add(coords);
                }
                counter++;
            }
        }
        // pick a space from the indexes available

        if (availSpaces.size() == 0) {
            System.out.println("NO locations for table");
            return false;
        }

        LinkedList<Integer> coord = availSpaces.get((int) Math.floor(Math.random() * availSpaces.size()));
        return this.room.addTable(coord.get(0), coord.get(1));
    }

    public boolean addChair() {
        LinkedList<LinkedList<Integer>> availSpaces = new LinkedList<>();

        for (int x = 0; x < this.roomSizeX; x++) {
            for (int y = 0; y < this.roomSizeY; y++) {
                LinkedList<Integer> coords = new LinkedList<>();
                boolean spaceAvailable = true;
                if (x >= 1 && x < this.roomSizeX - 1 && y >= 1 && y < this.roomSizeY - 1) { // out of bounds detection, also -1 because of walls
                    if (this.room.getLayout()[x][y] != 'x') {spaceAvailable = false;}
                    coords.add(0, x);
                    coords.add(1, y);
                } else {
                    spaceAvailable = false;
                }
                if (spaceAvailable) {
                    availSpaces.add(coords);
                }
            }
        }

        LinkedList<Integer> coord = availSpaces.get((int) Math.floor(Math.random() * availSpaces.size()));
        return this.room.addChair(coord.get(0), coord.get(1));
    }

    public boolean addRug() {
        LinkedList<LinkedList<Integer>> availSpaces = new LinkedList<>();

        for (int x = 0; x < this.roomSizeX; x++) {
            for (int y = 0; y < this.roomSizeY; y++) {
                LinkedList<Integer> coords = new LinkedList<>();
                boolean spaceAvailable = true;
                if (x >= 1 && x < this.roomSizeX - 1 && y >= 1 && y < this.roomSizeY - 1) { // out of bounds detection, also -2 because of walls and it's a 3x3 thing. If a 1x1, do -1 instead of 2 and no need for inner loops
                    if (this.room.getLayout()[x][y] != 'x') {spaceAvailable = false;}
                    coords.add(0, x);
                    coords.add(1, y);
                } else {
                    spaceAvailable = false;
                }
                if (spaceAvailable) {
                    availSpaces.add(coords);
                }
            }
        }

        LinkedList<Integer> coord = availSpaces.get((int) Math.floor(Math.random() * availSpaces.size()));
        return this.room.addRug(coord.get(0), coord.get(1));
    }

    //renders a room with println in console
    public void render(Room a) {
        System.out.println("Render of Room: ");
        for(int i = 0; i < a.sizeX; i++) {
            String row = "";
            for(int j = 0; j < a.sizeY; j++) {
                row = row + a.getLayout()[i][j] + " ";
            }
            System.out.println(row);
        }
    }

    public void generateEventList() {
        int numEvents = this.config.getInt("numEvents");
        JSONObject allEventsJSON = this.config.getJSONArray("STORYEVENTS").getJSONObject(0);
        ArrayList<Event> eventList;


    }
//    public void recursiveEvents(JSONObject eventsToPullFrom, ArrayList<Event> eventList, int numEvents) {
//        // Check to make sure eventList is not full, then pick a random event from eventsToPullFrom
//        if (eventList.size() < numEvents) {
//            eventsToPullFrom
//        }
//    }

    public void addRandomEvent() {

        for (String key : this.config.getJSONArray("STORYEVENTS").getJSONObject(0).keySet()) {
            System.out.println(key);
        }
    }

    public Event jsonToEvent(String eventName) {
        // JSONObject storyevents = this.config.getJSONArray("STORYEVENTS").getJSONObject(0);
        JSONObject event = this.config.getJSONArray("STORYEVENTS").getJSONObject(0).getJSONObject(eventName);
        return new Event(event, this.spriteList, this.config.getInt("numStudents"), this.config.getInt("numTeachers"));
//        for(String key : storyevents.keySet()) {
////          System.out.println(storyevents.getJSONObject(key));
//            Event e = new Event(storyevents.getJSONObject(key), this.spriteList, this.config.getInt("numStudents"), this.config.getInt("numTeachers"));
//
//        }

    }

}
