import { ApiProperty } from '@nestjs/swagger';
export class CreatePlaceholderUnomiDto {
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly valueDefault: string;
  @ApiProperty()
  readonly type: string;
  @ApiProperty()
  readonly isActive: boolean;
  @ApiProperty()
  readonly isInUse: boolean;
}
