import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CalendarComponent } from './calendar.component';
import { CalendarService } from './calendar.service';
import CalDay from './day/day.component'
import CalWeek from './week/week.component'
import draggableEvent from './day/draggableEvent'
import WeekDay from './day/weekday.component'

import {ModalComponent} from './modal/modal.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [CalendarComponent, CalDay, CalWeek, WeekDay, ModalComponent, draggableEvent],
  exports: [CalendarComponent],
  providers: [CalendarService],
})
export class CalendarModule { }
