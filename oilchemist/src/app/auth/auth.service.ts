import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject} from 'rxjs';
import {catchError, tap} from 'rxjs/operators'
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'



export interface AuthResponseData {
    idToken	:string;
    email:	string;
    refreshToken:	string;
    expiresIn:	string;
    localId: string;
}

@Injectable({
    providedIn: "root"
})
export class AuthService {

    user = new BehaviorSubject<User>(null)
    autoLogoutTimer: any;

    constructor(private http: HttpClient, private router: Router){}

    private handleError(errorRes: HttpErrorResponse){
        if(!errorRes.error || !errorRes.error.error)
        return throwError("Unknown system error occured. Please try again later.")

        switch(errorRes.error.error.message){
            case 'EMAIL_EXISTS':
                return throwError('This account already exists.')
                break;
            case 'OPERATION_NOT_ALLOWED':
                return throwError('Sorry, but we are unable to sign you up at this time.')
                break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                return throwError( 'There were too many sign up attempts. Please try again later.')
                break;
            case 'EMAIL_NOT_FOUND':
                return throwError('This account was not found.')
                break;
            case 'INVALID_PASSWORD':
                return throwError('Your login information was invalid')
                break;
            case 'USER_DISABLED':
                return throwError( 'Your account was disabled')
                break;
        }
    }

    private formatExpirationDate(expiresIn){
        return new Date(new Date().getTime() + expiresIn * 1000)
    }

    private handleAuthentication(email: string, userId:string, token: string, expiresIn: number){
        const expirationDate = this.formatExpirationDate(expiresIn)
        const  _user = new User(
            email
            ,userId
            ,token,
            expirationDate)
        
        localStorage.setItem("userData",JSON.stringify(_user))
        this.user.next(_user)
    }

    autoLogin(){
        const user: {
                        email: string;
                        id: string;
                        _token: string;
                        _tokenExpirationDate: string
                    } = JSON.parse(localStorage.getItem("userData"))
        if(!user)
            return;

        const loadedUser = new User( user.email
            , user.id
            , user._token
            , new Date(user._tokenExpirationDate))

        if(loadedUser.token){
            this.user.next(loadedUser)
            if(!this.autoLogoutTimer)
                this.autoLogout(user._tokenExpirationDate)
        }
    }

    signup(email: string, password: string): Observable<AuthResponseData> {
       return this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + environment.firebase.apiKey
        , {
            email
            , password
            , returnSecureToken: true
        }).pipe(
            catchError(this.handleError)
            , tap(resData=>{
                const _user = this.handleAuthentication(
                    resData.email
                    ,resData.localId
                    ,resData.idToken
                    , +resData.expiresIn)
                }
            ) 
        )
    }

    login(email: string, password: string): Observable<AuthResponseData> {
        return this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + environment.firebase.apiKey
         , {
             email
             , password
             , returnSecureToken: true
         }).pipe(
             catchError(this.handleError),
             tap(resData=>{
                const _user = this.handleAuthentication(
                    resData.email
                    ,resData.localId
                    ,resData.idToken
                    , +resData.expiresIn)
                }
            ) 
        )
    }

    logout(){
        localStorage.removeItem("userData")
        if(this.autoLogoutTimer)
            clearTimeout( this.autoLogoutTimer)

        this.user.next(null)
        this.router.navigate(['/login'])
    }

    autoLogout(expiresIn: string){
        const that = this;
        const checkLogin = (function R(expiresIn){
            if(new Date(expiresIn) < new Date()) {
                this.logout()
            } else {
                setTimeout(()=>R.call(this, expiresIn),1000)
            }
                
        }).call(this,expiresIn)
    }

}