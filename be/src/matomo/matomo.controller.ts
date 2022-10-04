import {
  Get,
  Put,
  Body,
  Post,
  Param,
  Delete,
  Controller,
  UseGuards,
} from '@nestjs/common';
import { MatomoService } from './matomo.service';
import { Tags } from './entities/matomoTags.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiCreatedResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('matomo')
@ApiTags('matomo')
export class MatomoController {
  constructor(private readonly matomoService: MatomoService) {}

  @Get()
  getList() {
    const data = this.matomoService.getList();
    return data;
  }

  @Get('/tags/:params')
  getMatomoInfo(@Param('params') params: string) {
    const data = this.matomoService.getMatomoInfo(params);
    return data;
  }

  @Post()
  @ApiCreatedResponse({ type: Tags })
  async createTag(@Body() createTagDto: CreateTagDto) {
    return await this.matomoService.createTag(createTagDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.matomoService.delete(id);
  }

  @Put()
  async update(@Body() updateRoleDto: UpdateTagDto) {
    return await this.matomoService.update(updateRoleDto._id, updateRoleDto);
  }
}
