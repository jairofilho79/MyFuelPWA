import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthName'
})
export class MonthNamePipe implements PipeTransform {
  formatter = new Intl.DateTimeFormat('pt-br', { month: 'long' });
  transform(value: any, ...args: any[]): any {
    const month = this.formatter.format(value);
    return month.charAt(0).toUpperCase() + month.substr(1);
  }

}
