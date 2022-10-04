import { ApiProperty } from '@nestjs/swagger';

export class UpdateImageDto {
  @ApiProperty()
  readonly _id: string;
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly url: string;
}
