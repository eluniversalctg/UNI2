import {
  Put,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Controller,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MatomoParamsService } from './matomo-params.service';
import { CreateMatomoParamDto } from './dto/create-matomo-param.dto';
import { UpdateMatomoParamDto } from './dto/update-matomo-param.dto';

@Controller('matomoParams')
@ApiBearerAuth()
@ApiTags('matomoParams')
@UseGuards(JwtAuthGuard)
export class MatomoParamsController {
  constructor(private readonly matomoParamsService: MatomoParamsService) {}

  @Post()
  create(@Body() createMatomoParamDto: CreateMatomoParamDto) {
    return this.matomoParamsService.create(createMatomoParamDto);
  }

  @Get()
  findAll() {
    return this.matomoParamsService.findAll();
  }

  @Put()
  update(@Body() updateMatomoParamDto: UpdateMatomoParamDto) {
    return this.matomoParamsService.update(updateMatomoParamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matomoParamsService.remove(id);
  }
}
