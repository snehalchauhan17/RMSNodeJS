import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DataEntryComponent } from './dashboard/data-entry/data-entry.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { RecordListComponent } from './dashboard/record-list/record-list.component';
import { ChangePasswordComponent } from './dashboard/change-password/change-password.component';

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

      { path: 'dataentry/:_id', component: DataEntryComponent },
      // ... other child routes
    ],
  },

  // Add other routes as needed
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
