import { Routes } from '@angular/router';
import { ActivityListComponent } from './components/activity-list/activity-list';
import { CreateEventComponent } from './components/create-event/create-event';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
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
  }
];
