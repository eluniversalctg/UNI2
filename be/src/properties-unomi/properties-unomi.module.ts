import { Module } from '@nestjs/common';
import {
  PropertiesUnomi,
  PropertiesUnomiSchema,
} from './entities/properties-unomi.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertiesUnomiService } from './properties-unomi.service';
import { PropertiesUnomiController } from './properties-unomi.controller';
import { PropertiesUnomiRepository } from './properties-unomi.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PropertiesUnomi.name, schema: PropertiesUnomiSchema },
    ]),
  ],
  controllers: [PropertiesUnomiController],
  providers: [PropertiesUnomiService, PropertiesUnomiRepository],
})
export class PropertiesUnomiModule {}
