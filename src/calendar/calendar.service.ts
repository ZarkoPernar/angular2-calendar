const moment = require('moment/moment');

interface CalEvent {
    name: string
    startDate: string
    endDate?: string
    createdAt?: number
    duration?: number
    startTime?: any
}

interface Subscribers {
    event_added: Array<Function>
}

class CalendarService {
    subscribers: Subscribers 
    items: Array<CalEvent>
    event: CalEvent
    
    constructor() {
        this.subscribers = {
            event_added: []
        }

        this.items = [
            {
                name: 'Hello!',
                startDate: '09.20.2016',
                startTime: moment('09.21.2016. 10:00', 'MM.DD.YYYY. HH:mm'),
            },
            {
                name: 'Hello Again!',
                startDate: '09.21.2016',
                duration: 2,
                startTime: moment('09.21.2016. 12:00', 'MM.DD.YYYY. HH:mm'),
            },
            {
                name: 'Hello There!',
                startDate: '09.21.2016',
                startTime: moment('09.21.2016. 07:00', 'MM.DD.YYYY. HH:mm'),
            },
            {
                name: 'Hello Michael!',
                startDate: '09.21.2016',
                startTime: moment('09.21.2016. 06:00', 'MM.DD.YYYY. HH:mm'),
            }
        ]
        this.event = {
            name: '',
            startDate: '',
        }
    }


    clearNew() {
        this.event = {
            name: '',
            startDate: ''
        }  
    }

    addNewEvent(event) {
        this.items.push(event || this.event)    
        this.clearNew()

        if (this.subscribers.event_added && this.subscribers.event_added.length) {
            this.subscribers.event_added.forEach(cb => cb(event))
        }
    }

    emit(name, data) {
        if (this.subscribers[name] && this.subscribers[name].length) {
            this.subscribers[name].forEach(cb => cb(data))
        }
    }

    subscribe(name, cb) {
        this.subscribers[name] = this.subscribers[name] || []
        this.subscribers[name].push(cb)

        return function unsubscribe() {
            let index = this.subscribers[name].findIndex(cb)
            this.subscribers[name].splice(index, 1)
        }
    }
}

export {CalendarService, CalEvent}


/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}