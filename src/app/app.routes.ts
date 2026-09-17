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
import { Notfound } from './Components/notfound/notfound';
import { authGuardGuard } from './guards/auth-guard-guard';
import { adminguardGuard } from './guards/adminguard-guard';
import { studentguardGuard } from './guards/studentguard-guard';
import { instructorguardGuard } from './guards/instructorguard-guard';

export const routes: Routes = [
    {path: 'Home', component : Home},
    {path: 'Login', component : Login},
    {path: 'Register', component : Register},
    {
        path: 'Courses',
        children: [
            { path: '',component: Courses , canActivate:[authGuardGuard]},
            { path: 'AddCourse', component: AddCourse,canActivate:[authGuardGuard,adminguardGuard] },
            { path: 'EnrollCourse', component: EnrollCourse,canActivate:[authGuardGuard,studentguardGuard]},
            { path: 'EditCourse/:id', component : EditCourse,canActivate:[authGuardGuard,adminguardGuard]},
            { path: 'AssignmentDetails/:id', component : AssignmentDetails,canActivate:[authGuardGuard]},
            {path: 'AssignmentDetails/:id/AddAssignment', component : AddAssignment,canActivate:[authGuardGuard,instructorguardGuard]},
            {path: 'AssignmentDetails/:courseId/EditAssignment/:assignmentId', component : EditAssignment,canActivate:[authGuardGuard,instructorguardGuard]},
            {path: 'AssignmentDetails/:courseId/SubmitAssignment/:assignmentId', component : SubmitAssignment,canActivate:[authGuardGuard,studentguardGuard]}
        ]
    },
    {path: 'Students', component : Studentspage,canActivate:[authGuardGuard,instructorguardGuard]},
    {path: 'ViewStudent/:id' , component:StudentDetails,canActivate:[authGuardGuard,instructorguardGuard]},
    {path: 'Submissions' , component:Submissions,canActivate:[authGuardGuard,instructorguardGuard]},
    {path: '**', component: Notfound }
];
