import { ApiProperty } from '@nestjs/swagger';

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
}
