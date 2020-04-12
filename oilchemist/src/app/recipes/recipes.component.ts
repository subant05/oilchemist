import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.model'


@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.less']
})
export class RecipesComponent implements OnInit {

  recipes:Recipe[] = [
    {
      name:"Bedtime",
      description:"Used for helping sleep",
      oils:['Lavendar','Lemon','Tea Tree'],
      uses:['Relaxing','Sleeping','Anxiety'],
      imageUrl:"http://i.ebayimg.com/images/i/161810753939-0-1/s-l1000.jpg",
      creator:"John Doe"
    },
    {
      name:"Bedtime",
      description:"Used for helping sleep",
      oils:['Lavendar','Lemon','Tea Tree'],
      uses:['Relaxing','Sleeping','Anxiety'],
      imageUrl:"http://i.ebayimg.com/images/i/161810753939-0-1/s-l1000.jpg",
      creator:"John Doe"
    },
    {
      name:"Bedtime",
      description:"Used for helping sleep",
      oils:['Lavendar','Lemon','Tea Tree'],
      uses:['Relaxing','Sleeping','Anxiety'],
      imageUrl:"http://i.ebayimg.com/images/i/161810753939-0-1/s-l1000.jpg",
      creator:"John Doe"
    },
    {
      name:"Bedtime",
      description:"Used for helping sleep",
      oils:['Lavendar','Lemon','Tea Tree'],
      uses:['Relaxing','Sleeping','Anxiety'],
      imageUrl:"http://i.ebayimg.com/images/i/161810753939-0-1/s-l1000.jpg",
      creator:"John Doe"
    },
    {
      name:"Bedtime",
      description:"Used for helping sleep",
      oils:['Lavendar','Lemon','Tea Tree'],
      uses:['Relaxing','Sleeping','Anxiety'],
      imageUrl:"http://i.ebayimg.com/images/i/161810753939-0-1/s-l1000.jpg",
      creator:"John Doe"
    }, 
  ]
  
  constructor() { }

  ngOnInit(): void {
  }

}
