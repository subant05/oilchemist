import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.model'
import { Observable } from 'rxjs';
import { RecipeService } from './recipe.service';
import { tap, map, take } from 'rxjs/operators';


@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.less']
})
export class RecipesComponent implements OnInit {

  recipeTracker= {
    lastIndex:null,
    length:0,
    array:[]
  }
  private searchParams = ''
  
  constructor(private recipesService: RecipeService) { }
  private updateRecipeTracker(data){
    this.recipeTracker.array = this.recipeTracker.array.concat(data)
    this.recipeTracker.length = this.recipeTracker.array.length
    this.recipeTracker.lastIndex = this.recipeTracker.array[this.recipeTracker.array.length-1]
  }

  private replaceRecipeTracker(data){
    this.recipeTracker.array = data
    this.recipeTracker.length = this.recipeTracker.array.length
    this.recipeTracker.lastIndex = this.recipeTracker.array[this.recipeTracker.array.length-1]
  }

  ngOnInit(): void {
    this.recipesService.getRecipes().subscribe(data=>{
      console.log(JSON.stringify(data[1]))
      this.updateRecipeTracker(data)
    })
  }


  onSearchUpdate(params){
    this.searchParams = params
    this.recipesService.getRecipes(this.searchParams).subscribe(data=>{
      console.log(data)
      this.replaceRecipeTracker(data)
    })
  }

  onLoadMore(){
    this.recipesService.getRecipes(this.searchParams, this.recipeTracker.array[this.recipeTracker.length-1].name).subscribe(data=>{
      console.log(JSON.stringify(data[1]))
      this.updateRecipeTracker(data)
    })
    // this.recipes$.pipe(take(1)).subscribe(data=>{
    //   console.log(data, this.recipes$)
    //    this.recipes$ = this.recipesService.getRecipes(this.searchParams)

    // })
  }

}
