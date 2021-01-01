import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { ProfileComponent } from './user/profile/profile.component';
import { UserRequestInterceptor } from './user/user.request.interceptor';
import { AuthenticationService } from './user/authentication.service';
import { AuthGuard } from './user/guards/auth.guard';
import { DoctorComponent } from './doctor/doctor.component';
import { PatientComponent } from './patient/patient.component';
import { PatientService } from './patient/patient.service';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AnonymousLayoutComponent } from './anonymous-layout/anonymous-layout.component';
import { AuthenticatedLayoutComponent } from './authenticated-layout/authenticated-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    ProfileComponent,
    DoctorComponent,
    PatientComponent,
    NavComponent,
    AnonymousLayoutComponent,
    AuthenticatedLayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    MatTabsModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ChartsModule,
    LayoutModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
    MatTableModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UserRequestInterceptor,
      multi: true
    },
    AuthenticationService,
    AuthGuard,
    PatientService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
