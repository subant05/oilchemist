import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipeService } from 'src/app/recipes/recipe.service';
import { Recipe } from 'src/app/recipes/recipe.model';
import { AuthService } from 'src/app/auth/auth.service';
import { take, throwIfEmpty, ignoreElements } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.component.html',
  styleUrls: ['./my-recipes.component.less']
})
export class MyRecipesComponent implements OnInit, OnDestroy {
  private searchParams:string =""
  private loadMoreSubscription: Subscription;
  private loadMoreRecipeSubscription: Subscription;
  private searchUpdateSubscription: Subscription;
  private searchUpdateRecipeSubscription: Subscription;
  private initAuthUserSubscription: Subscription;
  private initRecipeSubscription: Subscription;

  public isQuerying:boolean= false
  public recipes: Recipe[] = []
  public Object = Object
  public recipeTracker= {
      lastIndex:null,
      length:0,
      array:[]
    }
  public modalData:Recipe;
  public defaultPicture

  constructor(private recipesService: RecipeService
    , private authService: AuthService) { 
      this.defaultPicture =  this.recipesService.picture
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
    this.initAuthUserSubscription = this.authService.user.pipe(take (1)).subscribe(user=>{
      this.initRecipeSubscription = this.recipesService.getRecipes({creator: user.id})
      .subscribe(data=>{
        this.replaceRecipeTracker(data)
      })
    })
  }

  ngOnDestroy(){
    if(this.loadMoreSubscription)
      this.loadMoreSubscription.unsubscribe()
    if(this.loadMoreRecipeSubscription)
      this.loadMoreRecipeSubscription.unsubscribe()
    if(this.searchUpdateSubscription)
      this.searchUpdateSubscription.unsubscribe()
    if(this.searchUpdateRecipeSubscription)
      this.searchUpdateRecipeSubscription.unsubscribe()
    if(this.initAuthUserSubscription)
      this.initAuthUserSubscription.unsubscribe()
    if(this.initRecipeSubscription)
      this.initRecipeSubscription.unsubscribe()
  }

  onSearchUpdate(params?: string){
    this.searchParams = params || this.searchParams
    this.searchUpdateSubscription = this.authService.user.pipe(take (1)).subscribe(user=>{
      this.searchUpdateRecipeSubscription = this.recipesService.getRecipes({search:this.searchParams,creator: user.id})
      .subscribe(data=>{
        this.replaceRecipeTracker(data)
      })
    })
  }

  getDetails(index){
    this.modalData = this.recipeTracker.array[index]
  }

  onDelete(id:string){
    this.recipesService.deleteRecipe(id).then(this.onSearchUpdate.bind(this))
  }

  onLoadMore(){
    if(this.isQuerying)
      return;
    this.isQuerying = true
    this.loadMoreSubscription = this.authService.user.pipe(take (1)).subscribe(user=>{
      this.loadMoreRecipeSubscription =this.recipesService.getRecipes({
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
