import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DomainDocument = Domain & Document;
@Schema()
export class Domain {
  _id: string;
  @Prop()
  name: string;
  @Prop()
  domain: string;
  @Prop()
  idSite: number;
  @Prop()
  matomoUrl: string;
  @Prop()
  cromaUrl: string;
}
export const DomainSchema = SchemaFactory.createForClass(Domain);
