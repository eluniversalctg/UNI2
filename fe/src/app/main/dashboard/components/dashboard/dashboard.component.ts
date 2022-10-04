import moment from 'moment';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Widgets } from 'src/app/shared/models';
import { WidgetsService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';
import { MessagesTst } from 'src/app/shared/enums/enumMessage';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  periodSelectedArray: string[] = [];
  dateSelectedArray: Date[] = [];
  url = environment.matomoURL;
  auth_token = environment.matomoAuthToken;
  widgets: Widgets[] = [];
  selectedWidgets: Widgets[] = [];

  constructor(
    private msg: MessageService,
    private widgetService: WidgetsService
  ) {
    this.widgetService.getList().subscribe({
      next: (data) => this.transformData(data),
      error: () =>
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORLIST,
        }),
    });
  }

  resetDate(index) {
    this.dateSelectedArray[index] = new Date();
  }

  /**
   * add date and period to array
   */
  widgetsSelected() {
    this.dateSelectedArray = [];
    this.periodSelectedArray = [];
    this.selectedWidgets.forEach(() => {
      this.dateSelectedArray.push(new Date());
      this.periodSelectedArray.push('year');
    });
  }

  /**
   * transform URL
   * @param widgets
   */
  transformData(widgets: Widgets[]) {
    widgets.forEach((widget) => {
      widget.url = `${this.url}${widget.url}token_auth=${this.auth_token}`;
    });
    this.widgets = [...widgets];
  }

  /**
   * format date because matomo use YYYY-MM-DD
   */
  formatDate(period: string, date) {
    if (period === 'range') {
      let startDate = moment(date.toString().split(',')[0]).format(
        'YYYY-MM-DD'
      );
      let endDate = moment(date.toString().split(',')[1]).format('YYYY-MM-DD');
      date = `${startDate},${endDate}`;
    } else {
      date = moment(date).format('YYYY-MM-DD');
    }
    return date;
  }

  /**
   * filter iframe information from selected date and period
   * @param period
   * @param date
   * @param index
   */
  appliFilter(period, date, index) {
    let parameters: string[] = this.selectedWidgets[index].url
      .split('?')[1]
      .split('&');
    let allParameters: string[] = [];

    for (let i = 0; i < parameters.length; i++) {
      let element = parameters[i];

      if (element.split('=')[0] === 'date') {
        element = `date=${this.formatDate(period, date)}`;
      }

      if (element.split('=')[0] === 'period') {
        element = `period=${period}`;
      }

      allParameters = [...allParameters, element];
    }

    let URL = `${this.selectedWidgets[index].url.split('?')[0]}?`;
    allParameters.forEach((param) => {
      URL = URL.concat(param).concat('&');
    });
    this.selectedWidgets[index].url = URL;
  }
}
