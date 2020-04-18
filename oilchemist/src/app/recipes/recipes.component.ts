import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from './recipe.model'
import { Observable, Subscription } from 'rxjs';
import { RecipeService } from './recipe.service';
import { tap, map, take } from 'rxjs/operators';


@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.less']
})
export class RecipesComponent implements OnInit, OnDestroy {
  private searchParams = ''
  private searchUpdateSubscription: Subscription;
  private loadMoreSubscription: Subscription;
  private initSubscription: Subscription;

  public recipeTracker= {
    lastIndex:null,
    length:0,
    array:[]
  }
  public isQuerying = false;
  public defaultPicture: string;
  
  constructor(private recipesService: RecipeService) {
    this.defaultPicture = this.recipesService.picture
   }

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
    this.initSubscription = this.recipesService.getRecipes().subscribe(data=>{
      this.updateRecipeTracker(data)
    })
  }

  ngOnDestroy(){
    // if(this.searchUpdateSubscription)
    //   this.searchUpdateSubscription.unsubscribe()
    // if(this.loadMoreSubscription)
    //   this.loadMoreSubscription.unsubscribe()
    // if(this.initSubscription)
    //   this.initSubscription.unsubscribe()
  }


  onSearchUpdate(params){
    this.searchParams = params
    this.searchUpdateSubscription = this.recipesService.getRecipes({search:this.searchParams}).subscribe(data=>{
      this.replaceRecipeTracker(data)
    })
  }

  onLoadMore(){
    if(this.isQuerying)
      return;
    this.isQuerying = true
    this.loadMoreSubscription = this.recipesService.getRecipes({
          search:this.searchParams,
          startAfter:this.recipeTracker.array[this.recipeTracker.length-1].name
        })
        .subscribe(data=>{
            if(data[0] && this.recipeTracker.array[this.recipeTracker.length-1].id != data[data.length-1].id){
              this.updateRecipeTracker(data)
            }
            this.isQuerying = false
        })
  }

}
