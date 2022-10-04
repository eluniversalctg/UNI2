import { PartialType } from '@nestjs/swagger';
import { CreateMatomoParamDto } from './create-matomo-param.dto';

export class UpdateMatomoParamDto extends PartialType(CreateMatomoParamDto) {}
