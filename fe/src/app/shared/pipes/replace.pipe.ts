import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace',
})
export class ReplacePipe implements PipeTransform {
  transform(value: any): any {
    let newValue = '';
    for (let i = 0; i < value.length; i++) {
      const element = value[i];
      if (i !== value.length - 1) {
        newValue = newValue.concat(element).concat(', ');
      } else {
        newValue = newValue.concat(element);
      }
    }
    return newValue;
  }
}
