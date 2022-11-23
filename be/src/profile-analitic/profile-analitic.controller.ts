import { Controller, Post, Body } from '@nestjs/common';
import { ProfileAnaliticService } from './profile-analitic.service';

@Controller('profile-analitic')
export class ProfileAnaliticController {
  constructor(
    private readonly profileAnaliticService: ProfileAnaliticService,
  ) {}

  @Post()
  findAll(@Body() filter) {
    return this.profileAnaliticService.findAll(filter);
  }
}
