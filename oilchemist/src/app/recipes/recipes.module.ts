import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RecipesComponent } from './recipes.component'
import { RecipeCardComponent } from './recipe-card/recipe-card.component'
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component'
import { RecipesRoutingModule } from './recipes-routing.module'
import { PipesModule } from '../_utils/pipes/pipes.module'
import { SharedModule } from '../_shared/shared.module'

@NgModule({
  declarations: [
    RecipesComponent,
    RecipeCardComponent,
    RecipeDetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    RecipesRoutingModule,
    PipesModule,
    SharedModule
  ]
})
export class RecipesModule { }
