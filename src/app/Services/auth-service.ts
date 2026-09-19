import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { LoginUser } from '../models/login-user';
import { LoginResponse } from '../models/login-response';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private httpclient:HttpClient) {}

  LoginUser(user: LoginUser): Observable<LoginResponse> {

    return this.httpclient.post<LoginResponse>(
      `${environment.baseurl}/Auth/Login`,
      user
    );
  }

  getUserLogged() {
    return localStorage.getItem('user') !== null;
  }

  getRole(): string {

    const user = localStorage.getItem('user');

    if (!user) {
      return '';
    }

    const userData: LoginResponse = JSON.parse(user);

    return userData.roles[0] ?? '';
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
