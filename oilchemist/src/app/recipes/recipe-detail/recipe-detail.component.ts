import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.less']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  private initSubscription: Subscription;

  recipe: Recipe
  Object = Object

  constructor(private recipeService: RecipeService
    , private router: Router
    , private route: ActivatedRoute ) { }
  
  ngOnInit(): void {
    this.initSubscription = this.route.params.subscribe((params: Params) => {
      this.recipeService.getRecipe(params['id']).subscribe(data=>{
        this.recipe = data;
      });
    });
  }

  ngOnDestroy(){
    this.initSubscription.unsubscribe()
  }

}
