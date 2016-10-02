import { Component, EventEmitter, ChangeDetectionStrategy, Input } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';


import {CalendarService, CalEvent} from './calendar.service'


import * as moment from 'moment'

const NOW = moment()
const MONTHS = moment.months()
const MONTHS_SHORT = moment.monthsShort()
const WEEKDAYS = moment.weekdays()
const WEEKDAYS_SHORT = moment.weekdaysShort()
const WEEKDAYS_MIN = moment.weekdaysMin()

const getWeekNumber = m => Math.ceil(m.date() / 7)
const getMonthName = m => MONTHS[m.month()]

export interface DAY {
    dayOfMonth: number
    dayOfWeek: string
    moment: any
    date: string
}

export interface CalendarSettings {

}

@Component({
  selector: 'my-calendar',
  moduleId: module.id,
  styleUrls: ['./calendar.component.css'],
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})

export class CalendarComponent {
    @Input() importEvents: Array<CalEvent>
    @Input() settings: CalendarSettings

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

    addEvent(event: CalEvent) {
        if (!this.events[event.startDate]) {
            this.events[event.startDate] = [event]
        } else {
            this.events[event.startDate] = this.events[event.startDate].concat([event])
        }
    }
    
    setCalView(type: string) {        
        this.viewType = type;
        this.build()
    }

    centerToday(): void {
        let day = moment()
        // check if needs re-render
        if (this.viewType === 'Month' && !this.center.isSame(day, 'month')) {
            this.setStuff(day)
        } else if (this.viewType === 'Week' && !this.center.isSame(day, 'week')) {
            this.setStuff(day)
        }
        this.selectedDay = this.center.format('MM.DD.YYYY')     
    }

    toggleMonthDropdown() {
        this.monthDropdownVisible = !this.monthDropdownVisible
    }

    selectMonth(month: string) {
        let m = this.center.clone().month(month)
        this.monthDropdownVisible = false
        this.setStuff(m)
    }
    
    
    
    dayClick(day, jsEvent: MouseEvent) {
        if (day.date === this.selectedDay) {
            this.selectedDay = ''     
        } else {
            this.selectedDay = day.date   
        }          
    }
    
    eventClick(event: CalEvent, jsEvent: MouseEvent) {
        jsEvent.stopPropagation()
        console.log(event)
    }
    
    moveCalLeft() {
        let newM
        if (this.viewType === 'Week') {
            newM = this.center.clone().subtract(1, 'weeks')
        } else {
            newM = this.center.clone().subtract(1, 'months')
        }
        this.setStuff(newM)
    }
    
    moveCalRight() {
        let newM
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
    modalClosed(data: any) {
        this.isModalOpen = data.value
    }
    
}

function MonthFactory(m) {  
    let startAt = m.clone().startOf('month')
    let endAt = m.clone().endOf('month')
    
    let monthTotal = endAt.date()
    let days = [DayFactory(startAt.clone())];
    let insertFront = days[0].dayOfWeek
    let insertBack: number
        
    for (var i = 1; i < monthTotal; i++) {
        days.push(DayFactory(startAt.clone().add(i, 'day')));
    }

    // after month is generated get last day
    insertBack = 6 - days[days.length - 1].dayOfWeek
        
    if (insertFront) {
        let i: number
        for (i = 1; i <= insertFront; i++) {            
            let momento = startAt.clone().subtract(i, 'day')
            days.unshift(DayFactory(momento));
        }        
    }
        
    if (insertBack) {
        let i: number
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