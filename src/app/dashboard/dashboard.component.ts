import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppServiceService } from '../app-service.service';
import { Emitters } from '../emitters/emitter';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  showDataEntry = false;
  showRecordList = false;
  message = '';
  authenticated = false;
  constructor(
    private router: Router,
    private http: HttpClient,

    private apiService: AppServiceService
  ) {
    this.showDataEntry = false;
  }
  ngOnInit() {
    debugger;
    this.getUserName();
    this.Auth();
  }

  Auth() {
    debugger;
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.authenticated = auth;
    });
  }
  LogOut(): void {
    this.apiService.LogoutPost().subscribe(() => (this.authenticated = false));
  }
  getUserName() {
    this.apiService.GetUserName().subscribe(
      (res: any) => {
        console.log(res);
        this.message = `Hi ${res.name}`;
        Emitters.authEmitter.emit(true);
      },
      (error) => {
        this.message = 'You are not logged in';
        Emitters.authEmitter.emit(false);
        // Handle error
        // console.error('Error in component:', error);
      }
    );
  }

  onNavigateToNewComponent() {
    this.showDataEntry = !this.showDataEntry;
  }
  onNavigateToRecordList() {
    this.showRecordList = !this.showRecordList;
  }
}
