import { ApiProperty } from '@nestjs/swagger';
import { Domain } from 'src/domains/entities/domain.entity';
import { DataWeighing } from './dataWeighting.model';

export class CreateWeighingDto {
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
  @ApiProperty()
  readonly site: Domain;
}
