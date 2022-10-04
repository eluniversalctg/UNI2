import { ApiProperty } from '@nestjs/swagger';

export class CreateWidgetDto {
  readonly _id: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly description: boolean;

  @ApiProperty()
  readonly url: string;
}
