import { AbstractControl, ValidationErrors } from '@angular/forms';

export class OldPwdValidators {
  static shouldBe1234(
    control: AbstractControl
  ): Promise<ValidationErrors | null> {
    return new Promise((resolve, reject) => {
      if (control.value !== '1234') resolve({ shouldBe1234: true });
      else resolve(null);
    });
  }

  static matchPwds(control: AbstractControl) {
    let newPassword = control.get('newPassword');
    let confirmPassword = control.get('confirmPassword');
    if (newPassword?.value !== confirmPassword?.value) {
      return { pwdsDontMatch: true };
    }
    return null;
  }
}
