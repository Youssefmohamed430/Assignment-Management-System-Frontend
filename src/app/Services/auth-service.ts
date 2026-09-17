import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  LoginUser(User:User) {
    // API Call to login User
    return true;
  }

  getUserLogged() {
    return true;
  }

  getRole() {
    return 'Admin';
  }

  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }

    isInstructor(): boolean {
    return this.getRole() === 'Instructor';
  }

    isStudent(): boolean {
    return this.getRole() === 'Student';
  }
}
