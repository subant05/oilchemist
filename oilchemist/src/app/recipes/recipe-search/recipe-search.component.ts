import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RecipeService } from '../recipe.service';
import {FormGroup, FormControl} from '@angular/forms'

@Component({
  selector: 'app-recipe-search',
  templateUrl: './recipe-search.component.html',
  styleUrls: ['./recipe-search.component.less']
})
export class RecipeSearchComponent implements OnInit {

  searchForm: FormGroup
  @Output('search') searchParam = new EventEmitter<string>()
  
  constructor(private recipesService: RecipeService) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      search: new FormControl(null)
    })
  }

  onSearch(){
    this.searchParam.emit(this.searchForm.value.search)
  }

}
