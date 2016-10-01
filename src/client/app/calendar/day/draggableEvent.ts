import { Component, Directive, Input, Output, ElementRef, EventEmitter } from '@angular/core';

// bottom part of the event that is clicked for resize
const resizeTargetHeight: number = 5

export interface Hold {
    mouseOffset?: number
    resize?: boolean
}

@Directive({
    selector: '[draggable-event]',
})

export default class DraggableEvent {
    @Output() drag: EventEmitter<Hold> = new EventEmitter()
    hold: Hold
    resize: boolean = false

    constructor(public el: ElementRef) {
        // console.log(el)

        this.mouseDown = this.mouseDown.bind(this)
        this.el.nativeElement.addEventListener('mousedown', this.mouseDown)

    }   

    ngOnDestroy() {
        this.el.nativeElement.removeEventListener('mousedown', this.mouseDown)
    }

    didClickOnResize(e: MouseEvent): boolean {
        return e.offsetY > (e.target.clientHeight - resizeTargetHeight)
    }

    mouseDown(e: MouseEvent) {
        
        this.resize = this.didClickOnResize(e)
 
        e.preventDefault()
        
        this.hold = {
            mouseOffset: e.offsetY,
            resize: this.resize,
        }        

        this.drag.emit(this.hold)
    }
}