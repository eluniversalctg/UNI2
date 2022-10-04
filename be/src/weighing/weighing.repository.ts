import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/entity.repository';
import { Weighing, WeighingDocument } from './entities/weighing.entity';

@Injectable()
export class WeighingRepository extends EntityRepository<WeighingDocument> {
  constructor(
    @InjectModel(Weighing.name) weighingModel: Model<WeighingDocument>,
  ) {
    super(weighingModel);
  }
}
