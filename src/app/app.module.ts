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
    OfficeListComponent,
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
