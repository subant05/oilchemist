import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.model'
import { Observable } from 'rxjs';
import { RecipeService } from './recipe.service';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.less']
})
export class RecipesComponent implements OnInit {

  recipes$: Observable<Recipe[]>
  
  constructor(private recipesService: RecipeService) { }

  ngOnInit(): void {
    this.recipes$ = this.recipesService.getRecipes()
  }

  onSearchUpdate(params){
    console.log("Params", params)
    this.recipes$ = this.recipesService.getRecipes(params)
  }

}
