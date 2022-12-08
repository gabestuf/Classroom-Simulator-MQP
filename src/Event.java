import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

public class Event{
	
	Frame[] frameList;
	String name;
	ArrayList<String> charactersInvolved;
	ArrayList<Sprite> spriteList;
	ArrayList<Sprite> activeSpriteList = new ArrayList<>();
	int numStudents;
	int numTeachers;
	Room room;

	public Event(JSONObject jsonEvent, ArrayList<Sprite> spriteList, int numStudents, int numTeachers, Room r) {
		this.room = r;
		this.name = jsonEvent.getString("name");
		this.charactersInvolved = jsonStringCharsInvolvedArray(jsonEvent.getJSONArray("charactersInvolved"));
		this.spriteList = spriteList;
		this.numStudents = numStudents;
		this.numTeachers = numTeachers;
		createFrames();
	}

	public ArrayList<String> jsonStringCharsInvolvedArray(JSONArray array) {
		ArrayList<String> charsInvolved = new ArrayList<>();
		for (int i = 0; i < array.length(); i++) {
			charsInvolved.add(array.getString(i));
		}
		return charsInvolved;
	}

	public void setCharacters() {
		// Counting how many students and teachers are active in the event
		int studentCount = 0;
		int teacherCount = 0;
		for (String charID : this.charactersInvolved) {
			if (charID.contains("Student")) {
				studentCount++;
			}
			if (charID.contains("Teacher")) {
				teacherCount++;
			}
		}

		// If there are not enough students or teachers to play out this event, Print error and don't do this event
		if (studentCount > this.numStudents) {
			System.err.printf("Not enough students for this event: %s", this.name);
			return;
		}
		if (teacherCount > this.numTeachers) {
			System.err.printf("Not enough students for this event: %s", this.name);
			return;
		}

		// add a random student and teacher id of the student / teacher that will be active in this event.
		ArrayList<Integer> sidList = new ArrayList<>();
		ArrayList<Integer> tidList = new ArrayList<>();

		for (int i = 0; i < this.numStudents; i++) {
			sidList.add(i);
		}
		for (int i = 0; i < this.numTeachers; i++) {
			tidList.add(i);
		}

		for (int i = 0; i < teacherCount; i++) {
			this.activeSpriteList.add(this.spriteList.get(tidList.remove( (int) Math.floor(Math.random() * tidList.size()))));
		}
		for (int i = 0; i < studentCount; i++) {
			this.activeSpriteList.add(this.spriteList.get(numTeachers + sidList.remove((int) Math.floor(Math.random() * sidList.size()))));
		}

		System.out.println(this.name + this.activeSpriteList);
	}

	public void createFrames() {
		setCharacters();
  		// TODO update sprite locations


	}

	//
	public void moveSprite(Sprite s, int finalX, int finalY) {
		// taking sprites current position,
		// update coordinates up to (+1,+1) or (-1, -1)
		
		// s is a sprite. posX and posY are it's current position
		s.posX = 0;
		s.posY = 0;

		// finalX and finalY is the final x,y coordinates 
		finalX = 2;
		finalY = 2;

		int updatedX = 0;
		if ( finalX > s.posX) {
			updatedX = s.posX + 1;
		}
		if ( finalX < s.posX) {
			updatedX = s.posX - 1;
		}
		int updatedY = s.posY + 1;

		// COLLISION
		if (this.room.getLayout()[updatedX][updatedY] == 'f') { // Check if the position is valid

		} else { // This position is NOT valid, come up with a way to search nearby positions for an empty square. 
			
		}

		// OUTPUT
		s.posX = 1;
		s.posY = 1;
	}
}
