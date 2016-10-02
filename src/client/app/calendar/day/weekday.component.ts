import { Component, Input, Output, ElementRef, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';

import { DAY } from '../calendar.component'
import { CalEvent } from '../calendar.service'
import { Hold } from './draggableEvent'

interface OverlapEvent {
    
}

@Component({
    selector: 'weekday',
    moduleId: module.id,
    styleUrls: ['./weekday.component.css'],
    templateUrl: './weekday.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
})

export default class WeekDayComponent {
    @Input() scrollTop: number
    @Input() day: DAY
    @Input() events: [CalEvent]
    @Input() service: any
    @Input() isSelected: boolean

    overlapEvents: {}
    moveIncrement: number
    mouseOffset: number = 0
    containerTop: number
    selectedEvent: CalEvent
    beginResize: number
    isResizing: boolean
    
    constructor(public el: ElementRef) {

        // required bindings because of adding event listeners
        this.move = this.move.bind(this)
        this.resize = this.resize.bind(this)
        this.mouseUp = this.mouseUp.bind(this)

        window.addEventListener('mouseup', this.mouseUp)
    }  

    ngAfterContentInit() {
        this.containerTop = this.el.nativeElement.getBoundingClientRect().top
        this.moveIncrement = parseInt(this.el.nativeElement.clientHeight / 48)    
        this.transformEvents(this.events)          
    }

    ngOnChanges({ events }: SimpleChanges) {
        if (events) {
            this.transformEvents(events.currentValue)
        }  
    }

    ngOnDestroy() {
        this.el.nativeElement.removeEventListener('mousemove', this.move)
        this.el.nativeElement.removeEventListener('mousemove', this.resize)
    }

    transformEvent(item: CalEvent) {
        item.offsetY = this.getTop(item) * (this.moveIncrement || 0)
        item.height = (item.duration * this.moveIncrement)

        this.findOverlap(this.events)
    }

    transformEvents(events: Array<CalEvent>) {
        if (events && events.length) {
            events.forEach((event: CalEvent, i: number) => {
                this.transformEvent(event)
            })
        }
    }

    findOverlap(events: [CalEvent]) {
        this.overlapEvents = {}
        events.forEach((a: CalEvent) => {
            events.forEach((b: CalEvent) => {
                if (a.offsetY > b.offsetY && a.offsetY < (b.offsetY + b.height)) {
                    a.width = 50
                    b.width = 50
                    b.left = 100
                } else if (b.offsetY > a.offsetY && b.offsetY < (a.offsetY + a.height)) {
                    a.width = 50
                    b.width = 50
                    b.left = 100
                } else {
                    a.width = 100
                    b.width = 100
                    b.left = 0
                }
            })
        })
    }

    mouseUp() {
        if (!this.selectedEvent) return

        if (this.isResizing) {
            this.snapHeight(this.selectedEvent)
            this.afterResize(this.selectedEvent)
            this.el.nativeElement.removeEventListener('mousemove', this.resize)
        } else {
            this.snapPos(this.selectedEvent)
            this.afterMove(this.selectedEvent)
            this.el.nativeElement.removeEventListener('mousemove', this.move)
        }
    }

    drag($event: Hold, item: CalEvent) {
        this.selectedEvent = item
        this.mouseOffset = $event.mouseOffset

        if ($event.resize) {
            this.isResizing = true
            this.el.nativeElement.addEventListener('mousemove', this.resize)
        } else {
            this.isResizing = false            
            this.el.nativeElement.addEventListener('mousemove', this.move)
        }
        
    } 

    

    snapPos(item: CalEvent) {
        if (!item.offsetY) return
        let pos = item.offsetY / this.moveIncrement
        
        if (item.offsetY < 0) {
            item.offsetY = 0
        } else if ((pos - Math.floor(pos)) > 0.5) {
            item.offsetY = Math.ceil(pos) * this.moveIncrement
        } else {
            item.offsetY = Math.floor(pos) * this.moveIncrement
        }
        
    }

    snapHeight(item: CalEvent) {
        if (!item.height) return
        let pos = item.height / this.moveIncrement
        
        if (item.height < this.moveIncrement) {
            item.height = this.moveIncrement
        } else if ((pos - Math.floor(pos)) > 0.5) {
            item.height = Math.ceil(pos) * this.moveIncrement
        } else {
            item.height = Math.floor(pos) * this.moveIncrement
        }
        
    }

    move({pageY}: MouseEvent) {
        this.selectedEvent.offsetY = pageY - this.mouseOffset - 24 - this.containerTop + this.scrollTop
        this.snapPos(this.selectedEvent)
    }

    resize({pageY}: MouseEvent) {
        this.selectedEvent.height = pageY  - 24 - this.containerTop + this.scrollTop - this.selectedEvent.offsetY
        this.snapHeight(this.selectedEvent)
    }

    afterMove(item: CalEvent) {
        let inc = item.offsetY / this.moveIncrement
        if (inc % 2) {
            item.startTime.hours((inc - 1) / 2)
            item.startTime.minutes(30)            
        } else {
            item.startTime.hours(inc / 2)
            item.startTime.minutes(0)
        }

        this.afterResize(item)
    }

    afterResize(item: CalEvent) {
        let inc = item.height / this.moveIncrement
        if (inc % 2) {
            item.endTime = item.startTime.clone().add('hours', (inc - 1) / 2)
            item.endTime = item.startTime.clone().add('minutes', 30)
        } else {
            item.endTime = item.startTime.clone().add('hours', inc / 2)
        }

        this.findOverlap(this.events)
    }

    dayClick(day: DAY, $event: MouseEvent) {

    } 

    getTop(event: CalEvent) {
        let hrs = event.startTime.hours()
        let mins = event.startTime.minutes() 
        let pts = mins <= 15 || mins >= 45 ? 0 : .5
        return (hrs + pts) * 2
    }

    eventClick(day: DAY, $event: MouseEvent) {
        $event.stopPropagation()
    }
}