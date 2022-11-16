import { PartialType } from '@nestjs/swagger';
import { CreateProfileAnaliticDto } from './create-profile-analitic.dto';

export class UpdateProfileAnaliticDto extends PartialType(CreateProfileAnaliticDto) {}
