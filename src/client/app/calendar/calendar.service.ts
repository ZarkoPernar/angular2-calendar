import { EventEmitter } from '@angular/core';
const moment = require('moment/moment');

export interface CalEvent {
    id: number
    name: string
    startDate: string
    timeStart?: string
    endDate?: string
    createdAt?: number
    duration?: number
    startTime?: any
    endTime?: any
    offsetY?: number
    offsetX?: number
    height?: number
    width?: number
    left?: number    
}


export class CalendarService {
    items: CalEvent[] = []
    observe: any = {
        eventAdded: new EventEmitter(),
        modal: new EventEmitter(),
    }
    event: any = {
        name: '',
        startDate: '',
    }
    
    constructor() {
        this.items = [
            {   
                id: 1,
                name: 'Hello!',
                startDate: '02.04.2017',
                startTime: moment('02.04.2017. 10:00', 'MM.DD.YYYY. HH:mm'),
                timeStart: moment('02.04.2017. 10:00', 'MM.DD.YYYY. HH:mm').format('hh:mm a'),
            },
            {
                id: 2,
                name: 'Hello Again!',
                startDate: '02.01.2017',
                duration: 2,
                startTime: moment('02.01.2017. 12:00', 'MM.DD.YYYY. HH:mm'),
                timeStart: moment('02.01.2017. 12:00', 'MM.DD.YYYY. HH:mm').format('hh:mm a'),
                
            },
            {
                id: 3,
                name: 'Hello There!',
                startDate: '02.01.2017',
                startTime: moment('02.01.2017. 07:00', 'MM.DD.YYYY. HH:mm'),
                timeStart: moment('02.01.2017. 07:00', 'MM.DD.YYYY. HH:mm').format('hh:mm a'),
                
            },
            {
                id: 4,
                name: 'Hello Michael!',
                startDate: '02.01.2017',
                startTime: moment('02.01.2017. 07:30', 'MM.DD.YYYY. HH:mm'),
                timeStart: moment('02.01.2017. 07:30', 'MM.DD.YYYY. HH:mm').format('hh:mm a'),
            }
        ]
    }


    clearNew() {
        this.event = {
            name: '',
            startDate: ''
        }  
    }

    addNewEvent(event: CalEvent) {
        this.items.push(event || this.event) 
        this.observe.eventAdded.emit(Object.assign({}, event))
        this.clearNew()        
    }
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}