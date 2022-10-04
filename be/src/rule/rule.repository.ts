import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/entity.repository';
import { Rule, RuleDocument } from './entities/rule.entity';
import { Segment, SegmentDocument } from './entities/segment.entity';

@Injectable()
export class RuleRepository extends EntityRepository<RuleDocument> {
  constructor(@InjectModel(Rule.name) ruleModel: Model<RuleDocument>) {
    super(ruleModel);
  }
}
export class SegmentRepository extends EntityRepository<SegmentDocument> {
  constructor(@InjectModel(Segment.name) segmentModel: Model<SegmentDocument>) {
    super(segmentModel);
  }
}
