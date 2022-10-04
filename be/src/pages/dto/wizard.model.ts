import { WizardData } from './wizardData.model';
import { Block } from 'src/blocks/entities/block.entity';

export class WizardModel {
  readonly block: Block;
  readonly stepsData: WizardData[];
  readonly iframe: string;
  readonly divId: string;
}
