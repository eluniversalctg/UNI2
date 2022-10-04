import { ApiProperty } from '@nestjs/swagger';

export class UpdatePlaceholderDto {
  @ApiProperty()
  readonly _id: string;
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly type: string;
  @ApiProperty()
  readonly typesMetaData: string;
  @ApiProperty()
  readonly required: boolean;
  @ApiProperty()
  readonly valueDefault: string;
  @ApiProperty()
  readonly isActive: boolean;
}
