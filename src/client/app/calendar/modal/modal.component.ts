import { Component, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import {CalendarService} from '../calendar.service'


@Component({
  selector: 'calendar-modal',
  moduleId: module.id,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
    @Input() isOpen: boolean
    @Input() selected: string
    @Input() service: CalendarService
    
    @Output() modalClosed = new EventEmitter()
    
    event: any
    
    constructor() {
        this.event = {
            name: '',
            startDate: '',
            endDate: '',
        }
    }
    close() {
        this.service.emit('modal_closed', {
            value: false
        })
    }

    addNewEvent() {
        this.service.addNewEvent(Object.assign({}, this.event, {
            createdAt: Date.now(),
        }))
        this.event.name = ''
        this.close()
    }
    
    ngOnInit() {}
    
    ngOnChanges(changes) {
        if (changes.selected) {
            this.event.startDate = changes.selected.currentValue
        }
    }
}