import { PartialType } from '@nestjs/swagger';
import { CreateCromaDto } from './create-croma.dto';

export class UpdateCromaDto extends PartialType(CreateCromaDto) {}
