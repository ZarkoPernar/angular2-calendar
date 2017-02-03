import { CalEvent } from './../calendar.service';
import { Component, Input, Output, ElementRef, ChangeDetectionStrategy, SimpleChanges, ViewChild } from '@angular/core';

import { DAY } from '../calendar.component'
import { CalEvent } from '../calendar.service'
import { DragService, MouseDrag } from '../dragService'
import { WeekService } from './../week/week.service';

interface OverlapEvent {
    
}

@Component({
    selector: 'weekday',
    moduleId: module.id,
    styleUrls: ['./weekday.component.css'],
    templateUrl: './weekday.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [DragService],
})

export default class WeekDayComponent {
    @Input() day: DAY
    @Input() dayEvents: CalEvent[]
    @Input() movingStuff: boolean

    @ViewChild('day') dayElement: ElementRef

    events: CalEvent[] = []
    overlapEvents: {}
    beginResize: number
    isResizing: boolean
    
    constructor(private weekService: WeekService, public el: ElementRef, public _dragService: DragService) {
        this.mouseUp = this.mouseUp.bind(this)
        this.mouseEnter = this.mouseEnter.bind(this)
        this.mouseLeave = this.mouseLeave.bind(this)

        window.addEventListener('mouseup', this.mouseUp)
    }  

    ngAfterContentInit() {
        window.addEventListener('mouseup', this.mouseUp)
        this.transformEvents(this.events)          
    }

    ngOnDestroy() {
        window.removeEventListener('mouseup', this.mouseUp)
    }

    mouseUp() {
        if (!this.weekService.selectedEvent) return

        this.dayElement.nativeElement.removeEventListener('mouseenter', this.mouseEnter)
        this.dayElement.nativeElement.removeEventListener('mouseleave', this.mouseLeave)
    }

    ngOnChanges({ dayEvents, movingStuff }: SimpleChanges) {
        if (dayEvents) {
            this.transformEvents(dayEvents.currentValue)
        }  

        if (movingStuff && movingStuff.currentValue) {
            this.dayElement.nativeElement.addEventListener('mouseenter', this.mouseEnter)
            this.dayElement.nativeElement.addEventListener('mouseleave', this.mouseLeave)
        } else if (movingStuff && !movingStuff.currentValue && movingStuff.previousValue) {
            this.dayElement.nativeElement.removeEventListener('mouseenter', this.mouseEnter)
            this.dayElement.nativeElement.removeEventListener('mouseleave', this.mouseLeave)
        }
    }   

    transformEvents(events: Array<CalEvent>) {
        if (events && events.length) {
            this.events = this.dayEvents
            events.forEach((event: CalEvent, i: number) => {
                this.weekService.transformEvent(event)
            })
        }
    }

    mouseEnter(event: MouseEvent) {    
        if (this.events)    
        console.log('entered ', this.dayElement.nativeElement)
        this.events.push(this.weekService.selectedEvent)
    }

    mouseLeave(event: MouseEvent) {
        console.log('left ', this.dayElement.nativeElement)
        let index = this.events.findIndex(ev => ev.id === this.weekService.selectedEvent.id)

        if (~index) {
            this.events.splice(index, 1)
        }
    }

    drag(item: CalEvent, $event: MouseDrag) {
        this.weekService.selectItem(item, $event)    
    } 

    dayClick(day: DAY, $event: MouseEvent) {

    } 

    eventClick(day: DAY, $event: MouseEvent) {
        $event.stopPropagation()
    }
}