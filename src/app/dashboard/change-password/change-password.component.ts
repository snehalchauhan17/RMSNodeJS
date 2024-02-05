import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  ChangeForm: FormGroup;
  constructor(private formbuilder: FormBuilder) {

  }

  ngoninit() {
     this.ChangeForm = this.formbuilder.group({
       oldPassword: '',
       newPassword: '',
       confirmPassword: '',
     });
  }
  submit() {}
}
