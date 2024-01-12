import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  showDataEntry = false;
  constructor(private router: Router) {
    this.showDataEntry = false;
  }

  onNavigateToNewComponent() {
    this.showDataEntry = !this.showDataEntry;
  }
}
