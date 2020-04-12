import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms'
import { AuthService, AuthResponseData } from './auth.service';
import {Observable} from 'rxjs'
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.less']
})
export class AuthComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  signinForm: FormGroup;
  signUpForm: FormGroup
  error: string;
  password:string
  authObservable: Observable<AuthResponseData>

  constructor(private authService: AuthService, private router: Router) { }

  private errorHandler(errorRes){
      this.isLoading = false
      this.error =  errorRes
      console.log(errorRes)
  }

  private signup(){
    this.authObservable = this.authService
                            .signup(
                              this.signUpForm.value.login.email
                              ,this.signUpForm.value.login.password
                            )
  }

  private login(){
    this.authObservable =  this.authService
                            .login(
                              this.signinForm.value.login.email
                              ,this.signinForm.value.login.password
                            )
  }

  private confrmPasswordMatch(control: FormControl): {[s: string]: boolean} {
    if(control.value !== this.password){
      return {"passwordsDoNotMatch":true}
    }
    return null;
  }

  ngOnInit(): void {
    this.signinForm =  new FormGroup({
        login: new FormGroup({
          email: new FormControl(null,[Validators.email,Validators.required])
          , password: new FormControl(null, [Validators.required, Validators.minLength(6)])
        })
    })
    this.signUpForm =  new FormGroup({
        login: new FormGroup({
          email: new FormControl(null,[Validators.email,Validators.required])
          , password: new FormControl(null, [Validators.required, Validators.minLength(6)])
          , confirmPassword: new FormControl(null, [])
        })
    })

  }

  onSwitchLoginState(){
    this.isLoginMode = !this.isLoginMode
  }

  
  onSubmit(){
    if(!this.signinForm.valid)
      return;
      this.isLoading = true
      this.error = null

      if(this.isLoginMode)
        this.login();
      else
        this.signup();
    
    this.authObservable.subscribe(responseData=>{
        console.log(`${this.isLoginMode ? 'You are logged in.' : 'You are Signed Up'}`, responseData)
        this.isLoading = false
        this.router.navigate(['/account'])
      },this.errorHandler.bind(this)
    )
      
    this.signinForm.reset()
  }

  onClose(){
    console.log("CLOSE")
    this.error = ""
  }
}