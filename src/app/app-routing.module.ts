import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DataEntryComponent } from './dashboard/data-entry/data-entry.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { RecordListComponent } from './dashboard/record-list/record-list.component';
import { ChangePasswordComponent } from './dashboard/change-password/change-password.component';
import {BranchmasterComponent} from './dashboard/branchmaster/branchmaster.component';
import { OfficeMasterComponent } from './dashboard/office-master/office-master.component';
import { OfficeListComponent } from './dashboard/office-list/office-list.component';
import { ErrorpageComponent } from './errorpage/errorpage.component';
const routes: Routes = [
  // { path: '', component: LoginComponent },
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  // { path: 'dashboard/dataentry/:_id', component: DataEntryComponent },
  { path: 'register', component: RegisterComponent },
  // { path: 'dashboard/changepassword', component: ChangePasswordComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'recordlist', component: RecordListComponent },
      { path: 'dataentry', component: DataEntryComponent },
      { path: 'changepassword', component: ChangePasswordComponent },
      { path: 'branchmaster', component: BranchmasterComponent },

      { path: 'dataentry/:_id', component: DataEntryComponent },
      { path: 'OfficeList', component: OfficeListComponent },
      { path: 'OfficeMaster', component: OfficeMasterComponent },
      { path: 'OfficeMaster/:_id', component: OfficeMasterComponent },
      // ... other child routes
    ],
  },
  { path: 'error', component: ErrorpageComponent },
  { path: '**', redirectTo: '/error', pathMatch: 'full' } // Catch-all route


  // Add other routes as needed
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
