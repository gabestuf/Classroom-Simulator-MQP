const STORYEVENTS = require("./STORYEVENTS.json");
const getRandomKey = require("./js/scripts/objRandomKey");
const getRandomArrayElement = require("./js/scripts/getRandomElement");
const objToFile = require("./js/scripts/objToFile")

const CONFIG = {
  howManyEvents: 15,
  writeToFile: true,
  consoleLog: false,
  // For function, please write a number
  /*
    0. Random Events. Events are completely randomized. Events can happen more than once
    1. Random Events, no repeat events. (choosing more events than exist will return all events, randomized)
    2. Semi Random Events, will chain events that point to next events using the nextEvents field
  */
  function: 2,
  data: STORYEVENTS
}

const randomEvents = (numOfEvents, json) => {
  let EventArray = [];
  let EventsToPullFrom = json;

  // get a random key

  for (let i = 0; i < numOfEvents; i++) {
    const key = getRandomKey(EventsToPullFrom);
    let obj = {};
    obj[key] = EventsToPullFrom[key];
    EventArray.push(obj);
  }
  return EventArray;
};

const randomEventsNonReplace = (numOfEvents, json) => {
  let EventArray = [];
  let EventsToPullFrom = json;
  const counter = numOfEvents

  // get a random key

  for (let i = 0; i < numOfEvents; i++) {
    if (counter == 0) {
      return EventArray
    }
    const key = getRandomKey(EventsToPullFrom);
    let obj = {};
    obj[key] = EventsToPullFrom[key];
    EventArray.push(obj);
    delete EventsToPullFrom[key];
  }
  return EventArray;
};

const semiRandomEvents = (numOfEvents, json) => {
  let allEvents = json
  let EventArray = [];

  const semiRandomEventsRecursive = (EventsToPullFrom) => {

    if (EventArray.length < numOfEvents) { // While we have not hit max number of events
      // pick a random event from EventsToPullFrom
      const key = getRandomKey(EventsToPullFrom);
      const anEvent = EventsToPullFrom[key];
      let obj = {};
      obj[key] = anEvent;
      // add this event to a new array 
      EventArray.push(obj);

      // if this event has follow up events (nextEvents)
      // we want to pick one of these next events as the next event
      if (Object.keys(anEvent).includes("nextEvents")) {
        if (anEvent.nextEvents.length > 0) {
          const nextEventsObj = {};
          for (const k of anEvent.nextEvents) {
            nextEventsObj[k] = allEvents[k];
          }
          semiRandomEventsRecursive(nextEventsObj);
        }
      }
      semiRandomEventsRecursive(allEvents)
    }
  };
  semiRandomEventsRecursive(allEvents);


  return EventArray;
};




const generateEventList = (config) => {

  let eventList = []

  switch (config.function) {
    case 0:
      eventList = randomEvents(config.howManyEvents, config.data)
      break;
    case 1:
      eventList = randomEventsNonReplace(config.howManyEvents, config.data)
      break;
    case 2:
      eventList = semiRandomEvents(config.howManyEvents, config.data)
      break;
    default:
      console.error("NOT A VALID FUNCTION, check config")
      break;
  }
  //console.log(JSON.stringify(eventList))
  //console.log("=====================================================")
  //Pick random mood, position, description for each event 
  for (const obj of eventList) {
    //console.log(obj)
    for (const character of obj[Object.keys(obj)[0]].charactersInvolved) {
      const moodArray = obj[Object.keys(obj)[0]][character].mood
      obj[Object.keys(obj)[0]][character].mood = getRandomArrayElement(moodArray)
      const positionArray = obj[Object.keys(obj)[0]][character].position
      obj[Object.keys(obj)[0]][character].position = getRandomArrayElement(positionArray)
      const descriptionArray = obj[Object.keys(obj)[0]][character].description
      obj[Object.keys(obj)[0]][character].description = getRandomArrayElement(descriptionArray)
    }
  }

  if (config.consoleLog) {
    console.log(eventList)
  }
  if (config.writeToFile) {
    objToFile(eventList)
  }
}

generateEventList(CONFIG)