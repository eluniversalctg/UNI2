import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { Utilities } from 'src/utils/utilities';
import { ActionsService } from './actions.service';
import { ActionsController } from './actions.controller';

@Module({
  imports: [HttpModule],
  controllers: [ActionsController],
  providers: [ActionsService, Utilities],
})
export class ActionsModule {}
