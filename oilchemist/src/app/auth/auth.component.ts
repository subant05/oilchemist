import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms'
import { AuthService, AuthResponseData } from './auth.service';
import {Observable} from 'rxjs'
import { Router } from '@angular/router';
import { ConfirmPasswordValidator } from '../_utils/validators/confirm-password'
 
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.less']
})
export class AuthComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  signInForm: FormGroup;
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
                              this.signInForm.value.login.email
                              ,this.signInForm.value.login.password
                            )
  }

  private confrmPasswordMatch(control: FormControl): {[s: string]: boolean} {
    if(control.value !== this.password){
      return {"passwordsDoNotMatch":true}
    }
    return null;
  }

  private confirmPasswordValidation(control){
    if( !this.signUpForm)
      return null
    if(this.signUpForm.get("login.password").value !== this.signUpForm.get("login.confirmPassword").value){
      return {confirmPasswordMatch: true}
    }

    return null
  }

  ngOnInit(): void {
    this.signInForm =  new FormGroup({
        login: new FormGroup({
          email: new FormControl(null,[Validators.email,Validators.required])
          , password: new FormControl(null, [Validators.required, Validators.minLength(6)])
        })
    })
  }

  onSwitchLoginState(){
    this.isLoginMode = !this.isLoginMode

    switch(this.isLoginMode) {
      case false:
        this.signUpForm =  new FormGroup({
              login: new FormGroup({
                email: new FormControl(null,[Validators.email,Validators.required])
                , password: new FormControl(null, [Validators.required, Validators.minLength(6)])
                , confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(6),this.confirmPasswordValidation.bind(this)])
              })
          })
          break;
      default:
        this.signInForm =  new FormGroup({
              login: new FormGroup({
                email: new FormControl(null,[Validators.email,Validators.required])
                , password: new FormControl(null, [Validators.required, Validators.minLength(6)])
              })
          })
        break;

    }
  }

  
  onSubmit(){

    switch(this.isLoginMode){
      case true:
        if(!this.signInForm.valid)
          return;

          this.isLoading = true
          this.error = null
          this.login();

        break;
      default:
        if(!this.signUpForm.valid){
          debugger;
          return;
        }
          this.isLoading = true
          this.error = null    
          this.signup();
        break;
    }

    this.authObservable.subscribe(responseData=>{
        console.log(`${this.isLoginMode ? 'You are logged in.' : 'You are Signed Up'}`, responseData)
        this.isLoading = false
        this.router.navigate(['/account'])
      },this.errorHandler.bind(this)
    )
      
    this.signInForm.reset()
  }

  onClose(){
    console.log("CLOSE")
    this.error = ""
  }
}
