import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../recipe.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.less']
})
export class RecipeCardComponent implements OnInit {

  @Input() recipe: Recipe

  constructor(private router: Router) { }

  ngOnInit(): void {

  }

  onGetDetails(){
    this.router.navigate(['/blend', this.recipe.id])
  }

}
