import { Document, SchemaTypes } from 'mongoose';
import { Domain } from 'src/domains/entities/domain.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BlockDocument = Block & Document;

@Schema()
export class Block {
  _id?: string;
  @Prop({ required: true, unique: false })
  name: string;
  @Prop({ required: true, unique: false })
  sizes: string[];
  @Prop({ required: true, unique: false })
  isActive?: boolean;
  @Prop({ required: false, unique: false })
  inUse?: boolean;
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Domain', required: true, unique: false, autopopulate: true })
  site: Domain
}

export const BlockSchema = SchemaFactory.createForClass(Block);
