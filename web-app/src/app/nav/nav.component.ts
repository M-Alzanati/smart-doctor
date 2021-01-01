import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserRoles } from '../user/sign-up/user-roles';
import { AuthenticationService } from '../user/authentication.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  private doctorMenuItems: string[] = ['dashboard', 'doctor']
  private patientMenuItems: string[] = ['dashboard', 'patient']
  menuItems: string[] = [];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthenticationService) {}

  ngOnInit() {
    let role = localStorage.getItem('user_role');
    if (role == UserRoles.PATIENT)
      this.menuItems = this.patientMenuItems;
    else if (role == UserRoles.DOCTOR)
      this.menuItems = this.doctorMenuItems;
    else
      this.menuItems = [];
  }

  onLogout(){
    this.authService.signOut();
  }
}
