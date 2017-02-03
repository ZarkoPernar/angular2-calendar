import { Component, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { CalendarService, CalEvent } from '../calendar.service'

var moment = require('moment')

@Component({
  selector: 'calendar-modal',
  moduleId: module.id,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
    @Input() isOpen: boolean
    @Input() selected: string
    
    @Output() modalClosed = new EventEmitter()
    
    event: {
        name: string
        startDate: string
        endDate: string
    }
    newEvent: CalEvent
    
    constructor(private calendarService: CalendarService) {
        this.event = {
            name: '',
            startDate: '',
            endDate: '',
        }
    }
    close() {
        this.calendarService.observe.modal.emit({
            value: false
        })
    }

    addNewEvent() {
        this.newEvent = {
            id: Date.now(),
            name: this.event.name,
            startDate: this.event.startDate,
            startTime: moment(this.event.startDate, 'MM.DD.YYYY'),
        }

        this.calendarService.addNewEvent(this.newEvent)
        this.event.name = ''
        this.close()
    }
    
    ngOnInit() {}
    
    ngOnChanges({selected} : {selected: SimpleChange}) {
        if (selected) {
            this.event.startDate = selected.currentValue
        }
    }
}