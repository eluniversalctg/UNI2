import { Model } from 'mongoose';
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { EntityRepository } from "src/database/entity.repository";
import { Variable, VariableDocument } from "./entities/variable.entity";

@Injectable()
export class VariableRepository extends EntityRepository<VariableDocument> {
  constructor(@InjectModel(Variable.name) variableModel: Model<VariableDocument>) {
    super(variableModel);
  }
}