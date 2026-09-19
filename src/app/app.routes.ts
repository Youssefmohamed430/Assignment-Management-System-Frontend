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
import { roleGuard } from './guards/role-guard';

export const routes: Routes = [

  // Public Routes
  {
    path: 'Home',
    component: Home
  },

  {
    path: 'Login',
    component: Login
  },

  {
    path: 'Register',
    component: Register
  },


  // Courses
  {
    path: 'Courses',

    children: [

      // Any authenticated user
      {
        path: '',
        component: Courses,
        canActivate: [authGuardGuard]
      },


      // Admin only
      {
        path: 'AddCourse',
        component: AddCourse,
        canActivate: [authGuardGuard, roleGuard],
        data: {
          role: 'Admin'
        }
      },

      // Student only
      {
        path: 'EnrollCourse',
        component: EnrollCourse,
        canActivate: [authGuardGuard, roleGuard],
        data: {
          role: 'Student'
        }
      },

      // Admin only
      {
        path: 'EditCourse/:id',
        component: EditCourse,
        canActivate: [authGuardGuard, roleGuard],
        data: {
          role: 'Admin'
        }
      },

      // Any authenticated user
      {
        path: 'AssignmentDetails/:id',
        component: AssignmentDetails,
        canActivate: [authGuardGuard]
      },

      // Instructor only
      {
        path: 'AssignmentDetails/:id/AddAssignment',
        component: AddAssignment,
        canActivate: [authGuardGuard, roleGuard],
        data: {
          role: 'Instructor'
        }
      },

      // Instructor only
      {
        path: 'AssignmentDetails/:courseId/EditAssignment/:assignmentId',
        component: EditAssignment,
        canActivate: [authGuardGuard, roleGuard],
        data: {
          role: 'Instructor'
        }
      },

      // Student only
      {
        path: 'AssignmentDetails/:courseId/SubmitAssignment/:assignmentId',
        component: SubmitAssignment,
        canActivate: [authGuardGuard, roleGuard],
        data: {
          role: 'Student'
        }
      }

    ]
  },


  // Instructor only
  {
    path: 'Students',
    component: Studentspage,
    canActivate: [authGuardGuard, roleGuard],
    data: {
      role: 'Instructor'
    }
  },


  // Instructor only
  {
    path: 'ViewStudent/:id',
    component: StudentDetails,
    canActivate: [authGuardGuard, roleGuard],
    data: {
      role: 'Instructor'
    }
  },


  // Instructor only
  {
    path: 'Submissions',
    component: Submissions,
    canActivate: [authGuardGuard, roleGuard],
    data: {
      role: 'Instructor'
    }
  },


  // Not Found
  {
    path: '**',
    component: Notfound
  }

];