import { Document } from 'mongoose';
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
}

export const BlockSchema = SchemaFactory.createForClass(Block);
