import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserRoles } from '../user/sign-up/user-roles';
import { AuthenticationService } from '../user/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  menuItems: NavItemModel[] = [];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router,
    private authService: AuthenticationService) { }

  ngOnInit() {
    let role = localStorage.getItem('user_role');
    let user_id = localStorage.getItem('user_id');

    if (role == UserRoles.PATIENT) {
      this.menuItems.push({ 
        value: 'patient', 
        viewValue: user_id
      });
    }
    else if (role == UserRoles.DOCTOR) {
      this.menuItems.push({ 
        value: 'doctor', 
        viewValue: user_id 
      });
    }
    else {
      this.menuItems = [];
    }
  }

  onLogout() {
    this.authService.signOut();
  }
}

export interface NavItemModel {
  value: string;
  viewValue: string | null;
}
