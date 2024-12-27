import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OldPwdValidators } from './old-pwd.validators';
import { AppServiceService } from 'src/app/app-service.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  ChangeForm: FormGroup;
  user: any;
  message ='';
  error ='';
  constructor(
    private formbuilder: FormBuilder,
    private apiservice: AppServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {}


  ngOnInit(): void {
    debugger;
    this.initializeForm();
  }
  
  initializeForm(): void {
    this.ChangeForm = this.formbuilder.group(
      {
        oldPassword: ['', [Validators.required, Validators.maxLength(20)]],
        newPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      },
      {
        validators: this.matchPasswords('newPassword', 'confirmPassword'), // Ensure it's in validators
      }
    );
    
  }

  matchPasswords(newPasswordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup) => {
      const newPassword = group.controls[newPasswordKey];
      const confirmPassword = group.controls[confirmPasswordKey];
  
      if (confirmPassword.errors && !confirmPassword.errors['notMatching']) {
        // Return if other errors exist on the confirmPassword field
        return;
      }
  
      if (newPassword.value !== confirmPassword.value) {
        confirmPassword.setErrors({ notMatching: true });
      } else {
        confirmPassword.setErrors(null);
      }
    };
  }
  

  onSubmit(): void {
    debugger;
   
    const { oldPassword, newPassword } = this.ChangeForm.value;
   const token = sessionStorage.getItem('codedtoken'); // Assuming the token is stored in localStorage
  //  const token = this.authService.decodeToken(token);
    if (!token) {
      this.error = 'User not authenticated. Please log in again.';
      return;
    }

    this.apiservice.changePassword(token, oldPassword, newPassword).subscribe(
      (response) => {
        this.message = response.message;
        this.error = '';
          Swal.fire('Success', response.message, 'success');
        this.ChangeForm.reset();
      },
      (err) => {
        this.error = err.error.message || 'Error changing password';
        this.message = '';
      }
    );
  }
}
