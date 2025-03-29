import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Router, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DataEntryComponent } from './dashboard/data-entry/data-entry.component';
import { BranchmasterComponent } from './dashboard/branchmaster/branchmaster.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ErrorpageComponent } from './errorpage/errorpage.component';
import { GlobalErrorHandler } from './error-handler.service';
//import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { RecordListComponent } from './dashboard/record-list/record-list.component';
//import { ToastrModule } from 'ngx-toastr';
import { ChangePasswordComponent } from './dashboard/change-password/change-password.component';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { OfficeMasterComponent } from './dashboard/office-master/office-master.component';
import { OfficeListComponent } from './dashboard/office-list/office-list.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list'; // For mat-nav-list
import { MatIconModule } from '@angular/material/icon'; // For mat-icon
import { AuthService } from './auth.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
// Import PrimeNG modules
import { ButtonModule } from 'primeng/button';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    BranchmasterComponent,
    DataEntryComponent,
    RegisterComponent,
    HomeComponent,
    RecordListComponent,
    ChangePasswordComponent,
    OfficeMasterComponent,
    OfficeListComponent
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    TableModule,
    MatPaginatorModule,
    //   ToastrModule.forRoot(),
    MatToolbarModule,  // Import MatToolbarModule
    MatButtonModule,    // Import MatButtonModule
    MatSidenavModule,
    MatListModule,  // ✅ Add this for mat-nav-list
    MatIconModule,  // ✅ Add this for mat-icon
    MatGridListModule,
    MatFormFieldModule,
    MatTableModule,
    MatCheckboxModule,
    MatCardModule ,
    ButtonModule
    
  ],
  providers: [
    AuthService,
    provideAnimationsAsync(),
   { provide: ErrorpageComponent, useClass: GlobalErrorHandler },
   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true,}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
