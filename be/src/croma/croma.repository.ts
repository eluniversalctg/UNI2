import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article, ArticleDocument } from './entities/croma.entity';
import { EntityRepository } from 'src/database/entity.repository';

@Injectable()
export class CromaRepository extends EntityRepository<ArticleDocument> {
  constructor(@InjectModel(Article.name) articleModel: Model<ArticleDocument>) {
    super(articleModel);
  }
}
