import java.util.ArrayList;
import java.util.Properties;

public class SpriteList {
    Properties config;
    ArrayList<Sprite> spriteList = new ArrayList<>();

    public SpriteList(Properties config) {
        this.config = config;
    }

    public void addSprite(Sprite s) {
        this.spriteList.add(s);
    }

    public ArrayList<Sprite> getTeachers() {
        ArrayList<Sprite> temp = new ArrayList<>();
        for (Sprite s : this.spriteList) {
            if (s.role == 0) {
                temp.add(s);
            }
        }
        return temp;
    }

    public ArrayList<Sprite> getStudents() {
        ArrayList<Sprite> temp = new ArrayList<>();
        for (Sprite s : this.spriteList) {
            if (s.role == 1) {
                temp.add(s);
            }
        }
        return temp;
    }

    public Sprite chooseRandomTeacher() {
        ArrayList<Sprite> listOfTeacherSprites = getTeachers();
        int index = (int) Math.floor(listOfTeacherSprites.size() * Math.random());

        return listOfTeacherSprites.get(index);
    }

    public Sprite chooseRandomStudent() {
        ArrayList<Sprite> listOfStudentSprites = getStudents();
        int index = (int) Math.floor(listOfStudentSprites.size() * Math.random());

        return listOfStudentSprites.get(index);
    }
}
