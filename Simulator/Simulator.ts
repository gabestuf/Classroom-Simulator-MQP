import ClassroomEvent from "./Events/ClassroomEvent";
import Classroom, { ClassroomJSON } from "./Classroom";
import ClassroomConfig from "./Config/CONFIG";
import StoryEvents from "./Config/STORYEVENTS";
import seededRandom from "./Helper Functions/GenerateRandomNumber";

interface JSONFinal {
  config: ClassroomConfig | null;
  room: string[][];
  initClassroom: string[][];
  frames: ClassroomJSON[];
}

class Simulator {
  finalJSON: JSONFinal | null;
  numEvents: number;
  classroom: Classroom;

  /*  
    What this should do: 

    1. create a classroom

    2. run through a loop generating events and random intervals, with limits to how many events/how frequenty given some config

    when generating event: 
        3. create new event 
        4. apply event to classroom
           classroom.applyEvent, returns a list of classrooms, where each classroom is a snapshot of state changes during the event
        5. add these classroom snapshots to an overall list of classrooms that Simulator holds. 

    */

  config: ClassroomConfig;

  constructor(config_: ClassroomConfig, numEvents_: number) {
    this.config = config_;
    this.numEvents = numEvents_;
    this.classroom = new Classroom(config_);
    this.finalJSON = this.initFinalJSON();
  }

  initFinalJSON() {
    const initclassJSON: ClassroomJSON = JSON.parse(JSON.stringify(this.classroom.toJSON("idle")));
    const fJSON: JSONFinal = {
      config: this.config,
      room: this.classroom.room.toJSON(),
      initClassroom: this.classroom.toStringArray(),
      frames: [initclassJSON],
    };
    return fJSON;
  }

  generateOneRandomEvent() {
    // TODO 2. Generate events at random intervals

    // to view just the room
    // classroom.room.render()
    // to view classroom, ie room w/ sprites
    // classroom.render()

    // 3. Create an event
    const eventNameList = new StoryEvents().getEventNames();
    let eventName = eventNameList[Math.floor(seededRandom(this.config.seed * 7) * eventNameList.length)];
    // this.classroom.render();
    // TODO Make sure to comment out next line, it is for testing specific events
    // eventName = "studentMakesMess";
    const randomEvent = new ClassroomEvent(eventName, this.classroom);

    // this.classroom.render();

    // 4. Apply event to classroom
    const classroomFrames = this.classroom.applyEvent(randomEvent);

    // 5. Turn classroom List into final json
    let classroomFramesJSON: ClassroomJSON[] = classroomFrames.map((cl) => JSON.parse(JSON.stringify(cl.toJSON(eventName))));
    // console.log(util.inspect(this.finalJSON?.frames, false, null, true /* enable colors */));

    if (this.finalJSON !== null) {
      //   console.log("___________________");
      //   console.log(util.inspect(classroomFrames, false, null, true /* enable colors */));
      this.finalJSON.frames = [...this.finalJSON.frames, ...classroomFramesJSON];
    }
  }

  generateRandomEvents(numEvents: number) {
    for (let i = 0; i < numEvents; i++) {
      this.generateOneRandomEvent();
    }
  }
}

export default Simulator;
