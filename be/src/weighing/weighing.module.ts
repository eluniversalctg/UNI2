import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WeighingService } from './weighing.service';
import { WeighingRepository } from './weighing.repository';
import { WeighingController } from './weighing.controller';
import { Weighing, WeighingSchema } from './entities/weighing.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Weighing.name, schema: WeighingSchema },
    ]),
  ],
  controllers: [WeighingController],
  providers: [WeighingService, WeighingRepository],
  exports: [WeighingService, WeighingRepository],
})
export class WeighingModule {}
