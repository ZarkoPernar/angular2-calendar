import { Component, Directive, Input, Output, ElementRef, EventEmitter } from '@angular/core';

interface Hold {
    isHolding?: boolean
    mouseOffset?: number
}

@Directive({
    selector: '[draggable-event]',
})

export default class DraggableEvent {
    @Output() drag: EventEmitter<Hold> = new EventEmitter()
    hold: Hold

    constructor(public el: ElementRef) {
        // console.log(el)

        this.mouseDown = this.mouseDown.bind(this)
        this.mouseUp = this.mouseUp.bind(this)

        window.addEventListener('mouseup', this.mouseUp)
        this.el.nativeElement.addEventListener('mousedown', this.mouseDown)

    }   

    ngOnDestroy() {
        window.removeEventListener('mouseup', this.mouseUp)
        this.el.nativeElement.removeEventListener('mousedown', this.mouseDown)
    }

    mouseDown(e) {
        // console.log(e)
        e.preventDefault()
        this.hold = {
            isHolding: true,
            mouseOffset: e.offsetY,
        }
        this.drag.emit(this.hold)
    }
    mouseUp(e) {
        this.hold = {
            isHolding: false,
        }
        this.drag.emit(this.hold)
    }
}