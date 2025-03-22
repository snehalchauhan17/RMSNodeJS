import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private router: Router,
     private authService: AuthService // Inject AuthService
  ) {}

  handleError(error: any): void {
    console.error('An error occurred:', error);
   // Perform Logout
   this.authService.logout();
    this.router.navigate(['/error'], {
      queryParams: { status: 500, message: 'An unexpected error occurred.' },
    });
  }
}