import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppServiceService } from '../app-service.service';
import { Emitters } from '../emitters/emitter';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  showDataEntry = false;
  message = '';
  authenticated = false;
  menuOpen: boolean = false;
  constructor(
    private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private apiService: AppServiceService
  ) {
    this.showDataEntry = false;
  }
  ngOnInit() {
    this.Auth();
  }
 

  Auth() {
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.authenticated = auth;
    });
  }
  LogOut(): void {
    this.apiService.LogoutPost().subscribe(() => (this.authenticated = false));
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    document.querySelector('.nav-links')?.classList.toggle('show');
  }
}
