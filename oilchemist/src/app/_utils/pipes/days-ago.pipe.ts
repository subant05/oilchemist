import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysAgo'
})
export class DaysAgoPipe implements PipeTransform {

  private getTimeDifference(dateString){
    return new Date(new Date().toUTCString()).getTime() - new Date(new Date(dateString)).getTime()
  }

  transform(dateString: string, ...args: unknown[]): string {
    const timeDifference =  this.getTimeDifference(dateString)
    const timeAgo =  Math.round(( timeDifference / 1000 / 60 / 60 /24))
    if(!timeAgo)
      return 'Today'
    else if(timeAgo < 31)
      return `${timeAgo} days ago`
    else if(timeAgo > 31 && timeAgo< 365){
      const months = Math.round(timeAgo/31)
      return `${months}${months > 1 ? 'months' : 'month'} agao`
    } else {
      const years = Math.round(timeAgo/365)
      let months = +((timeAgo/365) % years).toFixed(2)
      months = +(months > 11 ? months.toFixed(1) : months.toFixed(2))
      return `${years}${years > 1 ? 'years' : 'year'} ${months ? months > 1 ? months + ' months' : '1 month' : '' } ago`
    }
  }

}
