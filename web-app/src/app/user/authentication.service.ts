import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_URL } from '../../environments/environment'

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

  signUp(email: string, password: string) {
    return this.http.post(
      API_URL + '/register',
      {
        'email': email,
        'password': password
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
        this.router.navigate(['profile']);
      }
    )
  }

  signOut(email: string, password: string) {
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
}
