import { Component, View, Input, Output, EventEmitter, SimpleChange } from 'angular2/core';
import { NgFor, NgClass, FORM_DIRECTIVES } from 'angular2/common';
import CalendarService from '../calendar.service'


@Component({
  selector: 'calendar-modal',
  moduleId: module.id,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  directives: [NgFor, NgClass, FORM_DIRECTIVES],
})
export class ModalComponent {
    @Input() isOpen: boolean
    @Input() selected: string
    
    @Output() eventAdded = new EventEmitter()
    
    event: any
    
    constructor() {
        this.event = {
            name: '',
            startDate: '',
            endDate: '',
        }
    }
    close() {
        this.isOpen = false
    }
    
    ngOnInit() {}
    
    ngOnChanges(changes) {
        console.log(changes);
        
    }
}