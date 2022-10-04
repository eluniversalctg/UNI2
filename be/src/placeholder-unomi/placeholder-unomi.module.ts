import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaceholderUnomiService } from './placeholder-unomi.service';
import { PlaceholderUnomiController } from './placeholder-unomi.controller';
import { PlaceholderUnomiRepository } from './placeholder-unomi.repository';
import {
  PlaceholderUnomi,
  PlaceholderUnomiSchema,
} from './entities/placeholder-unomi.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PlaceholderUnomi.name, schema: PlaceholderUnomiSchema },
    ]),
  ],
  exports: [PlaceholderUnomiService, PlaceholderUnomiRepository],
  controllers: [PlaceholderUnomiController],
  providers: [PlaceholderUnomiService, PlaceholderUnomiRepository],
})
export class PlaceholderUnomiModule { }
