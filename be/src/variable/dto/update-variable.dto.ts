import { ApiProperty } from '@nestjs/swagger';

export class UpdateVariableDto {
  @ApiProperty()
  readonly _id: string;

  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly type: string;

  @ApiProperty()
  readonly multivalued: boolean;

  @ApiProperty()
  readonly defaultValue: string;

  @ApiProperty()
  readonly optionValues: any[];
}
