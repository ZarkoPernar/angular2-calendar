import { Component, View, Input, Output } from 'angular2/core';
import { NgFor, NgClass, FORM_DIRECTIVES } from 'angular2/common';

@Component({
    selector: 'weekday',
    moduleId: module.id,
    styleUrls: ['./weekday.component.css'],
    template: `
        <div class="day">
            <div class="day-container">
                <div class="day-long">
                    <span class="number">
                        {{day.dayOfMonth}}
                    </span>
                    
                    <div class="events" [ngClass]="{'events--expanded': eventsExpanded}">
                        <div class="event" *ngFor="#event of events" (click)="eventClick(event, $event)" 
                            [ngStyle]="{height: (event.duration * 2.083333) + '%', top: (getTop(event) * 2.083333) + '%'}">
                            <span class="event-name">{{event.name}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export default class WeekDayComponent {
    @Input() day: any
    @Input() events: any
    @Input() service: any
    @Input() isSelected: boolean

    hasMore: boolean
    eventsExpanded: boolean
    
    constructor() {
        this.hasMore = false
        this.eventsExpanded = false
        this.showLess = this.showLess.bind(this)
    }   

    dayClick(day, $event) {

    } 

    getTop(event) {
        let hrs = event.startTime.hours()
           
        return hrs
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