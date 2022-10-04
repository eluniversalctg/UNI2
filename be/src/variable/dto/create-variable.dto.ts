import { ApiProperty } from '@nestjs/swagger';

export class CreateVariableDto {
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

  @ApiProperty()
  readonly saveInto: string;

  @ApiProperty()
  readonly isActive: boolean;
}
