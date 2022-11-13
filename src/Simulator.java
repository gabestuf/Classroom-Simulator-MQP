import org.json.JSONArray;
import org.json.JSONObject;

public class Simulator {

    public static void main (String[] args) {

        //Init Config

        JSONReader jsonReader = new JSONReader();
        JSONObject STORYEVENTS = jsonReader.readJSONFile("res/STORYEVENTS.json");
        JSONObject CONFIG = jsonReader.readJSONFile("res/CONFIG.json");

        CONFIG.append("STORYEVENTS", STORYEVENTS);

        // Init Classroom
        // Creates random room with elements from the CONFIG.json
        Classroom classroom = new Classroom(CONFIG);

        classroom.jsonToEvent("studentMakesMess");
        // TODO write a function that adds a chair randomly next to a table

        // And render like this
        classroom.renderRoom();

    }
}

