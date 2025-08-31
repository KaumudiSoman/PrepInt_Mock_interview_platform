import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const toastrService = inject(ToastrService);
  const router = inject(Router);

  return authService.user$.pipe(
    map(user => {
      if(user) {
        return true;
      }
      else {
        toastrService.error('Please Log In', 'Unauthorized Access!');
        return router.createUrlTree(['/login']);
      }
    })
  );
};
