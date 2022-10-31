
public class Classroom {

	public static final int ROOMX = 10;
	public static final int ROOMY = 10;
	public static void main(String[] args) {		
		Classroom a = new Classroom();
		Room testRoom = new Room(ROOMX, ROOMY);
		testRoom.addTable(5, 5);
		testRoom.addChair(5, 5);
		testRoom.addChair(2, 2);
		testRoom.addDoor(0, 1);
		a.render(testRoom);
	}
	
	public void render(Room a) {
		System.out.println("Render of Room: ");
		for(int i = 0; i < a.sizeX; i++) {
			String row = ""; 
			for(int j = 0; j < a.sizeY; j++) {
				row = row + a.getRoomLayout()[i][j] + " ";
			}
			System.out.println(row);
		}
	}

}
