import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false
  userSub: Subscription

  constructor(private router: Router,private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user=>{
      this.isAuthenticated = !!user
    })
  }

  ngOnDestroy(){
    this.userSub.unsubscribe()
  }

  onLogin(){
    this.router.navigate(["/login"])
  }

  onLogout(){
    this.authService.logout()
  }
}
