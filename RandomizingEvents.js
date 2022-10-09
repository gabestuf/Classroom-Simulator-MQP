const data = require('./STORYEVENTS.json')
const jsonLength = require('./js/scripts/objLength')
const getRandomKey = require('./js/scripts/objRandomKey')
const fs = require('fs')



const randomEvents = (numOfEvents, json) => {
    let EventArray = []
    let EventsToPullFrom = json

    // get a random key

    for (let i = 0; i < numOfEvents; i++) {
        const key = getRandomKey(EventsToPullFrom)
        let obj = {}
        obj[key] = EventsToPullFrom[key]
        EventArray.push(obj)
    }
    return EventArray
}

const randomEventsNonReplace = (numOfEvents, json) => {
    let EventArray = []
    let EventsToPullFrom = json

    // get a random key

    for (let i = 0; i < numOfEvents; i++) {
        const key = getRandomKey(EventsToPullFrom)
        let obj = {}
        obj[key] = EventsToPullFrom[key]
        EventArray.push(obj)
        delete EventsToPullFrom[key]
    }
    return EventArray
}

const semiRandomEvents = (numOfEvents, json) => {
    let EventArray = []
    let i = 0;

    const semiRandomEventsRecursive = (numOfEvents, json) => {
        let EventsToPullFrom = json

        while (i < numOfEvents) {
            const key = getRandomKey(EventsToPullFrom)
            console.log(key)
            const event = EventsToPullFrom[key]
            let obj = {}
            obj[key] = event
            // console.log("ASASCD")
            // console.log(event)
            EventArray.push(obj)
            i++
            if ("nextEvents" in event && event.nextEvents.length > 0) {
                // console.log("ASDASDASD")
                const nextEventsObj = {}
                for (const key of event.nextEvents) {
                    nextEventsObj[key] = EventsToPullFrom[key]
                }
                // console.log(nextEventsObj)
                semiRandomEventsRecursive(numOfEvents - i, nextEventsObj)
            }
        }
    }
    semiRandomEventsRecursive(numOfEvents, json)
    return EventArray
}


const objToFile = (obj) => {
    fs.writeFile("./obj.txt", JSON.stringify(obj), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}
const eventList = semiRandomEvents(3, data)
objToFile(eventList)

