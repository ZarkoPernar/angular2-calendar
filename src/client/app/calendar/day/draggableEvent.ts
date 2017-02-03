import { Component, Directive, Input, Output, ElementRef, EventEmitter } from '@angular/core';

import { DragService, MouseDrag } from '../dragService'

// bottom part of the event that is clicked for resize
const resizeTargetHeight: number = 5

@Directive({
    selector: '[draggable-event]',
})

export default class DraggableEvent {
    @Output() drag: EventEmitter<MouseDrag> = new EventEmitter()

    hold: MouseDrag
    resize: boolean = false

    constructor(public el: ElementRef) {
        this.mouseDown = this.mouseDown.bind(this)
        this.el.nativeElement.addEventListener('mousedown', this.mouseDown)
    }   

    ngOnDestroy() {
        this.el.nativeElement.removeEventListener('mousedown', this.mouseDown)
    }

    didClickOnResize(e: MouseEvent): boolean {
        return e.offsetY > (this.el.nativeElement.clientHeight - resizeTargetHeight)
    }

    mouseDown(e: MouseEvent) {
        
        this.resize = this.didClickOnResize(e)
 
        e.preventDefault()
        
        this.hold = {
            mouseOffsetY: e.offsetY,
            mouseOffsetX: e.offsetX,
            resize: this.resize,
        }        
        
        this.drag.emit(this.hold)
    }
}