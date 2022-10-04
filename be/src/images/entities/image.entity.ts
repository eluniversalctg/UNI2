import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ImageDocument = Image & Document;

@Schema()
export class Image {
  _id: string;

  @Prop({ required: true, unique: false })
  name: string;

  @Prop({ required: true, unique: false })
  url: string;
}
export const ImageSchema = SchemaFactory.createForClass(Image);
