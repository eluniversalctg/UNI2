import { ApiProperty } from '@nestjs/swagger';

export class ResetUserDto {
  @ApiProperty()
  readonly token: string;

  @ApiProperty()
  readonly password: string;
}
