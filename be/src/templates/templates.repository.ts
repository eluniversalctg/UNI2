import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/entity.repository';
import { Template, TemplateDocument } from './entities/template.entity';

@Injectable()
export class TemplateRepository extends EntityRepository<TemplateDocument> {
  constructor(
    @InjectModel(Template.name) templateModel: Model<TemplateDocument>,
  ) {
    super(templateModel);
  }
}
