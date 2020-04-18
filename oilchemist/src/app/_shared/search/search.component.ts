import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit {

  searchForm: FormGroup
  @Output('search') searchParam = new EventEmitter<string>()
  
  constructor() { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      search: new FormControl(null)
    })
  }

  onSearch(){
    this.searchParam.emit(this.searchForm.value.search)
  }

}
