import { Routes } from '@angular/router';
import { Home } from './Components/home/home';
import { Login } from './Components/login/login';
import { Register } from './Components/register/register';
import { Courses } from './Components/courses/courses';
import { AddCourse } from './Components/add-course/add-course';
import { EditCourse } from './Components/edit-course/edit-course';

export const routes: Routes = [
    {path: 'Home', component : Home},
    {path: 'Login', component : Login},
    {path: 'Register', component : Register},
    {path: 'Courses', component : Courses},
    {path: 'AddCourse', component : AddCourse},
    {path: 'EditCourse/:id', component : EditCourse},
];
