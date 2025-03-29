// import { CanActivateFn } from '@angular/router';

// export const authGuard: CanActivateFn = (route, state) => {
//   return true;
// };
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRole = this.authService.getRole(); // Get user role
    const allowedRoles = route.data['roles']; // Allowed roles from route

    if (allowedRoles.includes(userRole)) {
      return true; // Allow access
    }

    // If not allowed, redirect to dashboard
    this.router.navigate(['/dashboard']);
    return false;
  }
}
