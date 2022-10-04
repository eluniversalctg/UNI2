import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PropertiesUnomiDocument = PropertiesUnomi & Document;

@Schema()
export class PropertiesUnomi {
  _id: string;

  @Prop({ required: true, unique: false })
  label: string;

  @Prop({ default: true, unique: false })
  isActive: boolean;

  @Prop({ required: true, unique: false })
  valueDefault: string;
}

export const PropertiesUnomiSchema =
  SchemaFactory.createForClass(PropertiesUnomi);
