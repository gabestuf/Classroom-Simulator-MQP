import java.io.FileInputStream;
import java.util.LinkedList;
import java.util.Properties;

public class Classroom {

    Room room;
    int roomSizeX;
    int roomSizeY;

    // init config
    Properties CONFIG = new Properties();
    final String configFilePath = "src/config.properties";


    public Classroom ()  {
        getConfig();
        this.roomSizeX = Integer.parseInt(this.CONFIG.getProperty("RoomSizeX"));
        this.roomSizeY = Integer.parseInt(this.CONFIG.getProperty("RoomSizeY"));
        init();

    }

    public void getConfig () {
        try {
            final FileInputStream propsInput = new FileInputStream(this.configFilePath);
            this.CONFIG.load(propsInput);
        } catch (Exception e) {
            System.out.println(e);
        }
    }

    public void init() {
        // creates a new room for the classroom
        this.room = new Room(this.roomSizeX,this.roomSizeY);

    }

    public void render() {
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

        System.out.println(availSpaces);
        if (availSpaces.size() == 0) {
            System.out.println("NO locations for table");
            return;
        }

        int xCoord = availSpaces.get((int) Math.floor(Math.random() * availSpaces.size())) % this.roomSizeX;
        int yCoord = (int) Math.floor(availSpaces.get((int) Math.floor(Math.random() * availSpaces.size())) / this.roomSizeY);
        System.out.println(xCoord);
        System.out.println(yCoord);
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
