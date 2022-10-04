import { Actions, Condition, Metadata } from './';

export class Rule {
  metadata: Metadata;
  description?: string;
  id?: string;
  name?: string;
  condition: Condition;
  actions: Actions;
}
