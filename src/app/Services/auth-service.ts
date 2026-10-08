import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, finalize, shareReplay, tap, throwError } from 'rxjs';
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
  private refreshRequest?: Observable<AuthResponse>;

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

  refreshSession(): Observable<AuthResponse> {
    if (this.refreshRequest) {
      return this.refreshRequest;
    }

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token is available.'));
    }

    this.refreshRequest = this.httpclient
      .post<AuthResponse>(`${environment.baseUrl}/Auth/RefreshToken`, { refreshToken })
      .pipe(
        tap((response) => this.setSession(response)),
        finalize(() => (this.refreshRequest = undefined)),
        shareReplay({ bufferSize: 1, refCount: false })
      );

    return this.refreshRequest;
  }

  setSession(response: AuthResponse): void {
    localStorage.setItem('user', JSON.stringify(response));
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    this.loggedInSubject.next(true);
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      this.httpclient
        .post(`${environment.baseUrl}/Auth/RevokeToken`, { refreshToken })
        .subscribe({ error: () => undefined });
    }
    this.clearSession();
  }

  clearSession(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.loggedInSubject.next(false);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('token');
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
