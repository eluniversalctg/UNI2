import {
  MessageService,
  LazyLoadEvent,
  ConfirmationService,
} from 'primeng/api';
import * as _ from 'lodash';
import {
  UserFields,
  UserProfiles,
  ParentCondition,
} from 'src/app/shared/models';
import { forkJoin } from 'rxjs';
import {
  ExportService,
  VariableService,
  UtilitiesService,
  ConditionsService,
  UserFieldsService,
  UnomiProfilesService,
} from 'src/app/shared/services';
import { Router } from '@angular/router';
import { ExportToCSV } from '@molteni/export-csv';
import { MessagesTst } from 'src/app/shared/enums';
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-unomiProfiles',
  templateUrl: './unomiProfiles.component.html',
  styleUrls: ['./unomiProfiles.component.scss'],
})
export class UnomiProfilesComponent {
  @ViewChild('dt') dt;
  cols: any[] = [];
  screen: string = 'unomiProfiles';
  unomiProfiles: any[] = [];
  unomiProfilesDataSource: any[] = [];
  unomiProfilesSelected: any[] = [];
  addNew: boolean = false;
  visualizing: boolean = false;
  editing: boolean = false;
  advancedSearch: boolean = false;
  showAnalitic: boolean = false;
  showSessions: boolean = false;
  userSessions: any[] = [];
  schema: ParentCondition[] = [];
  exportOptions: any[] = [];
  unomiConditions: any[] = [];
  conditionVariables: any[] = [];
  userFields: UserFields[] = []; // @Input()
  userUnomiFieldsMasiveEdit: UserFields[] = [];
  updateMasiveField: UserFields = new UserFields();
  profileEditing: UserProfiles = new UserProfiles();
  profileEditingTemp: UserProfiles = new UserProfiles();
  segmentId: string;
  loading: boolean;

  totalRecords;
  options: any[];
  optionsSelected: boolean = true;
  limit: any[] = [];

  constructor(
    private router: Router,
    private msg: MessageService,
    private utlSrv: UtilitiesService,
    private exportService: ExportService,
    private conditionSrv: ConditionsService,
    private userFieldsSrv: UserFieldsService,
    private variableService: VariableService,
    private unomiProfilesSrv: UnomiProfilesService,
    private confirmationService: ConfirmationService
  ) {
    let route = this.router.url.split('/');
    if (route.length > 4) {
      this.segmentId = route[route.length - 1];
    }
    const variablesReq = this.variableService.getList();
    const conditiosReq = this.conditionSrv.getList();
    const userFieldsReq = this.userFieldsSrv.getList();

    forkJoin([variablesReq, conditiosReq, userFieldsReq]).subscribe({
      next: (response) => (
        (this.userFields = _.filter(response[2], ['isActive', true])),
        (this.userUnomiFieldsMasiveEdit = _.filter(response[2], [
          'massiveEdition',
          true,
        ])),
        (this.userUnomiFieldsMasiveEdit = _.filter(
          this.userUnomiFieldsMasiveEdit,
          ['isActive', true]
        )),
        (this.unomiConditions = response[1]),
        (this.conditionVariables = response[0].sort((a, b) =>
          a.id.toUpperCase() > b.id.toUpperCase() ? 1 : -1
        ))
      ),
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

    this.options = [
      { name: 'Activos', value: true },
      { name: 'Inactivos', value: false },
    ];
  }

  filterDataSource() {
    let condition;
    let conditionCSrv;
    let conditionCount;
    if (this.schema.length > 0) {
      conditionCSrv = this.conditionSrv.createBooleanConditionObj(this.schema);
    }

    //perfiles activos
    if (this.optionsSelected) {
      //si tiene busqueda avanzada solo tendria que hacer push a la condicion existen
      if (conditionCSrv !== undefined) {
        condition = {
          type: 'booleanCondition',
          parameterValues: {
            operator: 'and',
            subConditions: [
              {
                type: 'booleanCondition',
                parameterValues: {
                  operator: 'or',
                  subConditions: [
                    {
                      type: 'profilePropertyCondition',
                      parameterValues: {
                        propertyName: 'properties.enabled',
                        comparisonOperator: 'equals',
                        propertyValue: 'true',
                      },
                    },
                    {
                      type: 'profilePropertyCondition',
                      parameterValues: {
                        propertyName: 'properties.enabled',
                        comparisonOperator: 'missing',
                      },
                    },
                  ],
                },
              },
            ],
          },
        };
        condition.parameterValues.subConditions.push(conditionCSrv);
      }

      //si no tiene condicion previa por la busqueda avanzada
      if (!condition) {
        condition = {
          type: 'booleanCondition',
          parameterValues: {
            operator: 'or',
            subConditions: [
              {
                type: 'profilePropertyCondition',
                parameterValues: {
                  propertyName: 'properties.enabled',
                  comparisonOperator: 'equals',
                  propertyValue: 'true',
                },
              },
              {
                type: 'profilePropertyCondition',
                parameterValues: {
                  propertyName: 'properties.enabled',
                  comparisonOperator: 'missing',
                },
              },
            ],
          },
        };
      }

      //condicion para el count de los perfiles activos o que no tengan la priopiedad
      conditionCount = condition;
      //  {
      //   type: 'booleanCondition',
      //   parameterValues: {
      //     operator: 'or',
      //     subConditions: [
      //       {
      //         type: 'profilePropertyCondition',
      //         parameterValues: {
      //           propertyName: 'properties.enabled',
      //           comparisonOperator: 'equals',
      //           propertyValue: 'true',
      //         },
      //       },
      //       {
      //         type: 'profilePropertyCondition',
      //         parameterValues: {
      //           propertyName: 'properties.enabled',
      //           comparisonOperator: 'missing',
      //         },
      //       },
      //     ],
      //   },
      // };

      //perfiles inactivos
    } else {
      //si tiene busqueda avanzada solo tendria que hacer push a la condicion existen
      if (condition !== undefined) {
        condition.parameterValues.subConditions.push({
          type: 'profilePropertyCondition',
          parameterValues: {
            propertyName: 'properties.enabled',
            comparisonOperator: 'equals',
            propertyValue: 'false',
          },
        });
      }

      //si no tiene condicion previa por la busqueda avanzada
      if (!condition) {
        condition = {
          type: 'profilePropertyCondition',
          parameterValues: {
            propertyName: 'properties.enabled',
            comparisonOperator: 'equals',
            propertyValue: 'false',
          },
        };
      }

      //condicion para el count de los perfiles inactivos
      conditionCount = {
        type: 'profilePropertyCondition',
        parameterValues: {
          propertyName: 'properties.enabled',
          comparisonOperator: 'equals',
          propertyValue: 'false',
        },
      };
    }
    this.getData(condition, conditionCount);
  }

  newProfile() {
    this.profileEditing = new UserProfiles();
    this.profileEditing.systemProperties = { goals: {} };
    this.profileEditingTemp = new UserProfiles();
    this.visualizing = false;
    this.editing = false;
    this.addNew = true;
  }

  /**
   * update many fields in unomi profiles
   */
  updateMasive() {
    this.editing = true;
    let subConditionProf: any[] = [];
    let profilesToEdit: any[] = JSON.parse(
      JSON.stringify(this.unomiProfilesSelected)
    );
    let profilesToEditTemp: any[] = JSON.parse(
      JSON.stringify(this.unomiProfilesSelected)
    );

    // get all profiles to update
    this.unomiProfilesSelected.forEach((unomiProfile) => {
      // create subconditions
      subConditionProf.push({
        type: 'profilePropertyCondition',
        parameterValues: {
          propertyName: 'itemId',
          propertyValue: unomiProfile.itemId,
          comparisonOperator: 'equals',
        },
      });
    });

    profilesToEdit.forEach((profile) => {
      profile['log'] = { ...this.createLogInf(profile) };
      profile.properties[this.updateMasiveField.name] =
        this.updateMasiveField.value;
    });

    // object to update in unomi
    let batchProfiles = {
      propertyName: `properties.${this.updateMasiveField.name}`,
      propertyValue: this.updateMasiveField.value,
      strategy: 'alwaysSet',
      condition: {
        type: 'booleanCondition',
        parameterValues: {
          operator: 'or',
          subConditions: subConditionProf,
        },
      },
    };

    this.unomiProfilesSrv
      .addByURL('batchProfiles', [
        batchProfiles,
        profilesToEdit,
        profilesToEditTemp,
      ])
      .subscribe({
        next: () =>
          this.msg.add({
            severity: MessagesTst.SUCCESS,
            summary: MessagesTst.PROFILESUPDATESUCCESS,
          }),
        error: () =>
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.PROFILESUPDATEERROR,
          }),
      });
  }

  /**
   * get data from unomi, if searchCondition is undefined, it will get all data
   * @param condition - condition to search
   */
  getData(condition, conditionCount?) {
    if (this.segmentId != undefined) {
      const conditionSeartch = {
        type: 'booleanCondition',
        parameterValues: {
          operator: 'and',
          subConditions: [
            condition,
            {
              type: 'profilePropertyCondition',
              parameterValues: {
                propertyName: 'segments',
                propertyValue: `${this.segmentId}`,
                comparisonOperator: 'equals',
              },
            },
          ],
        },
      };
      this.unomiProfilesSrv
        .addByURL('search', [conditionSeartch, this.limit])
        .subscribe({
          next: (data) => (
            (this.unomiProfiles = data[0].list),
            (this.loading = false),
            (this.totalRecords = data[0].list.length)
          ),
          error: () =>
            this.msg.add({
              severity: MessagesTst.ERROR,
              summary: MessagesTst.ERRORGETDATA,
            }),
        });
    } else {
      const totalRecordsReq = this.unomiProfilesSrv.addByURL(
        'profiles/count',
        conditionCount
      );
      const unomiProfileReq = this.unomiProfilesSrv.addByURL('search', [
        condition,
        this.limit,
      ]);

      forkJoin([unomiProfileReq, totalRecordsReq]).subscribe({
        next: (response) => (
          (this.unomiProfiles = response[0][0].list),
          (this.loading = false),
          (this.totalRecords = response[1])
        ),
        error: () =>
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.ERRORGETDATA,
          }),
      });
    }
  }

  /**
   * get profile sessions from UNOMI
   * @param id - id of the profile to search
   */
  getSessions(id: string) {
    this.unomiProfilesSrv.get(id).subscribe({
      next: (data) => (
        (this.showSessions = true), (this.userSessions = data.message.list)
      ),
      error: () =>
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORGETDATA,
        }),
    });
  }

  cancel() {
    this.visualizing = false;
    this.editing = false;
    this.profileEditing = new UserProfiles();
    this.profileEditingTemp = new UserProfiles();
    this.addNew = false;
  }

  /**
   * edit user profile
   * @param userField user to edit
   */
  editProfile(userField: UserProfiles, visualizing?: boolean) {
    this.profileEditing = userField;
    this.profileEditingTemp = { ...userField };
    for (let i = 0; i < Object.keys(userField.properties).length; i++) {
      const element = Object.keys(userField.properties);
      let find = this.userFields.find((x) => x.name === element[i]);
      if (find) {
        // create patterns to verify if property is a date
        const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
        const date2Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
        if (
          dateRegex.test(userField.properties[element[i]]) ||
          date2Regex.test(userField.properties[element[i]])
        ) {
          find.value = new Date(userField.properties[element[i]]);
        } else {
          find.value = userField.properties[element[i]];
        }
      }
    }
    if (visualizing) {
      this.visualizing = true;
    } else {
      this.editing = true;
      this.visualizing = false;
    }
    this.addNew = true;
  }

  /**
   * save unomi profile when editing and creating new
   * @returns {boolean} true if the profile is valid
   */
  save() {
    // version is not required
    delete this.profileEditing.version;
    delete this.profileEditingTemp.version;
    this.profileEditing['log'] = { ...this.createLogInf(this.profileEditing) };

    this.unomiProfilesSrv
      .add([this.profileEditing, this.profileEditingTemp])
      .subscribe({
        next: () => (this.getData(undefined), this.cancel()),
        error: () =>
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.SAVEERROR,
          }),
      });
  }

  /**
   * load principal information save logs
   */
  createLogInf(profile) {
    let log = {};
    log['userId'] = this.utlSrv.getCurrentUser()._id;
    log['screen'] = this.screen;
    log['action'] = this.editing ? 'updated' : 'created';
    log['objectModified'] = profile.itemId;
    return log;
  }

  /**
   * create boolean condition to search in unomi
   */
  executeAdvancedSearch() {
    // send event to sharedContions to reload the list
    this.conditionSrv.reloadCondition();
    this.loadProfiles({ first: 0, rows: 10 });
    this.advancedSearch = false;
  }

  /**
   * event to get condition from sharedContions
   * @param val boolean condition from child
   */
  emmit(val) {
    this.schema = JSON.parse(val);
  }

  changeState(userField: UserProfiles) {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea ${
        userField.properties['enabled'] ? 'inactivar' : 'activar'
      } el perfil de <b>
        ${userField.properties['firstName']}
        </b>? <br/>El perfil seleccionado quedará ${
          userField.properties['enabled'] ? 'sin' : 'con'
        } acceso a la plataforma.`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',

      accept: () => {
        let message = '';
        this.profileEditingTemp = JSON.parse(JSON.stringify(userField));
        userField.properties['enabled'] = !userField.properties['enabled'];
        userField['log'] = { ...this.createLogInf(userField) };
        this.unomiProfilesSrv
          .add([userField, this.profileEditingTemp])
          .subscribe({
            next: (data) => (
              setTimeout(() => {
                this.loadProfiles({
                  first: this.limit[0],
                  rows: this.limit[1],
                });
              }, 2000),
              data.properties.enabled
                ? (message = 'Usuario Activado')
                : (message = 'Usuario Inactivado'),
              this.msg.add({
                severity: MessagesTst.SUCCESS,
                summary: message,
              })
            ),
            error: () =>
              this.msg.add({
                severity: MessagesTst.ERROR,
                summary: MessagesTst.SAVEERROR,
              }),
          });
      },
    });
  }

  /**
   * exports data to JSON file
   */
  exportJSON() {
    if (this.unomiProfilesSelected.length > 0) {
      this.exportService.exportJSON(
        JSON.stringify(this.unomiProfilesSelected),
        'Reporte de perfiles UNOMI'
      );
    } else {
      this.exportService.exportJSON(
        JSON.stringify(this.unomiProfiles),
        'Reporte de perfiles UNOMI'
      );
    }
  }

  /**
   * exports data to EXCEL file
   */
  exportExcel() {
    let dataToExport: any[] = [];
    let columns = this.getColumns();

    if (this.unomiProfilesSelected.length > 0) {
      //load data
      for (let i = 0; i < this.unomiProfilesSelected.length; i++) {
        const element = this.unomiProfilesSelected[i];
        let find = this.unomiProfiles.find((x) => x.itemId === element.itemId);
        // map data
        let temp = {};
        columns.forEach((data) => {
          temp[data.field] = _.get(find, data.header);
        });
        dataToExport.push(temp);
      }
    } else {
      //load data
      for (let i = 0; i < this.unomiProfiles.length; i++) {
        const element = this.unomiProfiles[i];
        // map data
        let temp = {};
        columns.forEach((data) => {
          temp[data.field] = _.get(element, data.header);
        });
        dataToExport.push(temp);
      }
    }
    this.exportService.exportExcel(dataToExport, 'Reporte de perfiles UNOMI');
  }

  /**
   * export data to CSV file
   */
  exportCSV() {
    let columns = this.getColumns();
    let dataToExport: any[] = [];
    if (this.unomiProfilesSelected.length > 0) {
      //load data
      for (let i = 0; i < this.unomiProfilesSelected.length; i++) {
        const element = this.unomiProfilesSelected[i];
        let find = this.unomiProfiles.find((x) => x.itemId === element.itemId);
        // map data
        let temp = {};
        columns.forEach((data) => {
          temp[data.field] = _.get(find, data.header);
        });
        dataToExport.push(temp);
      }
    } else {
      //load data
      for (let i = 0; i < this.unomiProfiles.length; i++) {
        const element = this.unomiProfiles[i];
        // map data
        let temp = {};
        columns.forEach((data) => {
          temp[data.field] = _.get(element, data.header);
        });
        dataToExport.push(temp);
      }
    }
    var exporter = new ExportToCSV();
    exporter.exportColumnsToCSV(dataToExport, 'Reporte de perfiles UNOMI', []);
  }

  /**
   * extract columns of profiles
   * @returns array of columns to export
   */
  getColumns() {
    let columns: any[] = [];
    for (let i = 0; i < this.unomiProfiles.length; i++) {
      const element = this.unomiProfiles[i];
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

  loadProfiles(event: LazyLoadEvent) {
    this.totalRecords = 0;
    this.loading = true;
    this.limit[0] = event.first;
    this.limit[1] = event.rows;

    this.filterDataSource();
  }
  refreshData() {
    this.schema = [];
    this.loadProfiles({ first: 0, rows: 10 });
  }
}
