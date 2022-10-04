import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Tags, TagsDocument } from './entities/matomoTags.entity';
import { EntityRepository } from 'src/database/entity.repository';

@Injectable()
export class MatomoRepository extends EntityRepository<TagsDocument> {
  constructor(@InjectModel(Tags.name) roleModel: Model<TagsDocument>) {
    super(roleModel);
  }
}
