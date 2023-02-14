"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryEvents = exports.StoryEvent = void 0;
class StoryEvent {
    constructor(name_, charactersInvolved_, nextEvents_) {
        this.name = name_;
        this.charactersInvolved = charactersInvolved_;
        this.nextEvents = nextEvents_;
    }
    countStudents() {
        let counter = 0;
        for (const sprite of this.charactersInvolved) {
            if (sprite.name.includes("Student")) {
                counter++;
            }
        }
        return counter;
    }
    countTeachers() {
        let counter = 0;
        for (const sprite of this.charactersInvolved) {
            if (sprite.name.includes("Teacher")) {
                counter++;
            }
        }
        return counter;
    }
}
exports.StoryEvent = StoryEvent;
// The JSON storyEvent
const StoryEventsJSON = [
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
        nextEvents: [],
    },
];
class StoryEvents {
    constructor() {
        this.eventList = this.convertJSON(StoryEventsJSON);
    }
    convertJSON(json) {
        let newEventArray = [];
        for (const event of json) {
            newEventArray.push(new StoryEvent(event.name, event.charactersInvolved, event.nextEvents));
        }
        return newEventArray;
    }
    getEvent(eventName) {
        for (const event of this.eventList) {
            if (event.name === eventName) {
                return event;
            }
        }
        throw new Error("Cannot get event, Event does not exist");
    }
    getEventNames() {
        let eventNameList = [];
        for (const event of this.eventList) {
            eventNameList.push(event.name);
        }
        return eventNameList;
    }
}
exports.StoryEvents = StoryEvents;
const StoryEvents2 = {
    // "studentMakesMess": {
    //   "name": "studentMakesMess",
    //   "charactersInvolved": ["Student1"],
    //   "Student1": {
    //     "mood": ["happy", "angry"],
    //     "position": ["current", "corner", "table", "wall"],
    //     "description": ["breaks toy", "draws on object", "student spills food"]
    //   },
    //   "importance": [0, 5],
    //   "nextEvents": ["twoStudentsFight", "teacherCallsCalmDown"]
    // },
    // "twoStudentsFight": {
    //   "name": "twoStudentsFight",
    //   "charactersInvolved": ["Student1", "Student2"],
    //   "Student1": {
    //     "mood": ["angry", "sad"],
    //     "position": ["Student1"],
    //     "description": ["fights", "tumbles"]
    //   },
    //   "Student2": {
    //     "mood": ["angry", "sad"],
    //     "position": ["Student1"],
    //     "description": ["fights", "tumbles"]
    //   },
    //   "importance": [6, 10],
    //   "nextEvents": ["teacherCallsCalmDown", "teacherCallsToGather"]
    // },
    teacherCallsToGather: {
        name: "teacherCallsToGather",
        charactersInvolved: ["Teacher1"],
        Teacher1: {
            mood: ["neutral", "angry"],
            position: ["current"],
            description: ["tells everyone to pay attention", "tells everyone to gather"],
        },
        importance: [3, 9],
        nextEvents: ["studentsGather"],
    },
    teacherCallsCalmDown: {
        name: "teacherCallsCalmDown",
        charactersInvolved: ["Teacher1"],
        Teacher1: {
            mood: ["neutral", "angry"],
            position: ["current"],
            description: ["tells students to calm down", "tells students to stop"],
        },
        importance: [5, 10],
        nextEvents: ["StudentBecomesIdle"],
    },
    studentsGather: {
        name: "studentsGather",
        charactersInvolved: ["allStudents"],
        allStudents: {
            mood: ["current", "neutral"],
            position: ["table", "rug"],
            description: ["students gather", "students go to nap time"],
        },
        importance: [3, 9],
        nextEvents: [],
    },
    StudentBecomesIdle: {
        name: "StudentBecomesIdle",
        charactersInvolved: ["Student1"],
        Student1: {
            mood: ["neutral"],
            position: ["current"],
            description: ["student becomes idle"],
        },
        importance: [0, 9],
        nextEvents: [],
    },
    studentSneaksAway: {
        name: "studentSneaksAway",
        charactersInvolved: ["Student1"],
        Student1: {
            mood: ["neutral", "angry", "sad"],
            position: ["corner"],
            description: ["sneaks away"],
        },
        nextEvents: ["studentPlaysWithToys"],
    },
    studentPlaysWithToys: {
        name: "studentPlaysWithToys",
        charactersInvolved: ["Student1"],
        Student1: {
            mood: ["neutral", "happy"],
            position: ["current"],
            description: ["plays with toy"],
        },
        nextEvents: [],
    },
    studentPutInCorner: {
        name: "studentPutInCorner",
        charactersInvolved: ["Student1"],
        Student1: {
            mood: ["sad", "angry", "neutral"],
            position: ["corner"],
            description: ["student get put in corner"],
        },
        nextEvents: ["StudentBecomesIdle", "studentsGather"],
    },
    studentHappy: {
        name: "studentHappy",
        charactersInvolved: ["Student1"],
        Student1: {
            mood: ["happy"],
            position: ["current"],
            description: ["student is happy"],
        },
        nextEvents: [],
    },
    studentUncomfortable: {
        name: "studentUncomfortable",
        charactersInvolved: ["Student1"],
        Student1: {
            mood: ["sad"],
            position: ["current"],
            description: ["student is uncomfortable"],
        },
        nextEvents: [],
    },
    studentCries: {
        name: "studentCries",
        charactersInvolved: ["Student1"],
        Student1: {
            mood: ["sad"],
            position: ["current"],
            description: ["student is sad"],
        },
        nextEvents: [],
    },
    studentCausesDistraction: {
        name: "studentCausesDistraction",
        charactersInvolved: ["Student1"],
        Student1: {
            mood: ["sad"],
            position: ["current"],
            description: ["crying", "yells", "breaks toy", "breaks material"],
        },
        nextEvents: [],
    },
    napTime: {
        name: "napTime",
        charactersInvolved: ["allStudents"],
        allStudents: {
            mood: ["sad", "happy", "neutral"],
            position: ["rug"],
            description: ["students sleep"],
        },
        nextEvents: ["napTimeInterrupted"],
    },
    napTimeInterrupted: {
        name: "napTimeInterrupted",
        charactersInvolved: ["Student1"],
        Student1: {
            mood: ["angry", "happy", "neutral"],
            position: ["rug", "current"],
            description: ["student wakes up"],
        },
        nextEvents: ["teacherCallsCalmDown"],
    },
    studentGetsBored: {
        name: "studentGetsBored",
        charactersInvolved: ["Student1"],
        Student1: {
            mood: ["sad"],
            position: ["current"],
            description: ["student becomes bored"],
        },
        nextEvents: [],
    },
    studentGetsTired: {
        name: "studentGetsTired",
        charactersInvolved: ["Student1"],
        Student1: {
            mood: ["tired"],
            position: ["current"],
            description: ["student becomes tired"],
        },
        nextEvents: [],
    },
    teacherGetsTired: {
        name: "teacherGetsTired",
        charactersInvolved: ["Teacher1"],
        Teacher1: {
            mood: ["tired"],
            position: ["current"],
            description: ["teacher becomes tired"],
        },
        nextEvents: [],
    },
    studentEatsSnack: {
        name: "studentEatsSnack",
        charactersInvolved: ["Student1"],
        Student1: {
            mood: ["happy", "neutral"],
            position: ["current", "corner"],
            description: ["snack time"],
        },
        nextEvents: [],
    },
    studentYells: {
        name: "studentYells",
        charactersInvolved: ["Student1"],
        Student1: {
            mood: ["neutral", "angry", "sad"],
            position: ["current", "corner"],
            description: ["student yells"],
        },
        nextEvents: [],
    },
    studentRuns: {
        name: "studentRuns",
        charactersInvolved: ["Student1"],
        Student1: {
            mood: ["sad", "happy"],
            position: ["table", "rug"],
            description: ["Student runs around classroom"],
        },
        nextEvents: [],
    },
    TeacherGetsAngry: {
        name: "TeacherGetsAngry",
        charactersInvolved: ["Teacher1"],
        Teacher1: {
            mood: ["angry", "sad", "neutral"],
            position: ["current", "corner"],
            description: ["teacher anger"],
        },
        nextEvents: [],
    },
    teacherTalksToStudents: {
        name: "teacherTalksToStudents",
        charactersInvolved: ["Teacher1", "allStudents"],
        Teacher1: {
            mood: ["neutral", "angry"],
            position: ["table", "rug", "current"],
            description: ["teacher addresses students"],
        },
        allStudents: {
            mood: ["current"],
            position: ["table", "rug"],
            description: ["students gather", "students go to nap time"],
        },
        nextEvents: [],
    },
    studentPlaysWithStudent: {
        name: "studentPlaysWithStudent",
        charactersInvolved: ["Student1", "Student2"],
        Student1: {
            mood: ["happy", "neutral"],
            position: ["rug"],
            description: ["student a plays with student b"],
        },
        Student2: {
            mood: ["happy", "neutral"],
            position: ["rug"],
            description: ["student b plays with student a"],
        },
        nextEvents: ["studentPlaysWithToys", "twoStudentsFight"],
    },
    studentHungry: {
        name: "studentHungry",
        charactersInvolved: ["Student1"],
        Student1: {
            mood: ["sad", "angry"],
            position: ["current"],
            description: ["student is hungry"],
        },
        nextEvents: ["studentEatsSnack"],
    },
    studentSits: {
        name: "studentSits",
        charactersInvolved: ["Student1", "Student2"],
        Student1: {
            mood: ["neutral"],
            position: ["table", "rug"],
            description: ["Student takes a seat"],
        },
        Student2: {
            mood: ["neutral"],
            position: ["table", "rug"],
            description: ["Student takes a seat"],
        },
        nextEvents: [],
    },
    studentGoesToCarpet: {
        name: "studentGoesToCarpet",
        charactersInvolved: ["Student1"],
        Student1: {
            mood: ["neutral", "happy"],
            position: ["rug", "current"],
            description: ["goes to carpet"],
        },
        nextEvents: ["studentRuns", "studentCries", "studentPutInCorner", "twoStudentsFight", "studentSneaksAway"],
    },
    studentHurtThemself: {
        name: "studentHurtThemself",
        charactersInvolved: ["Student1"],
        Student1: {
            mood: ["angry", "sad"],
            position: ["current"],
            description: ["student hurts themself"],
        },
        nextEvents: ["studentCries", "studentYells", "studentUncomfortable"],
    },
    teacherMovesTowardsStudent: {
        name: "teacherMovesTowardsStudent",
        charactersInvolved: ["Teacher1", "Student1"],
        Teacher1: {
            mood: ["neutral", "tired"],
            position: ["Student1"],
            description: ["moves to student"],
        },
        Student1: {
            mood: ["neutral", "tired"],
            position: ["Student1"],
            description: ["moves to student"],
        },
        nextEvents: [],
    },
    studentFireDrill: {
        name: "studentFireDrill",
        charactersInvolved: ["allStudents"],
        allStudents: {
            mood: ["happy"],
            position: ["wall"],
            description: ["students prep for fire drill"],
        },
        nextEvents: ["studentRuns", "studentUncomfortable", "studentYells", "napTimeInterrupted"],
    },
    teacherTeaches: {
        name: "teacherTeaches",
        charactersInvolved: ["allStudents", "Teacher1"],
        allStudents: {
            mood: ["happy", "current"],
            position: ["rug", "table"],
            description: ["students listen to teacher"],
        },
        Teacher1: {
            mood: ["happy", "current"],
            position: ["rug", "table"],
            description: ["teacher teaches students in class"],
        },
        nextEvents: ["studentsGather"],
    },
    studentCrafts: {
        name: "studentCrafts",
        charactersInvolved: ["Student1"],
        Student1: {
            mood: ["happy", "neutral"],
            position: ["table"],
            description: ["student does crafts"],
        },
        nextEvents: [],
    },
    studentSteals: {
        name: "studentSteals",
        charactersInvolved: ["Student1", "Student2"],
        Student1: {
            mood: ["neutral"],
            position: ["current", "rug", "table"],
            description: ["student steals food from student B", "student steals toy from student B"],
        },
        Student2: {
            mood: ["sad", "angry"],
            position: ["current", "rug", "table"],
            description: ["student gets food stolen from student A", "student gets toy stolen from student B"],
        },
        nextEvents: ["twoStudentsFight"],
    },
    teacherMovesToStudent: {
        name: "teacherMovesToStudent",
        charactersInvolved: ["Student1", "Teacher1"],
        Student1: {
            mood: ["sad", "neutral"],
            position: ["current"],
            description: ["Teacher is moving to student"],
        },
        Teacher1: {
            mood: ["sad"],
            position: ["current", "Student1"],
            description: ["Teacher is moving to student"],
        },
        nextEvents: ["TeacherGetsAngry", "teacherNeedsBreak", "studentCries", "studentUncomfortable"],
    },
    teacherCleansMess: {
        name: "teacherCleansMess",
        charactersInvolved: ["Teacher1"],
        Teacher1: {
            mood: ["neutral"],
            position: ["current"],
            description: ["Teacher Cleans up Mess"],
        },
        nextEvents: ["teacherNeedsBreak", "teacherMovesToStudent"],
    },
    teacherReads: {
        name: "teacherReads",
        charactersInvolved: ["Teacher1"],
        Teacher1: {
            mood: ["happy", "neutral"],
            position: ["current"],
            description: ["Teacher is Reading"],
        },
        nextEvents: ["studentRuns", "studentGetsBored", "studentCries", "studentSits"],
    },
    teacherNeedsBreak: {
        name: "teacherNeedsBreak",
        charactersInvolved: ["Teacher1"],
        Teacher1: {
            mood: ["tired", "happy"],
            position: ["current"],
            description: ["Teacher needs a break"],
        },
        nextEvents: [],
    },
};
exports.default = StoryEvents;
