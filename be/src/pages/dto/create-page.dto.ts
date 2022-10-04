import { WizardModel } from './wizard.model';
import { ApiProperty } from '@nestjs/swagger';
import { CreateDomainDto } from 'src/domains/dto/create-domain.dto';

export class CreatePageDto {
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly typeSection: string;
  @ApiProperty()
  readonly children: CreatePageDto[];
  @ApiProperty()
  readonly route: string;
  @ApiProperty()
  readonly site: CreateDomainDto;
  @ApiProperty()
  readonly isActive: boolean;
  @ApiProperty()
  readonly wizardModel: WizardModel[];
}


