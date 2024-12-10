import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OldPwdValidators } from './old-pwd.validators';
import { AppServiceService } from 'src/app/app-service.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  ChangeForm: FormGroup;
  user: any;
  constructor(
    private formbuilder: FormBuilder,
    private apiservice: AppServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    debugger;
    this.initializeForm();
  }
  initializeForm(): void {
    this.ChangeForm = this.formbuilder.group(
      {
        oldPassword: ['',Validators.required, //   OldPwdValidators.shouldBe1234,
            Validators.minLength(6) ],
        newPassword: ['', Validators.required, Validators.minLength(6)],
        confirmPassword: ['', Validators.required, Validators.minLength(6)],
      },
      // {
      //   validator: OldPwdValidators.matchPwds,
      // }
    );
  }

  // ChangePWd(user: any): void {
  //   debugger;
  //   console.log(user.newPassword);
  //   const username = sessionStorage.getItem('username');
  //   // let user = this.ChangeForm?.getRawValue();
  //   user = this.ChangeForm.value;
  //   if (
  //     user.oldPassword == '' ||
  //     user.newPassword == '' ||
  //     user.confirmPassword == ''
  //   ) {
  //     Swal.fire(
  //       'Error',
  //       'Please fill in all required fields correctly',
  //       'error'
  //     );
  //   } else {
  //     console.log(user);
  //     this.apiservice.ChangePawd(username, user).subscribe(
  //       () => {
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
