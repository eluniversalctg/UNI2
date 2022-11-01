import {
  Rule,
  UNOMI,
  Options,
  Metadata,
  ParentCondition,
} from 'src/app/shared/models';
import { forkJoin } from 'rxjs';
import {
  RuleService,
  ExportService,
  ActionsService,
  VariableService,
  ConditionsService,
  UtilitiesService,
} from 'src/app/shared/services';
import { Router } from '@angular/router';
import { genWord } from 'src/app/shared/enums/genericWords';
import { MessagesTst } from 'src/app/shared/enums/enumMessage';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
@Component({
  selector: 'app-unomi',
  templateUrl: './unomi.component.html',
  styleUrls: ['./unomi.component.scss'],
})
export class UnomiComponent implements OnInit {
  @Input() selectedOption: Options;

  items;
  countSegments;
  options: any[];
  cols: any[] = [];
  unomi: UNOMI[] = [];
  unomiDatasource: UNOMI[] = [];
  @ViewChild('dt') dt;
  unomiMongo: any[] = [];
  addNew: boolean = false;
  isEditing: boolean = false;
  isDetail: boolean = false;
  newUnomi: UNOMI = new UNOMI();
  tempUnomi: UNOMI = new UNOMI();
  systemTags: any[] = [];
  idSegmentRecord: string;
  unomiActions: any[] = [];
  selectedRows: any[] = [];
  impactedSegments: any[] = [];
  isSegment: boolean = false;
  unomiConditions: any[] = [];
  recordDialog: boolean = false;
  systemTagsSelected: any[] = [];
  conditionVariables: any[] = [];
  optionsSelected: boolean = true;
  statisticsDialog: boolean = false;
  typeSegment = genWord.SEGMENTLABEL;
  ruleComponent: string = genWord.SEGMENT;
  conditionSchema: ParentCondition[] = [];
  conditionSchema2: ParentCondition[] = [];

  constructor(
    private router: Router,
    private msg: MessageService,
    private ruleService: RuleService,
    private utlSrv: UtilitiesService,
    private actionsSrv: ActionsService,
    private exportService: ExportService,
    private conditionSrv: ConditionsService,
    private variableService: VariableService,
    private confirmationService: ConfirmationService
  ) {
    this.newUnomi.metadata = new Metadata();

    const variablesReq = this.variableService.getList();
    const conditiosReq = this.conditionSrv.getList();
    const actionsReq = this.actionsSrv.getList();

    forkJoin([variablesReq, conditiosReq, actionsReq]).subscribe({
      next: (response) => (
        (this.unomiConditions = response[1]),
        (this.systemTags = this.variableService.systemTags()),
        (this.conditionVariables = response[0].sort((a, b) =>
          a.id.toUpperCase() > b.id.toUpperCase() ? 1 : -1
        )),
        (this.unomiActions = response[2]),
        this.getData()
      ),
      error: () =>
        this.msg.add({
          severity: MessagesTst.WARNING,
          summary: MessagesTst.NODATAERROR,
        }),
    });

    this.options = [
      { name: 'Activos', value: true },
      { name: 'Inactivos', value: false },
    ];
  }

  ngOnInit(): void {
    if (this.selectedOption.value === genWord.RULE) {
      this.newUnomi.raiseEventOnlyOnceForProfile = false;
      this.newUnomi.raiseEventOnlyOnceForSession = false;
      this.newUnomi.metadata.enabled = false;
      this.newUnomi.metadata.missingPlugins = false;
    }
    if (this.selectedOption.value === genWord.SEGMENT) {
      this.isSegment = true;
    } else {
      this.isSegment = false;
    }

    this.items = [
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

  /**
   * description: open the modal to update rule
   * @param rule - the rule selected
   */
  openUpdateRule(rule) {
    this.newUnomi = this.loadUnomiData(rule);
    this.addNew = true;
    this.isEditing = true;
    this.isDetail = false;
  }

  /**
   * description: duplicate the rule selected
   * * @param rule - the rule selected
   */
  duplicateRule(rule: Rule) {
    this.newUnomi = this.loadUnomiData(rule);
    delete this.newUnomi.metadata.id;
    this.addNew = true;
    this.isDetail = false;
  }

  loadUnomiData(rule) {
    let editUnom = new UNOMI();
    editUnom.metadata = new Metadata();
    editUnom.metadata.id = rule.id;
    editUnom.metadata.name = rule.name;
    editUnom.metadata.scope = rule.scope;
    editUnom.metadata.hidden = rule.hidden;
    editUnom.metadata.enabled = rule.enabled;
    editUnom.metadata.readOnly = rule.readOnly;
    editUnom.metadata.description = rule.description;
    editUnom.metadata.missingPlugins = rule.missingPlugins;
    editUnom.metadata.systemTags = rule.systemTags;

    let findCondition = this.unomiMongo.find((x) => x.id === rule.id);
    if (findCondition && this.selectedOption.value === genWord.GOAL) {
      this.conditionSchema = JSON.parse(findCondition.condition);
      this.conditionSchema2 = JSON.parse(findCondition.secCondition);
      editUnom['firstCondition'] = JSON.parse(findCondition.condition);
      editUnom['secondCondition'] = JSON.parse(findCondition.secCondition);
    } else if (findCondition) {
      this.conditionSchema = JSON.parse(findCondition.condition);
      editUnom['firstCondition'] = JSON.parse(findCondition.condition);
    }
    // test
    if (!Array.isArray(rule.systemTags)) {
      rule.systemTags = rule.systemTags.split(',');
    }
    this.systemTagsSelected = rule.systemTags.map((x) => {
      return { header: x, field: x };
    });

    for (let i = 0; i < this.systemTagsSelected.length; i++) {
      const element = this.systemTagsSelected[i];
      let findTag = this.systemTags.find((x) => x.header === element.header);
      if (!findTag) {
        this.systemTags = [...this.systemTags, element];
      }
    }

    if (findCondition && this.selectedOption.value === genWord.CAMPAIGN) {
      editUnom.cost = findCondition.cost;
      editUnom.currency = findCondition.currency;
      editUnom.timezone = findCondition.timezone;
      editUnom.startDate = new Date(findCondition.startDate);
      editUnom.endDate = new Date(findCondition.endDate);
    }
    if (findCondition && this.selectedOption.value === genWord.RULE) {
      editUnom.raiseEventOnlyOnceForSession =
        findCondition.raiseEventOnlyOnceForSession;
      editUnom.raiseEventOnlyOnceForProfile =
        findCondition.raiseEventOnlyOnceForProfile;
      editUnom.priority = findCondition.priority;
    }

    this.tempUnomi = { ...editUnom };
    this.tempUnomi.metadata = { ...editUnom.metadata };
    return editUnom;
  }

  /**
   * description: open modal with form rule
   */
  createRule() {
    this.newUnomi = new UNOMI();
    this.tempUnomi = new UNOMI();
    this.newUnomi.metadata = new Metadata();
    this.conditionSchema = [];
    this.conditionSchema2 = [];
    this.addNew = true;
    this.isEditing = false;
    this.isDetail = false;
    this.systemTagsSelected = [];
  }

  /**
   * description: send request to backend, save a new rule
   */
  register(changeState?: boolean) {
    // send event to sharedContions to reload the list
    this.conditionSrv.reloadCondition();

    if (this.selectedOption.value === genWord.GOAL) {
      this.newUnomi['conditionString'] = JSON.stringify(
        this.newUnomi['startEvent']
      );
      this.newUnomi['secConditionString'] = JSON.stringify(
        this.newUnomi['targetEvent']
      );
      this.newUnomi['startEvent'] =
        this.newUnomi['startEvent'].length > 0
          ? this.conditionSrv.createBooleanConditionObj(
              this.newUnomi['startEvent']
            )
          : [];
      this.newUnomi['targetEvent'] =
        this.newUnomi['targetEvent'].length > 0
          ? this.conditionSrv.createBooleanConditionObj(
              this.newUnomi['targetEvent']
            )
          : [];
      this.tempUnomi['targetEvent'] = { ...this.tempUnomi['firstCondition'] };
      this.tempUnomi['startEvent'] = { ...this.tempUnomi['secondCondition'] };
      delete this.tempUnomi['firstCondition'];
      delete this.tempUnomi['secondCondition'];
    } else if (this.selectedOption.value === genWord.CAMPAIGN) {
      this.newUnomi['conditionString'] = JSON.stringify(
        this.newUnomi['Condition']
      );
      this.newUnomi['entryCondition'] =
        this.newUnomi['Condition'].length > 0
          ? this.conditionSrv.createBooleanConditionObj(
              this.newUnomi['Condition']
            )
          : [];
      this.tempUnomi['entryCondition'] =
        this.tempUnomi['firstCondition'].length > 0
          ? this.conditionSrv.createBooleanConditionObj(
              this.tempUnomi['firstCondition']
            )
          : [];
      delete this.tempUnomi['firstCondition'];
    } else {
      this.newUnomi['conditionString'] = JSON.stringify(
        this.newUnomi['Condition']
      );
      this.newUnomi['condition'] =
        this.newUnomi['Condition'] && this.newUnomi['Condition'].length > 0
          ? this.conditionSrv.createBooleanConditionObj(
              this.newUnomi['Condition']
            )
          : undefined;
      if (this.tempUnomi['firstCondition']) {
        this.tempUnomi['condition'] =
          this.tempUnomi['firstCondition'] &&
          this.tempUnomi['firstCondition'].length > 0
            ? this.conditionSrv.createBooleanConditionObj(
                this.tempUnomi['firstCondition']
              )
            : undefined;
      }
    }
    if (
      (this.selectedOption.value === genWord.GOAL &&
        !this.newUnomi['startEvent']) ||
      (this.selectedOption.value === genWord.CAMPAIGN &&
        !this.newUnomi['entryCondition']) ||
      !this.newUnomi['Condition']
    ) {
      if (!this.newUnomi['conditionString']) {
        return;
      }
    }
    if (this.selectedOption.value === genWord.RULE) {
      const actions: any[] = [];

      this.newUnomi.actions?.forEach((action) => {
        actions.push({ type: action.id, parameterValues: {} });
      });

      this.newUnomi.actions = actions;

      if (
        this.newUnomi.metadata.id !== undefined &&
        this.newUnomi.metadata.id !== '' &&
        this.newUnomi.metadata.name !== undefined &&
        this.newUnomi.metadata.name !== '' &&
        this.newUnomi.metadata.description !== undefined &&
        this.newUnomi.metadata.description !== '' &&
        this.newUnomi.metadata.scope !== undefined &&
        this.newUnomi.metadata.scope !== '' &&
        (this.newUnomi.actions !== undefined || changeState) &&
        (this.newUnomi['conditionString'] !== '[]' || changeState)
      ) {
        this.setTags();
        this.save(this.newUnomi);
      } else {
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORDATA,
        });
      }
    } else {
      this.setTags();
      this.save(this.newUnomi);
    }
  }

  /**
   * description: save into mongoDB and UNOMI
   * @param rule
   */
  save(rule: UNOMI) {
    rule['userId'] = this.utlSrv.getCurrentUser()._id;
    rule['screen'] = this.selectedOption.value;
    rule['action'] = this.isEditing ? 'updated' : 'created';
    rule['objectModified'] = rule.metadata.id;
    this.ruleService
      .addByURL(`${this.selectedOption.value}`, [
        rule,
        this.isEditing ? this.tempUnomi : undefined,
      ])
      .subscribe({
        next: async () => (
          await setTimeout(() => {
            this.getData();
          }, 3000),
          (this.addNew = false),
          this.msg.add({
            severity: MessagesTst.SUCCESS,
            summary: MessagesTst.SAVESUCCESS,
          }),
          this.filterDataSource()
        ),
        error: () =>
          this.msg.add({
            severity: MessagesTst.ERROR,
            summary: MessagesTst.SAVEERROR,
          }),
      });
  }

  /**
   * load data from backend
   */
  getData() {
    const unomiReq = this.ruleService.getList(this.selectedOption.value);
    const unomiMongoReq = this.ruleService.getList(
      `mongo/${this.selectedOption.value}`
    );
    forkJoin([unomiReq, unomiMongoReq]).subscribe({
      next: (data) => {
        this.unomi = data[0];
        this.unomiMongo = data[1];
        this.filterDataSource();
      },
      error: () =>
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.ERRORLIST,
        }),
    });
  }

  filterDataSource() {
    this.unomiDatasource = this.unomi.filter(
      (x) => x['enabled'] === this.optionsSelected
    );
  }

  /**
   * map the system tags to the unomi object
   */
  setTags() {
    this.newUnomi.metadata.systemTags = this.systemTagsSelected.map((x) => {
      return x.header;
    });
  }

  /**
   * asign the condition to the unomi object
   * @param event - the event selected
   */
  emmit(event) {
    if (this.selectedOption.value === genWord.GOAL) {
      this.newUnomi['startEvent'] = JSON.parse(event);
    } else {
      this.newUnomi['Condition'] = JSON.parse(event);
    }
  }

  /**
   * asign the condition to the unomi object when is goal
   * @param event - the event selected
   */
  emmit2(event) {
    if (this.selectedOption.value === genWord.GOAL) {
      this.newUnomi['targetEvent'] = JSON.parse(event);
    }
  }

  verifyCondition() {
    this.conditionSrv.reloadCondition();

    if (
      (this.newUnomi['startEvent'] && this.newUnomi['startEvent'].length > 0) ||
      (this.newUnomi['targetEvent'] &&
        this.newUnomi['targetEvent'].length > 0) ||
      (this.newUnomi['Condition'] && this.newUnomi['Condition'].length > 0)
    ) {
      this.conditionSrv.verifyCondition();
    } else {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: MessagesTst.EERORCONDITION,
      });
    }
  }

  /**
   * Load the respective details
   */
  detailRule(rule) {
    this.newUnomi = this.loadUnomiData(rule);
    this.addNew = true;
    this.isDetail = true;
  }

  /**
   *
   * object state change
   */
  changeStateRule(rule) {
    let message = `¿Está seguro que desea ${
      rule.enabled ? 'inactivar' : 'activar'
    }
      ${rule.name}
      </b>? <br/>El  seleccionado quedará ${
        rule.enabled ? 'sin' : 'con'
      } función en la plataforma.`;

    this.confirmationService.confirm({
      message: message,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',

      accept: () => {
        rule.enabled = !rule.enabled;
        this.newUnomi = this.loadUnomiData(rule);
        this.register(true);
      },
    });
  }

  statisticsRule(rule) {
    this.statisticsDialog = true;
    this.ruleService.getByUrl('countSegments', rule.id).subscribe({
      next: (data) => (this.countSegments = data),
      error: () =>
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.NODATAERROR,
        }),
    });
    this.ruleService.getByUrl('impactedSegments', rule.id).subscribe({
      next: async (data) => await this.veryfiImpacted(data),
      error: () =>
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: MessagesTst.NODATAERROR,
        }),
    });
  }

  veryfiImpacted(data) {
    if (data.segments.lengt > 0) {
      data.segments.forEach((segment) => {
        this.impactedSegments.push(segment.name);
      });
    } else {
      this.impactedSegments = ['Sin registros'];
    }
  }

  profile(segmentId) {
    this.router.navigateByUrl(`/main/profiles/unomiProfiles/${segmentId}`);
  }

  record(idSegment) {
    this.idSegmentRecord = '';
    this.recordDialog = true;
    this.idSegmentRecord = idSegment;
  }

  closeRecord() {
    this.recordDialog = false;
    this.idSegmentRecord = '';
  }

  /**
   * export data to JSON
   */
  exportJSON() {
    let dataExport: UNOMI[];

    if (this.selectedRows.length > 0) {
      dataExport = this.selectedRows;
    } else {
      dataExport = this.unomi;
    }

    this.exportService.exportJSON(
      JSON.stringify(dataExport),
      `Reporte de ${this.selectedOption.label}`
    );
  }

  /**
   * export data to excel
   */
  exportExcel() {
    let dataExport: UNOMI[];

    if (this.selectedRows.length > 0) {
      dataExport = this.selectedRows;
    } else {
      dataExport = this.unomi;
    }
    if (dataExport.length > 0) {
      let reportExcel: any[] = [];
      dataExport.forEach((data) => {
        let keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          let item = data[keys[i]];
          if (Array.isArray(item)) {
            data[keys[i]] = item.join(',');
          }
        }
        reportExcel.push(data);
      });
      this.exportService.exportExcel(
        reportExcel,
        `Reporte de ${this.selectedOption.label}`
      );
    } else {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: 'export',
      });
    }
  }

  /**
   * export data to CSV
   */
  exportCSV() {
    let dataExport: UNOMI[];

    if (this.selectedRows.length > 0) {
      dataExport = this.selectedRows;
    } else {
      dataExport = this.unomi;
    }

    if (dataExport.length > 0) {
      let reportExcel: any[] = [];
      dataExport.forEach((data) => {
        let keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          let item = data[keys[i]];
          if (Array.isArray(item)) {
            data[keys[i]] = item.join(',');
          }
        }
        reportExcel.push(data);
      });

      let colums = Object.keys(reportExcel[0]);
      colums.forEach((col) => {
        let object = {
          field: col,
          header: col,
        };
        this.cols.push(object);
      });

      this.dt.exportCSV(reportExcel);
    } else {
      this.msg.add({
        severity: MessagesTst.ERROR,
        summary: 'export',
      });
    }
  }
}
