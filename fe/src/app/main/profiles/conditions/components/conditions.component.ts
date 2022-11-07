import { forkJoin } from 'rxjs';
import {
  RuleService,
  VariableService,
  ConditionsService,
} from 'src/app/shared/services';
import { Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MessagesTst, genWord } from 'src/app/shared/enums';
import { Variable, Condition, ParentCondition } from 'src/app/shared/models';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss'],
})
export class ConditionsComponent {
  loadChanges: boolean = false;
  variables: any[] = [];
  systemTags: any[] = [];
  queryBuilder: any[] = [];
  unomiConditions: any[] = [];
  mongoConditions: Condition[] = [];
  conditionVariables: any[] = [];
  selectedVariables: any[] = [];
  systemTagsSelected: any[] = [];
  conditionEvaluator: any[] = [];
  isEditing: boolean = false;
  createCondition: boolean = false;
  createParentCondition: boolean = false;
  condition: Condition = new Condition();
  operators: any[] = [];

  conditionsValuesFiltered: any[] = [];
  parameterFiltered: any[] = [];
  conditionSelected: Condition = new Condition();
  conditionSchema: ParentCondition[] = [];
  newConditon: ParentCondition = new ParentCondition();

  @ViewChild('dt') tableConditions;

  constructor(
    private msg: MessageService,
    private ruleSrv: RuleService,
    private conditionSrv: ConditionsService,
    private variableService: VariableService
  ) {
    const operatorReq = this.ruleSrv.getOperators();
    const conditiosReq = this.conditionSrv.getList();
    this.systemTags = this.variableService.systemTags();
    const variablesReq = this.variableService.getList();
    const mongoConditions = this.conditionSrv.getList('conditions');

    forkJoin([variablesReq, conditiosReq, mongoConditions]).subscribe({
      next: (response) => (
        (this.operators = operatorReq),
        (this.unomiConditions = response[1]),
        (this.mongoConditions = response[2]),
        (this.conditionVariables = response[0].sort((a, b) =>
          a.id.toUpperCase() > b.id.toUpperCase() ? 1 : -1
        )),
        (this.variables = [...this.conditionVariables])
      ),
      error: () =>
        this.msg.add({
          severity: MessagesTst.WARNING,
          summary: MessagesTst.NODATAERROR,
        }),
    });
  }

  /**
   *  gets the values of the selected conditions
   * @param val conditions as string
   */
  emmit(val) {
    this.conditionSchema = JSON.parse(val);
  }

  /**
   * reset dialog to add new Condition
   */
  addNew() {
    this.resetData();
    this.createCondition = true;
    this.isEditing = false;
  }

  /**
   * reset information
   */
  private resetData() {
    this.condition = new Condition();
    this.systemTags = this.variableService.systemTags();
    this.systemTagsSelected = [];
    this.conditionVariables = [...this.variables];
    this.selectedVariables = [];
    this.createParentCondition = false;
    this.conditionSchema = [];

    this.isEditing = false;
  }

  /**
   * get unomi conditions
   */
  private async getConditions() {
    const unomiConditions = this.conditionSrv.getList();
    const mongoConditions = this.conditionSrv.getList('conditions');

    const response: any[] = await new Promise((resolve, reject) => {
      forkJoin([unomiConditions, mongoConditions]).subscribe({
        next: (resp) => resolve(resp),
        error: (err) => reject(err),
      });
    });
    this.unomiConditions = [];
    this.unomiConditions = response[0];
    this.mongoConditions = response[1];
    this.systemTags = this.variableService.systemTags();
  }

  /**
   * save conditions and update
   * @returns saved/updated condition
   */
  saveCondition() {
    // send event to sharedContions to reload the list
    this.conditionSrv.reloadCondition();

    //check if missing data
    if (
      !this.condition.metadata.id ||
      this.condition.metadata.id === '' ||
      this.condition.metadata.id === ' '
    ) {
      return this.msg.add({
        severity: MessagesTst.WARNING,
        summary: 'Debe ingresar el id',
      });
    }
    if (
      !this.condition.metadata.name ||
      this.condition.metadata.name === '' ||
      this.condition.metadata.name === ' '
    ) {
      return this.msg.add({
        severity: MessagesTst.WARNING,
        summary: 'Debe ingresar el nombre',
      });
    }
    if (
      !this.condition.metadata.description ||
      this.condition.metadata.description === '' ||
      this.condition.metadata.description === ' '
    ) {
      return this.msg.add({
        severity: MessagesTst.WARNING,
        summary: 'Debe ingresar la descripción',
      });
    }
    if (this.systemTagsSelected.length === 0) {
      return this.msg.add({
        severity: MessagesTst.WARNING,
        summary: 'Debe seleccionar al menos un SystemTag',
      });
    }
    if (this.selectedVariables.length === 0) {
      return this.msg.add({
        severity: MessagesTst.WARNING,
        summary: 'Debe seleccionar al menos una variable',
      });
    }

    let foundSaved = this.unomiConditions.find(
      (x) => x.id.toUpperCase() === this.condition.metadata.id.toUpperCase()
    );

    //check if duplicating a condition with existing name
    if (foundSaved && !this.isEditing) {
      return this.msg.add({
        severity: MessagesTst.WARNING,
        summary: MessagesTst.VARIABLEEXIST,
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
          multivalued: variable.multivalued,
          defaultValue: variable.defaultValue,
        },
      ];
    });

    //check if has parentCondition
    if (this.createParentCondition) {
      delete this.condition.queryBuilder;
      delete this.condition.conditionEvaluator;

      this.condition.treeParentCondition = JSON.stringify(this.conditionSchema);
      this.condition.parentCondition =
        this.conditionSrv.createBooleanConditionObj(this.conditionSchema);
      if (this.condition.parentCondition === null) {
        return;
      }
    }

    //check if creating parent and parentCondition is undefined (is undefined because happened some error)
    if (this.createParentCondition && !this.condition.parentCondition) {
      return this.msg.add({
        severity: MessagesTst.WARNING,
        summary: MessagesTst.SAVEERROR,
      });
    }

    this.condition.metadata.systemTags = systemTags;
    this.condition.parameters = variables;

    // save condition
    this.conditionSrv.add(this.condition).subscribe({
      next: async () => (
        await this.getConditions(),
        this.msg.add({
          severity: MessagesTst.SUCCESS,
          summary: MessagesTst.INSERTSUCCESS,
        }),
        (this.createCondition = false),
        this.resetData()
      ),
      error: () =>
        this.msg.add({
          severity: MessagesTst.WARNING,
          summary: MessagesTst.ERRORSAVECONDITION,
        }),
    });
  }

  /**
   * load information on popup when editing or duplicating
   * @param condition unomiCondition
   */
  editCondition(condition) {
    this.resetData();

    this.condition.metadata.description = condition.description;
    this.condition.metadata.id = condition.id;
    this.condition.metadata.name = condition.name;

    // find if exist condition on mongo
    let findCondition = this.mongoConditions.find(
      (x) => x.conditionId === condition.id
    );

    if (findCondition) {
      if (findCondition.treeParentCondition) {
        this.createParentCondition = true;
        this.conditionSchema = JSON.parse(findCondition.treeParentCondition);
      }
    }

    // load systemTags
    condition.systemTags.forEach((tag) => {
      let find = this.systemTags.find((x) => x.field === tag);

      if (find) {
        this.systemTagsSelected = [...this.systemTagsSelected, find];
      }
    });

    // load variables / parameterValues
    condition.parameters.forEach((param) => {
      let find = this.variables.find((x) => x.id === param.id);

      if (find) {
        this.selectedVariables = [...this.selectedVariables, find];
      } else {
        this.selectedVariables = [...this.selectedVariables, param];
      }
    });

    this.createCondition = true;
    this.isEditing = true;
  }

  /**
   * set queryBuilder and conditionEvaluator
   */
  setEvalQuery() {
    this.condition.queryBuilder =
      this.condition.metadata.id.concat('Evaluator');
    this.condition.conditionEvaluator =
      this.condition.metadata.id.concat('ESQueryBuilder');
  }

  /**
   * set condition word
   */
  setConditionName() {
    let position = this.condition.metadata.id.search(genWord.CONDITION);

    if (position === -1) {
      this.condition.metadata.id = this.condition.metadata.id.concat(
        genWord.CONDITION
      );
    }
  }

  refreshData() {
    this.resetData();
    this.getConditions();
  }
}
