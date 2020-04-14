import { Component, OnInit } from '@angular/core';
import { RecipeService } from 'src/app/recipes/recipe.service';
import { Recipe } from 'src/app/recipes/recipe.model';
import { AuthService } from 'src/app/auth/auth.service';
import { take, throwIfEmpty } from 'rxjs/operators';

@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.component.html',
  styleUrls: ['./my-recipes.component.less']
})
export class MyRecipesComponent implements OnInit {
  private searchParams:string =""
  private isQuerying:boolean= false

  public recipes: Recipe[] = []
  public Object = Object
  public recipeTracker= {
      lastIndex:null,
      length:0,
      array:[]
    }
  public modalData:Recipe;

  constructor(private recipesService: RecipeService
    , private authService: AuthService) { }

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
    this.authService.user.pipe(take (1)).subscribe(user=>{
      this.recipesService.getRecipes({creator: user.id})
      .subscribe(data=>{
        this.updateRecipeTracker(data)
      })
    })
  }

  onSearchUpdate(params){
    this.searchParams = params
    this.authService.user.pipe(take (1)).subscribe(user=>{
      this.recipesService.getRecipes({search:this.searchParams,creator: user.id})
      .subscribe(data=>{
        this.replaceRecipeTracker(data)
      })
    })
  }

  getDetails(index){
    this.modalData = this.recipeTracker.array[index]
  }

  onLoadMore(){
    if(this.isQuerying)
      return;
    this.isQuerying = true
    this.authService.user.pipe(take (1)).subscribe(user=>{
      this.recipesService.getRecipes({
          search:this.searchParams
          , creator: user.id
          , startAfter:this.recipeTracker.array[this.recipeTracker.length-1].name
        })
        .subscribe(data=>{
            if(data[0] && this.recipeTracker.array[this.recipeTracker.length-1].id != data[data.length-1].id){
              this.updateRecipeTracker(data)
            }
            this.isQuerying = false
        })
    })
  }
}
