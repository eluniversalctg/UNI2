import {
  Condition,
  parameterValues,
  ParentCondition,
  parentCondition,
} from '../models';
import { genWord, MessagesTst } from '../enums';
import { HttpClient } from '@angular/common/http';
import { ResourceService } from './resource.service';
import { EventEmitter, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
@Injectable()
export class ConditionsService extends ResourceService<Condition> {
  reloadConditionEvent: EventEmitter<any> = new EventEmitter();
  verifyConditionEvent: EventEmitter<any> = new EventEmitter();
  emmitObject: EventEmitter<any> = new EventEmitter();

  constructor(
    private msg: MessageService,
    protected override httpClient: HttpClient
  ) {
    super(httpClient);
  }
  getResourceUrl(): string {
    return 'conditions';
  }

  reloadCondition() {
    this.reloadConditionEvent.emit(true);
  }

  verifyCondition() {
    this.verifyConditionEvent.emit(true);
  }

  sendCondition(condition) {
    this.emmitObject.emit(condition);
  }
  /**
   * create boolean condition Object
   * @param value ParentCondition
   * @returns booleanConditionOBJ
   */
  createBooleanConditionObj(value: ParentCondition[]) {
    try {
      // create new parentCondition
      let condition = new parentCondition();

      if (value) {
        // will always be a boolean condition
        condition.type = genWord.BOOLEANCONDITION;
        condition[genWord.PARAMETERVALUES] = new parameterValues();
        if (!value[0] || (value[0] && !value[0].operator)) {
          throw new Error(MessagesTst.OPERATOR_REQUIRED);
        }
        condition[genWord.PARAMETERVALUES].operator = value[0].operator || '';
        condition[genWord.PARAMETERVALUES][genWord.SUBCONDITIONS] = [];

        for (let i = 0; i < value.length; i++) {
          const element = value[i];

          //if children, create boolean condition
          if (element.children) {
            condition[genWord.PARAMETERVALUES][genWord.SUBCONDITIONS].push(
              this.createBooleanConditionObj(element.children)
            );
          } else {
            // create object of condition
            let obj = {};
            obj['type'] = element.conditionId;
            obj['parameterValues'] = {};
            if (element['variable'] !== 'Seleccionar Condición') {
              obj['parameterValues'][element['variable']] = element['value']
                ? element['value']
                : element['selectedValue'];
            }
            if (!element['value'] || !element['selectedValue']) {
              throw new Error(genWord.NOVAL);
            }

            // validate if replace values
            if (
              element['saveValueInto'] &&
              element['variable'] !== element['saveValueInto']
            ) {
              obj['parameterValues'][element['saveValueInto']] =
                element['selectedValue'];
            } else if (element['variable'] !== 'Seleccionar Condición') {
              obj['parameterValues'][element['variable']] =
                element['selectedValue'];
            }

            // validate if has operator so save into variable that includes 'operator'
            if (element['hasOperator']) {
              if (!element['operatorCondition']) {
                throw new Error(genWord.NOOPERATOR);
              }
              obj['parameterValues'][element['saveOperatorInto']] =
                element['operatorCondition'];
            }

            condition[genWord.PARAMETERVALUES][genWord.SUBCONDITIONS].push(obj);
          }
        }
      }

      return condition;
    } catch (error) {
      if (error instanceof Error) {
        this.msg.add({
          severity: MessagesTst.ERROR,
          summary: error.message,
        });
      }
      return null;
    }
  }
}
