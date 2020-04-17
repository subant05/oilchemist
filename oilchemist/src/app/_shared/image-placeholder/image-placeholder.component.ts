import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-image-placeholder',
  templateUrl: './image-placeholder.component.html',
  styleUrls: ['./image-placeholder.component.less']
})
export class ImagePlaceholderComponent implements OnInit {

  @Input() height: any;
  @Input() width: any;
  @Input() padding: any = '0';
  @Input() margin:any = '0';

  ariaLabel: string;
  constructor() { }

  ngOnInit(): void {
    this.ariaLabel=`Blend Image Placeholder: ${this.width}x${this.height}`
  }

}
