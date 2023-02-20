"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const STORYEVENTS_1 = __importDefault(require("../Config/STORYEVENTS"));
const ShuffleArray_1 = __importDefault(require("../Helper Functions/ShuffleArray"));
const Moods_1 = __importDefault(require("../Sprites/Emotions/Moods"));
const Locations_1 = __importDefault(require("../Navigation/Locations"));
const GenerateRandomNumber_1 = __importDefault(require("../Helper Functions/GenerateRandomNumber"));
class ClassroomEvent {
    constructor(storyEventName, classroom_) {
        this.storyEvents = new STORYEVENTS_1.default();
        this.classroom = classroom_;
        const cfg = this.convertStoryEvent(storyEventName, classroom_.getStudentList(), classroom_.getTeacherList());
        this.name = cfg.name;
        this.spriteList = cfg.spriteList;
        this.nextEvents = cfg.nextEvents;
    }
    convertStoryEvent(eventName, classroomStudentList, classroomTeacherList) {
        let newEvent = {
            name: "",
            spriteList: [],
            nextEvents: [],
        };
        // check if the event exists, if not throw an error
        if (!this.storyEvents.getEventNames().includes(eventName)) {
            throw new Error(`Unknown event name. No event (key) named ${eventName} appears in StoryEvents.json`);
        }
        // get the event from the StoryEvents json
        const tempEvent = this.storyEvents.getEvent(eventName);
        // set the event name
        newEvent.name = tempEvent.name;
        // set student list
        // need to know how many students are participating in event
        const numStudents = tempEvent.countStudents();
        const studentList = this.generateStudentList(numStudents, classroomStudentList);
        // set teacher list
        const numTeachers = tempEvent.countTeachers();
        const teacherList = this.generateTeacherList(numTeachers, classroomTeacherList);
        // add lists to spritelist
        newEvent.spriteList = [...studentList, ...teacherList];
        // make a list of student and teacher updates
        let studentUpdates = [];
        let teacherUpdates = [];
        for (const sprite of tempEvent.charactersInvolved) {
            if (sprite.name.includes("Teacher")) {
                teacherUpdates.push(sprite);
            }
            if (sprite.name.includes("Student")) {
                studentUpdates.push(sprite);
            }
        }
        // TODO maybe randomize teacherUpdates and StudentUpdates
        for (const sprite of newEvent.spriteList) {
            // Set Mood
            // Set Heading
            // Set Description
            if (sprite.name.includes("Teacher")) {
                const updates = teacherUpdates.pop();
                if (updates === undefined) {
                    throw new Error("updates is undefined, teacherUpdates.pop() may have popped an empty list");
                }
                else {
                    console.log(updates);
                    sprite.mood = new Moods_1.default(updates.mood[Math.floor((0, GenerateRandomNumber_1.default)(this.classroom.config.seed * 3 + 1) *
                        updates.mood.length)]);
                    const locationName = updates.pos[Math.floor((0, GenerateRandomNumber_1.default)(this.classroom.config.seed * 7) *
                        updates.pos.length)];
                    if (locationName.includes("Student")) {
                        // If heading for another student, head to a random student that isn't itself
                        for (const s of studentList) {
                            if (s.name == locationName) {
                                sprite.heading = s.pos;
                            }
                        }
                    }
                    else if (locationName.includes("Teacher")) {
                        for (const s of teacherList) {
                            if (s.name == locationName) {
                                sprite.heading = s.pos;
                            }
                        }
                    }
                    else if (locationName === "current" ||
                        locationName.includes("current")) {
                        sprite.heading = sprite.pos;
                    }
                    else {
                        // remove unwanted update names, such as student, teacher, and current
                        updates.pos = updates.pos.filter((e) => e !== "current");
                        updates.pos = updates.pos.filter((e) => !e.includes("Student"));
                        updates.pos = updates.pos.filter((e) => !e.includes("Teacher"));
                        const loc = new Locations_1.default(locationName, this.classroom);
                        sprite.heading = loc.chooseRandomPosition();
                    }
                    sprite.currentDescription =
                        updates.description[Math.floor((0, GenerateRandomNumber_1.default)(this.classroom.config.seed * 3 + 11) *
                            updates.description.length)];
                }
            }
            if (sprite.name.includes("Student")) {
                const updates = studentUpdates.pop();
                if (updates === undefined) {
                    throw new Error("updates is undefined, studentUpdates.pop() may have popped an empty list");
                }
                else {
                    sprite.mood = new Moods_1.default(updates.mood[Math.floor((0, GenerateRandomNumber_1.default)(this.classroom.config.seed +
                        this.classroom.config.roomSizeY * 2 +
                        this.classroom.config.numTeachers) * updates.mood.length)]);
                    const locationName = updates.pos[Math.floor((0, GenerateRandomNumber_1.default)(this.classroom.config.seed * 7 + this.classroom.config.numRugs) * updates.pos.length)];
                    if (locationName.includes("Student")) {
                        // If heading for another student, head to a random student that isn't itself
                        for (const s of studentList) {
                            if (s.name == locationName) {
                                sprite.heading = s.pos;
                            }
                        }
                        // remove Student from updates
                    }
                    else if (locationName.includes("Teacher")) {
                        for (const s of teacherList) {
                            if (s.name == locationName) {
                                sprite.heading = s.pos;
                            }
                        }
                    }
                    else if (locationName === "current" ||
                        locationName.includes("current")) {
                        sprite.heading = sprite.pos;
                    }
                    else {
                        // remove unwanted update names, such as student, teacher, and current
                        updates.pos = updates.pos.filter((e) => e !== "current");
                        updates.pos = updates.pos.filter((e) => !e.includes("Student"));
                        updates.pos = updates.pos.filter((e) => !e.includes("Teacher"));
                        const loc = new Locations_1.default(updates.pos[Math.floor((0, GenerateRandomNumber_1.default)(this.classroom.config.seed + 40) *
                            updates.pos.length)], this.classroom);
                        sprite.heading = loc.chooseRandomPosition();
                    }
                    sprite.currentDescription =
                        updates.description[Math.floor((0, GenerateRandomNumber_1.default)(this.classroom.config.seed +
                            this.classroom.config.roomSizeX * 3) * updates.description.length)];
                }
            }
        }
        // TODO set next events as a list of strings with event names
        return newEvent;
    }
    generateStudentList(numStudents, listOfStudents) {
        /* This will take Classroom.studentList
               then choose certain students to add to the event
               The students moods and headings will be updated in the event
               then Classroom will read the event, and create snapshots of the classroom
               updating sprites based on headings.
               until all sprites.heading = null again and there is no more state change */
        let participatingStudents = [];
        // randomize listOfStudents
        listOfStudents = (0, ShuffleArray_1.default)(listOfStudents);
        for (let i = 0; i < numStudents; i++) {
            const addStudent = listOfStudents.pop();
            if (addStudent === undefined) {
                throw new Error("Classroom does not have enough students to play this event. Please consider increasing number of students in the classroom");
            }
            else {
                participatingStudents.push(addStudent);
            }
        }
        return participatingStudents;
    }
    generateTeacherList(numTeachers, listOfTeachers) {
        let participatingTeachers = [];
        // shuffle list
        listOfTeachers = (0, ShuffleArray_1.default)(listOfTeachers);
        for (let i = 0; i < numTeachers; i++) {
            const addTeacher = listOfTeachers.pop();
            if (addTeacher === undefined) {
                throw new Error("Classroom does not have enough teachers to play this event. Please consider increasing number of teachers in the classroom");
            }
            else {
                participatingTeachers.push(addTeacher);
            }
        }
        return participatingTeachers;
    }
}
exports.default = ClassroomEvent;
