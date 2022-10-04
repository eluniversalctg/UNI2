import { ApiProperty } from '@nestjs/swagger';

export class RelatedCromaDto {
  @ApiProperty()
  readonly id: string;
  @ApiProperty()
  readonly years: number;
  @ApiProperty()
  readonly months: number;
  @ApiProperty()
  readonly days: number;
  @ApiProperty()
  readonly radius: number;
}
