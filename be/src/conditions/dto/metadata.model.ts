import { ApiProperty } from '@nestjs/swagger';

export class Metadata {
  @ApiProperty()
  readonly id: string;
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly description: string;
  @ApiProperty()
  readonly tags: string[];
  @ApiProperty()
  readonly systemTags: string[];
}
