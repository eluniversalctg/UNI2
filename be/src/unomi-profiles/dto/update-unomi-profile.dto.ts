import { PartialType } from '@nestjs/swagger';
import { CreateUnomiProfileDto } from './create-unomi-profile.dto';

export class UpdateUnomiProfileDto extends PartialType(CreateUnomiProfileDto) {}
