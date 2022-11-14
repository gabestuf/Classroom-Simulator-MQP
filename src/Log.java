import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Set;


public class Log {
    private JSONObject STORYEVENTS;
    public Classroom classRoom;

    public Log(Classroom cr) {
        this.STORYEVENTS = cr.config.getJSONArray("STORYEVENTS").getJSONObject(0);
        this.classRoom = cr;
    }

    public void processStoryEvents() {
        System.out.println("STORYEVENTS processing start \n");
        Set<String> keys = STORYEVENTS.keySet();
        for (String eachKey : keys) {
            System.out.println(eachKey);
            JSONObject keyObj = STORYEVENTS.getJSONObject(eachKey);
            JSONArray charsInvolvedObj = keyObj.getJSONArray("charactersInvolved");
            for (int i= 0; i< charsInvolvedObj.length(); i++) {
                JSONObject charInObj = keyObj.getJSONObject(charsInvolvedObj.getString(i));
                JSONArray moods = charInObj.getJSONArray("mood");
                System.out.println(charsInvolvedObj.getString(i) + " =>" + moods.getString(0));
            }
            System.out.println();

        }
        System.out.println("STORYEVENTS processing END \n");
    }

    public JSONObject getJSONFromClassRoom() {
        JSONObject jsonObject = new JSONObject(); // class room JSON
        ArrayList<Event> allEvents = classRoom.allEvents; // get all events in the classroom
        for (Event eachEvent : allEvents) { // iterate over each event and prepare json nodes
          JSONObject eventJson = new JSONObject(); // json object for each event
          eventJson.put("name", eachEvent.name); // keep the event name as name node

          JSONArray charArray = new JSONArray(); // prepare the charecters involved array
          for (String str : eachEvent.charactersInvolved){ // take the characters involved array from event object and append to the json
              charArray.put(str);
          }
          eventJson.put("charactersInvolved", charArray); // add that to the json

            for (String str : eachEvent.charactersInvolved){ // for each character prepare the internal json with mood, desc etc
                JSONObject charObjJson = new JSONObject();
                ArrayList<Sprite> sprites = eachEvent.spriteList; // each event will have sprites inside.. get them all

                for  (Sprite sprite : sprites) { // iterate over all the sprites
                    if(sprite.id.equals(str)) { // if the sprite is matching with character involved, get the values
                        JSONArray moodArray = new JSONArray();
                        moodArray.put(sprite.mood);  // get the mood from sprite and add to json
                        charObjJson.put("mood", moodArray);

                        JSONArray descArray = new JSONArray();
                        descArray.put(sprite.description);
                        charObjJson.put("description", descArray);// get the description from sprite and add to json

                        JSONArray positionArray = new JSONArray();
                        positionArray.put(sprite.posX);// get the postioins from sprite and add to json
                        positionArray.put(sprite.posY);
                        charObjJson.put("position", positionArray);
                    }
                }

                eventJson.put(str, charObjJson); // put the internal char involved json to the event json
            }

          jsonObject.put(eachEvent.name, eventJson);// finally add event json to the main json


        }
        return jsonObject;
    }

    public void addEvent(String key, JSONObject jobj) {
        STORYEVENTS.put(key,jobj);
    }
}

//function that can add an Event, pass in a classroom and turning it into a json