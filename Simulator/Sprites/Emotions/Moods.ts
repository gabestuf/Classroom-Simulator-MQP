// maybe add upset, bored
const moodList = ["happy", "sad", "neutral", "angry", "tired", "sick", "sleepy", "curious", "thirsty", "focused", "studious"];

class Mood {
  name: string;
  constructor(name_: string) {
    if (moodList.includes(name_)) {
      this.name = name_;
    } else {
      const errstr = `This mood cannot be created, unavailable name entered. Here is a list of the available mood names currently: ${moodList}`;
      throw Error(errstr);
    }
  }
}

export default Mood;
