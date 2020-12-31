import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_URL } from '../../environments/environment'
import { UserRoles } from '../user/sign-up/user-roles';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private router: Router) { }
  jsonHeader = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  getAccessToken() {
    return localStorage.getItem('user_access_token');
  }

  getUserId() {
    return localStorage.getItem('user_id');
  }

  signUp(fName: string, lName: string, email: string, password: string, role: string) {
    return this.http.post(
      API_URL + '/register',
      {
        'first_name': fName,
        'last_name': lName,
        'email': email,
        'password': password,
        'role': role
      },
      this.jsonHeader
    );
  }

  signIn(email: string, password: string) {
    return this.http.post(
      API_URL + '/login',
      {
        'email': email,
        'password': password
      },
      this.jsonHeader
    ).subscribe(
      (result: any) => {
        localStorage.setItem('user_access_token', result['access_token']);
        localStorage.setItem('refresh_token', result['refresh_token'])
        localStorage.setItem('user_id', result['user_id']);
        localStorage.setItem('user_role', result['user_role']);

        if (UserRoles.PATIENT == result['user_role'])
          this.router.navigate(['patient']);
        else if (UserRoles.DOCTOR == result['user_role'])
          this.router.navigate(['doctor']);
        else
          this.router.navigate(['profile']);
      });
  }

  signOut() {
    return this.http.delete(
      API_URL + '/logout',
      this.jsonHeader
    ).subscribe(
      (result: any) => {
        this.router.navigate(['sign-in']);
      }
    );
  }

  authenticate() {
    return this.http.post(
      API_URL + '/authenticate',
      {},
      this.jsonHeader
    );
  }

  forgetPassword(email: string) {
    return this.http.post(
      API_URL + '/forget_password',
      {
        'email': email,
      },
      this.jsonHeader
    );
  }

  resetPassword(resetToken: string, password: string) {
    return this.http.post(
      API_URL + '/reset_password',
      {
        'password': password,
        'reset_token': resetToken
      },
      this.jsonHeader
    );
  }
}
