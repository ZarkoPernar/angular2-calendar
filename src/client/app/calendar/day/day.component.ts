import { Component, Input, Output } from '@angular/core';

@Component({
    selector: '[cal-day]',
    moduleId: module.id,
    styleUrls: ['./day.component.css'],
    template: `
            <div class="day-container">
                <span class="number">
                    {{day.dayOfMonth}}
                </span>
                
                <div class="events" [ngClass]="{'events--expanded': eventsExpanded}">
                    <div class="event" *ngFor="let event of events" (click)="eventClick(event, $event)">
                        <span class="event-name">{{event.name}}</span>
                    </div>
                </div>

                <button class="btn btn-block show-more" *ngIf="hasMore" [ngClass]="{hidden: eventsExpanded}" (click)="showMore($event)">
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