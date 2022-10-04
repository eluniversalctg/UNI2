import { ApiProperty } from '@nestjs/swagger';

export class RenderizationDto {
  @ApiProperty()
  template: string;
  @ApiProperty()
  sessionId: string;
  @ApiProperty()
  OpenGraph?: object;
  @ApiProperty()
  JSONLD?: object;
}