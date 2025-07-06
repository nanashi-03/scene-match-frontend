import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';


export const authGuard: CanActivateFn = (_route, _state) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const snack = inject(MatSnackBar);
  if (auth.isAuthenticated()){
    return true;
  }
  router.navigate(['/login']);
  snack.open("Login or Register!", 'Close', { duration: 3000 });
  return false;
};
