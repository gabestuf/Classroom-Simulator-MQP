import org.json.JSONObject;

import java.nio.file.Files;
import java.nio.file.Paths;

public class JSONReader {

  public JSONReader() {

  }

    public JSONObject readJSONFile(String filepath) {
        try {
            String contents = new String((Files.readAllBytes(Paths.get(filepath))));
            System.out.println("Successfully read json file: " + filepath);
            return new JSONObject(contents);
        } catch (Exception e) {
            System.out.println(e);
            return new JSONObject();
        }
    }

    public void log(JSONObject json) {
        System.out.println(json.toString(2));
    }
}
