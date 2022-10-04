import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TemplatePersonalization } from 'src/template-personalization/entities/template-personalization.entity';

export type PersonalizationDocument = Personalization & Document;

@Schema()
export class Personalization {
  _id: string;

  @Prop({ required: true, unique: false })
  name: string;
  @Prop({ required: true, unique: false })
  template: TemplatePersonalization;
  @Prop({ required: true, unique: false })
  condition: string;
  @Prop({ default: true, unique: false })
  isActive: boolean;
}

export const PersonalizationSchema =
  SchemaFactory.createForClass(Personalization);
