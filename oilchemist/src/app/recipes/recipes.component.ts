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
      id:"hash",
      name:"Bedtime",
      description:"Used for helping sleep",
      ingredients:['Lavendar','Lemon','Tea Tree'],
      uses:['Relaxing','Sleeping','Anxiety'],
      picture:"http://i.ebayimg.com/images/i/161810753939-0-1/s-l1000.jpg",
      creator:"John Doe"
    },
    {
      id:"hash",
      name:"Bedtime",
      description:"Used for helping sleep",
      ingredients:['Lavendar','Lemon','Tea Tree'],
      uses:['Relaxing','Sleeping','Anxiety'],
      picture:"http://i.ebayimg.com/images/i/161810753939-0-1/s-l1000.jpg",
      creator:"John Doe"
    },
    {
      id:"hash",
      name:"Bedtime",
      description:"Used for helping sleep",
      ingredients:['Lavendar','Lemon','Tea Tree'],
      uses:['Relaxing','Sleeping','Anxiety'],
      picture:"http://i.ebayimg.com/images/i/161810753939-0-1/s-l1000.jpg",
      creator:"John Doe"
    },
    {
      id:"hash",
      name:"Bedtime",
      description:"Used for helping sleep",
      ingredients:['Lavendar','Lemon','Tea Tree'],
      uses:['Relaxing','Sleeping','Anxiety'],
      picture:"http://i.ebayimg.com/images/i/161810753939-0-1/s-l1000.jpg",
      creator:"John Doe"
    },
    {
      id:"hash",
      name:"Bedtime",
      description:"Used for helping sleep",
      ingredients:['Lavendar','Lemon','Tea Tree'],
      uses:['Relaxing','Sleeping','Anxiety'],
      picture:"http://i.ebayimg.com/images/i/161810753939-0-1/s-l1000.jpg",
      creator:"John Doe"
    }, 
  ]
  
  constructor() { }

  ngOnInit(): void {
  }

}
