import { Blocks } from './blocks.model';
import { Rule, Personalization } from './';
import { Placeholders, Weighing } from 'src/app/shared/models';

export class WizardModel {
  block: Blocks;
  stepsData: WizardData[];
  iframe: string;
  divId?: string;
}

export class WizardData {
  rule: Rule;
  template: Personalization;
  newPlaceholder: Placeholders[];
  typeTags?: string;
  cromaType?: string;
  cromaPeriod?: Period;
  matomoPeriod?: Period;
  matomoMetaData?: string;
  typeMetaData?: string;
  matomoTags?: string;
  weighing?: Weighing;
}

export class Period {
  year: number;
  month: number;
  day: number;
  radius?: number;
}
