import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipsis'
})
export class EllipsisPipe implements PipeTransform {

  transform(value: string, count: number = 20): string {
    if(value.length <= count)
      return value;

    return  `${value.slice(0,count)}...`;
  }

}
