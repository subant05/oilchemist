import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Observable } from 'rxjs';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.less']
})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe
  Object = Object

  constructor(private recipeService: RecipeService
    , private router: Router
    , private route: ActivatedRoute ) { }
  
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.recipeService.getRecipe(params['id']).subscribe(data=>{
        this.recipe = data;
      });
    });
  }

  

}
