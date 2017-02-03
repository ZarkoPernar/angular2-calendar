import { MouseDrag } from './../dragService';
import { Injectable, ElementRef } from '@angular/core'
import { CalEvent } from '../calendar.service'

@Injectable()
export class WeekService {
    mainElement: ElementRef
    selectedEvent: CalEvent

    events: CalEvent[] = []
    overlapEvents: any = {}

    isResizing: boolean
    scrollTop: number = 0
    containerTop: number
    moveIncrement: number
    mouseOffsetY: number = 0
    mouseOffsetX: number = 0
    
    constructor() {
        this.move =this.move.bind(this)
        this.mouseUp =this.mouseUp.bind(this)
        this.resize =this.resize.bind(this)
    }

    addMainElement(el: ElementRef) {
        this.mainElement = el
        this.moveIncrement = Math.round(el.nativeElement.clientHeight / 48)   
        this.containerTop = el.nativeElement.getBoundingClientRect().top

        window.addEventListener('mouseup', this.mouseUp)
    }

    addEvents(events: any) {
        if (events) {
            Object.keys(events).forEach((key: string) => {
                events[key].forEach((ev: CalEvent) => {
                    this.events.push(ev)
                })
            })
        }
    }

    selectItem(item: CalEvent, settings: MouseDrag) {
        this.selectedEvent = item
        this.mouseOffsetY = settings.mouseOffsetY
        this.isResizing = settings.resize

        if (settings.resize) {
            this.mainElement.nativeElement.addEventListener('mousemove', this.resize)
        } else {
            this.mainElement.nativeElement.addEventListener('mousemove', this.move)
        }
        
    }

    deselect() {
        this.selectedEvent = null
        this.mainElement.nativeElement.removeEventListener('mousemove', this.move)
    }

    move({pageY , target}: MouseEvent) {
        this.selectedEvent.offsetY = pageY - this.mouseOffsetY - 24 - this.containerTop + this.scrollTop
        this.snapPos(this.selectedEvent)
    }

    resize({pageY}: MouseEvent) {        
        this.selectedEvent.height = pageY  - 24 - this.containerTop + this.scrollTop - this.selectedEvent.offsetY
        this.snapHeight(this.selectedEvent)        
    }

    setScrollTop(top: number) {
        this.scrollTop = top
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
            item.endTime = item.startTime.clone().add((inc - 1) / 2, 'hours')
            item.endTime = item.startTime.clone().add(30, 'minutes')
        } else {
            item.endTime = item.startTime.clone().add(inc / 2, 'hours')
        }

        this.findOverlap(this.events)
    }

    mouseUp() {
        if (!this.selectedEvent) return

        if (this.isResizing) {
            this.snapHeight(this.selectedEvent)
            this.afterResize(this.selectedEvent)
            this.mainElement.nativeElement.removeEventListener('mousemove', this.resize)
        } else {
            this.snapPos(this.selectedEvent)
            this.afterMove(this.selectedEvent)
            this.mainElement.nativeElement.removeEventListener('mousemove', this.move)
        }

        this.deselect()
    }

    transformEvent(item: CalEvent) {
        item.offsetY = this.getTop(item) * (this.moveIncrement || 0)
        item.height = (item.duration * this.moveIncrement)

        this.findOverlap(this.events)
    }

    getTop(event: CalEvent) {
        let hrs = event.startTime.hours()
        let mins = event.startTime.minutes() 
        let pts = mins <= 15 || mins >= 45 ? 0 : .5
        return (hrs + pts) * 2
    }

    findOverlap(events: CalEvent[]) {
        // this.overlapEvents = {}
        // events.forEach((a: CalEvent) => {
        //     events.forEach((b: CalEvent) => {
        //         if (a.offsetY > b.offsetY && a.offsetY < (b.offsetY + b.height)) {
        //             a.width = 50
        //             b.width = 50
        //             b.left = 100
        //         } else if (b.offsetY > a.offsetY && b.offsetY < (a.offsetY + a.height)) {
        //             a.width = 50
        //             b.width = 50
        //             b.left = 100
        //         } else {
        //             a.width = 100
        //             b.width = 100
        //             b.left = 0
        //         }
        //     })
        // })
    }
}