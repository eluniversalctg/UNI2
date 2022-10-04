import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PlaceholderUnomiDocument = PlaceholderUnomi & Document;

@Schema()
export class PlaceholderUnomi {
  _id: string;

  @Prop({ required: true, unique: false })
  name: string;

  @Prop({ default: true, unique: false })
  isActive: boolean;

  @Prop({ default: false, unique: false })
  isInUse: boolean;

  @Prop({ required: true, unique: false })
  valueDefault: string;

  @Prop({ required: false, unique: false })
  type: string;
}
export const PlaceholderUnomiSchema =
  SchemaFactory.createForClass(PlaceholderUnomi);
