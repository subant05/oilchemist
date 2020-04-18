import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipesComponent } from './recipes.component'
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component'

const routes: Routes = [
    {
        path:"",
        component:RecipesComponent
      }
      ,{
        path:"blend/:id",
        component:RecipeDetailComponent
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule { }
