import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth-service';

export const authGuardGuard: CanActivateFn = (route, state) => {

  let authservice = inject(AuthService);
  let router = inject(Router);
  if(authservice.getUserLogged()) {
    return true;
  } else {
    router.navigateByUrl('/Login');
    return false;
  }
};
