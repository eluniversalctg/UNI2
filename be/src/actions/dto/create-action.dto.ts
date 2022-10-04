import { ApiProperty } from '@nestjs/swagger';
import { Metadata } from 'src/conditions/dto/metadata.model';
import { CreateVariableDto } from 'src/variable/dto/create-variable.dto';

export class CreateActionDto {
  @ApiProperty()
  readonly metadata: Metadata;
  @ApiProperty()
  readonly actionExecutor: string;
  @ApiProperty()
  readonly parameters: CreateVariableDto[];
}
