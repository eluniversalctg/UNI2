import { Model } from 'mongoose';
import {
  PlaceholderUnomi,
  PlaceholderUnomiDocument,
} from './entities/placeholder-unomi.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/entity.repository';

@Injectable()
export class PlaceholderUnomiRepository extends EntityRepository<PlaceholderUnomiDocument> {
  constructor(
    @InjectModel(PlaceholderUnomi.name)
    placeholderUnomiModel: Model<PlaceholderUnomiDocument>,
  ) {
    super(placeholderUnomiModel);
  }
}
