import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EntityRepository } from 'src/database/entity.repository';
import { Domain, DomainDocument } from './entities/domain.entity';

@Injectable()
export class DomainRepository extends EntityRepository<DomainDocument> {
  constructor(@InjectModel(Domain.name) domainModel: Model<DomainDocument>) {
    super(domainModel);
  }
}
