import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listNameFormat'
})
export class ListNameFormatPipe implements PipeTransform {

  transform(value: any): any {
    return value.includes('list-name-', 0) ? value : 'list-name-'+value;
  }

}
