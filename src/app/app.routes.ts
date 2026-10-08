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
import { RegisterStudent } from './Components/register-student/register-student';
import { Profile } from './Components/profile/profile';
import { Dashboard } from './Components/dashboard/dashboard';
import { CourseAnnouncements } from './Components/course-announcements/course-announcements';

import { EnrollCourse } from './Components/enroll-course/enroll-course';

import { Notfound } from './Components/notfound/notfound';

import { authGuardGuard } from './guards/auth-guard-guard';
import { roleGuard } from './guards/role-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'Home',
    pathMatch: 'full',
  },

  {
    path: 'Home',
    component: Home,
  },

  {
    path: 'Login',
    component: Login,
  },

  {
    path: 'Register',
    component: Register,
  },

  {
    path: 'Profile',
    component: Profile,
    canActivate: [authGuardGuard],
  },
  { path: 'Dashboard', component: Dashboard, canActivate: [authGuardGuard] },

  {
    path: 'Courses',
    children: [
      {
        path: '',
        component: Courses,
        canActivate: [authGuardGuard],
      },
      {
        path: 'AddCourse',
        component: AddCourse,
        canActivate: [authGuardGuard, roleGuard],
        data: { role: 'Admin' },
      },
      {
        path: 'EnrollCourse',
        component: EnrollCourse,
        canActivate: [authGuardGuard, roleGuard],
        data: { role: 'Student' },
      },
      {
        path: 'EditCourse/:id',
        component: EditCourse,
        canActivate: [authGuardGuard, roleGuard],
        data: { role: 'Admin' },
      },
      {
        path: 'AssignmentDetails/:id',
        component: AssignmentDetails,
        canActivate: [authGuardGuard],
      },
      {
        path: 'Announcements/:id',
        component: CourseAnnouncements,
        canActivate: [authGuardGuard, roleGuard],
        data: { roles: ['Student', 'Instructor'] },
      },
      {
        path: 'AssignmentDetails/:id/AddAssignment',
        component: AddAssignment,
        canActivate: [authGuardGuard, roleGuard],
        data: { role: 'Instructor' },
      },
      {
        path: 'AssignmentDetails/:courseId/EditAssignment/:assignmentId',
        component: EditAssignment,
        canActivate: [authGuardGuard, roleGuard],
        data: { role: 'Instructor' },
      },
      {
        path: 'AssignmentDetails/:courseId/SubmitAssignment/:assignmentId',
        component: SubmitAssignment,
        canActivate: [authGuardGuard, roleGuard],
        data: { role: 'Student' },
      },
    ],
  },

  {
    path: 'Students',
    component: Studentspage,
    canActivate: [authGuardGuard, roleGuard],
    data: { role: 'Instructor' },
  },

  {
    path: 'Students/Register',
    component: RegisterStudent,
    canActivate: [authGuardGuard, roleGuard],
    data: { role: 'Admin' },
  },

  {
    path: 'ViewStudent/:name',
    component: StudentDetails,
    canActivate: [authGuardGuard, roleGuard],
    data: { role: 'Instructor' },
  },

  {
    path: 'Submissions/:assignmentId',
    component: Submissions,
    canActivate: [authGuardGuard, roleGuard],
    data: { role: 'Instructor' },
  },

  {
    path: '**',
    component: Notfound,
  },
];
