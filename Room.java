
public class Room {
	int defaultX = 10;
	int defaultY = 10;
	int sizeX; 
	int sizeY;
	private char[][] RoomLayout; 
	
	public Room(int sizex, int sizey) {
		this.sizeX = sizex;
		this.sizeY = sizey;
		this.RoomLayout = loadDemoRoom();
	}
	
	public char[][] loadDemoRoom() {
		char[][] temp = new char[10][10];
		for(int i = 0; i < sizeX; i++) { 
			for(int j = 0; j < sizeY; j++) {
				temp[i][j] = 'x';
				if(i == 0 || i == sizeY-1) {
					temp[i][j] = 'w';
				}else if(j == 0 || j == sizeX-1) {
					temp[i][j] = 'w';
				}
			}
		}
		
		return temp;
	}
	
	public char[][] getRoomLayout(){
		return this.RoomLayout;
	}
	
	public void addTable(int x, int y){
		char[][] temp = getRoomLayout();
		for(int i = x-1; i <= x+1; i++) { 
			for(int j = y-1; j <= y+1; j++) {
				temp[i][j] = 't';
			}
		}
		RoomLayout = temp;
	}
	
	public void addChair(int x, int y){
		char[][] temp = getRoomLayout();
		if(temp[x][y] == 'w' || temp[x][y] == 't'){
			System.out.printf("Can't add Chair at: X:%d Y:%d \n", x, y);
		}
		else {
			temp[x][y] = 'c';
		}
		RoomLayout = temp;
	}
	
	public void addDoor(int x, int y){
		char[][] temp = getRoomLayout();
		if(temp[x][y] == 'w'){
			temp[x][y] = 'd';
		}
		else {
			System.out.printf("Can't add Door at: X:%d Y:%d \n", x, y);	
		}
		RoomLayout = temp;
	}
	
	public void addStudent(int x, int y){
		char[][] temp = getRoomLayout();
		if(temp[x][y] == 'w'){
			temp[x][y] = 'd';
		}
		else {
			System.out.printf("Can't add Door at: X:%d Y:%d \n", x, y);	
		}
		RoomLayout = temp;
	}
}
