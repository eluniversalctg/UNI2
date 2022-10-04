import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PlaceholderDocument = Placeholder & Document;

@Schema()
export class Placeholder {
  _id: string;

  @Prop({ required: true, unique: false })
  name: string;

  @Prop({ required: true, unique: false })
  type: string;

  @Prop({ required: false, unique: false })
  typesMetaData: string;

  @Prop({ required: false, unique: false })
  required: boolean;

  @Prop({ required: false, unique: false })
  valueDefault: string;

  @Prop({ default: true, unique: false })
  isActive: boolean;
}
export const PlaceholderSchema = SchemaFactory.createForClass(Placeholder);
