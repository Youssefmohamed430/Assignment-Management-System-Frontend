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
import { SubmitAssignment } from './Components/submit-assignment/submit-assignment';
import { Studentspage } from './Components/studentspage/studentspage';
import { StudentDetails } from './Components/student-details/student-details';
import { Submissions } from './Components/submissions/submissions';
import { EnrollCourse } from './Components/enroll-course/enroll-course';

export const routes: Routes = [
    {path: 'Home', component : Home},
    {path: 'Login', component : Login},
    {path: 'Register', component : Register},
    {path: 'Courses', component : Courses},
    {path: 'EnrollCourse', component : EnrollCourse},
    {path: 'AddCourse', component : AddCourse},
    {path: 'EditCourse/:id', component : EditCourse},
    {path: 'AssignmentDetails/:id', component : AssignmentDetails},
    {path: 'AddAssignment/:id', component : AddAssignment},
    {path: 'EditAssignment/:id', component : EditAssignment},
    {path: 'SubmitAssignment/:id', component : SubmitAssignment},
    {path: 'Students', component : Studentspage},
    {path: 'ViewStudent/:id' , component:StudentDetails},
    {path: 'Submissions' , component:Submissions}
];
