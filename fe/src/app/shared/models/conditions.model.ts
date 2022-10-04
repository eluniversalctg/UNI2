import { Metadata, Variable } from './index';
export class Condition {
  description?: string;
  id?: string;
  name?: string;
  metadata: Metadata = new Metadata();
  conditionEvaluator?: string;
  queryBuilder?: string;
  parameters: Variable[];
  parentCondition: parentCondition | void | null;
  treeParentCondition: string;
  conditionId?: string;
}

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
