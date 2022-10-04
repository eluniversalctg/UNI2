import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WidgetsService } from './widgets.service';
import { WidgetsController } from './widgets.controller';
import { WidgetsRepository } from './widgets.repository';
import { Widget, WidgetSchema } from './entities/widget.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Widget.name, schema: WidgetSchema }]),
  ],
  controllers: [WidgetsController],
  providers: [WidgetsService, WidgetsRepository],
})
export class WidgetsModule {}
