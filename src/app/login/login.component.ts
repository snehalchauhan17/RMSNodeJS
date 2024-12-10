import { Component, OnInit, afterNextRender } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder,FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AppServiceService } from '../app-service.service';
import { AuthService } from '../auth.service';  // Import the AuthService
import { Emitters } from '../emitters/emitter';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  constructor(
    private router: Router,
    private http: HttpClient,
    private apiService: AppServiceService,
    private authService: AuthService,
    private formbuilder: FormBuilder
  ) {
    this.form = this.formbuilder.group({
      name: '',
      username: '',
      password: '',
    });
  }

  ngOnInit() {
    //this.onSignInClick();

    this.form = this.formbuilder.group({
      username: '',
      password: '',
    });
  }

  submit(): void {
    debugger;
    let user = this.form?.getRawValue();
    if (user.username == '' || user.password == '') {
      Swal.fire('Error', 'Please Enter all the Details', 'error');
    } else {
      console.log(user);

      // Call API to log in
      this.apiService.LoginPost(user).subscribe(
        (response) => {

          // On success, navigate to dashboard
          const token = response.user.token; // Assuming token is returned in the response
          // Decode the JWT token to extract RoleId
          const decodedToken = this.authService.decodeToken(token);
          const roleId = decodedToken?.RoleId;
             const dcode = decodedToken?.dcode;
                const officeId = decodedToken?.officeId;
                   const branchId = decodedToken?.branchId;

          this.authService.login(
            user.username,
            decodedToken,
            roleId,
            dcode,
            officeId,
            branchId
          );

          Swal.fire('Success', response.message, 'success');
          // Navigate to dashboard and reload page
          this.router.navigate(['/dashboard']).then(() => {
            window.location.reload();
          });
        },

        (err) => {
          Swal.fire('Error', err.error.message, 'error');
        }
      );
    }
    //    else {
    //     console.log(user);
    //  //   sessionStorage.setItem('username',user.username);
    //     this.apiService.LoginPost(user).subscribe(
    //       () =>{ this.router.navigate(['/dashboard']).then(()=>{
    //         window.location.reload();
    //       });
    //     },

    //       (err) => {
    //         Swal.fire('Error', err.error.message, 'error');
    //       }

    //     );
    //   }
  }


}
