import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Block, BlockDocument } from './entities/block.entity';
import { EntityRepository } from 'src/database/entity.repository';

@Injectable()
export class BlocksRepository extends EntityRepository<BlockDocument> {
  constructor(@InjectModel(Block.name) pageModel: Model<BlockDocument>) {
    super(pageModel);
  }
}
