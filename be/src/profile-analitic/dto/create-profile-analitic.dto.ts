import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileAnaliticDto {
  @ApiProperty()
  readonly quantity: number;
  @ApiProperty()
  readonly date?: Date;
}
