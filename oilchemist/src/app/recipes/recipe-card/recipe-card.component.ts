import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../recipe.model';
import { Router } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.less']
})
export class RecipeCardComponent implements OnInit {

  @Input() recipe: Recipe
  Object = Object
  defaultPicture: string;

  constructor(private router: Router, private recipeService: RecipeService) { 
    this.defaultPicture = this.recipeService.picture
  }

  ngOnInit(): void {

  }

  onGetDetails(){
    this.router.navigate(['/blend', this.recipe.id])
  }

}
