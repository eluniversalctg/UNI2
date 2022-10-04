import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertiesUnomiDto {
  @ApiProperty()
  readonly label: string;
  @ApiProperty()
  readonly valueDefault: string;
  @ApiProperty()
  readonly isActive: boolean;
}
