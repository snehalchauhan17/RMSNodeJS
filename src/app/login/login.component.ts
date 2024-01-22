import { Component, OnInit, afterNextRender } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder,FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AppServiceService } from '../app-service.service';

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
    private formbuilder:FormBuilder
  ) {
    this.form = this.formbuilder.group({
      username: '',
      password: '',
    });
  }

  ngOnInit(){
//this.onSignInClick();
this.form = this.formbuilder.group({
  username :'',
  password:'',
})
  }
  submit():void{
    debugger;
    let user = this.form?.getRawValue();

    if (user.username == '' || user.password == '') {
    Swal.fire('Error', 'Please Enter all the Details', 'error');
  } else {
    console.log("submit",user);
    this.apiService.LoginPost(user).subscribe(() => this.router.navigate(['/dashboard']),
    (err) => {
      console.log("login",user)
      Swal.fire('Error', err.error.message, 'error');
    }
    );
  }



  }

  
}
