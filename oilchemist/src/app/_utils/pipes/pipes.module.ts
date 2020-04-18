import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CapitalizePipe } from './capitalize.pipe';
import { EllipsisPipe } from './ellipsis.pipe';
import { DaysAgoPipe } from './days-ago.pipe';



@NgModule({
  declarations: [
    CapitalizePipe,EllipsisPipe,DaysAgoPipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    CapitalizePipe,EllipsisPipe,DaysAgoPipe
  ]
})
export class PipesModule { 
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PipesModule
    };
  }
}
