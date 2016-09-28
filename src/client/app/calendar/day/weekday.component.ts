import { Component, Input, Output, ElementRef } from '@angular/core';

import { CalEvent } from '../calendar.service'

import DragService from '../week/dragService'

@Component({
    selector: 'weekday',
    moduleId: module.id,
    styleUrls: ['./weekday.component.css'],
    templateUrl: './weekday.component.html',
    providers: [DragService],
})

export default class WeekDayComponent {
    @Input() scrollTop: number
    @Input() day: any
    @Input() events: any
    @Input() service: any
    @Input() isSelected: boolean

    moveIncrement: number
    mouseOffset: number = 0
    containerTop: number
    moveEvent: CalEvent
    lastMove: number
    
    constructor(public el: ElementRef, public dragService: DragService) {
        this.move = this.move.bind(this)
    }  

    ngAfterContentInit() {
        this.containerTop = this.el.nativeElement.getBoundingClientRect().top
        this.moveIncrement = parseInt(this.el.nativeElement.clientHeight / 48)

        // add offsetY to each event
        if (this.events) {
            this.events.forEach((event, i) => {
                this.events[i].offsetY = this.getTop(event) * (this.moveIncrement || 0)
            })
        }        
    }

    drag($event, item) {
        if ($event.isHolding) {
            this.moveEvent = item
            this.mouseOffset = $event.mouseOffset
            this.el.nativeElement.addEventListener('mousemove', this.move)
        } else {
            this.el.nativeElement.removeEventListener('mousemove', this.move)
            this.snap()
        }
    } 

    ngOnDestroy() {
        this.el.nativeElement.removeEventListener('mousemove', this.move)
    }

    snap() {
        console.log(this.lastMove, this.moveIncrement)
        if (!this.lastMove) return
        let pos = this.lastMove / this.moveIncrement
        
        if (this.lastMove < 0) {
            this.moveEvent.offsetY = 0
        } else if ((pos - Math.floor(pos)) > 0.5) {
            this.moveEvent.offsetY = Math.ceil(pos) * this.moveIncrement
        } else {
            this.moveEvent.offsetY = Math.floor(pos) * this.moveIncrement
        }
    }

    move({pageY}) {
        let to = pageY - this.mouseOffset - 24 - this.containerTop + this.scrollTop

        // TODO Change this from modulo to just move by increment
        // not check if exact
        // if (!(to % this.moveIncrement)) {
        //     this.moveEvent.offsetY = to
        // }
        // if (this.lastMove && (to < this.lastMove && this.lastMove - to < this.moveIncrement) || (to > this.lastMove && to - this.lastMove < this.moveIncrement)) {
        //     this.moveEvent.offsetY = this.lastMove
        // } else {
        //     this.moveEvent.offsetY = to
        //     this.lastMove = to
        // }

        this.moveEvent.offsetY = to
        this.lastMove = to
    }

    dayClick(day, $event) {

    } 

    getTop(event: CalEvent) {
        let hrs = event.startTime.hours()
           
        return hrs
    }

    eventClick(day, $event) {
        $event.stopPropagation()
    }
}