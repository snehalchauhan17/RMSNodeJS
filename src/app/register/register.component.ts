import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {  FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AppServiceService } from 'src/app/app-service.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: AppServiceService,
    private http: HttpClient,
    private router: Router
  ) {
    // initialize your form in the constructor
    this.form = this.formBuilder.group({
      name: '',
      username: '',
      password: '',
    });
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: '',
      username: '',
      password: '',
    });
  }
  // Register(user:any):void {

  // }


  submit(): void {
    let user = this.form?.getRawValue();
    console.log(user);

    if (user.name == '' || user.username == '' || user.password == '') {
      Swal.fire('Error', 'Please Enter all the Details', 'error');
    } else {
       console.log(user);
       this.apiService.RegisterPost(user).subscribe(() => this.router.navigate(['/']),
         (err) => {
           Swal.fire('Error', err.error.message, 'error');
         }
       );
    }

  }
}
