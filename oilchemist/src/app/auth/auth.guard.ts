import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take} from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router, public auth: AngularFireAuth){}

    canActivate(route: ActivatedRouteSnapshot
        , router: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree>{
           return new Promise((resolve, reject)=>{
            this.auth.authState.subscribe((auth)=>{
                console.log(auth)
                    if(auth)
                         resolve( true)
                    else{
                         this.router.createUrlTree(['/login'])
                         resolve( this.router.createUrlTree(['/login']))
                        }
                })
           })

            // return this.authService.user.pipe(
            //     take(1)
            //     ,map(userData=>{
            //         const isAuth =  !!userData

            //         if(isAuth) 
            //             return isAuth

            //         return this.router.createUrlTree(['/login'])
            //     })
            // )
    }
}