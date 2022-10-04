import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Condition, ConditionDocument } from './entities/condition.entity';
import { EntityRepository } from 'src/database/entity.repository';

@Injectable()
export class ConditionRepository extends EntityRepository<ConditionDocument> {
  constructor(
    @InjectModel(Condition.name) conditionModel: Model<ConditionDocument>,
  ) {
    super(conditionModel);
  }
}
