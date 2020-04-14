import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-pagination',
  templateUrl: './recipe-pagination.component.html',
  styleUrls: ['./recipe-pagination.component.less']
})
export class RecipePaginationComponent implements OnInit {

  @Output() bottom = new EventEmitter<boolean>()

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener ("window:scroll", ["$event"])  onWindowScroll() {
    if(document.documentElement.scrollHeight === window.innerHeight + document.documentElement.scrollTop)   {
    //Do your action here
      this.bottom.emit(true)
    }
  }
}
