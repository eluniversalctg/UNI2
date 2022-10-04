import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TemplateDocument = Template & Document;

@Schema()
export class Template {
  _id: string;

  @Prop({ required: true, unique: false })
  htmlContent: string;

  @Prop({ required: true, unique: false })
  state: boolean;

  @Prop({ required: true, unique: false })
  title: string;

  @Prop({ required: true, unique: false })
  numNews: number;

  @Prop({ required: true, unique: false })
  imagePreview: string;

  @Prop({ required: true, unique: false })
  typeTemplate: string;

  @Prop({ required: true, unique: false })
  inUse: boolean;
}
export const TemplateSchema = SchemaFactory.createForClass(Template);
