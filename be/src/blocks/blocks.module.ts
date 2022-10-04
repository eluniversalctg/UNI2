import { Module } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PagesModule } from 'src/pages/pages.module';
import { BlocksController } from './blocks.controller';
import { BlocksRepository } from './blocks.repository';
import { Block, BlockSchema } from './entities/block.entity';
import { WeighingModule } from 'src/weighing/weighing.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Block.name, schema: BlockSchema }]),
    PagesModule,
    WeighingModule,
  ],
  controllers: [BlocksController],
  providers: [BlocksService, BlocksRepository],
})
export class BlocksModule {}
