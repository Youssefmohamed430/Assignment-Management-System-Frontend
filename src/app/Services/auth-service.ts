import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginUser } from '../models/login-user';
import { AuthResponse } from '../models/auth-response';
import { environment } from '../../environments/environment';
import { RegisterUser } from '../models/register-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasSession());
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor(private httpclient: HttpClient) {}

  LoginUser(user: LoginUser): Observable<AuthResponse> {
    return this.httpclient.post<AuthResponse>(
      `${environment.baseUrl}/Auth/Login`,
      user
    );
  }

  RegisterUser(registeredUser: RegisterUser): Observable<AuthResponse> {
    return this.httpclient.post<AuthResponse>(
      `${environment.baseUrl}/Auth/RegisterUser`,
      registeredUser
    );
  }

  registerStudent(registeredUser: RegisterUser): Observable<AuthResponse> {
    return this.httpclient.post<AuthResponse>(
      `${environment.baseUrl}/Auth/RegisterStudent`,
      registeredUser
    );
  }

  setSession(response: AuthResponse): void {
    localStorage.setItem('user', JSON.stringify(response));
    localStorage.setItem('token', response.token);
    this.loggedInSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.loggedInSubject.next(false);
  }

  getUserLogged(): boolean {
    return this.loggedInSubject.value;
  }

  getStoredUser(): AuthResponse | null {
    const user = localStorage.getItem('user');
    if (!user) {
      return null;
    }
    return JSON.parse(user) as AuthResponse;
  }

  getUserId(): string {
    const user = this.getStoredUser();
    return user?.id || user?.iD || '';
  }

  getRole(): string {
    return this.getStoredUser()?.roles?.[0] ?? '';
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

  private hasSession(): boolean {
    return localStorage.getItem('user') !== null;
  }
}
