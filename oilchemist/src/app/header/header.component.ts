import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false
  userSubscription: Subscription
  @ViewChild('collapsable') collapsable: ElementRef

  constructor(private router: Router,private authService: AuthService) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.afAuth.authState.subscribe(user=>{
      this.isAuthenticated = !!user
      this.router.events.subscribe((event: NavigationEnd)=>{
        if(event instanceof NavigationEnd){
          this.collapsable.nativeElement.classList.remove("show")
        }
      })
    })
  }

  ngOnDestroy(){
    this.userSubscription.unsubscribe()
  }

  onLogin(){
    this.router.navigate(["/login"])
  }

  onLogout(){
    this.authService.logout()
  }
}
