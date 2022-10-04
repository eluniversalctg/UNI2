import { ApiProperty } from '@nestjs/swagger';
import { TemplatePersonalization } from 'src/template-personalization/entities/template-personalization.entity';

export class CreatePersonalizationDto {
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly template: TemplatePersonalization;
  @ApiProperty()
  readonly condition: string;
  @ApiProperty()
  readonly isActive: boolean;
}
