import { Component, OnInit, HostListener, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.less']
})
export class PaginationComponent implements OnInit {

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
