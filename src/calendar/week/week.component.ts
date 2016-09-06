import { Component, View, Input, Output } from 'angular2/core';
import { NgFor, NgClass, FORM_DIRECTIVES } from 'angular2/common';

import CalWeekDay from '../day/weekday.component'

@Component({
    selector: 'week',
    moduleId: module.id,
    styleUrls: ['./week.component.css'],
    directives: [CalWeekDay, NgFor, NgClass, FORM_DIRECTIVES],
    templateUrl: './week.component.html',
})

// [ngClass]="{today: day.isToday, selected: selectedDay === day.date, inactive: day.monthName !== monthName}" 

export default class WeekComponent {
    @Input() days: any
    @Input() weekdays: any
    @Input() events: any
    @Input() service: any

    hasMore: boolean
    eventsExpanded: boolean
    
    constructor() {
        this.hasMore = false
        this.eventsExpanded = false
        this.showLess = this.showLess.bind(this)
    }   

    dayClick(day, $event) {

    } 

    eventClick(day, $event) {
        $event.stopPropagation()
    } 

    showMore($event) {
        this.eventsExpanded = true
        $event.stopPropagation()
        document.addEventListener('click', this.showLess)
    }
    showLess() {
        this.eventsExpanded = false
    }

    ngOnChanges(change) {
        if (change.events && change.events.currentValue && change.events.currentValue.length > 3) {
            this.hasMore = true
        }
    }
}