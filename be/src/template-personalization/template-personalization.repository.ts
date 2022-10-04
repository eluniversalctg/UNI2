import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  TemplatePersonalization,
  TemplatePersonalizationDocument,
} from './entities/template-personalization.entity';
import { EntityRepository } from 'src/database/entity.repository';

@Injectable()
export class TemplatePersonalizationRepository extends EntityRepository<TemplatePersonalizationDocument> {
  constructor(
    @InjectModel(TemplatePersonalization.name)
    templatePersonalizationModel: Model<TemplatePersonalizationDocument>,
  ) {
    super(templatePersonalizationModel);
  }
}
