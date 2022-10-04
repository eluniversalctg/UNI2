import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type WidgetDocument = Widget & Document;
@Schema()
export class Widget {
  _id: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  url: string;
}
export const WidgetSchema = SchemaFactory.createForClass(Widget);
