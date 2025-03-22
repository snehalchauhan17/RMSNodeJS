import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { AppServiceService } from '../app-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-errorpage',
  standalone: true,
  imports: [],
  templateUrl: './errorpage.component.html',
  styleUrl: './errorpage.component.css'
})
export class ErrorpageComponent {
  errorCode: number = 404;
  errorMessage: string = 'Page Not Found';

  constructor(private route: ActivatedRoute, private authService:AuthService,     private router: Router,   private apiService: AppServiceService,) {
    this.route.queryParams.subscribe(params => {
      if (params['status']) {
        this.errorCode = params['status'];
        this.errorMessage = params['message'] || 'Something went wrong!';
      }
    });
    
  }
  
  logoutAndRedirect() {
    this.authService.logout(); // Clear session and token
    this.apiService.LogoutPost().subscribe((response) => {
      // After successfully logging out, redirect to login page
      this.router.navigate(['/login']);
    });
  }
}
