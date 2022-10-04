import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/roles/entities/role.entity';
import { IsEmail, IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  readonly _id: string;

  @ApiProperty()
  @IsOptional()
  password: string;

  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  username: string;

  @ApiProperty()
  @IsOptional()
  readonly firtSurname: string;

  @ApiProperty()
  @IsOptional()
  readonly secondSurname: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  readonly isActive: boolean;

  @ApiProperty()
  @IsOptional()
  readonly roles: Role;
}
