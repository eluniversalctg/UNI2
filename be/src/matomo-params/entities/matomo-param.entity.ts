import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type MatomoParamDocument = MatomoParam & Document;

@Schema()
export class MatomoParam {
  _id: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  parameter: string;

  @Prop()
  value: string;
}

export const MatomoParamSchema = SchemaFactory.createForClass(MatomoParam);
