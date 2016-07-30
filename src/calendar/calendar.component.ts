import { Component, View, EventEmitter } from 'angular2/core';
import { NgFor, NgClass, FORM_DIRECTIVES } from 'angular2/common';

import {ModalComponent} from './modal/modal.component';
import CalendarService from './calendar.service'

const moment = require('moment/moment');

const NOW = moment()
const MONTHS = moment.months()
const MONTHS_SHORT = moment.monthsShort()
const WEEKDAYS = moment.weekdays()
const WEEKDAYS_SHORT = moment.weekdaysShort()
const WEEKDAYS_MIN = moment.weekdaysMin()

const getWeekNumber = m => Math.ceil(m.date() / 7)
const getMonthName = m => MONTHS[m.month()]
const TOTAL_DAYS_MONTH = 35;


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
    name: string
    startDate: string
} 

interface DAY {
    dayOfMonth: number
    dayOfWeek: string
    moment: any
    date: string
    events: Array<CalEvent>
}

@Component({
  selector: 'my-calendar',
  moduleId: module.id,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  directives: [ModalComponent, NgFor, NgClass, FORM_DIRECTIVES],
})

export class CalendarComponent {
    days: Array<DAY>
    weekdays: Array<string>
    weekdaysShort: Array<string>
    newEvent: CalEvent
    isModalOpen: boolean
    modality = new EventEmitter()
    
    viewType: string    
    selectedDay: string
    monthName: string
    weekNumber: number
    center: any
        
    constructor() {                    
                       
        this.monthName = getMonthName(NOW)                  
        this.weekdays = WEEKDAYS
        this.weekdaysShort = WEEKDAYS_SHORT
        this.center = NOW.clone()
        
        this.setStuff(this.center.clone())
        this.setCalView('Week');
        this.selectedDay = ''
    }
    
    setStuff(m) {
        this.center = m
        this.monthName = getMonthName(m)
        this.weekNumber = getWeekNumber(m)
    }
    
    
    
    build() {
        if (this.viewType === 'Week') {
            this.days = WeekFactory(this.center);
        } else {
            this.days = MonthFactory(this.center); 
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
        } else {
            this.selectedDay = day.date   
        }          
    }
    
    eventClick(event, jsEvent) {
        jsEvent.stopPropagation()
        console.log(event);        
    }
    
    moveCalLeft() {
        let newM;
        if (this.viewType === 'Week') {
            newM = this.center.clone().subtract(1, 'weeks')
        } else {
            newM = this.center.clone().subtract(1, 'months')
        }
        this.setStuff(newM)
        this.build()
    }
    
    moveCalRight() {
        let newM;
        if (this.viewType === 'Week') {
            newM = this.center.clone().add(1, 'weeks')
        } else {
            newM = this.center.clone().add(1, 'months')
        }
        this.setStuff(newM)
        this.build()
    }
    
    openModal() {                
        this.isModalOpen = true
        this.modality.next()
    }
    
}

function MonthFactory(m) {  
    let startAt = m.clone().startOf('month')
    let endAt = m.clone().endOf('month')
    
    let monthTotal = endAt.date()
    let remain = TOTAL_DAYS_MONTH - monthTotal;
    let days = [DayFactory(startAt.clone())];
    let insertFront = remain ? days[0].dayOfWeek : 0;
    let insertBack = remain ? remain - insertFront : 0;           
        
    for (var i = 1; i < monthTotal; i++) {
        days.push(DayFactory(startAt.clone().add(i, 'day')));
    }
        
    if (insertFront) {
        let i;
        for (i = 1; i <= insertFront; i++) {            
            let momento = startAt.clone().subtract(i, 'day')
            days.unshift(DayFactory(momento));
        }        
    }
        
    if (insertBack) {
        let i;
        for (i = 1; i <= insertBack; i++) {
            let momento = endAt.clone().add(i, 'day')
            days.push(DayFactory(momento));
        }
    }    
    
    return days;
}

function WeekFactory(m) {
    let startAt =   m.clone().startOf('week')
    let days = [DayFactory(startAt.clone())];
    
    for (var i = 1; i < 7; i++) {
        days.push(DayFactory(startAt.clone().add(i, 'day')));
    }
        
    return days;
}

function DayFactory(m) {
    let dayOfMonth = m.date(),
        dayOfWeek = m.weekday(),
        date = m.format('MM.DD.YYYY'),
        weekday = moment.weekdays(dayOfWeek);
        
    return {
        dayOfMonth: dayOfMonth, 
        dayOfWeek: dayOfWeek,
        weekday: weekday,
        date: date,
        isToday: NOW.isSame(m, 'day'),
        events: [],
        
        // add moment just cause
        moment: m,
    }
}