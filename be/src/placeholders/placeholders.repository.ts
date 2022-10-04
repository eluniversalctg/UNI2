import { Model } from 'mongoose';
import {
  Placeholder,
  PlaceholderDocument,
} from './entities/placeholder.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/entity.repository';

@Injectable()
export class PlaceholderRepository extends EntityRepository<PlaceholderDocument> {
  constructor(
    @InjectModel(Placeholder.name) placeholderModel: Model<PlaceholderDocument>,
  ) {
    super(placeholderModel);
  }
}
