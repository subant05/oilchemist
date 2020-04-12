import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeSearchComponent } from './recipes/recipe-search/recipe-search.component';
import { RecipeCardComponent } from './recipes/recipe-card/recipe-card.component';
import { AuthComponent } from './auth/auth.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { AccountComponent } from './account/account.component';
import { AccountHeaderComponent } from './account/account-header/account-header.component';
import { ProfileComponent } from './account/profile/profile.component';
import { MyRecipesComponent } from './account/my-recipes/my-recipes.component';
import { EditRecipeComponent } from './account/edit-recipe/edit-recipe.component';
import { AngularFireModule } from '@angular/fire';
import {AngularFireStorageModule, BUCKET } from '@angular/fire/storage';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RecipesComponent,
    RecipeSearchComponent,
    RecipeCardComponent,
    AuthComponent,
    RecipeDetailComponent,
    AccountComponent,
    AccountHeaderComponent,
    ProfileComponent,
    MyRecipesComponent,
    EditRecipeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [ { provide: BUCKET, useValue: '' }],
  bootstrap: [AppComponent]
})
export class AppModule { }