import { ConfirmationService } from 'primeng/api';
import { RuleService } from 'src/app/shared/services';
import { Input, Component, OnChanges } from '@angular/core';
import { Condition, ParentCondition } from 'src/app/shared/models';

@Component({
  selector: 'app-recursive',
  templateUrl: './inputs.component.html',
  styleUrls: ['./inputs.component.scss'],
})
export class InputsTreeComponent implements OnChanges {
  @Input() unomiConditions: any[];
  @Input() conditionVariables: any[];
  @Input() recursiveList: ParentCondition[];

  operators: any[] = [];
  getOperatorsBoolean: any[] = [];
  conditionsValuesFiltered: any[] = [];
  parameterFiltered: any[] = [];
  conditionSelected: Condition = new Condition();
  newConditon: ParentCondition = new ParentCondition();
  unomiConditionsBck: any[] = [];
  conditionsValuesFilteredBck: any[] = [];
  conditionsValuesVariablesFiltered: any[] = [];

  constructor(
    private ruleSrv: RuleService,
    private confirmationService: ConfirmationService
  ) {
    this.getOperatorsBoolean = this.ruleSrv.getOperatorsBoolean();
    this.operators = this.ruleSrv.getOperators();
  }

  ngOnChanges() {
    if (this.unomiConditions) {
      this.unomiConditionsBck = [...this.unomiConditions];
    }
    if (this.recursiveList && this.recursiveList.length > 0) {
      let operator = this.recursiveList[0]['operator'];
      for (let i = 0; i < this.recursiveList.length; i++) {
        this.recursiveList[i]['operator'] = operator;
      }
    }
  }

  // delete condition
  deleteValue(list, index) {
    list.splice(index, 1);
  }

  // set operator
  setOperator(list, event) {
    for (let i = 0; i < list.length; i++) {
      list[i]['operator'] = event.value;
    }
  }

  // move element from array
  moveElement(recursiveList, i, to) {
    const element = recursiveList.splice(i, 1)[0];

    if (to === 'up') {
      recursiveList.splice(i - 1, 0, element);
    } else {
      recursiveList.splice(i + 1, 0, element);
    }
  }

  /**
   * filter parameter from condition selected
   * @param optionSelected parameter selected
   * @param type single or group
   */
  filterSelected(optionSelected, type?) {
    this.conditionsValuesFiltered = [];
    if (optionSelected.parameters.length > 0) {
      for (let i = 0; i < this.conditionVariables.length; i++) {
        const element = this.conditionVariables[i];
        let find = optionSelected.parameters.find((x) => x.id === element.id);
        if (find) {
          this.conditionsValuesFiltered = [
            ...this.conditionsValuesFiltered,
            find,
          ];
        }
      }
    }
    this.conditionsValuesVariablesFiltered = [...optionSelected.parameters];
    this.conditionsValuesFilteredBck = [...optionSelected.parameters];

    this.newConditon['conditionId'] = optionSelected.id;
    this.newConditon['isChildren'] = type === 'group' ? true : false;

    // find if exist operator
    let find = optionSelected.parameters.find(
      (x) =>
        x.id.toUpperCase().includes('OPERATOR') ||
        x.type.toUpperCase().includes('OPERATOR')
    );

    if (find) {
      this.newConditon['hasOperator'] = true;
      this.newConditon['saveOperatorInto'] = find.id;
    } else {
      this.newConditon['hasOperator'] = false;
    }
  }

  /**
   *
   * @param value value of parameter
   */
  setValuesOfParameter(value, list) {
    //search if parameter has values
    let parameter = this.conditionVariables.find((x) => x.id === value.id);

    this.newConditon['variable'] = value.id;
    this.newConditon['multivalued'] = value.multivalued;
    this.newConditon['operator'] = 'or';
    this.newConditon['variableType'] = value.type.toLowerCase();

    if (parameter) {
      this.parameterFiltered = parameter.optionValues;
    } else {
      this.setCondition(list);
    }
  }

  /**
   * set values of parameters
   * @param param
   */
  filterValuesToVariable(param, list) {
    this.newConditon['values'] = param.options;
    this.newConditon['value'] = param.value;

    // search for variable
    let find = this.conditionsValuesFilteredBck.find(
      (x) => x.id === param.saveInto
    );

    if (find) {
      this.newConditon['saveValueInto'] = param.saveInto;
      if (this.newConditon['hasOperator']) {
        this.newConditon['posiblesOperators'] = this.operators.filter((x) => {
          return x.posible.includes(find.type); // type of parameter where save value
        });
      }
      this.setCondition(list);
    } else {
      this.confirmationService.confirm({
        message:
          'La variable que asignaron para guardar el valor no existe, por favor contacte al administrador.',
        header: 'Error',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Aceptar',
        rejectVisible: false,
      });
    }
  }

  /**
   * save the condition into array and reset variables
   */
  setCondition(list) {
    if (this.newConditon['isChildren']) {
      let childCondition = new ParentCondition();
      let children = { ...this.newConditon };

      children.isChildren = false;
      childCondition.operator = 'or';
      childCondition.isChildren = true;

      if (!childCondition.children) {
        childCondition.children = [];
      }

      childCondition.children.push(children);
      list.children = [...list.children, childCondition];
    } else {
      list.children = [...list.children, this.newConditon];
    }
    this.newConditon = new ParentCondition();
    this.conditionsValuesFiltered = [];
    this.parameterFiltered = [];
    this.conditionsValuesVariablesFiltered = [];
  }

  /**
   * filters
   * @param event
   */
  filterConditions(event) {
    this.unomiConditions = this.unomiConditionsBck.filter((x) =>
      x.id.toUpperCase().includes(event.target.value.toUpperCase())
    );
  }

  /**
   * filters
   * @param event
   */
  filterConditionsValues(event) {
    this.conditionsValuesFiltered = this.conditionsValuesFilteredBck.filter(
      (x) => x.id.toUpperCase().includes(event.target.value.toUpperCase())
    );
  }
}
