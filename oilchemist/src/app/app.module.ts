import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AngularFireModule } from '@angular/fire';
import { BUCKET } from '@angular/fire/storage';
import { environment } from '../environments/environment';
// App Modules
import { AuthModule } from './auth/auth.module'
import { AccountModule } from './account/account.module'
import { RecipesModule } from './recipes/recipes.module'


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    // App Modules
    AuthModule,
    AccountModule,
    RecipesModule
  ],
  providers: [ { provide: BUCKET, useValue: '' }],
  bootstrap: [AppComponent]
})
export class AppModule { }