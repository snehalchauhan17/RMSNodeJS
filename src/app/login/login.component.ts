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
  form!: FormGroup;
  isLoading = false;
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
    if (this.form.invalid) {
      Swal.fire("Error", "Please enter valid credentials.", "error");
      return;
    }
    this.isLoading = true;
  // 🔹 Encrypt the credentials before sending
  const encryptedData = this.authService.encryptData(this.form.value);

    this.apiService.LoginPost({ data: encryptedData }).subscribe({
      next: (response) => {
     
        if (response && response.accessToken && response.user && response.refreshToken) {
          this.authService.authenticateUser(response.user, response.accessToken,response.refreshToken); // ✅ Store user details
    
        // ✅ Store refresh token in localStorage (only if using it manually)
        localStorage.setItem("refreshToken", response.refreshToken);

          Swal.fire("Success", "Login successful!", "success");
          this.router.navigate(["/dashboard"]).then(() => window.location.reload());
        } else {
          throw new Error("Invalid response from server");
        }
      },
      error: (err) => {
        Swal.fire("Error", err.error.message, "error");
      }
    });
}
  //  // let user = this.form?.getRawValue();
  //   if (user.username == '' || user.password == '') {
  //     Swal.fire('Error', 'Please Enter all the Details', 'error');
  //   } else {


  //     this.apiService.LoginPost(user).subscribe(
  //       (response) => {
 
      
  //         // if (!response || !response.user || !response.user.token) {
  //         //   console.error("Login failed: No token received", response);
  //         //   Swal.fire('Error', 'Login failed: No token received', 'error');
  //         //   return;
  //         // }
      
  //         const token = response.user.token.toString(); // Ensure token is valid
  //         const roleId = response.user.RoleId ?? '';
      
  //         // ✅ Decode the token to verify it
  //         const decodedToken = this.authService.decodeToken(token);
  
      
  //         this.authService.login(user.username, token, roleId, user.dcode, user.officeId, user.branchId);
  //         Swal.fire('Success', 'Login successful', 'success');
  //         this.router.navigate(['/dashboard']).then(() => {
  //           window.location.reload();
  //         });
  //       },
  //       (err) => {
  //         console.error("Login API Error:", err);
  //         Swal.fire('Error', err.error?.message || 'Login failed', 'error');
  //       }
  //     );
  //   }
    //    else {
  
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
