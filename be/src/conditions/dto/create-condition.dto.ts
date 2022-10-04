import { Metadata } from './metadata.model';
import { ApiProperty } from '@nestjs/swagger';
import { CreateVariableDto } from 'src/variable/dto/create-variable.dto';

export class CreateConditionDto {
  @ApiProperty()
  readonly metadata: Metadata;
  @ApiProperty()
  readonly conditionEvaluator: string;
  @ApiProperty()
  readonly queryBuilder: string;
  @ApiProperty()
  readonly parameters: CreateVariableDto[];
  @ApiProperty()
  readonly parentCondition: any[];
  @ApiProperty()
  treeParentCondition: string;
}
