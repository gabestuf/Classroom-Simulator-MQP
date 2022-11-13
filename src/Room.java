import org.json.JSONObject;

import java.util.ArrayList;
import java.util.LinkedList;

public class Room {
    int sizeX;
    int sizeY;
    private char[][] layout;

    public Room(JSONObject config) {
        this.sizeX = config.getInt("RoomSizeX");
        this.sizeY = config.getInt("RoomSizeY");

        this.layout = loadDemoRoom();
    }
    
    public Room(int sizex, int sizey) {
		this.sizeX = sizex;
		this.sizeY = sizey;
		this.layout = loadDemoRoom();
	}
	
	//Re-write this contructor as it will return errors given an empty list 
	public Room(char[][] room) {
		this.sizeX = room.length;
		this.sizeY = room[0].length;
		this.layout = loadRoom(room);
	}

    public char[][] loadDemoRoom() {
        char[][] temp = new char[10][10];
        for(int i = 0; i < this.sizeX; i++) {
            for(int j = 0; j < this.sizeY; j++) {
                temp[i][j] = 'x';
                if(i == 0 || i == this.sizeY-1) {
                    temp[i][j] = 'w';
                }else if(j == 0 || j == this.sizeX-1) {
                    temp[i][j] = 'w';
                }
            }
        }
        return temp;
    }

    public char[][] loadRoom(char[][] r) {
		char[][] temp = new char[sizeX][sizeY];
		for(int i = 0; i < sizeX; i++) { 
			for(int j = 0; j < sizeY; j++) {
				temp[i][j] = r[i][j];
			}
		}
		return temp;
	}
    
    public char[][] getLayout(){
        return this.layout;
    }

    public boolean addTable(int x, int y){ // where x & y is the center of a 3x3 table
        char[][] temp = this.layout;

        // Check for collision
        for(int i = x-1; i <= x+1; i++) {
            for(int j = y-1; j <= y+1; j++) {
                if (this.layout[i][j] != 'x') {
                    return false;
                }
            }
        }
        // Set coords to table
        for(int i = x-1; i <= x+1; i++) {
            for(int j = y-1; j <= y+1; j++) {
                temp[i][j] = 't';
            }
        }
        this.layout = temp;
        return true;
    }

    public boolean addChair(int x, int y){
        // TODO out of bounds detection
        if(this.layout[x][y] == 'x'){
            this.layout[x][y] = 'c';
        }
        else {
            System.out.printf("Can't add Chair at: X:%d Y:%d \n", x, y);
            return false;
        }
        return true;
    }

    public boolean addDoor(int x, int y){
        // TODO out of bounds detection
        if(this.layout[x][y] == 'w'){
            this.layout[x][y] = 'd';
            return true;
        }
        else {
            System.out.printf("Can't add Door at: X:%d Y:%d \n", x, y);
            return false;
        }
    }

    public boolean addRug(int x, int y) {
        if (this.layout[x][y] == 'x') {
            this.layout[x][y] = 'r';
            return true;
        } else {
            System.out.printf("Can't add Rug at: X:%d Y:%d \n", x, y);
            return false;
        }
    }

    public LinkedList<Integer> findFirstEmptySpace() {
        LinkedList<Integer> arr = new LinkedList<>();
        for(int x = 0; x < this.sizeX; x++) {
            for (int y = 0; y < this.sizeY; y++) {
                if (this.layout[x][y] == 'x') {
                    arr.add(0,x);
                    arr.add(1,y);
                    return arr;
                }
            }
        }
        System.out.println("No empty spaces left :(");
        return null;
    }
    public LinkedList<Integer> findRandomEmptySpace() {
        LinkedList<LinkedList<Integer>> coordList = new LinkedList<>();
        for(int x = 0; x < this.sizeX; x++) {
            for (int y = 0; y < this.sizeY; y++) {
                LinkedList<Integer> arr = new LinkedList<>();
                if (this.layout[x][y] == 'x') {
                    arr.add(0, x);
                    arr.add(1, y);
                    coordList.add(arr);
                }
            }
        }
        if (coordList.size() > 0) {return coordList.get((int) Math.floor(Math.random() * coordList.size()));}
        System.out.println("No empty spaces left :(");
        return null;
    }

    public void moveObject(int x1, int y1, int x2, int y2){
		char[][] temp = getLayout();
		char obj = temp[y1][x1];
		//System.out.println(obj);
		temp[y2][x2] = obj;
		temp[y1][x1] = 'x';
		//System.out.println(obj);
	}
}
