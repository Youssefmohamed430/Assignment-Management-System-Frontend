import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../Services/auth-service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isPublicAuthEndpoint = /\/Auth\/(Login|RegisterUser|RefreshToken|RevokeToken)(\?|$)/i.test(request.url);
  const accessToken = authService.getAccessToken();
  const authorizedRequest = accessToken && !isPublicAuthEndpoint
    ? request.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : request;

  return next(authorizedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || !accessToken || isPublicAuthEndpoint) {
        return throwError(() => error);
      }

      return authService.refreshSession().pipe(
        switchMap((session) =>
          next(request.clone({
            setHeaders: { Authorization: `Bearer ${session.token}` },
          }))
        ),
        catchError((refreshError) => {
          authService.clearSession();
          void router.navigateByUrl('/Login');
          return throwError(() => refreshError);
        })
      );
    })
  );
};
