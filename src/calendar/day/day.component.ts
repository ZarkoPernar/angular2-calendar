import { Component, View, Input, Output } from 'angular2/core';
import { NgFor, NgClass, FORM_DIRECTIVES } from 'angular2/common';

@Component({
    selector: 'cal-day',
    template: `
        <div class="day" [ngClass]="{today: day.isToday, selected: isSelected}" (click)="dayClick(day, $event)">
            <div class="day-container">
                <span class="number">
                    {{day.dayOfMonth}}
                </span>
                
                <div class="events">
                    <div class="event" *ngFor="#event of day.events" (click)="eventClick(event, $event)">
                        <span class="event-name">{{event.name}}</span>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class DayComponent {
    @Input() day: any
    @Output() dayClick
    
    constructor() {
        
    }    
}