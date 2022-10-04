import { ApiProperty } from '@nestjs/swagger';

export class CreateUserFieldDto {
  @ApiProperty()
  readonly _id?: string;
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly group: string;
  @ApiProperty()
  readonly type: string;
  @ApiProperty()
  readonly isRequired: boolean;
  @ApiProperty()
  readonly canModifier: boolean;
  @ApiProperty()
  readonly massiveEdition: boolean;
  @ApiProperty()
  readonly isActive: boolean;
}
