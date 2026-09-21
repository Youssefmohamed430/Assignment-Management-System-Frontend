import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { LoginUser } from '../models/login-user';
import { AuthResponse } from '../models/auth-response';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { RegisterUser } from '../models/register-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private httpclient:HttpClient) {}

  LoginUser(user: LoginUser): Observable<AuthResponse> {

    return this.httpclient.post<AuthResponse>(
      `${environment.baseurl}/Auth/Login`,
      user
    );
  }

  RegisterUser(registeredUser:RegisterUser) : Observable<AuthResponse> {
    return this.httpclient.post<AuthResponse>(
      `${environment.baseurl}/Auth/RegisterUser`,
      registeredUser
    )
  }

  getUserLogged() {
    return localStorage.getItem('user') !== null;
  }

  getRole(): string {

    const user = localStorage.getItem('user');

    if (!user) {
      return '';
    }

    const userData: AuthResponse = JSON.parse(user);

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
