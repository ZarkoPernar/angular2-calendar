import { Component, View, Input, Output } from 'angular2/core';
import { NgFor, NgClass, FORM_DIRECTIVES } from 'angular2/common';

@Component({
    selector: '[cal-day]',
    template: `
            <div class="day-container">
                <span class="number">
                    {{day.dayOfMonth}}
                </span>
                
                <div class="events">
                    <div class="event" *ngFor="#event of events" (click)="eventClick(event, $event)">
                        <span class="event-name">{{event.name}}</span>
                    </div>
                </div>

                <button class="btn btn-block" *ngIf="hasMore">
                    Show More...
                </button>    
            </div>
    `
})
export default class DayComponent {
    @Input() day: any
    @Input() events: any
    @Input() service: any
    @Input() isSelected: boolean

    hasMore: boolean
    
    constructor() {
        this.hasMore = false
    }   

    dayClick(day, $event) {

    } 

    eventClick(day, $event) {

    } 

    ngOnChanges(change) {
        if (change.events && change.events.currentValue && change.events.currentValue.length > 3) {
            this.hasMore = true
        }
    }
}