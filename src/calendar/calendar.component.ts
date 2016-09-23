import { Component, View, EventEmitter } from 'angular2/core';
import { NgFor, NgClass, FORM_DIRECTIVES } from 'angular2/common';

import {ModalComponent} from './modal/modal.component';
import {CalendarService, CalEvent} from './calendar.service'
import CalDay from './day/day.component'
import CalWeek from './week/week.component'

const moment = require('moment/moment');

const NOW = moment()
const MONTHS = moment.months()
const MONTHS_SHORT = moment.monthsShort()
const WEEKDAYS = moment.weekdays()
const WEEKDAYS_SHORT = moment.weekdaysShort()
const WEEKDAYS_MIN = moment.weekdaysMin()

const getWeekNumber = m => Math.ceil(m.date() / 7)
const getMonthName = m => MONTHS[m.month()]

interface DAY {
    dayOfMonth: number
    dayOfWeek: string
    moment: any
    date: string
}

@Component({
  selector: 'my-calendar',
  moduleId: module.id,
  styleUrls: ['./calendar.component.css'],
  templateUrl: './calendar.component.html',
  directives: [CalDay, CalWeek, ModalComponent, NgFor, NgClass, FORM_DIRECTIVES],
})

export class CalendarComponent {
    days: Array<DAY>
    weekdays: any
    months: Array<string>
    newEvent: CalEvent
    isModalOpen: boolean
    monthDropdownVisible: boolean
    modality = new EventEmitter()
    events: any

    service: CalendarService
    
    viewType: string    
    selectedDay: string
    monthName: string
    weekNumber: number
    center: any
        
    constructor() {   
        this.service = new CalendarService()      
                       
        this.monthName = getMonthName(NOW)                  
        this.weekdays = {
            long: WEEKDAYS,
            short: WEEKDAYS_SHORT,
        }
        this.months = MONTHS
        this.center = NOW.clone()

        this.events = {}
        
        this.setStuff(this.center.clone())
        this.setCalView('Week');
        this.selectedDay = ''

        this.addEvents()

        this.service.subscribe('event_added', this.addEvent.bind(this))
        this.service.subscribe('modal_closed', this.modalClosed.bind(this))

        this.monthDropdownVisible = false
    }
    
    setStuff(m) {
        this.center = m
        this.monthName = getMonthName(m)
        this.weekNumber = getWeekNumber(m)
        this.build()
    }
    
    build() {
        if (this.viewType === 'Week') {
            this.days = WeekFactory(this.center);
        } else {
            this.days = MonthFactory(this.center); 
        }
    }
    
    addEvents() {
        this.service.items.forEach(event => this.addEvent(event))
    }

    addEvent(event) {
        if (!this.events[event.startDate]) {
            this.events[event.startDate] = [event]
        } else {
            this.events[event.startDate] = this.events[event.startDate].concat([event])
        }
    }
    
    setCalView(type) {        
        this.viewType = type;
        this.build()
    }

    toggleMonthDropdown() {
        this.monthDropdownVisible = !this.monthDropdownVisible
    }

    selectMonth(month) {
        let m = moment().month(month)
        this.monthDropdownVisible = false
        this.setStuff(m)
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
        console.log(event)
    }
    
    moveCalLeft() {
        let newM;
        if (this.viewType === 'Week') {
            newM = this.center.clone().subtract(1, 'weeks')
        } else {
            newM = this.center.clone().subtract(1, 'months')
        }
        this.setStuff(newM)
    }
    
    moveCalRight() {
        let newM;
        if (this.viewType === 'Week') {
            newM = this.center.clone().add(1, 'weeks')
        } else {
            newM = this.center.clone().add(1, 'months')
        }
        this.setStuff(newM)
    }
    
    openModal() {                
        this.isModalOpen = true
    }
    modalClosed(data) {
        this.isModalOpen = data.value
    }
    
}

function MonthFactory(m) {  
    let startAt = m.clone().startOf('month')
    let endAt = m.clone().endOf('month')
    
    let monthTotal = endAt.date()
    let days = [DayFactory(startAt.clone())];
    let insertFront = days[0].dayOfWeek
    let insertBack
        
    for (var i = 1; i < monthTotal; i++) {
        days.push(DayFactory(startAt.clone().add(i, 'day')));
    }

    // after month is generated get last day
    insertBack = 6 - days[days.length - 1].dayOfWeek
        
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
    let days = createArray(6).map(i => {
        return DayFactory(startAt.clone().add((i + 1), 'day'))
    })
    days.unshift(DayFactory(startAt.clone()))
        
    return days;
}

function DayFactory(m) {
        
    return {
        dayOfMonth: m.date(), 
        dayOfWeek: m.weekday(),
        weekday: WEEKDAYS_SHORT[m.weekday()],
        date: m.format('MM.DD.YYYY'),
        shortDate: m.format('M/DD'),
        month: m.month(),
        monthName: MONTHS[m.month()],        
        isToday: NOW.isSame(m, 'day'),        
        // add moment just cause
        moment: m,
    }
}

function createArray(n: number):Array<number> {
    let arr = []

    for (var index = 0; index < n; index++) {
        arr[index] = index        
    }
    return arr
}