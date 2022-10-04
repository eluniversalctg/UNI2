import { ParentCondition } from '../../models';
import { ConfirmationService } from 'primeng/api';
import { ConditionsService, RuleService } from '../../services';
import {
  Input,
  Output,
  Component,
  EventEmitter,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'app-sharedConditions',
  templateUrl: './sharedConditions.component.html',
  styleUrls: ['./sharedConditions.component.scss'],
})
export class SharedConditionsComponent implements OnChanges {
  @Input() schema: ParentCondition[];
  @Input() unomiConditions: any[];
  @Input() conditionVariables: any[];
  @Output() childEvent = new EventEmitter();

  operators: any[] = [];
  conditionsValuesFiltered: any[] = [];
  parameterFiltered: any[] = [];
  variables: any[] = [];
  newConditon: ParentCondition = new ParentCondition();
  conditionsValuesFilteredBck: any[] = [];
  unomiConditionsBck: any[] = [];
  conditionsValuesVariablesFiltered: any[] = [];
  conditionsValuesVariablesFilteredBck: any[] = [];
  activeGroup: boolean = false;
  response: object = {};

  constructor(
    private ruleSrv: RuleService,
    private conditionSrv: ConditionsService,
    private confirmationService: ConfirmationService,
  ) {
    this.confirmationService.close();
    this.conditionSrv.reloadConditionEvent.subscribe(() => {
      this.childEvent.emit(JSON.stringify(this.schema));
      this.unomiConditions = this.unomiConditionsBck.filter((x) =>
        x.id.toUpperCase().includes('')
      );
      this.response = {};
    });
    this.conditionSrv.verifyConditionEvent.subscribe(() => {
      this.verifyCondition();
    });

    this.operators = this.ruleSrv.getOperators();
  }
  ngOnChanges() {
    this.confirmationService.close();
    this.response  = {};
    if (this.unomiConditions && this.unomiConditions.length > 0) {
      this.unomiConditionsBck = [...this.unomiConditions];
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
    } else {
      let noVar = {
        id: 'Seleccionar Condición',
        type: '',
        multivalued: false,
        defaultValue: '',
      };
      this.conditionsValuesFiltered = [...this.conditionsValuesFiltered, noVar];
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
  setValuesOfParameter(value) {
    //search if parameter has values
    let parameter = this.conditionVariables.find((x) => x.id === value.id);

    this.newConditon['variable'] = value.id;
    this.newConditon['multivalued'] = value.multivalued;
    this.newConditon['operator'] = 'or';
    this.newConditon['variableType'] = value.type.toLowerCase();

    if (parameter) {
      this.parameterFiltered = parameter.optionValues;
    } else {
      this.setCondition();
    }
  }

  /**
   * set values of parameters
   * @param param
   */
  filterValuesToVariable(param) {
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
      this.setCondition();
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
  setCondition() {
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
      this.schema = [...this.schema, childCondition];
    } else {
      this.schema = [...this.schema, this.newConditon];
    }

    this.newConditon = new ParentCondition();
    this.conditionsValuesFiltered = [];
    this.parameterFiltered = [];
    this.conditionsValuesVariablesFiltered = [];
  }

  filterConditions(event) {
    this.unomiConditions = this.unomiConditionsBck.filter((x) =>
      x.id.toUpperCase().includes(event.target.value.toUpperCase())
    );
  }

  filterConditionsValues(event) {
    this.conditionsValuesFiltered = this.conditionsValuesFilteredBck.filter(
      (x) => x.id.toUpperCase().includes(event.target.value.toUpperCase())
    );
  }

  verifyCondition() {
    let objectCondition = {
      offset: 0,
      limit: 5,
      condition: this.conditionSrv.createBooleanConditionObj(this.schema),
    };
    this.ruleSrv.addByURL('verify/Condition', objectCondition).subscribe({
      next: (data) => (this.response = data),
      error: (err) => (this.response = { error: err.statusText }),
    });
  }

  isEmpty(obj) {
    if (obj !== null && Object.keys(obj).length === 0) {
      return true;
    } else {
      return false;
    }
  }
}
