import org.json.JSONArray;
import org.json.JSONObject;

public class Simulator {

    public static void main (String[] args) {

        //Init Config

        JSONReader jsonReader = new JSONReader();
        JSONObject STORYEVENTS = jsonReader.readJSONFile("./res/STORYEVENTS.json");
        JSONObject CONFIG = jsonReader.readJSONFile("./res/CONFIG.json");

        CONFIG.append("STORYEVENTS", STORYEVENTS);

        // Init Classroom
        // Creates random room with elements from the CONFIG.json and also storey events json

        Classroom classroom = new Classroom(CONFIG);

        // call generate event list to fill the Event list inside class room
        classroom.generateEventList();

        //Create a log class with class room instance
        Log log = new Log(classroom);
        // get the json object out of classroom object.
        JSONObject jsonObj = log.getJSONFromClassRoom();
        //System.out.println("Below is the json generated \n");

        //print the json object to the console in string format.
        //System.out.println(jsonObj.toString());
        //System.out.println();

        classroom.jsonToEvent("studentMakesMess");
        // TODO write a function that adds a chair randomly next to a table

        // And render like this
        //classroom.renderRoom();

    }
}

