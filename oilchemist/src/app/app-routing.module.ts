import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { AuthComponent } from './auth/auth.component';
import { AccountComponent } from './account/account.component';
import { AuthGuard } from './auth/auth.guard';
import { ProfileComponent } from './account/profile/profile.component';
import { EditRecipeComponent } from './account/edit-recipe/edit-recipe.component';
import { MyRecipesComponent } from './account/my-recipes/my-recipes.component';


const routes: Routes = [
  {
    path:"",
    component:RecipesComponent
  }
  ,{
    path:"blend/:id",
    component:RecipeDetailComponent
  }
  , {
    path:"login",
    component:AuthComponent
  }
  , {
    path:"account",
    canActivate:[AuthGuard],
    component:AccountComponent,
    children:[
      {
        path:'',
        component: MyRecipesComponent
      },
      {
        path:"profile",
        component:ProfileComponent
      },
      {
        path:'add-blend',
        component:EditRecipeComponent
      },
      {
        path:'edit-blend/:id',
        component:EditRecipeComponent
      },
      {
        path:'my-blends',
        component: MyRecipesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
