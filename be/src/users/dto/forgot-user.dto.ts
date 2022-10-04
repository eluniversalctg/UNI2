import { ApiProperty } from '@nestjs/swagger';

export class ForgotUserDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  resetPasswordToken: string;

  @ApiProperty()
  resetPasswordExpires: number;
}
