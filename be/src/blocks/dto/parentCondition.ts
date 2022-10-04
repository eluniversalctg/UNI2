export class subCondition {
  type: string | undefined;
  parameterValues: any;
}

export class parentCondition {
  type: string;
  parameterValues: parameterValues;
}

export class parameterValues {
  subCondition: subCondition[];
  operator: string;
  eventTypeId?: string;
}

export class ParentCondition {
  conditionId: string;
  variable: string;
  multivalued: boolean;
  values?: any[];
  value?: string;
  selectedValue?: any;
  operator?: string;
  hasOperator?: boolean;
  operatorCondition?: string;
  variableType?: string;
  inputType?: string;
  posiblesOperators?: any[];
  children?: ParentCondition[];
  saveOperatorInto?: string;
  saveValueInto?: string;
  isChildren?: boolean;
}

export enum genWord {
  BOOLEANCONDITION = 'booleanCondition',
  PARAMETERVALUES = 'parameterValues',
  SUBCONDITIONS = 'subConditions',
}
