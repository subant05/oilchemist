import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'oilchemist';

  constructor(private authService: AuthService){}

  ngOnInit(){
    // this.authService.autoLogin()
  }
}
