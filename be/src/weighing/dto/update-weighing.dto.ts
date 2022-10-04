import { ApiProperty } from '@nestjs/swagger';
import { DataWeighing } from './dataWeighting.model';

export class UpdateWeighingDto {
  @ApiProperty()
  readonly _id: string;
  @ApiProperty()
  readonly title: DataWeighing;
  @ApiProperty()
  readonly summary: DataWeighing;
  @ApiProperty()
  readonly body: DataWeighing;
  @ApiProperty()
  readonly topic: DataWeighing;
  @ApiProperty()
  readonly altPhoto: DataWeighing;
  @ApiProperty()
  readonly url: DataWeighing;
}
