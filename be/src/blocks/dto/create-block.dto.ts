import { ApiProperty } from '@nestjs/swagger';
import { Domain } from 'src/domains/entities/domain.entity';

export class CreateBlockDto {
  @ApiProperty()
  readonly _id?: string;
  @ApiProperty()
  readonly name: string;
  @ApiProperty()
  readonly sizes: string[];
  @ApiProperty()
  readonly isActive?: boolean;
  @ApiProperty()
  readonly inUse?: boolean;
  @ApiProperty()
  readonly site?: Domain;
}
