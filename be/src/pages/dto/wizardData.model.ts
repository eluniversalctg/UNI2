import { Period } from './period.model';
import { Rule } from 'src/rule/entities/rule.entity';
import { Weighing } from 'src/weighing/entities/weighing.entity';
import { Template } from 'src/templates/entities/template.entity';
import { Placeholder } from 'src/placeholders/entities/placeholder.entity';

export class WizardData {
  readonly rule: Rule;
  readonly template: Template;
  readonly newPlaceholder: Placeholder[];
  readonly typeTags?: string;
  readonly cromaType?: string;
  readonly cromaPeriod?: Period;
  readonly matomoPeriod?: Period;
  readonly matomoMetaData?: string;
  readonly typeMetaData?: string;
  readonly matomoTags?: string;
  readonly weighing?: Weighing;
}
