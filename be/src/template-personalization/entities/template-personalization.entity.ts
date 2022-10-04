import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TemplatePersonalizationDocument = TemplatePersonalization &
  Document;

@Schema()
export class TemplatePersonalization {
  _id: string;

  @Prop({ required: true, unique: false })
  htmlContent: string;

  @Prop({ required: true, unique: false })
  state: boolean;

  @Prop({ required: true, unique: false })
  title: string;

  @Prop({ required: false, unique: false })
  imagePreview: string;

  @Prop({ required: false, unique: false })
  high: number;

  @Prop({ required: false, unique: false })
  width: number;

  @Prop({ required: true, unique: false })
  inUse: boolean;

  @Prop({ required: false, unique: false })
  typeTemplate: string;

  @Prop({ required: false, unique: false })
  numNews: number;
}

export const TemplatePersonalizationSchema = SchemaFactory.createForClass(
  TemplatePersonalization,
);
