import { Routes } from '@angular/router';
import {RegisterComponent} from './pages/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { StudentsComponent } from './pages/students/students.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'students',
    component: StudentsComponent,
    canActivate: [authGuard]
  }

];
