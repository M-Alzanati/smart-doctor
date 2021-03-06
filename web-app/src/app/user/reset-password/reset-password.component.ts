import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogData, MessageBoxComponent } from 'src/app/common/message-box/message-box.component';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private activeRoute: ActivatedRoute, 
    private router: Router, private authService: AuthenticationService, public dialog: MatDialog) { 
      this.form = this.formBuilder.group({
        password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
        confPassword: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]))
      })
    }

  ngOnInit(): void {

  }

  onResetPassword(){
    let paths = this.activeRoute.snapshot.url;
    if (paths && paths.length > 1 && this.form.valid) {
      let reset_token: string = paths[1].toString();
      this.authService.resetPassword(reset_token, this.form.get('password')?.value)
      .subscribe(
        (data) => {
          this.router.navigate(['sign-in']);
        },
        (error) =>{
          let err: DialogData = { title: 'Error', content: error.message };
          this.dialog.open(MessageBoxComponent, { data: err});
        }
      )
    }
  }
}
