import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {  FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AppServiceService } from 'src/app/app-service.service';
import Swal from 'sweetalert2';
import { trigger, transition, style, animate } from '@angular/animations';
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
  constructor(
    private formBuilder: FormBuilder,
    private apiService: AppServiceService,
    private http: HttpClient,
    private router: Router
  ) {
    this.fetchDistricts();
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
      console.log(res);
    });
  }

  // fetchBranch(): void {
  //   this.apiService.getBranchList().subscribe((res) => {
  //     this.branchList = res;
  //     console.log(res);
  //   });
  // }

  onDistrictChange(did: number): void {
    debugger;
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
    debugger;
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
  //     console.log(res);
  //   });
  // }

  submit(): void {
    debugger;
    let user = this.form?.getRawValue();
    console.log(user);

    if (
      user.dcode == '' ||
      user.officeId == '' ||
      user.branchId == '' ||
      user.name == '' ||
      user.username == '' ||
      user.password == ''
    ) {
      Swal.fire('Error', 'Please Enter all the Details', 'error');
    } else {
      console.log(user);
      this.apiService.RegisterPost(user).subscribe(
        () => {
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
