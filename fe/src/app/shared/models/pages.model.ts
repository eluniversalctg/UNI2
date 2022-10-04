import { Domains,WizardModel } from 'src/app/shared/models';

export class Pages {
  _id?: string;
  name: string;
  typeSection: string;
  children?: Pages[];
  route: string;
  site: Domains;
  isActive?: boolean;
  wizardModel?:WizardModel[]
  level?: number;
}
