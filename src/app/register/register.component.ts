import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {  FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AppServiceService } from 'src/app/app-service.service';
import Swal from 'sweetalert2';
import { trigger, transition, style, animate } from '@angular/animations';
import { Emitters } from '../emitters/emitter';
import { AuthService } from '../auth.service';  // Import the AuthService
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('500ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

  districtList: any[];
  officeList: any[];
  branchList: any[];
  roleList: any[];
  constructor(
    private formBuilder: FormBuilder,
    private apiService: AppServiceService,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    this.fetchDistricts();
    this.fetchRoleList();
    // this.fetchBranch();
    // this.fetchOffice();
    // initialize your form in the constructor
    this.form = this.formBuilder.group({
      name: '',
      username: '',
      password: '',
      dcode: '',
      officeId: [{ value: '' }],
      branchId: [{ value: '' }],
      RoleId: [{ value: '' }],
    });
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: '',
      username: '',
      password: '',
      dcode: '',
      officeId: [{ value: '' }],
      branchId: [{ value: '' }],
      RoleId: [{ value: '' }],
    });

    this.form.get('dcode')?.valueChanges.subscribe((did) => {
      this.onDistrictChange(did);
    });

    this.form.get('officeId')?.valueChanges.subscribe((officeId) => {
      this.onOfficeChange(officeId);
    });
  }
  // Register(user:any):void {

  // }

  fetchDistricts(): void {
    this.apiService.getDistrictList().subscribe((res) => {
      this.districtList = res;
    });
  }
  fetchRoleList(): void {
    this.apiService.GetRoleMasterList().subscribe((res) => {
      this.roleList = res;
    });
  }
  // fetchBranch(): void {
  //   this.apiService.getBranchList().subscribe((res) => {
  //     this.branchList = res;
  //   });
  // }

  onDistrictChange(did: number): void {
    if (did) {
      this.apiService.getOfficeList(did).subscribe((data: any[]) => {
        this.officeList = data;
        this.form.get('officeId')?.enable(); // Enable the office dropdown when offices are loaded
      });
    } else {
      this.officeList = [];
      this.form.get('officeId')?.disable(); // Disable the office dropdown if no district is selected
    }
  }

  onOfficeChange(officeId: number): void {
    if (officeId) {
      this.apiService.getBranchListbyID(officeId).subscribe((data: any[]) => {
        this.branchList = data;
        this.form.get('branch')?.enable(); // Enable the office dropdown when offices are loaded
      });
    } else {
      this.branchList = [];
      this.form.get('branch')?.disable(); // Disable the office dropdown if no district is selected
    }
  }

  // fetchOffice(): void {
  //   this.apiService.getOfficeList().subscribe((res) => {
  //     this.officeList = res;
  //   });
  // }

  submit(): void {

    let user = this.form?.getRawValue();

    if (
      user.dcode == '' ||
      user.officeId == '' ||
      user.branchId == '' ||
      user.name == '' ||
      user.username == '' ||
      user.password == '' ||
      user.RoleId == ''
    ) {
      Swal.fire('Error', 'Please Enter all the Details', 'error');
    } else {
      this.apiService.RegisterPost(user).subscribe(
        (response) => {
          const token = response.user.token;
          const roleId = response.user.RoleId; // You may extract roleId based on your response structure

          // Automatically log the user in after registration
          this.authService.login(user.username, token, roleId,user.dcode,user.officeId,user.branchId);
          // Emit authentication status as true after successful registration
          // Emitters.authEmitter.emit(true);
          Swal.fire('Success', 'Registration successful', 'success');
          this.router.navigate(['/dashboard']).then(() => {
            window.location.reload();
          });
        },

        (err) => {
          Swal.fire('Error', err.error.message, 'error');
        }
      );
    }
  }
}
