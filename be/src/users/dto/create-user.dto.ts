import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/roles/entities/role.entity';

export class CreateUserDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly firtSurname: string;

  @ApiProperty()
  readonly secondSurname: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  roles: Role;
}
