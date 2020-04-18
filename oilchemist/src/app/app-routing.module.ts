import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: ''
    , loadChildren:()=> import('./recipes/recipes.module').then(module=>module.RecipesModule)
  }
  , {
    path: 'login'
    , loadChildren:()=> import('./auth/auth.module').then(module=>module.AuthModule)
  }
  , {
    path: 'account'
    , loadChildren:()=> import('./account/account.module').then(module=>module.AccountModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
