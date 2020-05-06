import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms'
import { AuthService, AuthResponseData } from './auth.service';
import {Observable, Subscription} from 'rxjs'
import { Router } from '@angular/router';
import { ProfileService } from '../account/profile/profile.service'
 
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.less']
})
export class AuthComponent implements OnInit, OnDestroy {

  private verifyUsernameSubscription: Subscription;
  private verifyEmaileSubscription: Subscription;


  isLoginMode = true;
  isSubmiting = false;
  signInForm: FormGroup;
  signUpForm: FormGroup
  error: string;
  password:string
  authObservable: Observable<AuthResponseData>

  constructor(private authService: AuthService
    , private profileService: ProfileService
    , private router: Router) { }

  private errorHandler(errorRes){
      this.isSubmiting = false
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
     this.authService.login(
                              this.signInForm.value.login.email
                              ,this.signInForm.value.login.password
                            ).then((responseData)=>{
                              console.log(responseData)
                              if(!this.isLoginMode){
                                this.profileService
                                  .createUserProfile(responseData,this.signUpForm.value.login)
                                  .then(()=>{
                                    this.isSubmiting = false
                                    this.router.navigate(['/account'])
                                  })
                              } else {
                                this.isSubmiting = false
                                this.router.navigate(['/account'])
                              }
                            })
  }

  private confirmPasswordValidation(control){
    if( !this.signUpForm)
      return null
    if(this.signUpForm.get("login.password").value !== this.signUpForm.get("login.confirmPassword").value){
      return {confirmPasswordMatch: true}
    }

    return null
  }

  private verifyEmail(control: FormControl): Promise<any> | Observable<any> {
    return new Promise((resolve, reject)=>{
      this.verifyEmaileSubscription = this.authService.verifyEmail(control.value.toLowerCase()).subscribe((data)=>{
        if(data.length){
          resolve({emailIsTaken: true})
        } else{
          resolve(null)
        }
      })
    })
  }

  private verifyUsername(control: FormControl): Promise<any> | Observable<any> {
    return new Promise((resolve, reject)=>{
      this.verifyUsernameSubscription = this.authService.verifyUsername(control.value.toLowerCase()).subscribe((data)=>{
        if(data.length){
          resolve({userNameIsTaken: true})
        } else{
          resolve(null)
        }
      })
    })
  }

  ngOnInit(): void {
    this.signInForm =  new FormGroup({
        login: new FormGroup({
          email: new FormControl(null,[Validators.email,Validators.required])
          , password: new FormControl(null, [Validators.required, Validators.minLength(6)])
        })
    })
  }

  ngOnDestroy(){
    if(this.verifyUsernameSubscription)
      this.verifyUsernameSubscription.unsubscribe()
    if(this.verifyEmaileSubscription)
      this.verifyEmaileSubscription.unsubscribe()
  }

  onSwitchLoginState(){
    this.isLoginMode = !this.isLoginMode

    if(!this.isLoginMode && !this.signUpForm ){
        this.signUpForm =  new FormGroup({
              login: new FormGroup({
                email: new FormControl(null,[Validators.email,Validators.required], [this.verifyEmail.bind(this)])
                , password: new FormControl(null, [
                                              Validators.required
                                              , Validators.minLength(6)
                                              , Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/)])
                , confirmPassword: new FormControl(null, [Validators.required, this.confirmPasswordValidation.bind(this)])
                , username: new FormControl(null, [Validators.required], [this.verifyUsername.bind(this)])
              })
          })
    }
  }

  
  onSubmit(){
    this.isSubmiting = true
    this.error = null

    switch(this.isLoginMode){
      case true:
        if(!this.signInForm.valid){
          this.isSubmiting = false
          return;
        }
          this.login();

        break;
      default:
        if(!this.signUpForm.valid){
          this.isSubmiting = false
          return;
        }
          this.signup();
        break;
    }

    // this.authObservable.subscribe(responseData=>{
    //     if(!this.isLoginMode){
    //       this.profileService
    //         .createUserProfile(responseData,this.signUpForm.value.login)
    //         .then(()=>{
    //           this.isSubmiting = false
    //           this.router.navigate(['/account'])
    //         })
    //     } else {
    //       this.isSubmiting = false
    //       this.router.navigate(['/account'])
    //     }
    //   },this.errorHandler.bind(this)
    // )
      
    this.signInForm.reset()
  }

  onClose(){
    console.log("CLOSE")
    this.error = ""
  }
}
