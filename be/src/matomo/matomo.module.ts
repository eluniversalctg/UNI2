import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MatomoService } from './matomo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MatomoRepository } from './matomo.repository';
import { MatomoController } from './matomo.controller';
import { Tags, TagsSchema } from './entities/matomoTags.entity';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Tags.name, schema: TagsSchema }]),
  ],
  controllers: [MatomoController],
  providers: [MatomoService, MatomoRepository],
  exports: [MatomoService],
})
export class MatomoModule {}
