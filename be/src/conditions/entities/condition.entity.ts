import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type ConditionDocument = Condition & Document;

@Schema()
export class Condition {
  _id: string;
  @Prop()
  conditionId: string;
  @Prop()
  name: string;
  @Prop()
  conditionEvaluator: string;
  @Prop()
  queryBuilder: string;
  @Prop()
  treeParentCondition: string;
  @Prop()
  hasParentCondition: boolean;
}

export const ConditionSchema = SchemaFactory.createForClass(Condition);
