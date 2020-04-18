import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.less']
})
export class SpinnerComponent implements OnInit {

  @Input('show') show: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
