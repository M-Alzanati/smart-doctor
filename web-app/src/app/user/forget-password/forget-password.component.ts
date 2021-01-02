import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { MessageBoxComponent, DialogData } from '../../common/message-box/message-box.component';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  form: FormGroup;

  constructor(private authService: AuthenticationService, private formBuilder: FormBuilder,
    private router: Router, public dialog: MatDialog) {
    this.form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
    })
  }

  ngOnInit(): void {
  }

  onForgetPassword() {
    if (this.form.valid) {
      this.authService.forgetPassword(this.form.get('email')?.value)
        .subscribe(
          (data) => {
            this.router.navigate(['sigin-in']);
          },
          (error) => {
            let err: DialogData = { title: 'Error', content: error.message };
            this.dialog.open(MessageBoxComponent, { data: err});
          }
        )
    }
  }
}
