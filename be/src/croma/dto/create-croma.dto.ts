import { ApiProperty } from '@nestjs/swagger';

export class CreateCromaDto {
  @ApiProperty()
  readonly id: number;
  @ApiProperty()
  readonly title: { rendered: string };
  @ApiProperty()
  readonly excerpt: { rendered: string };
  @ApiProperty()
  readonly content: { rendered: string };
  @ApiProperty()
  readonly date: Date;
  @ApiProperty()
  link: string;
  @ApiProperty()
  readonly author: string;
}
