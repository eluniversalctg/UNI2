import { Options } from './';

export class Variable {
  _id?: string;
  id: string;
  type: string;
  multivalued: boolean;
  isActive: boolean;
  defaultValue?: string | null;
  optionValues?: optionValues[];
}

export class optionValues {
  value: string;
  options: Options[] | string[];
}
