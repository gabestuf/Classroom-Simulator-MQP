import Student from "../Sprites/Student";
import Teacher from "../Sprites/Teacher";
import StoryEvents, { iUpdatedSprite, StoryEvent } from "../Config/STORYEVENTS";
import Classroom from "../Classroom";
import shuffleArray from "../Helper Functions/ShuffleArray";
import iSprite from "../Sprites/iSprite";
import Mood from "../Sprites/Emotions/Moods";
import ClassroomLocation from "../Navigation/Locations";
import seededRandom from "../Helper Functions/GenerateRandomNumber";

interface ConvertedEvent {
  name: string;
  spriteList: iSprite[];
  nextEvents: string[];
}

class ClassroomEvent {
  name: string;
  spriteList: iSprite[];
  nextEvents: string[];
  storyEvents: StoryEvents = new StoryEvents();
  classroom: Classroom;

  constructor(storyEventName: string, classroom_: Classroom) {
    this.classroom = classroom_;

    const cfg = this.convertStoryEvent(
      storyEventName,
      classroom_.getStudentList(),
      classroom_.getTeacherList()
    );

    this.name = cfg.name;
    this.spriteList = cfg.spriteList;
    this.nextEvents = cfg.nextEvents;
  }

  convertStoryEvent(
    eventName: string,
    classroomStudentList: Student[],
    classroomTeacherList: Teacher[]
  ): ConvertedEvent {
    let newEvent: ConvertedEvent = {
      name: "",
      spriteList: [],
      nextEvents: [],
    };

    // check if the event exists, if not throw an error
    if (!this.storyEvents.getEventNames().includes(eventName)) {
      throw new Error(
        `Unknown event name. No event (key) named ${eventName} appears in StoryEvents.json`
      );
    }

    // get the event from the StoryEvents json
    const tempEvent: StoryEvent = this.storyEvents.getEvent(eventName);

    // set the event name
    newEvent.name = tempEvent.name;

    // set student list
    // need to know how many students are participating in event
    const numStudents = tempEvent.countStudents();
    const studentList = this.generateStudentList(
      numStudents,
      classroomStudentList
    );
    // set teacher list
    const numTeachers = tempEvent.countTeachers();
    const teacherList = this.generateTeacherList(
      numTeachers,
      classroomTeacherList
    );

    // add lists to spritelist
    newEvent.spriteList = [...studentList, ...teacherList];

    // make a list of student and teacher updates
    let studentUpdates: Array<iUpdatedSprite> = [];
    let teacherUpdates: Array<iUpdatedSprite> = [];

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
          throw new Error(
            "updates is undefined, teacherUpdates.pop() may have popped an empty list"
          );
        } else {
          console.log(updates);
          sprite.mood = new Mood(
            updates.mood[
              Math.floor(
                seededRandom(this.classroom.config.seed * 3 + 1) *
                  updates.mood.length
              )
            ]
          );

          const locationName: string =
            updates.pos[
              Math.floor(
                seededRandom(this.classroom.config.seed * 7) *
                  updates.pos.length
              )
            ];

          if (locationName.includes("Student")) {
            // If heading for another student, head to a random student that isn't itself
            for (const s of studentList) {
              if (s.name == locationName) {
                sprite.heading = s.pos;
              }
            }
          } else if (locationName.includes("Teacher")) {
            for (const s of teacherList) {
              if (s.name == locationName) {
                sprite.heading = s.pos;
              }
            }
          } else if (
            locationName === "current" ||
            locationName.includes("current")
          ) {
            sprite.heading = sprite.pos;
          } else {
            // remove unwanted update names, such as student, teacher, and current
            updates.pos = updates.pos.filter((e) => e !== "current");
            updates.pos = updates.pos.filter((e) => !e.includes("Student"));
            updates.pos = updates.pos.filter((e) => !e.includes("Teacher"));

            const loc = new ClassroomLocation(locationName, this.classroom);
            sprite.heading = loc.chooseRandomPosition();
          }

          sprite.currentDescription =
            updates.description[
              Math.floor(
                seededRandom(this.classroom.config.seed * 3 + 11) *
                  updates.description.length
              )
            ];
        }
      }

      if (sprite.name.includes("Student")) {
        const updates = studentUpdates.pop();
        if (updates === undefined) {
          throw new Error(
            "updates is undefined, studentUpdates.pop() may have popped an empty list"
          );
        } else {
          sprite.mood = new Mood(
            updates.mood[
              Math.floor(
                seededRandom(
                  this.classroom.config.seed +
                    this.classroom.config.roomSizeY * 2 +
                    this.classroom.config.numTeachers
                ) * updates.mood.length
              )
            ]
          );
          const locationName: string =
            updates.pos[
              Math.floor(
                seededRandom(
                  this.classroom.config.seed * 7 + this.classroom.config.numRugs
                ) * updates.pos.length
              )
            ];

          if (locationName.includes("Student")) {
            // If heading for another student, head to a random student that isn't itself
            for (const s of studentList) {
              if (s.name == locationName) {
                sprite.heading = s.pos;
              }
            }
            // remove Student from updates
          } else if (locationName.includes("Teacher")) {
            for (const s of teacherList) {
              if (s.name == locationName) {
                sprite.heading = s.pos;
              }
            }
          } else if (
            locationName === "current" ||
            locationName.includes("current")
          ) {
            sprite.heading = sprite.pos;
          } else {
            // remove unwanted update names, such as student, teacher, and current
            updates.pos = updates.pos.filter((e) => e !== "current");
            updates.pos = updates.pos.filter((e) => !e.includes("Student"));
            updates.pos = updates.pos.filter((e) => !e.includes("Teacher"));

            const loc = new ClassroomLocation(
              updates.pos[
                Math.floor(
                  seededRandom(this.classroom.config.seed + 40) *
                    updates.pos.length
                )
              ],
              this.classroom
            );
            sprite.heading = loc.chooseRandomPosition();
          }

          sprite.currentDescription =
            updates.description[
              Math.floor(
                seededRandom(
                  this.classroom.config.seed +
                    this.classroom.config.roomSizeX * 3
                ) * updates.description.length
              )
            ];
        }
      }
    }

    // TODO set next events as a list of strings with event names

    return newEvent;
  }

  generateStudentList(
    numStudents: number,
    listOfStudents: Student[]
  ): Student[] {
    /* This will take Classroom.studentList
           then choose certain students to add to the event 
           The students moods and headings will be updated in the event
           then Classroom will read the event, and create snapshots of the classroom
           updating sprites based on headings. 
           until all sprites.heading = null again and there is no more state change */
    let participatingStudents: Student[] = [];
    // randomize listOfStudents
    listOfStudents = shuffleArray(listOfStudents);
    for (let i = 0; i < numStudents; i++) {
      const addStudent = listOfStudents.pop();
      if (addStudent === undefined) {
        throw new Error(
          "Classroom does not have enough students to play this event. Please consider increasing number of students in the classroom"
        );
      } else {
        participatingStudents.push(addStudent);
      }
    }

    return participatingStudents;
  }

  generateTeacherList(
    numTeachers: number,
    listOfTeachers: Teacher[]
  ): Teacher[] {
    let participatingTeachers: Student[] = [];
    // shuffle list
    listOfTeachers = shuffleArray(listOfTeachers);

    for (let i = 0; i < numTeachers; i++) {
      const addTeacher = listOfTeachers.pop();
      if (addTeacher === undefined) {
        throw new Error(
          "Classroom does not have enough teachers to play this event. Please consider increasing number of teachers in the classroom"
        );
      } else {
        participatingTeachers.push(addTeacher);
      }
    }

    return participatingTeachers;
  }
}

export default ClassroomEvent;
