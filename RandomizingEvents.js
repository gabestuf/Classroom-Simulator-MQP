const data = require('./STORYEVENTS.json')
const jsonLength = require('./js/scripts/objLength')
const getRandomKey = require('./js/scripts/objRandomKey')



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
    const semiRandomEventsRecursive = (numOfEvents, json) => {
        let EventsToPullFrom = json
        let i = 0;

        while (i < numOfEvents) {
            const key = getRandomKey(EventsToPullFrom)
            const event = EventsToPullFrom[key]
            let obj = {}
            obj[key] = event
            console.log("ASASCD")
            console.log(event)
            EventArray.push(obj)
            if ("nextEvents" in event && event.nextEvents.length > 0) {
                console.log("ASDASDASD")
                const nextEventsObj = {}
                for (const key of event.nextEvents) {
                    nextEventsObj[key] = EventsToPullFrom[key]
                }
                console.log(nextEventsObj)
                semiRandomEventsRecursive(numOfEvents - i, nextEventsObj)
            }
            i++
        }
    }
    semiRandomEventsRecursive(numOfEvents, json)
    return EventArray
}
console.log(semiRandomEvents(1, data))