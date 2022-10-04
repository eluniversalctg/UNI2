import moment from 'moment';
import { MessageService } from 'primeng/api';
import { RuleService } from '../../services';
import { MessagesTst } from 'src/app/shared/enums/enumMessage';
import { Input, Component, ViewChild, OnChanges } from '@angular/core';

@Component({
  selector: 'app-recordSegments',
  templateUrl: './recordSegments.component.html',
  styleUrls: ['./recordSegments.component.scss'],
})
export class RecordSegmentsComponent implements OnChanges{

  @Input() idSegment: string;

  graphicData;
  typeGraphic;
  optionsGraphic;
  selectGraphic;
  allSegments: any[] = [];
  @ViewChild('chart') chart;
  segmentSelect: any[] = [];
  viewTable: boolean = false;
  applyFilter: boolean = false;
  periodSelected: string = 'year';
  dateSelected: Date = new Date();

  constructor(private ruleSrv: RuleService, private msg: MessageService) {
    this.getData();
    this.typeGraphic = 'bar';
    this.optionsGraphic = [
      { name: 'Barras', value: 'bar' },
      { name: 'Líneas', value: 'line' },
      { name: 'Tabla', value: 'table' },
    ];

  }

  ngOnChanges() {
      this.viewTable = false;
      this.applyFilter = false;
      this.selectGraphic = "";
  }

  /**
   * get data to segments
   */
  getData() {
    this.ruleSrv.getList().subscribe({
      next: (data) => (this.allSegments = data),
      error: () =>
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.NODATAERROR,
        }),
    });
  }

  /**
   *
   * load the segments according to the selected graph
   */
  selectedGraphic(type) {
    this.applyFilter = true;
    this.viewTable = false;

    if (type != null) {

      if (type.value != 'table') {

        this.typeGraphic = type.value;

        if(this.chart!= undefined){
          this.chart.type = type.value;
          this.chart.reinit();
        }

      } else {
        this.viewTable = true;
      }

    } else {

      this.typeGraphic = 'bar';

      if(this.chart!= undefined){
        this.chart.type = 'bar';
        this.chart.reinit();
      }

    }

    let labels: any[] = [];
    let count: any[] = [];
    this.segmentSelect.forEach((segement) => {
      let date = moment(segement.dateSegement).format('YYYY-MM-DD');
      labels.push(date);
      count.push(segement.count);
    });
    this.graphicData = {
      labels: labels,
      datasets: [
        {
          label: `${this.idSegment}`,
          backgroundColor: '#42A5F5',
          data: count,
        },
      ],
    };
  }

  resetDate() {
    this.dateSelected = new Date();
  }

/**
 *
 * apply filters to segments based on date
 */
  appliFilter(period, date) {

    this.applyFilter = true;
    this.viewTable = false;
    this.segmentSelect = [];

    this.allSegments.forEach((data) => {

      if (data.idSegement === this.idSegment) {

        if (period === 'month') {

          let month = date.getMonth();
          if (new Date(data.dateSegement).getMonth() === month) {
            this.segmentSelect.push(data);
          }

        } else if (period === 'week') {

          let first = new Date(date).getDate() - new Date(date).getDay();
          let last = first+6;
          let firstday = new Date(date.setDate(first)).toUTCString();
          let lastday = new Date(date.setDate(last)).toUTCString();

          if (
            new Date(data.dateSegement).setHours(0, 0, 0,0) >=
              new Date(firstday).getTime() &&
            new Date(data.dateSegement).setHours(0, 0, 0,0) <=
              new Date(lastday).getTime()
          ) {
            this.segmentSelect.push(data);
          }

        } else if (period === 'year') {

          let year = date.getFullYear();
          if (new Date(data.dateSegement).getFullYear() === year) {
            this.segmentSelect.push(data);
          }

        } else if (period === 'day') {

          if (
            new Date(data.dateSegement).toDateString() ===
            new Date(date).toDateString()
          ) {
            this.segmentSelect.push(data);
          }

        } else if (period === 'range') {

          if (
            new Date(data.dateSegement).setHours(0, 0, 0,0) >=
              new Date(date[0]).getTime() &&
            new Date(data.dateSegement).setHours(0, 0, 0,0) <=
              new Date(date[1]).getTime()
          ) {
            this.segmentSelect.push(data);
          }

        }

      }
    });

    if(this.selectGraphic!=""){
      this.selectedGraphic(this.selectGraphic);
    }else{
      this.selectedGraphic(null);
    }

  }
}
