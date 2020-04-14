import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Recipe } from './recipe.model';
import {environment} from '../../environments/environment'
import {HttpClient} from '@angular/common/http'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { tap, map, filter } from 'rxjs/operators';

interface QueryParams {
  search?: string;
  startAfter?: string;
  creator?: string;
}


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
      return item.name.toLocaleLowerCase().indexOf(searchParam.toLocaleLowerCase()) >= 0 
              || item.description.toLocaleLowerCase().indexOf(searchParam.toLocaleLowerCase()) >= 0
              || Object.keys(item.uses).filter(key=>{
                  return key.toLocaleLowerCase().indexOf(searchParam.toLocaleLowerCase()) >= 0 && item.uses[key]
              }).length
              || item.oils.filter((obj: any)=>{
                return  obj.brand.includes(searchParam)
                  || obj.name.includes(searchParam)
                  || searchParam.toLocaleLowerCase().includes(obj.brand.toLocaleLowerCase()) 
                  || searchParam.toLocaleLowerCase().includes(obj.name.toLocaleLowerCase()) 
              }).length
    })
  }


  

  
  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }


  getRecipes(queryParams:QueryParams ={}) :Observable<any>{
    return this.firestore
      .collection<Recipe>(
            'blends'
            ,ref=>{
              // ref.where('name','>=', searchParam ? searchParam.toLocaleLowerCase() : "")
              // ref.where('description','>=',  searchParam ? searchParam.toLocaleLowerCase() : "")

              // if(startAt)
              //   ref.startAfter(startAt ? startAt : '')

              // ref.orderBy('name', 'asc').limit(2)

              // return ref
                
              return ref.orderBy('name', 'asc')
                        .startAfter(queryParams.startAfter ? queryParams.startAfter : '')
                        .limit(12)
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
              map(data=>this.filterSearchResults(data, queryParams.search) )
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

  updateRecipe(id: string, recipe: Recipe): Promise<any>{
    return this.firestore
          .collection<Recipe>('blends').doc(id).update(recipe)
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
