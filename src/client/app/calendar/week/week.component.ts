import { Component, Input, Output, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';

import { CalendarService } from '../calendar.service';
import { WeekService } from './week.service';

import {DragService} from '../dragService'
import {DAY} from '../calendar.component'
const moment = require('moment/moment');

interface SideHour {
    display: string,
}

@Component({
    selector: 'week',
    moduleId: module.id,
    styleUrls: ['./week.component.css'],
    templateUrl: './week.component.html',
    providers: [WeekService, DragService],
    changeDetection: ChangeDetectionStrategy.Default,
})

// [ngClass]="{today: day.isToday, selected: selectedDay === day.date, inactive: day.monthName !== monthName}" 

export default class WeekComponent implements AfterViewInit, OnChanges {
    @Input() days: any
    @Input() weekdays: any
    @Input() events: any

    @ViewChild('weekScroll') scroll: ElementRef
    @ViewChild('weekMain') weekMain: ElementRef

    hasMore: boolean
    eventsExpanded: boolean
    scrollTop: number = 0
    hours: SideHour[]
    
    constructor(public weekService: WeekService, private calendarService: CalendarService, public el: ElementRef, public dragService: DragService) {
        this.hasMore = false
        this.eventsExpanded = false
        
        this.hours = createHours()

        this.showLess = this.showLess.bind(this)
    } 

    ngAfterViewInit() {
        console.log('init')

        this.weekService.addMainElement(this.weekMain)

        this.scroll.nativeElement.addEventListener('scroll', (e: any) => {
            this.scrollTop = e.target.scrollTop
            this.weekService.setScrollTop(e.target.scrollTop)
        })        
    }

    ngOnChanges({events}: {events: SimpleChange}) {
        if (events && events.currentValue) {
            this.weekService.addEvents(events.currentValue)
            if (events.currentValue.length > 3) {
                this.hasMore = true
            }
        }
    }

    dayClick(day: DAY, $event: MouseEvent) {

    } 

    eventClick(day: DAY, $event: MouseEvent) {
        $event.stopPropagation()
    } 

    showMore($event: MouseEvent) {
        this.eventsExpanded = true
        $event.stopPropagation()
        document.addEventListener('click', this.showLess)
    }
    showLess() {
        this.eventsExpanded = false
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