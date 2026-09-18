import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private httpclient:HttpClient) {}

  LoginUser(User:User) {
    // return this.httpclient.post($"{{environment.}}")
    return true;
  }

  getUserLogged() {
    return false;
  }

  getRole() {
    return '';
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
