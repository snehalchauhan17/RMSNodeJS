import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DataEntryComponent } from './dashboard/data-entry/data-entry.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { RecordListComponent } from './dashboard/record-list/record-list.component';

const routes: Routes = [
  // { path: '', component: LoginComponent },
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'dataentry', component: DataEntryComponent },
      { path: 'recordlist', component: RecordListComponent },
      // Add other sub-routes as needed
    ],
  },
  { path: 'register', component: RegisterComponent },
  // Add other routes as needed
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
