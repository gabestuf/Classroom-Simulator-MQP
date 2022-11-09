import java.util.ArrayList;
import java.util.LinkedList;

public class Event{
	
	private int numOfFrames;
	private ArrayList<Room> frames = new ArrayList<Room>(); 	
	
	public Event(int numFrames) {
		this.numOfFrames = numFrames;
	}
	
	public void addFrame(Room a) {
		this.frames.add(a);
	}
	
	public ArrayList<Room> getFrames(){
		return this.frames;
	}
}
