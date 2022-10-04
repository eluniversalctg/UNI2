import { forkJoin } from 'rxjs';
import { Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Actions, Variable } from 'src/app/shared/models';
import { MessagesTst } from 'src/app/shared/enums/enumMessage';
import { ActionsService, VariableService } from 'src/app/shared/services';

@Component({
  selector: 'app-actions',
  templateUrl: './action.component.html',
})
export class ActionsComponent {
  variables: any[] = [];
  systemTags: any[] = [];
  queryBuilder: any[] = [];
  unomiActions: any[] = [];
  actionsVariables: any[] = [];
  selectedVariables: any[] = [];
  systemTagsSelected: any[] = [];
  isEditing: boolean = false;
  createAction: boolean = false;
  actions: Actions = new Actions();

  @ViewChild('dt') tableActions;

  constructor(
    private msg: MessageService,
    private actionsSrv: ActionsService,
    private variableService: VariableService
  ) {
    this.getData();
  }

  getData() {
    this.systemTags = this.variableService.systemTags();
    const variablesReq = this.variableService.getList();
    const actionsReq = this.actionsSrv.getList();

    forkJoin([variablesReq, actionsReq]).subscribe({
      next: (response) => (
        (this.variables = response[0]),
        (this.actionsVariables = response[0]),
        (this.unomiActions = response[1])
      ),
      error: () =>
        this.msg.add({
          severity: MessagesTst.WARNING,
          summary: MessagesTst.ERRORGETDATA,
        }),
    });
  }

  addNew() {
    this.resetData();
    this.createAction = true;
  }

  /**
   * reset information
   */
  resetData() {
    this.isEditing = false;
    this.selectedVariables = [];
    this.systemTagsSelected = [];
    this.actions = new Actions();
    this.actionsVariables = this.variables;
    this.systemTags = this.variableService.systemTags();
  }

  /**
   * get unomi conditions
   */
  getConditions() {
    this.actionsSrv.getList().subscribe({
      next: (data) => (
        (this.unomiActions = data),
        (this.systemTags = this.variableService.systemTags())
      ),
      error: () =>
        this.msg.add({
          severity: MessagesTst.WARNING,
          summary: MessagesTst.ERRORGETDATA,
        }),
    });
  }

  /**
   * save conditions and update
   * @returns saved/updated condition
   */
  saveActions() {
    let foundSaved = this.unomiActions.find(
      (x) => x.id.toUpperCase() === this.actions.metadata.id.toUpperCase()
    );

    //check if duplicating a condition with existing name
    if (foundSaved && !this.isEditing) {
      return this.msg.add({
        severity: MessagesTst.WARNING,
        summary: MessagesTst.ERRORACTION,
      });
    }

    let systemTags: string[] = [];
    let variables: Variable[] = [];

    this.systemTagsSelected.forEach((tag) => {
      systemTags = [...systemTags, tag.field];
    });

    this.selectedVariables.forEach((variable) => {
      variables = [
        ...variables,
        {
          id: variable.id,
          type: variable.type,
          isActive: variable.isActive,
          multivalued: variable.multivalued,
          defaultValue: variable.defaultValue,
        },
      ];
    });

    this.actions.metadata.systemTags = systemTags;
    this.actions.parameters = variables;

    this.actionsSrv.add(this.actions).subscribe({
      next: () => (
        this.getConditions(),
        this.msg.add({
          severity: MessagesTst.SUCCESS,
          summary: MessagesTst.INSERTSUCCESS,
        }),
        (this.createAction = false),
        this.getData(),
        this.resetData()
      ),
      error: () =>
        this.msg.add({
          severity: MessagesTst.WARNING,
          summary: MessagesTst.INSERTERROR,
        }),
    });
  }

  /**
   * load information on popup when editing or duplicating
   * @param action unomiAction
   */
  editAction(action) {
    this.resetData();
    this.actions.metadata.id = action.id;
    this.actions.metadata.name = action.name;
    this.actions.metadata.description = action.description;
    this.setActionExecutor();

    action.systemTags.forEach((tag) => {
      let find = this.systemTags.find((x) => x.field === tag);

      if (find) {
        let index = this.systemTags.findIndex((x) => x.field === find.field);
        this.systemTagsSelected = [...this.systemTagsSelected, find];
        this.systemTags.splice(index, 1);
      }
    });

    action.parameters.forEach((param) => {
      let find = this.variables.find((x) => x.id === param.id);

      if (find) {
        let index = this.variables.findIndex((x) => x.id === find.id);
        this.selectedVariables = [...this.selectedVariables, find];
        this.actionsVariables.splice(index, 1);
      } else {
        this.selectedVariables = [...this.selectedVariables, param];
      }
    });

    this.createAction = true;
  }

  /**
   * set queryBuilder and conditionEvaluator
   */
  setActionExecutor() {
    let position = this.actions.metadata.id.search('Action');

    if (position !== -1) {
      this.actions.actionExecutor = this.actions.metadata.id.substring(
        position,
        -1
      );
    } else {
      this.actions.actionExecutor = this.actions.metadata.id;
    }
  }

  /**
   * set action word
   */
  setActionName() {
    let position = this.actions.metadata.id.search('Action');

    if (position === -1) {
      this.actions.metadata.id = this.actions.metadata.id.concat('Action');
    }
  }

  cancel() {
    this.createAction = false;
    this.getConditions();
    this.getData();
  }

  refreshData() {
    this.variables = [];
    this.actionsVariables = [];
    this.unomiActions = [];
    this.getData();
    this.tableActions.reset();
  }
}
