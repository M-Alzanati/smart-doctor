import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { ProfileComponent } from './user/profile/profile.component';
import { DoctorComponent } from './doctor/doctor.component';
import { PatientComponent } from './patient/patient.component';
import { AnonymousLayoutComponent } from './anonymous-layout/anonymous-layout.component';
import { AuthenticatedLayoutComponent } from './authenticated-layout/authenticated-layout.component';
import { AuthGuard } from './user/guards/auth.guard';
import { LoggedInAuthGuard } from './user/guards/logged-in-auth.guard';

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
      { path: 'sign-up', component: SignUpComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
