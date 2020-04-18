import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AccountComponent } from './account.component'
import { ProfileComponent } from './profile/profile.component'
import { MyRecipesComponent } from './my-recipes/my-recipes.component'
import { EditRecipeComponent } from './edit-recipe/edit-recipe.component'
import { AccountRoutingModule } from './account-routing.module'
import { PipesModule } from '../_utils/pipes/pipes.module'
import { SharedModule } from '../_shared/shared.module'

@NgModule({
  declarations: [
    AccountComponent,
    ProfileComponent,
    MyRecipesComponent,
    EditRecipeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PipesModule,
    SharedModule,
    AccountRoutingModule,
  ],
  exports:[ ]
})
export class AccountModule { }
