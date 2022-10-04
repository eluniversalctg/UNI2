import { ApiProperty } from '@nestjs/swagger';

export class UpdatePropertiesUnomiDto {
  @ApiProperty()
  readonly _id: string;
  @ApiProperty()
  readonly label: string;
  @ApiProperty()
  readonly valueDefault: string;
  @ApiProperty()
  readonly isActive: boolean;
}
