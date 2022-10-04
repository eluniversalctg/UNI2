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
