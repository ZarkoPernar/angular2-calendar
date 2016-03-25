import { Component, View } from 'angular2/core';
import { NgFor, NgClass, FORM_DIRECTIVES } from 'angular2/common';

import {DayComponent} from './day/day.component';

const moment = require('moment/moment');

const NOW = moment()
const MONTHS = moment.months()
const MONTHS_SHORT = moment.monthsShort()
const WEEKDAYS = moment.weekdays()
const WEEKDAYS_SHORT = moment.weekdaysShort()
const WEEKDAYS_MIN = moment.weekdaysMin()
const NTH_OF_MONTH = Math.ceil(NOW.date() / 7)
const TOTAL_DAYS = 35;

const CAL_N_DAYS = NOW.daysInMonth(); //const for now
const CURRENT_WEEK = getWeekIndex(moment())

let events = [
    {
        name: 'Hello!',
        startDate: '03.11.2016'
    },
    {
        name: 'Hello Again!',
        startDate: '03.18.2016'
    }
]
    
interface CalEvent {
    name: String
    startDate: String
} 

interface DAY {
    dayOfMonth: Number
    dayOfWeek: String
    moment: any
    date: String
    events: Array<CalEvent>
}

@Component({
  selector: 'my-calendar',
  moduleId: module.id,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  directives: [DayComponent, NgFor, NgClass, FORM_DIRECTIVES],
})

export class CalendarComponent {
    days: Array<DAY>
    weekdays: Array<String>
    weekdaysShort: Array<String>
    viewType: String
    newEvent: CalEvent
    selectedWeek: Number
    selectedDay: String
        
    constructor() {                    
        this.selectedWeek = CURRENT_WEEK
                        
        this.viewType = 'Month';                    
        this.weekdays = WEEKDAYS
        this.weekdaysShort = WEEKDAYS_SHORT
        this.build();     
        this.clearNew()
    }
    
    clearNew() {
        this.newEvent = {
            name: '',
            startDate: ''
        }  
    }
    
    build() {
        if (this.viewType === 'Week') {
            let start = moment().date()
            this.days = MonthFactory((start + 7), (start + 7), start); 
        } else {
            this.days = MonthFactory(CAL_N_DAYS, TOTAL_DAYS, 1); 
        }
        this.addEvents()
    }
    
    addEvents() {
        events.forEach(event => this.addEvent(event))
    }
    
    setCalView(type) {        
        this.viewType = type;
        this.build()
    }
    
    addNewEvent() {
        this.addEvent(this.newEvent)    
        this.clearNew()
    }
    
    addEvent(event) {       
        let index = this.days.findIndex(day => day.date === event.startDate)
        if (index === -1) {
            return
        }
        this.days[index].events.push(event)
    }
    
    dayClick(day, jsEvent) {
        if (day.date === this.selectedDay) {
            this.selectedDay = ''     
            this.clearNew()       
        } else {
            this.newEvent.startDate = day.date
            this.selectedDay = day.date   
        }          
    }
    
    eventClick(event, jsEvent) {
        jsEvent.stopPropagation()
        console.log(event);        
    }
    
}

function MonthFactory(endAt, total, startAt) {
    console.log(endAt, total, startAt);
    
    const remain = total - endAt;
    let days = [];
    let insert = []
    let main = [];
    let insertFront = 0;
    let insertBack = 0;        
    
    for (var i = startAt; i < (endAt + 1); i++) {
        main.push(DayFactory(i));
    }
    
    insertFront = remain ? main[0].dayOfWeek : 0;
    insertBack = remain ? remain - insertFront : 0
        
    if (insertFront) {
        for (let inF = 0; inF < insertFront; inF++) {
            insert.push(DayFactory(((inF + 1) - insertFront)));
        }
    }
    
    days = insert.concat(main)
    
    if (insertBack) {
        for (let inB = 0; inB < insertBack; inB++) {
            days.push(DayFactory(((inB + 1) + endAt)));
        }
    }    
    
    return days;
}

function DayFactory(i) {
    let mm = moment().date(i),
        dayOfMonth = mm.date(),
        dayOfWeek = mm.weekday(),
        date = mm.format('MM.DD.YYYY'),
        weekday = moment.weekdays(dayOfWeek);
        
    return {
        dayOfMonth: dayOfMonth, 
        dayOfWeek: dayOfWeek,
        weekday: weekday,
        date: date,
        isToday: NOW.isSame(mm, 'day'),
        events: [],
        
        // add moment just cause
        moment: moment(i),
    }
}

function getWeekIndex(m) {
    return Math.ceil(m.date() / 7)
}