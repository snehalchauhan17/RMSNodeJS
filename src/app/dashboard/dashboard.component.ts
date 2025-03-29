import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppServiceService } from '../app-service.service';
import { Emitters } from '../emitters/emitter';
import { AuthService } from '../auth.service'; // Import the AuthService

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  showDataEntry = false;
  showRecordList = false;
  UserName = '';
  authenticated: boolean = false;
  roleId: number;
  name: any;
  RoleName: any;
  constructor(
    private router: Router,
    private http: HttpClient,
    private apiService: AppServiceService,
    private authService: AuthService // Inject AuthService
  ) {
    this.showDataEntry = false;
  }

  ngOnInit() {
debugger;
    this.roleId = this.authService.getRole();
    this.UserName = sessionStorage.getItem('username') || '';
    this.getUserName();
    this.Auth();
  }

  Auth() {
    this.authService.authenticated$.subscribe((auth) => {
      this.authenticated = auth;
    });

    if (!this.authenticated) {
      this.router.navigate(['/login']);
    }
  }
  LogOut(): void {
    this.authService.logout(); // Clears the session storage
    // Call the logout API to clear the JWT cookie
    this.apiService.LogoutPost().subscribe((response) => {
      // After successfully logging out, redirect to login page
      this.router.navigate(['/login']);
    });
  }
  getUserName() {

    if (this.UserName && this.roleId) {
      this.apiService.GetUserName().subscribe({
        next: (userList) => {
          const user = userList.find((user) => user.username === this.UserName);
          if (user) {
            this.name = user.name;
     
          } else {
            console.warn("User not found in the list.");
          }
        },
        error: (err) => {
          console.error("Error fetching users:", err);
        },
      });
  
      this.apiService.GetRoleMasterList().subscribe({
        next: (roleList) => {
          const role = roleList.find((role) => role.RoleId === this.roleId);
          if (role) {
            this.RoleName = role.RoleName;
    
          } else {
            console.warn("Role not found in the list.");
          }
        },
        error: (err) => {
          console.error("Error fetching roles:", err);
        },
      });
    }
    // if (this.UserName && this.roleId) {
    //   // Fetch both userlist and rolelist
    //   this.apiService.GetUserName().subscribe((userList) => {
    //     const user = userList.find((user) => user.username === this.UserName);
    //     if (user) {
    //       this.name = user.name;
   
    //     }
    //   });

    //   this.apiService.GetRoleMasterList().subscribe((roleList) => {

    //     const role = roleList.find((role) => role.RoleId === this.roleId);
    //     if (role) {
    //       this.RoleName = role.RoleName;
  
    //     }
    //   });
    // }
  }

}
