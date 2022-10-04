import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Utilities } from 'src/utils/utilities';
import { UnomiProfilesService } from './unomi-profiles.service';
import { UnomiProfilesController } from './unomi-profiles.controller';
import { ActivityLogModule } from 'src/activity-log/activity-log.module';

@Module({
  imports: [HttpModule, ActivityLogModule],
  controllers: [UnomiProfilesController],
  providers: [UnomiProfilesService, ConfigService, Utilities],
})
export class UnomiProfilesModule {}
