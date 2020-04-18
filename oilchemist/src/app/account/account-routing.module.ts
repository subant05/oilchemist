import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account.component'
import { ProfileComponent } from './profile/profile.component'
import { MyRecipesComponent } from './my-recipes/my-recipes.component'
import { EditRecipeComponent } from './edit-recipe/edit-recipe.component'
import { AuthGuard } from '../auth/auth.guard'

const routes: Routes = [
     {
        path:"",
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
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
