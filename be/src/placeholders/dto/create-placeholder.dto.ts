import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaceholderDto {
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
