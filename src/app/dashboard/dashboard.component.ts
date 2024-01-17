import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppServiceService } from '../app-service.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  showDataEntry = false;
  message='';
  constructor(private router: Router,
    private http:HttpClient,
    private apiService: AppServiceService) {
    this.showDataEntry = false;
  }
  ngOnInit() {
    this.getUserName();
      
      }
  getUserName(){
    this.apiService.GetUserName().subscribe(
     (res:any)=>{
      console.log(res)
      this.message =`Hi ${res.name}`;
     },
      (error) => {
        this.message ="You are not logged in"
        // Handle error
       // console.error('Error in component:', error);
      }
    );
  }

  onNavigateToNewComponent() {
    this.showDataEntry = !this.showDataEntry;
  }
}
