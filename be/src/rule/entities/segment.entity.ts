import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SegmentDocument = Segment & Document;

@Schema()
export class Segment {
  _id: string;

  @Prop({ required: false, unique: false })
  idSegement: string;

  @Prop({ required: false, unique: false })
  dateSegement: Date;

  @Prop({ required: false, unique: false })
  count: number;
}

export const SegmentSchema = SchemaFactory.createForClass(Segment);
