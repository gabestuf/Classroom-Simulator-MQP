import org.json.JSONObject;

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

    public Sprite(JSONObject config) {
        this.config = config;
        this.role = config.getInt("role");
        this.id = config.getString("id");
        this.mood = "content";
        this.description = "idle";
        this.posX = config.getInt("posX");
        this.posY = config.getInt("posY");
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

    // I think it overrides by default but just in case
    @Override
    public String toString() {
        return "" + this.id + " | location: (" + this.posX + "," + this.posY + ") | mood: " + this.mood + " | description: " + this.description;
    }

}


