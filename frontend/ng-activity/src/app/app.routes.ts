import { Routes } from '@angular/router';
import { ActivityListComponent } from './components/activity-list/activity-list';
import { CreateEventComponent } from './components/create-event/create-event';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { MyEventsComponent } from './components/my-events/my-events';
import { EventDetailsComponent } from './components/event-details/event-details';
import { EventEditComponent } from './components/event-edit/event-edit';
export const routes: Routes = [
  {
    path: '',
    component: ActivityListComponent
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'event/create',
    component: CreateEventComponent
  },
  { path: 'event/:id', component: EventDetailsComponent },
  { path: 'event/:id/edit', component: EventEditComponent },
  { path: 'my-events', component: MyEventsComponent }
];
