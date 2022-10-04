import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { Utilities } from 'src/utils/utilities';
import { MongooseModule } from '@nestjs/mongoose';
import { ConditionsService } from './conditions.service';
import { ConditionRepository } from './conditions.repository';
import { ConditionsController } from './conditions.controller';
import { Condition, ConditionSchema } from './entities/condition.entity';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Condition.name, schema: ConditionSchema },
    ]),
  ],
  controllers: [ConditionsController],
  providers: [ConditionsService, Utilities, ConditionRepository],
})
export class ConditionsModule {}
