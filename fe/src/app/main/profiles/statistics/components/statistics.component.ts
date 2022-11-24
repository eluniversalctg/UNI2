import * as _ from 'lodash';
import { forkJoin } from 'rxjs';
import {
  RuleService,
  ExportService,
  ConditionsService,
  VariableService,
} from 'src/app/shared/services';
import { ExportToCSV } from '@molteni/export-csv';
import { MessagesTst } from 'src/app/shared/enums';
import { ParentCondition } from 'src/app/shared/models';
import { MessageService, LazyLoadEvent } from 'primeng/api';
import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnChanges {
  statisticsProfiles: any[] = [];
  statisticsProfilesSelected: any[] = [];
  advancedSearch: boolean = false;
  showSessions: boolean = false;
  sessionSelected;
  schema: ParentCondition[] = [];
  unomiConditions: any[] = [];
  conditionVariables: any[] = [];
  exportOptions: any[] = [];
  @Input() sessions: any[] = [];
  loading: boolean;
  limit: any[] = [];
  totalRecords = 1000;
  constructor(
    private msg: MessageService,
    private ruleService: RuleService,
    private exportService: ExportService,
    private conditionSrv: ConditionsService,
    private variableService: VariableService
  ) {
    const conditiosReq = this.conditionSrv.getList();
    const variablesReq = this.variableService.getList();
    const totalRecords = this.ruleService.getByURL('sessions/count');
    forkJoin([variablesReq, conditiosReq, totalRecords]).subscribe({
      next: (response) => {
        (this.unomiConditions = response[1]),
          (this.conditionVariables = response[0].sort((a, b) =>
            a.id.toUpperCase() > b.id.toUpperCase() ? 1 : -1
          )),
          this.getData(undefined),
          (this.totalRecords = response[2]),
          (this.loading = false);
      },
      error: () =>
        this.msg.add({
          severity: MessagesTst.WARNING,
          summary: MessagesTst.NODATAERROR,
        }),
    });
    this.exportOptions = [
      {
        tooltipOptions: {
          tooltipLabel: 'Excel',
          tooltipPosition: 'top',
        },
        icon: 'pi pi-file-excel',
        command: () => {
          this.exportExcel();
        },
      },
      {
        tooltipOptions: {
          tooltipLabel: 'CSV',
          tooltipPosition: 'top',
        },
        icon: 'pi pi-download',
        command: () => {
          this.exportCSV();
        },
      },
      {
        tooltipOptions: {
          tooltipLabel: 'JSON',
          tooltipPosition: 'top',
        },
        icon: 'pi pi-angle-double-down',
        command: () => {
          this.exportJSON();
        },
      },
    ];
  }

  ngOnChanges() {
    this.statisticsProfiles = this.sessions;
    this.totalRecords = this.sessions.length;
  }

  showStatistics(statistic) {
    this.sessionSelected = statistic;
    this.showSessions = true;
  }

  emmit(val) {
    this.schema = JSON.parse(val);
  }

  /**
   * create boolean condition to search in unomi
   */
  executeAdvancedSearch() {
    // send event to sharedContions to reload the list
    this.conditionSrv.reloadCondition();
    let searchCondition = this.conditionSrv.createBooleanConditionObj(
      this.schema
    );
    this.getData(searchCondition);
    this.advancedSearch = false;
  }

  /**
   * get data from unomi
   * @param condition - condition to search
   */
  getData(condition) {
    this.limit[0] = 0;
    this.limit[1] = 10;
    const totalRecords = this.ruleService.getByURL('sessions/count');
    const sessions = this.ruleService.addByURL('sessions/get', [
      condition,
      this.limit,
    ]);
    forkJoin([sessions, totalRecords]).subscribe({
      next: (data) => {
        this.statisticsProfiles = data[0].list;
        this.totalRecords = data[1];
      },
      error: () =>
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORGETDATA,
        }),
    });
  }

  loadSessions(event: LazyLoadEvent) {
    this.loading = true;

    this.limit[0] = event.first;
    this.limit[1] = event.rows;
    if (this.schema.length > 0) {
      let condition = this.conditionSrv.createBooleanConditionObj(this.schema);
      this.ruleService
        .addByURL('sessions/get', [condition, this.limit])
        .subscribe({
          next: (data) => {
            this.statisticsProfiles = data.list;
            this.loading = false;
          },
          error: () =>
            this.msg.add({
              severity: MessagesTst.ERROR,
              summary: MessagesTst.ERRORGETDATA,
            }),
        });
    } else {
      this.ruleService
        .addByURL('sessions/get', [undefined, this.limit])
        .subscribe({
          next: (data) => {
            this.statisticsProfiles = data.list;
            this.loading = false;
          },
          error: () =>
            this.msg.add({
              severity: MessagesTst.ERROR,
              summary: MessagesTst.ERRORGETDATA,
            }),
        });
    }
  }

  /**
   * exports data to EXCEL file
   */
  exportExcel() {
    let dataToExport: any[] = [];
    let columns = this.getColumns();

    if (this.statisticsProfilesSelected.length > 0) {
      //load data
      for (let i = 0; i < this.statisticsProfilesSelected.length; i++) {
        const element = this.statisticsProfilesSelected[i];
        let find = this.statisticsProfiles.find(
          (x) => x.itemId === element.itemId
        );
        // map data
        let temp = {};
        columns.forEach((data) => {
          temp[data.field] = _.get(find, data.header);
        });
        dataToExport.push(temp);
      }
    } else {
      //load data
      for (let i = 0; i < this.statisticsProfiles.length; i++) {
        const element = this.statisticsProfiles[i];
        // map data
        let temp = {};
        columns.forEach((data) => {
          temp[data.field] = _.get(element, data.header);
        });
        dataToExport.push(temp);
      }
    }
    this.exportService.exportExcel(dataToExport, 'Reporte de sesiones UNOMI');
  }

  /**
   * export data to CSV file
   */
  exportCSV() {
    let columns = this.getColumns();
    let dataToExport: any[] = [];
    if (this.statisticsProfilesSelected.length > 0) {
      //load data
      for (let i = 0; i < this.statisticsProfilesSelected.length; i++) {
        const element = this.statisticsProfilesSelected[i];
        let find = this.statisticsProfiles.find(
          (x) => x.itemId === element.itemId
        );
        // map data
        let temp = {};
        columns.forEach((data) => {
          temp[data.field] = _.get(find, data.header);
        });
        dataToExport.push(temp);
      }
    } else {
      //load data
      for (let i = 0; i < this.statisticsProfiles.length; i++) {
        const element = this.statisticsProfiles[i];
        // map data
        let temp = {};
        columns.forEach((data) => {
          temp[data.field] = _.get(element, data.header);
        });
        dataToExport.push(temp);
      }
    }
    var exporter = new ExportToCSV();
    exporter.exportColumnsToCSV(dataToExport, 'Reporte de sesiones UNOMI', []);
  }

  /**
   * exports data to JSON file
   */
  exportJSON() {
    if (this.statisticsProfilesSelected.length > 0) {
      this.exportService.exportJSON(
        JSON.stringify(this.statisticsProfilesSelected),
        'Reporte de sesiones UNOMI'
      );
    } else {
      this.exportService.exportJSON(
        JSON.stringify(this.statisticsProfiles),
        'Reporte de sesiones UNOMI'
      );
    }
  }
  /**
   * extract columns of profiles
   * @returns array of columns to export
   */
  getColumns() {
    let columns: any[] = [];
    for (let i = 0; i < this.statisticsProfiles.length; i++) {
      const element = this.statisticsProfiles[i];
      let headers = this.propertiesToArray(element);
      columns.push(headers);
    }
    var indexOfLongestArray = columns.reduce((acc, arr, idx) => {
      return arr.length > columns[acc].length ? idx : acc;
    }, 0);
    return columns[indexOfLongestArray].map((x) => {
      return { field: x, header: x };
    });
  }

  /**
   * get paths of properties
   * @param obj object to extract  properties
   * @returns paths of properties
   */
  propertiesToArray(obj) {
    const isObject = (val) =>
      val && typeof val === 'object' && !Array.isArray(val);

    const addDelimiter = (a, b) => (a ? `${a}.${b}` : b);

    const paths = (obj = {}, head = '') => {
      return Object.entries(obj).reduce((product, [key, value]) => {
        let fullPath = addDelimiter(head, key);
        return isObject(value)
          ? product.concat(paths(value, fullPath))
          : product.concat(fullPath);
      }, []);
    };

    return paths(obj);
  }
}
