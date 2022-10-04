import { ApiProperty } from '@nestjs/swagger';

export class CreateTemplatePersonalizationDto {
  @ApiProperty()
  readonly htmlContent: string;
  @ApiProperty()
  readonly title: string;
  @ApiProperty()
  readonly state: boolean;
  @ApiProperty()
  readonly imagePreview: string;
  @ApiProperty()
  readonly high: number;
  @ApiProperty()
  readonly width: number;
  @ApiProperty()
  readonly typeTemplate: string;
  @ApiProperty()
  readonly inUse: boolean;
  @ApiProperty()
  readonly numNews: number;
}
