import { Model } from 'mongoose';
import {
  PropertiesUnomi,
  PropertiesUnomiDocument,
} from './entities/properties-unomi.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/entity.repository';

@Injectable()
export class PropertiesUnomiRepository extends EntityRepository<PropertiesUnomiDocument> {
  constructor(
    @InjectModel(PropertiesUnomi.name)
    propertiesUnomiModel: Model<PropertiesUnomiDocument>,
  ) {
    super(propertiesUnomiModel);
  }
}
