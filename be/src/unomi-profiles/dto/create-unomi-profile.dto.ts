import { ApiProperty } from '@nestjs/swagger';

export class CreateUnomiProfileDto {
  @ApiProperty() readonly consents: any;
  @ApiProperty() readonly itemId: string;
  @ApiProperty() readonly itemType: string;
  @ApiProperty() readonly mergedWith: string;
  @ApiProperty() readonly properties: any;
  @ApiProperty() readonly scores: any;
  @ApiProperty() readonly segments: string[];
  @ApiProperty() readonly systemProperties: any;
}
