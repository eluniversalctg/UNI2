import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'state',
})
export class statePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return value ? 'Activo' : 'Inactivo';
  }
}
