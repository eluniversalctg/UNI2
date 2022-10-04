import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  module: string;

  @ApiProperty()
  tag: string;

  @ApiProperty()
  columns: Columns[];

  @ApiProperty()
  customParameters?: CustomParams[];
}

export class Columns {
  @ApiProperty()
  header: string;

  @ApiProperty()
  field: string;
}

export class CustomParams {
  @ApiProperty()
  parameter: string;

  @ApiProperty()
  value: string;
}
