import { Document } from 'mongoose';
import { DataWeighing } from '../dto/dataWeighting.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type WeighingDocument = Weighing & Document;

@Schema()
export class Weighing {
  _id: string;

  @Prop({ required: true, unique: false })
  readonly title: DataWeighing;

  @Prop({ required: true, unique: false })
  readonly summary: DataWeighing;

  @Prop({ required: true, unique: false })
  readonly body: DataWeighing;

  @Prop({ required: true, unique: false })
  readonly topic: DataWeighing;

  @Prop({ required: true, unique: false })
  readonly altPhoto: DataWeighing;

  @Prop({ required: true, unique: false })
  readonly url: DataWeighing;
}

export const WeighingSchema = SchemaFactory.createForClass(Weighing);
