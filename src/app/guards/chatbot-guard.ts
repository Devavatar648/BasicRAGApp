import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user-service';

export const chatbotGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);
  console.log("Guard running : ",userService.isLoggedin.getValue());
  return userService.isLoggedin.getValue()?true:router.createUrlTree(['/login']);
};
