import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagePlaceholderComponent } from './image-placeholder/image-placeholder.component'
import { SpinnerComponent } from './spinner/spinner.component'
import { PaginationComponent } from './pagination/pagination.component'
import { SearchComponent } from './search/search.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'


@NgModule({
  declarations: [ImagePlaceholderComponent
    ,SpinnerComponent
    ,PaginationComponent
    ,SearchComponent],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule
  ],
  exports:[ImagePlaceholderComponent
    ,SpinnerComponent
    ,PaginationComponent
    ,SearchComponent]
})
export class SharedModule { 
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
    };
  }
}
