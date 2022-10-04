import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/entity.repository';
import {
  ActivityLog,
  ActivityLogDocument,
} from './entities/activity-log.entity';

@Injectable()
export class ActivityLogRepository extends EntityRepository<ActivityLogDocument> {
  constructor(
    @InjectModel(ActivityLog.name) activityLogModel: Model<ActivityLogDocument>,
  ) {
    super(activityLogModel);
  }
}
