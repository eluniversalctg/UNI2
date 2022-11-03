import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UnomiProfilesService } from './unomi-profiles.service';
import { CreateUnomiProfileDto } from './dto/create-unomi-profile.dto';
import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('unomi-profiles')
@Controller('unomi-profiles')
export class UnomiProfilesController {
  constructor(private readonly unomiProfilesService: UnomiProfilesService) {}

  @Post()
  create(@Body() createUnomiProfileDto: CreateUnomiProfileDto) {
    return this.unomiProfilesService.create(createUnomiProfileDto);
  }

  @Post('/search')
  findAll(@Body() conditionReq) {
    return this.unomiProfilesService.findAll(conditionReq);
  }

  @Get('/:id')
  findSessions(@Param('id') id: string) {
    return this.unomiProfilesService.findSessions(id);
  }

  @Post('/batchProfiles')
  batchProfiles(@Body() conditionReq) {
    return this.unomiProfilesService.batchProfiles(conditionReq);
  }

  @Post('/profiles/count')
  getCountProfiles(@Body() condition) {
    return this.unomiProfilesService.getCountProfiles(condition);
  }
}
