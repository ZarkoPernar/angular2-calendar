import { Component, Input, Output, ElementRef, ViewChild } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';

import DragService from '../week/dragService'

const moment = require('moment/moment');

interface SideHour {
    display: string,
}

@Component({
    selector: 'week',
    moduleId: module.id,
    styleUrls: ['./week.component.css'],
    templateUrl: './week.component.html',
    providers: [DragService],
})

// [ngClass]="{today: day.isToday, selected: selectedDay === day.date, inactive: day.monthName !== monthName}" 

export default class WeekComponent {
    @Input() days: any
    @Input() weekdays: any
    @Input() events: any
    @Input() service: any

    @ViewChild('weekScroll') scroll

    hasMore: boolean
    eventsExpanded: boolean
    scrollTop: number = 0
    hours: Array<SideHour>
    
    constructor(public el: ElementRef) {
        this.hasMore = false
        this.eventsExpanded = false
        
        this.hours = createHours()

        this.showLess = this.showLess.bind(this)
    } 

    ngAfterViewInit() {
        this.scroll.nativeElement.addEventListener('scroll', (e) => {
            this.scrollTop = e.target.scrollTop
        })        
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

function createHours():Array<any> {    
    let temp = moment().startOf('day')
    let arr = [{
        display: temp.format('HH:mm')
    }]

    for (let i = 0; i < 23; i++) {
        arr.push({
            display: temp.add(1, 'hour').format('HH:mm'),
        })
    }

    return arr
}