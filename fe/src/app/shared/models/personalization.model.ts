import { Template } from './template.model';

export class Personalization {
  _id?: string;
  name: string;
  title?: string;
  template: Template;
  isActive?: boolean;
  condition: string;
  typeTemplate?: string;
}
