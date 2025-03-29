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
import { DomSanitizer } from '@angular/platform-browser';

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
  form!: FormGroup;
  isLoading = false;
  errorMessage: string = "";
  districtList: any[];
  officeList: any[];
  branchList: any[];
  roleList: any[];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: AppServiceService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private authService:AuthService
  ) {}
   ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      
      dcode: ['', Validators.required],
      officeId: ['', Validators.required],
      branchId: ['', Validators.required],
      RoleId: ['', Validators.required],
    });

    this.fetchDistricts();

    this.form.get('dcode')?.valueChanges.subscribe((did) => {
      this.onDistrictChange(did);
    });

    this.form.get('officeId')?.valueChanges.subscribe((officeId) => {
      this.onOfficeChange(officeId);
    });
    
    this.fetchRoleList();

    // this.form = this.formBuilder.group({
    //   name: '',
    //   username: '',
    //   password: '',
    //   dcode: '',
    //   officeId: [{ value: '' }],
    //   branchId: [{ value: '' }],
    //   RoleId: [{ value: '' }],
    // });

  }
  sanitizeInput(value: string) {
    return this.sanitizer.sanitize(1, value) || ''; // Prevent XSS attacks
  }
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
    debugger;
    if (this.form.invalid) {
      let errorMessage = "";

      if (this.form.get("name")?.invalid) {
        errorMessage += "• Name is required and must be at least 3 characters long.<br>";
      }
      if (this.form.get("username")?.invalid) {
        errorMessage += "• Username is required and must be at least 4 characters long.<br>";
      }
      if (this.form.get("password")?.invalid) {
        if (this.form.get("password")?.errors?.["required"]) {
          errorMessage += "• Password is required.<br>";
        }
        if (this.form.get("password")?.errors?.["minlength"]) {
          errorMessage += "• Password must be at least 8 characters long.<br>";
        }
        if (this.form.get("password")?.errors?.["pattern"]) {
          errorMessage += "• Password must contain at least:<br> - One uppercase letter<br> - One lowercase letter<br> - One number<br> - One special character (@$!%*?&).<br>";
        }
      }
      if (this.form.get("dcode")?.invalid) {
        errorMessage += "• District Code is required.<br>";
      }
      if (this.form.get("officeId")?.invalid) {
        errorMessage += "• Office selection is required.<br>";
      }
      if (this.form.get("branchId")?.invalid) {
        errorMessage += "• Branch selection is required.<br>";
      }
      if (this.form.get("RoleId")?.invalid) {
        errorMessage += "• Role selection is required.<br>";
      }
  
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        html: errorMessage, // HTML format for multiple error messages
      });      return;
    }

    this.isLoading = true;
    this.errorMessage = "";

    let user = {
      name: this.sanitizeInput(this.form.value.name),
      username: this.sanitizeInput(this.form.value.username),
      password: this.sanitizeInput(this.form.value.password),
      dcode: this.form.value.dcode,
      officeId: this.form.value.officeId,
      branchId: this.form.value.branchId,
      RoleId: this.form.value.RoleId
    };


  this.apiService.RegisterPost(user).subscribe({
    next: (response) => {
      if (response && response.user) {
        this.authService.authenticateUser(response.user,response.accessToken,response.refreshToken); // ✅ Store user details

        // const { token, RoleId, dcode, officeId, branchId } = response.user;
  
        // // 🔹 Store token securely in sessionStorage
        // sessionStorage.setItem("token", token);
        // sessionStorage.setItem("RoleId", RoleId);
        // sessionStorage.setItem("dcode", dcode);
        // sessionStorage.setItem("officeId", officeId);
        // sessionStorage.setItem("branchId", branchId);
  
        Swal.fire('Success', 'Registration successful', 'success');
    

        // ✅ Redirect to dashboard after successful registration
        this.router.navigate(['/dashboard']).then(() => {
          window.location.reload();
        });
      } else {
        throw new Error("Invalid response from server");
      }
    },
    error: (err) => {
      this.isLoading = false;
      Swal.fire("Error", err.error?.message || "Registration failed", "error");
      console.error("Registration Error:", err);
    },
  });
  }
  // submit(): void {

  //   let user = this.form?.getRawValue();

  //   if (
  //     user.dcode == '' ||
  //     user.officeId == '' ||
  //     user.branchId == '' ||
  //     user.name == '' ||
  //     user.username == '' ||
  //     user.password == '' ||
  //     user.RoleId == ''
  //   ) {
  //     Swal.fire('Error', 'Please Enter all the Details', 'error');
  //   } else {
  //     this.apiService.RegisterPost(user).subscribe(
  //       (response) => {
  //         const token = response.user.token;
  //         const roleId = response.user.RoleId; // You may extract roleId based on your response structure

  //         // Automatically log the user in after registration
  //         this.authService.login(user.username, token, roleId,user.dcode,user.officeId,user.branchId);
  //         // Emit authentication status as true after successful registration
  //         // Emitters.authEmitter.emit(true);
  //         Swal.fire('Success', 'Registration successful', 'success');
  //         this.router.navigate(['/dashboard']).then(() => {
  //           window.location.reload();
  //         });
  //       },

  //       (err) => {
  //         Swal.fire('Error', err.error.message, 'error');
  //       }
  //     );
  //   }
  // }
}