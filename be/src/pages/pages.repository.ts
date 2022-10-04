import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Page, PageDocument } from './entities/page.entity';
import { EntityRepository } from 'src/database/entity.repository';

@Injectable()
export class PageRepository extends EntityRepository<PageDocument> {
  constructor(@InjectModel(Page.name) pageModel: Model<PageDocument>) {
    super(pageModel);
  }
}
