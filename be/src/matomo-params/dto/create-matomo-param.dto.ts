import { ApiProperty } from '@nestjs/swagger';

export class CreateMatomoParamDto {
  readonly _id: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly parameter: string;

  @ApiProperty()
  readonly value: string;
}
