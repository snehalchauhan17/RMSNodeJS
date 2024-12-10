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
    debugger;
    this.authService.authenticated$.subscribe((auth) => {
      this.authenticated = auth;
    });

    if (!this.authenticated) {
      this.router.navigate(['/login']);
    }
  }
  LogOut(): void {
    debugger;
    this.authService.logout(); // Clears the session storage
    // Call the logout API to clear the JWT cookie
    this.apiService.LogoutPost().subscribe((response) => {
      // After successfully logging out, redirect to login page
      this.router.navigate(['/login']);
    });
  }
  getUserName() {
    if (this.UserName && this.roleId) {
      // Fetch both userlist and rolelist
      this.apiService.GetUserName().subscribe((userList) => {
        const user = userList.find((user) => user.username === this.UserName);
        if (user) {
          this.name = user.name;
        }
      });

      this.apiService.GetRoleMasterList().subscribe((roleList) => {
        console.log("RoleList:",roleList)
        const role = roleList.find((role) => role.RoleId === this.roleId);
                console.log('RoleId :', role);
        if (role) {
          this.RoleName = role.RoleName;
                 console.log('RoleId :', this.RoleName);
        }
      });
    }
  }

  // onNavigateToNewComponent() {
  //   // this.showDataEntry = !this.showDataEntry;
  //   //     this.showRecordList = false;
  //   this.router.navigate(['/dashboard/dataentry']);
  // }
  // onNavigateToRecordList() {
  //   this.showRecordList = !this.showRecordList;
  //   this.showDataEntry = false;
  // }
}
