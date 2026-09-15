import { Routes } from '@angular/router';
import { Home } from './Components/home/home';
import { Login } from './Components/login/login';
import { Register } from './Components/register/register';
import { Courses } from './Components/courses/courses';
import { AddCourse } from './Components/add-course/add-course';
import { EditCourse } from './Components/edit-course/edit-course';
import { AssignmentDetails } from './Components/assignment-details/assignment-details';
import { AddAssignment } from './Components/add-assignment/add-assignment';
import { EditAssignment } from './Components/edit-assignment/edit-assignment';

export const routes: Routes = [
    {path: 'Home', component : Home},
    {path: 'Login', component : Login},
    {path: 'Register', component : Register},
    {path: 'Courses', component : Courses},
    {path: 'AddCourse', component : AddCourse},
    {path: 'EditCourse/:id', component : EditCourse},
    {path: 'AssignmentDetails/:id', component : AssignmentDetails},
    {path: 'AddAssignment/:id', component : AddAssignment},
    {path: 'EditAssignment/:id', component : EditAssignment},
];
