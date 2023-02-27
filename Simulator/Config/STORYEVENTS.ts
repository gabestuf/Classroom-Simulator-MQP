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
        importance: 0
      },
    ],
    nextEvents: ["twoStudentsFight"],
  },
  {
    name: "twoStudentsFight",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["angry", "sad"],
        pos: ["Student1"],
        description: ["fights", "tumbles", "argues"],
        importance: 1
      },
      {
        name: "Student2",
        mood: ["angry", "sad"],
        pos: ["Student1"],
        description: ["fights", "tumbles", "argues"],
        importance: 0.8
      },
    ],
    nextEvents: ["studentSleepy"],
  },
  {
    name: "studentSleepy",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["angry", "sad"],
        pos: ["Student1"],
        description: ["fights", "tumbles", "argues"],
        importance: 0.2
      },
    ],
    nextEvents: ["studentSick"],
  },
  {
    name: "studentSick",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["neutral", "sick"],
        pos: ["Student1"],
        description: ["sick", "needs nurse"],
        importance: 0.8
      },
    ],
    nextEvents: ["studentBored"],
  },
  {
    name: "studentBored",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["neutral"],
        pos: ["Student1"],
        description: ["bored", "nothing to do"],
        importance: 0.9
      },
    ],
    nextEvents: ["teacherGetsTired"],
  },
  {
    name: "teacherGetsTired",
    charactersInvolved: [
      {
        name: "Teacher1",
        mood: ["neutral", "sick", "tired"],
        pos: ["Teacher1"],
        description: ["tired", "bored", "long day"],
        importance: 1
      },
    ],
    nextEvents: ["studentEatsSnack"],
  },
  {
    name: "studentEatsSnack",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["happy", "neutral"],
        pos: ["Student1"],
        description: ["snack time", "student hungry"],
        importance: 0
      },
    ],
    nextEvents: ["studentHappy"],
  },
  {
    name: "studentHappy",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["happy"],
        pos: ["Student1"],
        description: ["happy camper", "student happy", "happy"],
        importance: 0.1
      },
    ],
    nextEvents: ["studentFocused"],
  },
  {
    name: "studentFocused",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["happy", "neutral"],
        pos: ["Student1"],
        description: ["student learning", "focused", "locked in"],
        importance: 0.2
      },
    ],
    nextEvents: ["studentCries "],
  },
  {
    name: "studentCries",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["angry", "sad"],
        pos: ["Student1"],
        description: ["student sad", "student crying", "student upset"],
        importance: 0.4
      },
    ],
    nextEvents: ["studentYells"],
  },
  {
    name: "studentYells",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["angry", "sick", "tired"],
        pos: ["Student1"],
        description: ["student yells", "loud student"],
        importance: 0.4
      },
    ],
    nextEvents: ["studentGoesToLeave"],
  },
  {
    name: "studentGoesToLeave",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["angry", "sick", "tired"],
        pos: ["Student1"],
        description: ["student leaves", "student fire drill", "student needs bathroom"],
        importance: 0.5
      },
    ],
    nextEvents: ["studentReads"],
  },
  {
    name: "studentReads",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["neutral", "tired"],
        pos: ["Student1"],
        description: ["student has a book", "student reads", "student learning"],
        importance: 0.8
      },
    ],
    nextEvents: ["teacherReads"],
    
  },
  {
    name: "teacherReads",
    charactersInvolved: [
      {
        name: "Teacher1",
        mood: ["neutral"],
        pos: ["Teacher1"],
        description: ["Teacher Reading"],
        importance: 0.8
      },
    ],
    nextEvents: ["teacherAngry"],
  },
  {
    name: "TeacherAngry",
    charactersInvolved: [
      {
        name: "Teacher1",
        mood: ["angry", "neutral"],
        pos: ["Teacher1"],
        description: ["teacher upset", "student being disruptive", "teacher losing control of classroom"],
        importance: 0.6
      },
    ],
    nextEvents: ["TeacherHappy"],
  },
  {
    name: "TeacherHappy",
    charactersInvolved: [
      {
        name: "Teacher1",
        mood: ["happy"],
        pos: ["Teacher1"],
        description: ["teacher loves job", "teacher happy", "teacher teaching"],
        importance: 0.7
      },
    ],
    nextEvents: ["studentRaisesHand"],
  },
  {
    name: "studentRaisesHand",
    charactersInvolved: [
      {
        name: "Student1",
        mood: ["happy", "neutral"],
        pos: ["Student1"],
        description: ["student raises hand ", "student has question"],
        importance: 0.6
      },
    ],
    nextEvents: ["studentLaughs"],
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
    nextEvents: ["studentConfused", "studentRaisesHand"],
  },
    {
        name: "studentConfused",
        charactersInvolved: [
          {
            name: "Student1",
            mood: ["neutral"],
            pos: ["Student1"],
            description: ["student wants to learn more", "student confused", "student has question"],
            importance: 0.4
          },
        ],
        nextEvents: ["teacherConfused"],
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
            mood: ["neutral", "happy"],
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
            mood: ["neutral", "sad"],
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
            mood: ["neutral", "sad"],
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
            mood: ["neutral", "happy"],
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
            mood: ["neutral"],
            pos: ["Student1"],
            description: ["student studies", "student looks at material"],
            importance: 0.8
          },
        ],
        nextEvents: ["studentLaughs"],
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
