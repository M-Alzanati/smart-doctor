import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { ProfileComponent } from './user/profile/profile.component';
import { DoctorComponent } from './doctor/doctor.component';
import { PatientComponent } from './patient/patient.component';
import { AuthGuard } from './user/guards/auth.guard';
import { LoggedInAuthGuard } from './user/guards/logged-in-auth.guard';

const routes: Routes = [
  {path: '', redirectTo: '/sign-in', pathMatch: 'full'},
  {path: 'sign-in', component: SignInComponent, canActivate: [LoggedInAuthGuard]},
  {path: 'sign-up', component: SignUpComponent,  canActivate: [LoggedInAuthGuard]},
  {path: 'doctor', component: DoctorComponent, canActivate: [AuthGuard]},
  {path: 'patient', component: PatientComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
