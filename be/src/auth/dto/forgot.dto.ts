import { ApiProperty } from '@nestjs/swagger';

export class ForgotDto {
  @ApiProperty()
  readonly hostInfo: string;

  @ApiProperty()
  readonly username: string;
}
