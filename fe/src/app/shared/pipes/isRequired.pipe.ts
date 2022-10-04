import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isRequired',
})
export class isRequiredPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return value ? 'Sí' : 'No';
  }
}
