import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth-service';

export const roleGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRole = route.data['role'];

  if (!authService.getUserLogged()) {

    router.navigateByUrl('/Login');

    return false;
  }

  if (authService.getRole() === requiredRole) {

    return true;
  }

  router.navigateByUrl('/Home');

  return false;
};