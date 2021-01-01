import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { ProfileComponent } from './user/profile/profile.component';
import { DoctorComponent } from './doctor/doctor.component';
import { PatientComponent } from './patient/patient.component';
import { AnonymousLayoutComponent } from './anonymous-layout/anonymous-layout.component';
import { AuthenticatedLayoutComponent } from './authenticated-layout/authenticated-layout.component';
import { AuthGuard } from './user/guards/auth.guard';
import { ForgetPasswordComponent } from './user/forget-password/forget-password.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '', redirectTo: '/sign-in', pathMatch: 'full'
  },
  {
    path: 'app', component: AuthenticatedLayoutComponent, canActivate: [AuthGuard], children: [
      { path: 'doctor', component: DoctorComponent },
      { path: 'patient', component: PatientComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  },
  {
    path: '', component: AnonymousLayoutComponent, children: [
      { path: 'sign-in', component: SignInComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'forget-password', component: ForgetPasswordComponent },
      { path: 'reset-password/:id', component: ResetPasswordComponent, pathMatch: 'prefix' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router) {
    this.router.errorHandler = (error: any) => {
      this.router.navigate(['']);
    }
  }
}
