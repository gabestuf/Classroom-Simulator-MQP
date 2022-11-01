import java.util.Properties;

public class Sprite {
    int role;
    int posX;
    int posY;
    String id;
    String mood;
    String description;
    Properties config;

    public Sprite(Properties config) {
        this.config = config;
        this.role = Integer.parseInt(config.getProperty("role"));
        this.posX = Integer.parseInt(config.getProperty("posX"));
        this.posY = Integer.parseInt(config.getProperty("posY"));
        this.id = config.getProperty("id");
        boolean isBusy = false;
        this.mood = "content";
        this.description = "idle";
    }

    public boolean setPosition(int x, int y) {
        try {
            if (x > 0 && x < Integer.parseInt(this.config.getProperty("RoomSizeX")) && y > 0 && y < Integer.parseInt(this.config.getProperty("RoomSizeY")) ) {
                this.posX = x;
                this.posY = y;
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            System.out.println(e);
            return false;
        }
    }

    // I think it overrides by default but just in case
    @Override
    public String toString() {
        return "" + this.id + " | location: (" + this.posX +  "," + this.posY + ") | mood: " + this.mood + " | description: " + this.description;
    }
}
