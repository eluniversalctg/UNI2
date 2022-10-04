import { WizardModel } from './wizard.model';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePageDto {
  @ApiProperty()
  readonly _id: string;
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly typeSection: string;
  @ApiProperty()
  readonly father: string;
  @ApiProperty()
  readonly children: boolean;
  @ApiProperty()
  readonly route: string;
  @ApiProperty()
  readonly site: string;
  @ApiProperty()
  readonly isActive: boolean;
  @ApiProperty()
  readonly wizardModel: WizardModel[];
}
