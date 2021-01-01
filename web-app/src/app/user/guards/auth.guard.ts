import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { from, Observable, ObservableInput } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthenticationService } from '../authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthenticationService) {

  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.authenticate().pipe(
      map(userId => {
        if (this.authService.getUserId() == userId)
          return true;
        else {
          this.router.navigate(['/sign-in']);
          return false;
        }
      }),
      catchError(this.handleError)
    );
  }

  handleError(err: any, caught: Observable<boolean>) : ObservableInput<any>{
    this.router.navigate(['sigin-in']);
    return Observable.throw('');;
  }
}
