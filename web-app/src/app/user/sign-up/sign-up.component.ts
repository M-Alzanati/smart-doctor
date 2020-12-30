import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { MustMatch } from '../../_helper/must-match.validator';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  form: FormGroup;

  constructor(private authService: AuthenticationService, private formBuilder: FormBuilder, private router: Router) {
    this.form = this.formBuilder.group({
      fName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
      lName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      confirmPass: new FormControl('', Validators.compose([Validators.required]))
    }, {
      validator: MustMatch('password', 'confirmPass')
    });
  }

  ngOnInit(): void {
  }

  signUpUser() {
    this.authService.signUp(
      this.form.get('fName')?.value,
      this.form.get('lName')?.value,
      this.form.get('email')?.value,
      this.form.get('password')?.value
    ).subscribe(
      (result: any) => {
        if (result['status'] == 'success') {
          this.form.reset();
          this.router.navigate(['sign-in']);
        }
      },
      (error) => {
        debugger;
      }
    )
  }

  checkPasswords(group: FormGroup) {
    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirmPass')?.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  ValidatePassword(control: AbstractControl): { [key: string]: any } | null {
    debugger;
    if (control.value && control.value) {
      return { 'password not valid': true };
    }
    return null;
  }
}
