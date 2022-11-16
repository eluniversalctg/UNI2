import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProfileAnaliticDocument = ProfileAnalitic & Document;

@Schema()
export class ProfileAnalitic {
  _id: string;

  @Prop({ required: true, unique: false })
  quantity: number;

  @Prop({ required: false, unique: false, default: new Date() })
  date: Date;
}

export const ProfileAnaliticSchema =
  SchemaFactory.createForClass(ProfileAnalitic);
