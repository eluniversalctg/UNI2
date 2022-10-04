import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type VariableDocument = Variable & Document;

@Schema()
export class Variable {
  _id: string;

  @Prop({ required: true, unique: false })
  id: string;

  @Prop({ required: true, unique: false })
  type: string;

  @Prop({ required: true, unique: false })
  multivalued: boolean;

  @Prop({ required: false, unique: false })
  defaultValue: string;

  @Prop({ required: false, unique: false })
  optionValues: any[];

  @Prop({ required: false, unique: false })
  saveInto: string;

  @Prop({ required: false, unique: false })
  isActive: boolean;
}

export const VariableSchema = SchemaFactory.createForClass(Variable);
