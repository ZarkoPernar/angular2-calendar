import { Routes } from '@angular/router';

import { AboutRoutes } from './about/index';
import { HomeRoutes } from './home/index';

import { CalendarComponent } from './calendar/calendar.component'

export const routes: Routes = [
  {
    path: '',
    component: CalendarComponent,
  },
];
