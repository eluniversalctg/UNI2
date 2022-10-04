import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './entities/role.entity';
import { EntityRepository } from 'src/database/entity.repository';

@Injectable()
export class RolesRepository extends EntityRepository<RoleDocument> {
  constructor(@InjectModel(Role.name) roleModel: Model<RoleDocument>) {
    super(roleModel);
  }
}
