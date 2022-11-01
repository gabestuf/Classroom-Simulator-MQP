public class Simulator {

    public static void main (String[] args) {

        // Init Classroom
        Classroom classroom = new Classroom();

        // You can add Tables/Chairs/Doors/Students directly to the room like this
        //classroom.room.addTable(5,5);
       // classroom.room.addChair(2,2);
        //classroom.room.addDoor(0,1);

        // Or easier like this classroom.addChair(2,2)

        // TODO have the classroom automatically add elements where there's space
        // TODO ex: classroom.addChair(); look in Classroom class for signatures
        classroom.addTable(); // will add a table at a random free spot. Reference addTable() to write random adds for the other objects.

        // TODO write a function that adds a chair randomly next to a table

        // And render like this
        classroom.render();

    }
}
