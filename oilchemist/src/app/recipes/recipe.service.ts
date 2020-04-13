import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Recipe } from './recipe.model';
import {environment} from '../../environments/environment'
import {HttpClient} from '@angular/common/http'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { tap, map, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  recipesChanged = new Subject<Recipe[]>();
  searchedRecipes = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];
  private url: string = environment.firebase.databaseURL + '/blends.json';
  private recipeCollection: AngularFirestoreCollection<Recipe>;


  constructor(private http: HttpClient, private firestore: AngularFirestore) { 
    
  }

  private filterSearchResults(data:  Recipe[], searchParam: string) : Recipe[]{
    if(!searchParam)
      return data;

    return data.filter(item=>{
      return item.name.indexOf(searchParam) >= 0 
              || item.description.indexOf(searchParam) >= 0
              || Object.keys(item.uses).filter(key=>{
                  return key.indexOf(searchParam) >= 0 && item.uses[key]
              }).length
    })
  }
  
  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }


  getRecipes(searchParam?:string) :Observable<any>{

    return this.firestore
      .collection<Recipe>(
            'blends'
            ,ref=>{
              ref.where('name','>=', searchParam || "")
              ref.where('description','>=', searchParam || "")
              return ref
            }
          )
          .snapshotChanges()
          .pipe(map(actions => {
              return actions.map(a => {
                  const data = a.payload.doc.data() as Recipe;
                  const id = a.payload.doc.id;
                  return { id, ...data };
                });
              }),
              map(data=>this.filterSearchResults(data, searchParam) )
          )
  }

  getRecipe(id: string): Observable<any> {
    // return this.recipes[index];
    return this.firestore
          .collection<Recipe>('blends').doc(id).valueChanges()
  }

  addRecipe(recipe: Recipe) {
    return this.firestore.collection<Recipe>('blends').add(recipe)
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
