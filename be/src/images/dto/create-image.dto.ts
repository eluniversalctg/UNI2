import { ApiProperty } from '@nestjs/swagger';
export class CreateImageDto {
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly url: string;
}
