import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  form: FormGroup;

  constructor(private authService: AuthenticationService, private formBuilder: FormBuilder, private router: Router) { 
    this.form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]))
    })
  }

  ngOnInit(): void {
  }

  signInUser(){
    this.authService.signIn(
      this.form.get('email')?.value,
      this.form.get('password')?.value
    );
  }

  onSignup() {
    this.router.navigate(['sign-up']);
  }

  onForgetPassword(){
    
  }
}
