export class StoryEvent {
  name: string;
  charactersInvolved: iUpdatedSprite[];
  nextEvents: string[];
  constructor(name_: string, charactersInvolved_: iUpdatedSprite[], nextEvents_: string[]) {
    this.name = name_;
    this.charactersInvolved = charactersInvolved_;
    this.nextEvents = nextEvents_;
  }

  countStudents(): number {
    let counter = 0;
    for (const sprite of this.charactersInvolved) {
      if (sprite.name.includes("Student")) {
        counter++;
      }
    }
    return counter;
  }
  countTeachers(): number {
    let counter = 0;
    for (const sprite of this.charactersInvolved) {
      if (sprite.name.includes("Teacher")) {
        counter++;
      }
    }
    return counter;
  }
}

interface iStoryEvent {
  name: string;
  charactersInvolved: iUpdatedSprite[];
  nextEvents: string[];
}

export interface iUpdatedSprite {
  name: string;
  mood: string[];
  pos: string[];
  description: string[];
  importance: number;
}

// The JSON storyEvent
const StoryEventsJSON: iStoryEvent[] = [
  {
    name: "studentMakesMess",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["happy", "angry"],
        pos: ["current", "corner", "wall"],
        description: ["breaks toy", "draws on object", "student spills food"],
        importance: 0,
      },
    ],
    nextEvents: ["twoStudentsFight", "teacherMovesToStudent"],
  },
  {
    name: "twoStudentsFight",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["angry", "sad"],
        pos: ["Student1"],
        description: ["fights", "tumbles", "argues"],
        importance: 1,
      },
      {
        name: "Student2",
        mood: ["angry", "sad"],
        pos: ["Student1"],
        description: ["fights", "tumbles", "argues"],
        importance: 0.8,
      },
    ],
    nextEvents: ["studentSleepy", "studentLaughs", "studentAngry", "teacherMovesToStudent"],
  },
  {
    name: "twoStudentsHide",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["angry", "sad"],
        pos: ["wall"],
        description: ["hides"],
        importance: 0.4,
      },
      {
        name: "Student2",
        mood: ["angry", "sad"],
        pos: ["Student1"],
        description: ["hides"],
        importance: 0.4,
      },
    ],
    nextEvents: ["studentLaughs", "studentSleepy"],
  },
  {
    name: "studentSleepy",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["sleepy", "angry", "sad"],
        pos: ["Student1"],
        description: ["fights", "tumbles", "argues"],
        importance: 0.2,
      },
    ],
    nextEvents: ["studentSick", "studentLaughs", "teacherMovesToStudent"],
  },
  {
    name: "studentSick",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["sick"],
        pos: ["Student1"],
        description: ["sick", "needs nurse"],
        importance: 0.8,
      },
    ],
    nextEvents: ["studentBored", "studentLaughs", "teacherMovesToStudent"],
  },
  {
    name: "studentBored",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["neutral"],
        pos: ["Student1"],
        description: ["bored", "nothing to do"],
        importance: 0.9,
      },
    ],
    nextEvents: ["teacherGetsTired", "teacherMovesToStudent"],
  },
  {
    name: "teacherGetsTired",
    charactersInvolved: [
      {
        name: "Teacher1",
        mood: ["tired"],
        pos: ["Teacher1"],
        description: ["tired", "bored", "long day"],
        importance: 1,
      },
    ],
    nextEvents: ["studentEatsSnack", "studentLaughs", "teacherMovesToStudent"],
  },
  {
    name: "studentEatsSnack",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["happy", "neutral"],
        pos: ["Student1"],
        description: ["snack time", "student hungry"],
        importance: 0,
      },
    ],
    nextEvents: ["studentHappy", "teacherMovesToStudent"],
  },
  {
    name: "studentHappy",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["happy"],
        pos: ["Student1"],
        description: ["happy camper", "student happy", "happy"],
        importance: 0.1,
      },
    ],
    nextEvents: ["studentFocused", "studentLaughs"],
  },
  {
    name: "studentFocused",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["happy", "neutral"],
        pos: ["Student1"],
        description: ["student learning", "focused", "locked in"],
        importance: 0.2,
      },
    ],
    nextEvents: ["studentCries", "studentLaughs", "studentHappy"],
  },
  {
    name: "studentCries",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["angry", "sad"],
        pos: ["Student1"],
        description: ["student sad", "student crying", "student upset"],
        importance: 0.4,
      },
    ],
    nextEvents: ["studentYells", "studentLaughs"],
  },
  {
    name: "studentYells",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["angry", "sick", "tired"],
        pos: ["Student1"],
        description: ["student yells", "loud student"],
        importance: 0.4,
      },
    ],
    nextEvents: ["studentGoesToLeave", "studentLaughs"],
  },
  {
    name: "studentGoesToLeave",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["angry", "sick", "tired"],
        pos: ["Student1"],
        description: ["student leaves", "student fire drill", "student needs bathroom"],
        importance: 0.5,
      },
    ],
    nextEvents: ["studentReads", "teacherReads"],
  },

  {
    name: "studentReads",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["reader"],
        pos: ["Student1"],
        description: ["student has a book", "student reads", "student learning"],
        importance: 0.7
      },
    ],
    nextEvents: ["teacherReads", "studentGoesToLeave"],
    
  },
  {
    name: "teacherReads",
    charactersInvolved: [
      {
        name: "Teacher1",
        mood: ["reader"],
        pos: ["Teacher1"],
        description: ["Teacher Reading"],
        importance: 0.8
      },
    ],
    nextEvents: ["teacherAngry", "studentLaughs"],
  },
  {
    name: "teacherAngry",
    charactersInvolved: [
      {
        name: "Teacher1",
        mood: ["angry", "neutral"],
        pos: ["Teacher1"],
        description: ["teacher upset", "student being disruptive", "teacher losing control of classroom"],
        importance: 0.6
      },
    ],
    nextEvents: ["teacherHappy", "teacherReads"],
  },
  {
    name: "teacherHappy",
    charactersInvolved: [
      {
        name: "Teacher1",
        mood: ["happy"],
        pos: ["Teacher1"],
        description: ["teacher loves job", "teacher happy", "teacher teaching"],
        importance: 0.7
      },
    ],
    nextEvents: ["studentRaisesHand", "studentLaughs", "teacherAngry"],
  },
  {
    name: "studentRaisesHand",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["focused"],
        pos: ["Student1"],
        description: ["student raises hand ", "student has question"],
        importance: 0.6
      },
    ],
    nextEvents: ["studentLaughs", "studentCries", "teacherMovesToStudent"],
  },
  {
    name: "studentLaughs",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["happy"],
        pos: ["Student1"],
        description: ["teacher loves job", "teacher happy", "teacher teaching"],
        importance: 0.6
      },
    ],
    nextEvents: ["studentConfused", "studentRaisesHand", "teacherHappy", "teacherAngry"],
  },
    {
        name: "studentConfused",
        charactersInvolved: [
          {
            name: "Student1",
            mood: ["curious"],
            pos: ["Student1"],
            description: ["student wants to learn more", "student confused", "student has question"],
            importance: 0.4
          },
        ],
        nextEvents: ["teacherConfused", "studentRaisesHand"],
      },
      {
        name: "teacherConfused",
        charactersInvolved: [
          {
            name: "Teacher1",
            mood: ["neutral"],
            pos: ["Teacher1"],
            description: ["teacher confused", "teacher needs more information", "teacher does not know the answer"],
            importance: 0.3
          },
        ],
        nextEvents: ["studentLaughs", "teacherDrinksWater"],
      },
      {
        name: "teacherDrinksWater",
        charactersInvolved: [
          {
            name: "Teacher1",
            mood: ["thirsty"],
            pos: ["Teacher1"],
            description: ["teacher drinks water", "teacher drinks"],
            importance: 0.2
          },
        ],
        nextEvents: ["studentLaughs", "studentNeedsWater"],
      },
      {
        name: "studentNeedsWater",
        charactersInvolved: [
          {
            name: "Student1",
            mood: ["thirsty"],
            pos: ["Student1"],
            description: ["student needs a drink of water", "student wants water"],
            importance: 0.3
          },
        ],
        nextEvents: ["studentLaughs", "studentDrinksWater"],
      },
      {
        name: "studentDrinksWater",
        charactersInvolved: [
          {
            name: "Student1",
            mood: ["thirsty"],
            pos: ["Student1"],
            description: ["student drinks water", "student digests water"],
            importance: 0.5
          },
        ],
        nextEvents: ["studentLaughs", "studentWrites"],
      },
      {
        name: "studentWrites",
        charactersInvolved: [
          {
            name: "Student1",
            mood: ["studious"],
            pos: ["Student1"],
            description: ["student practices writing", "student writes an essay"],
            importance: 0.7
          },
        ],
        nextEvents: ["studentLaughs", "studentStudies"],
      },
      {
        name: "studentStudies",
        charactersInvolved: [
          {
            name: "Student1",
            mood: ["reader"],
            pos: ["Student1"],
            description: ["student studies", "student looks at material"],
            importance: 0.8
          },
        ],
        nextEvents: ["studentLaughs", "studentTimeout"],
      },
      {
        name: "studentTimeout",
        charactersInvolved: [
          {
            name: "Student1",
            mood: ["neutral", "angry"],
            pos: ["Student1"],
            description: ["student studies", "student looks at material"],
            importance: 0.1
          },
        ],
        nextEvents: ["studentLaughs", "teacherTimeout", "studentYells"],
      },
      {
        name: "teacherTimeout",
        charactersInvolved: [
          {
            name: "Teacher1",
            mood: ["neutral", "angry"],
            pos: ["Teacher1"],
            description: ["teacher timeout", "break teacher"],
            importance: 0.1
          },
        ],
        nextEvents: ["studentLaughs", "studentTimeout", "studentWrites", "studentYells", "studentAngry"],
      },
      {
        name: "studentAngry",
        charactersInvolved: [
          {
            name: "Student1",
            mood: ["angry"],
            pos: ["Student1"],
            description: ["student upset", "student mad"],
            importance: 0.1
          },
        ],
        nextEvents: ["studentLaughs", "teacherTimeout", "studentYells", "twoStudentsLaugh", "teacherMovesToStudent"],
      },
      {
        name: "twoStudentsLaugh",
        charactersInvolved: [
          {
            name: "Student1",
            mood: ["happy", "neutral"],
            pos: ["Student1"],
            description: ["laughing student"],
            importance: 1
          },
          {
            name: "Student2",
            mood: ["happy", "neutral"],
            pos: ["Student1"],
            description: ["laughing student"],
            importance: 0.3
          },
        ],
        nextEvents: ["studentSleepy", "studentAngry", "teacherMovesToStudent"],
      },
      {
        name: "teacherMovesToStudent",
        charactersInvolved: [
          {
            name: "Teacher1",
            mood: ["happy", "neutral"],
            pos: ["Teacher1"],
            description: ["teacher moves"],
            importance: 1
          },
          {
            name: "Student1",
            mood: ["happy", "neutral"],
            pos: ["Student1"],
            description: ["laughing student"],
            importance: 1
          },
        ],
        nextEvents: ["studentSleepy", "studentAngry", "studentLaughs"],
      },


];

export class StoryEvents {
  eventList: StoryEvent[];

  constructor() {
    this.eventList = this.convertJSON(StoryEventsJSON);
  }

  convertJSON(json: iStoryEvent[]): StoryEvent[] {
    let newEventArray: StoryEvent[] = [];
    for (const event of json) {
      newEventArray.push(new StoryEvent(event.name, event.charactersInvolved, event.nextEvents));
    }
    return newEventArray;
  }

  getEvent(eventName: string): StoryEvent {
    for (const event of this.eventList) {
      if (event.name === eventName) {
        return event;
      }
    }
    throw new Error("Cannot get event, Event does not exist");
  }

  getEventNames(): string[] {
    let eventNameList: string[] = [];
    for (const event of this.eventList) {
      eventNameList.push(event.name);
    }
    return eventNameList;
  }
}

export default StoryEvents;
