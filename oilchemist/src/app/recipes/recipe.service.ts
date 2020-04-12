import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Recipe } from './recipe.model';
import {environment} from '../../environments/environment'
import {HttpClient} from '@angular/common/http'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];
  private url: string = environment.firebase.databaseURL + '/blends.json';
  private recipeCollection: AngularFirestoreCollection<Recipe>;

  constructor(private http: HttpClient, private firestore: AngularFirestore) { }

  
  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addRecipe(recipe: Recipe) {
    this.recipeCollection = this.firestore.collection<Recipe>('blends');
    this.recipeCollection.add(recipe)

    // this.recipes.push(recipe);
    // this.http.post(this.url,recipe).subscribe(data=>{
    //   this.recipesChanged.next(this.recipes.slice());
    // })
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
