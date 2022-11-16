import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import {
  ProfileAnalitic,
  ProfileAnaliticSchema,
} from './entities/profile-analitic.entity';
import { Utilities } from 'src/utils/utilities';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileAnaliticService } from './profile-analitic.service';
import { ProfileAnaliticController } from './profile-analitic.controller';
import { ProfileAnaliticRepository } from './profile-analitic.repository';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: ProfileAnalitic.name, schema: ProfileAnaliticSchema },
    ]),
  ],
  controllers: [ProfileAnaliticController],
  providers: [ProfileAnaliticRepository, ProfileAnaliticService, Utilities],
})
export class ProfileAnaliticModule {}
