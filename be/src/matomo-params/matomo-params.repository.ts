import { Model } from 'mongoose';
import {
  MatomoParam,
  MatomoParamDocument,
} from './entities/matomo-param.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/entity.repository';

@Injectable()
export class MatomoParamRepository extends EntityRepository<MatomoParamDocument> {
  constructor(
    @InjectModel(MatomoParam.name) matomoParamModel: Model<MatomoParamDocument>,
  ) {
    super(matomoParamModel);
  }
}
