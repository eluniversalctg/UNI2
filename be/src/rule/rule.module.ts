import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RuleService } from './rule.service';
import { Utilities } from 'src/utils/utilities';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { RuleController } from './rule.controller';
import { Rule, RuleSchema } from './entities/rule.entity';
import { Segment, SegmentSchema } from './entities/segment.entity';
import { RuleRepository, SegmentRepository } from './rule.repository';
import { ActivityLogModule } from 'src/activity-log/activity-log.module';

@Module({
  imports: [
    HttpModule,
    ActivityLogModule,
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{ name: Rule.name, schema: RuleSchema }]),
    MongooseModule.forFeature([{ name: Segment.name, schema: SegmentSchema }]),
  ],
  exports: [RuleService],
  controllers: [RuleController],
  providers: [RuleService, Utilities, RuleRepository, SegmentRepository],
})
export class RuleModule {}
