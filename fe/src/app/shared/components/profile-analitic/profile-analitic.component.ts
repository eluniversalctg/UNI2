import moment from 'moment';
import { MessageService } from 'primeng/api';
import { ProfileAnaliticModel } from '../../models';
import { Component, ViewChild } from '@angular/core';
import { ProfileAnaliticService } from '../../services';
import { MessagesTst } from '../../enums';

@Component({
  selector: 'app-profile-analitic',
  templateUrl: './profile-analitic.component.html',
})
export class ProfileAnalitic {
  periodSelected: string = 'year';
  dateSelected: Date = new Date();
  viewTable: boolean = false;
  applyFilter: boolean = false;
  @ViewChild('chart') chart;
  profiles: ProfileAnaliticModel[] = [];
  selectGraphic: any;
  graphicData: any;
  typeGraphic: string;
  optionsGraphic: any[] = [];

  constructor(
    private msg: MessageService,
    private profileAnaliticSrv: ProfileAnaliticService,
  ) {
    this.typeGraphic = 'bar';
    this.optionsGraphic = [
      { name: 'Barras', value: 'bar' },
      { name: 'Líneas', value: 'line' },
      { name: 'Tabla', value: 'table' },
    ];
  }

  resetDate() {
    this.dateSelected = new Date();
  }

  selectedGrafic() {
    const labels = this.profiles.map((x) => {
      return moment(new Date(x.date)).format('DD-MM-YYYY');
    });
    const count = this.profiles.map((x) => {
      return x.quantity;
    });

    this.graphicData = {
      labels: labels,
      datasets: [
        {
          label: 'Perfiles Activos',
          backgroundColor: '#42A5F5',
          data: count,
        },
      ],
    };
  }

  selectedGraphic(type) {
    this.applyFilter = true;
    this.viewTable = false;

    if (type != null) {
      if (type.value != 'table') {
        this.typeGraphic = type.value;

        if (this.chart != undefined) {
          this.chart.type = type.value;
          this.chart.reinit();
        }
      } else {
        this.viewTable = true;
      }
    } else {
      this.typeGraphic = 'bar';

      if (this.chart != undefined) {
        this.chart.type = 'bar';
        this.chart.reinit();
      }
    }
  }

  appliFilter(period, date) {
    this.profileAnaliticSrv.add({ period, date }).subscribe({
      next: (data) => {
        this.applyFilter = true;
        this.viewTable = false;
        this.profiles = data;
        this.selectedGrafic();
      },
      error: (err) => {
        return this.msg.add({
          key: 'forgotMsgs',
          severity: MessagesTst.ERROR,
          summary: MessagesTst.NODATAERROR,
        });
      },
    });
  }
}
