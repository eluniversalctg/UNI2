import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  pages: any[];

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  routerLink: string;
}
