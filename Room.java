public class Room {
    int defaultX = 10;
    int defaultY = 10;
    int sizeX;
    int sizeY;
    private char[][] layout;

    public Room(int sizeX, int sizeY) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.layout = loadDemoRoom();
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

    public char[][] getLayout(){
        return this.layout;
    }

    public void addTable(int x, int y){ // where x & y is the center of a 3x3 table
        // TODO add collision detection to this function, also out of bounds detection
        char[][] temp = this.layout;
        for(int i = x-1; i <= x+1; i++) {
            for(int j = y-1; j <= y+1; j++) {
                temp[i][j] = 't';
            }
        }
        this.layout = temp;
    }

    public void addChair(int x, int y){
        // TODO out of bounds detection
        if(this.layout[x][y] == 'x'){
            this.layout[x][y] = 'c';
        }
        else {
            System.out.printf("Can't add Chair at: X:%d Y:%d \n", x, y);
        }
    }

    public void addDoor(int x, int y){
        // TODO out of bounds detection
        if(this.layout[x][y] == 'w'){
            this.layout[x][y] = 'd';
        }
        else {
            System.out.printf("Can't add Door at: X:%d Y:%d \n", x, y);
        }
    }

    public void addStudent(int x, int y){
        // TODO out of bounds detection, also this code is just copied from addDoor
        if(this.layout[x][y] == 'w'){
            this.layout[x][y] = 'd';
        }
        else {
            System.out.printf("Can't add Door at: X:%d Y:%d \n", x, y);
        }
    }
}
