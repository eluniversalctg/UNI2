import { PartialType } from '@nestjs/swagger';
import { CreateUserFieldDto } from './create-user-field.dto';

export class UpdateUserFieldDto extends PartialType(CreateUserFieldDto) {}
