import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type RuleDocument = Rule & Document;

@Schema()
export class Rule {
  _id: string;

  @Prop({ required: true, unique: false })
  id: string;

  @Prop({ required: true, unique: false })
  type: string;

  @Prop({ required: true, unique: false })
  condition: string;

  @Prop({ required: true, unique: false })
  secCondition?: string;

  @Prop({ required: false, unique: false })
  raiseEventOnlyOnceForProfile?: boolean;

  @Prop({ required: false, unique: false })
  raiseEventOnlyOnceForSession?: boolean;

  @Prop({ required: false, unique: false })
  cost?: number;

  @Prop({ required: false, unique: false })
  currency?: string;

  @Prop({ required: false, unique: false })
  timezone?: string;

  @Prop({ required: false, unique: false })
  startDate?: Date;

  @Prop({ required: false, unique: false })
  endDate?: Date;
  
  @Prop({ required: false, unique: false })
  priority?: number;
}

export const RuleSchema = SchemaFactory.createForClass(Rule);
