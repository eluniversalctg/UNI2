import { ApiProperty } from '@nestjs/swagger';

export class UpdateTemplateDto {
  @ApiProperty()
  readonly _id: string;
  @ApiProperty()
  readonly htmlContent: string;
  @ApiProperty()
  readonly title: string;
  @ApiProperty()
  readonly state: boolean;
  @ApiProperty()
  readonly numNews: number;
  @ApiProperty()
  readonly imagePreview: string;
  @ApiProperty()
  readonly typeTemplate: string;
  @ApiProperty()
  readonly inUse: boolean;
}
