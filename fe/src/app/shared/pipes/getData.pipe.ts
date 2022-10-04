import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'GetValue',
})
export class GetValuePipe implements PipeTransform {
  /**
   * transform string to date
   * @param value an string
   * @returns string as date
   */
  transform(value: any, arg?: string): any {
    return value[`${arg}`];
  }
}
