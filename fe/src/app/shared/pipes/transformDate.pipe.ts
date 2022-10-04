import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'goalDate',
})
export class GoalDatePipe implements PipeTransform {
  /**
   * transform string to date
   * @param value an string
   * @returns string as date
   */
  transform(value: any): any {
    const leftDate = value.split('T')[0];
    const rightDate = value.split('T')[1];
    const date = `${leftDate.split('-')[2]}-${leftDate.split('-')[1]}-${
      leftDate.split('-')[0]
    } ${rightDate.split(':')[0]}:${rightDate.split(':')[1]}`;
    return date;
  }
}
